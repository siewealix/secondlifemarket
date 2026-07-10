// On importe useEffect pour charger les données au démarrage.
import { useEffect } from "react";

// On importe useState pour gérer les données.
import { useState } from "react";

// On importe Link pour créer des liens internes.
import { Link } from "react-router-dom";

// On importe la navbar.
import Navbar from "../../components/layout/Navbar.jsx";

// On importe le footer.
import Footer from "../../components/layout/Footer.jsx";

// On importe le hook d'authentification.
import useAuth from "../../hooks/useAuth.js";

// On importe la fonction API du tableau de bord acheteur.
import { getAcheteurDashboardRequest } from "../../api/tableauBordApi.js";

// Page du tableau de bord acheteur.
export default function BuyerDashboardPage() {
  // On récupère le token du membre connecté.
  const { accessToken } = useAuth();

  // On stocke les statistiques acheteur.
  const [dashboard, setDashboard] = useState(null);

  // On stocke l'état de chargement.
  const [loading, setLoading] = useState(true);

  // On stocke le message d'erreur.
  const [error, setError] = useState("");

  // Cette fonction charge les statistiques acheteur.
  async function loadDashboard() {
    // On vide l'ancienne erreur.
    setError("");

    // On active le chargement.
    setLoading(true);

    // On essaie de charger les données.
    try {
      // On appelle le backend.
      const data = await getAcheteurDashboardRequest(accessToken);

      // On stocke les statistiques.
      setDashboard(data);
    } catch (error) {
      // On affiche l'erreur.
      setError(error.message);
    } finally {
      // On désactive le chargement.
      setLoading(false);
    }
  }

  // Ce bloc se lance au chargement de la page.
  useEffect(() => {
    // On vérifie si le token existe.
    if (accessToken) {
      // On charge le tableau de bord.
      loadDashboard();
    }
  }, [accessToken]);

  // On retourne l'interface.
  return (
    <>
      {/* On affiche la navbar. */}
      <Navbar />

      {/* Contenu principal. */}
      <main className="page-section buyer-dashboard-page">
        {/* Conteneur. */}
        <div className="container">
          {/* En-tête. */}
          <div className="section-heading">
            {/* Petit titre. */}
            <span className="section-kicker">Espace acheteur</span>

            {/* Titre principal. */}
            <h1>Tableau de bord acheteur</h1>

            {/* Description. */}
            <p>
              Suivez vos demandes d'achat, vos conversations et les annonces disponibles.
            </p>
          </div>

          {/* Message de chargement. */}
          {loading && (
            <p className="page-message">
              Chargement du tableau de bord...
            </p>
          )}

          {/* Message d'erreur. */}
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}

          {/* Contenu du tableau de bord. */}
          {!loading && dashboard && (
            <>
              {/* Carte principale. */}
              <section className="buyer-summary-card">
                {/* Titre. */}
                <h2>Résumé de mon activité</h2>

                {/* Message. */}
                <p>{dashboard.message}</p>

                {/* Grille rapide. */}
                <div className="buyer-summary-grid">
                  {/* Demandes envoyées. */}
                  <div className="buyer-summary-item">
                    <span>Demandes envoyées</span>
                    <strong>{dashboard.nombreDemandesEnvoyees}</strong>
                  </div>

                  {/* Conversations. */}
                  <div className="buyer-summary-item">
                    <span>Conversations</span>
                    <strong>{dashboard.nombreConversations}</strong>
                  </div>

                  {/* Annonces disponibles. */}
                  <div className="buyer-summary-item">
                    <span>Annonces disponibles</span>
                    <strong>{dashboard.nombreAnnoncesDisponibles}</strong>
                  </div>
                </div>
              </section>

              {/* Statistiques demandes. */}
              <section className="dashboard-section">
                {/* Titre. */}
                <h2>Mes demandes d'achat</h2>

                {/* Grille des statistiques. */}
                <div className="buyer-stats-grid">
                  <div className="buyer-stat-card">
                    <span>Total envoyées</span>
                    <strong>{dashboard.nombreDemandesEnvoyees}</strong>
                  </div>

                  <div className="buyer-stat-card">
                    <span>En attente</span>
                    <strong>{dashboard.nombreDemandesEnAttente}</strong>
                  </div>

                  <div className="buyer-stat-card">
                    <span>Acceptées</span>
                    <strong>{dashboard.nombreDemandesAcceptees}</strong>
                  </div>

                  <div className="buyer-stat-card">
                    <span>Refusées</span>
                    <strong>{dashboard.nombreDemandesRefusees}</strong>
                  </div>

                  <div className="buyer-stat-card">
                    <span>Annulées</span>
                    <strong>{dashboard.nombreDemandesAnnulees}</strong>
                  </div>
                </div>
              </section>

              {/* Actions rapides. */}
              <section className="dashboard-section">
                {/* Titre. */}
                <h2>Actions rapides</h2>

                {/* Grille des actions. */}
                <div className="buyer-actions-grid">
                  {/* Voir les annonces. */}
                  <Link className="buyer-action-card" to="/">
                    <span>🔎</span>
                    <h3>Voir les annonces</h3>
                    <p>Rechercher des objets disponibles sur la plateforme.</p>
                  </Link>

                  {/* Mes demandes. */}
                  <Link className="buyer-action-card" to="/membre/acheteur/mes-demandes">
                    <span>📩</span>
                    <h3>Mes demandes d'achat</h3>
                    <p>Consulter, suivre ou annuler vos demandes d'achat.</p>
                  </Link>

                  {/* Retour espace membre. */}
                  <Link className="buyer-action-card" to="/membre">
                    <span>👤</span>
                    <h3>Espace membre</h3>
                    <p>Retourner à votre espace principal.</p>
                  </Link>
                </div>
              </section>
            </>
          )}
        </div>
      </main>

      {/* On affiche le footer. */}
      <Footer />
    </>
  );
}