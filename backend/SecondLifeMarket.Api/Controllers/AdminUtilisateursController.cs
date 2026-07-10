using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SecondLifeMarket.Api.DTOs.Utilisateurs;
using SecondLifeMarket.Api.Services.Interfaces;

namespace SecondLifeMarket.Api.Controllers;

[ApiController]
[Route("api/admin/utilisateurs")]
[Authorize(Roles = "Administrateur")]
public class AdminUtilisateursController : ControllerBase
{
    // Service utilisé pour gérer les utilisateurs côté administrateur.
    private readonly IAdminUtilisateurService _adminUtilisateurService;

    // Constructeur du contrôleur.
    public AdminUtilisateursController(IAdminUtilisateurService adminUtilisateurService)
    {
        // On garde le service dans une variable privée.
        _adminUtilisateurService = adminUtilisateurService;
    }

    // Route qui retourne la liste des membres.
    [HttpGet]
    public async Task<IActionResult> GetUtilisateurs()
    {
        // On récupère les utilisateurs.
        List<UtilisateurAdminDto> utilisateurs = await _adminUtilisateurService.GetUtilisateursAsync();

        // On retourne les utilisateurs.
        return Ok(utilisateurs);
    }

    // Route qui suspend un membre.
    [HttpPut("{id}/suspendre")]
    public async Task<IActionResult> SuspendreUtilisateur(int id)
    {
        // On essaie de suspendre le membre.
        try
        {
            // On récupère l'identifiant de l'administrateur connecté.
            int administrateurId = GetCurrentUserId();

            // On demande au service de suspendre l'utilisateur.
            UtilisateurAdminDto utilisateur = await _adminUtilisateurService
                .SuspendreUtilisateurAsync(id, administrateurId);

            // On retourne l'utilisateur modifié.
            return Ok(utilisateur);
        }
        catch (InvalidOperationException error)
        {
            // On retourne une erreur métier simple.
            return BadRequest(new { message = error.Message });
        }
    }

    // Route qui réactive un membre.
    [HttpPut("{id}/reactiver")]
    public async Task<IActionResult> ReactiverUtilisateur(int id)
    {
        // On essaie de réactiver le membre.
        try
        {
            // On récupère l'identifiant de l'administrateur connecté.
            int administrateurId = GetCurrentUserId();

            // On demande au service de réactiver l'utilisateur.
            UtilisateurAdminDto utilisateur = await _adminUtilisateurService
                .ReactiverUtilisateurAsync(id, administrateurId);

            // On retourne l'utilisateur modifié.
            return Ok(utilisateur);
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

        // On retourne l'id.
        return id;
    }
}