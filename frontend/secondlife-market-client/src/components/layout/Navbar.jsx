import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import useAuth from "../../hooks/useAuth.js";

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/connexion");
  }

  return (
    <header className="navbar">
      <Link to="/" className="navbar-logo">
        <ShoppingBag size={28} aria-hidden="true" />
        <span>SecondLife Market</span>
      </Link>

      <nav className="navbar-links" aria-label="Navigation principale">
        <Link to="/">Accueil</Link>
        <Link to="/annonces">Annonces</Link>
        {isAuthenticated && <Link to="/messagerie">Messagerie</Link>}
      </nav>

      <div className="navbar-actions">
        {!isAuthenticated && (
          <>
            <Link to="/connexion" className="btn btn-light">Connexion</Link>
            <Link to="/inscription" className="btn btn-primary">Inscription</Link>
          </>
        )}

        {isAuthenticated && (
          <>
            <Link to={user.role === "Administrateur" ? "/admin" : "/membre"} className="btn btn-light">
              Mon espace
            </Link>
            <button type="button" className="btn btn-primary" onClick={handleLogout}>
              Déconnexion
            </button>
          </>
        )}
      </div>
    </header>
  );
}

export default Navbar;
