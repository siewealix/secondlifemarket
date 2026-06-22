// On crée un bouton réutilisable.
function Button({ children, type = "button", variant = "primary" }) {
  // On retourne un bouton avec une classe dynamique.
  return (
    // Le type permet de préciser button, submit ou reset.
    <button type={type} className={`btn btn-${variant}`}>
      {/* On affiche le contenu du bouton. */}
      {children}
    </button>
  );
}

// On exporte le bouton.
export default Button;