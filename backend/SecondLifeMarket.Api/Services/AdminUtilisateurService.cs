using Microsoft.EntityFrameworkCore;
using SecondLifeMarket.Api.Data;
using SecondLifeMarket.Api.DTOs.Utilisateurs;
using SecondLifeMarket.Api.Models;
using SecondLifeMarket.Api.Services.Interfaces;

namespace SecondLifeMarket.Api.Services;

public class AdminUtilisateurService : IAdminUtilisateurService
{
    // Contexte de base de données.
    private readonly ApplicationDbContext _context;

    // Constructeur du service.
    public AdminUtilisateurService(ApplicationDbContext context)
    {
        // On garde le contexte dans une variable privée.
        _context = context;
    }

    // Méthode qui retourne les utilisateurs pour l'administrateur.
    public async Task<List<UtilisateurAdminDto>> GetUtilisateursAsync()
    {
        // On récupère les utilisateurs sauf les administrateurs.
        List<Utilisateur> utilisateurs = await _context.Utilisateurs
            // On garde uniquement les membres.
            .Where(item => item.Role == "Membre")
            // On affiche les plus récents en premier.
            .OrderByDescending(item => item.DateCreation)
            // On exécute la requête SQL.
            .ToListAsync();

        // On transforme la liste en DTO.
        return utilisateurs.Select(ToDto).ToList();
    }

    // Méthode qui suspend un compte membre.
    public async Task<UtilisateurAdminDto> SuspendreUtilisateurAsync(int utilisateurId, int administrateurId)
    {
        // On cherche l'utilisateur.
        Utilisateur? utilisateur = await _context.Utilisateurs
            .FirstOrDefaultAsync(item => item.Id == utilisateurId);

        // On vérifie si l'utilisateur existe.
        if (utilisateur == null)
        {
            // On bloque si l'utilisateur est introuvable.
            throw new InvalidOperationException("Utilisateur introuvable.");
        }

        // On empêche un administrateur de se suspendre lui-même.
        if (utilisateur.Id == administrateurId)
        {
            // On bloque cette action.
            throw new InvalidOperationException("Vous ne pouvez pas suspendre votre propre compte.");
        }

        // On empêche la suspension d'un administrateur.
        if (utilisateur.Role == "Administrateur")
        {
            // On bloque cette action.
            throw new InvalidOperationException("Vous ne pouvez pas suspendre un administrateur.");
        }

        // On vérifie si le compte est déjà suspendu.
        if (!utilisateur.EstActif)
        {
            // On bloque si le compte est déjà suspendu.
            throw new InvalidOperationException("Ce compte est déjà suspendu.");
        }

        // On suspend le compte.
        utilisateur.EstActif = false;

        // On sauvegarde la modification.
        await _context.SaveChangesAsync();

        // On retourne l'utilisateur modifié.
        return ToDto(utilisateur);
    }

    // Méthode qui réactive un compte membre.
    public async Task<UtilisateurAdminDto> ReactiverUtilisateurAsync(int utilisateurId, int administrateurId)
    {
        // On cherche l'utilisateur.
        Utilisateur? utilisateur = await _context.Utilisateurs
            .FirstOrDefaultAsync(item => item.Id == utilisateurId);

        // On vérifie si l'utilisateur existe.
        if (utilisateur == null)
        {
            // On bloque si l'utilisateur est introuvable.
            throw new InvalidOperationException("Utilisateur introuvable.");
        }

        // On empêche un administrateur de se réactiver lui-même depuis cette route.
        if (utilisateur.Id == administrateurId)
        {
            // On bloque cette action.
            throw new InvalidOperationException("Vous ne pouvez pas modifier votre propre compte ici.");
        }

        // On empêche la modification d'un administrateur.
        if (utilisateur.Role == "Administrateur")
        {
            // On bloque cette action.
            throw new InvalidOperationException("Vous ne pouvez pas modifier un administrateur.");
        }

        // On vérifie si le compte est déjà actif.
        if (utilisateur.EstActif)
        {
            // On bloque si le compte est déjà actif.
            throw new InvalidOperationException("Ce compte est déjà actif.");
        }

        // On réactive le compte.
        utilisateur.EstActif = true;

        // On sauvegarde la modification.
        await _context.SaveChangesAsync();

        // On retourne l'utilisateur modifié.
        return ToDto(utilisateur);
    }

    // Méthode qui transforme un utilisateur en DTO.
    private static UtilisateurAdminDto ToDto(Utilisateur utilisateur)
    {
        // On retourne un objet simple pour le frontend.
        return new UtilisateurAdminDto
        {
            // On retourne l'identifiant.
            Id = utilisateur.Id,

            // On retourne le nom.
            Nom = utilisateur.Nom,

            // On retourne le prénom.
            Prenom = utilisateur.Prenom,

            // On retourne l'email.
            Email = utilisateur.Email,

            // On retourne le téléphone.
            Telephone = utilisateur.Telephone,

            // On retourne la ville.
            Ville = utilisateur.Ville,

            // On retourne le rôle.
            Role = utilisateur.Role,

            // On retourne l'état du compte.
            EstActif = utilisateur.EstActif,

            // On retourne la date de création.
            DateCreation = utilisateur.DateCreation
        };
    }
}