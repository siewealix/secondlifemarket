using SecondLifeMarket.Api.DTOs.Abonnements.Admin;

namespace SecondLifeMarket.Api.Services.Interfaces;

public interface IAdminAbonnementService
{
    // Retourne tous les abonnements des membres.
    Task<List<AbonnementAdminDto>> GetAbonnementsAsync();

    // Retourne tous les types d'abonnement.
    Task<List<TypeAbonnementAdminDto>> GetTypesAbonnementAsync();

    // Ajoute un type d'abonnement.
    Task<TypeAbonnementAdminDto> CreateTypeAbonnementAsync(CreateTypeAbonnementDto dto);

    // Modifie un type d'abonnement.
    Task<TypeAbonnementAdminDto?> UpdateTypeAbonnementAsync(int id, UpdateTypeAbonnementDto dto);

    // Active un type d'abonnement.
    Task<TypeAbonnementAdminDto?> ActiverTypeAbonnementAsync(int id);

    // Désactive un type d'abonnement.
    Task<TypeAbonnementAdminDto?> DesactiverTypeAbonnementAsync(int id);
}