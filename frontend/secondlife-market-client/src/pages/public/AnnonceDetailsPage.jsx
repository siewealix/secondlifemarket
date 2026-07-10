// On importe useEffect pour charger l'annonce au démarrage.
import { useEffect } from "react";

// On importe useState pour stocker l'annonce.
import { useState } from "react";

// On importe Link pour revenir à la liste.
import { Link } from "react-router-dom";

// On importe useParams pour lire l'id dans l'URL.
import { useParams } from "react-router-dom";

// On importe la navbar.
import Navbar from "../../components/layout/Navbar.jsx";

// On importe le footer.
import Footer from "../../components/layout/Footer.jsx";

// On importe la fonction API.
import { getAnnonceByIdRequest } from "../../api/annonceApi.js";

// On importe la fonction qui transforme l'URL de photo.
import { getPhotoUrl } from "../../api/annonceApi.js";

// On importe le hook pour récupérer l'utilisateur connecté.
import useAuth from "../../hooks/useAuth.js";

// On importe la fonction qui crée une demande d'achat.
import { createDemandeAchatRequest } from "../../api/demandeApi.js";

// On importe la fonction qui permet de signaler une annonce.
import { createSignalementAnnonceRequest } from "../../api/signalementApi.js";



// On crée la page détail annonce.
function AnnonceDetailsPage() {
  // On récupère l'id dans l'URL.
  const { id } = useParams();

  // On stocke l'annonce.
  const [annonce, setAnnonce] = useState(null);

  // On stocke le chargement.
  const [loading, setLoading] = useState(true);

  // On stocke l'erreur.
  const [error, setError] = useState("");

  // On récupère l'utilisateur connecté et son token.
const { user, accessToken } = useAuth();

// On stocke le message que l'acheteur veut envoyer au vendeur.
const [demandeMessage, setDemandeMessage] = useState("");

// On stocke le message de succès.
const [demandeSuccess, setDemandeSuccess] = useState("");

// On stocke le message d'erreur.
const [demandeError, setDemandeError] = useState("");

// On sait si la demande est en cours d'envoi.
const [demandeLoading, setDemandeLoading] = useState(false);


// On indique si le formulaire de signalement est visible.
const [showSignalementForm, setShowSignalementForm] = useState(false);

// On stocke le motif du signalement.
const [signalementMotif, setSignalementMotif] = useState("");

// On stocke la description du signalement.
const [signalementDescription, setSignalementDescription] = useState("");

// On stocke le message de succès du signalement.
const [signalementSuccess, setSignalementSuccess] = useState("");

// On stocke le message d'erreur du signalement.
const [signalementError, setSignalementError] = useState("");

// On indique si le signalement est en cours d'envoi.
const [signalementLoading, setSignalementLoading] = useState(false);

  // On charge l'annonce au démarrage.
  useEffect(() => {
    // On crée une fonction interne.
    async function loadAnnonce() {
      // On essaie de charger l'annonce.
      try {
        // On appelle l'API.
        const data = await getAnnonceByIdRequest(id);

        // On stocke l'annonce.
        setAnnonce(data);

        // On vide l'erreur.
        setError("");
      } catch (requestError) {
        // On stocke l'erreur.
        setError(requestError.message);
      } finally {
        // On arrête le chargement.
        setLoading(false);
      }
    }

    // On lance le chargement.
    loadAnnonce();
  }, [id]);

  // On prépare le prix formaté.
  const prixFormate = annonce ? Number(annonce.prix).toLocaleString("fr-FR") : "";

  // On prépare l'URL de la photo principale.
const mainPhotoUrl = annonce ? getPhotoUrl(annonce.photoPrincipaleUrl || annonce.photos?.[0]?.url) : "";

// Cette fonction est appelée quand l'acheteur clique sur le bouton.
async function handleCreateDemandeAchat() {
  // On vide l'ancien message de succès.
  setDemandeSuccess("");

  // On vide l'ancien message d'erreur.
  setDemandeError("");

  // On vérifie si l'utilisateur est connecté.
  if (!user || !accessToken) {
    // On affiche une erreur si l'utilisateur n'est pas connecté.
    setDemandeError("Vous devez vous connecter pour faire une demande d'achat.");

    // On arrête la fonction.
    return;
  }

  // On vérifie si l'annonce existe.
  if (!annonce) {
    // On affiche une erreur si l'annonce est absente.
    setDemandeError("Annonce introuvable.");

    // On arrête la fonction.
    return;
  }

  // On indique que l'envoi commence.
  setDemandeLoading(true);

  // On essaie d'envoyer la demande.
  try {
    // On appelle l'API React qui appelle le backend.
    await createDemandeAchatRequest(annonce.id, demandeMessage, accessToken);

    // On affiche un message de succès.
    setDemandeSuccess("Votre demande d'achat a été envoyée au vendeur.");

    // On vide le message écrit par l'acheteur.
    setDemandeMessage("");
  } catch (error) {
    // On affiche le message d'erreur envoyé par le backend.
    setDemandeError(error.message);
  } finally {
    // On indique que l'envoi est terminé.
    setDemandeLoading(false);
  }
}

// Cette fonction est appelée quand le membre envoie un signalement.
async function handleCreateSignalementAnnonce(event) {
  // On empêche le rechargement de la page.
  event.preventDefault();

  // On vide l'ancien message de succès.
  setSignalementSuccess("");

  // On vide l'ancien message d'erreur.
  setSignalementError("");

  // On vérifie si l'utilisateur est connecté.
  if (!user || !accessToken) {
    // On affiche une erreur si l'utilisateur n'est pas connecté.
    setSignalementError("Vous devez vous connecter pour signaler une annonce.");

    // On arrête la fonction.
    return;
  }

  // On vérifie si l'annonce existe.
  if (!annonce) {
    // On affiche une erreur si l'annonce est introuvable.
    setSignalementError("Annonce introuvable.");

    // On arrête la fonction.
    return;
  }

  // On vérifie si le motif est vide.
  if (!signalementMotif.trim()) {
    // On affiche une erreur claire.
    setSignalementError("Le motif du signalement est obligatoire.");

    // On arrête la fonction.
    return;
  }

  // On vérifie si la description est vide.
  if (!signalementDescription.trim()) {
    // On affiche une erreur claire.
    setSignalementError("La description du signalement est obligatoire.");

    // On arrête la fonction.
    return;
  }

  // On active le chargement.
  setSignalementLoading(true);

  // On essaie d'envoyer le signalement.
  try {
    // On prépare les données à envoyer au backend.
    const signalementData = {
      // On envoie le motif.
      motif: signalementMotif,

      // On envoie la description.
      description: signalementDescription,
    };

    // On appelle l'API React.
    await createSignalementAnnonceRequest(annonce.id, signalementData, accessToken);

    // On affiche le message de succès.
    setSignalementSuccess("Votre signalement a été envoyé à l’administrateur.");

    // On vide le motif.
    setSignalementMotif("");

    // On vide la description.
    setSignalementDescription("");

    // On ferme le formulaire.
    setShowSignalementForm(false);
  } catch (error) {
    // On affiche le message d'erreur.
    setSignalementError(error.message);
  } finally {
    // On désactive le chargement.
    setSignalementLoading(false);
  }
}

  // On retourne la page.
  return (
    <>
      {/* On affiche la navbar. */}
      <Navbar />

      {/* Contenu principal. */}
      <main className="annonce-details-page">
        {/* Lien retour. */}
        <Link to="/annonces" className="back-link">
          Retour aux annonces
        </Link>

        {/* Chargement. */}
        {loading && (
          <p className="section-loading">Chargement de l’annonce...</p>
        )}

        {/* Erreur. */}
        {error && (
          <p className="section-error" role="alert">
            {error}
          </p>
        )}

        {/* Détail de l'annonce. */}
        {!loading && !error && annonce && (
          <section className="annonce-details-card">
            {/* Zone image principale. */}
            <div className="annonce-details-image">
            {/* On affiche la vraie photo si elle existe. */}
            {mainPhotoUrl ? (
                <img src={mainPhotoUrl} alt={annonce.titre} />
            ) : (
                "📦"
            )}
            </div>

            {/* Liste des photos. */}
            {annonce.photos && annonce.photos.length > 0 && (
            <div className="annonce-thumbnails">
                {/* On affiche chaque photo. */}
                {annonce.photos.map((photo) => (
                <img
                    key={photo.id}
                    src={getPhotoUrl(photo.url)}
                    alt={annonce.titre}
                />
                ))}
            </div>
            )}

            {/* Informations de l'annonce. */}
            <div className="annonce-details-content">
              {/* Catégorie. */}
              <span className="product-category">{annonce.nomCategorie}</span>

              {/* Titre. */}
              <h1>{annonce.titre}</h1>

              {/* Prix. */}
              <strong className="annonce-price">{prixFormate} FCFA</strong>

              {/* Description. */}
              <p className="annonce-description">{annonce.description}</p>

              {/* Informations détaillées. */}
              <div className="annonce-info-grid">
                {/* Ville. */}
                <div>
                  <span>Ville</span>
                  <strong>{annonce.ville}</strong>
                </div>

                {/* État. */}
                <div>
                  <span>État</span>
                  <strong>{annonce.etatObjet}</strong>
                </div>

                {/* Statut. */}
                <div>
                  <span>Statut</span>
                  <strong>{annonce.statut}</strong>
                </div>

                {/* Vendeur. */}
                <div>
                  <span>Vendeur</span>
                  <strong>{annonce.nomVendeur}</strong>
                </div>
              </div>

              {/* On affiche ce bloc seulement si l'annonce est disponible. */}
                {annonce?.statut === "Disponible" && (
                <section className="purchase-request-box">
                    {/* Titre du bloc de demande d'achat. */}
                    <h2>Faire une demande d'achat</h2>

                    {/* Petit texte explicatif. */}
                    <p>
                    Envoyez une demande au vendeur pour lui montrer que vous êtes intéressé par cette annonce.
                    </p>

                    {/* Champ de message optionnel. */}
                    <label htmlFor="demandeMessage">Message au vendeur</label>

                    {/* Zone de texte pour écrire un message. */}
                    <textarea
                    // Identifiant lié au label.
                    id="demandeMessage"

                    // Nom du champ.
                    name="demandeMessage"

                    // Valeur actuelle du message.
                    value={demandeMessage}

                    // Mise à jour du message quand l'utilisateur écrit.
                    onChange={(event) => setDemandeMessage(event.target.value)}

                    // Texte affiché quand le champ est vide.
                    placeholder="Bonjour, je suis intéressé par cette annonce."

                    // Nombre maximal de caractères.
                    maxLength={1000}

                    // Classe CSS simple.
                    className="form-textarea"
                    />

                    {/* Message d'erreur. */}
                    {demandeError && (
                    <p className="form-error" role="alert">
                        {demandeError}
                    </p>
                    )}

                    {/* Message de succès. */}
                    {demandeSuccess && (
                    <p className="form-success" role="status">
                        {demandeSuccess}
                    </p>
                    )}

                    {/* Bouton d'envoi de la demande. */}
                    <button
                    // Le bouton ne soumet pas un formulaire.
                    type="button"

                    // Classe CSS du bouton.
                    className="btn btn-primary"

                    // Fonction appelée au clic.
                    onClick={handleCreateDemandeAchat}

                    // On désactive le bouton pendant l'envoi.
                    disabled={demandeLoading}
                    >
                    {/* Texte du bouton selon l'état. */}
                    {demandeLoading ? "Envoi en cours..." : "Faire une demande d'achat"}
                    </button>
                </section>
                )}

                {/* Bloc de signalement d'annonce. */}
                <section className="report-annonce-box">
                {/* Titre discret du bloc. */}
                <h2>Un problème avec cette annonce ?</h2>

                {/* Texte explicatif. */}
                <p>
                    Si cette annonce semble fausse, dangereuse ou inappropriée, vous pouvez la signaler à l’administrateur.
                </p>

                {/* Bouton pour afficher ou cacher le formulaire. */}
                <button
                    // Le bouton ne soumet pas de formulaire.
                    type="button"

                    // Classe CSS du bouton.
                    className="btn btn-secondary"

                    // Au clic, on affiche ou cache le formulaire.
                    onClick={() => setShowSignalementForm(!showSignalementForm)}
                >
                    {/* Texte du bouton selon l'état du formulaire. */}
                    {showSignalementForm ? "Fermer le signalement" : "Signaler cette annonce"}
                </button>

                {/* Message de succès. */}
                {signalementSuccess && (
                    <p className="form-success" role="status">
                    {signalementSuccess}
                    </p>
                )}

                {/* Message d'erreur. */}
                {signalementError && (
                    <p className="form-error" role="alert">
                    {signalementError}
                    </p>
                )}

        {/* Formulaire affiché seulement si le membre clique sur signaler. */}
        {showSignalementForm && (
            <form className="report-form" onSubmit={handleCreateSignalementAnnonce}>
            {/* Champ motif. */}
            <label htmlFor="signalementMotif">Motif du signalement</label>

            {/* Liste simple des motifs. */}
            <select
                // Identifiant lié au label.
                id="signalementMotif"

                // Nom du champ.
                name="signalementMotif"

                // Valeur actuelle.
                value={signalementMotif}

                // Mise à jour du motif.
                onChange={(event) => setSignalementMotif(event.target.value)}

                // Champ obligatoire.
                required

                // Accessibilité.
                aria-required="true"

                // Classe CSS.
                className="form-select"
            >
                {/* Option vide. */}
                <option value="">Choisir un motif</option>

                {/* Motif 1. */}
                <option value="Annonce suspecte">Annonce suspecte</option>

                {/* Motif 2. */}
                <option value="Informations fausses">Informations fausses</option>

                {/* Motif 3. */}
                <option value="Photos incorrectes">Photos incorrectes</option>

                {/* Motif 4. */}
                <option value="Objet interdit">Objet interdit</option>

                {/* Motif 5. */}
                <option value="Autre">Autre</option>
            </select>

            {/* Champ description. */}
            <label htmlFor="signalementDescription">Description</label>

            {/* Zone de texte pour expliquer le problème. */}
            <textarea
                // Identifiant lié au label.
                id="signalementDescription"

                // Nom du champ.
                name="signalementDescription"

                // Valeur actuelle.
                value={signalementDescription}

                // Mise à jour de la description.
                onChange={(event) => setSignalementDescription(event.target.value)}

                // Texte d'aide.
                placeholder="Expliquez clairement le problème observé sur cette annonce."

                // Limite backend.
                maxLength={1000}

                // Champ obligatoire.
                required

                // Accessibilité.
                aria-required="true"

                // Classe CSS existante.
                className="form-textarea"
            />

            {/* Bouton d'envoi. */}
            <button
                // Le bouton soumet le formulaire.
                type="submit"

                // Classe CSS du bouton.
                className="btn btn-danger"

                // On désactive pendant l'envoi.
                disabled={signalementLoading}
            >
                {/* Texte selon l'état. */}
                {signalementLoading ? "Envoi..." : "Envoyer le signalement"}
            </button>
            </form>
        )}
        </section>
            </div>
          </section>
        )}
      </main>

      {/* On affiche le footer. */}
      <Footer />
    </>
  );
}

// On exporte la page.
export default AnnonceDetailsPage;