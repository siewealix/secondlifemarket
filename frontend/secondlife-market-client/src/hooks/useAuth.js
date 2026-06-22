// On importe useContext pour lire un contexte React.
import { useContext } from "react";

// On importe le contexte d'authentification.
import { AuthContext } from "../context/AuthContext.jsx";

// On crée un hook simple pour utiliser l'authentification.
function useAuth() {
  // On récupère le contexte.
  const context = useContext(AuthContext);

  // On vérifie que le hook est utilisé au bon endroit.
  if (!context) {
    // On affiche une erreur claire.
    throw new Error("useAuth doit être utilisé dans AuthProvider.");
  }

  // On retourne les données d'authentification.
  return context;
}

// On exporte le hook.
export default useAuth;