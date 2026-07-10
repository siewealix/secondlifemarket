using SecondLifeMarket.Api.DTOs.DemandesAchat;

namespace SecondLifeMarket.Api.Services.Interfaces;

public interface IDemandeAchatService
{
    // Crée une demande d'achat pour un membre connecté.
    Task<DemandeAchatDto> CreateDemandeAchatAsync(CreateDemandeAchatDto dto, int acheteurId);

    // Retourne les demandes d'achat envoyées par un acheteur.
    Task<List<DemandeAchatDto>> GetMyDemandesAchatAsync(int acheteurId);

    // Annule une demande d'achat envoyée par un acheteur.
    Task<DemandeAchatDto> CancelDemandeAchatAsync(int demandeId, int acheteurId);

    // Retourne les demandes d'achat reçues par un vendeur.
    Task<List<DemandeAchatDto>> GetDemandesRecuesAsync(int vendeurId);

    // Accepte une demande d'achat reçue par un vendeur.
    Task<DemandeAchatDto> AcceptDemandeAchatAsync(int demandeId, int vendeurId);

    // Refuse une demande d'achat reçue par un vendeur.
    Task<DemandeAchatDto> RefuseDemandeAchatAsync(int demandeId, int vendeurId);
}