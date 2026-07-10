using Microsoft.EntityFrameworkCore;
using SecondLifeMarket.Api.Data;
using SecondLifeMarket.Api.DTOs.DemandesAchat;
using SecondLifeMarket.Api.Models;
using SecondLifeMarket.Api.Services.Interfaces;

namespace SecondLifeMarket.Api.Services;

public class DemandeAchatService : IDemandeAchatService
{
    // Contexte de base de données utilisé par le service.
    private readonly ApplicationDbContext _context;

    // Constructeur du service.
    public DemandeAchatService(ApplicationDbContext context)
    {
        // On garde le contexte dans une variable privée.
        _context = context;
    }

    // Méthode qui crée une demande d'achat.
    public async Task<DemandeAchatDto> CreateDemandeAchatAsync(CreateDemandeAchatDto dto, int acheteurId)
    {
        // On cherche l'annonce concernée avec son vendeur.
        Annonce? annonce = await _context.Annonces
            .Include(item => item.Utilisateur)
            .FirstOrDefaultAsync(item => item.Id == dto.AnnonceId);

        // On vérifie si l'annonce existe.
        if (annonce == null)
        {
            // On bloque si l'annonce n'existe pas.
            throw new InvalidOperationException("Annonce introuvable.");
        }

        // On vérifie si l'annonce est active.
        if (!annonce.EstActive)
        {
            // On bloque si l'annonce est inactive.
            throw new InvalidOperationException("Cette annonce n'est pas active.");
        }

        // On vérifie si l'annonce est disponible publiquement.
        if (annonce.Statut != "Disponible")
        {
            // On bloque si l'annonce n'est pas disponible.
            throw new InvalidOperationException("Cette annonce n'est pas disponible pour une demande d'achat.");
        }

        // On empêche le vendeur d'acheter sa propre annonce.
        if (annonce.UtilisateurId == acheteurId)
        {
            // On bloque si l'acheteur est aussi le vendeur.
            throw new InvalidOperationException("Vous ne pouvez pas faire une demande d'achat sur votre propre annonce.");
        }

        // On vérifie si l'acheteur a déjà une demande active sur cette annonce.
        bool demandeExistante = await _context.DemandesAchat
            .AnyAsync(item =>
                item.AnnonceId == annonce.Id &&
                item.AcheteurId == acheteurId &&
                (item.Statut == "En attente" || item.Statut == "Acceptée"));

        // On bloque les doublons actifs.
        if (demandeExistante)
        {
            // On empêche une deuxième demande active sur la même annonce.
            throw new InvalidOperationException("Vous avez déjà une demande active sur cette annonce.");
        }

        // On crée la demande d'achat.
        DemandeAchat demande = new()
        {
            // On relie la demande à l'annonce.
            AnnonceId = annonce.Id,

            // On relie la demande à l'acheteur connecté.
            AcheteurId = acheteurId,

            // On nettoie le message envoyé par l'acheteur.
            Message = dto.Message.Trim(),

            // On met le statut initial.
            Statut = "En attente",

            // On met la date de création.
            DateDemande = DateTime.UtcNow
        };

        // On ajoute la demande dans le contexte.
        _context.DemandesAchat.Add(demande);

        // On sauvegarde la demande dans MySQL.
        await _context.SaveChangesAsync();

        // On recharge la demande avec toutes les informations utiles.
        DemandeAchat demandeCreee = await _context.DemandesAchat
            .Include(item => item.Annonce)
            .ThenInclude(item => item!.Utilisateur)
            .Include(item => item.Acheteur)
            .FirstAsync(item => item.Id == demande.Id);

        // On retourne la demande au format DTO.
        return ToDto(demandeCreee);
    }

