// On place ce fichier dans le namespace DTOs Categories.
namespace SecondLifeMarket.Api.DTOs.Categories;

// On crée le DTO pour ajouter une catégorie.
public class CreateCategorieDto
{
    // On reçoit le nom de la catégorie.
    public string Nom { get; set; } = string.Empty;

    // On reçoit la description de la catégorie.
    public string Description { get; set; } = string.Empty;

    // On reçoit l'icône de la catégorie.
    public string Icone { get; set; } = string.Empty;
}