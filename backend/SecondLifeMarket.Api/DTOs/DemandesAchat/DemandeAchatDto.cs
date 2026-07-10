namespace SecondLifeMarket.Api.DTOs.DemandesAchat;

public class DemandeAchatDto
{
    // Identifiant unique de la demande d'achat.
    public int Id { get; set; }

    // Message envoyé par l'acheteur.
    public string Message { get; set; } = string.Empty;

    // Statut actuel de la demande.
    public string Statut { get; set; } = string.Empty;

    // Date de création de la demande.
    public DateTime DateDemande { get; set; }

    // Identifiant de l'annonce concernée.
    public int AnnonceId { get; set; }

    // Titre de l'annonce concernée.
    public string AnnonceTitre { get; set; } = string.Empty;

    // Prix de l'annonce concernée.
    public decimal AnnoncePrix { get; set; }

    // Photo principale de l'annonce.
    public string AnnoncePhotoUrl { get; set; } = string.Empty;

    // Identifiant de l'acheteur.
    public int AcheteurId { get; set; }

    // Nom complet de l'acheteur.
    public string AcheteurNomComplet { get; set; } = string.Empty;

    // Identifiant du vendeur.
    public int VendeurId { get; set; }

    // Nom complet du vendeur.
    public string VendeurNomComplet { get; set; } = string.Empty;
}