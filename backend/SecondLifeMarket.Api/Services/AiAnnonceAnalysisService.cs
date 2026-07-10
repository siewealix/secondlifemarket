// On importe les outils HTTP.
using System.Net.Http.Headers;

// On importe les outils de texte.
using System.Text;

// On importe les outils JSON.
using System.Text.Json;

// On importe les DTOs IA.
using SecondLifeMarket.Api.DTOs.Ai;

// On importe les helpers.
using SecondLifeMarket.Api.Helpers;

// On importe les interfaces.
using SecondLifeMarket.Api.Services.Interfaces;

// On place ce fichier dans le namespace Services.
namespace SecondLifeMarket.Api.Services;

// On crée le service d'analyse IA.
public class AiAnnonceAnalysisService : IAiAnnonceAnalysisService
{
    // On stocke le client HTTP.
    private readonly HttpClient _httpClient;

    // On stocke la configuration.
    private readonly IConfiguration _configuration;

    // On crée le constructeur.
    public AiAnnonceAnalysisService(HttpClient httpClient, IConfiguration configuration)
    {
        // On garde le client HTTP.
        _httpClient = httpClient;

        // On garde la configuration.
        _configuration = configuration;
    }

    // On analyse une annonce avec l'IA.
    public async Task<AnalyseAnnonceIaResponseDto> AnalyseAsync(AnalyseAnnonceIaRequestDto dto)
    {
        // On valide les textes contre le XSS.
        ValidateTexts(dto);

        // On récupère la clé API uniquement depuis appsettings.
        string apiKey = _configuration["OpenAI:ApiKey"] ?? string.Empty;

        // On vérifie si la clé est absente.
        if (string.IsNullOrWhiteSpace(apiKey))
        {
            // On bloque l'appel IA.
            throw new InvalidOperationException("La clé API OpenAI est absente dans appsettings.");
        }

        // On récupère le modèle uniquement depuis appsettings.
        string model = _configuration["OpenAI:Model"] ?? string.Empty;

        // On vérifie si le modèle est absent.
        if (string.IsNullOrWhiteSpace(model))
        {
            // On bloque l'appel IA.
            throw new InvalidOperationException("Le modèle OpenAI est absent dans appsettings.");
        }

        // On construit le prompt texte.
        string prompt = BuildPrompt(dto);

        // On prépare la liste des contenus envoyés à l'IA.
        List<object> contentItems = new();

        // On ajoute le texte.
        contentItems.Add(new
        {
            type = "input_text",
            text = prompt
        });

        // On ajoute chaque image.
        foreach (string photoDataUrl in dto.PhotoDataUrls)
        {
            // On ajoute une image au contenu.
            contentItems.Add(new
            {
                type = "input_image",
                image_url = photoDataUrl
            });
        }

        // On prépare la requête envoyée à OpenAI.
        object payload = new
        {
            // On choisit le modèle.
            model = model,

            // On donne le rôle global de l'IA.
            instructions = "Tu es un système de contrôle de fiabilité pour une plateforme de vente d'objets d'occasion. Tu réponds uniquement avec un JSON valide.",

            // On envoie le texte et les images.
            input = new[]
            {
                new
                {
                    role = "user",
                    content = contentItems
                }
            },

            // On limite la longueur de la réponse.
            max_output_tokens = 700,

            // On évite de stocker la réponse côté API.
            store = false
        };

        // On transforme la requête en JSON.
        string jsonPayload = JsonSerializer.Serialize(payload);

        // On crée la requête HTTP.
        using HttpRequestMessage request = new(HttpMethod.Post, "https://api.openai.com/v1/responses");

        // On ajoute la clé API.
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);

        // On ajoute le contenu JSON.
        request.Content = new StringContent(jsonPayload, Encoding.UTF8, "application/json");

        // On envoie la requête.
        using HttpResponseMessage response = await _httpClient.SendAsync(request);

        // On lit la réponse brute.
        string jsonResponse = await response.Content.ReadAsStringAsync();

