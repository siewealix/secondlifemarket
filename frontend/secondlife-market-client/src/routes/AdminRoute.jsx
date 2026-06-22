// On importe Navigate pour rediriger l'utilisateur.
import { Navigate } from "react-router-dom";

// On importe Outlet pour afficher la page admin.
import { Outlet } from "react-router-dom";

// On importe le hook d'authentification.
import useAuth from "../hooks/useAuth.js";

// On crée une route protégée pour l'administrateur.
function AdminRoute() {
  // On récupère les informations d'authentification.
  const { user, isAuthenticated, loading } = useAuth();

  // On affiche un message pendant la vérification.
  if (loading) {
    // On retourne un chargement simple.
    return <p className="page-loading">Vérification de la session...</p>;
  }

  // On redirige si l'utilisateur n'est pas connecté.
  if (!isAuthenticated) {
    // On retourne vers connexion.
    return <Navigate to="/connexion" replace />;
  }

  // On redirige si l'utilisateur n'est pas administrateur.
  if (user.role !== "Administrateur") {
    // On retourne vers l'espace membre.
    return <Navigate to="/membre" replace />;
  }

  // On affiche la page admin.
  return <Outlet />;
}

// On exporte la route admin.
export default AdminRoute;