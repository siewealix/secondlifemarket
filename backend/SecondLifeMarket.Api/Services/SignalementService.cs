using Microsoft.EntityFrameworkCore;
using SecondLifeMarket.Api.Data;
using SecondLifeMarket.Api.DTOs.Signalements;
using SecondLifeMarket.Api.Models;
using SecondLifeMarket.Api.Services.Interfaces;

namespace SecondLifeMarket.Api.Services;

public class SignalementService : ISignalementService
{
    // Contexte de base de données utilisé par le service.
    private readonly ApplicationDbContext _context;

    // Constructeur du service.
    public SignalementService(ApplicationDbContext context)
    {
        // On garde le contexte dans une variable privée.
        _context = context;
    }

    // Méthode qui crée un signalement pour une annonce.
    public async Task<SignalementAnnonceDto> CreateSignalementAnnonceAsync(
        int annonceId,
        CreateSignalementAnnonceDto dto,
        int signaleurId
    )
    {
        // On nettoie le motif envoyé.
        string motif = dto.Motif.Trim();

        // On nettoie la description envoyée.
        string description = dto.Description.Trim();

        // On vérifie si le motif est vide.
        if (string.IsNullOrWhiteSpace(motif))
        {
            // On bloque si le motif est vide.
            throw new InvalidOperationException("Le motif du signalement est obligatoire.");
        }

        // On vérifie si la description est vide.
        if (string.IsNullOrWhiteSpace(description))
        {
            // On bloque si la description est vide.
            throw new InvalidOperationException("La description du signalement est obligatoire.");
        }

        // On vérifie si le motif dépasse 150 caractères.
        if (motif.Length > 150)
        {
            // On bloque si le motif est trop long.
            throw new InvalidOperationException("Le motif ne doit pas dépasser 150 caractères.");
        }

        // On vérifie si la description dépasse 1000 caractères.
        if (description.Length > 1000)
        {
            // On bloque si la description est trop longue.
            throw new InvalidOperationException("La description ne doit pas dépasser 1000 caractères.");
        }

        // On cherche l'annonce signalée avec son vendeur.
        Annonce? annonce = await _context.Annonces
            .Include(item => item.Utilisateur)
            .FirstOrDefaultAsync(item => item.Id == annonceId);

        // On vérifie si l'annonce existe.
        if (annonce == null)
        {
            // On bloque si l'annonce est introuvable.
            throw new InvalidOperationException("Annonce introuvable.");
        }

        // On vérifie si l'annonce est active.
        if (!annonce.EstActive)
        {
            // On bloque si l'annonce est inactive.
            throw new InvalidOperationException("Cette annonce n'est pas active.");
        }

        // On empêche le propriétaire de signaler sa propre annonce.
        if (annonce.UtilisateurId == signaleurId)
        {
            // On bloque si le membre est le propriétaire de l'annonce.
            throw new InvalidOperationException("Vous ne pouvez pas signaler votre propre annonce.");
        }

        // On vérifie si le membre a déjà un signalement en attente sur cette annonce.
        bool signalementExiste = await _context.SignalementsAnnonces
            .AnyAsync(item =>
                item.AnnonceId == annonce.Id &&
                item.SignaleurId == signaleurId &&
                item.StatutSignalement == "En attente"
            );

        // On bloque les doublons en attente.
        if (signalementExiste)
        {
            // On évite plusieurs signalements identiques en attente.
            throw new InvalidOperationException("Vous avez déjà signalé cette annonce.");
        }

        // On crée le signalement.
        SignalementAnnonce signalement = new()
        {
            // On enregistre le motif.
            Motif = motif,

            // On enregistre la description.
            Description = description,

            // On met la date du signalement.
            DateSignalement = DateTime.UtcNow,

            // On met le statut initial.
            StatutSignalement = "En attente",

            // On relie le signalement au membre connecté.
            SignaleurId = signaleurId,

            // On relie le signalement à l'annonce.
            AnnonceId = annonce.Id
        };

        // On ajoute le signalement dans le contexte.
        _context.SignalementsAnnonces.Add(signalement);

        // On sauvegarde le signalement dans MySQL.
        await _context.SaveChangesAsync();

        // On recharge le signalement avec le membre signaleur et l'annonce.
        SignalementAnnonce signalementCree = await _context.SignalementsAnnonces
            .Include(item => item.Signaleur)
            .Include(item => item.Annonce)
            .FirstAsync(item => item.Id == signalement.Id);

        // On retourne le signalement créé sous forme de DTO.
        return ToAnnonceDto(signalementCree);
    }

