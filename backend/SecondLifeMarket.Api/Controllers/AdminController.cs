// On importe l'autorisation.
using Microsoft.AspNetCore.Authorization;

// On importe les outils pour créer un contrôleur API.
using Microsoft.AspNetCore.Mvc;

// On importe les outils JSON.
using System.Text.Json;

// On importe les objets JSON modifiables.
using System.Text.Json.Nodes;

// On place le contrôleur dans le namespace Controllers.
namespace SecondLifeMarket.Api.Controllers;

// On indique que cette classe est un contrôleur API.
[ApiController]

// On définit la route de base : api/Admin.
[Route("api/[controller]")]

// On protège tout le contrôleur pour les administrateurs seulement.
[Authorize(Roles = "Administrateur")]
public class AdminController : ControllerBase
{
    // On stocke la configuration de l'application.
    private readonly IConfiguration _configuration;

    // On crée le constructeur du contrôleur.
    public AdminController(IConfiguration configuration)
    {
        // On garde la configuration dans une variable privée.
        _configuration = configuration;
    }

    // On vérifie si l'analyse IA automatique est activée ou désactivée.
    [HttpGet("ia/activation")]
    public IActionResult GetIaActivation()
    {
        // On lit le réglage depuis appsettings.Development.json.
        bool active = _configuration.GetValue<bool>("OpenAI:AnalyseAutomatiqueActive");

        // On retourne l'état actuel.
        return Ok(new
        {
            analyseAutomatiqueActive = active
        });
    }

    // On active ou désactive l'analyse IA automatique.
    [HttpPut("ia/activation/{active}")]
    public async Task<IActionResult> UpdateIaActivation(bool active)
    {
        // On prépare le chemin vers appsettings.Development.json.
        string filePath = Path.Combine(Directory.GetCurrentDirectory(), "appsettings.Development.json");

        // On vérifie si le fichier existe.
        if (!System.IO.File.Exists(filePath))
        {
            // On retourne une erreur si le fichier est absent.
            return BadRequest(new { message = "Le fichier appsettings.Development.json est introuvable." });
        }

        // On lit le contenu du fichier.
        string json = await System.IO.File.ReadAllTextAsync(filePath);

        // On transforme le JSON en objet modifiable.
        JsonObject root = JsonNode.Parse(json)!.AsObject();

        // On récupère la section OpenAI si elle existe.
        JsonObject openAi = root["OpenAI"]?.AsObject() ?? new JsonObject();

        // On modifie l'état de l'analyse automatique.
        openAi["AnalyseAutomatiqueActive"] = active;

        // On remet la section OpenAI dans le fichier.
        root["OpenAI"] = openAi;

        // On prépare les options d'écriture JSON.
        JsonSerializerOptions options = new()
        {
            // On garde le fichier bien formaté.
            WriteIndented = true
        };

        // On réécrit le fichier appsettings.Development.json.
        await System.IO.File.WriteAllTextAsync(filePath, root.ToJsonString(options));

        // On retourne un message de succès.
        return Ok(new
        {
            analyseAutomatiqueActive = active,
            message = active ? "Analyse IA automatique activée." : "Analyse IA automatique désactivée."
        });
    }
}