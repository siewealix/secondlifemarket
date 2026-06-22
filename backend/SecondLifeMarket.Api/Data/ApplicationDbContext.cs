// On importe Entity Framework Core.
using Microsoft.EntityFrameworkCore;

// On importe les modèles du projet.
using SecondLifeMarket.Api.Models;

// On place la classe dans le namespace Data.
namespace SecondLifeMarket.Api.Data;

// On crée le contexte de base de données.
public class ApplicationDbContext : DbContext
{
    // On crée le constructeur du contexte.
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    // On représente la table des utilisateurs.
    public DbSet<Utilisateur> Utilisateurs { get; set; }

    // On représente la table des refresh tokens.
    public DbSet<RefreshToken> RefreshTokens { get; set; }

    // On représente la table des tentatives de connexion.
    public DbSet<LoginAttempt> LoginAttempts { get; set; }

    // On représente la table des catégories.
    public DbSet<Categorie> Categories { get; set; }
}