    // Méthode qui crée un signalement pour un utilisateur depuis une conversation.
    public async Task<SignalementUtilisateurDto> CreateSignalementUtilisateurAsync(
        int conversationId,
        int utilisateurSignaleId,
        CreateSignalementUtilisateurDto dto,
        int signaleurId
    )
    {
        // On nettoie le motif envoyé.
        string motif = dto.Motif.Trim();

        // On nettoie la description envoyée.
        string description = dto.Description.Trim();

        // On vérifie si le motif est vide.
        if (string.IsNullOrWhiteSpace(motif))
        {
            // On bloque si le motif est vide.
            throw new InvalidOperationException("Le motif du signalement est obligatoire.");
        }

        // On vérifie si la description est vide.
        if (string.IsNullOrWhiteSpace(description))
        {
            // On bloque si la description est vide.
            throw new InvalidOperationException("La description du signalement est obligatoire.");
        }

        // On vérifie si le motif dépasse 150 caractères.
        if (motif.Length > 150)
        {
            // On bloque si le motif est trop long.
            throw new InvalidOperationException("Le motif ne doit pas dépasser 150 caractères.");
        }

        // On vérifie si la description dépasse 1000 caractères.
        if (description.Length > 1000)
        {
            // On bloque si la description est trop longue.
            throw new InvalidOperationException("La description ne doit pas dépasser 1000 caractères.");
        }

        // On empêche un membre de se signaler lui-même.
        if (utilisateurSignaleId == signaleurId)
        {
            // On bloque le signalement contre soi-même.
            throw new InvalidOperationException("Vous ne pouvez pas vous signaler vous-même.");
        }

        // On cherche la conversation avec sa demande d'achat.
        Conversation? conversation = await _context.Conversations
            .Include(item => item.DemandeAchat)
            .ThenInclude(item => item!.Annonce)
            .ThenInclude(item => item!.Utilisateur)
            .Include(item => item.DemandeAchat)
            .ThenInclude(item => item!.Acheteur)
            .FirstOrDefaultAsync(item => item.Id == conversationId);

        // On vérifie si la conversation existe.
        if (conversation == null)
        {
            // On bloque si la conversation est introuvable.
            throw new InvalidOperationException("Conversation introuvable.");
        }

        // On vérifie si la conversation est active.
        if (!conversation.EstActive)
        {
            // On bloque si la conversation est fermée.
            throw new InvalidOperationException("Cette conversation n'est plus active.");
        }

        // On récupère la demande d'achat liée à la conversation.
        DemandeAchat? demande = conversation.DemandeAchat;

        // On vérifie si la demande existe.
        if (demande == null)
        {
            // On bloque si la demande est introuvable.
            throw new InvalidOperationException("Demande d'achat liée à la conversation introuvable.");
        }

        // On récupère l'annonce liée à la demande.
        Annonce? annonce = demande.Annonce;

        // On vérifie si l'annonce existe.
        if (annonce == null)
        {
            // On bloque si l'annonce est introuvable.
            throw new InvalidOperationException("Annonce liée à la conversation introuvable.");
        }

        // On récupère l'identifiant de l'acheteur.
        int acheteurId = demande.AcheteurId;

        // On récupère l'identifiant du vendeur.
        int vendeurId = annonce.UtilisateurId;

        // On vérifie si le signaleur est l'acheteur.
        bool signaleurEstAcheteur = signaleurId == acheteurId;

        // On vérifie si le signaleur est le vendeur.
        bool signaleurEstVendeur = signaleurId == vendeurId;

        // On vérifie si l'utilisateur signalé est l'acheteur.
        bool utilisateurSignaleEstAcheteur = utilisateurSignaleId == acheteurId;

        // On vérifie si l'utilisateur signalé est le vendeur.
        bool utilisateurSignaleEstVendeur = utilisateurSignaleId == vendeurId;

        // On vérifie si le signaleur fait partie de la conversation.
        if (!signaleurEstAcheteur && !signaleurEstVendeur)
        {
            // On bloque si le membre connecté n'est pas dans cette conversation.
            throw new UnauthorizedAccessException("Vous n'avez pas le droit de signaler depuis cette conversation.");
        }

        // On vérifie si l'utilisateur signalé fait partie de la conversation.
        if (!utilisateurSignaleEstAcheteur && !utilisateurSignaleEstVendeur)
        {
            // On bloque si l'utilisateur signalé n'est pas dans cette conversation.
            throw new InvalidOperationException("L'utilisateur signalé ne fait pas partie de cette conversation.");
        }

        // On vérifie si le signaleur essaie bien de signaler l'autre participant.
        if (
            (signaleurEstAcheteur && !utilisateurSignaleEstVendeur) ||
            (signaleurEstVendeur && !utilisateurSignaleEstAcheteur)
        )
        {
            // On bloque si le signalement ne vise pas l'autre participant.
            throw new InvalidOperationException("Vous pouvez seulement signaler l'autre membre de cette conversation.");
        }

        // On vérifie si un signalement en attente existe déjà entre ces deux utilisateurs.
        bool signalementExiste = await _context.SignalementsUtilisateurs
            .AnyAsync(item =>
                item.SignaleurId == signaleurId &&
                item.UtilisateurSignaleId == utilisateurSignaleId &&
                item.StatutSignalement == "En attente"
            );

        // On bloque les doublons en attente.
        if (signalementExiste)
        {
            // On évite plusieurs signalements identiques en attente.
            throw new InvalidOperationException("Vous avez déjà signalé cet utilisateur.");
        }

        // On crée le signalement utilisateur.
        SignalementUtilisateur signalement = new()
        {
            // On enregistre le motif.
            Motif = motif,

            // On enregistre la description.
            Description = description,

            // On met la date du signalement.
            DateSignalement = DateTime.UtcNow,

            // On met le statut initial.
            StatutSignalement = "En attente",

            // On relie le signalement au membre qui signale.
            SignaleurId = signaleurId,

            // On relie le signalement à l'utilisateur signalé.
            UtilisateurSignaleId = utilisateurSignaleId
        };

        // On ajoute le signalement au contexte.
        _context.SignalementsUtilisateurs.Add(signalement);

        // On sauvegarde le signalement dans MySQL.
        await _context.SaveChangesAsync();

        // On recharge le signalement avec les utilisateurs liés.
        SignalementUtilisateur signalementCree = await _context.SignalementsUtilisateurs
            .Include(item => item.Signaleur)
            .Include(item => item.UtilisateurSignale)
            .FirstAsync(item => item.Id == signalement.Id);

        // On retourne le signalement au format DTO.
        return ToUtilisateurDto(signalementCree);
    }

