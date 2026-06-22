// On importe les annotations pour limiter la taille des champs.
using System.ComponentModel.DataAnnotations;

// On place la classe dans le dossier Models.
namespace SecondLifeMarket.Api.Models;

// On crée la classe qui représente une tentative de connexion.
public class LoginAttempt
{
    // On crée l'identifiant unique de la tentative.
    public int Id { get; set; }

    // On stocke l'email utilisé pendant la tentative.
    [MaxLength(180)]
    public string Email { get; set; } = string.Empty;

    // On stocke l'adresse IP utilisée pendant la tentative.
    [MaxLength(45)]
    public string IpAddress { get; set; } = string.Empty;

    // On stocke le navigateur ou appareil utilisé.
    [MaxLength(300)]
    public string UserAgent { get; set; } = string.Empty;

    // On indique si la tentative a réussi.
    public bool EstReussie { get; set; } = false;

    // On stocke un message simple sur la tentative.
    [MaxLength(250)]
    public string Message { get; set; } = string.Empty;

    // On stocke la date de la tentative.
    public DateTime DateTentative { get; set; } = DateTime.UtcNow;
}