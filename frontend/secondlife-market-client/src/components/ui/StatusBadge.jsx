// On crée un composant pour afficher le statut d'une annonce.
export default function StatusBadge({ status }) {
  // On prépare une classe CSS selon le statut reçu.
  const statusClass = getStatusClass(status);

  // On retourne le badge du statut.
  return (
    // On affiche le statut avec une classe adaptée.
    <span className={`status-badge ${statusClass}`}>
      {/* On affiche le texte du statut. */}
      {status || "Non défini"}
    </span>
  );
}

// On crée une fonction qui retourne la classe CSS selon le statut.
function getStatusClass(status) {
  // On vérifie si le statut est Disponible.
  if (status === "Disponible") return "status-available";

  // On vérifie si le statut est En création.
  if (status === "En création") return "status-draft";

  // On vérifie si le statut est En analyse.
  if (status === "En analyse") return "status-analysis";

  // On vérifie si le statut est En réexamen admin.
  if (status === "En réexamen admin") return "status-review";

  // On vérifie si le statut est Rejetée.
  if (status === "Rejetée") return "status-rejected";

  // On vérifie si le statut est Vendue.
  if (status === "Vendue") return "status-sold";

  // On retourne une classe par défaut.
  return "status-default";
}