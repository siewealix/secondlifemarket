// On crée un champ texte accessible.
function AuthTextField({
  // Identifiant unique du champ.
  id,

  // Nom du champ dans le formulaire.
  name,

  // Texte affiché dans le label.
  label,

  // Type du champ.
  type = "text",

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
  // On crée l'identifiant du message d'erreur.
  const errorId = `${id}-error`;

  // On retourne le champ complet.
  return (
    // On regroupe le label, le champ et l'erreur.
    <div className="auth-field">
      {/* On relie le label au champ avec htmlFor. */}
      <label htmlFor={id}>
        {/* On affiche le nom du champ. */}
        {label}

        {/* On affiche une étoile si le champ est obligatoire. */}
        {required && <span aria-hidden="true"> *</span>}
      </label>

      {/* On affiche le champ de saisie. */}
      <input
        // On donne un identifiant unique au champ.
        id={id}

        // On donne un nom au champ.
        name={name}

        // On définit le type du champ.
        type={type}

        // On donne la valeur contrôlée par React.
        value={value}

        // On met à jour la valeur à chaque saisie.
        onChange={onChange}

        // On marque le champ comme touché quand il est quitté.
        onBlur={onBlur}

        // On affiche un texte d'aide.
        placeholder={placeholder}

        // On aide le navigateur à remplir correctement.
        autoComplete={autoComplete}

        // On indique au navigateur que le champ est obligatoire.
        required={required}

        // On indique aux lecteurs d'écran que le champ est obligatoire.
        aria-required={required ? "true" : "false"}

        // On indique si le champ est invalide.
        aria-invalid={error ? "true" : "false"}

        // On relie le champ au message d'erreur si une erreur existe.
        aria-describedby={error ? errorId : undefined}
      />

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

// On exporte le champ texte.
export default AuthTextField;