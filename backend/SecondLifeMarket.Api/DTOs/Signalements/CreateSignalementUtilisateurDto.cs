using System.ComponentModel.DataAnnotations;

namespace SecondLifeMarket.Api.DTOs.Signalements;

public class CreateSignalementUtilisateurDto
{
    // Motif principal du signalement.
    [Required]
    [MaxLength(150)]
    public string Motif { get; set; } = string.Empty;

    // Description détaillée du comportement signalé.
    [Required]
    [MaxLength(1000)]
    public string Description { get; set; } = string.Empty;
}