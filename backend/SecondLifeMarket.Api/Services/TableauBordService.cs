using Microsoft.EntityFrameworkCore;
using SecondLifeMarket.Api.Data;
using SecondLifeMarket.Api.DTOs.TableauxBord;
using SecondLifeMarket.Api.Models;
using SecondLifeMarket.Api.Services.Interfaces;

namespace SecondLifeMarket.Api.Services;

public class TableauBordService : ITableauBordService
{
    // Limite gratuite pour un vendeur sans abonnement.
    private const int LimiteGratuitePublication = 3;

    // Contexte de base de données.
    private readonly ApplicationDbContext _context;

    // Constructeur du service.
    public TableauBordService(ApplicationDbContext context)
    {
        // On garde le contexte dans une variable privée.
        _context = context;
    }

    // Retourne les statistiques du tableau de bord vendeur.
    public async Task<VendeurDashboardDto> GetVendeurDashboardAsync(int utilisateurId)
    {
        // On cherche l'utilisateur connecté.
        Utilisateur? utilisateur = await _context.Utilisateurs
            .FirstOrDefaultAsync(item => item.Id == utilisateurId);

        // On vérifie si l'utilisateur existe.
        if (utilisateur == null)
        {
            // On bloque si l'utilisateur est introuvable.
            throw new InvalidOperationException("Utilisateur introuvable.");
        }

        // On vérifie si le compte est actif.
        if (!utilisateur.EstActif)
        {
            // On bloque si le compte est suspendu.
            throw new InvalidOperationException("Votre compte est suspendu.");
        }

        // On vérifie si l'utilisateur est un membre.
        if (utilisateur.Role != "Membre")
        {
            // On bloque les autres rôles.
            throw new InvalidOperationException("Seuls les membres peuvent accéder au tableau de bord vendeur.");
        }

        // On récupère la limite de publication actuelle.
        int limitePublication = await GetLimitePublicationAsync(utilisateurId);

        // On compte les publications utilisées.
        int publicationsUtilisees = await _context.Annonces
            .CountAsync(item =>
                item.UtilisateurId == utilisateurId &&
                item.EstActive &&
                item.Statut != "En création"
            );

        // On calcule les publications restantes.
        int publicationsRestantes = limitePublication - publicationsUtilisees;

        // On évite un nombre négatif.
        if (publicationsRestantes < 0)
        {
            // On remet à zéro.
            publicationsRestantes = 0;
        }

        // On compte toutes les annonces actives du vendeur.
        int nombreTotalAnnonces = await _context.Annonces
            .CountAsync(item =>
                item.UtilisateurId == utilisateurId &&
                item.EstActive
            );

        // On compte les annonces disponibles.
        int nombreAnnoncesDisponibles = await _context.Annonces
            .CountAsync(item =>
                item.UtilisateurId == utilisateurId &&
                item.EstActive &&
                item.Statut == "Disponible"
            );

        // On compte les annonces en création.
        int nombreAnnoncesEnCreation = await _context.Annonces
            .CountAsync(item =>
                item.UtilisateurId == utilisateurId &&
                item.EstActive &&
                item.Statut == "En création"
            );

        // On compte les annonces en réexamen admin.
        int nombreAnnoncesEnReexamen = await _context.Annonces
            .CountAsync(item =>
                item.UtilisateurId == utilisateurId &&
                item.EstActive &&
                item.Statut == "En réexamen admin"
            );

        // On compte les annonces vendues.
        int nombreAnnoncesVendues = await _context.Annonces
            .CountAsync(item =>
                item.UtilisateurId == utilisateurId &&
                item.EstActive &&
                item.Statut == "Vendu"
            );

        // On compte les demandes reçues par le vendeur.
        int nombreDemandesRecues = await _context.DemandesAchat
            .Include(item => item.Annonce)
            .CountAsync(item =>
                item.Annonce != null &&
                item.Annonce.UtilisateurId == utilisateurId
            );

        // On compte les demandes en attente.
        int nombreDemandesEnAttente = await _context.DemandesAchat
            .Include(item => item.Annonce)
            .CountAsync(item =>
                item.Annonce != null &&
                item.Annonce.UtilisateurId == utilisateurId &&
                item.Statut == "En attente"
            );

        // On compte les demandes acceptées.
        int nombreDemandesAcceptees = await _context.DemandesAchat
            .Include(item => item.Annonce)
            .CountAsync(item =>
                item.Annonce != null &&
                item.Annonce.UtilisateurId == utilisateurId &&
                item.Statut == "Acceptée"
            );

        // On prépare le message de publication.
        string messagePublication = publicationsRestantes > 0
            ? $"Vous pouvez encore publier {publicationsRestantes} annonce(s)."
            : "Vous avez atteint votre limite de publication.";

        // On retourne les statistiques.
        return new VendeurDashboardDto
        {
            // Total des annonces.
            NombreTotalAnnonces = nombreTotalAnnonces,

            // Annonces disponibles.
            NombreAnnoncesDisponibles = nombreAnnoncesDisponibles,

            // Annonces en création.
            NombreAnnoncesEnCreation = nombreAnnoncesEnCreation,

            // Annonces en réexamen.
            NombreAnnoncesEnReexamen = nombreAnnoncesEnReexamen,

            // Annonces vendues.
            NombreAnnoncesVendues = nombreAnnoncesVendues,

            // Demandes reçues.
            NombreDemandesRecues = nombreDemandesRecues,

            // Demandes en attente.
            NombreDemandesEnAttente = nombreDemandesEnAttente,

            // Demandes acceptées.
            NombreDemandesAcceptees = nombreDemandesAcceptees,

            // Limite actuelle.
            LimitePublication = limitePublication,

            // Publications utilisées.
            PublicationsUtilisees = publicationsUtilisees,

            // Publications restantes.
            PublicationsRestantes = publicationsRestantes,

            // Possibilité de publier.
            PeutEncorePublier = publicationsRestantes > 0,

            // Message pour le frontend.
            MessagePublication = messagePublication
        };
    }

