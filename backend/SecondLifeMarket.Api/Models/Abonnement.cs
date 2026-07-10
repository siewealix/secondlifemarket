using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SecondLifeMarket.Api.Models;

[Table("Abonnements")]
public class Abonnement
{
    // Identifiant de l'abonnement.
    public int Id { get; set; }

    // Copie du nom du type d'abonnement au moment de la souscription.
    [MaxLength(50)]
    public string TypeAbonnement { get; set; } = string.Empty;

    // Date de début de l'abonnement.
    public DateTime DateDebut { get; set; } = DateTime.UtcNow;

    // Date de fin de l'abonnement.
    public DateTime DateFin { get; set; }

    // Statut de l'abonnement : Actif, Expiré ou Résilié.
    [MaxLength(30)]
    public string StatutAbonnement { get; set; } = "Actif";

    // Copie de la limite de publication au moment de la souscription.
    public int LimitePublication { get; set; }

    // Identifiant du membre qui possède cet abonnement.
    public int UtilisateurId { get; set; }

    // Membre lié à cet abonnement.
    public Utilisateur? Utilisateur { get; set; }

    // Identifiant du type d'abonnement choisi.
    public int TypeAbonnementId { get; set; }

    // Type d'abonnement lié.
    public TypeAbonnement? TypeAbonnementNavigation { get; set; }
}