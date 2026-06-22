// On importe Entity Framework.
using Microsoft.EntityFrameworkCore;

// On importe les helpers.
using SecondLifeMarket.Api.Helpers;

// On importe les modèles.
using SecondLifeMarket.Api.Models;

// On place ce fichier dans le namespace Data.
namespace SecondLifeMarket.Api.Data;

// On crée une classe pour insérer des données de départ.
public static class DbInitializer
{
    // On crée une méthode pour initialiser la base.
    public static async Task SeedAsync(ApplicationDbContext context)
    {
        // On vérifie si aucun utilisateur n'existe.
        if (!await context.Utilisateurs.AnyAsync())
        {
            // On crée un membre de test.
            Utilisateur membre = new()
            {
                // On définit le nom.
                Nom = "Siewe",

                // On définit le prénom.
                Prenom = "Alix",

                // On définit l'email.
                Email = "alix@test.com",

                // On définit le téléphone.
                Telephone = "690000000",

                // On définit la ville.
                Ville = "Douala",

                // On définit le rôle.
                Role = "Membre",

                // On hash le mot de passe.
                MotDePasseHash = PasswordHelper.HashPassword("Alix@12345678")
            };

            // On crée un administrateur de test.
            Utilisateur admin = new()
            {
                // On définit le nom.
                Nom = "Admin",

                // On définit le prénom.
                Prenom = "SecondLife",

                // On définit l'email.
                Email = "admin@test.com",

                // On définit le téléphone.
                Telephone = "690000001",

                // On définit la ville.
                Ville = "Yaoundé",

                // On définit le rôle.
                Role = "Administrateur",

                // On hash le mot de passe.
                MotDePasseHash = PasswordHelper.HashPassword("Admin@12345678")
            };

            // On ajoute le membre.
            context.Utilisateurs.Add(membre);

            // On ajoute l'administrateur.
            context.Utilisateurs.Add(admin);

            // On sauvegarde les utilisateurs.
            await context.SaveChangesAsync();
        }

        // On vérifie si aucune catégorie n'existe.
        if (!await context.Categories.AnyAsync())
        {
            // On crée les catégories de départ.
            List<Categorie> categories = new()
            {
                // Catégorie électronique.
                new Categorie { Nom = "Électronique", Description = "Téléphones, ordinateurs et accessoires.", Icone = "??" },

                // Catégorie maison.
                new Categorie { Nom = "Maison", Description = "Objets utiles pour la maison.", Icone = "??" },

                // Catégorie mode.
                new Categorie { Nom = "Mode", Description = "Vêtements, chaussures et accessoires.", Icone = "??" },

                // Catégorie transport.
                new Categorie { Nom = "Transport", Description = "Vélos, pièces et accessoires de transport.", Icone = "??" },

                // Catégorie livres.
                new Categorie { Nom = "Livres", Description = "Livres scolaires, romans et documents.", Icone = "??" },

                // Catégorie loisirs.
                new Categorie { Nom = "Loisirs", Description = "Jeux, sport et divertissement.", Icone = "??" }
            };

            // On ajoute les catégories.
            context.Categories.AddRange(categories);

            // On sauvegarde les catégories.
            await context.SaveChangesAsync();
        }
    }
}