// On importe Link pour naviguer entre les pages sans recharger le site.
import { Link } from "react-router-dom";

// On crée le composant Sidebar de l'administrateur.
export default function AdminSidebar() {
  // On retourne le menu latéral de l'administrateur.
  return (
    // On crée la zone principale du menu admin.
    <aside className="admin-sidebar">
      {/* On affiche le titre du menu. */}
      <h2>Administration</h2>

      {/* On crée la liste des liens admin. */}
      <nav className="admin-sidebar-links">
        {/* On ajoute le lien vers le tableau de bord admin. */}
        <Link to="/admin" className="admin-sidebar-link">
          Tableau de bord
        </Link>

        {/* On ajoute le lien vers la gestion des catégories. */}
        <Link to="/admin/categories" className="admin-sidebar-link">
          Catégories
        </Link>

        {/* On ajoute le lien vers la gestion des membres. */}
        <Link to="/admin/utilisateurs" className="admin-sidebar-link">
        Membres
        </Link>

        {/* On ajoute le lien vers les réexamens IA. */}
        <Link to="/admin/reexamens" className="admin-sidebar-link">
          Réexamens IA
        </Link>

        {/* Lien vers la gestion des signalements. */}
        <Link to="/admin/signalements" className="admin-sidebar-link">
        Signalements
        </Link>
        
      </nav>
    </aside>
  );
}