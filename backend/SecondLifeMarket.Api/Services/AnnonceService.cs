// On importe Entity Framework Core.
using Microsoft.EntityFrameworkCore;

// On importe le contexte de base de données.
using SecondLifeMarket.Api.Data;

// On importe les DTOs des annonces.
using SecondLifeMarket.Api.DTOs.Annonces;

// On importe les helpers.
using SecondLifeMarket.Api.Helpers;

// On importe les modèles.
using SecondLifeMarket.Api.Models;

// On importe l'interface.
using SecondLifeMarket.Api.Services.Interfaces;

// On importe l'environnement web.
using Microsoft.AspNetCore.Hosting;

// On importe les fichiers envoyés depuis un formulaire.
using Microsoft.AspNetCore.Http;
using SecondLifeMarket.Api.DTOs.Ai;

// On place ce fichier dans le namespace Services.
namespace SecondLifeMarket.Api.Services;

// On crée le service des annonces.
public class AnnonceService : IAnnonceService
{
    // On stocke le contexte de base de données.
    private readonly ApplicationDbContext _context;

    // On stocke l'environnement web.
    private readonly IWebHostEnvironment _environment;

    // On stocke le service d'analyse IA.
    private readonly IAiAnnonceAnalysisService _aiService;

    // On stocke la configuration.
    private readonly IConfiguration _configuration;

    // On crée le constructeur du service.
    public AnnonceService(
        ApplicationDbContext context,
        IWebHostEnvironment environment,
        IAiAnnonceAnalysisService aiService,
        IConfiguration configuration)
    {
        // On garde le contexte.
        _context = context;

        // On garde l'environnement web.
        _environment = environment;

        // On garde le service IA.
        _aiService = aiService;

        // On garde la configuration.
        _configuration = configuration;
    }

    // On récupère les annonces publiques.
    public async Task<List<AnnonceDto>> GetPublicAnnoncesAsync()
    {
        // On charge les annonces actives et disponibles.
        List<Annonce> annonces = await _context.Annonces
            .Include(annonce => annonce.Utilisateur)
            .Include(annonce => annonce.Categorie)
            .Include(annonce => annonce.Photos)
            .Where(annonce => annonce.EstActive && annonce.Statut == "Disponible")
            .OrderByDescending(annonce => annonce.DatePublication)
            .ToListAsync();

        // On transforme les annonces en DTOs.
        return annonces.Select(ToDto).ToList();
    }

    // On récupère une annonce par son id.
    public async Task<AnnonceDto?> GetAnnonceByIdAsync(int id)
    {
        // On cherche l'annonce dans la base.
        Annonce? annonce = await _context.Annonces
            .Include(item => item.Utilisateur)
            .Include(item => item.Categorie)
            .Include(item => item.Photos)
            .FirstOrDefaultAsync(item => item.Id == id && item.EstActive && item.Statut == "Disponible");

        // On retourne null si l'annonce n'existe pas.
        if (annonce == null) return null;

        // On retourne le DTO.
        return ToDto(annonce);
    }

    // On récupère les annonces du membre connecté.
    public async Task<List<AnnonceDto>> GetMyAnnoncesAsync(int utilisateurId)
    {
        // On charge les annonces de l'utilisateur.
        List<Annonce> annonces = await _context.Annonces
            .Include(annonce => annonce.Utilisateur)
            .Include(annonce => annonce.Categorie)
            .Include(annonce => annonce.Photos)
            .Where(annonce => annonce.UtilisateurId == utilisateurId)
            .OrderByDescending(annonce => annonce.DatePublication)
            .ToListAsync();

        // On transforme les annonces en DTOs.
        return annonces.Select(ToDto).ToList();
    }

