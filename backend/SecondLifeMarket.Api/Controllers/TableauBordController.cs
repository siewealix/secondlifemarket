using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SecondLifeMarket.Api.DTOs.TableauxBord;
using SecondLifeMarket.Api.Services.Interfaces;

namespace SecondLifeMarket.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TableauBordController : ControllerBase
{
    // Service du tableau de bord.
    private readonly ITableauBordService _tableauBordService;

    // Constructeur du contrôleur.
    public TableauBordController(ITableauBordService tableauBordService)
    {
        // On garde le service.
        _tableauBordService = tableauBordService;
    }

    // Route qui retourne les statistiques du vendeur connecté.
    [HttpGet("vendeur")]
    public async Task<IActionResult> GetVendeurDashboard()
    {
        // On essaie de récupérer les statistiques.
        try
        {
            // On récupère l'identifiant du membre connecté.
            int utilisateurId = GetCurrentUserId();

            // On récupère les statistiques vendeur.
            VendeurDashboardDto dashboard = await _tableauBordService.GetVendeurDashboardAsync(utilisateurId);

            // On retourne les statistiques.
            return Ok(dashboard);
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

    // Méthode qui récupère l'identifiant de l'utilisateur connecté.
    private int GetCurrentUserId()
    {
        // On cherche l'identifiant dans le token.
        string? userId = User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? User.FindFirstValue("id")
            ?? User.FindFirstValue("userId");

        // On vérifie si l'identifiant existe.
        if (string.IsNullOrWhiteSpace(userId))
        {
            // On bloque si l'utilisateur n'est pas authentifié.
            throw new UnauthorizedAccessException("Utilisateur non authentifié.");
        }

        // On convertit l'identifiant en nombre.
        if (!int.TryParse(userId, out int id))
        {
            // On bloque si l'identifiant est invalide.
            throw new UnauthorizedAccessException("Identifiant utilisateur invalide.");
        }

        // On retourne l'identifiant.
        return id;
    }

    // Route qui retourne les statistiques de l'acheteur connecté.
    [HttpGet("acheteur")]
    public async Task<IActionResult> GetAcheteurDashboard()
    {
        // On essaie de récupérer les statistiques.
        try
        {
            // On récupère l'identifiant du membre connecté.
            int utilisateurId = GetCurrentUserId();

            // On récupère les statistiques acheteur.
            AcheteurDashboardDto dashboard = await _tableauBordService.GetAcheteurDashboardAsync(utilisateurId);

            // On retourne les statistiques.
            return Ok(dashboard);
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

    // Route qui retourne les statistiques de l'administrateur connecté.
    [HttpGet("admin")]
    public async Task<IActionResult> GetAdminDashboard()
    {
        // On essaie de récupérer les statistiques.
        try
        {
            // On récupère l'identifiant de l'utilisateur connecté.
            int utilisateurId = GetCurrentUserId();

            // On récupère les statistiques administrateur.
            AdminDashboardDto dashboard = await _tableauBordService.GetAdminDashboardAsync(utilisateurId);

            // On retourne les statistiques.
            return Ok(dashboard);
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
}