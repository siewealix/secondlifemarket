namespace SecondLifeMarket.Api.DTOs.Utilisateurs;

public class UtilisateurAdminDto
{
    // Identifiant unique de l'utilisateur.
    public int Id { get; set; }

    // Nom de l'utilisateur.
    public string Nom { get; set; } = string.Empty;

    // Prénom de l'utilisateur.
    public string Prenom { get; set; } = string.Empty;

    // Email de l'utilisateur.
    public string Email { get; set; } = string.Empty;

    // Téléphone de l'utilisateur.
    public string Telephone { get; set; } = string.Empty;

    // Ville de l'utilisateur.
    public string Ville { get; set; } = string.Empty;

    // Rôle de l'utilisateur.
    public string Role { get; set; } = string.Empty;

    // Indique si le compte est actif.
    public bool EstActif { get; set; }

    // Date de création du compte.
    public DateTime DateCreation { get; set; }
}