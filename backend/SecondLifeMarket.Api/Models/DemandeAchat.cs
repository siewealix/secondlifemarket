using System.ComponentModel.DataAnnotations;

namespace SecondLifeMarket.Api.Models;

public class DemandeAchat
{
    // Identifiant unique de la demande d'achat.
    public int Id { get; set; }

    // Message optionnel envoyé par l'acheteur au vendeur.
    [MaxLength(1000)]
    public string Message { get; set; } = string.Empty;

    // Statut actuel de la demande.
    [MaxLength(30)]
    public string Statut { get; set; } = "En attente";

    // Date de création de la demande.
    public DateTime DateDemande { get; set; } = DateTime.UtcNow;

    // Identifiant de l'annonce concernée par la demande.
    public int AnnonceId { get; set; }

    // Annonce concernée par la demande.
    public Annonce? Annonce { get; set; }

    // Identifiant du membre qui fait la demande.
    public int AcheteurId { get; set; }

    // Membre qui fait la demande d'achat.
    public Utilisateur? Acheteur { get; set; }

    // Conversation liée à cette demande d'achat.
    public Conversation? Conversation { get; set; }
}