    // Méthode qui récupère la limite de publication du vendeur.
    private async Task<int> GetLimitePublicationAsync(int utilisateurId)
    {
        // On récupère la date actuelle.
        DateTime now = DateTime.UtcNow;

        // On cherche l'abonnement du vendeur.
        Abonnement? abonnement = await _context.Abonnements
            .FirstOrDefaultAsync(item => item.UtilisateurId == utilisateurId);

        // Si aucun abonnement n'existe, on retourne la limite gratuite.
        if (abonnement == null)
        {
            // Limite gratuite.
            return LimiteGratuitePublication;
        }

        // On vérifie si l'abonnement est expiré.
        bool abonnementExpire = abonnement.DateFin < now;

        // Si l'abonnement est expiré et encore actif, on corrige son statut.
        if (abonnementExpire && abonnement.StatutAbonnement == "Actif")
        {
            // On marque l'abonnement comme expiré.
            abonnement.StatutAbonnement = "Expiré";

            // On sauvegarde.
            await _context.SaveChangesAsync();
        }

        // Si l'abonnement est expiré, on retourne la limite gratuite.
        if (abonnementExpire)
        {
            // Limite gratuite.
            return LimiteGratuitePublication;
        }

        // Si l'abonnement n'est pas actif, on retourne la limite gratuite.
        if (abonnement.StatutAbonnement != "Actif")
        {
            // Limite gratuite.
            return LimiteGratuitePublication;
        }

        // On retourne la limite de l'abonnement actif.
        return abonnement.LimitePublication;
    }

