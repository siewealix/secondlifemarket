// On importe Entity Framework.
using Microsoft.EntityFrameworkCore;

// On importe la base de données.
using SecondLifeMarket.Api.Data;

// On importe les DTOs.
using SecondLifeMarket.Api.DTOs.Auth;

// On importe les helpers.
using SecondLifeMarket.Api.Helpers;

// On importe les modèles.
using SecondLifeMarket.Api.Models;

// On importe l'interface du service.
using SecondLifeMarket.Api.Services.Interfaces;

// On place ce fichier dans le namespace du projet.
namespace SecondLifeMarket.Api.Services;

// On crée le service d'authentification.
public class AuthService : IAuthService
{
    // On définit le nom sécurisé du cookie.
    private const string CookieName = "__Host-slm.sid";

    // On stocke le contexte de base de données.
    private readonly ApplicationDbContext _context;

    // On stocke l'aide JWT.
    private readonly JwtHelper _jwtHelper;

    // On stocke la configuration.
    private readonly IConfiguration _configuration;

    // On définit le nombre maximum de tentatives échouées.
    private const int MaxFailedAttempts = 3;

    // On définit la durée de blocage en minutes.
    private const int LockMinutes = 15;

    // On crée le constructeur du service.
    public AuthService(ApplicationDbContext context, JwtHelper jwtHelper, IConfiguration configuration)
    {
        // On garde le contexte.
        _context = context;

        // On garde l'aide JWT.
        _jwtHelper = jwtHelper;

        // On garde la configuration.
        _configuration = configuration;
    }

    // On inscrit un nouveau membre.
    public async Task<AuthResponseDto> RegisterAsync(RegisterDto dto, HttpResponse response)
    {
        // On vérifie si le nom est vide.
        if (string.IsNullOrWhiteSpace(dto.Nom)) throw new InvalidOperationException("Le nom est obligatoire.");

        // On vérifie si le prénom est vide.
        if (string.IsNullOrWhiteSpace(dto.Prenom)) throw new InvalidOperationException("Le prénom est obligatoire.");

        // On vérifie si l'email est vide.
        if (string.IsNullOrWhiteSpace(dto.Email)) throw new InvalidOperationException("L'adresse email est obligatoire.");

        // On vérifie si le téléphone est vide.
        if (string.IsNullOrWhiteSpace(dto.Telephone)) throw new InvalidOperationException("Le téléphone est obligatoire.");

        // On vérifie si la ville est vide.
        if (string.IsNullOrWhiteSpace(dto.Ville)) throw new InvalidOperationException("La ville est obligatoire.");

        // On vérifie si le mot de passe est vide.
        if (string.IsNullOrWhiteSpace(dto.Password)) throw new InvalidOperationException("Le mot de passe est obligatoire.");

        // On vérifie si la confirmation est vide.
        if (string.IsNullOrWhiteSpace(dto.ConfirmPassword)) throw new InvalidOperationException("La confirmation du mot de passe est obligatoire.");

        // On vérifie si les deux mots de passe sont différents.
        if (dto.Password != dto.ConfirmPassword) throw new InvalidOperationException("Les deux mots de passe ne correspondent pas.");

        // On vérifie si le mot de passe est assez fort.
        if (!IsStrongPassword(dto.Password)) throw new InvalidOperationException("Le mot de passe doit contenir au moins 12 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.");

        // On vérifie si le nom contient un contenu dangereux.
        XssProtectionHelper.ValidateText(dto.Nom, "nom");

        // On vérifie si le prénom contient un contenu dangereux.
        XssProtectionHelper.ValidateText(dto.Prenom, "prénom");

        // On vérifie si l'email contient un contenu dangereux.
        XssProtectionHelper.ValidateText(dto.Email, "email");

        // On vérifie si le téléphone contient un contenu dangereux.
        XssProtectionHelper.ValidateText(dto.Telephone, "téléphone");

        // On vérifie si la ville contient un contenu dangereux.
        XssProtectionHelper.ValidateText(dto.Ville, "ville");

        // On nettoie le nom.
        string nom = XssProtectionHelper.CleanText(dto.Nom);

        // On nettoie le prénom.
        string prenom = XssProtectionHelper.CleanText(dto.Prenom);

        // On nettoie l'email.
        string email = XssProtectionHelper.CleanText(dto.Email).ToLower();

        // On nettoie le téléphone.
        string telephone = XssProtectionHelper.CleanText(dto.Telephone);

        // On nettoie la ville.
        string ville = XssProtectionHelper.CleanText(dto.Ville);

        // On vérifie si l'email existe déjà.
        bool emailExists = await _context.Utilisateurs.AnyAsync(u => u.Email == email);

        // On refuse l'inscription si l'email existe déjà.
        if (emailExists) throw new InvalidOperationException("Cette adresse email est déjà utilisée.");

        // On crée un nouvel utilisateur.
        Utilisateur utilisateur = new()
        {
            // On enregistre le nom nettoyé.
            Nom = nom,

            // On enregistre le prénom nettoyé.
            Prenom = prenom,

            // On enregistre l'email nettoyé.
            Email = email,

            // On enregistre le téléphone nettoyé.
            Telephone = telephone,

            // On enregistre la ville nettoyée.
            Ville = ville,

            // On force le rôle à Membre.
            Role = "Membre",

            // On active le compte.
            EstActif = true,

            // On enregistre la date de création.
            DateCreation = DateTime.UtcNow,

            // On hash le mot de passe.
            MotDePasseHash = PasswordHelper.HashPassword(dto.Password)
        };

        // On ajoute l'utilisateur dans la base.
        _context.Utilisateurs.Add(utilisateur);

        // On sauvegarde l'utilisateur.
        await _context.SaveChangesAsync();

        // On génère un access token.
        string accessToken = _jwtHelper.GenerateAccessToken(utilisateur);

        // On génère un refresh token.
        string refreshToken = _jwtHelper.GenerateRefreshToken();

        // On sauvegarde le refresh token hashé.
        await SaveRefreshTokenAsync(utilisateur.Id, refreshToken);

        // On place le refresh token dans le cookie sécurisé.
        SetRefreshCookie(response, refreshToken);

        // On retourne la réponse d'authentification.
        return BuildAuthResponse(utilisateur, accessToken);
    }

