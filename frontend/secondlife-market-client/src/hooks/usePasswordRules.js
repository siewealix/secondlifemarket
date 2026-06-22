// On crée un hook pour vérifier les règles du mot de passe.
function usePasswordRules(password) {
  // On vérifie si le mot de passe contient au moins 12 caractères.
  const hasMinLength = password.length >= 12;

  // On vérifie si le mot de passe contient une lettre majuscule.
  const hasUppercase = /[A-Z]/.test(password);

  // On vérifie si le mot de passe contient une lettre minuscule.
  const hasLowercase = /[a-z]/.test(password);

  // On vérifie si le mot de passe contient un chiffre.
  const hasNumber = /[0-9]/.test(password);

  // On vérifie si le mot de passe contient un caractère spécial.
  const hasSpecialChar = /[^A-Za-z0-9]/.test(password);

  // On crée la liste lisible des règles.
  const rules = [
    // Règle de longueur.
    { label: "Au moins 12 caractères", valid: hasMinLength },

    // Règle de majuscule.
    { label: "Au moins une lettre majuscule", valid: hasUppercase },

    // Règle de minuscule.
    { label: "Au moins une lettre minuscule", valid: hasLowercase },

    // Règle de chiffre.
    { label: "Au moins un chiffre", valid: hasNumber },

    // Règle de caractère spécial.
    { label: "Au moins un caractère spécial", valid: hasSpecialChar },
  ];

  // On vérifie si toutes les règles sont respectées.
  const isPasswordValid = rules.every((rule) => rule.valid);

  // On retourne les règles et le résultat final.
  return {
    // On retourne la liste des règles.
    rules,

    // On retourne true si le mot de passe est valide.
    isPasswordValid,
  };
}

// On exporte le hook.
export default usePasswordRules;