    // Méthode qui transforme une demande en DTO.
    private static DemandeAchatDto ToDto(DemandeAchat demande)
    {
        // On retourne un objet simple pour le frontend.
        return new DemandeAchatDto
        {
            // On retourne l'identifiant.
            Id = demande.Id,

            // On retourne le message.
            Message = demande.Message,

            // On retourne le statut.
            Statut = demande.Statut,

            // On retourne la date de demande.
            DateDemande = demande.DateDemande,

            // On retourne l'identifiant de l'annonce.
            AnnonceId = demande.AnnonceId,

            // On retourne le titre de l'annonce.
            AnnonceTitre = demande.Annonce?.Titre ?? string.Empty,

            // On retourne le prix de l'annonce.
            AnnoncePrix = demande.Annonce?.Prix ?? 0,

            // On retourne la photo principale de l'annonce.
            AnnoncePhotoUrl = demande.Annonce?.Photos
            .OrderByDescending(photo => photo.EstPrincipale)
            .Select(photo => photo.Url)
            .FirstOrDefault() ?? string.Empty,

            // On retourne l'identifiant de l'acheteur.
            AcheteurId = demande.AcheteurId,

            // On retourne le nom complet de l'acheteur.
            AcheteurNomComplet = $"{demande.Acheteur?.Prenom} {demande.Acheteur?.Nom}".Trim(),

            // On retourne l'identifiant du vendeur.
            VendeurId = demande.Annonce?.UtilisateurId ?? 0,

            // On retourne le nom complet du vendeur.
            VendeurNomComplet = $"{demande.Annonce?.Utilisateur?.Prenom} {demande.Annonce?.Utilisateur?.Nom}".Trim()
        };
    }

    // Méthode qui retourne les demandes d'achat envoyées par un acheteur.
    public async Task<List<DemandeAchatDto>> GetMyDemandesAchatAsync(int acheteurId)
    {
        // On cherche toutes les demandes envoyées par l'acheteur connecté.
        List<DemandeAchat> demandes = await _context.DemandesAchat
            // On charge l'annonce liée à chaque demande.
            .Include(item => item.Annonce)
            // On charge le vendeur de l'annonce.
            .ThenInclude(item => item!.Utilisateur)
            // On charge encore l'annonce liée à chaque demande.
            .Include(item => item.Annonce)
            // On charge les photos de l'annonce.
            .ThenInclude(item => item!.Photos)
            // On charge l'acheteur.
            .Include(item => item.Acheteur)
            // On garde seulement les demandes de l'acheteur connecté.
            .Where(item => item.AcheteurId == acheteurId)
            // On affiche les demandes les plus récentes en premier.
            .OrderByDescending(item => item.DateDemande)
            // On exécute la requête SQL.
            .ToListAsync();

        // On transforme les demandes en DTOs.
        return demandes.Select(ToDto).ToList();
    }

    // Méthode qui annule une demande d'achat.
    public async Task<DemandeAchatDto> CancelDemandeAchatAsync(int demandeId, int acheteurId)
    {
        // On cherche la demande avec son annonce.
        DemandeAchat? demande = await _context.DemandesAchat
            // On charge l'annonce liée à la demande.
            .Include(item => item.Annonce)
            // On charge le vendeur de l'annonce.
            .ThenInclude(item => item!.Utilisateur)
            // On charge encore l'annonce liée à la demande.
            .Include(item => item.Annonce)
            // On charge les photos de l'annonce.
            .ThenInclude(item => item!.Photos)
            // On charge l'acheteur de la demande.
            .Include(item => item.Acheteur)
            // On cherche la demande par son identifiant.
            .FirstOrDefaultAsync(item => item.Id == demandeId);

        // On vérifie si la demande existe.
        if (demande == null)
        {
            // On bloque si la demande est introuvable.
            throw new InvalidOperationException("Demande d'achat introuvable.");
        }

        // On vérifie si la demande appartient à l'acheteur connecté.
        if (demande.AcheteurId != acheteurId)
        {
            // On bloque si l'utilisateur essaie d'annuler la demande d'un autre membre.
            throw new UnauthorizedAccessException("Vous n'avez pas le droit d'annuler cette demande d'achat.");
        }

        // On vérifie si la demande est encore en attente.
        if (demande.Statut != "En attente")
        {
            // On bloque si la demande est déjà traitée ou annulée.
            throw new InvalidOperationException("Seule une demande en attente peut être annulée.");
        }

        // On change le statut de la demande.
        demande.Statut = "Annulée";

        // On sauvegarde la modification dans MySQL.
        await _context.SaveChangesAsync();

        // On retourne la demande mise à jour.
        return ToDto(demande);
    }