    // On connecte l'utilisateur.
    public async Task<AuthResponseDto?> LoginAsync(LoginDto dto, HttpRequest request, HttpResponse response)
    {
        // On nettoie l'email reçu.
        string email = XssProtectionHelper.CleanText(dto.Email).ToLower();

        // On vérifie si l'email contient un contenu dangereux.
        XssProtectionHelper.ValidateText(email, "email");

        // On récupère l'adresse IP de la personne qui essaie de se connecter.
        string ipAddress = GetIpAddress(request);

        // On récupère le navigateur utilisé.
        string userAgent = GetUserAgent(request);

        // On vérifie si cette personne est temporairement bloquée.
        await CheckBruteForceAsync(email, ipAddress);

        // On cherche l'utilisateur par email.
        Utilisateur? utilisateur = await _context.Utilisateurs.FirstOrDefaultAsync(u => u.Email == email);

        // On vérifie si l'utilisateur n'existe pas.
        if (utilisateur == null)
        {
            // On enregistre une tentative échouée.
            await AddLoginAttemptAsync(email, ipAddress, userAgent, false, "Email ou mot de passe incorrect.");

            // On refuse la connexion.
            return null;
        }

        // On vérifie si le compte est suspendu.
        if (!utilisateur.EstActif)
        {
            // On enregistre une tentative échouée.
            await AddLoginAttemptAsync(email, ipAddress, userAgent, false, "Compte suspendu.");

            // On bloque la connexion avec un message clair.
            throw new InvalidOperationException("Votre compte a été suspendu. Connexion impossible.");
        }

        // On vérifie le mot de passe.
        bool passwordIsValid = PasswordHelper.VerifyPassword(dto.Password, utilisateur.MotDePasseHash);

        // On vérifie si le mot de passe est incorrect.
        if (!passwordIsValid)
        {
            // On enregistre une tentative échouée.
            await AddLoginAttemptAsync(email, ipAddress, userAgent, false, "Email ou mot de passe incorrect.");

            // On refuse la connexion.
            return null;
        }

        // On enregistre une tentative réussie.
        await AddLoginAttemptAsync(email, ipAddress, userAgent, true, "Connexion réussie.");

        // On crée un access token.
        string accessToken = _jwtHelper.GenerateAccessToken(utilisateur);

        // On crée un refresh token.
        string refreshToken = _jwtHelper.GenerateRefreshToken();

        // On enregistre le refresh token hashé.
        await SaveRefreshTokenAsync(utilisateur.Id, refreshToken);

        // On place le refresh token dans un cookie sécurisé.
        SetRefreshCookie(response, refreshToken);

        // On retourne la réponse.
        return BuildAuthResponse(utilisateur, accessToken);
    }

