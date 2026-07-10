// On crée un composant pour afficher un état vide.
export default function EmptyState({ title, description }) {
  // On retourne l'affichage de l'état vide.
  return (
    // On crée le bloc principal de l'état vide.
    <div className="empty-state">
      {/* On affiche une icône simple. */}
      <div className="empty-state-icon">📭</div>

      {/* On affiche le titre si un titre est fourni. */}
      {title && <h3>{title}</h3>}

      {/* On affiche la description si une description est fournie. */}
      {description && <p>{description}</p>}
    </div>
  );
}