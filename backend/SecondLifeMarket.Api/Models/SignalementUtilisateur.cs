using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SecondLifeMarket.Api.Models;

[Table("SignalementUtilisateur")]
public class SignalementUtilisateur
{
    // Identifiant unique du signalement d'utilisateur.
    public int Id { get; set; }

    // Motif principal du signalement.
    [MaxLength(150)]
    public string Motif { get; set; } = string.Empty;

    // Description détaillée du problème signalé.
    [MaxLength(1000)]
    public string Description { get; set; } = string.Empty;

    // Date à laquelle le membre a fait le signalement.
    public DateTime DateSignalement { get; set; } = DateTime.UtcNow;

    // Statut actuel du signalement.
    [MaxLength(30)]
    public string StatutSignalement { get; set; } = "En attente";

    // Date à laquelle l'administrateur traite le signalement.
    public DateTime? DateTraitement { get; set; }

    // Décision ou remarque de l'administrateur.
    [MaxLength(1000)]
    public string DecisionAdmin { get; set; } = string.Empty;

    // Identifiant du membre qui fait le signalement.
    public int SignaleurId { get; set; }

    // Membre qui fait le signalement.
    public Utilisateur? Signaleur { get; set; }

    // Identifiant de l'utilisateur signalé.
    public int UtilisateurSignaleId { get; set; }

    // Utilisateur signalé.
    public Utilisateur? UtilisateurSignale { get; set; }

    // Identifiant de l'administrateur qui traite le signalement.
    public int? AdministrateurId { get; set; }

    // Administrateur qui traite le signalement.
    public Utilisateur? Administrateur { get; set; }
}