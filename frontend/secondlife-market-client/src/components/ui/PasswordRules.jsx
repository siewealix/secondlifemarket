// On crée un composant pour afficher les règles du mot de passe.
function PasswordRules({ rules }) {
  // On retourne la liste des règles.
  return (
    // On crée une zone lisible pour les règles.
    <ul className="password-rules" aria-label="Règles du mot de passe">
      {/* On parcourt toutes les règles. */}
      {rules.map((rule) => (
        // On affiche une règle.
        <li key={rule.label} className={rule.valid ? "valid" : "invalid"}>
          {/* On affiche une icône simple selon l'état. */}
          <span aria-hidden="true">{rule.valid ? "✓" : "•"}</span>

          {/* On affiche le texte de la règle. */}
          <span>{rule.label}</span>
        </li>
      ))}
    </ul>
  );
}

// On exporte le composant.
export default PasswordRules;