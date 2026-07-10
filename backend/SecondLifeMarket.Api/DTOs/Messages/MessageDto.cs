namespace SecondLifeMarket.Api.DTOs.Messages;

public class MessageDto
{
    // Identifiant unique du message.
    public int Id { get; set; }

    // Contenu du message.
    public string Contenu { get; set; } = string.Empty;

    // Date d'envoi du message.
    public DateTime DateEnvoi { get; set; }

    // Indique si le message a été lu.
    public bool EstLu { get; set; }

    // Identifiant de l'expéditeur.
    public int ExpediteurId { get; set; }

    // Nom complet de l'expéditeur.
    public string ExpediteurNomComplet { get; set; } = string.Empty;
}