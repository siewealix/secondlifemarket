// On importe l'autorisation.
using Microsoft.AspNetCore.Authorization;

// On importe les outils API.
using Microsoft.AspNetCore.Mvc;

// On importe les DTOs.
using SecondLifeMarket.Api.DTOs.Categories;

// On importe l'interface du service.
using SecondLifeMarket.Api.Services.Interfaces;

// On place ce fichier dans le namespace Controllers.
namespace SecondLifeMarket.Api.Controllers;

// On indique que cette classe est un contrôleur API.
[ApiController]

// On définit la route de base.
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    // On stocke le service des catégories.
    private readonly ICategorieService _categorieService;

    // On crée le constructeur.
    public CategoriesController(ICategorieService categorieService)
    {
        // On garde le service dans une variable privée.
        _categorieService = categorieService;
    }

    // On récupère les catégories actives.
    [HttpGet]
    public async Task<IActionResult> GetActiveCategories()
    {
        // On appelle le service.
        List<CategorieDto> categories = await _categorieService.GetActiveCategoriesAsync();

        // On retourne les catégories.
        return Ok(categories);
    }

    // On récupère toutes les catégories pour l'administrateur.
    [Authorize(Roles = "Administrateur")]
    [HttpGet("admin")]
    public async Task<IActionResult> GetAllCategories()
    {
        // On appelle le service.
        List<CategorieDto> categories = await _categorieService.GetAllCategoriesAsync();

        // On retourne les catégories.
        return Ok(categories);
    }

    // On récupère une catégorie par son id.
    [HttpGet("{id}")]
    public async Task<IActionResult> GetCategoryById(int id)
    {
        // On appelle le service.
        CategorieDto? categorie = await _categorieService.GetCategoryByIdAsync(id);

        // On retourne 404 si la catégorie n'existe pas.
        if (categorie == null) return NotFound(new { message = "Catégorie introuvable." });

        // On retourne la catégorie.
        return Ok(categorie);
    }

    // On crée une catégorie.
    [Authorize(Roles = "Administrateur")]
    [HttpPost]
    public async Task<IActionResult> CreateCategory(CreateCategorieDto dto)
    {
        // On essaie de créer la catégorie.
        try
        {
            // On appelle le service.
            CategorieDto categorie = await _categorieService.CreateCategoryAsync(dto);

            // On retourne la catégorie créée.
            return Ok(categorie);
        }
        catch (InvalidOperationException error)
        {
            // On retourne une erreur claire.
            return BadRequest(new { message = error.Message });
        }
    }

    // On modifie une catégorie.
    [Authorize(Roles = "Administrateur")]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateCategory(int id, UpdateCategorieDto dto)
    {
        // On essaie de modifier la catégorie.
        try
        {
            // On appelle le service.
            CategorieDto? categorie = await _categorieService.UpdateCategoryAsync(id, dto);

            // On retourne 404 si la catégorie n'existe pas.
            if (categorie == null) return NotFound(new { message = "Catégorie introuvable." });

            // On retourne la catégorie modifiée.
            return Ok(categorie);
        }
        catch (InvalidOperationException error)
        {
            // On retourne une erreur claire.
            return BadRequest(new { message = error.Message });
        }
    }

    // On désactive une catégorie.
    [Authorize(Roles = "Administrateur")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCategory(int id)
    {
        // On appelle le service.
        bool deleted = await _categorieService.DeleteCategoryAsync(id);

        // On retourne 404 si la catégorie n'existe pas.
        if (!deleted) return NotFound(new { message = "Catégorie introuvable." });

        // On retourne un message de confirmation.
        return Ok(new { message = "Catégorie désactivée avec succès." });
    }
}