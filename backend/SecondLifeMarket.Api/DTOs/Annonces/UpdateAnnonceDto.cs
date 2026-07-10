// On place ce fichier dans le namespace DTOs Annonces.
namespace SecondLifeMarket.Api.DTOs.Annonces;

// On crée le DTO pour modifier une annonce.
public class UpdateAnnonceDto
{
    // On reçoit le nouveau titre.
    public string Titre { get; set; } = string.Empty;

    // On reçoit la nouvelle description.
    public string Description { get; set; } = string.Empty;

    // On reçoit le nouveau prix.
    public decimal Prix { get; set; }

    // On reçoit la nouvelle ville.
    public string Ville { get; set; } = string.Empty;

    // On reçoit le nouvel état de l'objet.
    public string EtatObjet { get; set; } = string.Empty;

    // On reçoit le nouveau statut.
    public string Statut { get; set; } = "Disponible";

    // On reçoit la nouvelle catégorie.
    public int CategorieId { get; set; }
}