using Microsoft.EntityFrameworkCore;
using SecondLifeMarket.Api.Data;
using SecondLifeMarket.Api.DTOs.Conversations;
using SecondLifeMarket.Api.DTOs.Messages;
using SecondLifeMarket.Api.Models;
using SecondLifeMarket.Api.Services.Interfaces;

namespace SecondLifeMarket.Api.Services;

public class ConversationService : IConversationService
{
    // Contexte de base de données utilisé par le service.
    private readonly ApplicationDbContext _context;

    // Constructeur du service.
    public ConversationService(ApplicationDbContext context)
    {
        // On garde le contexte dans une variable privée.
        _context = context;
    }

    // Méthode qui récupère ou crée une conversation liée à une demande d'achat.
    public async Task<ConversationDto> GetOrCreateConversationAsync(int demandeAchatId, int utilisateurId)
    {
        // On cherche la demande d'achat avec l'annonce, le vendeur et l'acheteur.
        DemandeAchat? demande = await _context.DemandesAchat
            // On charge l'annonce liée à la demande.
            .Include(item => item.Annonce)
            // On charge le vendeur de l'annonce.
            .ThenInclude(item => item!.Utilisateur)
            // On charge l'acheteur de la demande.
            .Include(item => item.Acheteur)
            // On cherche la demande par son identifiant.
            .FirstOrDefaultAsync(item => item.Id == demandeAchatId);

        // On vérifie si la demande existe.
        if (demande == null)
        {
            // On bloque si la demande est introuvable.
            throw new InvalidOperationException("Demande d'achat introuvable.");
        }

        // On vérifie si l'annonce liée existe.
        if (demande.Annonce == null)
        {
            // On bloque si l'annonce liée est introuvable.
            throw new InvalidOperationException("Annonce liée à la demande introuvable.");
        }

        // On vérifie si l'utilisateur connecté est l'acheteur de la demande.
        bool estAcheteur = demande.AcheteurId == utilisateurId;

        // On vérifie si l'utilisateur connecté est le vendeur de l'annonce.
        bool estVendeur = demande.Annonce.UtilisateurId == utilisateurId;

        // On vérifie si l'utilisateur a le droit d'ouvrir cette conversation.
        if (!estAcheteur && !estVendeur)
        {
            // On bloque si l'utilisateur n'est ni acheteur ni vendeur.
            throw new UnauthorizedAccessException("Vous n'avez pas le droit d'ouvrir cette conversation.");
        }

        // On cherche si une conversation existe déjà pour cette demande.
        Conversation? conversation = await _context.Conversations
            // On charge la demande liée.
            .Include(item => item.DemandeAchat)
            // On charge l'annonce liée à la demande.
            .ThenInclude(item => item!.Annonce)
            // On charge le vendeur de l'annonce.
            .ThenInclude(item => item!.Utilisateur)
            // On charge encore la demande liée.
            .Include(item => item.DemandeAchat)
            // On charge l'acheteur de la demande.
            .ThenInclude(item => item!.Acheteur)
            // On charge les messages de la conversation.
            .Include(item => item.Messages)
            // On charge l'expéditeur de chaque message.
            .ThenInclude(item => item.Expediteur)
            // On cherche par identifiant de demande.
            .FirstOrDefaultAsync(item => item.DemandeAchatId == demandeAchatId);

        // On vérifie si aucune conversation n'existe encore.
        if (conversation == null)
        {
            // On crée une nouvelle conversation.
            conversation = new Conversation
            {
                // On lie la conversation à la demande d'achat.
                DemandeAchatId = demande.Id,

                // On met la date de création.
                DateCreation = DateTime.UtcNow,

                // On garde la conversation active.
                EstActive = true
            };

            // On ajoute la conversation au contexte.
            _context.Conversations.Add(conversation);

            // On sauvegarde la conversation dans MySQL.
            await _context.SaveChangesAsync();

            // On recharge la conversation avec toutes les informations nécessaires.
            conversation = await _context.Conversations
                // On charge la demande liée.
                .Include(item => item.DemandeAchat)
                // On charge l'annonce liée à la demande.
                .ThenInclude(item => item!.Annonce)
                // On charge le vendeur de l'annonce.
                .ThenInclude(item => item!.Utilisateur)
                // On charge encore la demande liée.
                .Include(item => item.DemandeAchat)
                // On charge l'acheteur de la demande.
                .ThenInclude(item => item!.Acheteur)
                // On charge les messages.
                .Include(item => item.Messages)
                // On charge les expéditeurs des messages.
                .ThenInclude(item => item.Expediteur)
                // On récupère la conversation créée.
                .FirstAsync(item => item.Id == conversation.Id);
        }

        // On retourne la conversation au format DTO.
        return ToDto(conversation);
    }

