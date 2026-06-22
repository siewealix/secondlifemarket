// On importe la navbar du site.
import Navbar from "../../components/layout/Navbar.jsx";

// On importe le hook d'authentification.
import useAuth from "../../hooks/useAuth.js";

// On crée la page tableau de bord membre.
function MemberDashboardPage() {
  // On récupère l'utilisateur connecté.
  const { user } = useAuth();

  // On retourne la page complète.
  return (
    // On regroupe la navbar et le contenu de la page.
    <>
      {/* On affiche la navbar avec Mon espace et Déconnexion. */}
      <Navbar />

      {/* On crée le contenu principal de l'espace membre. */}
      <main className="simple-dashboard">
        {/* On affiche le titre principal. */}
        <h1>Bienvenue dans votre espace membre</h1>

        {/* On affiche le nom complet du membre connecté. */}
        <p>Bonjour {user.prenom} {user.nom}, vous êtes connecté.</p>

        {/* On affiche le rôle de l'utilisateur. */}
        <span>Rôle : {user.role}</span>
      </main>
    </>
  );
}

// On exporte la page membre.
export default MemberDashboardPage;