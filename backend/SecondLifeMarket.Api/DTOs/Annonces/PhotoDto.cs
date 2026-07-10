// On place ce fichier dans le namespace DTOs Annonces.
namespace SecondLifeMarket.Api.DTOs.Annonces;

// On crée le DTO d'une photo.
public class PhotoDto
{
    // On renvoie l'identifiant de la photo.
    public int Id { get; set; }

    // On renvoie l'adresse de la photo.
    public string Url { get; set; } = string.Empty;

    // On indique si la photo est principale.
    public bool EstPrincipale { get; set; }
}