    // On renouvelle le token d'accès.
    public async Task<AuthResponseDto?> RefreshAsync(HttpRequest request, HttpResponse response)
    {
        // On vérifie si le cookie existe.
        if (!request.Cookies.TryGetValue(CookieName, out string? refreshToken)) return null;

        // On hash le refresh token reçu.
        string refreshTokenHash = PasswordHelper.HashToken(refreshToken);

        // On cherche le token dans la base.
        RefreshToken? savedToken = await _context.RefreshTokens
            .Include(r => r.Utilisateur)
            .FirstOrDefaultAsync(r => r.TokenHash == refreshTokenHash);

        // On refuse si le token n'existe pas.
        if (savedToken == null) return null;

        // On refuse si le token est révoqué.
        if (savedToken.EstRevoque) return null;

        // On refuse si le token est expiré.
        if (savedToken.DateExpiration < DateTime.UtcNow) return null;

        // On refuse si l'utilisateur est introuvable.
        if (savedToken.Utilisateur == null) return null;

        // On vérifie si le compte est suspendu.
        if (!savedToken.Utilisateur.EstActif)
        {
            // On révoque l'ancien refresh token.
            savedToken.EstRevoque = true;

            // On sauvegarde la révocation.
            await _context.SaveChangesAsync();

            // On supprime le cookie du navigateur.
            DeleteRefreshCookie(response);

            // On bloque le renouvellement du token.
            throw new InvalidOperationException("Votre compte a été suspendu. Session expirée.");
        }

        // On révoque l'ancien refresh token.
        savedToken.EstRevoque = true;

        // On crée un nouveau refresh token.
        string newRefreshToken = _jwtHelper.GenerateRefreshToken();

        // On enregistre le nouveau refresh token.
        await SaveRefreshTokenAsync(savedToken.Utilisateur.Id, newRefreshToken);

        // On sauvegarde la révocation de l'ancien token.
        await _context.SaveChangesAsync();

        // On place le nouveau refresh token dans le cookie.
        SetRefreshCookie(response, newRefreshToken);

        // On crée un nouveau access token.
        string accessToken = _jwtHelper.GenerateAccessToken(savedToken.Utilisateur);

        // On retourne la réponse.
        return BuildAuthResponse(savedToken.Utilisateur, accessToken);
    }

    // On déconnecte l'utilisateur.
    public async Task LogoutAsync(HttpRequest request, HttpResponse response)
    {
        // On vérifie si le cookie existe.
        if (request.Cookies.TryGetValue(CookieName, out string? refreshToken))
        {
            // On hash le refresh token.
            string refreshTokenHash = PasswordHelper.HashToken(refreshToken);

            // On cherche le token dans la base.
            RefreshToken? savedToken = await _context.RefreshTokens.FirstOrDefaultAsync(r => r.TokenHash == refreshTokenHash);

            // On vérifie si le token existe.
            if (savedToken != null)
            {
                // On révoque le token.
                savedToken.EstRevoque = true;

                // On sauvegarde la modification.
                await _context.SaveChangesAsync();
            }
        }

        // On supprime le cookie côté navigateur.
        DeleteRefreshCookie(response);
    }

    // On récupère l'utilisateur connecté.
    public async Task<AuthUserDto?> GetMeAsync(int userId)
    {
        // On cherche l'utilisateur par son id.
        Utilisateur? utilisateur = await _context.Utilisateurs.FindAsync(userId);

        // On retourne null si l'utilisateur n'existe pas.
        if (utilisateur == null) return null;

        // On retourne null si le compte est inactif.
        if (!utilisateur.EstActif) return null;

        // On retourne les informations publiques.
        return BuildUserDto(utilisateur);
    }

