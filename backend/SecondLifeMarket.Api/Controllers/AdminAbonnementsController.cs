using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SecondLifeMarket.Api.DTOs.Abonnements.Admin;
using SecondLifeMarket.Api.Services.Interfaces;

namespace SecondLifeMarket.Api.Controllers;

[ApiController]
[Route("api/admin/abonnements")]
[Authorize]
public class AdminAbonnementsController : ControllerBase
{
    // Service admin des abonnements.
    private readonly IAdminAbonnementService _adminAbonnementService;

    // Constructeur du contrôleur.
    public AdminAbonnementsController(IAdminAbonnementService adminAbonnementService)
    {
        // On garde le service dans une variable privée.
        _adminAbonnementService = adminAbonnementService;
    }

    // Route qui retourne tous les abonnements souscrits par les membres.
    [HttpGet]
    public async Task<IActionResult> GetAbonnements()
    {
        // On essaie de récupérer les abonnements.
        try
        {
            // On vérifie que l'utilisateur connecté est administrateur.
            EnsureAdmin();

            // On récupère tous les abonnements.
            List<AbonnementAdminDto> abonnements = await _adminAbonnementService.GetAbonnementsAsync();

            // On retourne les abonnements.
            return Ok(abonnements);
        }
        catch (UnauthorizedAccessException error)
        {
            // On retourne une erreur d'autorisation.
            return StatusCode(403, new { message = error.Message });
        }
    }

    // Route qui retourne tous les types d'abonnement.
    [HttpGet("types")]
    public async Task<IActionResult> GetTypesAbonnement()
    {
        // On essaie de récupérer les types d'abonnement.
        try
        {
            // On vérifie que l'utilisateur connecté est administrateur.
            EnsureAdmin();

            // On récupère les types d'abonnement.
            List<TypeAbonnementAdminDto> types = await _adminAbonnementService.GetTypesAbonnementAsync();

            // On retourne les types d'abonnement.
            return Ok(types);
        }
        catch (UnauthorizedAccessException error)
        {
            // On retourne une erreur d'autorisation.
            return StatusCode(403, new { message = error.Message });
        }
    }

    // Route qui ajoute un nouveau type d'abonnement.
    [HttpPost("types")]
    public async Task<IActionResult> CreateTypeAbonnement(CreateTypeAbonnementDto dto)
    {
        // On essaie d'ajouter le type d'abonnement.
        try
        {
            // On vérifie que l'utilisateur connecté est administrateur.
            EnsureAdmin();

            // On crée le type d'abonnement.
            TypeAbonnementAdminDto type = await _adminAbonnementService.CreateTypeAbonnementAsync(dto);

            // On retourne le type créé.
            return Ok(type);
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

    // Route qui modifie un type d'abonnement.
    [HttpPut("types/{id}")]
    public async Task<IActionResult> UpdateTypeAbonnement(int id, UpdateTypeAbonnementDto dto)
    {
        // On essaie de modifier le type d'abonnement.
        try
        {
            // On vérifie que l'utilisateur connecté est administrateur.
            EnsureAdmin();

            // On modifie le type d'abonnement.
            TypeAbonnementAdminDto? type = await _adminAbonnementService.UpdateTypeAbonnementAsync(id, dto);

            // On vérifie si le type existe.
            if (type == null)
            {
                // On retourne une erreur 404.
                return NotFound(new { message = "Type d'abonnement introuvable." });
            }

            // On retourne le type modifié.
            return Ok(type);
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

    // Route qui active un type d'abonnement.
    [HttpPut("types/{id}/activer")]
    public async Task<IActionResult> ActiverTypeAbonnement(int id)
    {
        // On essaie d'activer le type d'abonnement.
        try
        {
            // On vérifie que l'utilisateur connecté est administrateur.
            EnsureAdmin();

            // On active le type d'abonnement.
            TypeAbonnementAdminDto? type = await _adminAbonnementService.ActiverTypeAbonnementAsync(id);

            // On vérifie si le type existe.
            if (type == null)
            {
                // On retourne une erreur 404.
                return NotFound(new { message = "Type d'abonnement introuvable." });
            }

            // On retourne le type activé.
            return Ok(type);
        }
        catch (UnauthorizedAccessException error)
        {
            // On retourne une erreur d'autorisation.
            return StatusCode(403, new { message = error.Message });
        }
    }

    // Route qui désactive un type d'abonnement.
    [HttpPut("types/{id}/desactiver")]
    public async Task<IActionResult> DesactiverTypeAbonnement(int id)
    {
        // On essaie de désactiver le type d'abonnement.
        try
        {
            // On vérifie que l'utilisateur connecté est administrateur.
            EnsureAdmin();

            // On désactive le type d'abonnement.
            TypeAbonnementAdminDto? type = await _adminAbonnementService.DesactiverTypeAbonnementAsync(id);

            // On vérifie si le type existe.
            if (type == null)
            {
                // On retourne une erreur 404.
                return NotFound(new { message = "Type d'abonnement introuvable." });
            }

            // On retourne le type désactivé.
            return Ok(type);
        }
        catch (UnauthorizedAccessException error)
        {
            // On retourne une erreur d'autorisation.
            return StatusCode(403, new { message = error.Message });
        }
    }

    // Méthode qui vérifie que l'utilisateur connecté est administrateur.
    private void EnsureAdmin()
    {
        // On récupère le rôle depuis le token.
        string? role = User.FindFirstValue(ClaimTypes.Role)
            ?? User.FindFirstValue("role");

        // On vérifie si le rôle est absent ou différent d'administrateur.
        if (role != "Administrateur")
        {
            // On bloque l'accès.
            throw new UnauthorizedAccessException("Seul un administrateur peut accéder à cette ressource.");
        }
    }
}