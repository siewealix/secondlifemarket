// On importe useEffect pour charger les annonces au démarrage.
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

// On importe les fonctions API des annonces.
import {
  getMyAnnoncesRequest,
  deleteAnnonceRequest,
  deleteAnnoncePhotoRequest,
  getPhotoUrl,
  markAnnonceAsSoldRequest,
} from "../../api/annonceApi.js";

// On crée la page Mes annonces.
function MyAnnoncesPage() {
  // On récupère le token du membre connecté.
  const { accessToken } = useAuth();

  // On stocke les annonces du membre.
  const [annonces, setAnnonces] = useState([]);

  // On stocke l'état de chargement.
  const [loading, setLoading] = useState(true);

  // On stocke l'erreur.
  const [error, setError] = useState("");

  // On stocke l'annonce en cours de traitement.
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // On stocke le message de succès.
  const [success, setSuccess] = useState("");

  // On charge les annonces au démarrage.
  useEffect(() => {
    // On vérifie que le token existe.
    if (!accessToken) return;

    // On lance le chargement.
    loadMyAnnonces();
  }, [accessToken]);

  // On crée la fonction de chargement.
  async function loadMyAnnonces() {
    // On démarre le chargement.
    setLoading(true);

    // On vide l'erreur.
    setError("");

    // On essaie de récupérer les annonces.
    try {
      // On appelle l'API.
      const data = await getMyAnnoncesRequest(accessToken);

      // On stocke les annonces reçues.
      setAnnonces(data);
    } catch (requestError) {
      // On affiche l'erreur.
      setError(requestError.message);
    } finally {
      // On arrête le chargement.
      setLoading(false);
    }
  }

  // On désactive une annonce.
  async function handleDelete(annonceId) {
    // On demande confirmation au membre.
    const confirmed = window.confirm("Voulez-vous vraiment désactiver cette annonce ?");

    // On arrête si le membre refuse.
    if (!confirmed) return;

    // On vide les messages.
    setError("");

    // On vide le succès.
    setSuccess("");

    // On essaie de désactiver l'annonce.
    try {
      // On appelle l'API DELETE.
      await deleteAnnonceRequest(annonceId, accessToken);

      // On affiche un message de succès.
      setSuccess("Annonce désactivée avec succès.");

      // On recharge les annonces.
      await loadMyAnnonces();
    } catch (requestError) {
      // On affiche l'erreur.
      setError(requestError.message);
    }
  }

  // On supprime une photo d'une annonce.
async function handleDeletePhoto(annonceId, photoId) {
  // On demande confirmation au membre.
  const confirmed = window.confirm("Voulez-vous vraiment supprimer cette photo ?");

  // On arrête si le membre refuse.
  if (!confirmed) return;

  // On vide l'erreur.
  setError("");

  // On vide le succès.
  setSuccess("");

  // On essaie de supprimer la photo.
  try {
    // On appelle l'API de suppression de photo.
    await deleteAnnoncePhotoRequest(annonceId, photoId, accessToken);

    // On affiche un message de succès.
    setSuccess("Photo supprimée avec succès.");

    // On recharge les annonces.
    await loadMyAnnonces();
  } catch (error) {
    // On affiche l'erreur.
    alert(error.message || "Impossible de supprimer cette photo.");
  }
}

  // On formate le prix.
  function formatPrice(price) {
    // On transforme le prix en format français.
    return Number(price).toLocaleString("fr-FR");
  }

  // Cette fonction marque une annonce comme vendue.
async function handleMarkAsSold(annonceId) {
  // On vide les anciens messages.
  setError("");
  setSuccess("");

  // On demande confirmation avant l'action.
  const confirmed = window.confirm("Voulez-vous vraiment marquer cette annonce comme vendue ?");

  // Si l'utilisateur annule, on arrête.
  if (!confirmed) {
    // On sort de la fonction.
    return;
  }

  // On indique que cette annonce est en cours de traitement.
  setActionLoadingId(annonceId);

  // On essaie de marquer l'annonce comme vendue.
  try {
    // On appelle le backend.
    const updatedAnnonce = await markAnnonceAsSoldRequest(annonceId, accessToken);

    // On met à jour la liste des annonces localement.
    setAnnonces((currentAnnonces) =>
      // On parcourt les annonces actuelles.
      currentAnnonces.map((annonce) =>
        // Si c'est l'annonce modifiée, on remplace par la version reçue.
        annonce.id === annonceId ? updatedAnnonce : annonce
      )
    );

    // On affiche un message de succès.
    setSuccess("L'annonce a été marquée comme vendue.");
  } catch (error) {
    // On affiche l'erreur.
    setError(error.message);
  } finally {
    // On arrête le traitement.
    setActionLoadingId(null);
  }
}

  // On retourne la page.
  return (
    <>
      {/* On affiche la navbar. */}
      <Navbar />

      {/* On crée le contenu principal. */}
      <main className="my-annonces-page">
        {/* En-tête de page. */}
        <section className="my-annonces-header">
          {/* Titre principal. */}
          <h1>Mes annonces</h1>

          {/* Description. */}
          <p>Retrouvez ici toutes les annonces que vous avez publiées sur SecondLife Market.</p>

          {/* Bouton publier. */}
          <Link to="/membre/vendeur/annonces/nouvelle" className="btn btn-primary">
            Publier une nouvelle annonce
          </Link>
        </section>

        {/* Message d'erreur. */}
        {error && (
          <p className="auth-server-error" role="alert">
            {error}
          </p>
        )}

        {/* Message de succès. */}
        {success && (
          <p className="admin-success" role="status">
            {success}
          </p>
        )}

        {/* Message de chargement. */}
        {loading && (
          <p className="section-loading">Chargement de vos annonces...</p>
        )}

        {/* Message si aucune annonce. */}
        {!loading && !error && annonces.length === 0 && (
          <div className="section-empty">
            Vous n'avez encore publié aucune annonce.
          </div>
        )}

        {/* Liste des annonces. */}
        {!loading && annonces.length > 0 && (
          <section className="my-annonces-grid">
            {/* On parcourt les annonces du membre. */}
            {annonces.map((annonce) => (
              // Carte d'une annonce.
              <article className="my-annonce-card" key={annonce.id}>
                {/* Image principale de l'annonce. */}
                <div className="my-annonce-image">
                {/* On affiche la vraie photo si elle existe. */}
                {annonce.photoPrincipaleUrl ? (
                    <img src={getPhotoUrl(annonce.photoPrincipaleUrl)} alt={annonce.titre} />
                ) : (
                    "📦"
                )}
                </div>

                {/* Contenu de la carte. */}
                <div className="my-annonce-content">
                  {/* Ligne catégorie et statut. */}
                  <div className="my-annonce-top">
                    {/* Catégorie. */}
                    <span className="product-category">{annonce.nomCategorie}</span>

                    {/* Statut. */}
                    <span className={annonce.estActive ? "badge-active" : "badge-inactive"}>
                      {annonce.estActive ? annonce.statut : "Inactive"}
                    </span>
                  </div>

                  {/* Titre. */}
                  <h2>{annonce.titre}</h2>

                  {/* Description. */}
                  <p>{annonce.description}</p>

                  {/* Infos. */}
                  <div className="product-meta">
                    {/* Ville. */}
                    <span>{annonce.ville}</span>

                    {/* État. */}
                    <span>{annonce.etatObjet}</span>
                  </div>

                  {/* Prix. */}
                  <strong className="my-annonce-price">
                    {formatPrice(annonce.prix)} FCFA
                  </strong>

                  {/* Informations de la dernière analyse IA. */}
                    {annonce.derniereDecisionIa && (
                    <div className="my-annonce-ai">
                        {/* Décision IA. */}
                        <span>Décision IA : {annonce.derniereDecisionIa}</span>

                        {/* Score IA. */}
                        {annonce.dernierScoreConfianceIa !== null && (
                        <span>Score : {annonce.dernierScoreConfianceIa}/100</span>
                        )}

                        {/* Motif IA. */}
                        {annonce.dernierMotifIa && (
                        <p>{annonce.dernierMotifIa}</p>
                        )}
                    </div>
                    )}

                  {/* Miniatures des photos. */}
                    {annonce.photos && annonce.photos.length > 0 && (
                    <div className="my-annonce-photos">
                        {/* On affiche chaque photo. */}
                        {annonce.photos.map((photo) => (
                        <div className="my-annonce-photo-item" key={photo.id}>
                            {/* Image miniature. */}
                            <img src={getPhotoUrl(photo.url)} alt={annonce.titre} />

                            {/* Badge photo principale. */}
                            {photo.estPrincipale && (
                            <span>Principale</span>
                            )}

                            {/* Bouton de suppression. */}
                            <button
                            type="button"
                            onClick={() => handleDeletePhoto(annonce.id, photo.id)}
                            >
                            Supprimer
                            </button>
                        </div>
                        ))}
                    </div>
                    )}

                  {/* Actions. */}
                    <div className="my-annonce-actions">
                    {/* Lien vers le détail. */}
                    <Link to={`/annonces/${annonce.id}`} className="btn btn-outline">
                        Voir détail
                    </Link>

                    {/* Lien vers la modification. */}
                    <Link to={`/membre/annonces/modifier/${annonce.id}`} className="btn btn-primary">
                        Modifier
                    </Link>

                    {/* Bouton désactiver visible seulement si active. */}
                    {annonce.estActive && (
                        <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => handleDelete(annonce.id)}
                        >
                        Désactiver
                        </button>
                    )}

                    {/* Bouton pour marquer l'annonce comme vendue. */}
                    {annonce.statut === "Disponible" && (
                      <button
                        // Type bouton.
                        type="button"

                        // Classe du bouton.
                        className="btn btn-success"

                        // Action au clic.
                        onClick={() => handleMarkAsSold(annonce.id)}

                        // On désactive pendant le traitement.
                        disabled={actionLoadingId === annonce.id}
                      >
                        {/* Texte du bouton. */}
                        {actionLoadingId === annonce.id ? "Traitement..." : "Marquer comme vendu"}
                      </button>
                    )}
                    </div>
                </div>
              </article>
            ))}
          </section>
        )}
      </main>

      {/* On affiche le footer. */}
      <Footer />
    </>
  );
}

// On exporte la page.
export default MyAnnoncesPage;