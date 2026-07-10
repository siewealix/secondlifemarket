// On importe les DTOs des annonces.
using SecondLifeMarket.Api.DTOs.Annonces;

// On importe les fichiers envoyés depuis un formulaire.
using Microsoft.AspNetCore.Http;

// On place ce fichier dans le namespace Services Interfaces.
namespace SecondLifeMarket.Api.Services.Interfaces;

// On crée l'interface du service des annonces.
public interface IAnnonceService
{
    // On récupère les annonces publiques.
    Task<List<AnnonceDto>> GetPublicAnnoncesAsync();

    // On récupère une annonce par son id.
    Task<AnnonceDto?> GetAnnonceByIdAsync(int id);

    // On récupère les annonces du membre connecté.
    Task<List<AnnonceDto>> GetMyAnnoncesAsync(int utilisateurId);

    // On crée une annonce.
    Task<AnnonceDto> CreateAnnonceAsync(CreateAnnonceDto dto, int utilisateurId);

    // On modifie une annonce.
    Task<AnnonceDto?> UpdateAnnonceAsync(int id, UpdateAnnonceDto dto, int utilisateurId, string role);

    // On désactive une annonce.
    Task<bool> DeleteAnnonceAsync(int id, int utilisateurId, string role);

    // On ajoute une photo à une annonce.
    Task<PhotoDto> AddPhotoAsync(int annonceId, IFormFile photo, int utilisateurId, string role);

    // On supprime une photo d'une annonce.
    Task<bool> DeletePhotoAsync(int annonceId, int photoId, int utilisateurId, string role);

    // On finalise la publication d'une annonce.
    Task<AnnonceDto?> PublishAnnonceAsync(int id, int utilisateurId, string role);

    // On récupère les annonces à réexaminer par l'admin.
    Task<List<AnnonceDto>> GetAdminReviewAnnoncesAsync();

    // L'admin valide une annonce.
    Task<AnnonceDto?> ValidateAnnonceByAdminAsync(int id);

    // L'admin rejette une annonce.
    Task<AnnonceDto?> RejectAnnonceByAdminAsync(int id);

    // Marque une annonce comme vendue.
    Task<AnnonceDto?> MarkAnnonceAsSoldAsync(int id, int utilisateurId);
}