    // Retourne les statistiques du tableau de bord acheteur.
    public async Task<AcheteurDashboardDto> GetAcheteurDashboardAsync(int utilisateurId)
    {
        // On cherche l'utilisateur connecté.
        Utilisateur? utilisateur = await _context.Utilisateurs
            .FirstOrDefaultAsync(item => item.Id == utilisateurId);

        // On vérifie si l'utilisateur existe.
        if (utilisateur == null)
        {
            // On bloque si l'utilisateur est introuvable.
            throw new InvalidOperationException("Utilisateur introuvable.");
        }

        // On vérifie si le compte est actif.
        if (!utilisateur.EstActif)
        {
            // On bloque si le compte est suspendu.
            throw new InvalidOperationException("Votre compte est suspendu.");
        }

        // On vérifie si l'utilisateur est un membre.
        if (utilisateur.Role != "Membre")
        {
            // On bloque les autres rôles.
            throw new InvalidOperationException("Seuls les membres peuvent accéder au tableau de bord acheteur.");
        }

        // On compte toutes les demandes envoyées.
        int nombreDemandesEnvoyees = await _context.DemandesAchat
            .CountAsync(item => item.AcheteurId == utilisateurId);

        // On compte les demandes en attente.
        int nombreDemandesEnAttente = await _context.DemandesAchat
            .CountAsync(item =>
                item.AcheteurId == utilisateurId &&
                item.Statut == "En attente"
            );

        // On compte les demandes acceptées.
        int nombreDemandesAcceptees = await _context.DemandesAchat
            .CountAsync(item =>
                item.AcheteurId == utilisateurId &&
                item.Statut == "Acceptée"
            );

        // On compte les demandes refusées.
        int nombreDemandesRefusees = await _context.DemandesAchat
            .CountAsync(item =>
                item.AcheteurId == utilisateurId &&
                item.Statut == "Refusée"
            );

        // On compte les demandes annulées.
        int nombreDemandesAnnulees = await _context.DemandesAchat
            .CountAsync(item =>
                item.AcheteurId == utilisateurId &&
                item.Statut == "Annulée"
            );

        // On compte les conversations de l'acheteur.
        int nombreConversations = await _context.Conversations
            .CountAsync(item =>
                item.DemandeAchat != null &&
                item.DemandeAchat.AcheteurId == utilisateurId
            );

        // On compte les annonces actuellement disponibles.
        int nombreAnnoncesDisponibles = await _context.Annonces
            .CountAsync(item =>
                item.EstActive &&
                item.Statut == "Disponible"
            );

        // On prépare un message simple.
        string message = nombreDemandesEnvoyees == 0
            ? "Vous n'avez pas encore envoyé de demande d'achat."
            : $"Vous avez envoyé {nombreDemandesEnvoyees} demande(s) d'achat.";

        // On retourne les statistiques.
        return new AcheteurDashboardDto
        {
            // Total des demandes envoyées.
            NombreDemandesEnvoyees = nombreDemandesEnvoyees,

            // Demandes en attente.
            NombreDemandesEnAttente = nombreDemandesEnAttente,

            // Demandes acceptées.
            NombreDemandesAcceptees = nombreDemandesAcceptees,

            // Demandes refusées.
            NombreDemandesRefusees = nombreDemandesRefusees,

            // Demandes annulées.
            NombreDemandesAnnulees = nombreDemandesAnnulees,

            // Conversations.
            NombreConversations = nombreConversations,

            // Annonces disponibles.
            NombreAnnoncesDisponibles = nombreAnnoncesDisponibles,

            // Message simple.
            Message = message
        };
    }

