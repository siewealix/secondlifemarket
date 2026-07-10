using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SecondLifeMarket.Api.DTOs.Conversations;
using SecondLifeMarket.Api.Services.Interfaces;

namespace SecondLifeMarket.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ConversationsController : ControllerBase
{
    // Service utilisé pour gérer les conversations.
    private readonly IConversationService _conversationService;

    // Constructeur du contrôleur.
    public ConversationsController(IConversationService conversationService)
    {
        // On garde le service dans une variable privée.
        _conversationService = conversationService;
    }

    // Route utilisée pour ouvrir ou créer une conversation liée à une demande d'achat.
    [HttpPost("demande/{demandeAchatId}")]
    public async Task<IActionResult> GetOrCreateConversation(int demandeAchatId)
    {
        // On essaie d'ouvrir ou créer la conversation.
        try
        {
            // On récupère l'identifiant de l'utilisateur connecté.
            int utilisateurId = GetCurrentUserId();

            // On demande au service d'ouvrir ou créer la conversation.
            ConversationDto conversation = await _conversationService.GetOrCreateConversationAsync(demandeAchatId, utilisateurId);

            // On retourne la conversation.
            return Ok(conversation);
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
        // On cherche l'id dans le token JWT.
        string? userId = User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? User.FindFirstValue("id")
            ?? User.FindFirstValue("userId");

        // On vérifie si l'id est absent.
        if (string.IsNullOrWhiteSpace(userId))
        {
            // On bloque si le token ne contient pas d'id.
            throw new UnauthorizedAccessException("Utilisateur non authentifié.");
        }

        // On vérifie si l'id est un nombre valide.
        if (!int.TryParse(userId, out int id))
        {
            // On bloque si l'id est invalide.
            throw new UnauthorizedAccessException("Identifiant utilisateur invalide.");
        }

        // On retourne l'id de l'utilisateur connecté.
        return id;
    }
}