using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using SecondLifeMarket.Api.DTOs.Conversations;
using SecondLifeMarket.Api.DTOs.Messages;
using SecondLifeMarket.Api.Services.Interfaces;

namespace SecondLifeMarket.Api.Hubs;

[Authorize]
public class MessageHub : Hub
{
    // Service utilisé pour ouvrir ou créer une conversation.
    private readonly IConversationService _conversationService;

    // Service utilisé pour enregistrer les messages.
    private readonly IMessageService _messageService;

    // Constructeur du hub.
    public MessageHub(IConversationService conversationService, IMessageService messageService)
    {
        // On garde le service des conversations.
        _conversationService = conversationService;

        // On garde le service des messages.
        _messageService = messageService;
    }

    // Méthode appelée quand un utilisateur ouvre une conversation.
    public async Task<ConversationDto> JoinConversation(int demandeAchatId)
    {
        // On récupère l'identifiant de l'utilisateur connecté.
        int utilisateurId = GetCurrentUserId();

        try
        {
            // On ouvre ou crée la conversation liée à la demande d'achat.
            ConversationDto conversation = await _conversationService.GetOrCreateConversationAsync(demandeAchatId, utilisateurId);

            // On ajoute la connexion actuelle dans le groupe de cette conversation.
            await Groups.AddToGroupAsync(Context.ConnectionId, GetGroupName(conversation.Id));

            // On retourne la conversation au frontend.
            return conversation;
        }
        catch (Exception error)
        {
            // On retourne une erreur lisible côté frontend SignalR.
            throw new HubException(error.Message);
        }
    }

    // Méthode appelée quand un utilisateur quitte une conversation.
    public async Task LeaveConversation(int conversationId)
    {
        // On retire la connexion actuelle du groupe de cette conversation.
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, GetGroupName(conversationId));
    }

    // Méthode appelée quand un utilisateur envoie un message.
    public async Task<MessageDto> SendMessage(int conversationId, string contenu)
    {
        // On récupère l'identifiant de l'utilisateur connecté.
        int expediteurId = GetCurrentUserId();

        try
        {
            // On prépare le DTO du message.
            SendMessageDto dto = new()
            {
                // On met le contenu reçu depuis React.
                Contenu = contenu
            };

            // On enregistre le message dans MySQL.
            MessageDto message = await _messageService.SendMessageAsync(conversationId, dto, expediteurId);

            // On envoie le message instantanément à tous les utilisateurs du groupe.
            await Clients.Group(GetGroupName(conversationId)).SendAsync("ReceiveMessage", message);

            // On retourne aussi le message à celui qui l'a envoyé.
            return message;
        }
        catch (Exception error)
        {
            // On retourne une erreur lisible côté frontend SignalR.
            throw new HubException(error.Message);
        }
    }

    // Méthode qui construit le nom du groupe SignalR.
    private static string GetGroupName(int conversationId)
    {
        // On retourne un nom unique pour chaque conversation.
        return $"conversation-{conversationId}";
    }

    // Méthode qui récupère l'identifiant de l'utilisateur connecté.
    private int GetCurrentUserId()
    {
        // On cherche l'id dans le token JWT.
        string? userId = Context.User?.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? Context.User?.FindFirstValue("id")
            ?? Context.User?.FindFirstValue("userId");

        // On vérifie si l'id est absent.
        if (string.IsNullOrWhiteSpace(userId))
        {
            // On bloque si l'utilisateur n'est pas authentifié.
            throw new HubException("Utilisateur non authentifié.");
        }

        // On vérifie si l'id est bien un nombre.
        if (!int.TryParse(userId, out int id))
        {
            // On bloque si l'id est invalide.
            throw new HubException("Identifiant utilisateur invalide.");
        }

        // On retourne l'id de l'utilisateur.
        return id;
    }
}