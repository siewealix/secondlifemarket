using Microsoft.EntityFrameworkCore;
using SecondLifeMarket.Api.Data;
using SecondLifeMarket.Api.DTOs.Messages;
using SecondLifeMarket.Api.Models;
using SecondLifeMarket.Api.Services.Interfaces;

namespace SecondLifeMarket.Api.Services;

public class MessageService : IMessageService
{
    // Contexte de base de données utilisé par le service.
    private readonly ApplicationDbContext _context;

    // Constructeur du service.
    public MessageService(ApplicationDbContext context)
    {
        // On garde le contexte dans une variable privée.
        _context = context;
    }

    // Méthode qui envoie un message dans une conversation.
    public async Task<MessageDto> SendMessageAsync(int conversationId, SendMessageDto dto, int expediteurId)
    {
        // On nettoie le contenu du message.
        string contenu = dto.Contenu.Trim();

        // On vérifie si le message est vide.
        if (string.IsNullOrWhiteSpace(contenu))
        {
            // On bloque l'envoi si le message est vide.
            throw new InvalidOperationException("Le message ne peut pas être vide.");
        }

        // On vérifie si le message dépasse 2000 caractères.
        if (contenu.Length > 2000)
        {
            // On bloque l'envoi si le message est trop long.
            throw new InvalidOperationException("Le message ne doit pas dépasser 2000 caractères.");
        }

        // On cherche la conversation avec la demande d'achat, l'annonce, le vendeur et l'acheteur.
        Conversation? conversation = await _context.Conversations
            // On charge la demande d'achat liée à la conversation.
            .Include(conversationItem => conversationItem.DemandeAchat)
                // On charge l'annonce liée à la demande d'achat.
                .ThenInclude(demandeItem => demandeItem!.Annonce)
                    // On charge le vendeur de l'annonce.
                    .ThenInclude(annonceItem => annonceItem!.Utilisateur)
            // On recharge la demande d'achat liée à la conversation.
            .Include(conversationItem => conversationItem.DemandeAchat)
                // On charge l'acheteur qui a envoyé la demande d'achat.
                .ThenInclude(demandeItem => demandeItem!.Acheteur)
            // On cherche la conversation par son identifiant.
            .FirstOrDefaultAsync(conversationItem => conversationItem.Id == conversationId);

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

        // On vérifie si la demande d'achat existe.
        if (demande == null)
        {
            // On bloque si la demande d'achat est introuvable.
            throw new InvalidOperationException("Demande d'achat liée à la conversation introuvable.");
        }

        // On récupère l'annonce liée à la demande d'achat.
        Annonce? annonce = demande.Annonce;

        // On vérifie si l'annonce existe.
        if (annonce == null)
        {
            // On bloque si l'annonce est introuvable.
            throw new InvalidOperationException("Annonce liée à la conversation introuvable.");
        }

        // On vérifie si l'utilisateur connecté est l'acheteur de la demande.
        bool estAcheteur = demande.AcheteurId == expediteurId;

        // On vérifie si l'utilisateur connecté est le vendeur de l'annonce.
        bool estVendeur = annonce.UtilisateurId == expediteurId;

        // On vérifie si l'utilisateur a le droit d'envoyer un message.
        if (!estAcheteur && !estVendeur)
        {
            // On bloque si l'utilisateur n'est ni l'acheteur ni le vendeur.
            throw new UnauthorizedAccessException("Vous n'avez pas le droit d'envoyer un message dans cette conversation.");
        }

        // On crée le nouveau message.
        Message message = new()
        {
            // On enregistre le contenu du message.
            Contenu = contenu,

            // On enregistre la date d'envoi.
            DateEnvoi = DateTime.UtcNow,

            // Le message est non lu au départ.
            EstLu = false,

            // On lie le message à la conversation.
            ConversationId = conversation.Id,

            // On lie le message à l'utilisateur connecté.
            ExpediteurId = expediteurId
        };

        // On ajoute le message dans le contexte Entity Framework.
        _context.Messages.Add(message);

        // On sauvegarde le message dans la base MySQL.
        await _context.SaveChangesAsync();

        // On recharge le message avec son expéditeur.
        Message messageCree = await _context.Messages
            // On charge l'utilisateur qui a envoyé le message.
            .Include(messageItem => messageItem.Expediteur)
            // On récupère le message qui vient d'être créé.
            .FirstAsync(messageItem => messageItem.Id == message.Id);

        // On retourne le message au format DTO.
        return ToDto(messageCree);
    }

    // Méthode qui transforme un message en DTO.
    private static MessageDto ToDto(Message message)
    {
        // On retourne un objet simple pour le frontend.
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