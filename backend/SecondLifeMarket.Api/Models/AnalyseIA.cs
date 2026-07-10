// On importe les annotations pour limiter la taille des champs.
using System.ComponentModel.DataAnnotations;

// On importe les annotations pour nommer la table.
using System.ComponentModel.DataAnnotations.Schema;

// On place la classe dans le namespace Models.
namespace SecondLifeMarket.Api.Models;

// On nomme la table comme dans le MCD.
[Table("Analyse_IA")]
public class AnalyseIa
{
    // On crée l'identifiant unique de l'analyse IA.
    public int Id { get; set; }

    // On stocke la date de l'analyse.
    public DateTime DateAnalyse { get; set; } = DateTime.UtcNow;

    // On stocke la décision donnée par l'IA.
    [MaxLength(50)]
    public string DecisionIa { get; set; } = string.Empty;

    // On stocke le score de confiance donné par l'IA.
    public int ScoreConfiance { get; set; }

    // On stocke le motif donné par l'IA.
    [MaxLength(2000)]
    public string Motif { get; set; } = string.Empty;

    // On stocke la version du modèle IA utilisé.
    [MaxLength(100)]
    public string VersionModele { get; set; } = string.Empty;

    // On stocke l'identifiant de l'annonce analysée.
    public int AnnonceId { get; set; }

    // On relie l'analyse IA à son annonce.
    public Annonce? Annonce { get; set; }
}