    // On crée une annonce.
    public async Task<AnnonceDto> CreateAnnonceAsync(CreateAnnonceDto dto, int utilisateurId)
    {
        // On valide les textes.
        ValidateAnnonceTexts(dto.Titre, dto.Description, dto.Ville, dto.EtatObjet);

        // On nettoie le titre.
        string titre = XssProtectionHelper.CleanText(dto.Titre);

        // On nettoie la description.
        string description = XssProtectionHelper.CleanText(dto.Description);

        // On nettoie la ville.
        string ville = XssProtectionHelper.CleanText(dto.Ville);

        // On nettoie l'état de l'objet.
        string etatObjet = XssProtectionHelper.CleanText(dto.EtatObjet);

        // On vérifie le titre.
        if (string.IsNullOrWhiteSpace(titre)) throw new InvalidOperationException("Le titre est obligatoire.");

        // On vérifie la description.
        if (string.IsNullOrWhiteSpace(description)) throw new InvalidOperationException("La description est obligatoire.");

        // On vérifie la ville.
        if (string.IsNullOrWhiteSpace(ville)) throw new InvalidOperationException("La ville est obligatoire.");

        // On vérifie l'état de l'objet.
        if (string.IsNullOrWhiteSpace(etatObjet)) throw new InvalidOperationException("L'état de l'objet est obligatoire.");

        // On vérifie le prix.
        if (dto.Prix <= 0) throw new InvalidOperationException("Le prix doit être supérieur à 0.");

        // On vérifie si la catégorie existe.
        bool categoryExists = await _context.Categories.AnyAsync(categorie => categorie.Id == dto.CategorieId && categorie.EstActive);

        // On bloque si la catégorie n'existe pas.
        if (!categoryExists) throw new InvalidOperationException("La catégorie choisie est introuvable ou inactive.");

        // On crée l'annonce.
        Annonce annonce = new()
        {
            // On enregistre le titre.
            Titre = titre,

            // On enregistre la description.
            Description = description,

            // On enregistre le prix.
            Prix = dto.Prix,

            // On enregistre la ville.
            Ville = ville,

            // On enregistre l'état de l'objet.
            EtatObjet = etatObjet,

            // On met le statut par défaut.
            Statut = "En création",

            // On active l'annonce.
            EstActive = true,

            // On enregistre la date.
            DatePublication = DateTime.UtcNow,

            // On relie l'annonce au membre connecté.
            UtilisateurId = utilisateurId,

            // On relie l'annonce à la catégorie.
            CategorieId = dto.CategorieId
        };

        // On ajoute l'annonce dans la base.
        _context.Annonces.Add(annonce);

        // On sauvegarde.
        await _context.SaveChangesAsync();

        // On recharge l'annonce avec ses relations.
        Annonce createdAnnonce = await _context.Annonces
            .Include(item => item.Utilisateur)
            .Include(item => item.Categorie)
            .Include(annonce => annonce.Photos)
            .FirstAsync(item => item.Id == annonce.Id);

        // On retourne l'annonce créée.
        return ToDto(createdAnnonce);
    }

    // On modifie une annonce.
    public async Task<AnnonceDto?> UpdateAnnonceAsync(int id, UpdateAnnonceDto dto, int utilisateurId, string role)
    {
        // On cherche l'annonce.
        Annonce? annonce = await _context.Annonces
            .Include(item => item.Utilisateur)
            .Include(item => item.Categorie)
            .Include(annonce => annonce.Photos)
            .FirstOrDefaultAsync(item => item.Id == id);

        // On retourne null si elle n'existe pas.
        if (annonce == null) return null;

        // On vérifie si l'utilisateur est propriétaire ou administrateur.
        if (annonce.UtilisateurId != utilisateurId && role != "Administrateur")
        {
            // On bloque l'action.
            throw new UnauthorizedAccessException("Vous n'avez pas le droit de modifier cette annonce.");
        }

        // On valide les textes.
        ValidateAnnonceTexts(dto.Titre, dto.Description, dto.Ville, dto.EtatObjet);

        // On nettoie le titre.
        string titre = XssProtectionHelper.CleanText(dto.Titre);

        // On nettoie la description.
        string description = XssProtectionHelper.CleanText(dto.Description);

        // On nettoie la ville.
        string ville = XssProtectionHelper.CleanText(dto.Ville);

        // On nettoie l'état de l'objet.
        string etatObjet = XssProtectionHelper.CleanText(dto.EtatObjet);

        // On nettoie le statut.
        string statut = XssProtectionHelper.CleanText(dto.Statut);

        // On vérifie le titre.
        if (string.IsNullOrWhiteSpace(titre)) throw new InvalidOperationException("Le titre est obligatoire.");

        // On vérifie la description.
        if (string.IsNullOrWhiteSpace(description)) throw new InvalidOperationException("La description est obligatoire.");

        // On vérifie le prix.
        if (dto.Prix <= 0) throw new InvalidOperationException("Le prix doit être supérieur à 0.");

        // On vérifie si la catégorie existe.
        bool categoryExists = await _context.Categories.AnyAsync(categorie => categorie.Id == dto.CategorieId && categorie.EstActive);

        // On bloque si la catégorie n'existe pas.
        if (!categoryExists) throw new InvalidOperationException("La catégorie choisie est introuvable ou inactive.");

        // On met à jour le titre.
        annonce.Titre = titre;

        // On met à jour la description.
        annonce.Description = description;

        // On met à jour le prix.
        annonce.Prix = dto.Prix;

        // On met à jour la ville.
        annonce.Ville = ville;

        // On met à jour l'état de l'objet.
        annonce.EtatObjet = etatObjet;

        // On met à jour le statut.
        annonce.Statut = string.IsNullOrWhiteSpace(statut) ? "En création" : statut;

        // On met à jour la catégorie.
        annonce.CategorieId = dto.CategorieId;

        // On sauvegarde.
        await _context.SaveChangesAsync();

        // On recharge l'annonce avec ses relations.
        Annonce updatedAnnonce = await _context.Annonces
            .Include(item => item.Utilisateur)
            .Include(item => item.Categorie)
            .Include(annonce => annonce.Photos)
            .FirstAsync(item => item.Id == annonce.Id);

        // On retourne l'annonce modifiée.
        return ToDto(updatedAnnonce);
    }

