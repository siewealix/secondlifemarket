// On importe les outils de sécurité.
using System.Security.Cryptography;

// On importe l'encodage texte.
using System.Text;

// On place ce fichier dans le namespace du projet.
namespace SecondLifeMarket.Api.Helpers;

// On crée une classe d'aide pour les mots de passe.
public static class PasswordHelper
{
    // On définit le nombre d'itérations.
    private const int Iterations = 100000;

    // On définit la taille du sel.
    private const int SaltSize = 16;

    // On définit la taille du hash.
    private const int HashSize = 32;

    // On crée une méthode pour hasher un mot de passe.
    public static string HashPassword(string password)
    {
        // On crée un sel aléatoire.
        byte[] salt = RandomNumberGenerator.GetBytes(SaltSize);

        // On crée le hash du mot de passe.
        byte[] hash = Rfc2898DeriveBytes.Pbkdf2(password, salt, Iterations, HashAlgorithmName.SHA256, HashSize);

        // On retourne le sel et le hash sous forme de texte.
        return $"{Convert.ToBase64String(salt)}:{Convert.ToBase64String(hash)}";
    }

    // On crée une méthode pour vérifier un mot de passe.
    public static bool VerifyPassword(string password, string storedHash)
    {
        // On sépare le sel et le hash.
        string[] parts = storedHash.Split(':');

        // On vérifie si le format est correct.
        if (parts.Length != 2) return false;

        // On récupère le sel.
        byte[] salt = Convert.FromBase64String(parts[0]);

        // On récupère le hash enregistré.
        byte[] savedHash = Convert.FromBase64String(parts[1]);

        // On calcule le hash du mot de passe saisi.
        byte[] currentHash = Rfc2898DeriveBytes.Pbkdf2(password, salt, Iterations, HashAlgorithmName.SHA256, HashSize);

        // On compare les deux hash de manière sécurisée.
        return CryptographicOperations.FixedTimeEquals(savedHash, currentHash);
    }

    // On crée une méthode simple pour hasher un token.
    public static string HashToken(string token)
    {
        // On transforme le token en bytes.
        byte[] tokenBytes = Encoding.UTF8.GetBytes(token);

        // On calcule le hash SHA256.
        byte[] hashBytes = SHA256.HashData(tokenBytes);

        // On retourne le hash en texte.
        return Convert.ToBase64String(hashBytes);
    }
}