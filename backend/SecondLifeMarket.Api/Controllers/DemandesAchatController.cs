using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SecondLifeMarket.Api.DTOs.DemandesAchat;
using SecondLifeMarket.Api.Services.Interfaces;

namespace SecondLifeMarket.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class DemandesAchatController : ControllerBase
{
    // Service utilisé pour gérer les demandes d'achat.
    private readonly IDemandeAchatService _demandeAchatService;

    // Constructeur du contrôleur.
    public DemandesAchatController(IDemandeAchatService demandeAchatService)
    {
        // On garde le service dans une variable privée.
        _demandeAchatService = demandeAchatService;
    }

    // Route utilisée pour créer une demande d'achat.
    [HttpPost]
    public async Task<IActionResult> CreateDemandeAchat(CreateDemandeAchatDto dto)
    {
        // On essaie de créer la demande.
        try
        {
            // On récupère l'identifiant du membre connecté.
            int acheteurId = GetCurrentUserId();

            // On demande au service de créer la demande d'achat.
            DemandeAchatDto demande = await _demandeAchatService.CreateDemandeAchatAsync(dto, acheteurId);

            // On retourne la demande créée.
            return Ok(demande);
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

    // Route utilisée pour consulter les demandes envoyées par l'acheteur connecté.
    [HttpGet("mes-demandes")]
    public async Task<IActionResult> GetMyDemandesAchat()
    {
        // On récupère l'identifiant du membre connecté.
        int acheteurId = GetCurrentUserId();

        // On demande au service de récupérer ses demandes d'achat.
        List<DemandeAchatDto> demandes = await _demandeAchatService.GetMyDemandesAchatAsync(acheteurId);

        // On retourne la liste des demandes.
        return Ok(demandes);
    }

    // Route utilisée pour annuler une demande d'achat.
    [HttpPut("{id}/annuler")]
    public async Task<IActionResult> CancelDemandeAchat(int id)
    {
        // On essaie d'annuler la demande d'achat.
        try
        {
            // On récupère l'identifiant du membre connecté.
            int acheteurId = GetCurrentUserId();

            // On demande au service d'annuler la demande.
            DemandeAchatDto demande = await _demandeAchatService.CancelDemandeAchatAsync(id, acheteurId);

            // On retourne la demande mise à jour.
            return Ok(demande);
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

    // Route utilisée pour consulter les demandes reçues par le vendeur connecté.
    [HttpGet("recues")]
    public async Task<IActionResult> GetDemandesRecues()
    {
        // On récupère l'identifiant du vendeur connecté.
        int vendeurId = GetCurrentUserId();

        // On demande au service de récupérer les demandes reçues.
        List<DemandeAchatDto> demandes = await _demandeAchatService.GetDemandesRecuesAsync(vendeurId);

        // On retourne la liste des demandes reçues.
        return Ok(demandes);
    }

    // Route utilisée pour accepter une demande d'achat.
    [HttpPut("{id}/accepter")]
    public async Task<IActionResult> AcceptDemandeAchat(int id)
    {
        // On essaie d'accepter la demande.
        try
        {
            // On récupère l'identifiant du vendeur connecté.
            int vendeurId = GetCurrentUserId();

            // On demande au service d'accepter la demande.
            DemandeAchatDto demande = await _demandeAchatService.AcceptDemandeAchatAsync(id, vendeurId);

            // On retourne la demande mise à jour.
            return Ok(demande);
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

    // Route utilisée pour refuser une demande d'achat.
    [HttpPut("{id}/refuser")]
    public async Task<IActionResult> RefuseDemandeAchat(int id)
    {
        // On essaie de refuser la demande.
        try
        {
            // On récupère l'identifiant du vendeur connecté.
            int vendeurId = GetCurrentUserId();

            // On demande au service de refuser la demande.
            DemandeAchatDto demande = await _demandeAchatService.RefuseDemandeAchatAsync(id, vendeurId);

            // On retourne la demande mise à jour.
            return Ok(demande);
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

        // On retourne l'id de l'utilisateur.
        return id;
    }
}