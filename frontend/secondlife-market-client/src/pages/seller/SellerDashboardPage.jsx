// On importe useEffect pour charger les données au démarrage.
import { useEffect } from "react";

// On importe useState pour gérer les données de la page.
import { useState } from "react";

// On importe Link pour créer des liens internes.
import { Link } from "react-router-dom";

// On importe la navbar.
import Navbar from "../../components/layout/Navbar.jsx";

// On importe le footer.
import Footer from "../../components/layout/Footer.jsx";

// On importe le hook d'authentification.
import useAuth from "../../hooks/useAuth.js";

// On importe la fonction API du tableau de bord.
import { getVendeurDashboardRequest } from "../../api/tableauBordApi.js";

// Page du tableau de bord vendeur.
export default function SellerDashboardPage() {
  // On récupère le token du membre connecté.
  const { accessToken } = useAuth();

  // On stocke les statistiques du vendeur.
  const [dashboard, setDashboard] = useState(null);

  // On stocke l'état de chargement.
  const [loading, setLoading] = useState(true);

  // On stocke le message d'erreur.
  const [error, setError] = useState("");

  // Cette fonction charge les statistiques vendeur.
  async function loadDashboard() {
    // On vide l'ancienne erreur.
    setError("");

    // On active le chargement.
    setLoading(true);

    // On essaie de charger les données.
    try {
      // On appelle le backend.
      const data = await getVendeurDashboardRequest(accessToken);

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
      <main className="page-section seller-dashboard-page">
        {/* Conteneur. */}
        <div className="container">
          {/* En-tête. */}
          <div className="section-heading">
            {/* Petit titre. */}
            <span className="section-kicker">Espace vendeur</span>

            {/* Titre principal. */}
            <h1>Tableau de bord vendeur</h1>

            {/* Description. */}
            <p>
              Suivez vos annonces, vos demandes reçues et votre limite de publication.
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
              {/* Carte de limite de publication. */}
              <section className={dashboard.peutEncorePublier ? "seller-limit-card" : "seller-limit-card warning"}>
                {/* Titre de la carte. */}
                <h2>Limite de publication</h2>

                {/* Message de publication. */}
                <p>{dashboard.messagePublication}</p>

                {/* Grille des limites. */}
                <div className="seller-limit-grid">
                  {/* Limite totale. */}
                  <div className="seller-limit-item">
                    <span>Limite actuelle</span>
                    <strong>{dashboard.limitePublication}</strong>
                  </div>

                  {/* Publications utilisées. */}
                  <div className="seller-limit-item">
                    <span>Utilisées</span>
                    <strong>{dashboard.publicationsUtilisees}</strong>
                  </div>

                  {/* Publications restantes. */}
                  <div className="seller-limit-item">
                    <span>Restantes</span>
                    <strong>{dashboard.publicationsRestantes}</strong>
                  </div>
                </div>

                {/* Message si la limite est atteinte. */}
                {!dashboard.peutEncorePublier && (
                  <div className="seller-limit-alert">
                    <p>
                      Votre limite est atteinte. Vous pouvez changer d'offre pour publier plus d'annonces.
                    </p>

                    <Link className="btn btn-primary" to="/membre/vendeur/abonnement">
                      Voir les abonnements
                    </Link>
                  </div>
                )}
              </section>

              {/* Statistiques annonces. */}
              <section className="dashboard-section">
                {/* Titre. */}
                <h2>Mes annonces</h2>

                {/* Grille des statistiques. */}
                <div className="seller-stats-grid">
                  <div className="seller-stat-card">
                    <span>Total</span>
                    <strong>{dashboard.nombreTotalAnnonces}</strong>
                  </div>

                  <div className="seller-stat-card">
                    <span>Disponibles</span>
                    <strong>{dashboard.nombreAnnoncesDisponibles}</strong>
                  </div>

                  <div className="seller-stat-card">
                    <span>En création</span>
                    <strong>{dashboard.nombreAnnoncesEnCreation}</strong>
                  </div>

                  <div className="seller-stat-card">
                    <span>En réexamen</span>
                    <strong>{dashboard.nombreAnnoncesEnReexamen}</strong>
                  </div>

                  <div className="seller-stat-card">
                    <span>Vendues</span>
                    <strong>{dashboard.nombreAnnoncesVendues}</strong>
                  </div>
                </div>
              </section>

              {/* Statistiques demandes. */}
              <section className="dashboard-section">
                {/* Titre. */}
                <h2>Demandes d'achat reçues</h2>

                {/* Grille des statistiques. */}
                <div className="seller-stats-grid">
                  <div className="seller-stat-card">
                    <span>Total reçues</span>
                    <strong>{dashboard.nombreDemandesRecues}</strong>
                  </div>

                  <div className="seller-stat-card">
                    <span>En attente</span>
                    <strong>{dashboard.nombreDemandesEnAttente}</strong>
                  </div>

                  <div className="seller-stat-card">
                    <span>Acceptées</span>
                    <strong>{dashboard.nombreDemandesAcceptees}</strong>
                  </div>
                </div>
              </section>

              {/* Actions rapides. */}
              <section className="dashboard-section">
                {/* Titre. */}
                <h2>Actions rapides</h2>

                {/* Grille des actions. */}
                <div className="seller-actions-grid">
                  {/* Créer une annonce. */}
                  <Link className="seller-action-card" to="/membre/vendeur/annonces/nouvelle">
                    <span>➕</span>
                    <h3>Publier une annonce</h3>
                    <p>Créer une nouvelle annonce avec photos et analyse automatique.</p>
                  </Link>

                  {/* Mes annonces. */}
                  <Link className="seller-action-card" to="/membre/vendeur/mes-annonces">
                    <span>📦</span>
                    <h3>Mes annonces</h3>
                    <p>Consulter, modifier ou retirer vos annonces.</p>
                  </Link>

                  {/* Demandes reçues. */}
                  <Link className="seller-action-card" to="/membre/vendeur/demandes-recues">
                    <span>📩</span>
                    <h3>Demandes reçues</h3>
                    <p>Accepter ou refuser les demandes d'achat reçues.</p>
                  </Link>

                  {/* Abonnement. */}
                  <Link className="seller-action-card" to="/membre/vendeur/abonnement">
                    <span>💳</span>
                    <h3>Mon abonnement</h3>
                    <p>Consulter votre limite et changer d'offre vendeur.</p>
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