    // On désactive une annonce.
    public async Task<bool> DeleteAnnonceAsync(int id, int utilisateurId, string role)
    {
        // On cherche l'annonce.
        Annonce? annonce = await _context.Annonces.FindAsync(id);

        // On retourne false si elle n'existe pas.
        if (annonce == null) return false;

        // On vérifie si l'utilisateur est propriétaire ou administrateur.
        if (annonce.UtilisateurId != utilisateurId && role != "Administrateur")
        {
            // On bloque l'action.
            throw new UnauthorizedAccessException("Vous n'avez pas le droit de désactiver cette annonce.");
        }

        // On désactive l'annonce.
        annonce.EstActive = false;

        // On met le statut à Supprimée.
        annonce.Statut = "Supprimée";

        // On sauvegarde.
        await _context.SaveChangesAsync();

        // On retourne true.
        return true;
    }

    // On ajoute une photo à une annonce.
    public async Task<PhotoDto> AddPhotoAsync(int annonceId, IFormFile photo, int utilisateurId, string role)
    {
        // On cherche l'annonce avec ses photos.
        Annonce? annonce = await _context.Annonces
            .Include(item => item.Photos)
            .FirstOrDefaultAsync(item => item.Id == annonceId);

        // On bloque si l'annonce n'existe pas.
        if (annonce == null) throw new InvalidOperationException("Annonce introuvable.");

        // On vérifie si l'utilisateur est propriétaire ou administrateur.
        if (annonce.UtilisateurId != utilisateurId && role != "Administrateur")
        {
            // On bloque l'action.
            throw new UnauthorizedAccessException("Vous n'avez pas le droit d'ajouter une photo à cette annonce.");
        }

        // On vérifie si le fichier existe.
        if (photo == null || photo.Length == 0)
        {
            // On bloque si aucun fichier n'est envoyé.
            throw new InvalidOperationException("Veuillez choisir une photo.");
        }

        // On limite la taille à 5 Mo.
        if (photo.Length > 5 * 1024 * 1024)
        {
            // On bloque si la photo est trop lourde.
            throw new InvalidOperationException("La photo ne doit pas dépasser 5 Mo.");
        }

        // On récupère l'extension du fichier.
        string extension = Path.GetExtension(photo.FileName).ToLowerInvariant();

        // On définit les extensions autorisées.
        string[] allowedExtensions = { ".jpg", ".jpeg", ".png", ".webp" };

        // On vérifie l'extension.
        if (!allowedExtensions.Contains(extension))
        {
            // On bloque les formats non autorisés.
            throw new InvalidOperationException("Format autorisé : jpg, jpeg, png ou webp.");
        }

        // On définit les types MIME autorisés.
        string[] allowedContentTypes = { "image/jpeg", "image/png", "image/webp" };

        // On vérifie le type MIME.
        if (!allowedContentTypes.Contains(photo.ContentType))
        {
            // On bloque les fichiers suspects.
            throw new InvalidOperationException("Le fichier envoyé n'est pas une image valide.");
        }

        // On récupère le dossier wwwroot.
        string wwwrootPath = _environment.WebRootPath ?? Path.Combine(_environment.ContentRootPath, "wwwroot");

        // On prépare le dossier des photos d'annonces.
        string uploadFolder = Path.Combine(wwwrootPath, "uploads", "annonces");

        // On crée le dossier s'il n'existe pas.
        Directory.CreateDirectory(uploadFolder);

        // On crée un nom unique pour éviter les conflits.
        string fileName = $"{Guid.NewGuid()}{extension}";

        // On crée le chemin complet du fichier.
        string filePath = Path.Combine(uploadFolder, fileName);

        // On ouvre un flux pour écrire le fichier.
        using FileStream stream = new(filePath, FileMode.Create);

        // On enregistre la photo dans le dossier.
        await photo.CopyToAsync(stream);

        // On prépare l'adresse publique de la photo.
        string url = $"/uploads/annonces/{fileName}";

        // On vérifie si c'est la première photo de l'annonce.
        bool isFirstPhoto = !annonce.Photos.Any();

        // On crée la photo.
        Photo newPhoto = new()
        {
            // On enregistre l'adresse.
            Url = url,

            // La première photo devient principale.
            EstPrincipale = isFirstPhoto,

            // On relie la photo à l'annonce.
            AnnonceId = annonceId,

            // On enregistre la date.
            DateAjout = DateTime.UtcNow
        };

        // On ajoute la photo dans la base de données.
        _context.Photos.Add(newPhoto);

        // On sauvegarde.
        await _context.SaveChangesAsync();

        // On retourne la photo au frontend.
        return new PhotoDto
        {
            // On renvoie l'id.
            Id = newPhoto.Id,

            // On renvoie l'adresse.
            Url = newPhoto.Url,

            // On renvoie l'état principal.
            EstPrincipale = newPhoto.EstPrincipale
        };
    }

