// On importe Link pour gérer les liens internes.
import { Link } from "react-router-dom";

// On crée le composant Footer.
function Footer() {
  // On récupère automatiquement l’année actuelle.
  const currentYear = new Date().getFullYear();

  // On retourne le contenu du footer.
  return (
    // On crée le pied de page principal.
    <footer className="footer">

      {/* On affiche le nom de l’application. */}
      <h3>SecondLife Market</h3>

      {/* On affiche une courte description. */}
      <p>
        Achetez et vendez vos objets d’occasion en toute simplicité.
      </p>

      {/* On crée une zone de navigation dans le footer. */}
      <nav
        className="footer-links"
        aria-label="Liens utiles"
      >

        {/* Ce lien ouvrira la page de contact. */}
        <Link to="/contact">
          Nous contactez
        </Link>

        {/* Ce lien ouvrira les conditions générales d’utilisation. */}
        <Link to="/cgu">
          CGU
        </Link>

        {/* Ce lien ouvrira la politique de confidentialité. */}
        <Link to="/confidentialite">
          Confidentialité
        </Link>

        {/* Ce lien ouvrira la déclaration d’accessibilité. */}
        <Link to="/accessibilite">
          Accessibilité
        </Link>

      </nav>

      {/* On affiche l’année et le nom de l’application. */}
      <span>
        © {currentYear} SecondLife Market. Tous droits réservés.
      </span>

    </footer>
  );
}

// On exporte le composant Footer.
export default Footer;