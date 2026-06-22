// On importe Entity Framework Core.
using Microsoft.EntityFrameworkCore;

// On importe le contexte de base de données.
using SecondLifeMarket.Api.Data;

// On importe les DTOs des catégories.
using SecondLifeMarket.Api.DTOs.Categories;

// On importe les helpers.
using SecondLifeMarket.Api.Helpers;

// On importe les modèles.
using SecondLifeMarket.Api.Models;

// On importe l'interface du service.
using SecondLifeMarket.Api.Services.Interfaces;

// On place ce fichier dans le namespace Services.
namespace SecondLifeMarket.Api.Services;

// On crée le service des catégories.
public class CategorieService : ICategorieService
{
    // On stocke le contexte de base de données.
    private readonly ApplicationDbContext _context;

    // On crée le constructeur du service.
    public CategorieService(ApplicationDbContext context)
    {
        // On garde le contexte dans une variable privée.
        _context = context;
    }

    // On récupère les catégories actives.
    public async Task<List<CategorieDto>> GetActiveCategoriesAsync()
    {
        // On retourne les catégories actives triées par nom.
        return await _context.Categories
            .Where(categorie => categorie.EstActive)
            .OrderBy(categorie => categorie.Nom)
            .Select(categorie => ToDto(categorie))
            .ToListAsync();
    }

    // On récupère toutes les catégories pour l'administrateur.
    public async Task<List<CategorieDto>> GetAllCategoriesAsync()
    {
        // On retourne toutes les catégories triées par nom.
        return await _context.Categories
            .OrderBy(categorie => categorie.Nom)
            .Select(categorie => ToDto(categorie))
            .ToListAsync();
    }

    // On récupère une catégorie par son id.
    public async Task<CategorieDto?> GetCategoryByIdAsync(int id)
    {
        // On cherche la catégorie dans la base.
        Categorie? categorie = await _context.Categories.FindAsync(id);

        // On retourne null si la catégorie n'existe pas.
        if (categorie == null) return null;

        // On retourne le DTO de la catégorie.
        return ToDto(categorie);
    }

    // On crée une nouvelle catégorie.
    public async Task<CategorieDto> CreateCategoryAsync(CreateCategorieDto dto)
    {
        // On valide les textes reçus.
        ValidateCategoryTexts(dto.Nom, dto.Description, dto.Icone);

        // On nettoie le nom.
        string nom = XssProtectionHelper.CleanText(dto.Nom);

        // On nettoie la description.
        string description = XssProtectionHelper.CleanText(dto.Description);

        // On nettoie l'icône.
        string icone = XssProtectionHelper.CleanText(dto.Icone);

        // On vérifie si le nom est vide.
        if (string.IsNullOrWhiteSpace(nom)) throw new InvalidOperationException("Le nom de la catégorie est obligatoire.");

        // On vérifie si la catégorie existe déjà.
        bool exists = await _context.Categories.AnyAsync(categorie => categorie.Nom == nom);

        // On bloque si la catégorie existe déjà.
        if (exists) throw new InvalidOperationException("Cette catégorie existe déjà.");

        // On crée la nouvelle catégorie.
        Categorie categorie = new()
        {
            // On enregistre le nom.
            Nom = nom,

            // On enregistre la description.
            Description = description,

            // On enregistre l'icône.
            Icone = icone,

            // On active la catégorie.
            EstActive = true,

            // On enregistre la date de création.
            DateCreation = DateTime.UtcNow
        };

        // On ajoute la catégorie dans la base.
        _context.Categories.Add(categorie);

        // On sauvegarde les changements.
        await _context.SaveChangesAsync();

        // On retourne la catégorie créée.
        return ToDto(categorie);
    }

    // On modifie une catégorie.
    public async Task<CategorieDto?> UpdateCategoryAsync(int id, UpdateCategorieDto dto)
    {
        // On cherche la catégorie.
        Categorie? categorie = await _context.Categories.FindAsync(id);

        // On retourne null si elle n'existe pas.
        if (categorie == null) return null;

        // On valide les textes reçus.
        ValidateCategoryTexts(dto.Nom, dto.Description, dto.Icone);

        // On nettoie le nom.
        string nom = XssProtectionHelper.CleanText(dto.Nom);

        // On nettoie la description.
        string description = XssProtectionHelper.CleanText(dto.Description);

        // On nettoie l'icône.
        string icone = XssProtectionHelper.CleanText(dto.Icone);

        // On vérifie si le nom est vide.
        if (string.IsNullOrWhiteSpace(nom)) throw new InvalidOperationException("Le nom de la catégorie est obligatoire.");

        // On vérifie si un autre enregistrement utilise déjà ce nom.
        bool exists = await _context.Categories.AnyAsync(other => other.Nom == nom && other.Id != id);

        // On bloque si le nom est déjà utilisé.
        if (exists) throw new InvalidOperationException("Une autre catégorie utilise déjà ce nom.");

        // On met à jour le nom.
        categorie.Nom = nom;

        // On met à jour la description.
        categorie.Description = description;

        // On met à jour l'icône.
        categorie.Icone = icone;

        // On met à jour l'état actif.
        categorie.EstActive = dto.EstActive;

        // On sauvegarde les changements.
        await _context.SaveChangesAsync();

        // On retourne la catégorie modifiée.
        return ToDto(categorie);
    }

    // On désactive une catégorie.
    public async Task<bool> DeleteCategoryAsync(int id)
    {
        // On cherche la catégorie.
        Categorie? categorie = await _context.Categories.FindAsync(id);

        // On retourne false si elle n'existe pas.
        if (categorie == null) return false;

        // On désactive la catégorie au lieu de la supprimer définitivement.
        categorie.EstActive = false;

        // On sauvegarde les changements.
        await _context.SaveChangesAsync();

        // On retourne true pour indiquer que tout s'est bien passé.
        return true;
    }

    // On valide les textes contre le contenu dangereux.
    private void ValidateCategoryTexts(string nom, string description, string icone)
    {
        // On valide le nom.
        XssProtectionHelper.ValidateText(nom, "nom");

        // On valide la description.
        XssProtectionHelper.ValidateText(description, "description");

        // On valide l'icône.
        XssProtectionHelper.ValidateText(icone, "icône");
    }

    // On transforme une catégorie en DTO.
    private static CategorieDto ToDto(Categorie categorie)
    {
        // On retourne un objet simple pour le frontend.
        return new CategorieDto
        {
            // On renvoie l'id.
            Id = categorie.Id,

            // On renvoie le nom.
            Nom = categorie.Nom,

            // On renvoie la description.
            Description = categorie.Description,

            // On renvoie l'icône.
            Icone = categorie.Icone,

            // On renvoie l'état actif.
            EstActive = categorie.EstActive
        };
    }
}