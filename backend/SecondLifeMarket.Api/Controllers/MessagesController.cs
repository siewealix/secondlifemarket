using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SecondLifeMarket.Api.DTOs.Messages;
using SecondLifeMarket.Api.Services.Interfaces;

namespace SecondLifeMarket.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class MessagesController : ControllerBase
{
    // Service utilisé pour gérer les messages.
    private readonly IMessageService _messageService;

    // Constructeur du contrôleur.
    public MessagesController(IMessageService messageService)
    {
        // On garde le service dans une variable privée.
        _messageService = messageService;
    }

    // Route utilisée pour envoyer un message dans une conversation.
    [HttpPost("conversation/{conversationId}")]
    public async Task<IActionResult> SendMessage(int conversationId, SendMessageDto dto)
    {
        // On essaie d'envoyer le message.
        try
        {
            // On récupère l'identifiant de l'utilisateur connecté.
            int expediteurId = GetCurrentUserId();

            // On demande au service d'envoyer le message.
            MessageDto message = await _messageService.SendMessageAsync(conversationId, dto, expediteurId);

            // On retourne le message créé.
            return Ok(message);
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