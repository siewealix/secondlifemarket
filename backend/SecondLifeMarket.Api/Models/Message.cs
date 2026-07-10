using System.ComponentModel.DataAnnotations;

namespace SecondLifeMarket.Api.Models;

public class Message
{
    // Identifiant unique du message.
    public int Id { get; set; }

    // Contenu du message envoyé.
    [MaxLength(2000)]
    public string Contenu { get; set; } = string.Empty;

    // Date d'envoi du message.
    public DateTime DateEnvoi { get; set; } = DateTime.UtcNow;

    // Indique si le message a été lu.
    public bool EstLu { get; set; } = false;

    // Identifiant de la conversation liée au message.
    public int ConversationId { get; set; }

    // Conversation liée au message.
    public Conversation? Conversation { get; set; }

    // Identifiant de l'utilisateur qui a envoyé le message.
    public int ExpediteurId { get; set; }

    // Utilisateur qui a envoyé le message.
    public Utilisateur? Expediteur { get; set; }
}