using SecondLifeMarket.Api.DTOs.TableauxBord;

namespace SecondLifeMarket.Api.Services.Interfaces;

public interface ITableauBordService
{
    // Retourne les statistiques du tableau de bord vendeur.
    Task<VendeurDashboardDto> GetVendeurDashboardAsync(int utilisateurId);

    // Retourne les statistiques du tableau de bord acheteur.
    Task<AcheteurDashboardDto> GetAcheteurDashboardAsync(int utilisateurId);

    // Retourne les statistiques du tableau de bord administrateur.
    Task<AdminDashboardDto> GetAdminDashboardAsync(int utilisateurId);
}