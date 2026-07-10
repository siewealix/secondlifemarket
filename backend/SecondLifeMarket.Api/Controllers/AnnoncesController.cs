// On importe les claims pour lire l'id de l'utilisateur connecté.
using System.Security.Claims;

// On importe l'autorisation.
using Microsoft.AspNetCore.Authorization;

// On importe les outils API.
using Microsoft.AspNetCore.Mvc;

// On importe les DTOs.
using SecondLifeMarket.Api.DTOs.Annonces;

// On importe l'interface du service.
using SecondLifeMarket.Api.Services.Interfaces;

// On place ce fichier dans le namespace Controllers.
namespace SecondLifeMarket.Api.Controllers;

// On indique que c'est un contrôleur API.
[ApiController]

// On définit la route de base.
[Route("api/[controller]")]
public class AnnoncesController : ControllerBase
{
    // On stocke le service des annonces.
    private readonly IAnnonceService _annonceService;

    // On crée le constructeur.
    public AnnoncesController(IAnnonceService annonceService)
    {
        // On garde le service.
        _annonceService = annonceService;
    }

    // On récupère les annonces publiques.
    [HttpGet]
    public async Task<IActionResult> GetPublicAnnonces()
    {
        // On appelle le service.
        List<AnnonceDto> annonces = await _annonceService.GetPublicAnnoncesAsync();

        // On retourne les annonces.
        return Ok(annonces);
    }

    // On récupère une annonce par son id.
    [HttpGet("{id}")]
    public async Task<IActionResult> GetAnnonceById(int id)
    {
        // On appelle le service.
        AnnonceDto? annonce = await _annonceService.GetAnnonceByIdAsync(id);

        // On retourne 404 si l'annonce n'existe pas.
        if (annonce == null) return NotFound(new { message = "Annonce introuvable." });

        // On retourne l'annonce.
        return Ok(annonce);
    }

    // On récupère les annonces du membre connecté.
    [Authorize]
    [HttpGet("mes-annonces")]
    public async Task<IActionResult> GetMyAnnonces()
    {
        // On récupère l'id de l'utilisateur.
        int utilisateurId = GetCurrentUserId();

        // On appelle le service.
        List<AnnonceDto> annonces = await _annonceService.GetMyAnnoncesAsync(utilisateurId);

        // On retourne les annonces.
        return Ok(annonces);
    }

    // On crée une annonce.
    [Authorize]
    [HttpPost]
    public async Task<IActionResult> CreateAnnonce(CreateAnnonceDto dto)
    {
        // On essaie de créer l'annonce.
        try
        {
            // On récupère l'id de l'utilisateur.
            int utilisateurId = GetCurrentUserId();

            // On appelle le service.
            AnnonceDto annonce = await _annonceService.CreateAnnonceAsync(dto, utilisateurId);

            // On retourne l'annonce créée.
            return Ok(annonce);
        }
        catch (InvalidOperationException error)
        {
            // On retourne une erreur de validation.
            return BadRequest(new { message = error.Message });
        }
    }

    // On modifie une annonce.
    [Authorize]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateAnnonce(int id, UpdateAnnonceDto dto)
    {
        // On essaie de modifier.
        try
        {
            // On récupère l'id de l'utilisateur.
            int utilisateurId = GetCurrentUserId();

            // On récupère le rôle.
            string role = GetCurrentUserRole();

            // On appelle le service.
            AnnonceDto? annonce = await _annonceService.UpdateAnnonceAsync(id, dto, utilisateurId, role);

            // On retourne 404 si l'annonce n'existe pas.
            if (annonce == null) return NotFound(new { message = "Annonce introuvable." });

            // On retourne l'annonce modifiée.
            return Ok(annonce);
        }
        catch (UnauthorizedAccessException error)
        {
            // On retourne 403.
            return Forbid(error.Message);
        }
        catch (InvalidOperationException error)
        {
            // On retourne une erreur de validation.
            return BadRequest(new { message = error.Message });
        }
    }

