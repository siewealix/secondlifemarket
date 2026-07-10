// On place ce fichier dans le namespace DTOs Annonces.
namespace SecondLifeMarket.Api.DTOs.Annonces;

// On crée le DTO pour publier une annonce.
public class CreateAnnonceDto
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

    // On reçoit l'identifiant de la catégorie.
    public int CategorieId { get; set; }
}