// On place cette classe dans le dossier Helpers.
namespace SecondLifeMarket.Api.Helpers;

// On crée une classe simple pour protéger les textes contre les contenus dangereux.
public static class XssProtectionHelper
{
    // On crée une méthode pour nettoyer un texte simple.
    public static string CleanText(string value)
    {
        // On retourne une chaîne vide si la valeur est nulle.
        if (value == null) return string.Empty;

        // On enlève les espaces inutiles au début et à la fin.
        return value.Trim();
    }

    // On crée une méthode pour vérifier si un texte contient un contenu dangereux.
    public static bool ContainsDangerousContent(string value)
    {
        // On considère qu'un texte vide n'est pas dangereux.
        if (string.IsNullOrWhiteSpace(value)) return false;

        // On transforme le texte en minuscule pour faciliter la recherche.
        string lowerValue = value.ToLowerInvariant();

        // On bloque les balises HTML avec le caractère inférieur.
        if (lowerValue.Contains("<")) return true;

        // On bloque les balises HTML avec le caractère supérieur.
        if (lowerValue.Contains(">")) return true;

        // On bloque les scripts JavaScript.
        if (lowerValue.Contains("script")) return true;

        // On bloque les liens JavaScript.
        if (lowerValue.Contains("javascript:")) return true;

        // On bloque les URLs data dangereuses.
        if (lowerValue.Contains("data:text/html")) return true;

        // On bloque les événements HTML onclick.
        if (lowerValue.Contains("onclick")) return true;

        // On bloque les événements HTML onerror.
        if (lowerValue.Contains("onerror")) return true;

        // On bloque les événements HTML onload.
        if (lowerValue.Contains("onload")) return true;

        // On retourne false si aucun contenu dangereux n'est trouvé.
        return false;
    }

    // On crée une méthode pour valider un champ texte.
    public static void ValidateText(string value, string fieldName)
    {
        // On vérifie si le champ contient un contenu dangereux.
        if (ContainsDangerousContent(value))
        {
            // On bloque la requête avec un message clair.
            throw new InvalidOperationException($"Le champ {fieldName} contient un contenu non autorisé.");
        }
    }
}