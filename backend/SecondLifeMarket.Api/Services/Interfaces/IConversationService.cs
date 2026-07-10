using SecondLifeMarket.Api.DTOs.Conversations;

namespace SecondLifeMarket.Api.Services.Interfaces;

public interface IConversationService
{
    // Ouvre une conversation liée à une demande d'achat.
    Task<ConversationDto> GetOrCreateConversationAsync(int demandeAchatId, int utilisateurId);
}