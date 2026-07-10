using System.ComponentModel.DataAnnotations;

namespace SecondLifeMarket.Api.DTOs.Signalements;

public class TraiterSignalementDto
{
    // Décision ou remarque écrite par l'administrateur.
    [MaxLength(1000)]
    public string DecisionAdmin { get; set; } = string.Empty;
}