        // On vérifie si l'appel a échoué.
        if (!response.IsSuccessStatusCode)
        {
            // On retourne une erreur simple.
            throw new InvalidOperationException("Impossible d'analyser l'annonce avec l'IA.");
        }

        // On extrait le texte retourné par l'IA.
        string outputText = ExtractOutputText(jsonResponse);

        // On nettoie le JSON retourné.
        string cleanJson = CleanJson(outputText);

        // On prépare les options JSON.
        JsonSerializerOptions options = new()
        {
            PropertyNameCaseInsensitive = true
        };

        // On transforme le JSON en DTO.
        AnalyseAnnonceIaResponseDto? result = JsonSerializer.Deserialize<AnalyseAnnonceIaResponseDto>(cleanJson, options);

        // On vérifie si le résultat est invalide.
        if (result == null)
        {
            // On bloque si la réponse IA est inutilisable.
            throw new InvalidOperationException("La réponse IA est invalide.");
        }

        // On normalise la décision IA.
        result.DecisionIa = NormalizeDecision(result.DecisionIa);

        // On limite le score entre 0 et 100.
        result.ScoreConfiance = Math.Clamp(result.ScoreConfiance, 0, 100);

        // On retourne le résultat.
        return result;
    }

    // On valide les textes de l'annonce.
    private static void ValidateTexts(AnalyseAnnonceIaRequestDto dto)
    {
        // On valide le titre.
        XssProtectionHelper.ValidateText(dto.Titre, "titre");

        // On valide la description.
        XssProtectionHelper.ValidateText(dto.Description, "description");

        // On valide la ville.
        XssProtectionHelper.ValidateText(dto.Ville, "ville");

        // On valide l'état de l'objet.
        XssProtectionHelper.ValidateText(dto.EtatObjet, "état de l'objet");

        // On valide la catégorie.
        XssProtectionHelper.ValidateText(dto.NomCategorie, "catégorie");
    }

    // On construit le prompt IA.
    private static string BuildPrompt(AnalyseAnnonceIaRequestDto dto)
    {
        return $$"""
Tu es un assistant de modération pour une plateforme appelée SecondLife Market.

Ton rôle :
Tu dois aider à publier les annonces normales, mais tu dois bloquer les annonces où les photos ne correspondent clairement pas à l'objet annoncé.

Règle principale :
Par défaut, tu peux choisir "Publier".
Mais si les photos montrent clairement un objet différent du titre, de la description ou de la catégorie, tu dois obligatoirement choisir "ReexamenAdmin".

Données de l'annonce :
Titre : {{dto.Titre}}
Description : {{dto.Description}}
Prix : {{dto.Prix}} FCFA
Ville : {{dto.Ville}}
État déclaré de l'objet : {{dto.EtatObjet}}
Catégorie : {{dto.NomCategorie}}
Nombre de photos : {{dto.PhotoDataUrls.Count}}

Tu dois analyser :
1. Le titre.
2. La description.
3. Le prix.
4. La catégorie.
5. Les photos envoyées.
6. La cohérence entre les photos et l'objet annoncé.

Règles de décision :

Publier si :
- Le texte est simple mais compréhensible.
- Les photos montrent probablement le bon objet.
- Le prix est un peu bas ou un peu élevé, mais pas extrêmement incohérent.
- L'annonce manque de détails, mais ne semble pas frauduleuse.
- Il y a seulement un doute léger ou moyen.

ReexamenAdmin obligatoire si :
- Le titre annonce un téléphone mais les photos montrent une chaise, une table, un vêtement ou un autre objet différent.
- Le titre annonce un meuble mais les photos montrent un téléphone, un vêtement ou un autre objet différent.
- La catégorie ne correspond clairement pas aux photos.
- Les photos semblent volontairement trompeuses.
- Le prix est extrêmement irréaliste avec d'autres signes suspects.
- Plusieurs signes suspects apparaissent ensemble.

Très important :
Une annonce sans photo ne doit pas être bloquée automatiquement.
Une annonce courte ne doit pas être bloquée automatiquement.
Une annonce avec quelques fautes ne doit pas être bloquée automatiquement.
Une annonce avec un prix avantageux ne doit pas être bloquée automatiquement.
Mais une annonce avec une photo clairement différente doit aller en réexamen admin.

Score :
100 = annonce très fiable.
0 = annonce très suspecte.
Si les photos ne correspondent clairement pas, le score doit être inférieur à 40.
Si les photos correspondent, le score peut être supérieur ou égal à 40.

Réponds uniquement avec ce JSON valide :
{
  "decisionIa": "Publier",
  "scoreConfiance": 80,
  "motif": "Motif court de la décision.",
  "correspondancePhotos": true
}

Règles JSON :
- decisionIa doit être exactement "Publier" ou "ReexamenAdmin".
- correspondancePhotos doit être true si les photos correspondent à l'annonce.
- correspondancePhotos doit être false si les photos montrent clairement un autre objet.
- Si correspondancePhotos est false, decisionIa doit obligatoirement être "ReexamenAdmin".
- scoreConfiance doit être entre 0 et 100.
""";
    }

    // On normalise la décision retournée par l'IA.
    private static string NormalizeDecision(string decision)
    {
        // On vérifie si la décision est Publier.
        if (decision.Equals("Publier", StringComparison.OrdinalIgnoreCase))
        {
            // On retourne Publier.
            return "Publier";
        }

        // On vérifie si la décision est ReexamenAdmin.
        if (decision.Equals("ReexamenAdmin", StringComparison.OrdinalIgnoreCase))
        {
            // On retourne ReexamenAdmin.
            return "ReexamenAdmin";
        }

        // Par sécurité, toute décision inconnue part en réexamen admin.
        return "ReexamenAdmin";
    }

    // On extrait le texte généré par l'IA.
    private static string ExtractOutputText(string jsonResponse)
    {
        // On lit le JSON.
        using JsonDocument document = JsonDocument.Parse(jsonResponse);

        // On récupère la racine.
        JsonElement root = document.RootElement;

        // On vérifie si output_text existe.
        if (root.TryGetProperty("output_text", out JsonElement outputText))
        {
            // On retourne output_text.
            return outputText.GetString() ?? string.Empty;
        }

        // On vérifie si output existe.
        if (!root.TryGetProperty("output", out JsonElement output))
        {
            // On bloque si output est absent.
            throw new InvalidOperationException("La réponse IA ne contient pas output.");
        }

        // On parcourt output.
        foreach (JsonElement outputItem in output.EnumerateArray())
        {
            // On vérifie si content existe.
            if (!outputItem.TryGetProperty("content", out JsonElement content)) continue;

            // On parcourt content.
            foreach (JsonElement contentItem in content.EnumerateArray())
            {
                // On vérifie si text existe.
                if (contentItem.TryGetProperty("text", out JsonElement text))
                {
                    // On retourne le texte.
                    return text.GetString() ?? string.Empty;
                }
            }
        }

        // On bloque si aucun texte n'est trouvé.
        throw new InvalidOperationException("La réponse IA ne contient aucun texte.");
    }

    // On nettoie le JSON retourné par l'IA.
    private static string CleanJson(string text)
    {
        // On enlève les espaces.
        string clean = text.Trim();

        // On enlève le markdown json.
        clean = clean.Replace("```json", string.Empty);

        // On enlève le markdown simple.
        clean = clean.Replace("```", string.Empty);

        // On cherche le début du JSON.
        int start = clean.IndexOf('{');

        // On cherche la fin du JSON.
        int end = clean.LastIndexOf('}');

        // On garde seulement l'objet JSON.
        if (start >= 0 && end >= start)
        {
            // On coupe autour du JSON.
            clean = clean.Substring(start, end - start + 1);
        }

        // On retourne le JSON nettoyé.
        return clean.Trim();
    }
}