using System.ComponentModel.DataAnnotations;

namespace SecondLifeMarket.Api.DTOs.DemandesAchat;

public class CreateDemandeAchatDto
{
    // Identifiant de l'annonce que le membre veut acheter.
    [Required]
    public int AnnonceId { get; set; }

    // Message optionnel envoyé au vendeur.
    [MaxLength(1000)]
    public string Message { get; set; } = string.Empty;
}