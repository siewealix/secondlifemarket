// On importe Link pour naviguer vers l'accueil.
import { Link } from "react-router-dom";

// On importe l'icône du logo.
import { ShoppingBag } from "lucide-react";

// On crée une mise en page commune pour connexion et inscription.
function AuthLayout({ title, subtitle, children }) {
  // On retourne la structure visuelle de la page.
  return (
    // On crée la page d'authentification.
    <main className="auth-shell">
      {/* On crée la partie gauche décorative. */}
      <section className="auth-visual" aria-label="Présentation de SecondLife Market">
        {/* On affiche le logo du site. */}
        <Link to="/" className="auth-logo">
          {/* On affiche une icône décorative mais visible. */}
          <ShoppingBag size={30} aria-hidden="true" />

          {/* On affiche le nom du site. */}
          <span>SecondLife Market</span>
        </Link>

        {/* On affiche un grand titre marketing. */}
        <h1>Une marketplace simple, locale et moderne.</h1>

        {/* On affiche une phrase rassurante. */}
        <p>
          Achetez et vendez vos objets d’occasion avec une interface claire,
          rapide et accessible.
        </p>

        {/* On affiche des points de confiance. */}
        <div className="auth-benefits">
          {/* Premier point de confiance. */}
          <span>Prix affichés en FCFA</span>

          {/* Deuxième point de confiance. */}
          <span>Échanges entre membres</span>

          {/* Troisième point de confiance. */}
          <span>Plateforme modérée</span>
        </div>
      </section>

      {/* On crée la partie droite contenant le formulaire. */}
      <section className="auth-panel">
        {/* On crée l'en-tête du formulaire. */}
        <div className="auth-header">
          {/* On affiche le titre de la page. */}
          <h2>{title}</h2>

          {/* On affiche le sous-titre de la page. */}
          <p>{subtitle}</p>
        </div>

        {/* On affiche le formulaire reçu en contenu. */}
        {children}
      </section>
    </main>
  );
}

// On exporte la mise en page d'authentification.
export default AuthLayout;