    // On supprime une photo d'une annonce.
    public async Task<bool> DeletePhotoAsync(int annonceId, int photoId, int utilisateurId, string role)
    {
        // On cherche l'annonce avec ses photos.
        Annonce? annonce = await _context.Annonces
            .Include(item => item.Photos)
            .FirstOrDefaultAsync(item => item.Id == annonceId);

        // On vérifie si l'annonce existe.
        if (annonce == null)
        {
            // On retourne false si l'annonce est introuvable.
            return false;
        }

        // On vérifie si l'utilisateur est propriétaire ou administrateur.
        if (annonce.UtilisateurId != utilisateurId && role != "Administrateur")
        {
            // On bloque l'action.
            throw new UnauthorizedAccessException("Vous n'avez pas le droit de supprimer cette photo.");
        }

        // On vérifie si l'annonce possède une seule photo.
        if (annonce.Photos.Count <= 1)
        {
            // On bloque la suppression.
            throw new InvalidOperationException("Impossible de supprimer cette photo. Une annonce doit toujours garder au moins une photo.");
        }

        // On cherche la photo à supprimer.
        Photo? photo = annonce.Photos.FirstOrDefault(item => item.Id == photoId);

        // On vérifie si la photo existe.
        if (photo == null)
        {
            // On retourne false si la photo est introuvable.
            return false;
        }

        // On récupère le dossier wwwroot.
        string wwwrootPath = _environment.WebRootPath ?? Path.Combine(_environment.ContentRootPath, "wwwroot");

        // On prépare le chemin relatif du fichier.
        string relativePath = photo.Url.TrimStart('/').Replace("/", Path.DirectorySeparatorChar.ToString());

        // On prépare le chemin complet du fichier.
        string filePath = Path.Combine(wwwrootPath, relativePath);

        // On vérifie si le fichier existe physiquement.
        if (File.Exists(filePath))
        {
            // On supprime le fichier physique.
            File.Delete(filePath);
        }

        // On vérifie si la photo supprimée était la photo principale.
        bool wasMainPhoto = photo.EstPrincipale;

        // On supprime la photo en base.
        _context.Photos.Remove(photo);

        // On sauvegarde d'abord la suppression.
        await _context.SaveChangesAsync();

        // Si la photo supprimée était principale, on choisit une autre photo principale.
        if (wasMainPhoto)
        {
            // On récupère une autre photo de l'annonce.
            Photo? nextPhoto = await _context.Photos
                .FirstOrDefaultAsync(item => item.AnnonceId == annonceId);

            // On vérifie s'il reste une photo.
            if (nextPhoto != null)
            {
                // On la définit comme photo principale.
                nextPhoto.EstPrincipale = true;

                // On sauvegarde.
                await _context.SaveChangesAsync();
            }
        }

        // On indique que la suppression a réussi.
        return true;
    }

