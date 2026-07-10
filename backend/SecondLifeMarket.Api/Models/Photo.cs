// On importe les annotations pour limiter la taille des champs.
using System.ComponentModel.DataAnnotations;

// On place la classe dans le namespace Models.
namespace SecondLifeMarket.Api.Models;

// On crée la classe Photo.
public class Photo
{
    // On crée l'identifiant unique de la photo.
    public int Id { get; set; }

    // On stocke l'adresse de la photo.
    [MaxLength(500)]
    public string Url { get; set; } = string.Empty;

    // On indique si cette photo est la photo principale de l'annonce.
    public bool EstPrincipale { get; set; } = false;

    // On stocke la date d'ajout de la photo.
    public DateTime DateAjout { get; set; } = DateTime.UtcNow;

    // On stocke l'identifiant de l'annonce.
    public int AnnonceId { get; set; }

    // On relie la photo à son annonce.
    public Annonce? Annonce { get; set; }
}