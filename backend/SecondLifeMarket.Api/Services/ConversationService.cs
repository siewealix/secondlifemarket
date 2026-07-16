using Microsoft.EntityFrameworkCore;
using SecondLifeMarket.Api.Data;
using SecondLifeMarket.Api.DTOs.Conversations;
using SecondLifeMarket.Api.DTOs.Messages;
using SecondLifeMarket.Api.Models;
using SecondLifeMarket.Api.Services.Interfaces;

namespace SecondLifeMarket.Api.Services;

public class ConversationService : IConversationService
{
    private readonly ApplicationDbContext _context;

    public ConversationService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<ConversationDto>> GetConversationsByUtilisateurAsync(int utilisateurId)
    {
        List<Conversation> conversations = await _context.Conversations
            .AsNoTracking()
            .Include(item => item.DemandeAchat)
            .ThenInclude(item => item!.Annonce)
            .ThenInclude(item => item!.Utilisateur)
            .Include(item => item.DemandeAchat)
            .ThenInclude(item => item!.Acheteur)
            .Include(item => item.Messages)
            .ThenInclude(item => item.Expediteur)
            .Where(item =>
                item.DemandeAchat != null &&
                item.DemandeAchat.Annonce != null &&
                (item.DemandeAchat.AcheteurId == utilisateurId ||
                 item.DemandeAchat.Annonce.UtilisateurId == utilisateurId))
            .ToListAsync();

        return conversations
            .OrderByDescending(item => item.Messages.Any()
                ? item.Messages.Max(message => message.DateEnvoi)
                : item.DateCreation)
            .Select(ToDto)
            .ToList();
    }

    public async Task<ConversationDto> GetOrCreateConversationAsync(int demandeAchatId, int utilisateurId)
    {
        DemandeAchat? demande = await _context.DemandesAchat
            .Include(item => item.Annonce)
            .ThenInclude(item => item!.Utilisateur)
            .Include(item => item.Acheteur)
            .FirstOrDefaultAsync(item => item.Id == demandeAchatId);

        if (demande == null)
        {
            throw new InvalidOperationException("Demande d'achat introuvable.");
        }

        if (demande.Annonce == null)
        {
            throw new InvalidOperationException("Annonce liée à la demande introuvable.");
        }

        bool estAcheteur = demande.AcheteurId == utilisateurId;
        bool estVendeur = demande.Annonce.UtilisateurId == utilisateurId;

        if (!estAcheteur && !estVendeur)
        {
            throw new UnauthorizedAccessException("Vous n'avez pas le droit d'ouvrir cette conversation.");
        }

        Conversation? conversation = await _context.Conversations
            .Include(item => item.DemandeAchat)
            .ThenInclude(item => item!.Annonce)
            .ThenInclude(item => item!.Utilisateur)
            .Include(item => item.DemandeAchat)
            .ThenInclude(item => item!.Acheteur)
            .Include(item => item.Messages)
            .ThenInclude(item => item.Expediteur)
            .FirstOrDefaultAsync(item => item.DemandeAchatId == demandeAchatId);

        if (conversation == null)
        {
            conversation = new Conversation
            {
                DemandeAchatId = demande.Id,
                DateCreation = DateTime.UtcNow,
                EstActive = true
            };

            _context.Conversations.Add(conversation);
            await _context.SaveChangesAsync();

            conversation = await _context.Conversations
                .Include(item => item.DemandeAchat)
                .ThenInclude(item => item!.Annonce)
                .ThenInclude(item => item!.Utilisateur)
                .Include(item => item.DemandeAchat)
                .ThenInclude(item => item!.Acheteur)
                .Include(item => item.Messages)
                .ThenInclude(item => item.Expediteur)
                .FirstAsync(item => item.Id == conversation.Id);
        }

        return ToDto(conversation);
    }

    private static ConversationDto ToDto(Conversation conversation)
    {
        DemandeAchat? demande = conversation.DemandeAchat;
        Annonce? annonce = demande?.Annonce;

        return new ConversationDto
        {
            Id = conversation.Id,
            DateCreation = conversation.DateCreation,
            EstActive = conversation.EstActive,
            DemandeAchatId = conversation.DemandeAchatId,
            AnnonceId = annonce?.Id ?? 0,
            AnnonceTitre = annonce?.Titre ?? string.Empty,
            AcheteurId = demande?.AcheteurId ?? 0,
            AcheteurNomComplet = $"{demande?.Acheteur?.Prenom} {demande?.Acheteur?.Nom}".Trim(),
            VendeurId = annonce?.UtilisateurId ?? 0,
            VendeurNomComplet = $"{annonce?.Utilisateur?.Prenom} {annonce?.Utilisateur?.Nom}".Trim(),
            Messages = conversation.Messages
                .OrderBy(message => message.DateEnvoi)
                .Select(ToMessageDto)
                .ToList()
        };
    }

    private static MessageDto ToMessageDto(Message message)
    {
        return new MessageDto
        {
            Id = message.Id,
            Contenu = message.Contenu,
            DateEnvoi = message.DateEnvoi,
            EstLu = message.EstLu,
            ExpediteurId = message.ExpediteurId,
            ExpediteurNomComplet = $"{message.Expediteur?.Prenom} {message.Expediteur?.Nom}".Trim()
        };
    }
}
