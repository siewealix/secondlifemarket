// On importe Link pour créer un lien vers le détail.
import { Link } from "react-router-dom";

// On importe la fonction qui transforme l'URL de photo.
import { getPhotoUrl } from "../../api/annonceApi.js";

// On crée le composant carte d'annonce.
function ProductCard({ annonce }) {
  // On formate le prix en FCFA.
  const prixFormate = Number(annonce.prix).toLocaleString("fr-FR");

  // On prépare l'URL de la photo principale.
  const photoUrl = getPhotoUrl(annonce.photoPrincipaleUrl);

  // On retourne la carte.
  return (
    // On crée une carte.
    <article className="product-card">
      {/* On affiche la photo si elle existe. */}
      {photoUrl ? (
        // Image réelle de l'annonce.
        <img className="product-image" src={photoUrl} alt={annonce.titre} />
      ) : (
        // Image temporaire si aucune photo n'existe.
        <div className="product-image-placeholder">
          📦
        </div>
      )}

      {/* Contenu de la carte. */}
      <div className="product-card-body">
        {/* Catégorie de l'annonce. */}
        <span className="product-category">{annonce.nomCategorie}</span>

        {/* Titre de l'annonce. */}
        <h3>{annonce.titre}</h3>

        {/* Description courte. */}
        <p>{annonce.description}</p>

        {/* Infos principales. */}
        <div className="product-meta">
          {/* Ville. */}
          <span>{annonce.ville}</span>

          {/* État de l'objet. */}
          <span>{annonce.etatObjet}</span>
        </div>

        {/* Bas de la carte. */}
        <div className="product-footer">
          {/* Prix. */}
          <strong>{prixFormate} FCFA</strong>

          {/* Lien détail. */}
          <Link to={`/annonces/${annonce.id}`} className="product-link">
            Voir détail
          </Link>
        </div>
      </div>
    </article>
  );
}

// On exporte le composant.
export default ProductCard;