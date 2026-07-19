// On importe la barre de navigation.
import Navbar from "../../components/layout/Navbar.jsx";

// On importe le pied de page.
import Footer from "../../components/layout/Footer.jsx";

// On importe useState pour mémoriser les données de la page.
import { useState } from "react";

// On importe la fonction qui envoie le message à notre API.
import { sendContactMessage } from "../../api/contactApi.js";

// On crée la page de contact.
function ContactPage() {
  // On mémorise toutes les informations du formulaire.
  const [formData, setFormData] = useState({
    // On mémorise le nom.
    name: "",

    // On mémorise l’adresse e-mail.
    email: "",

    // On mémorise le sujet.
    subject: "",

    // On mémorise le message.
    message: "",
  });

  // On mémorise si le message est actuellement en cours d’envoi.
  const [isSending, setIsSending] = useState(false);

  // On mémorise le message de succès ou d’erreur à afficher.
  const [statusMessage, setStatusMessage] = useState("");

  // On mémorise si le message affiché correspond à une erreur.
  const [hasError, setHasError] = useState(false);

  // Cette fonction est exécutée lorsqu’un champ est modifié.
  function handleChange(event) {
    // On récupère le nom et la valeur du champ modifié.
    const { name, value } = event.target;

    // On met à jour uniquement le champ concerné.
    setFormData({
      // On conserve les anciennes valeurs.
      ...formData,

      // On remplace la valeur du champ modifié.
      [name]: value,
    });
  }

  // Cette fonction est exécutée lors de l’envoi du formulaire.
  async function handleSubmit(event) {
    // On empêche le navigateur de recharger la page.
    event.preventDefault();

    // On indique que l’envoi commence.
    setIsSending(true);

    // On efface l’ancien message affiché.
    setStatusMessage("");

    // On retire l’ancien état d’erreur.
    setHasError(false);

    try {
      // On envoie les données du formulaire à notre backend.
      const response = await sendContactMessage(formData);

      // On affiche le message de succès retourné par le backend.
      setStatusMessage(response.message);

      // On vide les champs après l’envoi réussi.
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      // On indique qu’une erreur s’est produite.
      setHasError(true);

      // On affiche le message de l’erreur.
      setStatusMessage(
        error.message || "Impossible d’envoyer le message pour le moment."
      );
    } finally {
      // On indique que la tentative d’envoi est terminée.
      setIsSending(false);
    }
  }

  // On retourne le contenu de la page.
  return (
    // On regroupe les éléments sans ajouter de balise inutile.
    <>
      {/* On affiche la barre de navigation. */}
      <Navbar />

      {/* On crée le contenu principal de la page. */}
      <main className="information-page">
        {/* On crée une carte contenant les informations. */}
        <section className="information-card">
          {/* On affiche le titre principal. */}
          <h1>Nous contactez</h1>

          {/* On explique l’utilité de la page. */}
          <p>
            Vous avez une question, une suggestion ou un problème concernant
            SecondLife Market ? Envoyez-nous un message.
          </p>

          {/* On crée la zone contenant le formulaire. */}
          <div className="contact-form-container">
            {/* On affiche le titre du formulaire. */}
            <h2>Envoyer un message</h2>

            {/* On relie le formulaire à la fonction d’envoi. */}
            <form className="contact-form" onSubmit={handleSubmit}>
              {/* On crée le champ du nom complet. */}
              <div className="form-group">
                {/* On associe le texte au champ du nom. */}
                <label htmlFor="contact-name">Nom complet</label>

                {/* On crée le champ du nom. */}
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  placeholder="Votre nom complet"
                  maxLength="100"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* On crée le champ de l’adresse e-mail. */}
              <div className="form-group">
                {/* On associe le texte au champ de l’adresse e-mail. */}
                <label htmlFor="contact-email">Adresse e-mail</label>

                {/* On crée le champ de l’adresse e-mail. */}
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  placeholder="exemple@email.com"
                  maxLength="150"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* On crée le champ du sujet. */}
              <div className="form-group">
                {/* On associe le texte au champ du sujet. */}
                <label htmlFor="contact-subject">Sujet</label>

                {/* On crée le champ du sujet. */}
                <input
                  id="contact-subject"
                  name="subject"
                  type="text"
                  placeholder="Sujet de votre message"
                  maxLength="150"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* On crée le champ du message. */}
              <div className="form-group">
                {/* On associe le texte à la zone du message. */}
                <label htmlFor="contact-message">Message</label>

                {/* On crée une grande zone de texte. */}
                <textarea
                  id="contact-message"
                  name="message"
                  placeholder="Écrivez votre message ici..."
                  rows="7"
                  maxLength="2000"
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* On affiche le résultat de l’envoi lorsqu’il existe. */}
              {statusMessage && (
                <p
                  className={
                    hasError
                      ? "contact-status contact-status-error"
                      : "contact-status contact-status-success"
                  }
                  role={hasError ? "alert" : "status"}
                >
                  {statusMessage}
                </p>
              )}

              {/* Ce bouton envoie le formulaire. */}
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSending}
              >
                {/* On adapte le texte selon l’état de l’envoi. */}
                {isSending ? "Envoi en cours..." : "Envoyer le message"}
              </button>
            </form>
          </div>
        </section>
      </main>

      {/* On affiche le pied de page. */}
      <Footer />
    </>
  );
}

// On exporte la page.
export default ContactPage;