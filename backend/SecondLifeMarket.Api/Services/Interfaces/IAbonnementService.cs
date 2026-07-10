using SecondLifeMarket.Api.DTOs.Abonnements;

namespace SecondLifeMarket.Api.Services.Interfaces;

public interface IAbonnementService
{
    // Retourne les offres d'abonnement disponibles.
    Task<List<OffreAbonnementDto>> GetOffresAbonnementAsync();

    // Permet à un membre de souscrire à un abonnement.
    Task<AbonnementDto> SouscrireAbonnementAsync(SouscrireAbonnementDto dto, int utilisateurId);

    // Permet à un membre de résilier son abonnement.
    Task<MonAbonnementDto> ResilierAbonnementAsync(int utilisateurId);

    // Retourne l'abonnement actuel du membre et sa limite de publication.
    Task<MonAbonnementDto> GetMonAbonnementAsync(int utilisateurId);

    // Retourne la limite gratuite de publication.
    int GetLimiteGratuitePublication();
}