    // On sauvegarde un refresh token.
    private async Task SaveRefreshTokenAsync(int utilisateurId, string refreshToken)
    {
        // On récupère le nombre de jours de validité.
        int days = int.Parse(_configuration["Jwt:RefreshTokenDays"]!);

        // On crée l'objet refresh token.
        RefreshToken token = new()
        {
            // On hash le token avant de l'enregistrer.
            TokenHash = PasswordHelper.HashToken(refreshToken),

            // On définit la date d'expiration.
            DateExpiration = DateTime.UtcNow.AddDays(days),

            // On relie le token à l'utilisateur.
            UtilisateurId = utilisateurId
        };

        // On ajoute le token au contexte.
        _context.RefreshTokens.Add(token);

        // On sauvegarde en base.
        await _context.SaveChangesAsync();
    }

    // On récupère le nombre de tentatives restantes pour un email et une IP.
    public async Task<int> GetRemainingLoginAttemptsAsync(string email, HttpRequest request)
    {
        // On nettoie l'email reçu.
        string cleanEmail = XssProtectionHelper.CleanText(email).ToLower();

        // On récupère l'adresse IP.
        string ipAddress = GetIpAddress(request);

        // On compte les tentatives échouées.
        int failedAttempts = await CountRecentFailedAttemptsAsync(cleanEmail, ipAddress);

        // On retourne le nombre de tentatives restantes.
        return CalculateRemainingAttempts(failedAttempts);
    }

    // On place le refresh token dans un cookie sécurisé.
    private void SetRefreshCookie(HttpResponse response, string refreshToken)
    {
        // On récupère le nombre de jours de validité.
        int days = int.Parse(_configuration["Jwt:RefreshTokenDays"]!);

        // On configure le cookie.
        CookieOptions options = new()
        {
            // On empêche JavaScript de lire le cookie.
            HttpOnly = true,

            // On impose HTTPS.
            Secure = true,

            // On limite l'envoi du cookie au même site.
            SameSite = SameSiteMode.Strict,

            // On définit le chemin du cookie.
            Path = "/",

            // On définit la date d'expiration du cookie.
            Expires = DateTimeOffset.UtcNow.AddDays(days)
        };

        // On ajoute le cookie dans la réponse.
        response.Cookies.Append(CookieName, refreshToken, options);
    }

    // On supprime le cookie sécurisé.
    private void DeleteRefreshCookie(HttpResponse response)
    {
        // On configure la suppression avec les mêmes règles.
        CookieOptions options = new()
        {
            // On garde HttpOnly.
            HttpOnly = true,

            // On garde Secure.
            Secure = true,

            // On garde SameSite Strict.
            SameSite = SameSiteMode.Strict,

            // On garde le même chemin.
            Path = "/"
        };

        // On supprime le cookie.
        response.Cookies.Delete(CookieName, options);
    }

    // On vérifie si un mot de passe est fort.
    private bool IsStrongPassword(string password)
    {
        // On vérifie si le mot de passe contient au moins 12 caractères.
        bool hasMinLength = password.Length >= 12;

        // On vérifie si le mot de passe contient au moins une majuscule.
        bool hasUppercase = password.Any(char.IsUpper);

        // On vérifie si le mot de passe contient au moins une minuscule.
        bool hasLowercase = password.Any(char.IsLower);

        // On vérifie si le mot de passe contient au moins un chiffre.
        bool hasNumber = password.Any(char.IsDigit);

        // On vérifie si le mot de passe contient au moins un caractère spécial.
        bool hasSpecialChar = password.Any(character => !char.IsLetterOrDigit(character));

        // On retourne vrai seulement si toutes les règles sont respectées.
        return hasMinLength && hasUppercase && hasLowercase && hasNumber && hasSpecialChar;
    }

