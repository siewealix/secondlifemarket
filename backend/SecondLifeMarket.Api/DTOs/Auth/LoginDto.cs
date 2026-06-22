// On place ce fichier dans le namespace du projet.
namespace SecondLifeMarket.Api.DTOs.Auth;

// On crée le DTO reçu pour la connexion.
public class LoginDto
{
    // On reçoit l'adresse email.
    public string Email { get; set; } = string.Empty;

    // On reçoit le mot de passe.
    public string Password { get; set; } = string.Empty;
}