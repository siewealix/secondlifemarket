// On importe Link pour naviguer sans recharger le site.
import { Link } from "react-router-dom";

// On importe les icônes utilisées dans les cartes.
import {
  ArrowRight,
  ShoppingCart,
  Store,
} from "lucide-react";

// On importe le hook d'authentification.
import useAuth from "../../hooks/useAuth.js";

// On importe la barre de navigation.
import Navbar from "../../components/layout/Navbar.jsx";

// On importe le pied de page.
import Footer from "../../components/layout/Footer.jsx";

// On crée la page principale du membre connecté.
export default function MemberDashboardPage() {
  // On récupère l'utilisateur connecté.
  const { user } = useAuth();

  // On retourne l'interface du membre.
  return (
    // On regroupe les éléments sans ajouter de balise inutile.
    <>
      {/* On affiche la barre de navigation. */}
      <Navbar />

      {/* On affiche le contenu principal. */}
      <main className="page-section member-space">
        {/* On centre et limite la largeur du contenu. */}
        <div className="container member-space-container">
          {/* On crée le bandeau de bienvenue. */}
          <header className="member-welcome">
            {/* On place le contenu au-dessus des décorations. */}
            <div className="member-welcome-content">
              {/* On affiche une petite indication. */}
              <span className="member-welcome-label">
                Espace membre
              </span>

              {/* On souhaite la bienvenue au membre. */}
              <h1 className="member-welcome-title">
                Bienvenue,{" "}
                <span className="member-welcome-name">
                  {user?.prenom} {user?.nom}
                </span>
              </h1>

              {/* On explique l’objectif de la page. */}
              <p className="member-welcome-text">
                Retrouvez ici vos accès pour vendre vos objets ou poursuivre
                vos achats sur SecondLife Market.
              </p>
            </div>
          </header>

          {/* On crée la partie contenant les choix du membre. */}
          <section
            className="member-actions"
            aria-labelledby="member-actions-title"
          >
            {/* On crée l'en-tête de la partie. */}
            <div className="member-actions-heading">
              {/* On regroupe le petit texte et le titre. */}
              <div>
                {/* On affiche une petite indication. */}
                <span className="member-actions-label">
                  Vos accès rapides
                </span>

                {/* On affiche le titre de la partie. */}
                <h2 id="member-actions-title">
                  Que souhaitez-vous faire aujourd’hui ?
                </h2>
              </div>

              {/* On ajoute une courte explication. */}
              <p>
                Choisissez un espace. Vous pourrez revenir ici et changer
                d’activité à tout moment.
              </p>
            </div>

            {/* On affiche les deux cartes principales. */}
            <div className="member-choice-grid">
              {/* On crée la carte de l'espace vente. */}
              <Link
                className="member-choice-card member-choice-card-seller"
                to="/membre/vendeur"
              >
                {/* On crée la partie supérieure de la carte. */}
                <div className="member-choice-card-top">
                  {/* On affiche l'icône de vente. */}
                  <span
                    className="member-choice-icon"
                    aria-hidden="true"
                  >
                    <Store size={34} strokeWidth={1.8} />
                  </span>

                  {/* On affiche le type d'espace. */}
                  <span className="member-choice-badge">
                    Vente
                  </span>
                </div>

                {/* On affiche le titre de la carte. */}
                <h3>Je souhaite vendre</h3>

                {/* On présente l'espace de vente. */}
                <p className="member-choice-description">
                  Publiez vos objets et suivez facilement toutes vos annonces
                  depuis un même espace.
                </p>

                {/* On affiche les principales fonctionnalités. */}
                <ul className="member-choice-list">
                  <li>Publier une nouvelle annonce</li>

                  <li>Modifier ou supprimer mes annonces</li>

                  <li>Suivre le statut de mes produits</li>
                </ul>

                {/* On affiche l'action de la carte. */}
                <span className="member-choice-action">
                  Accéder à l’espace vente

                  {/* On affiche une flèche décorative. */}
                  <ArrowRight
                    size={19}
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                </span>
              </Link>

              {/* On crée la carte de l'espace achat. */}
              <Link
                className="member-choice-card member-choice-card-buyer"
                to="/membre/acheteur"
              >
                {/* On crée la partie supérieure de la carte. */}
                <div className="member-choice-card-top">
                  {/* On affiche l'icône d'achat. */}
                  <span
                    className="member-choice-icon"
                    aria-hidden="true"
                  >
                    <ShoppingCart size={34} strokeWidth={1.8} />
                  </span>

                  {/* On affiche le type d'espace. */}
                  <span className="member-choice-badge">
                    Achat
                  </span>
                </div>

                {/* On affiche le titre de la carte. */}
                <h3>Je souhaite acheter</h3>

                {/* On présente l'espace d'achat. */}
                <p className="member-choice-description">
                  Découvrez les objets disponibles et gérez simplement vos
                  demandes auprès des vendeurs.
                </p>

                {/* On affiche les principales fonctionnalités. */}
                <ul className="member-choice-list">
                  <li>Consulter les annonces disponibles</li>

                  <li>Suivre mes demandes d’achat</li>

                  <li>Gérer mes échanges avec les vendeurs</li>
                </ul>

                {/* On affiche l'action de la carte. */}
                <span className="member-choice-action">
                  Accéder à l’espace achat

                  {/* On affiche une flèche décorative. */}
                  <ArrowRight
                    size={19}
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                </span>
              </Link>
            </div>
          </section>
        </div>
      </main>

      {/* On affiche le pied de page. */}
      <Footer />
    </>
  );
}