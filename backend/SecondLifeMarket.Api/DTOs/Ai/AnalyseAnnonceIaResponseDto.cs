namespace SecondLifeMarket.Api.DTOs.Ai;

public class AnalyseAnnonceIaResponseDto
{
    public string DecisionIa { get; set; } = string.Empty;

    public int ScoreConfiance { get; set; }

    public string Motif { get; set; } = string.Empty;

    public bool CorrespondancePhotos { get; set; } = true;
}