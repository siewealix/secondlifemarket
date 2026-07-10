// On importe les DTOs IA.
using SecondLifeMarket.Api.DTOs.Ai;

// On place ce fichier dans le namespace Services Interfaces.
namespace SecondLifeMarket.Api.Services.Interfaces;

// On crée l'interface du service IA.
public interface IAiAnnonceAnalysisService
{
    // On analyse une annonce avec le texte et les images.
    Task<AnalyseAnnonceIaResponseDto> AnalyseAsync(AnalyseAnnonceIaRequestDto dto);
}