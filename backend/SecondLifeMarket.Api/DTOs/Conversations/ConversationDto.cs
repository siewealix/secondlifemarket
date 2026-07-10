using SecondLifeMarket.Api.DTOs.Messages;

namespace SecondLifeMarket.Api.DTOs.Conversations;

public class ConversationDto
{
    // Identifiant unique de la conversation.
    public int Id { get; set; }

    // Date de création de la conversation.
    public DateTime DateCreation { get; set; }

    // Indique si la conversation est active.
    public bool EstActive { get; set; }

    // Identifiant de la demande d'achat liée.
    public int DemandeAchatId { get; set; }

    // Identifiant de l'annonce liée à la demande.
    public int AnnonceId { get; set; }

    // Titre de l'annonce liée à la demande.
    public string AnnonceTitre { get; set; } = string.Empty;

    // Identifiant de l'acheteur.
    public int AcheteurId { get; set; }

    // Nom complet de l'acheteur.
    public string AcheteurNomComplet { get; set; } = string.Empty;

    // Identifiant du vendeur.
    public int VendeurId { get; set; }

    // Nom complet du vendeur.
    public string VendeurNomComplet { get; set; } = string.Empty;

    // Liste des messages de la conversation.
    public List<MessageDto> Messages { get; set; } = new();
}