    // On finalise la publication d'une annonce.
    public async Task<AnnonceDto?> PublishAnnonceAsync(int id, int utilisateurId, string role)
    {
        // On cherche l'annonce avec toutes ses informations.
        Annonce? annonce = await _context.Annonces
            .Include(item => item.Utilisateur)
            .Include(item => item.Categorie)
            .Include(item => item.Photos)
            .Include(item => item.AnalysesIa)
            .FirstOrDefaultAsync(item => item.Id == id);

        // On retourne null si l'annonce n'existe pas.
        if (annonce == null) return null;

        // On vérifie si l'utilisateur est propriétaire de l'annonce ou administrateur.
        if (annonce.UtilisateurId != utilisateurId && role != "Administrateur")
        {
            // On bloque l'action si l'utilisateur n'a pas le droit.
            throw new UnauthorizedAccessException("Vous n'avez pas le droit de publier cette annonce.");
        }


        // On vérifie si l'annonce est active.
        if (!annonce.EstActive)
        {
            // On bloque la publication si l'annonce est inactive.
            throw new InvalidOperationException("Cette annonce est inactive.");
        }

        // On vérifie si l'annonce possède au moins une photo.
        if (annonce.Photos.Count == 0)
        {
            // On bloque la publication sans photo.
            throw new InvalidOperationException("Une annonce doit avoir au moins une photo avant d'être publiée.");
        }

        // On vérifie si le membre peut encore publier une annonce.
        await VerifierLimitePublicationAsync(annonce.UtilisateurId);

        // On lit le réglage IA depuis appsettings.Development.json.
        bool analyseAutomatiqueActive = _configuration.GetValue<bool>("OpenAI:AnalyseAutomatiqueActive");

        // On vérifie si l'analyse IA est désactivée.
        if (!analyseAutomatiqueActive)
        {
            // On rend l'annonce visible publiquement.
            annonce.Statut = "Disponible";

            // On met à jour la date de publication.
            annonce.DatePublication = DateTime.UtcNow;

            // On sauvegarde les modifications.
            await _context.SaveChangesAsync();

            // On retourne l'annonce publiée.
            return ToDto(annonce);
        }

        // On met l'annonce en analyse.
        annonce.Statut = "En analyse";

        // On sauvegarde le statut temporaire.
        await _context.SaveChangesAsync();

        // On transforme les photos locales en images base64.
        List<string> photoDataUrls = BuildPhotoDataUrls(annonce.Photos);

        // On vérifie si les photos existent en base mais sont illisibles physiquement.
        if (annonce.Photos.Count > 0 && photoDataUrls.Count == 0)
        {
            // On met l'annonce en réexamen admin.
            annonce.Statut = "En réexamen admin";

            // On crée une analyse IA technique.
            AnalyseIa analyseErreurPhoto = new()
            {
                // On enregistre la date de l'analyse.
                DateAnalyse = DateTime.UtcNow,

                // On envoie l'annonce en réexamen admin.
                DecisionIa = "ReexamenAdmin",

                // On met un score faible.
                ScoreConfiance = 0,

                // On explique la raison.
                Motif = "Les photos existent en base, mais elles n'ont pas pu être lues pour l'analyse IA.",

                // On enregistre le modèle configuré.
                VersionModele = _configuration["OpenAI:Model"] ?? string.Empty,

                // On relie l'analyse à l'annonce.
                AnnonceId = annonce.Id
            };

            // On ajoute l'analyse IA en base.
            _context.AnalysesIa.Add(analyseErreurPhoto);

            // On ajoute l'analyse dans la liste locale.
            annonce.AnalysesIa.Add(analyseErreurPhoto);

            // On sauvegarde les changements.
            await _context.SaveChangesAsync();

            // On retourne l'annonce.
            return ToDto(annonce);
        }

        // On prépare les données envoyées à l'IA.
        AnalyseAnnonceIaRequestDto aiRequest = new()
        {
            // On envoie le titre.
            Titre = annonce.Titre,

            // On envoie la description.
            Description = annonce.Description,

            // On envoie le prix.
            Prix = annonce.Prix,

            // On envoie la ville.
            Ville = annonce.Ville,

            // On envoie l'état de l'objet.
            EtatObjet = annonce.EtatObjet,

            // On envoie le nom de la catégorie.
            NomCategorie = annonce.Categorie == null ? "" : annonce.Categorie.Nom,

            // On envoie les vraies photos.
            PhotoDataUrls = photoDataUrls
        };

        // On prépare une variable pour recevoir le résultat IA.
        AnalyseAnnonceIaResponseDto aiResult;

        // On essaie d'analyser l'annonce avec l'IA.
        try
        {
            // On appelle le service IA.
            aiResult = await _aiService.AnalyseAsync(aiRequest);
        }
        catch
        {
            // On met l'annonce en réexamen admin si l'IA échoue.
            annonce.Statut = "En réexamen admin";

            // On crée une analyse IA technique.
            AnalyseIa analyseErreur = new()
            {
                // On enregistre la date de l'analyse.
                DateAnalyse = DateTime.UtcNow,

                // On indique la décision technique.
                DecisionIa = "ReexamenAdmin",

                // On met un score faible.
                ScoreConfiance = 0,

                // On explique l'échec.
                Motif = "L'analyse IA a échoué. L'annonce est envoyée à l'administrateur pour vérification.",

                // On enregistre le modèle configuré.
                VersionModele = _configuration["OpenAI:Model"] ?? string.Empty,

                // On relie l'analyse à l'annonce.
                AnnonceId = annonce.Id
            };

            // On ajoute l'analyse IA en base.
            _context.AnalysesIa.Add(analyseErreur);

            // On ajoute l'analyse dans la liste locale.
            annonce.AnalysesIa.Add(analyseErreur);

            // On sauvegarde les changements.
            await _context.SaveChangesAsync();

            // On retourne l'annonce conservée en base.
            return ToDto(annonce);
        }

        // On vérifie si les photos ne correspondent pas à l'annonce.
        if (!aiResult.CorrespondancePhotos)
        {
            // On force le réexamen admin.
            aiResult.DecisionIa = "ReexamenAdmin";

            // On force un score faible.
            aiResult.ScoreConfiance = Math.Min(aiResult.ScoreConfiance, 30);

            // On explique la raison.
            aiResult.Motif = "L'annonce est envoyée à l'administrateur car les photos ne correspondent pas clairement à l'objet annoncé.";
        }

        // On vérifie si l'IA a été trop sévère alors que les photos correspondent.
        if (aiResult.CorrespondancePhotos && aiResult.DecisionIa == "ReexamenAdmin" && aiResult.ScoreConfiance >= 40)
        {
            // On corrige la décision.
            aiResult.DecisionIa = "Publier";

            // On explique la correction.
            aiResult.Motif = "Annonce publiée automatiquement car le score de fiabilité est acceptable et les photos correspondent à l'objet annoncé.";
        }

        // On récupère le modèle utilisé.
        string model = _configuration["OpenAI:Model"] ?? string.Empty;

        // On crée l'analyse IA à enregistrer.
        AnalyseIa analyseIa = new()
        {
            // On enregistre la date de l'analyse.
            DateAnalyse = DateTime.UtcNow,

            // On enregistre la décision IA.
            DecisionIa = aiResult.DecisionIa,

            // On enregistre le score IA.
            ScoreConfiance = aiResult.ScoreConfiance,

            // On enregistre le motif IA.
            Motif = aiResult.Motif,

            // On enregistre le modèle utilisé.
            VersionModele = model,

            // On relie l'analyse à l'annonce.
            AnnonceId = annonce.Id
        };

        // On ajoute l'analyse IA en base.
        _context.AnalysesIa.Add(analyseIa);

        // On ajoute l'analyse dans la liste locale.
        annonce.AnalysesIa.Add(analyseIa);

        // On vérifie si l'annonce peut être publiée.
        if (aiResult.DecisionIa == "Publier")
        {
            // On rend l'annonce visible publiquement.
            annonce.Statut = "Disponible";

            // On met à jour la date de publication.
            annonce.DatePublication = DateTime.UtcNow;
        }
        else
        {
            // On garde l'annonce enregistrée mais non visible publiquement.
            annonce.Statut = "En réexamen admin";
        }

        // On sauvegarde les changements.
        await _context.SaveChangesAsync();

        // On retourne l'annonce.
        return ToDto(annonce);
    }


