namespace SecondLifeMarket.Api.DTOs.TableauxBord;

public class VendeurDashboardDto
{
    // Nombre total d'annonces du vendeur.
    public int NombreTotalAnnonces { get; set; }

    // Nombre d'annonces disponibles publiquement.
    public int NombreAnnoncesDisponibles { get; set; }

    // Nombre d'annonces encore en création.
    public int NombreAnnoncesEnCreation { get; set; }

    // Nombre d'annonces envoyées en réexamen admin.
    public int NombreAnnoncesEnReexamen { get; set; }

    // Nombre d'annonces vendues.
    public int NombreAnnoncesVendues { get; set; }

    // Nombre total de demandes reçues.
    public int NombreDemandesRecues { get; set; }

    // Nombre de demandes en attente.
    public int NombreDemandesEnAttente { get; set; }

    // Nombre de demandes acceptées.
    public int NombreDemandesAcceptees { get; set; }

    // Limite actuelle de publication.
    public int LimitePublication { get; set; }

    // Nombre de publications déjà utilisées.
    public int PublicationsUtilisees { get; set; }

    // Nombre de publications restantes.
    public int PublicationsRestantes { get; set; }

    // Indique si le vendeur peut encore publier.
    public bool PeutEncorePublier { get; set; }

    // Message simple pour le frontend.
    public string MessagePublication { get; set; } = string.Empty;
}