    // Méthode qui retourne les demandes d'achat reçues par un vendeur.
    public async Task<List<DemandeAchatDto>> GetDemandesRecuesAsync(int vendeurId)
    {
        // On cherche toutes les demandes liées aux annonces du vendeur connecté.
        List<DemandeAchat> demandes = await _context.DemandesAchat
            // On charge l'annonce liée à chaque demande.
            .Include(item => item.Annonce)
            // On charge le vendeur de l'annonce.
            .ThenInclude(item => item!.Utilisateur)
            // On charge encore l'annonce liée à chaque demande.
            .Include(item => item.Annonce)
            // On charge les photos de l'annonce.
            .ThenInclude(item => item!.Photos)
            // On charge l'acheteur qui a envoyé la demande.
            .Include(item => item.Acheteur)
            // On garde seulement les demandes reçues sur les annonces du vendeur connecté.
            .Where(item => item.Annonce != null && item.Annonce.UtilisateurId == vendeurId)
            // On affiche les demandes les plus récentes en premier.
            .OrderByDescending(item => item.DateDemande)
            // On exécute la requête SQL.
            .ToListAsync();

        // On transforme les demandes en DTOs.
        return demandes.Select(ToDto).ToList();
    }

    // Méthode qui accepte une demande d'achat.
    public async Task<DemandeAchatDto> AcceptDemandeAchatAsync(int demandeId, int vendeurId)
    {
        // On appelle une méthode commune pour changer le statut.
        return await UpdateDemandeAchatStatutBySellerAsync(demandeId, vendeurId, "Acceptée");
    }

    // Méthode qui refuse une demande d'achat.
    public async Task<DemandeAchatDto> RefuseDemandeAchatAsync(int demandeId, int vendeurId)
    {
        // On appelle une méthode commune pour changer le statut.
        return await UpdateDemandeAchatStatutBySellerAsync(demandeId, vendeurId, "Refusée");
    }

    // Méthode privée utilisée pour accepter ou refuser une demande.
    private async Task<DemandeAchatDto> UpdateDemandeAchatStatutBySellerAsync(int demandeId, int vendeurId, string nouveauStatut)
    {
        // On cherche la demande avec son annonce.
        DemandeAchat? demande = await _context.DemandesAchat
            // On charge l'annonce liée à la demande.
            .Include(item => item.Annonce)
            // On charge le vendeur de l'annonce.
            .ThenInclude(item => item!.Utilisateur)
            // On charge encore l'annonce liée à la demande.
            .Include(item => item.Annonce)
            // On charge les photos de l'annonce.
            .ThenInclude(item => item!.Photos)
            // On charge l'acheteur de la demande.
            .Include(item => item.Acheteur)
            // On cherche la demande par son identifiant.
            .FirstOrDefaultAsync(item => item.Id == demandeId);

        // On vérifie si la demande existe.
        if (demande == null)
        {
            // On bloque si la demande est introuvable.
            throw new InvalidOperationException("Demande d'achat introuvable.");
        }

        // On vérifie si l'annonce liée existe.
        if (demande.Annonce == null)
        {
            // On bloque si la demande n'a pas d'annonce liée.
            throw new InvalidOperationException("Annonce liée à la demande introuvable.");
        }

        // On vérifie si le vendeur connecté est bien le propriétaire de l'annonce.
        if (demande.Annonce.UtilisateurId != vendeurId)
        {
            // On bloque si le vendeur essaie de traiter une demande qui ne lui appartient pas.
            throw new UnauthorizedAccessException("Vous n'avez pas le droit de traiter cette demande d'achat.");
        }

        // On vérifie si la demande est encore en attente.
        if (demande.Statut != "En attente")
        {
            // On bloque si la demande est déjà traitée ou annulée.
            throw new InvalidOperationException("Seule une demande en attente peut être traitée.");
        }

        // On change le statut de la demande.
        demande.Statut = nouveauStatut;

        // On sauvegarde la modification dans MySQL.
        await _context.SaveChangesAsync();

        // On retourne la demande mise à jour.
        return ToDto(demande);
    }
}