    // On récupère les annonces à réexaminer par l'administrateur.
    public async Task<List<AnnonceDto>> GetAdminReviewAnnoncesAsync()
    {
        // On récupère les annonces qui ont le statut de réexamen admin.
        List<Annonce> annonces = await _context.Annonces
            .Include(item => item.Utilisateur)
            .Include(item => item.Categorie)
            .Include(item => item.Photos)
            .Include(item => item.AnalysesIa)
            .Where(item => item.EstActive && item.Statut == "En réexamen admin")
            .OrderByDescending(item => item.DatePublication)
            .ToListAsync();

        // On transforme les annonces en DTO.
        return annonces.Select(ToDto).ToList();
    }

    // L'administrateur valide une annonce en réexamen.
    public async Task<AnnonceDto?> ValidateAnnonceByAdminAsync(int id)
    {
        // On cherche l'annonce.
        Annonce? annonce = await _context.Annonces
            .Include(item => item.Utilisateur)
            .Include(item => item.Categorie)
            .Include(item => item.Photos)
            .Include(item => item.AnalysesIa)
            .FirstOrDefaultAsync(item => item.Id == id);

        // On retourne null si l'annonce n'existe pas.
        if (annonce == null) return null;

        // On vérifie si l'annonce est bien en réexamen admin.
        if (annonce.Statut != "En réexamen admin")
        {
            // On bloque si l'annonce n'est pas en réexamen.
            throw new InvalidOperationException("Cette annonce n'est pas en réexamen admin.");
        }

        // On publie l'annonce.
        annonce.Statut = "Disponible";

        // On met à jour la date de publication.
        annonce.DatePublication = DateTime.UtcNow;

        // On sauvegarde les changements.
        await _context.SaveChangesAsync();

        // On retourne l'annonce.
        return ToDto(annonce);
    }

    // L'administrateur rejette une annonce en réexamen.
    public async Task<AnnonceDto?> RejectAnnonceByAdminAsync(int id)
    {
        // On cherche l'annonce.
        Annonce? annonce = await _context.Annonces
            .Include(item => item.Utilisateur)
            .Include(item => item.Categorie)
            .Include(item => item.Photos)
            .Include(item => item.AnalysesIa)
            .FirstOrDefaultAsync(item => item.Id == id);

        // On retourne null si l'annonce n'existe pas.
        if (annonce == null) return null;

        // On vérifie si l'annonce est bien en réexamen admin.
        if (annonce.Statut != "En réexamen admin")
        {
            // On bloque si l'annonce n'est pas en réexamen.
            throw new InvalidOperationException("Cette annonce n'est pas en réexamen admin.");
        }

        // On rejette l'annonce.
        annonce.Statut = "Rejetée";

        // On sauvegarde les changements.
        await _context.SaveChangesAsync();

        // On retourne l'annonce.
        return ToDto(annonce);
    }

