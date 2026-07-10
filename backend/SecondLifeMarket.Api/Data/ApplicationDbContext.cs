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

    // On représente la table des annonces.
    public DbSet<Annonce> Annonces { get; set; }

    // On représente la table des photos.
    public DbSet<Photo> Photos { get; set; }

    // On représente la table des analyses IA.
    public DbSet<AnalyseIa> AnalysesIa { get; set; }

    // On représente la table des demandes d'achat.
    public DbSet<DemandeAchat> DemandesAchat { get; set; }

    // On représente la table des conversations.
    public DbSet<Conversation> Conversations { get; set; }

    // On représente la table des messages.
    public DbSet<Message> Messages { get; set; }

    // Table des signalements d'annonces.
    public DbSet<SignalementAnnonce> SignalementsAnnonces { get; set; }

    // Table des signalements d'utilisateurs.
    public DbSet<SignalementUtilisateur> SignalementsUtilisateurs { get; set; }

    // Table des abonnements.
    public DbSet<Abonnement> Abonnements { get; set; }

    // Cette méthode permet de configurer certaines relations entre les tables.
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // On garde d'abord les configurations automatiques d'Entity Framework Core.
        base.OnModelCreating(modelBuilder);

        // On force une seule conversation par demande d'achat.
        modelBuilder.Entity<Conversation>()
            .HasIndex(conversation => conversation.DemandeAchatId)
            .IsUnique();

        // On configure la relation entre une conversation et une demande d'achat.
        modelBuilder.Entity<Conversation>()
            .HasOne(conversation => conversation.DemandeAchat)
            .WithOne(demande => demande.Conversation)
            .HasForeignKey<Conversation>(conversation => conversation.DemandeAchatId)
            .OnDelete(DeleteBehavior.Restrict);

        // On configure la relation entre un message et une conversation.
        modelBuilder.Entity<Message>()
            .HasOne(message => message.Conversation)
            .WithMany(conversation => conversation.Messages)
            .HasForeignKey(message => message.ConversationId)
            .OnDelete(DeleteBehavior.Cascade);

        // On configure la relation entre un message et son expéditeur.
        modelBuilder.Entity<Message>()
            .HasOne(message => message.Expediteur)
            .WithMany(utilisateur => utilisateur.MessagesEnvoyes)
            .HasForeignKey(message => message.ExpediteurId)
            .OnDelete(DeleteBehavior.Restrict);

        // On configure la relation entre SignalementAnnonce et le membre signaleur.
        modelBuilder.Entity<SignalementAnnonce>()
            .HasOne(signalement => signalement.Signaleur)
            .WithMany()
            .HasForeignKey(signalement => signalement.SignaleurId)
            .OnDelete(DeleteBehavior.Restrict);

        // On configure la relation entre SignalementAnnonce et l'annonce signalée.
        modelBuilder.Entity<SignalementAnnonce>()
            .HasOne(signalement => signalement.Annonce)
            .WithMany(annonce => annonce.SignalementsAnnonces)
            .HasForeignKey(signalement => signalement.AnnonceId)
            .OnDelete(DeleteBehavior.Restrict);

        // On configure la relation entre SignalementAnnonce et l'administrateur.
        modelBuilder.Entity<SignalementAnnonce>()
            .HasOne(signalement => signalement.Administrateur)
            .WithMany()
            .HasForeignKey(signalement => signalement.AdministrateurId)
            .OnDelete(DeleteBehavior.Restrict);

        // On configure la relation entre SignalementUtilisateur et le membre signaleur.
        modelBuilder.Entity<SignalementUtilisateur>()
            .HasOne(signalement => signalement.Signaleur)
            .WithMany()
            .HasForeignKey(signalement => signalement.SignaleurId)
            .OnDelete(DeleteBehavior.Restrict);

        // On configure la relation entre SignalementUtilisateur et l'utilisateur signalé.
        modelBuilder.Entity<SignalementUtilisateur>()
            .HasOne(signalement => signalement.UtilisateurSignale)
            .WithMany()
            .HasForeignKey(signalement => signalement.UtilisateurSignaleId)
            .OnDelete(DeleteBehavior.Restrict);

        // On configure la relation entre SignalementUtilisateur et l'administrateur.
        modelBuilder.Entity<SignalementUtilisateur>()
            .HasOne(signalement => signalement.Administrateur)
            .WithMany()
            .HasForeignKey(signalement => signalement.AdministrateurId)
            .OnDelete(DeleteBehavior.Restrict);

        // On impose qu'un utilisateur ne peut avoir qu'un seul abonnement.
        modelBuilder.Entity<Abonnement>()
            .HasIndex(abonnement => abonnement.UtilisateurId)
            .IsUnique();

        // Relation entre un utilisateur et son abonnement.
        modelBuilder.Entity<Abonnement>()
            .HasOne(abonnement => abonnement.Utilisateur)
            .WithOne(utilisateur => utilisateur.Abonnement)
            .HasForeignKey<Abonnement>(abonnement => abonnement.UtilisateurId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}