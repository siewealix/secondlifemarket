using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SecondLifeMarket.Api.DTOs.Abonnements;
using SecondLifeMarket.Api.Services.Interfaces;

namespace SecondLifeMarket.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AbonnementsController : ControllerBase
{
    // Service utilisé pour gérer les abonnements.
    private readonly IAbonnementService _abonnementService;

    // Constructeur du contrôleur.
    public AbonnementsController(IAbonnementService abonnementService)
    {
        // On garde le service dans une variable privée.
        _abonnementService = abonnementService;
    }

    // Route qui retourne les offres d'abonnement.
    [HttpGet("offres")]
    public async Task<IActionResult> GetOffresAbonnement()
    {
        // On récupère les offres disponibles.
        List<OffreAbonnementDto> offres = await _abonnementService.GetOffresAbonnementAsync();

        // On retourne les offres.
        return Ok(offres);
    }

    // Route qui permet de souscrire à un abonnement.
    [HttpPost("souscrire")]
    public async Task<IActionResult> SouscrireAbonnement(SouscrireAbonnementDto dto)
    {
        // On essaie de créer l'abonnement.
        try
        {
            // On récupère l'identifiant du membre connecté.
            int utilisateurId = GetCurrentUserId();

            // On demande au service de créer l'abonnement.
            AbonnementDto abonnement = await _abonnementService.SouscrireAbonnementAsync(dto, utilisateurId);

            // On retourne l'abonnement créé.
            return Ok(abonnement);
        }
        catch (InvalidOperationException error)
        {
            // On retourne une erreur métier simple.
            return BadRequest(new { message = error.Message });
        }
        catch (UnauthorizedAccessException error)
        {
            // On retourne une erreur d'autorisation.
            return StatusCode(403, new { message = error.Message });
        }
    }

    // Route qui permet au membre connecté de résilier son abonnement.
    [HttpPut("resilier")]
    public async Task<IActionResult> ResilierAbonnement()
    {
        // On essaie de résilier l'abonnement.
        try
        {
            // On récupère l'identifiant du membre connecté.
            int utilisateurId = GetCurrentUserId();

            // On résilie l'abonnement.
            MonAbonnementDto abonnement = await _abonnementService.ResilierAbonnementAsync(utilisateurId);

            // On retourne la nouvelle situation.
            return Ok(abonnement);
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

    // Route qui retourne l'abonnement actuel du membre.
    [HttpGet("mon-abonnement")]
    public async Task<IActionResult> GetMonAbonnement()
    {
        // On essaie de récupérer l'abonnement.
        try
        {
            // On récupère l'identifiant du membre connecté.
            int utilisateurId = GetCurrentUserId();

            // On récupère l'abonnement et la limite de publication.
            MonAbonnementDto abonnement = await _abonnementService.GetMonAbonnementAsync(utilisateurId);

            // On retourne les informations.
            return Ok(abonnement);
        }
        catch (InvalidOperationException error)
        {
            // On retourne une erreur métier simple.
            return BadRequest(new { message = error.Message });
        }
        catch (UnauthorizedAccessException error)
        {
            // On retourne une erreur d'autorisation.
            return StatusCode(403, new { message = error.Message });
        }
    }

    // Méthode qui récupère l'identifiant de l'utilisateur connecté.
    private int GetCurrentUserId()
    {
        // On cherche l'id dans le token JWT.
        string? userId = User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? User.FindFirstValue("id")
            ?? User.FindFirstValue("userId");

        // On vérifie si l'id est absent.
        if (string.IsNullOrWhiteSpace(userId))
        {
            // On bloque si le token ne contient pas l'id.
            throw new UnauthorizedAccessException("Utilisateur non authentifié.");
        }

        // On vérifie si l'id est un nombre valide.
        if (!int.TryParse(userId, out int id))
        {
            // On bloque si l'id est invalide.
            throw new UnauthorizedAccessException("Identifiant utilisateur invalide.");
        }

        // On retourne l'id.
        return id;
    }
}