    // Méthode qui retourne les signalements d'annonces en attente pour l'administrateur.
    public async Task<List<SignalementAnnonceDto>> GetSignalementsAnnoncesAdminAsync()
    {
        // On cherche les signalements d'annonces en attente.
        List<SignalementAnnonce> signalements = await _context.SignalementsAnnonces
            // On charge le membre qui a fait le signalement.
            .Include(item => item.Signaleur)
            // On charge l'annonce signalée.
            .Include(item => item.Annonce)
            // On garde seulement les signalements non encore traités.
            .Where(item => item.StatutSignalement == "En attente")
            // On affiche les plus récents en premier.
            .OrderByDescending(item => item.DateSignalement)
            // On exécute la requête SQL.
            .ToListAsync();

        // On transforme les signalements en DTOs.
        return signalements.Select(ToAnnonceDto).ToList();
    }

    // Méthode qui retourne les signalements d'utilisateurs en attente pour l'administrateur.
    public async Task<List<SignalementUtilisateurDto>> GetSignalementsUtilisateursAdminAsync()
    {
        // On cherche les signalements d'utilisateurs en attente.
        List<SignalementUtilisateur> signalements = await _context.SignalementsUtilisateurs
            // On charge le membre qui a fait le signalement.
            .Include(item => item.Signaleur)
            // On charge l'utilisateur signalé.
            .Include(item => item.UtilisateurSignale)
            // On garde seulement les signalements non encore traités.
            .Where(item => item.StatutSignalement == "En attente")
            // On affiche les plus récents en premier.
            .OrderByDescending(item => item.DateSignalement)
            // On exécute la requête SQL.
            .ToListAsync();

        // On transforme les signalements en DTOs.
        return signalements.Select(ToUtilisateurDto).ToList();
    }

