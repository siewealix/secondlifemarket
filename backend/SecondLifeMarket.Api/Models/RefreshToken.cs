// On importe les annotations pour limiter la taille des champs.
using System.ComponentModel.DataAnnotations;

// On importe Entity Framework pour créer un index unique.
using Microsoft.EntityFrameworkCore;

// On place la classe dans le namespace Models.
namespace SecondLifeMarket.Api.Models;

// On indique que le hash du token doit être unique.
[Index(nameof(TokenHash), IsUnique = true)]

// On crée la classe RefreshToken.
public class RefreshToken
{
    // On crée l'identifiant unique du refresh token.
    public int Id { get; set; }

    // On stocke le token hashé avec une taille limitée.
    [MaxLength(120)]
    public string TokenHash { get; set; } = string.Empty;

    // On stocke la date d'expiration du token.
    public DateTime DateExpiration { get; set; }

    // On indique si le token est révoqué.
    public bool EstRevoque { get; set; } = false;

    // On stocke la date de création du token.
    public DateTime DateCreation { get; set; } = DateTime.UtcNow;

    // On stocke l'identifiant de l'utilisateur lié.
    public int UtilisateurId { get; set; }

    // On relie le refresh token à un utilisateur.
    public Utilisateur? Utilisateur { get; set; }
}