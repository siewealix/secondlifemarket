namespace SecondLifeMarket.Api.DTOs.Abonnements;

public class AbonnementDto
{
    // Identifiant unique de l'abonnement.
    public int Id { get; set; }

    // Type d'abonnement choisi.
    public string TypeAbonnement { get; set; } = string.Empty;

    // Date de début de l'abonnement.
    public DateTime DateDebut { get; set; }

    // Date de fin de l'abonnement.
    public DateTime DateFin { get; set; }

    // Statut actuel de l'abonnement.
    public string StatutAbonnement { get; set; } = string.Empty;

    // Limite de publication autorisée.
    public int LimitePublication { get; set; }

    // Identifiant du membre abonné.
    public int UtilisateurId { get; set; }

    // Nom complet du membre abonné.
    public string UtilisateurNomComplet { get; set; } = string.Empty;
}