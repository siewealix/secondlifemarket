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
    private readonly IConversationService _conversationService;

    public ConversationsController(IConversationService conversationService)
    {
        _conversationService = conversationService;
    }

    [HttpGet]
    public async Task<IActionResult> GetConversations()
    {
        int utilisateurId = GetCurrentUserId();
        List<ConversationDto> conversations = await _conversationService.GetConversationsByUtilisateurAsync(utilisateurId);
        return Ok(conversations);
    }

    [HttpPost("demande/{demandeAchatId}")]
    public async Task<IActionResult> GetOrCreateConversation(int demandeAchatId)
    {
        try
        {
            int utilisateurId = GetCurrentUserId();
            ConversationDto conversation = await _conversationService.GetOrCreateConversationAsync(demandeAchatId, utilisateurId);
            return Ok(conversation);
        }
        catch (InvalidOperationException error)
        {
            return BadRequest(new { message = error.Message });
        }
        catch (UnauthorizedAccessException error)
        {
            return StatusCode(403, new { message = error.Message });
        }
    }

    private int GetCurrentUserId()
    {
        string? userId = User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? User.FindFirstValue("id")
            ?? User.FindFirstValue("userId");

        if (string.IsNullOrWhiteSpace(userId) || !int.TryParse(userId, out int id))
        {
            throw new UnauthorizedAccessException("Identifiant utilisateur invalide.");
        }

        return id;
    }
}
