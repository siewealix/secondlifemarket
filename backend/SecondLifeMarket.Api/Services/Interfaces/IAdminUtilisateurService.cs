using SecondLifeMarket.Api.DTOs.Utilisateurs;

namespace SecondLifeMarket.Api.Services.Interfaces;

public interface IAdminUtilisateurService
{
    // Retourne la liste des membres pour l'administrateur.
    Task<List<UtilisateurAdminDto>> GetUtilisateursAsync();

    // Suspend un compte membre.
    Task<UtilisateurAdminDto> SuspendreUtilisateurAsync(int utilisateurId, int administrateurId);

    // Réactive un compte membre.
    Task<UtilisateurAdminDto> ReactiverUtilisateurAsync(int utilisateurId, int administrateurId);
}