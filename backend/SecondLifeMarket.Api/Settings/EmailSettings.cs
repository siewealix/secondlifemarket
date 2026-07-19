// On indique que cette classe se trouve dans le dossier Settings.
namespace SecondLifeMarket.Api.Settings
{
    // Cette classe représente la configuration nécessaire
    // pour envoyer les e-mails.
    public class EmailSettings
    {
        // Adresse du serveur utilisé pour envoyer les e-mails.
        public string SmtpServer { get; set; } = string.Empty;

        // Port utilisé pour communiquer avec le serveur Gmail.
        public int SmtpPort { get; set; }

        // Nom qui apparaîtra comme expéditeur du message.
        public string SenderName { get; set; } = string.Empty;

        // Adresse Gmail qui enverra le message.
        public string SenderEmail { get; set; } = string.Empty;

        // Adresse Gmail qui recevra le message.
        public string RecipientEmail { get; set; } = string.Empty;

        // Mot de passe d’application Gmail enregistré
        // dans les secrets locaux du backend.
        public string AppPassword { get; set; } = string.Empty;
    }
}