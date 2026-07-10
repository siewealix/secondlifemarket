// On importe les annotations pour limiter les champs.
using System.ComponentModel.DataAnnotations;

// On importe Entity Framework pour préciser le format du prix.
using Microsoft.EntityFrameworkCore;

// On place la classe dans le dossier Models.
namespace SecondLifeMarket.Api.Models;

// On crée la classe Annonce.
public class Annonce
{
    // On crée l'identifiant unique de l'annonce.
    public int Id { get; set; }

    // On limite le titre à 150 caractères.
    [MaxLength(150)]
    public string Titre { get; set; } = string.Empty;

    // On limite la description à 1500 caractères.
    [MaxLength(1500)]
    public string Description { get; set; } = string.Empty;

    // On définit le prix avec 18 chiffres au total et 2 chiffres après la virgule.
    [Precision(18, 2)]
    public decimal Prix { get; set; }

    // On limite la ville à 100 caractères.
    [MaxLength(100)]
    public string Ville { get; set; } = string.Empty;

    // On limite l'état de l'objet à 50 caractères.
    [MaxLength(50)]
    public string EtatObjet { get; set; } = string.Empty;

    // On stocke le statut de l'annonce.
    [MaxLength(30)]
    public string Statut { get; set; } = "En création";

    // On indique si l'annonce est active.
    public bool EstActive { get; set; } = true;

    // On stocke la date de publication.
    public DateTime DatePublication { get; set; } = DateTime.UtcNow;

    // On stocke l'identifiant du membre qui publie.
    public int UtilisateurId { get; set; }

    // On relie l'annonce au membre qui publie.
    public Utilisateur? Utilisateur { get; set; }

    // On stocke l'identifiant de la catégorie.
    public int CategorieId { get; set; }

    // On relie l'annonce à sa catégorie.
    public Categorie? Categorie { get; set; }

    // On relie l'annonce à ses photos.
    public List<Photo> Photos { get; set; } = new();

    // On relie l'annonce à ses analyses IA.
    public List<AnalyseIa> AnalysesIa { get; set; } = new();

    // Liste des demandes d'achat reçues pour cette annonce.
    public List<DemandeAchat> DemandesAchat { get; set; } = new();

    // Liste des signalements liés à cette annonce.
    public List<SignalementAnnonce> SignalementsAnnonces { get; set; } = new();


}