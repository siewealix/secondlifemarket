// On importe useEffect pour charger les données quand la page s'ouvre.
import { useEffect } from "react";

// On importe useState pour gérer les données de la page.
import { useState } from "react";

// On importe la barre de navigation.
import Navbar from "../../components/layout/Navbar.jsx";

// On importe le footer.
import Footer from "../../components/layout/Footer.jsx";

// On importe le menu administrateur.
import AdminSidebar from "../../components/layout/AdminSidebar.jsx";

// On importe les fonctions API liées aux annonces.
import {
  getAdminReviewAnnoncesRequest,
  validateAnnonceByAdminRequest,
  rejectAnnonceByAdminRequest,
  getPhotoUrl,
} from "../../api/annonceApi.js";

// On importe le hook d'authentification.
import useAuth from "../../hooks/useAuth.js";

// On importe le composant d'état vide.
import EmptyState from "../../components/ui/EmptyState.jsx";

// On importe le badge de statut.
import StatusBadge from "../../components/ui/StatusBadge.jsx";

// On crée la page de réexamen des annonces.
export default function AdminReviewAnnoncesPage() {
  // On récupère le token de l'administrateur connecté.
  const { accessToken } = useAuth();

  // On stocke les annonces en réexamen.
  const [annonces, setAnnonces] = useState([]);

  // On stocke l'état de chargement de la page.
  const [loading, setLoading] = useState(true);

  // On stocke l'identifiant de l'annonce en cours de traitement.
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // On stocke le message d'erreur.
  const [error, setError] = useState("");

  // On crée une fonction pour charger les annonces en réexamen.
  async function loadAnnonces() {
    // On essaie de récupérer les annonces.
    try {
      // On vide l'ancien message d'erreur.
      setError("");

      // On active le chargement.
      setLoading(true);

      // On appelle le backend pour récupérer les annonces en réexamen.
      const data = await getAdminReviewAnnoncesRequest(accessToken);

      // On met les annonces dans le state.
      setAnnonces(data);
    } catch (err) {
      // On affiche un message d'erreur.
      setError(err.message || "Impossible de charger les annonces en réexamen.");
    } finally {
      // On désactive le chargement.
      setLoading(false);
    }
  }

  // On crée une fonction pour récupérer la photo principale.
  function getMainPhoto(annonce) {
    // On vérifie si le backend a envoyé une photo principale.
    if (annonce.photoPrincipaleUrl) {
      // On retourne l'adresse complète de la photo principale.
      return getPhotoUrl(annonce.photoPrincipaleUrl);
    }

    // On vérifie si l'annonce possède une liste de photos.
    if (annonce.photos && annonce.photos.length > 0) {
      // On retourne l'adresse complète de la première photo.
      return getPhotoUrl(annonce.photos[0].url);
    }

    // On retourne une valeur vide si aucune photo n'est trouvée.
    return "";
  }

  // On crée une fonction pour valider une annonce.
  async function handleValidate(annonceId) {
    // On essaie de valider l'annonce.
    try {
      // On indique que cette annonce est en traitement.
      setActionLoadingId(annonceId);

      // On appelle le backend pour valider l'annonce.
      await validateAnnonceByAdminRequest(annonceId, accessToken);

      // On retire l'annonce validée de la liste.
      setAnnonces((current) => current.filter((annonce) => annonce.id !== annonceId));

      // On affiche un message de succès.
      alert("Annonce validée avec succès.");
    } catch (err) {
      // On affiche un message d'erreur.
      alert(err.message || "Impossible de valider cette annonce.");
    } finally {
      // On arrête le chargement de l'action.
      setActionLoadingId(null);
    }
  }

  // On crée une fonction pour rejeter une annonce.
  async function handleReject(annonceId) {
    // On demande une confirmation avant le rejet.
    const confirmed = window.confirm("Voulez-vous vraiment rejeter cette annonce ?");

    // On arrête la fonction si l'administrateur annule.
    if (!confirmed) return;

    // On essaie de rejeter l'annonce.
    try {
      // On indique que cette annonce est en traitement.
      setActionLoadingId(annonceId);

      // On appelle le backend pour rejeter l'annonce.
      await rejectAnnonceByAdminRequest(annonceId, accessToken);

      // On retire l'annonce rejetée de la liste.
      setAnnonces((current) => current.filter((annonce) => annonce.id !== annonceId));

      // On affiche un message de succès.
      alert("Annonce rejetée avec succès.");
    } catch (err) {
      // On affiche un message d'erreur.
      alert(err.message || "Impossible de rejeter cette annonce.");
    } finally {
      // On arrête le chargement de l'action.
      setActionLoadingId(null);
    }
  }

  // On charge les annonces quand le token est disponible.
  useEffect(() => {
    // On vérifie si le token existe.
    if (accessToken) {
      // On charge les annonces en réexamen.
      loadAnnonces();
    }
  }, [accessToken]);

  // On affiche la page pendant le chargement.
  if (loading) {
    // On retourne la structure complète de la page.
    return (
      <>
        {/* On affiche la barre de navigation. */}
        <Navbar />

        {/* On affiche le contenu principal. */}
        <main className="page-section">
          {/* On centre le contenu. */}
          <div className="container">
            {/* On affiche la mise en page admin. */}
            <div className="admin-page-layout">
              {/* On affiche le menu administrateur. */}
              <AdminSidebar />

              {/* On affiche le contenu de chargement. */}
              <section className="admin-page-content">
                {/* On affiche le message de chargement. */}
                <p>Chargement des annonces en réexamen...</p>
              </section>
            </div>
          </div>
        </main>

        {/* On affiche le footer. */}
        <Footer />
      </>
    );
  }

  // On retourne la page principale.
  return (
    <>
      {/* On affiche la barre de navigation. */}
      <Navbar />

      {/* On affiche le contenu principal. */}
      <main className="page-section">
        {/* On centre le contenu. */}
        <div className="container">
          {/* On organise la page admin en deux parties. */}
          <div className="admin-page-layout">
            {/* On affiche le menu administrateur. */}
            <AdminSidebar />

            {/* On affiche le contenu principal de la page. */}
            <section className="admin-page-content">
              {/* On affiche l'en-tête de la page. */}
              <div className="section-heading">
                {/* On affiche le petit titre. */}
                <span className="section-kicker">Administration</span>

                {/* On affiche le titre principal. */}
                <h1>Réexamen des annonces</h1>

                {/* On affiche la description de la page. */}
                <p>Vérifiez les annonces envoyées en réexamen par l’analyse IA.</p>
              </div>

              {/* On affiche un message d'erreur si une erreur existe. */}
              {error && (
                // On crée le bloc d'erreur.
                <div className="form-error" role="alert">
                  {/* On affiche le texte de l'erreur. */}
                  {error}
                </div>
              )}

              {/* On affiche un message vide si aucune annonce n'est à traiter. */}
              {annonces.length === 0 ? (
                // On affiche le composant d'état vide.
                <EmptyState
                  // On donne le titre du message vide.
                  title="Aucune annonce à réexaminer"
                  // On donne la description du message vide.
                  description="Toutes les annonces douteuses ont déjà été traitées."
                />
              ) : (
                // On affiche la liste des annonces.
                <div className="admin-review-grid">
                  {/* On parcourt toutes les annonces. */}
                  {annonces.map((annonce) => {
                    // On récupère la photo principale.
                    const photoUrl = getMainPhoto(annonce);

                    // On retourne une carte pour cette annonce.
                    return (
                      // On crée la carte de l'annonce.
                      <article className="admin-review-card" key={annonce.id}>
                        {/* On affiche la zone de la photo. */}
                        <div className="admin-review-image">
                          {/* On vérifie si une photo existe. */}
                          {photoUrl ? (
                            // On affiche la photo.
                            <img src={photoUrl} alt={annonce.titre} />
                          ) : (
                            // On affiche une icône si aucune photo n'est trouvée.
                            <span>📦</span>
                          )}
                        </div>

                        {/* On affiche les informations de l'annonce. */}
                        <div className="admin-review-content">
                          {/* On affiche le haut de la carte. */}
                          <div className="admin-review-top">
                            {/* On affiche le titre. */}
                            <h2>{annonce.titre}</h2>

                            {/* On affiche le statut. */}
                            <StatusBadge status={annonce.statut} />
                          </div>

                          {/* On affiche la description. */}
                          <p className="admin-review-description">{annonce.description}</p>

                          {/* On affiche les détails de l'annonce. */}
                          <div className="admin-review-details">
                            {/* On affiche le prix. */}
                            <span>Prix : {Number(annonce.prix).toLocaleString("fr-FR")} FCFA</span>

                            {/* On affiche la ville. */}
                            <span>Ville : {annonce.ville}</span>

                            {/* On affiche l'état de l'objet. */}
                            <span>État : {annonce.etatObjet}</span>

                            {/* On affiche la catégorie. */}
                            <span>Catégorie : {annonce.nomCategorie}</span>
                          </div>

                          {/* On affiche les informations de l'analyse IA. */}
                          <div className="admin-review-ai">
                            {/* On affiche le titre du bloc IA. */}
                            <strong>Analyse IA</strong>

                            {/* On affiche la décision IA. */}
                            <span>Décision IA : {annonce.derniereDecisionIa || "Non renseignée"}</span>

                            {/* On affiche le score IA. */}
                            <span>
                              Score IA :{" "}
                              {annonce.dernierScoreConfianceIa === null
                                ? "Non renseigné"
                                : `${annonce.dernierScoreConfianceIa}/100`}
                            </span>

                            {/* On affiche le motif IA. */}
                            <p>{annonce.dernierMotifIa || "Aucun motif IA renseigné."}</p>
                          </div>

                          {/* On affiche les boutons d'action. */}
                          <div className="admin-review-actions">
                            {/* On affiche le bouton de validation. */}
                            <button
                              // On applique le style principal.
                              className="btn btn-primary"
                              // On indique que ce bouton ne soumet pas de formulaire.
                              type="button"
                              // On désactive le bouton pendant le traitement.
                              disabled={actionLoadingId === annonce.id}
                              // On valide l'annonce au clic.
                              onClick={() => handleValidate(annonce.id)}
                            >
                              {/* On change le texte pendant le traitement. */}
                              {actionLoadingId === annonce.id ? "Traitement..." : "Valider"}
                            </button>

                            {/* On affiche le bouton de rejet. */}
                            <button
                              // On applique le style secondaire.
                              className="btn btn-outline"
                              // On indique que ce bouton ne soumet pas de formulaire.
                              type="button"
                              // On désactive le bouton pendant le traitement.
                              disabled={actionLoadingId === annonce.id}
                              // On rejette l'annonce au clic.
                              onClick={() => handleReject(annonce.id)}
                            >
                              {/* On affiche le texte du bouton. */}
                              Rejeter
                            </button>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </section>
          </div>
        </div>
      </main>

      {/* On affiche le footer. */}
      <Footer />
    </>
  );
}