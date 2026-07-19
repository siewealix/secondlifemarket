// On importe la barre de navigation.
import Navbar from "../../components/layout/Navbar.jsx";

// On importe le pied de page.
import Footer from "../../components/layout/Footer.jsx";

// On importe la section principale de la page.
import HeroSection from "../../components/sections/HeroSection.jsx";

// On importe la section des catégories.
import CategoriesSection from "../../components/sections/CategoriesSection.jsx";

// On importe la section des annonces récentes.
import RecentAnnoncesSection from "../../components/sections/RecentAnnoncesSection.jsx";

// On importe la section qui explique le fonctionnement.
import HowItWorksSection from "../../components/sections/HowItWorksSection.jsx";

// On crée la page d'accueil.
function HomePage() {
  // On retourne toutes les parties de la page.
  return (
    // On regroupe les éléments sans ajouter de balise inutile.
    <>
      {/* On affiche la barre de navigation. */}
      <Navbar />

      {/* On regroupe les sections principales dans la balise main. */}
      <main className="home-page">
        {/* On affiche la grande section d'accueil. */}
        <HeroSection />

        {/* On affiche les catégories populaires. */}
        <CategoriesSection />

        {/* On affiche les annonces récentes. */}
        <RecentAnnoncesSection />

        {/* On explique le fonctionnement de la plateforme. */}
        <HowItWorksSection />
      </main>

      {/* On affiche le pied de page. */}
      <Footer />
    </>
  );
}

// On exporte la page pour l'utiliser dans les routes.
export default HomePage;