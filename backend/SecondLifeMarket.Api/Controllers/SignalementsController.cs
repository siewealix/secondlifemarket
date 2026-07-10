using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SecondLifeMarket.Api.DTOs.Signalements;
using SecondLifeMarket.Api.Services.Interfaces;

namespace SecondLifeMarket.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class SignalementsController : ControllerBase
{
    // Service utilisé pour gérer les signalements.
    private readonly ISignalementService _signalementService;

    // Constructeur du contrôleur.
    public SignalementsController(ISignalementService signalementService)
    {
        // On garde le service dans une variable privée.
        _signalementService = signalementService;
    }

    // Route utilisée pour signaler une annonce.
    [HttpPost("annonce/{annonceId}")]
    public async Task<IActionResult> CreateSignalementAnnonce(
        int annonceId,
        CreateSignalementAnnonceDto dto
    )
    {
        // On essaie de créer le signalement.
        try
        {
            // On récupère l'identifiant du membre connecté.
            int signaleurId = GetCurrentUserId();

            // On demande au service de créer le signalement.
            SignalementAnnonceDto signalement = await _signalementService
                .CreateSignalementAnnonceAsync(annonceId, dto, signaleurId);

            // On retourne le signalement créé.
            return Ok(signalement);
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

    // Route utilisée pour signaler un utilisateur depuis une conversation.
    [HttpPost("conversation/{conversationId}/utilisateur/{utilisateurSignaleId}")]
    public async Task<IActionResult> CreateSignalementUtilisateur(
        int conversationId,
        int utilisateurSignaleId,
        CreateSignalementUtilisateurDto dto
    )
    {
        // On essaie de créer le signalement.
        try
        {
            // On récupère l'identifiant du membre connecté.
            int signaleurId = GetCurrentUserId();

            // On demande au service de créer le signalement utilisateur.
            SignalementUtilisateurDto signalement = await _signalementService
                .CreateSignalementUtilisateurAsync(conversationId, utilisateurSignaleId, dto, signaleurId);

            // On retourne le signalement créé.
            return Ok(signalement);
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

    // Route utilisée par l'administrateur pour consulter les signalements d'annonces en attente.
    [Authorize(Roles = "Administrateur")]
    [HttpGet("admin/annonces")]
    public async Task<IActionResult> GetSignalementsAnnoncesAdmin()
    {
        // On récupère les signalements d'annonces en attente.
        List<SignalementAnnonceDto> signalements = await _signalementService
            .GetSignalementsAnnoncesAdminAsync();

        // On retourne les signalements.
        return Ok(signalements);
    }

    // Route utilisée par l'administrateur pour consulter les signalements d'utilisateurs en attente.
    [Authorize(Roles = "Administrateur")]
    [HttpGet("admin/utilisateurs")]
    public async Task<IActionResult> GetSignalementsUtilisateursAdmin()
    {
        // On récupère les signalements d'utilisateurs en attente.
        List<SignalementUtilisateurDto> signalements = await _signalementService
            .GetSignalementsUtilisateursAdminAsync();

        // On retourne les signalements.
        return Ok(signalements);
    }

    // Route utilisée par l'administrateur pour valider un signalement d'annonce.
    [Authorize(Roles = "Administrateur")]
    [HttpPut("admin/annonces/{id}/valider")]
    public async Task<IActionResult> ValiderSignalementAnnonce(int id, TraiterSignalementDto dto)
    {
        // On essaie de valider le signalement.
        try
        {
            // On récupère l'identifiant de l'administrateur connecté.
            int administrateurId = GetCurrentUserId();

            // On demande au service de valider le signalement.
            SignalementAnnonceDto signalement = await _signalementService
                .ValiderSignalementAnnonceAsync(id, dto, administrateurId);

            // On retourne le signalement mis à jour.
            return Ok(signalement);
        }
        catch (InvalidOperationException error)
        {
            // On retourne une erreur métier simple.
            return BadRequest(new { message = error.Message });
        }
    }

    // Route utilisée par l'administrateur pour rejeter un signalement d'annonce.
    [Authorize(Roles = "Administrateur")]
    [HttpPut("admin/annonces/{id}/rejeter")]
    public async Task<IActionResult> RejeterSignalementAnnonce(int id, TraiterSignalementDto dto)
    {
        // On essaie de rejeter le signalement.
        try
        {
            // On récupère l'identifiant de l'administrateur connecté.
            int administrateurId = GetCurrentUserId();

            // On demande au service de rejeter le signalement.
            SignalementAnnonceDto signalement = await _signalementService
                .RejeterSignalementAnnonceAsync(id, dto, administrateurId);

            // On retourne le signalement mis à jour.
            return Ok(signalement);
        }
        catch (InvalidOperationException error)
        {
            // On retourne une erreur métier simple.
            return BadRequest(new { message = error.Message });
        }
    }

    // Route utilisée par l'administrateur pour valider un signalement d'utilisateur.
    [Authorize(Roles = "Administrateur")]
    [HttpPut("admin/utilisateurs/{id}/valider")]
    public async Task<IActionResult> ValiderSignalementUtilisateur(int id, TraiterSignalementDto dto)
    {
        // On essaie de valider le signalement.
        try
        {
            // On récupère l'identifiant de l'administrateur connecté.
            int administrateurId = GetCurrentUserId();

            // On demande au service de valider le signalement.
            SignalementUtilisateurDto signalement = await _signalementService
                .ValiderSignalementUtilisateurAsync(id, dto, administrateurId);

            // On retourne le signalement mis à jour.
            return Ok(signalement);
        }
        catch (InvalidOperationException error)
        {
            // On retourne une erreur métier simple.
            return BadRequest(new { message = error.Message });
        }
    }

    // Route utilisée par l'administrateur pour rejeter un signalement d'utilisateur.
    [Authorize(Roles = "Administrateur")]
    [HttpPut("admin/utilisateurs/{id}/rejeter")]
    public async Task<IActionResult> RejeterSignalementUtilisateur(int id, TraiterSignalementDto dto)
    {
        // On essaie de rejeter le signalement.
        try
        {
            // On récupère l'identifiant de l'administrateur connecté.
            int administrateurId = GetCurrentUserId();

            // On demande au service de rejeter le signalement.
            SignalementUtilisateurDto signalement = await _signalementService
                .RejeterSignalementUtilisateurAsync(id, dto, administrateurId);

            // On retourne le signalement mis à jour.
            return Ok(signalement);
        }
        catch (InvalidOperationException error)
        {
            // On retourne une erreur métier simple.
            return BadRequest(new { message = error.Message });
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