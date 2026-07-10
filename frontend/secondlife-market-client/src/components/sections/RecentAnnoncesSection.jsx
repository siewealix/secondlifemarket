// On importe useEffect pour charger les annonces au démarrage.
import { useEffect } from "react";

// On importe useState pour stocker les annonces.
import { useState } from "react";

// On importe Link pour aller vers toutes les annonces.
import { Link } from "react-router-dom";

// On importe la carte d'annonce.
import ProductCard from "../ui/ProductCard.jsx";

// On importe la fonction API qui récupère les annonces.
import { getPublicAnnoncesRequest } from "../../api/annonceApi.js";

// On crée la section des annonces récentes.
function RecentAnnoncesSection() {
  // On stocke les annonces récentes.
  const [annonces, setAnnonces] = useState([]);

  // On stocke l'état de chargement.
  const [loading, setLoading] = useState(true);

  // On stocke l'erreur.
  const [error, setError] = useState("");

  // On charge les annonces au démarrage.
  useEffect(() => {
    // On crée une fonction interne.
    async function loadAnnonces() {
      // On essaie de charger les annonces.
      try {
        // On récupère les annonces depuis MySQL.
        const data = await getPublicAnnoncesRequest();

        // On garde seulement les 3 premières annonces.
        setAnnonces(data.slice(0, 3));

        // On vide l'erreur.
        setError("");
      } catch (requestError) {
        // On affiche l'erreur.
        setError(requestError.message);
      } finally {
        // On arrête le chargement.
        setLoading(false);
      }
    }

    // On lance le chargement.
    loadAnnonces();
  }, []);

  // On retourne la section.
  return (
    // Section de la page d'accueil.
    <section className="home-section">
      {/* En-tête de section. */}
      <div className="section-header">
        {/* Titre. */}
        <h2>Annonces récentes</h2>

        {/* Description. */}
        <p>Découvrez les derniers objets publiés par les membres.</p>
      </div>

      {/* Message de chargement. */}
      {loading && (
        <p className="section-loading">
          Chargement des annonces...
        </p>
      )}

      {/* Message d'erreur. */}
      {error && (
        <p className="section-error" role="alert">
          {error}
        </p>
      )}

      {/* Message si aucune annonce. */}
      {!loading && !error && annonces.length === 0 && (
        <p className="section-empty">
          Aucune annonce disponible pour le moment.
        </p>
      )}

      {/* Grille des annonces. */}
      {!loading && !error && annonces.length > 0 && (
        <div className="products-grid">
          {/* On affiche chaque annonce. */}
          {annonces.map((annonce) => (
            <ProductCard key={annonce.id} annonce={annonce} />
          ))}
        </div>
      )}

      {/* Lien vers toutes les annonces. */}
      <div className="section-action">
        <Link to="/annonces" className="btn btn-outline">
          Voir toutes les annonces
        </Link>
      </div>
    </section>
  );
}

// On exporte la section.
export default RecentAnnoncesSection;