    // On désactive une annonce.
    [Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteAnnonce(int id)
    {
        // On essaie de désactiver.
        try
        {
            // On récupère l'id de l'utilisateur.
            int utilisateurId = GetCurrentUserId();

            // On récupère le rôle.
            string role = GetCurrentUserRole();

            // On appelle le service.
            bool deleted = await _annonceService.DeleteAnnonceAsync(id, utilisateurId, role);

            // On retourne 404 si l'annonce n'existe pas.
            if (!deleted) return NotFound(new { message = "Annonce introuvable." });

            // On retourne un message.
            return Ok(new { message = "Annonce désactivée avec succès." });
        }
        catch (UnauthorizedAccessException error)
        {
            // On retourne 403.
            return Forbid(error.Message);
        }
    }

    // On ajoute une photo à une annonce.
    [Authorize]

    // On définit la route POST.
    [HttpPost("{id}/photos")]
    // On indique à Swagger que la requête est un formulaire multipart.
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> AddPhoto(int id, [FromForm] UploadPhotoDto dto)
    {
        // On essaie d'ajouter une photo.
        try
        {
            // On vérifie si aucune photo n'a été envoyée.
            if (dto.Photo == null)
            {
                // On retourne une erreur claire.
                return BadRequest(new { message = "Veuillez choisir une photo." });
            }

            // On récupère l'id de l'utilisateur.
            int utilisateurId = GetCurrentUserId();

            // On récupère le rôle de l'utilisateur.
            string role = GetCurrentUserRole();

            // On appelle le service pour ajouter la photo.
            PhotoDto createdPhoto = await _annonceService.AddPhotoAsync(id, dto.Photo, utilisateurId, role);

            // On retourne la photo créée.
            return Ok(createdPhoto);
        }
        catch (UnauthorizedAccessException error)
        {
            // On retourne une erreur 403.
            return StatusCode(403, new { message = error.Message });
        }
        catch (InvalidOperationException error)
        {
            // On retourne une erreur 400.
            return BadRequest(new { message = error.Message });
        }
    }

    // On supprime une photo d'une annonce.
    [Authorize]
    [HttpDelete("{annonceId}/photos/{photoId}")]
    public async Task<IActionResult> DeletePhoto(int annonceId, int photoId)
    {
        // On essaie de supprimer la photo.
        try
        {
            // On récupère l'id de l'utilisateur connecté.
            int utilisateurId = GetCurrentUserId();

            // On récupère son rôle.
            string role = GetCurrentUserRole();

            // On appelle le service.
            bool deleted = await _annonceService.DeletePhotoAsync(annonceId, photoId, utilisateurId, role);

            // On vérifie si la photo ou l'annonce est introuvable.
            if (!deleted)
            {
                // On retourne 404.
                return NotFound(new { message = "Photo introuvable." });
            }

            // On retourne un message de succès.
            return Ok(new { message = "Photo supprimée avec succès." });
        }
        catch (UnauthorizedAccessException error)
        {
            // On retourne 403.
            return StatusCode(403, new { message = error.Message });
        }
        catch (InvalidOperationException error)
        {
            // On retourne 400.
            return BadRequest(new { message = error.Message });
        }
    }

    // On finalise la publication d'une annonce.
    [Authorize]
    [HttpPost("{id}/publier")]
    public async Task<IActionResult> PublishAnnonce(int id)
    {
        // On essaie de publier.
        try
        {
            // On récupère l'id de l'utilisateur.
            int utilisateurId = GetCurrentUserId();

            // On récupère le rôle.
            string role = GetCurrentUserRole();

            // On appelle le service.
            AnnonceDto? annonce = await _annonceService.PublishAnnonceAsync(id, utilisateurId, role);

            // On retourne 404 si l'annonce n'existe pas.
            if (annonce == null) return NotFound(new { message = "Annonce introuvable." });

            // On retourne l'annonce.
            return Ok(annonce);
        }
        catch (UnauthorizedAccessException error)
        {
            // On retourne 403.
            return StatusCode(403, new { message = error.Message });
        }
        catch (InvalidOperationException error)
        {
            // On retourne 400.
            return BadRequest(new { message = error.Message });
        }
    }

    // L'administrateur récupère les annonces à réexaminer.
    [Authorize(Roles = "Administrateur")]
    [HttpGet("admin/reexamen")]
    public async Task<IActionResult> GetAdminReviewAnnonces()
    {
        // On appelle le service.
        List<AnnonceDto> annonces = await _annonceService.GetAdminReviewAnnoncesAsync();

        // On retourne les annonces.
        return Ok(annonces);
    }

    // L'administrateur valide une annonce.
    [Authorize(Roles = "Administrateur")]
    [HttpPut("admin/{id}/valider")]
    public async Task<IActionResult> ValidateAnnonceByAdmin(int id)
    {
        // On essaie de valider l'annonce.
        try
        {
            // On appelle le service.
            AnnonceDto? annonce = await _annonceService.ValidateAnnonceByAdminAsync(id);

            // On vérifie si l'annonce existe.
            if (annonce == null) return NotFound(new { message = "Annonce introuvable." });

            // On retourne l'annonce validée.
            return Ok(annonce);
        }
        catch (InvalidOperationException error)
        {
            // On retourne une erreur claire.
            return BadRequest(new { message = error.Message });
        }
    }

    // L'administrateur rejette une annonce.
    [Authorize(Roles = "Administrateur")]
    [HttpPut("admin/{id}/rejeter")]
    public async Task<IActionResult> RejectAnnonceByAdmin(int id)
    {
        // On essaie de rejeter l'annonce.
        try
        {
            // On appelle le service.
            AnnonceDto? annonce = await _annonceService.RejectAnnonceByAdminAsync(id);

            // On vérifie si l'annonce existe.
            if (annonce == null) return NotFound(new { message = "Annonce introuvable." });

            // On retourne l'annonce rejetée.
            return Ok(annonce);
        }
        catch (InvalidOperationException error)
        {
            // On retourne une erreur claire.
            return BadRequest(new { message = error.Message });
        }
    }

    // Route qui permet au propriétaire de marquer une annonce comme vendue.
    [HttpPut("{id}/marquer-vendu")]
    [Authorize]
    public async Task<IActionResult> MarkAnnonceAsSold(int id)
    {
        // On essaie de marquer l'annonce comme vendue.
        try
        {
            // On récupère l'identifiant de l'utilisateur connecté.
            int utilisateurId = GetCurrentUserId();

            // On appelle le service.
            AnnonceDto? annonce = await _annonceService.MarkAnnonceAsSoldAsync(id, utilisateurId);

            // On vérifie si l'annonce existe.
            if (annonce == null)
            {
                // On retourne une erreur 404.
                return NotFound(new { message = "Annonce introuvable." });
            }

            // On retourne l'annonce mise à jour.
            return Ok(annonce);
        }
        catch (InvalidOperationException error)
        {
            // On retourne une erreur métier.
            return BadRequest(new { message = error.Message });
        }
        catch (UnauthorizedAccessException error)
        {
            // On retourne une erreur d'autorisation.
            return StatusCode(403, new { message = error.Message });
        }
    }

    // On récupère l'id de l'utilisateur connecté.
    private int GetCurrentUserId()
    {
        // On lit la claim NameIdentifier.
        string? userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        // On transforme l'id en entier.
        return int.Parse(userId!);
    }

    // On récupère le rôle de l'utilisateur connecté.
    private string GetCurrentUserRole()
    {
        // On lit la claim Role.
        string? role = User.FindFirstValue(ClaimTypes.Role);

        // On retourne le rôle ou une chaîne vide.
        return role ?? string.Empty;
    }
}