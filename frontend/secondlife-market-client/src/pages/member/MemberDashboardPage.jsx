// On importe Link pour naviguer entre les pages sans recharger le site.
import { Link } from "react-router-dom";

// On importe le hook d'authentification.
import useAuth from "../../hooks/useAuth.js";

// On importe la barre de navigation.
import Navbar from "../../components/layout/Navbar.jsx";

// On importe le footer.
import Footer from "../../components/layout/Footer.jsx";

// On crée la page principale du membre connecté.
export default function MemberDashboardPage() {
  // On récupère l'utilisateur connecté.
  const { user } = useAuth();

  // On retourne l'interface du membre.
  return (
    <>
      {/* On affiche la barre de navigation. */}
      <Navbar />

      {/* On affiche le contenu principal. */}
      <main className="page-section member-space">
        {/* On centre le contenu. */}
        <div className="container">
          {/* On affiche l'en-tête de l'espace membre. */}
          <div className="section-heading">
            {/* On affiche un petit titre. */}
            <span className="section-kicker">Espace membre</span>

            {/* On affiche le titre principal. */}
            <h1>Bienvenue dans votre espace membre</h1>

            {/* On affiche le nom de l'utilisateur connecté. */}
            <p>
              Bonjour {user?.prenom} {user?.nom}, choisissez l’espace que vous voulez utiliser.
            </p>
          </div>

          {/* On affiche les deux choix principaux du membre. */}
          <div className="member-choice-grid">
            {/* On affiche la carte vendeur. */}
            <Link className="member-choice-card" to="/membre/vendeur">
              {/* On affiche l'icône vendeur. */}
              <span className="member-choice-icon">🏪</span>

              {/* On affiche le titre de la carte. */}
              <h2>Espace vendeur</h2>

              {/* On affiche la description de la carte. */}
              <p>
                Publier des annonces, gérer vos produits, modifier vos annonces et suivre leur statut.
              </p>

              {/* On affiche le faux bouton. */}
              <strong>Entrer comme vendeur</strong>
            </Link>

            {/* On affiche la carte acheteur. */}
            <Link className="member-choice-card" to="/membre/acheteur">
              {/* On affiche l'icône acheteur. */}
              <span className="member-choice-icon">🛒</span>

              {/* On affiche le titre de la carte. */}
              <h2>Espace acheteur</h2>

              {/* On affiche la description de la carte. */}
              <p>
                Consulter les annonces, suivre vos demandes d’achat et gérer vos échanges avec les vendeurs.
              </p>

              {/* On affiche le faux bouton. */}
              <strong>Entrer comme acheteur</strong>
            </Link>
          </div>
        </div>
      </main>

      {/* On affiche le footer. */}
      <Footer />
    </>
  );
}