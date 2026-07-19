// On importe SmtpClient pour envoyer les emails avec le protocole SMTP.
using MailKit.Net.Smtp;

// On importe SecureSocketOptions pour sécuriser la connexion SMTP.
using MailKit.Security;

// On importe IOptions pour lire les paramètres EmailSettings depuis appsettings / user-secrets.
using Microsoft.Extensions.Options;

// On importe MimeKit pour créer le contenu de l'email.
using MimeKit;

// On importe l'interface IEmailService.
using SecondLifeMarket.Api.Services.Interfaces;

// On importe la classe EmailSettings.
using SecondLifeMarket.Api.Settings;

// On indique que ce fichier appartient au namespace Services.
namespace SecondLifeMarket.Api.Services;

// On crée le service EmailService.
// Il respecte le contrat défini dans IEmailService.
public class EmailService : IEmailService
{
    // On garde les paramètres email dans une variable privée.
    private readonly EmailSettings _emailSettings;

    // Le constructeur reçoit les paramètres email automatiquement grâce à l'injection de dépendances.
    public EmailService(IOptions<EmailSettings> emailOptions)
    {
        // On récupère la vraie valeur des paramètres EmailSettings.
        _emailSettings = emailOptions.Value;
    }

    // Cette méthode envoie un email quand un visiteur remplit le formulaire de contact.
    public async Task SendContactEmailAsync(
        string visitorName,
        string visitorEmail,
        string subject,
        string message
    )
    {
        // On nettoie l'adresse Gmail utilisée pour l'envoi.
        string senderEmail = _emailSettings.SenderEmail.Trim();

        // On nettoie le mot de passe d'application Google.
        // Google affiche souvent ce mot de passe avec des espaces.
        // Exemple affiché : abcd efgh ijkl mnop
        // Mais dans le code, on doit l'utiliser sans espaces : abcdefghijklmnop
        string appPassword = _emailSettings.AppPassword
            .Replace(" ", "")
            .Trim();

        // TEMPORAIRE :
        // Ces lignes servent uniquement à vérifier que les bonnes valeurs sont chargées.
        // Attention : on n'affiche jamais le mot de passe lui-même.
        Console.WriteLine($"Adresse Gmail chargée : [{senderEmail}]");
        Console.WriteLine($"Longueur du mot de passe après nettoyage : {appPassword.Length}");
        Console.WriteLine($"Présence d’un espace dans le mot de passe original : {_emailSettings.AppPassword.Contains(' ')}");

        // On crée un nouvel email.
        MimeMessage email = new MimeMessage();

        // On définit l'expéditeur de l'email.
        // Ici, c'est ton adresse Gmail configurée dans EmailSettings.
        email.From.Add(new MailboxAddress(
            _emailSettings.SenderName,
            senderEmail
        ));

        // On définit le destinataire de l'email.
        // Ici, le message sera reçu sur scondlifemarket@gmail.com.
        email.To.Add(new MailboxAddress(
            _emailSettings.SenderName,
            _emailSettings.RecipientEmail.Trim()
        ));

        // On ajoute l'adresse du visiteur en Reply-To.
        // Comme ça, quand tu réponds au mail reçu, tu réponds directement au visiteur.
        email.ReplyTo.Add(new MailboxAddress(
            visitorName.Trim(),
            visitorEmail.Trim()
        ));

        // On définit le sujet de l'email.
        email.Subject = $"Nouveau message de contact : {subject.Trim()}";

        // On définit le contenu texte de l'email.
        email.Body = new TextPart("plain")
        {
            Text =
                $"Nom : {visitorName.Trim()}\n" +
                $"Email : {visitorEmail.Trim()}\n" +
                $"Sujet : {subject.Trim()}\n\n" +
                $"Message :\n{message.Trim()}"
        };

        // On crée le client SMTP qui va se connecter à Gmail.
        using SmtpClient smtpClient = new SmtpClient();

        // On se connecte au serveur SMTP de Gmail.
        await smtpClient.ConnectAsync(
            _emailSettings.SmtpServer,
            _emailSettings.SmtpPort,
            SecureSocketOptions.StartTls
        );

        // On s'authentifie avec l'adresse Gmail et le mot de passe d'application.
        await smtpClient.AuthenticateAsync(
            senderEmail,
            appPassword
        );

        // On envoie l'email.
        await smtpClient.SendAsync(email);

        // On se déconnecte proprement du serveur SMTP.
        await smtpClient.DisconnectAsync(true);
    }
}