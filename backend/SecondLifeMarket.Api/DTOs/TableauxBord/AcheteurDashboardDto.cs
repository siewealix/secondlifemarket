namespace SecondLifeMarket.Api.DTOs.TableauxBord;

public class AcheteurDashboardDto
{
    // Nombre total de demandes d'achat envoyées par l'acheteur.
    public int NombreDemandesEnvoyees { get; set; }

    // Nombre de demandes encore en attente.
    public int NombreDemandesEnAttente { get; set; }

    // Nombre de demandes acceptées par les vendeurs.
    public int NombreDemandesAcceptees { get; set; }

    // Nombre de demandes refusées par les vendeurs.
    public int NombreDemandesRefusees { get; set; }

    // Nombre de demandes annulées par l'acheteur.
    public int NombreDemandesAnnulees { get; set; }

    // Nombre de conversations liées aux demandes d'achat.
    public int NombreConversations { get; set; }

    // Nombre d'annonces disponibles sur la plateforme.
    public int NombreAnnoncesDisponibles { get; set; }

    // Message simple pour le frontend.
    public string Message { get; set; } = string.Empty;
}