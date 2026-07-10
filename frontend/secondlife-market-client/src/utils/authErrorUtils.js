// Cette fonction vérifie si une erreur concerne un compte suspendu.
export function isSuspendedAccountMessage(message) {
  // On vérifie si le message existe.
  if (!message) {
    // On retourne faux si le message est vide.
    return false;
  }

  // On met le message en minuscules pour comparer facilement.
  const cleanMessage = message.toLowerCase();

  // On vérifie les mots liés à la suspension.
  return (
    cleanMessage.includes("suspendu") ||
    cleanMessage.includes("suspendue") ||
    cleanMessage.includes("suspension")
  );
}

// Cette fonction nettoie la session locale.
export function clearLocalAuthSession() {
  // On supprime le token stocké localement.
  localStorage.removeItem("accessToken");

  // On supprime aussi l'utilisateur stocké localement si ton projet l'utilise.
  localStorage.removeItem("user");
}