// On importe le composant ProductCard.
import ProductCard from "../ui/ProductCard.jsx";

// On crée quelques annonces fictives pour la page d'accueil.
const annonces = [
  // Première annonce.
  {
    id: 1,
    title: "iPhone 12 en bon état",
    price: "185 000 FCFA",
    city: "Douala",
    condition: "Bon état",
    category: "Électronique",
    status: "Disponible",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80"
  },

  // Deuxième annonce.
  {
    id: 2,
    title: "Canapé confortable 3 places",
    price: "95 000 FCFA",
    city: "Yaoundé",
    condition: "Très bon état",
    category: "Maison",
    status: "Disponible",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80"
  },

  // Troisième annonce.
  {
    id: 3,
    title: "Vélo de ville solide",
    price: "60 000 FCFA",
    city: "Bafoussam",
    condition: "Bon état",
    category: "Transport",
    status: "Disponible",
    image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=900&q=80"
  }
];

// On crée la section des annonces récentes.
function RecentAnnoncesSection() {
  // On retourne la section complète.
  return (
    // Section standard de la page.
    <section className="home-section">
      {/* En-tête de section avec bouton. */}
      <div className="section-header section-header-row">
        {/* Bloc titre et description. */}
        <div>
          {/* Titre de la section. */}
          <h2>Annonces récentes</h2>

          {/* Description courte. */}
          <p>Découvrez quelques objets récemment publiés par les membres.</p>
        </div>

        {/* Bouton pour voir toutes les annonces. */}
        <button className="btn btn-outline">Voir toutes les annonces</button>
      </div>

      {/* Grille des annonces. */}
      <div className="products-grid">
        {/* On parcourt les annonces. */}
        {annonces.map((annonce) => (
          // On affiche une carte pour chaque annonce.
          <ProductCard key={annonce.id} annonce={annonce} />
        ))}
      </div>
    </section>
  );
}

// On exporte la section des annonces récentes.
export default RecentAnnoncesSection;