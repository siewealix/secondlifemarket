// On importe useState pour afficher ou masquer le mot de passe.
import { useState } from "react";

// On crée un champ mot de passe accessible.
function AuthPasswordField({
  // Identifiant unique du champ.
  id,

  // Nom du champ dans le formulaire.
  name,

  // Texte affiché dans le label.
  label,

  // Valeur actuelle du champ.
  value,

  // Fonction appelée quand l'utilisateur écrit.
  onChange,

  // Fonction appelée quand l'utilisateur quitte le champ.
  onBlur,

  // Message d'erreur du champ.
  error,

  // Texte d'aide dans le champ.
  placeholder,

  // Aide de remplissage automatique.
  autoComplete,

  // Indique si le champ est obligatoire.
  required = false,
}) {
  // On stocke si le mot de passe est visible ou caché.
  const [showPassword, setShowPassword] = useState(false);

  // On crée l'identifiant du message d'erreur.
  const errorId = `${id}-error`;

  // On choisit le type du champ selon l'état.
  const inputType = showPassword ? "text" : "password";

  // On retourne le champ complet.
  return (
    // On regroupe le label, le champ et l'erreur.
    <div className="auth-field">
      {/* On relie le label au champ. */}
      <label htmlFor={id}>
        {/* On affiche le nom du champ. */}
        {label}

        {/* On affiche une étoile si le champ est obligatoire. */}
        {required && <span aria-hidden="true"> *</span>}
      </label>

      {/* On crée une zone contenant le champ et le bouton afficher. */}
      <div className="password-wrapper">
        {/* On affiche le champ mot de passe. */}
        <input
          // On donne un identifiant unique.
          id={id}

          // On donne un nom au champ.
          name={name}

          // On utilise password ou text.
          type={inputType}

          // On donne la valeur contrôlée.
          value={value}

          // On met à jour la valeur à chaque saisie.
          onChange={onChange}

          // On marque le champ comme touché quand il est quitté.
          onBlur={onBlur}

          // On affiche un texte d'aide.
          placeholder={placeholder}

          // On aide le navigateur à remplir correctement.
          autoComplete={autoComplete}

          // On indique que le champ est obligatoire.
          required={required}

          // On indique aux lecteurs d'écran que le champ est obligatoire.
          aria-required={required ? "true" : "false"}

          // On indique si le champ est invalide.
          aria-invalid={error ? "true" : "false"}

          // On relie le champ au message d'erreur.
          aria-describedby={error ? errorId : undefined}
        />

        {/* On crée le bouton afficher ou masquer. */}
        <button
          // On évite que ce bouton soumette le formulaire.
          type="button"

          // On donne une classe au bouton.
          className="password-toggle"

          // On change l'état visible ou caché.
          onClick={() => setShowPassword(!showPassword)}

          // On donne un nom clair aux lecteurs d'écran.
          aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
        >
          {/* On affiche le texte selon l'état. */}
          {showPassword ? "Masquer" : "Afficher"}
        </button>
      </div>

      {/* On affiche l'erreur si elle existe. */}
      {error && (
        // role alert permet d'annoncer l'erreur.
        <p id={errorId} className="auth-error" role="alert">
          {/* On affiche le message d'erreur. */}
          {error}
        </p>
      )}
    </div>
  );
}

// On exporte le champ mot de passe.
export default AuthPasswordField;