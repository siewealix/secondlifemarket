// On importe la mise en page d'authentification.
import AuthLayout from "../../components/layout/AuthLayout.jsx";

// On importe le formulaire de connexion.
import LoginForm from "../../components/forms/LoginForm.jsx";

// On importe useLocation pour récupérer un message après redirection.
import { useLocation } from "react-router-dom";

// On crée la page de connexion.
function LoginPage() {
  // On récupère les informations de navigation.
  const location = useLocation();

  // On récupère le message envoyé par une redirection.
  const redirectedMessage = location.state?.message || "";

  // On retourne la page complète.
  return (
    // On affiche la mise en page commune.
    <AuthLayout
      title="Connexion"
      subtitle="Accédez à votre espace pour acheter, vendre et gérer vos annonces."
    >
      {/* On affiche le formulaire de connexion. */}
      <LoginForm redirectedMessage={redirectedMessage} />
    </AuthLayout>
  );
}

// On exporte la page.
export default LoginPage;