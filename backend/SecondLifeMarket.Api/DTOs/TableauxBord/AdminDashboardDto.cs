namespace SecondLifeMarket.Api.DTOs.TableauxBord;

public class AdminDashboardDto
{
    // Nombre total de membres.
    public int NombreTotalMembres { get; set; }

    // Nombre de membres actifs.
    public int NombreMembresActifs { get; set; }

    // Nombre de membres suspendus.
    public int NombreMembresSuspendus { get; set; }

    // Nombre total d'annonces actives.
    public int NombreTotalAnnonces { get; set; }

    // Nombre d'annonces disponibles.
    public int NombreAnnoncesDisponibles { get; set; }

    // Nombre d'annonces en création.
    public int NombreAnnoncesEnCreation { get; set; }

    // Nombre d'annonces en réexamen administrateur.
    public int NombreAnnoncesEnReexamen { get; set; }

    // Nombre d'annonces rejetées.
    public int NombreAnnoncesRejetees { get; set; }

    // Nombre d'annonces vendues.
    public int NombreAnnoncesVendues { get; set; }

    // Nombre total de demandes d'achat.
    public int NombreTotalDemandesAchat { get; set; }

    // Nombre de demandes d'achat en attente.
    public int NombreDemandesEnAttente { get; set; }

    // Nombre de demandes d'achat acceptées.
    public int NombreDemandesAcceptees { get; set; }

    // Nombre de demandes d'achat refusées.
    public int NombreDemandesRefusees { get; set; }

    // Nombre de signalements d'annonces en attente.
    public int NombreSignalementsAnnoncesEnAttente { get; set; }

    // Nombre de signalements d'utilisateurs en attente.
    public int NombreSignalementsUtilisateursEnAttente { get; set; }

    // Nombre total de signalements en attente.
    public int NombreTotalSignalementsEnAttente { get; set; }

    // Nombre total d'abonnements.
    public int NombreTotalAbonnements { get; set; }

    // Nombre d'abonnements actifs.
    public int NombreAbonnementsActifs { get; set; }

    // Nombre d'abonnements expirés.
    public int NombreAbonnementsExpires { get; set; }

    // Message général.
    public string Message { get; set; } = string.Empty;
}