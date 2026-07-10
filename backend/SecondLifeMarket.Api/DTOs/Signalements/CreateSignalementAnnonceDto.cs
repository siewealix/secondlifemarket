using System.ComponentModel.DataAnnotations;

namespace SecondLifeMarket.Api.DTOs.Signalements;

public class CreateSignalementAnnonceDto
{
    // Motif principal du signalement.
    [Required]
    [MaxLength(150)]
    public string Motif { get; set; } = string.Empty;

    // Description détaillée du problème.
    [Required]
    [MaxLength(1000)]
    public string Description { get; set; } = string.Empty;
}