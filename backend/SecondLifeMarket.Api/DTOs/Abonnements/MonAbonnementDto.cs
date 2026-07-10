namespace SecondLifeMarket.Api.DTOs.Abonnements;

public class MonAbonnementDto
{
    // Indique si le membre possède une ligne d'abonnement en base.
    public bool AUnAbonnement { get; set; }

    // Indique si l'abonnement est actuellement actif.
    public bool AbonnementActif { get; set; }

    // Type d'abonnement actuel.
    public string TypeAbonnement { get; set; } = string.Empty;

    // Date de début de l'abonnement.
    public DateTime? DateDebut { get; set; }

    // Date de fin de l'abonnement.
    public DateTime? DateFin { get; set; }

    // Statut actuel de l'abonnement.
    public string StatutAbonnement { get; set; } = string.Empty;

    // Limite actuelle de publication.
    public int LimitePublication { get; set; }

    // Nombre de publications déjà utilisées.
    public int NombrePublicationsUtilisees { get; set; }

    // Nombre de publications restantes.
    public int NombrePublicationsRestantes { get; set; }

    // Indique si le membre peut encore publier.
    public bool PeutPublier { get; set; }

    // Message explicatif pour le frontend.
    public string Message { get; set; } = string.Empty;
}