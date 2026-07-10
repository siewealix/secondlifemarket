namespace SecondLifeMarket.Api.DTOs.Abonnements;

public class OffreAbonnementDto
{
    // Type de l'abonnement.
    public string TypeAbonnement { get; set; } = string.Empty;

    // Description de l'abonnement.
    public string Description { get; set; } = string.Empty;

    // Prix de l'abonnement.
    public decimal Prix { get; set; }

    // Durée de l'abonnement en jours.
    public int DureeJours { get; set; }

    // Limite de publication autorisée.
    public int LimitePublication { get; set; }
}