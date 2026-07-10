using System.ComponentModel.DataAnnotations;

namespace SecondLifeMarket.Api.Models;

public class Conversation
{
    // Identifiant unique de la conversation.
    public int Id { get; set; }

    // Date de création de la conversation.
    public DateTime DateCreation { get; set; } = DateTime.UtcNow;

    // Indique si la conversation est active.
    public bool EstActive { get; set; } = true;

    // Identifiant de la demande d'achat liée à cette conversation.
    public int DemandeAchatId { get; set; }

    // Demande d'achat liée à cette conversation.
    public DemandeAchat? DemandeAchat { get; set; }

    // Liste des messages de cette conversation.
    public List<Message> Messages { get; set; } = new();
}