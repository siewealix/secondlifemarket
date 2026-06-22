// On importe les DTOs des catégories.
using SecondLifeMarket.Api.DTOs.Categories;

// On place ce fichier dans le namespace Services Interfaces.
namespace SecondLifeMarket.Api.Services.Interfaces;

// On crée l'interface du service des catégories.
public interface ICategorieService
{
    // On récupère toutes les catégories actives.
    Task<List<CategorieDto>> GetActiveCategoriesAsync();

    // On récupère toutes les catégories pour l'administrateur.
    Task<List<CategorieDto>> GetAllCategoriesAsync();

    // On récupère une catégorie par son id.
    Task<CategorieDto?> GetCategoryByIdAsync(int id);

    // On crée une nouvelle catégorie.
    Task<CategorieDto> CreateCategoryAsync(CreateCategorieDto dto);

    // On modifie une catégorie existante.
    Task<CategorieDto?> UpdateCategoryAsync(int id, UpdateCategorieDto dto);

    // On désactive une catégorie.
    Task<bool> DeleteCategoryAsync(int id);
}