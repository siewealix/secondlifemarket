using System.ComponentModel.DataAnnotations;

namespace SecondLifeMarket.Api.DTOs.Abonnements;

public class SouscrireAbonnementDto
{
    // Type d'abonnement choisi par le membre.
    [Required]
    [MaxLength(50)]
    public string TypeAbonnement { get; set; } = string.Empty;
}