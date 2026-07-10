// On place ce fichier dans le namespace DTOs Ai.
namespace SecondLifeMarket.Api.DTOs.Ai;

// On crée le DTO envoyé au service IA.
public class AnalyseAnnonceIaRequestDto
{
    // On reçoit le titre.
    public string Titre { get; set; } = string.Empty;

    // On reçoit la description.
    public string Description { get; set; } = string.Empty;

    // On reçoit le prix.
    public decimal Prix { get; set; }

    // On reçoit la ville.
    public string Ville { get; set; } = string.Empty;

    // On reçoit l'état de l'objet.
    public string EtatObjet { get; set; } = string.Empty;

    // On reçoit le nom de la catégorie.
    public string NomCategorie { get; set; } = string.Empty;

    // On reçoit les images en base64.
    public List<string> PhotoDataUrls { get; set; } = new();
}