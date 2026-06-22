// On importe les annotations pour limiter la taille des champs.
using System.ComponentModel.DataAnnotations;

// On importe Entity Framework pour créer un index unique.
using Microsoft.EntityFrameworkCore;

// On place la classe dans le namespace Models.
namespace SecondLifeMarket.Api.Models;

// On indique que l'email doit être unique dans la table.
[Index(nameof(Email), IsUnique = true)]

// On crée la classe Utilisateur.
public class Utilisateur
{
    // On crée l'identifiant unique de l'utilisateur.
    public int Id { get; set; }

    // On limite le nom à 100 caractères.
    [MaxLength(100)]
    public string Nom { get; set; } = string.Empty;

    // On limite le prénom à 100 caractères.
    [MaxLength(100)]
    public string Prenom { get; set; } = string.Empty;

    // On limite l'email à 180 caractères pour éviter l'erreur MySQL.
    [MaxLength(180)]
    public string Email { get; set; } = string.Empty;

    // On limite le hash du mot de passe à 500 caractères.
    [MaxLength(500)]
    public string MotDePasseHash { get; set; } = string.Empty;

    // On limite le téléphone à 30 caractères.
    [MaxLength(30)]
    public string Telephone { get; set; } = string.Empty;

    // On limite la ville à 100 caractères.
    [MaxLength(100)]
    public string Ville { get; set; } = string.Empty;

    // On limite le rôle à 30 caractères.
    [MaxLength(30)]
    public string Role { get; set; } = "Membre";

    // On indique si le compte est actif.
    public bool EstActif { get; set; } = true;

    // On stocke la date de création du compte.
    public DateTime DateCreation { get; set; } = DateTime.UtcNow;

    // On relie l'utilisateur à ses refresh tokens.
    public List<RefreshToken> RefreshTokens { get; set; } = new();
}