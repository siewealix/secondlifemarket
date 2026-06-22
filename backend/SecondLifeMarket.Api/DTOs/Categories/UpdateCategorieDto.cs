// On place ce fichier dans le namespace DTOs Categories.
namespace SecondLifeMarket.Api.DTOs.Categories;

// On crée le DTO pour modifier une catégorie.
public class UpdateCategorieDto
{
    // On reçoit le nouveau nom.
    public string Nom { get; set; } = string.Empty;

    // On reçoit la nouvelle description.
    public string Description { get; set; } = string.Empty;

    // On reçoit la nouvelle icône.
    public string Icone { get; set; } = string.Empty;

    // On reçoit l'état actif ou inactif.
    public bool EstActive { get; set; } = true;
}