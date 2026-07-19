// On importe useState pour mémoriser le choix de l’utilisateur.
import { useState } from "react";

// On définit le nom utilisé pour enregistrer le choix dans le navigateur.
const COOKIE_CHOICE_KEY = "secondlife_cookie_choice";

// On crée le composant de gestion des cookies.
function CookieBanner() {
  // On récupère l’ancien choix enregistré dans le navigateur.
  const savedChoice = localStorage.getItem(COOKIE_CHOICE_KEY);

  // On mémorise le choix actuel de l’utilisateur.
  const [cookieChoice, setCookieChoice] = useState(savedChoice);

  // Cette fonction est exécutée lorsque l’utilisateur accepte les cookies.
  function acceptCookies() {
    // On enregistre le choix dans le navigateur.
    localStorage.setItem(COOKIE_CHOICE_KEY, "accepted");

    // On met à jour le choix dans React.
    setCookieChoice("accepted");
  }

  // Cette fonction est exécutée lorsque l’utilisateur refuse les cookies.
  function refuseCookies() {
    // On enregistre le refus dans le navigateur.
    localStorage.setItem(COOKIE_CHOICE_KEY, "refused");

    // On met à jour le choix dans React.
    setCookieChoice("refused");
  }

  // On vérifie si l’utilisateur a déjà fait son choix.
  if (cookieChoice !== null) {
    // On n’affiche plus la bannière.
    return null;
  }

  // On affiche la bannière si aucun choix n’a encore été enregistré.
  return (
    // Conteneur principal de la bannière.
    <section className="cookie-banner">

      {/* Zone contenant le texte d’information. */}
      <div className="cookie-banner-content">

        {/* Titre de la bannière. */}
        <h2>Gestion des cookies</h2>

        {/* Explication simple pour l’utilisateur. */}
        <p>
          SecondLife Market utilise des cookies nécessaires au fonctionnement
          de l’application. Vous pouvez accepter ou refuser les cookies
          optionnels.
        </p>

      </div>

      {/* Zone contenant les deux boutons. */}
      <div className="cookie-banner-actions">

        {/* Bouton permettant de refuser les cookies optionnels. */}
        <button
          type="button"
          className="btn btn-outline"
          onClick={refuseCookies}
        >
          Refuser
        </button>

        {/* Bouton permettant d’accepter les cookies optionnels. */}
        <button
          type="button"
          className="btn btn-primary"
          onClick={acceptCookies}
        >
          Accepter
        </button>

      </div>

    </section>
  );
}

// On exporte le composant pour pouvoir l’utiliser dans l’application.
export default CookieBanner;