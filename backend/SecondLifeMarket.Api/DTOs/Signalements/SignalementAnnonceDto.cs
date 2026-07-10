namespace SecondLifeMarket.Api.DTOs.Signalements;

public class SignalementAnnonceDto
{
    // Identifiant unique du signalement.
    public int Id { get; set; }

    // Motif du signalement.
    public string Motif { get; set; } = string.Empty;

    // Description détaillée du signalement.
    public string Description { get; set; } = string.Empty;

    // Statut actuel du signalement.
    public string StatutSignalement { get; set; } = string.Empty;

    // Date du signalement.
    public DateTime DateSignalement { get; set; }

    // Date du traitement par l'administrateur.
    public DateTime? DateTraitement { get; set; }

    // Décision ou remarque de l'administrateur.
    public string DecisionAdmin { get; set; } = string.Empty;

    // Identifiant du membre qui signale.
    public int SignaleurId { get; set; }

    // Nom complet du membre qui signale.
    public string SignaleurNomComplet { get; set; } = string.Empty;

    // Identifiant de l'annonce signalée.
    public int AnnonceId { get; set; }

    // Titre de l'annonce signalée.
    public string AnnonceTitre { get; set; } = string.Empty;

    // Identifiant de l'administrateur qui traite le signalement.
    public int? AdministrateurId { get; set; }
}