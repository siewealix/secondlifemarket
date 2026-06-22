// On importe useState pour gérer les erreurs serveur.
import { useState } from "react";

// On importe Link pour aller vers la page de connexion.
import { Link } from "react-router-dom";

// On importe useNavigate pour rediriger après inscription.
import { useNavigate } from "react-router-dom";

// On importe le hook de formulaire.
import useForm from "../../hooks/useForm.js";

// On importe le hook d'authentification.
import useAuth from "../../hooks/useAuth.js";

// On importe le hook des règles du mot de passe.
import usePasswordRules from "../../hooks/usePasswordRules.js";

// On importe le champ texte accessible.
import AuthTextField from "../ui/AuthTextField.jsx";

// On importe le champ mot de passe accessible.
import AuthPasswordField from "../ui/AuthPasswordField.jsx";

// On importe le composant des règles du mot de passe.
import PasswordRules from "../ui/PasswordRules.jsx";

// On définit les valeurs initiales du formulaire.
const initialValues = {
  // On initialise le nom.
  lastName: "",

  // On initialise le prénom.
  firstName: "",

  // On initialise l'email.
  email: "",

  // On initialise le téléphone.
  phone: "",

  // On initialise la ville.
  city: "",

  // On initialise le mot de passe.
  password: "",

  // On initialise la confirmation du mot de passe.
  confirmPassword: "",
};

