// On importe Link pour naviguer.
import { Link } from "react-router-dom";

// On importe la navbar du site.
import Navbar from "../../components/layout/Navbar.jsx";

// On importe le hook d'authentification.
import useAuth from "../../hooks/useAuth.js";

// On crée la page tableau de bord administrateur.
function AdminDashboardPage() {
  // On récupère l'utilisateur connecté.
  const { user } = useAuth();

  // On retourne la page complète.
  return (
    // On regroupe la navbar et le contenu.
    <>
      {/* On affiche la navbar. */}
      <Navbar />

      {/* On crée le contenu principal. */}
      <main className="simple-dashboard">
        {/* On affiche le titre principal. */}
        <h1>Tableau de bord administrateur</h1>

        {/* On affiche le message de bienvenue. */}
        <p>Bonjour {user.prenom} {user.nom}, vous êtes connecté comme administrateur.</p>

        {/* On affiche le rôle. */}
        <span>Rôle : {user.role}</span>

        {/* On crée les actions admin. */}
        <div className="dashboard-actions">
          {/* Lien vers la gestion des catégories. */}
          <Link to="/admin/categories" className="btn btn-primary">
            Gérer les catégories
          </Link>
        </div>
      </main>
    </>
  );
}

// On exporte la page.
export default AdminDashboardPage;