    // Retourne les statistiques du tableau de bord administrateur.
    public async Task<AdminDashboardDto> GetAdminDashboardAsync(int utilisateurId)
    {
        // On cherche l'utilisateur connecté.
        Utilisateur? utilisateur = await _context.Utilisateurs
            .FirstOrDefaultAsync(item => item.Id == utilisateurId);

        // On vérifie si l'utilisateur existe.
        if (utilisateur == null)
        {
            // On bloque si l'utilisateur est introuvable.
            throw new InvalidOperationException("Utilisateur introuvable.");
        }

        // On vérifie si le compte est actif.
        if (!utilisateur.EstActif)
        {
            // On bloque si le compte est suspendu.
            throw new InvalidOperationException("Votre compte est suspendu.");
        }

        // On vérifie si l'utilisateur est administrateur.
        if (utilisateur.Role != "Administrateur")
        {
            // On bloque les simples membres.
            throw new UnauthorizedAccessException("Seul un administrateur peut accéder à ce tableau de bord.");
        }

        // On récupère la date actuelle.
        DateTime now = DateTime.UtcNow;

        // On cherche les abonnements expirés encore marqués actifs.
        List<Abonnement> abonnementsExpires = await _context.Abonnements
            .Where(item =>
                item.StatutAbonnement == "Actif" &&
                item.DateFin < now
            )
            .ToListAsync();

        // On parcourt les abonnements expirés.
        foreach (Abonnement abonnement in abonnementsExpires)
        {
            // On marque l'abonnement comme expiré.
            abonnement.StatutAbonnement = "Expiré";
        }

        // On sauvegarde si des abonnements ont été corrigés.
        if (abonnementsExpires.Count > 0)
        {
            // On sauvegarde les modifications.
            await _context.SaveChangesAsync();
        }

        // On compte tous les membres.
        int nombreTotalMembres = await _context.Utilisateurs
            .CountAsync(item => item.Role == "Membre");

        // On compte les membres actifs.
        int nombreMembresActifs = await _context.Utilisateurs
            .CountAsync(item =>
                item.Role == "Membre" &&
                item.EstActif
            );

        // On compte les membres suspendus.
        int nombreMembresSuspendus = await _context.Utilisateurs
            .CountAsync(item =>
                item.Role == "Membre" &&
                !item.EstActif
            );

        // On compte toutes les annonces actives.
        int nombreTotalAnnonces = await _context.Annonces
            .CountAsync(item => item.EstActive);

        // On compte les annonces disponibles.
        int nombreAnnoncesDisponibles = await _context.Annonces
            .CountAsync(item =>
                item.EstActive &&
                item.Statut == "Disponible"
            );

        // On compte les annonces en création.
        int nombreAnnoncesEnCreation = await _context.Annonces
            .CountAsync(item =>
                item.EstActive &&
                item.Statut == "En création"
            );

        // On compte les annonces en réexamen admin.
        int nombreAnnoncesEnReexamen = await _context.Annonces
            .CountAsync(item =>
                item.EstActive &&
                item.Statut == "En réexamen admin"
            );

        // On compte les annonces rejetées.
        int nombreAnnoncesRejetees = await _context.Annonces
            .CountAsync(item =>
                item.EstActive &&
                item.Statut == "Rejetée"
            );

        // On compte les annonces vendues.
        int nombreAnnoncesVendues = await _context.Annonces
            .CountAsync(item =>
                item.EstActive &&
                item.Statut == "Vendu"
            );

        // On compte toutes les demandes d'achat.
        int nombreTotalDemandesAchat = await _context.DemandesAchat
            .CountAsync();

        // On compte les demandes en attente.
        int nombreDemandesEnAttente = await _context.DemandesAchat
            .CountAsync(item => item.Statut == "En attente");

        // On compte les demandes acceptées.
        int nombreDemandesAcceptees = await _context.DemandesAchat
            .CountAsync(item => item.Statut == "Acceptée");

        // On compte les demandes refusées.
        int nombreDemandesRefusees = await _context.DemandesAchat
            .CountAsync(item => item.Statut == "Refusée");

        // On compte les signalements d'annonces en attente.
        int nombreSignalementsAnnoncesEnAttente = await _context.SignalementsAnnonces
            .CountAsync(item => item.StatutSignalement == "En attente");

        // On compte les signalements d'utilisateurs en attente.
        int nombreSignalementsUtilisateursEnAttente = await _context.SignalementsUtilisateurs
            .CountAsync(item => item.StatutSignalement == "En attente");

        // On calcule le total des signalements en attente.
        int nombreTotalSignalementsEnAttente =
            nombreSignalementsAnnoncesEnAttente + nombreSignalementsUtilisateursEnAttente;

        // On compte tous les abonnements.
        int nombreTotalAbonnements = await _context.Abonnements
            .CountAsync();

        // On compte les abonnements actifs.
        int nombreAbonnementsActifs = await _context.Abonnements
            .CountAsync(item =>
                item.StatutAbonnement == "Actif" &&
                item.DateFin >= now
            );

        // On compte les abonnements expirés.
        int nombreAbonnementsExpires = await _context.Abonnements
            .CountAsync(item =>
                item.StatutAbonnement == "Expiré" ||
                item.DateFin < now
            );

        // On prépare le message général.
        string message = nombreTotalSignalementsEnAttente > 0
            ? $"Il y a {nombreTotalSignalementsEnAttente} signalement(s) en attente."
            : "Aucun signalement en attente.";

        // On retourne les statistiques.
        return new AdminDashboardDto
        {
            // Membres.
            NombreTotalMembres = nombreTotalMembres,
            NombreMembresActifs = nombreMembresActifs,
            NombreMembresSuspendus = nombreMembresSuspendus,

            // Annonces.
            NombreTotalAnnonces = nombreTotalAnnonces,
            NombreAnnoncesDisponibles = nombreAnnoncesDisponibles,
            NombreAnnoncesEnCreation = nombreAnnoncesEnCreation,
            NombreAnnoncesEnReexamen = nombreAnnoncesEnReexamen,
            NombreAnnoncesRejetees = nombreAnnoncesRejetees,
            NombreAnnoncesVendues = nombreAnnoncesVendues,

            // Demandes d'achat.
            NombreTotalDemandesAchat = nombreTotalDemandesAchat,
            NombreDemandesEnAttente = nombreDemandesEnAttente,
            NombreDemandesAcceptees = nombreDemandesAcceptees,
            NombreDemandesRefusees = nombreDemandesRefusees,

            // Signalements.
            NombreSignalementsAnnoncesEnAttente = nombreSignalementsAnnoncesEnAttente,
            NombreSignalementsUtilisateursEnAttente = nombreSignalementsUtilisateursEnAttente,
            NombreTotalSignalementsEnAttente = nombreTotalSignalementsEnAttente,

            // Abonnements.
            NombreTotalAbonnements = nombreTotalAbonnements,
            NombreAbonnementsActifs = nombreAbonnementsActifs,
            NombreAbonnementsExpires = nombreAbonnementsExpires,

            // Message.
            Message = message
        };
    }
}