// On vérifie si l'email est valide.
function isValidEmail(email) {
  // On retourne true si l'email respecte un format simple.
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// On vérifie si le mot de passe est fort.
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

// On valide le formulaire d'inscription.
function validateRegister(values) {
  // On prépare l'objet des erreurs.
  const errors = {};

  // On vérifie le nom.
  if (!values.lastName.trim()) errors.lastName = "Veuillez saisir votre nom.";

  // On vérifie le prénom.
  if (!values.firstName.trim()) errors.firstName = "Veuillez saisir votre prénom.";

  // On vérifie l'email vide.
  if (!values.email.trim()) errors.email = "Veuillez saisir votre adresse email.";

  // On vérifie le format de l'email.
  if (values.email.trim() && !isValidEmail(values.email)) errors.email = "Veuillez saisir une adresse email valide.";

  // On vérifie le téléphone.
  if (!values.phone.trim()) errors.phone = "Veuillez saisir votre numéro de téléphone.";

  // On vérifie la ville.
  if (!values.city.trim()) errors.city = "Veuillez saisir votre ville.";

  // On vérifie le mot de passe vide.
  if (!values.password.trim()) errors.password = "Veuillez saisir un mot de passe.";

  // On vérifie le mot de passe faible.
  if (values.password.trim() && !isStrongPassword(values.password)) errors.password = "Le mot de passe ne respecte pas encore toutes les conditions.";

  // On vérifie la confirmation vide.
  if (!values.confirmPassword.trim()) errors.confirmPassword = "Veuillez confirmer votre mot de passe.";

  // On vérifie si les deux mots de passe sont différents.
  if (values.password && values.confirmPassword && values.password !== values.confirmPassword) {
    // On ajoute l'erreur sur la confirmation.
    errors.confirmPassword = "Les deux mots de passe ne correspondent pas.";
  }

  // On retourne les erreurs trouvées.
  return errors;
}

// On crée le formulaire d'inscription.
function RegisterForm() {
  // On prépare la navigation.
  const navigate = useNavigate();

  // On récupère la fonction register du contexte.
  const { register } = useAuth();

  // On stocke l'erreur venant du backend.
  const [serverError, setServerError] = useState("");

  // On utilise notre hook de formulaire.
  const { values, isSubmitting, canSubmit, handleChange, handleBlur, getError, handleSubmit } = useForm(initialValues, validateRegister);

  // On récupère les règles du mot de passe.
  const { rules } = usePasswordRules(values.password);

  // On gère la saisie dans les champs.
  function handleInputChange(event) {
    // On efface l'erreur serveur quand l'utilisateur modifie un champ.
    setServerError("");

    // On laisse le hook gérer la valeur.
    handleChange(event);
  }

  // On crée la vraie inscription.
  async function submitRegister(formValues) {
    // On essaie d'inscrire l'utilisateur.
    try {
      // On appelle le backend avec les noms attendus par ASP.NET Core.
      await register({
        // On envoie le nom.
        nom: formValues.lastName,

        // On envoie le prénom.
        prenom: formValues.firstName,

        // On envoie l'email.
        email: formValues.email,

        // On envoie le téléphone.
        telephone: formValues.phone,

        // On envoie la ville.
        ville: formValues.city,

        // On envoie le mot de passe.
        password: formValues.password,

        // On envoie la confirmation du mot de passe.
        confirmPassword: formValues.confirmPassword,
      });

      // On redirige vers l'espace membre après inscription.
      navigate("/membre");
    } catch (error) {
      // On vérifie si le backend est inaccessible.
      if (error.message === "Failed to fetch") {
        // On affiche une erreur claire.
        setServerError("Impossible de contacter le serveur. Vérifiez que l'API est lancée et que le fichier .env est correct.");

        // On arrête la fonction.
        return;
      }

      // On affiche l'erreur renvoyée par le backend.
      setServerError(error.message);
    }
  }

  // On retourne le formulaire.
  return (
    // On crée un formulaire accessible.
    <form className="auth-form" onSubmit={handleSubmit(submitRegister)} noValidate>
      {/* On indique les champs obligatoires. */}
      <p className="required-note">Les champs marqués par * sont obligatoires.</p>

      {/* On affiche l'erreur serveur si elle existe. */}
      {serverError && (
        // On annonce l'erreur aux lecteurs d'écran.
        <p className="auth-server-error" role="alert">
          {/* On affiche le message d'erreur. */}
          {serverError}
        </p>
      )}

      {/* On crée la grille du formulaire. */}
      <div className="auth-grid">
        {/* Champ nom. */}
        <AuthTextField
          id="register-last-name"
          name="lastName"
          label="Nom"
          value={values.lastName}
          onChange={handleInputChange}
          onBlur={handleBlur}
          error={getError("lastName")}
          placeholder="Votre nom"
          autoComplete="family-name"
          required
        />

        {/* Champ prénom. */}
        <AuthTextField
          id="register-first-name"
          name="firstName"
          label="Prénom"
          value={values.firstName}
          onChange={handleInputChange}
          onBlur={handleBlur}
          error={getError("firstName")}
          placeholder="Votre prénom"
          autoComplete="given-name"
          required
        />

        {/* Champ email. */}
        <AuthTextField
          id="register-email"
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

        {/* Champ téléphone. */}
        <AuthTextField
          id="register-phone"
          name="phone"
          label="Téléphone"
          type="tel"
          value={values.phone}
          onChange={handleInputChange}
          onBlur={handleBlur}
          error={getError("phone")}
          placeholder="Ex : 690000000"
          autoComplete="tel"
          required
        />

        {/* Champ ville. */}
        <AuthTextField
          id="register-city"
          name="city"
          label="Ville"
          value={values.city}
          onChange={handleInputChange}
          onBlur={handleBlur}
          error={getError("city")}
          placeholder="Ex : Douala"
          autoComplete="address-level2"
          required
        />

        {/* Champ mot de passe. */}
        <AuthPasswordField
          id="register-password"
          name="password"
          label="Mot de passe"
          value={values.password}
          onChange={handleInputChange}
          onBlur={handleBlur}
          error={getError("password")}
          placeholder="Minimum 12 caractères"
          autoComplete="new-password"
          required
        />

        {/* Zone des règles du mot de passe. */}
        <div className="auth-grid-full">
          {/* On affiche les règles en temps réel. */}
          <PasswordRules rules={rules} />
        </div>

        {/* Champ confirmation du mot de passe. */}
        <AuthPasswordField
          id="register-confirm-password"
          name="confirmPassword"
          label="Confirmation du mot de passe"
          value={values.confirmPassword}
          onChange={handleInputChange}
          onBlur={handleBlur}
          error={getError("confirmPassword")}
          placeholder="Confirmez le mot de passe"
          autoComplete="new-password"
          required
        />
      </div>

      {/* Bouton d'inscription. */}
      <button className="auth-submit" type="submit" disabled={!canSubmit}>
        {/* On change le texte pendant l'envoi. */}
        {isSubmitting ? "Création du compte..." : "Créer mon compte"}
      </button>

      {/* Message d'aide si le formulaire n'est pas valide. */}
      {!canSubmit && <p className="auth-help">Complétez correctement tous les champs pour activer le bouton.</p>}

      {/* Lien vers la connexion. */}
      <p className="auth-switch">
        Vous avez déjà un compte ? <Link to="/connexion">Se connecter</Link>
      </p>
    </form>
  );
}

// On exporte le formulaire.
export default RegisterForm;