// On importe Navigate pour rediriger l'utilisateur.
import { Navigate } from "react-router-dom";

// On importe Outlet pour afficher la page protégée.
import { Outlet } from "react-router-dom";

// On importe le hook d'authentification.
import useAuth from "../hooks/useAuth.js";

// On crée une route protégée pour les membres connectés.
function PrivateRoute() {
  // On récupère l'état d'authentification.
  const { isAuthenticated, loading } = useAuth();

  // On affiche un message pendant la vérification.
  if (loading) {
    // On retourne un chargement simple.
    return <p className="page-loading">Vérification de la session...</p>;
  }

  // On redirige vers la connexion si l'utilisateur n'est pas connecté.
  if (!isAuthenticated) {
    // On retourne une redirection.
    return <Navigate to="/connexion" replace />;
  }

  // On affiche la page protégée si l'utilisateur est connecté.
  return <Outlet />;
}

// On exporte la route protégée.
export default PrivateRoute;