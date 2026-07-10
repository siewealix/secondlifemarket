// On importe useState pour afficher une erreur serveur.
import { useState } from "react";

// On importe useEffect pour afficher un message reçu après redirection.
import { useEffect } from "react";

// On importe Link pour aller vers l'inscription.
import { Link } from "react-router-dom";

// On importe useNavigate pour rediriger après connexion.
import { useNavigate } from "react-router-dom";

// On importe notre hook de formulaire.
import useForm from "../../hooks/useForm.js";

// On importe notre hook d'authentification.
import useAuth from "../../hooks/useAuth.js";

// On importe le hook des règles du mot de passe.
import usePasswordRules from "../../hooks/usePasswordRules.js";

// On importe le champ texte accessible.
import AuthTextField from "../ui/AuthTextField.jsx";

// On importe le champ mot de passe accessible.
import AuthPasswordField from "../ui/AuthPasswordField.jsx";

// On importe l'affichage des règles du mot de passe.
import PasswordRules from "../ui/PasswordRules.jsx";

// On crée les valeurs initiales.
const initialValues = {
  // On initialise l'email.
  email: "",

  // On initialise le mot de passe.
  password: "",
};

// On vérifie le format de l'email.
function isValidEmail(email) {
  // On retourne true si l'email est valide.
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// On vérifie la force du mot de passe.
function isStrongPassword(password) {
  // On vérifie la longueur minimale.
  const hasMinLength = password.length >= 12;

  // On vérifie la présence d'une majuscule.
  const hasUppercase = /[A-Z]/.test(password);

  // On vérifie la présence d'une minuscule.
  const hasLowercase = /[a-z]/.test(password);

  // On vérifie la présence d'un chiffre.
  const hasNumber = /[0-9]/.test(password);

  // On vérifie la présence d'un caractère spécial.
  const hasSpecialChar = /[^A-Za-z0-9]/.test(password);

  // On retourne true si toutes les règles sont respectées.
  return hasMinLength && hasUppercase && hasLowercase && hasNumber && hasSpecialChar;
}

// On valide le formulaire.
function validateLogin(values) {
  // On prépare les erreurs.
  const errors = {};

  // On vérifie si l'email est vide.
  if (!values.email.trim()) errors.email = "Veuillez saisir votre adresse email.";

  // On vérifie si l'email est invalide.
  if (values.email.trim() && !isValidEmail(values.email)) errors.email = "Veuillez saisir une adresse email valide.";

  // On vérifie si le mot de passe est vide.
  if (!values.password.trim()) errors.password = "Veuillez saisir votre mot de passe.";

  // On vérifie si le mot de passe est faible.
  if (values.password.trim() && !isStrongPassword(values.password)) errors.password = "Le mot de passe ne respecte pas encore toutes les conditions.";

  // On retourne les erreurs.
  return errors;
}

// On crée le formulaire de connexion.
function LoginForm({ redirectedMessage = "" }) {
  // On prépare la navigation.
  const navigate = useNavigate();

  // On récupère la fonction login réelle.
  const { login } = useAuth();

  // On stocke l'erreur venant du backend ou d'une redirection.
  const [serverError, setServerError] = useState(redirectedMessage);

  // On utilise le hook de formulaire.
  const { values, isSubmitting, canSubmit, handleChange, handleBlur, getError, handleSubmit } = useForm(initialValues, validateLogin);

  // On vérifie les règles du mot de passe en temps réel.
  const { rules } = usePasswordRules(values.password);

  // On affiche le message de redirection s'il existe.
  useEffect(() => {
    // On vérifie si un message de redirection existe.
    if (redirectedMessage) {
      // On affiche ce message dans le formulaire.
      setServerError(redirectedMessage);
    }
  }, [redirectedMessage]);

  // On crée une fonction appelée quand l'utilisateur écrit.
  function handleInputChange(event) {
    // On efface l'erreur serveur.
    setServerError("");

    // On laisse le hook gérer la saisie.
    handleChange(event);
  }

  // On crée la vraie connexion.
  async function submitLogin(formValues) {
    // On essaie de connecter l'utilisateur.
    try {
      // On appelle le backend grâce au AuthContext.
      const connectedUser = await login({
        // On envoie l'email.
        email: formValues.email,

        // On envoie le mot de passe.
        password: formValues.password,
      });

      // On vérifie si l'utilisateur est administrateur.
      if (connectedUser.role === "Administrateur") {
        // On redirige vers le tableau de bord admin.
        navigate("/admin");

        // On arrête la fonction.
        return;
      }

      // On redirige vers le tableau de bord membre.
      navigate("/membre");
    } catch (error) {
      // On vérifie si le serveur est inaccessible.
      if (error.message === "Failed to fetch") {
        // On affiche un message clair.
        setServerError("Impossible de contacter le serveur. Vérifiez que l’API est lancée et que l’adresse .env est correcte.");

        // On arrête la fonction.
        return;
      }

      // On affiche le message envoyé par le backend.
      setServerError(error.message);
    }
  }

  // On retourne le formulaire.
  return (
    // On crée un formulaire accessible.
    <form className="auth-form" onSubmit={handleSubmit(submitLogin)} noValidate>
      {/* On indique les champs obligatoires. */}
      <p className="required-note">Les champs marqués par * sont obligatoires.</p>

      {/* On affiche l'erreur serveur si elle existe. */}
      {serverError && (
        // On utilise role alert pour l'accessibilité.
        <p className="auth-server-error" role="alert">
          {/* On affiche le message serveur. */}
          {serverError}
        </p>
      )}

      {/* On affiche le champ email. */}
      <AuthTextField
        id="login-email"
        name="email"
        label="Adresse email"
        type="email"
        value={values.email}
        onChange={handleInputChange}
        onBlur={handleBlur}
        error={getError("email")}
        placeholder="exemple@email.com"
        autoComplete="email"
        required
      />

      {/* On affiche le champ mot de passe. */}
      <AuthPasswordField
        id="login-password"
        name="password"
        label="Mot de passe"
        value={values.password}
        onChange={handleInputChange}
        onBlur={handleBlur}
        error={getError("password")}
        placeholder="Votre mot de passe"
        autoComplete="current-password"
        required
      />

      {/* On affiche les règles du mot de passe. */}
      <PasswordRules rules={rules} />

      {/* On affiche le bouton de connexion. */}
      <button className="auth-submit" type="submit" disabled={!canSubmit}>
        {/* On change le texte pendant la connexion. */}
        {isSubmitting ? "Connexion en cours..." : "Se connecter"}
      </button>

      {/* On affiche une aide si le bouton est désactivé. */}
      {!canSubmit && <p className="auth-help">Saisissez une adresse email valide et un mot de passe correct.</p>}

      {/* On affiche les comptes de test. */}
      <p className="auth-help">
        Test membre : <strong>alix@test.com</strong> avec <strong>Alix@12345678</strong>
      </p>

      {/* On affiche le lien vers l'inscription. */}
      <p className="auth-switch">
        Vous n’avez pas encore de compte ? <Link to="/inscription">Créer un compte</Link>
      </p>
    </form>
  );
}

// On exporte le formulaire.
export default LoginForm;