using SecondLifeMarket.Api.DTOs.Signalements;

namespace SecondLifeMarket.Api.Services.Interfaces;

public interface ISignalementService
{
    // Crée un signalement pour une annonce.
    Task<SignalementAnnonceDto> CreateSignalementAnnonceAsync(
        int annonceId,
        CreateSignalementAnnonceDto dto,
        int signaleurId
    );

    // Crée un signalement pour un utilisateur depuis une conversation.
    Task<SignalementUtilisateurDto> CreateSignalementUtilisateurAsync(
        int conversationId,
        int utilisateurSignaleId,
        CreateSignalementUtilisateurDto dto,
        int signaleurId
    );

    // Retourne les signalements d'annonces en attente pour l'administrateur.
    Task<List<SignalementAnnonceDto>> GetSignalementsAnnoncesAdminAsync();

    // Retourne les signalements d'utilisateurs en attente pour l'administrateur.
    Task<List<SignalementUtilisateurDto>> GetSignalementsUtilisateursAdminAsync();

    // Valide un signalement d'annonce.
    Task<SignalementAnnonceDto> ValiderSignalementAnnonceAsync(
        int signalementId,
        TraiterSignalementDto dto,
        int administrateurId
    );

    // Rejette un signalement d'annonce.
    Task<SignalementAnnonceDto> RejeterSignalementAnnonceAsync(
        int signalementId,
        TraiterSignalementDto dto,
        int administrateurId
    );

    // Valide un signalement d'utilisateur.
    Task<SignalementUtilisateurDto> ValiderSignalementUtilisateurAsync(
        int signalementId,
        TraiterSignalementDto dto,
        int administrateurId
    );

    // Rejette un signalement d'utilisateur.
    Task<SignalementUtilisateurDto> RejeterSignalementUtilisateurAsync(
        int signalementId,
        TraiterSignalementDto dto,
        int administrateurId
    );
}