// On importe les annotations pour limiter la taille des champs.
using System.ComponentModel.DataAnnotations;

// On importe Entity Framework pour créer un index unique.
using Microsoft.EntityFrameworkCore;

// On place la classe dans le namespace Models.
namespace SecondLifeMarket.Api.Models;

// On rend le nom de la catégorie unique.
[Index(nameof(Nom), IsUnique = true)]

// On crée la classe Categorie.
public class Categorie
{
    // On crée l'identifiant unique de la catégorie.
    public int Id { get; set; }

    // On limite le nom de la catégorie à 100 caractères.
    [MaxLength(100)]
    public string Nom { get; set; } = string.Empty;

    // On limite la description à 300 caractères.
    [MaxLength(300)]
    public string Description { get; set; } = string.Empty;

    // On stocke une petite icône ou emoji.
    [MaxLength(30)]
    public string Icone { get; set; } = string.Empty;

    // On indique si la catégorie est active.
    public bool EstActive { get; set; } = true;

    // On stocke la date de création.
    public DateTime DateCreation { get; set; } = DateTime.UtcNow;
}