    // On construit la réponse d'authentification.
    private AuthResponseDto BuildAuthResponse(Utilisateur utilisateur, string accessToken)
    {
        // On retourne le token et l'utilisateur.
        return new AuthResponseDto
        {
            // On place le token d'accès.
            AccessToken = accessToken,

            // On place les informations utilisateur.
            User = BuildUserDto(utilisateur)
        };
    }

    // On construit l'utilisateur à renvoyer.
    private AuthUserDto BuildUserDto(Utilisateur utilisateur)
    {
        // On retourne un DTO utilisateur.
        return new AuthUserDto
        {
            // On renvoie l'id.
            Id = utilisateur.Id,

            // On renvoie le nom.
            Nom = utilisateur.Nom,

            // On renvoie le prénom.
            Prenom = utilisateur.Prenom,

            // On renvoie l'email.
            Email = utilisateur.Email,

            // On renvoie le rôle.
            Role = utilisateur.Role
        };
    }

    // On vérifie si une adresse IP et un email ont trop échoué récemment.
    private async Task CheckBruteForceAsync(string email, string ipAddress)
    {
        // On compte les tentatives échouées récentes.
        int failedAttempts = await CountRecentFailedAttemptsAsync(email, ipAddress);

        // On bloque si le nombre d'échecs atteint la limite.
        if (failedAttempts >= MaxFailedAttempts)
        {
            // On affiche un message clair.
            throw new InvalidOperationException("Trop de tentatives de connexion. Veuillez attendre 15 minutes avant de réessayer.");
        }
    }

    // On enregistre une tentative de connexion.
    private async Task AddLoginAttemptAsync(string email, string ipAddress, string userAgent, bool success, string message)
    {
        // On crée une nouvelle tentative.
        LoginAttempt attempt = new()
        {
            // On stocke l'email utilisé.
            Email = email,

            // On stocke l'adresse IP.
            IpAddress = ipAddress,

            // On stocke le navigateur.
            UserAgent = userAgent,

            // On stocke si la tentative a réussi.
            EstReussie = success,

            // On stocke le message.
            Message = message,

            // On stocke la date actuelle.
            DateTentative = DateTime.UtcNow
        };

        // On ajoute la tentative dans le contexte.
        _context.LoginAttempts.Add(attempt);

        // On sauvegarde en base de données.
        await _context.SaveChangesAsync();
    }

    // On récupère l'adresse IP du client.
    private string GetIpAddress(HttpRequest request)
    {
        // On récupère l'adresse IP distante.
        string? ipAddress = request.HttpContext.Connection.RemoteIpAddress?.ToString();

        // On retourne l'adresse IP si elle existe.
        if (!string.IsNullOrWhiteSpace(ipAddress)) return ipAddress;

        // On retourne une valeur simple si l'adresse IP est absente.
        return "unknown";
    }

    // On récupère le navigateur ou appareil du client.
    private string GetUserAgent(HttpRequest request)
    {
        // On récupère le User-Agent depuis les headers.
        string userAgent = request.Headers.UserAgent.ToString();

        // On limite la taille pour éviter une valeur trop longue.
        if (userAgent.Length > 300) return userAgent[..300];

        // On retourne le User-Agent.
        return userAgent;
    }

    // On compte les tentatives échouées récentes.
    private async Task<int> CountRecentFailedAttemptsAsync(string email, string ipAddress)
    {
        // On définit le début de la période de surveillance.
        DateTime since = DateTime.UtcNow.AddMinutes(-LockMinutes);

        // On compte les échecs pour cet email et cette adresse IP.
        int failedAttempts = await _context.LoginAttempts.CountAsync(attempt =>
            attempt.Email == email &&
            attempt.IpAddress == ipAddress &&
            attempt.EstReussie == false &&
            attempt.DateTentative >= since
        );

        // On retourne le nombre d'échecs trouvés.
        return failedAttempts;
    }

    // On calcule le nombre de tentatives restantes.
    private int CalculateRemainingAttempts(int failedAttempts)
    {
        // On calcule le nombre restant.
        int remainingAttempts = MaxFailedAttempts - failedAttempts;

        // On évite de retourner un nombre négatif.
        if (remainingAttempts < 0) return 0;

        // On retourne le nombre de tentatives restantes.
        return remainingAttempts;
    }
}