    // Méthode qui valide un signalement d'annonce.
    public async Task<SignalementAnnonceDto> ValiderSignalementAnnonceAsync(
        int signalementId,
        TraiterSignalementDto dto,
        int administrateurId
    )
    {
        // On traite le signalement avec le statut Validé.
        return await TraiterSignalementAnnonceAsync(signalementId, dto, administrateurId, "Validé");
    }

    // Méthode qui rejette un signalement d'annonce.
    public async Task<SignalementAnnonceDto> RejeterSignalementAnnonceAsync(
        int signalementId,
        TraiterSignalementDto dto,
        int administrateurId
    )
    {
        // On traite le signalement avec le statut Rejeté.
        return await TraiterSignalementAnnonceAsync(signalementId, dto, administrateurId, "Rejeté");
    }

    // Méthode qui valide un signalement d'utilisateur.
    public async Task<SignalementUtilisateurDto> ValiderSignalementUtilisateurAsync(
        int signalementId,
        TraiterSignalementDto dto,
        int administrateurId
    )
    {
        // On traite le signalement avec le statut Validé.
        return await TraiterSignalementUtilisateurAsync(signalementId, dto, administrateurId, "Validé");
    }

    // Méthode qui rejette un signalement d'utilisateur.
    public async Task<SignalementUtilisateurDto> RejeterSignalementUtilisateurAsync(
        int signalementId,
        TraiterSignalementDto dto,
        int administrateurId
    )
    {
        // On traite le signalement avec le statut Rejeté.
        return await TraiterSignalementUtilisateurAsync(signalementId, dto, administrateurId, "Rejeté");
    }

    // Méthode privée qui traite un signalement d'annonce.
    private async Task<SignalementAnnonceDto> TraiterSignalementAnnonceAsync(
        int signalementId,
        TraiterSignalementDto dto,
        int administrateurId,
        string nouveauStatut
    )
    {
        // On cherche le signalement d'annonce.
        SignalementAnnonce? signalement = await _context.SignalementsAnnonces
            .Include(item => item.Signaleur)
            .Include(item => item.Annonce)
            .FirstOrDefaultAsync(item => item.Id == signalementId);

        // On vérifie si le signalement existe.
        if (signalement == null)
        {
            // On bloque si le signalement est introuvable.
            throw new InvalidOperationException("Signalement d'annonce introuvable.");
        }

        // On vérifie si le signalement est encore en attente.
        if (signalement.StatutSignalement != "En attente")
        {
            // On bloque si le signalement a déjà été traité.
            throw new InvalidOperationException("Ce signalement d'annonce a déjà été traité.");
        }

        // On met à jour le statut du signalement.
        signalement.StatutSignalement = nouveauStatut;

        // On enregistre la date de traitement.
        signalement.DateTraitement = DateTime.UtcNow;

        // On enregistre la décision de l'administrateur.
        signalement.DecisionAdmin = dto.DecisionAdmin.Trim();

        // On enregistre l'administrateur qui a traité le signalement.
        signalement.AdministrateurId = administrateurId;

        // On sauvegarde les modifications.
        await _context.SaveChangesAsync();

        // On retourne le signalement mis à jour.
        return ToAnnonceDto(signalement);
    }

