// On importe les outils d'autorisation.
using Microsoft.AspNetCore.Authorization;

// On importe les outils API.
using Microsoft.AspNetCore.Mvc;

// On importe les claims.
using System.Security.Claims;

// On importe les DTOs d'authentification.
using SecondLifeMarket.Api.DTOs.Auth;

// On importe le service d'authentification.
using SecondLifeMarket.Api.Services.Interfaces;

// On place ce fichier dans le dossier Controllers.
namespace SecondLifeMarket.Api.Controllers;

// On indique que cette classe est un contrôleur API.
[ApiController]

// On définit la route de base du contrôleur.
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    // On stocke le service d'authentification.
    private readonly IAuthService _authService;

    // On crée le constructeur du contrôleur.
    public AuthController(IAuthService authService)
    {
        // On garde le service dans une variable privée.
        _authService = authService;
    }

    // On crée la route d'inscription.
    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterDto dto)
    {
        // On essaie d'inscrire le membre.
        try
        {
            // On appelle le service d'inscription.
            AuthResponseDto response = await _authService.RegisterAsync(dto, Response);

            // On retourne la réponse si tout est correct.
            return Ok(response);
        }
        catch (InvalidOperationException error)
        {
            // On retourne une erreur lisible si les données sont incorrectes.
            return BadRequest(new { message = error.Message });
        }
    }

    // On crée la route de connexion.
    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto dto)
    {
        // On essaie de connecter l'utilisateur.
        try
        {
            // On appelle le service de connexion.
            AuthResponseDto? response = await _authService.LoginAsync(dto, Request, Response);

            // On vérifie si la connexion a échoué.
            if (response == null)
            {
                // On récupère le nombre de tentatives restantes.
                int remainingAttempts = await _authService.GetRemainingLoginAttemptsAsync(dto.Email, Request);

                // On retourne une erreur avec le décompte.
                return Unauthorized(new
                {
                    // On donne un message clair.
                    message = $"Email ou mot de passe incorrect. Il vous reste {remainingAttempts} tentative(s).",

                    // On renvoie aussi le nombre pour le frontend.
                    remainingAttempts = remainingAttempts
                });
            }

            // On retourne la réponse si tout est correct.
            return Ok(response);
        }
        catch (InvalidOperationException error)
        {
            // On retourne 429 quand l'utilisateur est bloqué.
            return StatusCode(429, new
            {
                // On affiche le message de blocage.
                message = error.Message,

                // Il ne reste plus aucune tentative.
                remainingAttempts = 0
            });
        }
    }

    // On crée la route de renouvellement du token.
    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh()
    {
        // On appelle le service de renouvellement.
        AuthResponseDto? response = await _authService.RefreshAsync(Request, Response);

        // On refuse si la session est expirée.
        if (response == null) return Unauthorized(new { message = "Session expirée." });

        // On retourne un nouveau access token.
        return Ok(response);
    }

    // On crée la route de déconnexion.
    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        // On appelle le service de déconnexion.
        await _authService.LogoutAsync(Request, Response);

        // On retourne une réponse simple.
        return Ok(new { message = "Déconnexion réussie." });
    }

    // On protège la route avec le token JWT.
    [Authorize]

    // On crée la route de récupération de l'utilisateur connecté.
    [HttpGet("me")]
    public async Task<IActionResult> Me()
    {
        // On récupère l'identifiant de l'utilisateur depuis le token.
        string? userIdText = User.FindFirstValue(ClaimTypes.NameIdentifier);

        // On refuse si l'identifiant est absent.
        if (userIdText == null) return Unauthorized();

        // On transforme l'identifiant en entier.
        int userId = int.Parse(userIdText);

        // On récupère l'utilisateur connecté.
        AuthUserDto? user = await _authService.GetMeAsync(userId);

        // On refuse si l'utilisateur n'existe plus.
        if (user == null) return Unauthorized();

        // On retourne l'utilisateur connecté.
        return Ok(user);
    }
}