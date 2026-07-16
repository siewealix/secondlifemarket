using SecondLifeMarket.Api.DTOs.Conversations;

namespace SecondLifeMarket.Api.Services.Interfaces;

public interface IConversationService
{
    Task<List<ConversationDto>> GetConversationsByUtilisateurAsync(int utilisateurId);
    Task<ConversationDto> GetOrCreateConversationAsync(int demandeAchatId, int utilisateurId);
}
