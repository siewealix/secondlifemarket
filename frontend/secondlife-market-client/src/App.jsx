// On importe BrowserRouter pour gérer les routes.
import { BrowserRouter } from "react-router-dom";

// On importe le fournisseur d'authentification.
import { AuthProvider } from "./context/AuthContext.jsx";

// On importe les routes de l'application.
import AppRoutes from "./routes/AppRoutes.jsx";

// On crée le composant principal.
function App() {
  // On retourne l'application.
  return (
    // On active la navigation React.
    <BrowserRouter>
      {/* On active l'authentification globale. */}
      <AuthProvider>
        {/* On affiche les routes. */}
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

// On exporte App.
export default App;