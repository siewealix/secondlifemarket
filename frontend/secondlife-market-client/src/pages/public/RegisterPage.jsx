// On importe la mise en page d'authentification.
import AuthLayout from "../../components/layout/AuthLayout.jsx";

// On importe le formulaire d'inscription.
import RegisterForm from "../../components/forms/RegisterForm.jsx";

// On crée la page d'inscription.
function RegisterPage() {
  // On retourne la page complète.
  return (
    // On affiche la mise en page commune.
    <AuthLayout
      title="Créer un compte"
      subtitle="Inscrivez-vous pour envoyer des demandes d’achat et publier vos annonces."
    >
      {/* On affiche le formulaire d'inscription. */}
      <RegisterForm />
    </AuthLayout>
  );
}

// On exporte la page.
export default RegisterPage;