    // Méthode qui vérifie si le membre peut encore publier une annonce.
    private async Task VerifierLimitePublicationAsync(int utilisateurId)
    {
        // Limite gratuite pour un membre sans abonnement.
        const int limiteGratuitePublication = 3;

        // On récupère la date actuelle.
        DateTime now = DateTime.UtcNow;

        // On cherche l'abonnement du membre.
        Abonnement? abonnement = await _context.Abonnements
            .FirstOrDefaultAsync(item => item.UtilisateurId == utilisateurId);

        // On initialise la limite avec la limite gratuite.
        int limitePublication = limiteGratuitePublication;

        // On vérifie si le membre a un abonnement.
        if (abonnement != null)
        {
            // On vérifie si l'abonnement est expiré.
            bool abonnementExpire = abonnement.DateFin < now;

            // Si l'abonnement est expiré et encore actif, on corrige son statut.
            if (abonnementExpire && abonnement.StatutAbonnement == "Actif")
            {
                // On marque l'abonnement comme expiré.
                abonnement.StatutAbonnement = "Expiré";

                // On sauvegarde la modification.
                await _context.SaveChangesAsync();
            }

            // Si l'abonnement est actif et non expiré, on utilise sa limite.
            if (!abonnementExpire && abonnement.StatutAbonnement == "Actif")
            {
                // On prend la limite de l'abonnement.
                limitePublication = abonnement.LimitePublication;
            }
        }

        // On compte les publications déjà utilisées par le membre.
        int nombrePublicationsUtilisees = await _context.Annonces
            .CountAsync(item =>
                item.UtilisateurId == utilisateurId &&
                item.EstActive &&
                item.Statut != "En création"
            );

        // On vérifie si la limite est atteinte.
        if (nombrePublicationsUtilisees >= limitePublication)
        {
            // On bloque la publication.
            throw new InvalidOperationException(
                $"Vous avez atteint votre limite de publication. Limite actuelle : {limitePublication} annonce(s)."
            );
        }
    }

    // On transforme les photos locales en data URLs base64.
    private List<string> BuildPhotoDataUrls(List<Photo> photos)
    {
        // On crée la liste finale.
        List<string> photoDataUrls = new();

        // On récupère le dossier wwwroot.
        string wwwrootPath = _environment.WebRootPath ?? Path.Combine(_environment.ContentRootPath, "wwwroot");

        // On parcourt les photos.
        foreach (Photo photo in photos.Take(5))
        {
            // On crée le chemin relatif.
            string relativePath = photo.Url.TrimStart('/').Replace("/", Path.DirectorySeparatorChar.ToString());

            // On crée le chemin complet.
            string filePath = Path.Combine(wwwrootPath, relativePath);

            // On ignore le fichier s'il n'existe pas.
            if (!File.Exists(filePath)) continue;

            // On récupère l'extension.
            string extension = Path.GetExtension(filePath).ToLowerInvariant();

            // On récupère le type MIME.
            string mimeType = GetMimeType(extension);

            // On ignore les formats inconnus.
            if (string.IsNullOrWhiteSpace(mimeType)) continue;

            // On lit les octets de l'image.
            byte[] bytes = File.ReadAllBytes(filePath);

            // On transforme l'image en base64.
            string base64 = Convert.ToBase64String(bytes);

            // On crée la data URL.
            string dataUrl = $"data:{mimeType};base64,{base64}";

            // On ajoute l'image.
            photoDataUrls.Add(dataUrl);
        }

        // On retourne les images.
        return photoDataUrls;
    }

