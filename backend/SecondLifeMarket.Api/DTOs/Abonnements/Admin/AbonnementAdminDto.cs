namespace SecondLifeMarket.Api.DTOs.Abonnements.Admin;

public class AbonnementAdminDto
{
    // Identifiant de l'abonnement.
    public int Id { get; set; }

    // Nom du type d'abonnement.
    public string TypeAbonnement { get; set; } = string.Empty;

    // Identifiant du type d'abonnement lié.
    public int TypeAbonnementId { get; set; }

    // Date de début.
    public DateTime DateDebut { get; set; }

    // Date de fin.
    public DateTime DateFin { get; set; }

    // Statut de l'abonnement.
    public string StatutAbonnement { get; set; } = string.Empty;

    // Limite de publication.
    public int LimitePublication { get; set; }

    // Identifiant du membre.
    public int UtilisateurId { get; set; }

    // Nom complet du membre.
    public string UtilisateurNomComplet { get; set; } = string.Empty;

    // Email du membre.
    public string UtilisateurEmail { get; set; } = string.Empty;
}