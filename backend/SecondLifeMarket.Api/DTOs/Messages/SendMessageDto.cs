using System.ComponentModel.DataAnnotations;

namespace SecondLifeMarket.Api.DTOs.Messages;

public class SendMessageDto
{
    // Contenu du message envoyé.
    [Required]
    [MaxLength(2000)]
    public string Contenu { get; set; } = string.Empty;
}