// On place ce fichier dans le namespace du projet.
namespace SecondLifeMarket.Api.DTOs.Auth;

// On crée le DTO renvoyé après connexion.
public class AuthResponseDto
{
    // On renvoie le token d'accès.
    public string AccessToken { get; set; } = string.Empty;

    // On renvoie l'utilisateur connecté.
    public AuthUserDto User { get; set; } = new();
}

// On crée le DTO de l'utilisateur connecté.
public class AuthUserDto
{
    // On renvoie l'identifiant.
    public int Id { get; set; }

    // On renvoie le nom.
    public string Nom { get; set; } = string.Empty;

    // On renvoie le prénom.
    public string Prenom { get; set; } = string.Empty;

    // On renvoie l'email.
    public string Email { get; set; } = string.Empty;

    // On renvoie le rôle.
    public string Role { get; set; } = string.Empty;
}