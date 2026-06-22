// On importe les DTOs d'authentification.
using SecondLifeMarket.Api.DTOs.Auth;

// On place ce fichier dans le dossier Services/Interfaces.
namespace SecondLifeMarket.Api.Services.Interfaces;

// On crée l'interface du service d'authentification.
public interface IAuthService
{
    // On définit la méthode d'inscription.
    Task<AuthResponseDto> RegisterAsync(RegisterDto dto, HttpResponse response);

    // On définit la méthode de connexion.
    Task<AuthResponseDto?> LoginAsync(LoginDto dto, HttpRequest request, HttpResponse response);

    // On définit la méthode qui retourne le nombre de tentatives restantes.
    Task<int> GetRemainingLoginAttemptsAsync(string email, HttpRequest request);

    // On définit la méthode de renouvellement du token.
    Task<AuthResponseDto?> RefreshAsync(HttpRequest request, HttpResponse response);

    // On définit la méthode de déconnexion.
    Task LogoutAsync(HttpRequest request, HttpResponse response);

    // On définit la méthode qui récupère l'utilisateur connecté.
    Task<AuthUserDto?> GetMeAsync(int userId);
}