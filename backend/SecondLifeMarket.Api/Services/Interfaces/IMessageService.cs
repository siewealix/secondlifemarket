using SecondLifeMarket.Api.DTOs.Messages;

namespace SecondLifeMarket.Api.Services.Interfaces;

public interface IMessageService
{
    // Envoie un message dans une conversation.
    Task<MessageDto> SendMessageAsync(int conversationId, SendMessageDto dto, int expediteurId);
}