    // Cette méthode retourne toutes les conversations d'un utilisateur.
    public async Task<List<ConversationDto>> GetConversationsByUtilisateurAsync(
        int utilisateurId
    )
    {
        // On récupère les conversations dans la base de données.
        List<Conversation> conversations = await _context.Conversations

            // On charge la demande d'achat liée à la conversation.
            .Include(conversation => conversation.DemandeAchat)

            // On charge l'annonce liée à la demande d'achat.
            .ThenInclude(demande => demande!.Annonce)

            // On charge le vendeur de l'annonce.
            .ThenInclude(annonce => annonce!.Utilisateur)

            // On charge encore la demande d'achat.
            .Include(conversation => conversation.DemandeAchat)

            // On charge l'acheteur de la demande.
            .ThenInclude(demande => demande!.Acheteur)

            // On charge tous les messages de la conversation.
            .Include(conversation => conversation.Messages)

            // On charge l'expéditeur de chaque message.
            .ThenInclude(message => message.Expediteur)

            // On garde seulement les conversations de l'utilisateur connecté.
            .Where(conversation =>
                conversation.DemandeAchat != null
                && conversation.DemandeAchat.Annonce != null
                && (
                    conversation.DemandeAchat.AcheteurId == utilisateurId
                    || conversation.DemandeAchat.Annonce.UtilisateurId == utilisateurId
                )
            )

            // On exécute la requête dans la base de données.
            .ToListAsync();

        // On trie les conversations de la plus récente à la plus ancienne.
        conversations = conversations
            .OrderByDescending(conversation =>
                // On vérifie si la conversation contient des messages.
                conversation.Messages.Count > 0

                    // Si elle contient des messages, on utilise la date du dernier message.
                    ? conversation.Messages.Max(message => message.DateEnvoi)

                    // Sinon, on utilise la date de création de la conversation.
                    : conversation.DateCreation
            )

            // On transforme le résultat en liste.
            .ToList();

        // On transforme chaque conversation en ConversationDto.
        return conversations

            // On utilise la méthode ToDto déjà présente dans le service.
            .Select(conversation => ToDto(conversation))

            // On transforme le résultat final en liste.
            .ToList();
    }

    // Méthode qui transforme une conversation en DTO.
    private static ConversationDto ToDto(Conversation conversation)
    {
        // On récupère la demande liée.
        DemandeAchat? demande = conversation.DemandeAchat;

        // On récupère l'annonce liée.
        Annonce? annonce = demande?.Annonce;

        // On retourne la conversation sous forme simple.
        return new ConversationDto
        {
            // On retourne l'identifiant de la conversation.
            Id = conversation.Id,

            // On retourne la date de création.
            DateCreation = conversation.DateCreation,

            // On retourne l'état actif.
            EstActive = conversation.EstActive,

            // On retourne l'identifiant de la demande.
            DemandeAchatId = conversation.DemandeAchatId,

            // On retourne l'identifiant de l'annonce.
            AnnonceId = annonce?.Id ?? 0,

            // On retourne le titre de l'annonce.
            AnnonceTitre = annonce?.Titre ?? string.Empty,

            // On retourne l'identifiant de l'acheteur.
            AcheteurId = demande?.AcheteurId ?? 0,

            // On retourne le nom complet de l'acheteur.
            AcheteurNomComplet = $"{demande?.Acheteur?.Prenom} {demande?.Acheteur?.Nom}".Trim(),

            // On retourne l'identifiant du vendeur.
            VendeurId = annonce?.UtilisateurId ?? 0,

            // On retourne le nom complet du vendeur.
            VendeurNomComplet = $"{annonce?.Utilisateur?.Prenom} {annonce?.Utilisateur?.Nom}".Trim(),

            // On retourne les messages de la conversation.
            Messages = conversation.Messages
                // On trie les messages du plus ancien au plus récent.
                .OrderBy(message => message.DateEnvoi)
                // On transforme chaque message en DTO.
                .Select(ToMessageDto)
                // On transforme le résultat en liste.
                .ToList()
        };
    }

    // Méthode qui transforme un message en DTO.
    private static MessageDto ToMessageDto(Message message)
    {
        // On retourne le message sous forme simple.
        return new MessageDto
        {
            // On retourne l'identifiant du message.
            Id = message.Id,

            // On retourne le contenu du message.
            Contenu = message.Contenu,

            // On retourne la date d'envoi.
            DateEnvoi = message.DateEnvoi,

            // On retourne si le message est lu.
            EstLu = message.EstLu,

            // On retourne l'identifiant de l'expéditeur.
            ExpediteurId = message.ExpediteurId,

            // On retourne le nom complet de l'expéditeur.
            ExpediteurNomComplet = $"{message.Expediteur?.Prenom} {message.Expediteur?.Nom}".Trim()
        };
    }
}