    // Méthode privée qui traite un signalement d'utilisateur.
    private async Task<SignalementUtilisateurDto> TraiterSignalementUtilisateurAsync(
        int signalementId,
        TraiterSignalementDto dto,
        int administrateurId,
        string nouveauStatut
    )
    {
        // On cherche le signalement d'utilisateur.
        SignalementUtilisateur? signalement = await _context.SignalementsUtilisateurs
            .Include(item => item.Signaleur)
            .Include(item => item.UtilisateurSignale)
            .FirstOrDefaultAsync(item => item.Id == signalementId);

        // On vérifie si le signalement existe.
        if (signalement == null)
        {
            // On bloque si le signalement est introuvable.
            throw new InvalidOperationException("Signalement d'utilisateur introuvable.");
        }

        // On vérifie si le signalement est encore en attente.
        if (signalement.StatutSignalement != "En attente")
        {
            // On bloque si le signalement a déjà été traité.
            throw new InvalidOperationException("Ce signalement d'utilisateur a déjà été traité.");
        }

        // On met à jour le statut du signalement.
        signalement.StatutSignalement = nouveauStatut;

        // On enregistre la date de traitement.
        signalement.DateTraitement = DateTime.UtcNow;

        // On enregistre la décision de l'administrateur.
        signalement.DecisionAdmin = dto.DecisionAdmin.Trim();

        // On enregistre l'administrateur qui a traité le signalement.
        signalement.AdministrateurId = administrateurId;

        // On sauvegarde les modifications.
        await _context.SaveChangesAsync();

        // On retourne le signalement mis à jour.
        return ToUtilisateurDto(signalement);
    }

    // Méthode qui transforme un signalement d'annonce en DTO.
    private static SignalementAnnonceDto ToAnnonceDto(SignalementAnnonce signalement)
    {
        // On retourne un objet simple pour le frontend.
        return new SignalementAnnonceDto
        {
            // On retourne l'identifiant du signalement.
            Id = signalement.Id,

            // On retourne le motif du signalement.
            Motif = signalement.Motif,

            // On retourne la description du signalement.
            Description = signalement.Description,

            // On retourne le statut du signalement.
            StatutSignalement = signalement.StatutSignalement,

            // On retourne la date du signalement.
            DateSignalement = signalement.DateSignalement,

            // On retourne l'identifiant du membre qui a signalé.
            SignaleurId = signalement.SignaleurId,

            // On retourne le nom complet du membre qui a signalé.
            SignaleurNomComplet = $"{signalement.Signaleur?.Prenom} {signalement.Signaleur?.Nom}".Trim(),

            // On retourne l'identifiant de l'annonce signalée.
            AnnonceId = signalement.AnnonceId,

            // On retourne le titre de l'annonce signalée.
            AnnonceTitre = signalement.Annonce?.Titre ?? string.Empty,

            // On retourne la date de traitement.
            DateTraitement = signalement.DateTraitement,

            // On retourne la décision de l'administrateur.
            DecisionAdmin = signalement.DecisionAdmin,

            // On retourne l'identifiant de l'administrateur.
            AdministrateurId = signalement.AdministrateurId
        };
    }

    // Méthode qui transforme un signalement d'utilisateur en DTO.
    private static SignalementUtilisateurDto ToUtilisateurDto(SignalementUtilisateur signalement)
    {
        // On retourne un objet simple pour le frontend.
        return new SignalementUtilisateurDto
        {
            // On retourne l'identifiant du signalement.
            Id = signalement.Id,

            // On retourne le motif du signalement.
            Motif = signalement.Motif,

            // On retourne la description du signalement.
            Description = signalement.Description,

            // On retourne le statut du signalement.
            StatutSignalement = signalement.StatutSignalement,

            // On retourne la date du signalement.
            DateSignalement = signalement.DateSignalement,

            // On retourne l'identifiant du signaleur.
            SignaleurId = signalement.SignaleurId,

            // On retourne le nom complet du signaleur.
            SignaleurNomComplet = $"{signalement.Signaleur?.Prenom} {signalement.Signaleur?.Nom}".Trim(),

            // On retourne l'identifiant de l'utilisateur signalé.
            UtilisateurSignaleId = signalement.UtilisateurSignaleId,

            // On retourne le nom complet de l'utilisateur signalé.
            UtilisateurSignaleNomComplet = $"{signalement.UtilisateurSignale?.Prenom} {signalement.UtilisateurSignale?.Nom}".Trim(),

            // On retourne la date de traitement.
            DateTraitement = signalement.DateTraitement,

            // On retourne la décision de l'administrateur.
            DecisionAdmin = signalement.DecisionAdmin,

            // On retourne l'identifiant de l'administrateur.
            AdministrateurId = signalement.AdministrateurId
        };
    }
}