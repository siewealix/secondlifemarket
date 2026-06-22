// On place ce fichier dans le namespace DTOs Categories.
namespace SecondLifeMarket.Api.DTOs.Categories;

// On crée le DTO envoyé au frontend.
public class CategorieDto
{
    // On renvoie l'identifiant.
    public int Id { get; set; }

    // On renvoie le nom.
    public string Nom { get; set; } = string.Empty;

    // On renvoie la description.
    public string Description { get; set; } = string.Empty;

    // On renvoie l'icône.
    public string Icone { get; set; } = string.Empty;

    // On renvoie l'état actif.
    public bool EstActive { get; set; }
}