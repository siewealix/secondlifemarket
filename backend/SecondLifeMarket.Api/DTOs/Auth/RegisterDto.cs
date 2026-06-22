// On place ce fichier dans le dossier DTOs/Auth du projet.
namespace SecondLifeMarket.Api.DTOs.Auth;

// On crée le DTO utilisé pour recevoir les données d'inscription.
public class RegisterDto
{
    // On reçoit le nom du membre.
    public string Nom { get; set; } = string.Empty;

    // On reçoit le prénom du membre.
    public string Prenom { get; set; } = string.Empty;

    // On reçoit l'adresse email du membre.
    public string Email { get; set; } = string.Empty;

    // On reçoit le numéro de téléphone du membre.
    public string Telephone { get; set; } = string.Empty;

    // On reçoit la ville du membre.
    public string Ville { get; set; } = string.Empty;

    // On reçoit le mot de passe du membre.
    public string Password { get; set; } = string.Empty;

    // On reçoit la confirmation du mot de passe.
    public string ConfirmPassword { get; set; } = string.Empty;
}