    // On marque une annonce comme vendue.
    public async Task<AnnonceDto?> MarkAnnonceAsSoldAsync(int id, int utilisateurId)
    {
        // On cherche l'annonce avec ses informations.
        Annonce? annonce = await _context.Annonces
            .Include(item => item.Utilisateur)
            .Include(item => item.Categorie)
            .Include(item => item.Photos)
            .Include(item => item.AnalysesIa)
            .FirstOrDefaultAsync(item => item.Id == id);

        // On retourne null si l'annonce n'existe pas.
        if (annonce == null)
        {
            // L'annonce est introuvable.
            return null;
        }

        // On vérifie si l'utilisateur connecté est le propriétaire de l'annonce.
        if (annonce.UtilisateurId != utilisateurId)
        {
            // On bloque si ce n'est pas le propriétaire.
            throw new UnauthorizedAccessException("Vous n'avez pas le droit de marquer cette annonce comme vendue.");
        }

        // On vérifie si l'annonce est active.
        if (!annonce.EstActive)
        {
            // On bloque si l'annonce est inactive.
            throw new InvalidOperationException("Cette annonce est inactive.");
        }

        // On vérifie si l'annonce est déjà vendue.
        if (annonce.Statut == "Vendu")
        {
            // On bloque si elle est déjà vendue.
            throw new InvalidOperationException("Cette annonce est déjà marquée comme vendue.");
        }

        // On vérifie si l'annonce est disponible.
        if (annonce.Statut != "Disponible")
        {
            // On bloque si l'annonce n'est pas encore publiée publiquement.
            throw new InvalidOperationException("Seule une annonce disponible peut être marquée comme vendue.");
        }

        // On change le statut de l'annonce.
        annonce.Statut = "Vendu";

        // On sauvegarde dans la base de données.
        await _context.SaveChangesAsync();

        // On retourne l'annonce mise à jour.
        return ToDto(annonce);
    }

    // On récupère le type MIME selon l'extension.
    private static string GetMimeType(string extension)
    {
        // On retourne le type JPEG.
        if (extension == ".jpg" || extension == ".jpeg") return "image/jpeg";

        // On retourne le type PNG.
        if (extension == ".png") return "image/png";

        // On retourne le type WEBP.
        if (extension == ".webp") return "image/webp";

        // On retourne vide si inconnu.
        return string.Empty;
    }

    // On valide les textes contre le XSS.
    private static void ValidateAnnonceTexts(string titre, string description, string ville, string etatObjet)
    {
        // On valide le titre.
        XssProtectionHelper.ValidateText(titre, "titre");

        // On valide la description.
        XssProtectionHelper.ValidateText(description, "description");

        // On valide la ville.
        XssProtectionHelper.ValidateText(ville, "ville");

        // On valide l'état de l'objet.
        XssProtectionHelper.ValidateText(etatObjet, "état de l'objet");
    }

    // On transforme une annonce en DTO.
    private static AnnonceDto ToDto(Annonce annonce)
    {

        // On récupère la dernière analyse IA.
        AnalyseIa? lastAnalyse = annonce.AnalysesIa
            .OrderByDescending(item => item.DateAnalyse)
            .FirstOrDefault();


        // On retourne un objet simple.
        return new AnnonceDto
        {
            // On renvoie l'id.
            Id = annonce.Id,

            // On renvoie le titre.
            Titre = annonce.Titre,

            // On renvoie la description.
            Description = annonce.Description,

            // On renvoie le prix.
            Prix = annonce.Prix,

            // On renvoie la ville.
            Ville = annonce.Ville,

            // On renvoie l'état de l'objet.
            EtatObjet = annonce.EtatObjet,

            // On renvoie le statut.
            Statut = annonce.Statut,

            // On renvoie l'état actif.
            EstActive = annonce.EstActive,

            // On renvoie la date.
            DatePublication = annonce.DatePublication,

            // On renvoie l'id du vendeur.
            UtilisateurId = annonce.UtilisateurId,

            // On renvoie le nom du vendeur.
            NomVendeur = annonce.Utilisateur == null ? "" : $"{annonce.Utilisateur.Prenom} {annonce.Utilisateur.Nom}",

            // On renvoie l'id de la catégorie.
            CategorieId = annonce.CategorieId,

            // On renvoie le nom de la catégorie.
            NomCategorie = annonce.Categorie == null ? "" : annonce.Categorie.Nom,

            // On renvoie la photo principale.
            PhotoPrincipaleUrl = annonce.Photos.FirstOrDefault(photo => photo.EstPrincipale)?.Url ?? "",

            // On renvoie toutes les photos.
            Photos = annonce.Photos.Select(photo => new PhotoDto
            {
                // On renvoie l'id de la photo.
                Id = photo.Id,

                // On renvoie l'adresse de la photo.
                Url = photo.Url,

                // On indique si elle est principale.
                EstPrincipale = photo.EstPrincipale
            }).ToList(),

            // On renvoie la dernière décision IA.
            DerniereDecisionIa = lastAnalyse == null ? "" : lastAnalyse.DecisionIa,

            // On renvoie le dernier score IA.
            DernierScoreConfianceIa = lastAnalyse == null ? null : lastAnalyse.ScoreConfiance,

            // On renvoie le dernier motif IA.
            DernierMotifIa = lastAnalyse == null ? "" : lastAnalyse.Motif,

            // On renvoie la dernière version du modèle IA.
            DerniereVersionModeleIa = lastAnalyse == null ? "" : lastAnalyse.VersionModele
        };
    }
}