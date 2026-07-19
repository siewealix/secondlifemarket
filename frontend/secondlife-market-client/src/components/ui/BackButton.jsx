// On importe Link pour naviguer sans recharger la page.
import { Link } from "react-router-dom";

// On crée le bouton de retour.
function BackButton() {
  // On retourne un lien ayant l’apparence d’un bouton.
  return (
    <Link
      to="/"
      className="back-button"
      aria-label="Retourner à la page d’accueil"
    >
      {/* Cette flèche est uniquement décorative. */}
      <span aria-hidden="true">←</span>

      {/* On affiche le texte du bouton. */}
      Retourner à la page d’accueil
    </Link>
  );
}

// On exporte le composant.
export default BackButton;