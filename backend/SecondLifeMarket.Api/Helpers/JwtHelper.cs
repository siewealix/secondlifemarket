// On importe les classes pour les tokens JWT.
using System.IdentityModel.Tokens.Jwt;

// On importe les claims.
using System.Security.Claims;

// On importe les clés de sécurité.
using Microsoft.IdentityModel.Tokens;

// On importe l'encodage.
using System.Text;

// On importe les modèles.
using SecondLifeMarket.Api.Models;
using System.Security.Cryptography;

// On place ce fichier dans le namespace du projet.
namespace SecondLifeMarket.Api.Helpers;

// On crée une classe d'aide pour générer les tokens JWT.
public class JwtHelper
{
    // On stocke la configuration.
    private readonly IConfiguration _configuration;

    // On crée le constructeur.
    public JwtHelper(IConfiguration configuration)
    {
        // On garde la configuration.
        _configuration = configuration;
    }

    // On génère un access token pour un utilisateur.
    public string GenerateAccessToken(Utilisateur utilisateur)
    {
        // On récupère la clé secrète.
        string key = _configuration["Jwt:Key"]!;

        // On transforme la clé en bytes.
        byte[] keyBytes = Encoding.UTF8.GetBytes(key);

        // On crée la clé de signature.
        SymmetricSecurityKey securityKey = new(keyBytes);

        // On crée les identifiants de signature.
        SigningCredentials credentials = new(securityKey, SecurityAlgorithms.HmacSha256);

        // On prépare les informations à mettre dans le token.
        List<Claim> claims = new()
        {
            // On ajoute l'identifiant de l'utilisateur.
            new Claim(ClaimTypes.NameIdentifier, utilisateur.Id.ToString()),

            // On ajoute l'email de l'utilisateur.
            new Claim(ClaimTypes.Email, utilisateur.Email),

            // On ajoute le nom complet de l'utilisateur.
            new Claim(ClaimTypes.Name, $"{utilisateur.Prenom} {utilisateur.Nom}"),

            // On ajoute le rôle de l'utilisateur.
            new Claim(ClaimTypes.Role, utilisateur.Role)
        };

        // On récupère la durée de vie du token.
        int minutes = int.Parse(_configuration["Jwt:AccessTokenMinutes"]!);

        // On crée le token.
        JwtSecurityToken token = new(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(minutes),
            signingCredentials: credentials
        );

        // On transforme le token en texte.
        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    // On génère un refresh token aléatoire.
    public string GenerateRefreshToken()
    {
        // On crée des bytes aléatoires.
        byte[] randomBytes = RandomNumberGenerator.GetBytes(64);

        // On transforme les bytes en texte sécurisé.
        return Convert.ToBase64String(randomBytes);
    }
}