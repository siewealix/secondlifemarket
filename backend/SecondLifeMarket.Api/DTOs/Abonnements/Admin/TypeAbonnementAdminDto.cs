namespace SecondLifeMarket.Api.DTOs.Abonnements.Admin;

public class TypeAbonnementAdminDto
{
    // Identifiant du type d'abonnement.
    public int Id { get; set; }

    // Nom de l'offre.
    public string Nom { get; set; } = string.Empty;

    // Description de l'offre.
    public string Description { get; set; } = string.Empty;

    // Prix de l'offre.
    public decimal Prix { get; set; }

    // Durée de l'offre en jours.
    public int DureeJours { get; set; }

    // Limite de publication.
    public int LimitePublication { get; set; }

    // Indique si l'offre est active.
    public bool EstActif { get; set; }

    // Date de création.
    public DateTime DateCreation { get; set; }

    // Date de modification.
    public DateTime? DateModification { get; set; }
}