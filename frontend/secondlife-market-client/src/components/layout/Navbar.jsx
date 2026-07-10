// On importe Link pour naviguer.
import { Link } from "react-router-dom";

// On importe useNavigate pour rediriger après déconnexion.
import { useNavigate } from "react-router-dom";

// On importe l'icône du logo.
import { ShoppingBag } from "lucide-react";

// On importe notre hook d'authentification.
import useAuth from "../../hooks/useAuth.js";

// On crée la navbar.
function Navbar() {
  // On récupère l'utilisateur et les fonctions auth.
  const { user, isAuthenticated, logout } = useAuth();

  // On prépare la navigation.
  const navigate = useNavigate();

  // On crée la fonction de déconnexion.
  async function handleLogout() {
    // On appelle la vraie déconnexion backend.
    await logout();

    // On redirige vers la page de connexion.
    navigate("/connexion");
  }

  // On retourne la navbar.
  return (
    // On crée l'en-tête.
    <header className="navbar">
      {/* On affiche le logo. */}
      <Link to="/" className="navbar-logo">
        {/* On affiche l'icône. */}
        <ShoppingBag size={28} aria-hidden="true" />

        {/* On affiche le nom du site. */}
        <span>SecondLife Market</span>
      </Link>

      {/* On affiche les liens principaux. */}
      <nav className="navbar-links" aria-label="Navigation principale">
        {/* Lien accueil. */}
        <Link to="/">Accueil</Link>

        {/* Lien annonces. */}
        <Link to="/annonces">Annonces</Link>

      </nav>

      {/* On affiche les actions utilisateur. */}
      <div className="navbar-actions">
        {/* On affiche les boutons si personne n'est connecté. */}
        {!isAuthenticated && (
          <>
            {/* Lien connexion. */}
            <Link to="/connexion" className="btn btn-light">Connexion</Link>

            {/* Lien inscription. */}
            <Link to="/inscription" className="btn btn-primary">Inscription</Link>
          </>
        )}

        {/* On affiche l'espace connecté si l'utilisateur est connecté. */}
        {isAuthenticated && (
          <>
            {/* Lien vers le bon tableau de bord. */}
            <Link to={user.role === "Administrateur" ? "/admin" : "/membre"} className="btn btn-light">
              Mon espace
            </Link>

            {/* Bouton de déconnexion réelle. */}
            <button type="button" className="btn btn-primary" onClick={handleLogout}>
              Déconnexion
            </button>
          </>
        )}
      </div>
    </header>
  );
}

// On exporte la navbar.
export default Navbar;