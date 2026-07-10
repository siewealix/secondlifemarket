// On importe useEffect pour charger les catégories au démarrage.
import { useEffect } from "react";

// On importe useState pour gérer le formulaire.
import { useState } from "react";

// On importe useNavigate pour rediriger après création.
import { useNavigate } from "react-router-dom";

// On importe la navbar.
import Navbar from "../../components/layout/Navbar.jsx";

// On importe le footer.
import Footer from "../../components/layout/Footer.jsx";

// On importe le hook d'authentification.
import useAuth from "../../hooks/useAuth.js";

// On importe l'API des catégories.
import { getActiveCategoriesRequest } from "../../api/categorieApi.js";

// On importe les fonctions API des annonces.
import {
  createAnnonceRequest,
  uploadAnnoncePhotoRequest,
  publishAnnonceRequest,
} from "../../api/annonceApi.js";

// On définit les valeurs initiales du formulaire.
const initialForm = {
  // On initialise le titre.
  titre: "",

  // On initialise la description.
  description: "",

  // On initialise le prix.
  prix: "",

  // On initialise la ville.
  ville: "",

  // On initialise l'état de l'objet.
  etatObjet: "",

  // On initialise la catégorie.
  categorieId: "",
};

// On crée la page de publication d'annonce.
function CreateAnnoncePage() {
  // On récupère le token du membre connecté.
  const { accessToken } = useAuth();

  // On prépare la navigation.
  const navigate = useNavigate();

  // On stocke les données du formulaire.
  const [form, setForm] = useState(initialForm);

  // On stocke les catégories.
  const [categories, setCategories] = useState([]);

  // On stocke l'état de chargement des catégories.
  const [loadingCategories, setLoadingCategories] = useState(true);

  // On stocke l'état d'enregistrement.
  const [saving, setSaving] = useState(false);

  // On stocke les erreurs.
  const [error, setError] = useState("");

  // On stocke les photos sélectionnées.
  const [photos, setPhotos] = useState([]);

  // On charge les catégories au démarrage.
  useEffect(() => {
    // On crée une fonction interne.
    async function loadCategories() {
      // On essaie de récupérer les catégories.
      try {
        // On appelle l'API publique des catégories.
        const data = await getActiveCategoriesRequest();

        // On stocke les catégories reçues.
        setCategories(data);
      } catch (requestError) {
        // On affiche une erreur.
        setError(requestError.message);
      } finally {
        // On arrête le chargement.
        setLoadingCategories(false);
      }
    }

    // On lance le chargement.
    loadCategories();
  }, []);

  // On gère la saisie dans les champs.
  function handleChange(event) {
    // On récupère le nom du champ.
    const name = event.target.name;

    // On récupère la valeur saisie.
    const value = event.target.value;

    // On met à jour le formulaire.
    setForm((currentForm) => ({
      // On garde les anciennes valeurs.
      ...currentForm,

      // On remplace la valeur du champ modifié.
      [name]: value,
    }));

    // On vide l'erreur.
    setError("");
  }

  // On vérifie si le formulaire est valide.
  function isFormValid() {
    // On vérifie le titre.
    if (!form.titre.trim()) return false;

    // On vérifie la description.
    if (!form.description.trim()) return false;

    // On vérifie le prix.
    if (!form.prix || Number(form.prix) <= 0) return false;

    // On vérifie la ville.
    if (!form.ville.trim()) return false;

    // On vérifie l'état de l'objet.
    if (!form.etatObjet.trim()) return false;

    // On vérifie la catégorie.
    if (!form.categorieId) return false;

    // On retourne vrai si tout est correct.
    return true;
  }

    // On récupère les photos choisies par l'utilisateur.
   function handlePhotosChange(event) {
  // On transforme les fichiers en tableau JavaScript.
  const selectedPhotos = Array.from(event.target.files);

  // On vérifie le nombre de photos.
  if (selectedPhotos.length > 5) {
    // On affiche une erreur.
    setError("Vous pouvez ajouter au maximum 5 photos.");

    // On vide les photos.
    setPhotos([]);

    // On arrête la fonction.
    return;
  }

  // On stocke les photos.
  setPhotos(selectedPhotos);

  // On vide l'erreur.
  setError("");
}

  // On soumet le formulaire.
  async function handleSubmit(event) {
    // On empêche le rechargement de la page.
    event.preventDefault();

    // On vide l'erreur.
    setError("");

    // On vérifie si le formulaire est valide.
    if (!isFormValid()) {
      // On affiche un message simple.
      setError("Veuillez remplir correctement tous les champs.");

      // On arrête la fonction.
      return;
    }

    // On démarre l'enregistrement.
    setSaving(true);

    // On prépare les données à envoyer au backend.
    const annonceData = {
      // On envoie le titre.
      titre: form.titre,

      // On envoie la description.
      description: form.description,

      // On transforme le prix en nombre.
      prix: Number(form.prix),

      // On envoie la ville.
      ville: form.ville,

      // On envoie l'état de l'objet.
      etatObjet: form.etatObjet,

      // On transforme la catégorie en nombre.
      categorieId: Number(form.categorieId),
    };

    // On essaie de publier l'annonce.
    try {
        // On vérifie si aucune photo n'a été sélectionnée.
        if (photos.length === 0) {
        // On affiche une erreur.
        setError("Vous devez ajouter au moins une photo pour publier une annonce.");

        // On arrête la fonction.
        return;
        }
      // On crée d'abord l'annonce.
        const createdAnnonce = await createAnnonceRequest(annonceData, accessToken);

        // On envoie ensuite les photos une par une.
        for (const photo of photos) {
        // On envoie une photo au backend.
        await uploadAnnoncePhotoRequest(createdAnnonce.id, photo, accessToken);
        }

        // On demande au backend de publier l'annonce.
        const publishedAnnonce = await publishAnnonceRequest(createdAnnonce.id, accessToken);

        // On remet le formulaire à zéro.
        setForm(initialForm);

        // On vide les photos.
        setPhotos([]);

        // On vérifie si l'annonce est publiée directement.
        if (publishedAnnonce.statut === "Disponible") {
        // On redirige vers la page publique de l'annonce.
        navigate(`/annonces/${publishedAnnonce.id}`);

        // On arrête la fonction.
        return;
        }

        // On vérifie si l'annonce est envoyée à l'administrateur.
        if (publishedAnnonce.statut === "En réexamen admin") {
        // On informe le membre.
        alert("Votre annonce a été envoyée à l'administrateur pour réexamen.");

        // On redirige vers les annonces du membre.
        navigate("/membre/vendeur/mes-annonces");

        // On arrête la fonction.
        return;
        }

        // On redirige vers les annonces du membre dans les autres cas.
        navigate("/membre/vendeur/mes-annonces");
    } catch (requestError) {
      // On affiche l'erreur.
      setError(requestError.message);
    } finally {
      // On arrête l'enregistrement.
      setSaving(false);
    }
  }

  // On retourne la page.
  return (
    <>
      {/* On affiche la navbar. */}
      <Navbar />

      {/* On crée le contenu principal. */}
      <main className="create-annonce-page">
        {/* En-tête de la page. */}
        <section className="create-annonce-header">
          {/* Titre principal. */}
          <h1>Publier une annonce</h1>

          {/* Texte explicatif. */}
          <p>Remplissez les informations de votre objet pour le mettre en vente sur SecondLife Market.</p>
        </section>

        {/* Formulaire de publication. */}
        <form className="create-annonce-card" onSubmit={handleSubmit}>
          {/* Message d'erreur. */}
          {error && (
            <p className="auth-server-error" role="alert">
              {error}
            </p>
          )}

          {/* Champ titre. */}
          <div className="admin-field">
            {/* Label titre. */}
            <label htmlFor="titre">Titre de l’annonce *</label>

            {/* Input titre. */}
            <input
              id="titre"
              name="titre"
              value={form.titre}
              onChange={handleChange}
              placeholder="Ex : Chaise en bois"
              required
            />
          </div>

          {/* Champ description. */}
          <div className="admin-field">
            {/* Label description. */}
            <label htmlFor="description">Description *</label>

            {/* Textarea description. */}
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Décrivez l’état, l’utilisation et les détails importants de l’objet."
              required
            />
          </div>

          {/* Ligne prix et ville. */}
          <div className="form-two-columns">
            {/* Champ prix. */}
            <div className="admin-field">
              {/* Label prix. */}
              <label htmlFor="prix">Prix en FCFA *</label>

              {/* Input prix. */}
              <input
                id="prix"
                name="prix"
                type="number"
                min="1"
                value={form.prix}
                onChange={handleChange}
                placeholder="Ex : 15000"
                required
              />
            </div>

            {/* Champ ville. */}
            <div className="admin-field">
              {/* Label ville. */}
              <label htmlFor="ville">Ville *</label>

              {/* Input ville. */}
              <input
                id="ville"
                name="ville"
                value={form.ville}
                onChange={handleChange}
                placeholder="Ex : Douala"
                required
              />
            </div>
          </div>

          {/* Ligne état et catégorie. */}
          <div className="form-two-columns">
            {/* Champ état de l'objet. */}
            <div className="admin-field">
              {/* Label état. */}
              <label htmlFor="etatObjet">État de l’objet *</label>

              {/* Select état. */}
              <select
                id="etatObjet"
                name="etatObjet"
                value={form.etatObjet}
                onChange={handleChange}
                required
              >
                {/* Option vide. */}
                <option value="">Choisir un état</option>

                {/* Option neuf. */}
                <option value="Neuf">Neuf</option>

                {/* Option très bon état. */}
                <option value="Très bon état">Très bon état</option>

                {/* Option bon état. */}
                <option value="Bon état">Bon état</option>

                {/* Option état moyen. */}
                <option value="État moyen">État moyen</option>

                {/* Option à réparer. */}
                <option value="À réparer">À réparer</option>
              </select>
            </div>

            {/* Champ catégorie. */}
            <div className="admin-field">
              {/* Label catégorie. */}
              <label htmlFor="categorieId">Catégorie *</label>

              {/* Select catégorie. */}
              <select
                id="categorieId"
                name="categorieId"
                value={form.categorieId}
                onChange={handleChange}
                disabled={loadingCategories}
                required
              >
                {/* Option par défaut. */}
                <option value="">
                  {loadingCategories ? "Chargement..." : "Choisir une catégorie"}
                </option>

                {/* On affiche les catégories. */}
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.icone} {category.nom}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Champ photos. */}
            <div className="admin-field">
            {/* Label photos. */}
            <label htmlFor="photos">Photos de l’annonce</label>

            {/* Input photos multiples. */}
            <input
                id="photos"
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp"
                onChange={handlePhotosChange}
            />
            </div>

            {/* Liste des photos choisies. */}
            {photos.length > 0 && (
            <div className="selected-photos-list">
                {/* On affiche chaque nom de photo. */}
                {photos.map((photo) => (
                <span key={photo.name}>
                    {photo.name}
                </span>
                ))}
            </div>
            )}

          {/* Actions du formulaire. */}
          <div className="admin-actions">
            {/* Bouton de publication. */}
            <button className="btn btn-primary" type="submit" disabled={saving}>
              {saving ? "Publication..." : "Publier l’annonce"}
            </button>
          </div>
        </form>
      </main>

      {/* On affiche le footer. */}
      <Footer />
    </>
  );
}

// On exporte la page.
export default CreateAnnoncePage;