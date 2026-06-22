// On importe Link pour le bouton de détail.
import { Link } from "react-router-dom";

// On crée une carte d'annonce réutilisable.
function ProductCard({ annonce }) {
  // On retourne la carte de l'annonce.
  return (
    // article représente un élément indépendant de contenu.
    <article className="product-card">
      {/* On affiche l'image de l'annonce. */}
      <img src={annonce.image} alt={annonce.title} />

      {/* Cette div contient les informations de l'annonce. */}
      <div className="product-card-content">
        {/* Ligne supérieure avec catégorie et statut. */}
        <div className="product-card-top">
          {/* Catégorie de l'objet. */}
          <span className="category-pill">{annonce.category}</span>

          {/* Statut de disponibilité. */}
          <span className="status-pill">{annonce.status}</span>
        </div>

        {/* Titre de l'annonce. */}
        <h3>{annonce.title}</h3>

        {/* Prix de l'objet. */}
        <p className="product-price">{annonce.price}</p>

        {/* Ville et état de l'objet. */}
        <p className="product-meta">{annonce.city} • {annonce.condition}</p>

        {/* Bouton de détail. */}
        <Link to="/" className="btn btn-primary btn-full">Voir détails</Link>
      </div>
    </article>
  );
}

// On exporte ProductCard.
export default ProductCard;