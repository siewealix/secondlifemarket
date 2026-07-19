// On importe le DTO utilisé pour retourner une conversation.
using SecondLifeMarket.Api.DTOs.Conversations;

// On définit l'espace de noms du fichier.
namespace SecondLifeMarket.Api.Services.Interfaces;

// On crée l'interface du service des conversations.
public interface IConversationService
{
    // Cette méthode retourne toutes les conversations de l'utilisateur connecté.
    Task<List<ConversationDto>> GetConversationsByUtilisateurAsync(int utilisateurId);

    // Cette méthode ouvre ou crée une conversation liée à une demande d'achat.
    Task<ConversationDto> GetOrCreateConversationAsync(
        int demandeAchatId,
        int utilisateurId
    );
}