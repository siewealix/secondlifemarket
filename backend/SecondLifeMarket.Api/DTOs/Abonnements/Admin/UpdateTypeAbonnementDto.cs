using System.ComponentModel.DataAnnotations;

namespace SecondLifeMarket.Api.DTOs.Abonnements.Admin;

public class UpdateTypeAbonnementDto
{
    // Nom de l'offre.
    [Required]
    [MaxLength(50)]
    public string Nom { get; set; } = string.Empty;

    // Description de l'offre.
    [Required]
    [MaxLength(1000)]
    public string Description { get; set; } = string.Empty;

    // Prix de l'offre.
    [Range(0, 10000000)]
    public decimal Prix { get; set; }

    // Durée de l'offre en jours.
    [Range(1, 3650)]
    public int DureeJours { get; set; }

    // Limite de publication.
    [Range(1, 100000)]
    public int LimitePublication { get; set; }
}