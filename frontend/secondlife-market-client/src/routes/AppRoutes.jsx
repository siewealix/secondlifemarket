// On importe Routes et Route pour définir les routes de l'application.
import { Routes, Route } from "react-router-dom";

// On importe la page d'accueil publique.
import HomePage from "../pages/public/HomePage.jsx";

// On importe la page de connexion.
import LoginPage from "../pages/public/LoginPage.jsx";

// On importe la page d'inscription.
import RegisterPage from "../pages/public/RegisterPage.jsx";

// On importe la page publique des annonces.
import AnnoncesPage from "../pages/public/AnnoncesPage.jsx";

// On importe la page publique du détail d'une annonce.
import AnnonceDetailsPage from "../pages/public/AnnonceDetailsPage.jsx";

// On importe la page générale du membre.
import MemberDashboardPage from "../pages/member/MemberDashboardPage.jsx";

// On importe la page d'accueil vendeur.
import SellerDashboardPage from "../pages/seller/SellerDashboardPage.jsx";

// On importe la page de création d'annonce vendeur.
import CreateAnnoncePage from "../pages/seller/CreateAnnoncePage.jsx";

// On importe la page des annonces du vendeur.
import MyAnnoncesPage from "../pages/seller/MyAnnoncesPage.jsx";

// On importe la page de modification d'annonce vendeur.
import EditAnnoncePage from "../pages/seller/EditAnnoncePage.jsx";

// On importe la page d'accueil acheteur.
import BuyerDashboardPage from "../pages/buyer/BuyerDashboardPage.jsx";

// On importe la page d'accueil administrateur.
import AdminDashboardPage from "../pages/admin/AdminDashboardPage.jsx";

// On importe la page de gestion des catégories.
import ManageCategoriesPage from "../pages/admin/ManageCategoriesPage.jsx";

// On importe la page de réexamen des annonces.
import AdminReviewAnnoncesPage from "../pages/admin/AdminReviewAnnoncesPage.jsx";

// On importe la protection des routes membres.
import PrivateRoute from "./PrivateRoute.jsx";

// On importe la protection des routes administrateur.
import AdminRoute from "./AdminRoute.jsx";

// On importe la page des demandes d'achat envoyées.
import MyPurchaseRequestsPage from "../pages/buyer/MyPurchaseRequestsPage.jsx";

// On importe la page des demandes reçues par le vendeur.
import ReceivedPurchaseRequestsPage from "../pages/seller/ReceivedPurchaseRequestsPage.jsx";

// On importe la page de conversation.
import ConversationPage from "../pages/messages/ConversationPage.jsx";

// On importe la page de gestion des signalements.
import ManageReportsPage from "../pages/admin/ManageReportsPage.jsx";

// On importe la page de gestion des membres.
import ManageUsersPage from "../pages/admin/ManageUsersPage.jsx";

// On importe la page d'abonnement vendeur.
import SellerSubscriptionPage from "../pages/seller/SellerSubscriptionPage.jsx";

import ManageSubscriptionsPage from "../pages/admin/ManageSubscriptionsPage.jsx";

// On crée le composant des routes.
function AppRoutes() {
  // On retourne toutes les routes de l'application.
  return (
    // On regroupe toutes les routes.
    <Routes>
      {/* On définit la route publique de l'accueil. */}
      <Route path="/" element={<HomePage />} />

      {/* On définit la route publique de connexion. */}
      <Route path="/connexion" element={<LoginPage />} />

      {/* On définit la route publique d'inscription. */}
      <Route path="/inscription" element={<RegisterPage />} />

      {/* On définit la route publique de la liste des annonces. */}
      <Route path="/annonces" element={<AnnoncesPage />} />

      {/* On définit la route publique du détail d'une annonce. */}
      <Route path="/annonces/:id" element={<AnnonceDetailsPage />} />

      {/* On protège toutes les routes du membre connecté. */}
      <Route element={<PrivateRoute />}>
        {/* On définit la route générale de l'espace membre. */}
        <Route path="/membre" element={<MemberDashboardPage />} />

        {/* On définit la route de l'espace vendeur. */}
        <Route path="/membre/vendeur" element={<SellerDashboardPage />} />

        {/* On définit la route de création d'annonce vendeur. */}
        <Route path="/membre/vendeur/annonces/nouvelle" element={<CreateAnnoncePage />} />

        {/* On définit la route des annonces du vendeur. */}
        <Route path="/membre/vendeur/mes-annonces" element={<MyAnnoncesPage />} />

        {/* On définit la route de modification d'annonce vendeur. */}
        <Route path="/membre/vendeur/annonces/:id/modifier" element={<EditAnnoncePage />} />

        {/* Page des demandes d'achat reçues par le vendeur. */}
        <Route path="/membre/vendeur/demandes-recues" element={<ReceivedPurchaseRequestsPage />} />

        {/* Page de gestion de l'abonnement vendeur. */}
        <Route path="/membre/vendeur/abonnement" element={<SellerSubscriptionPage />} />

        {/* On définit la route de l'espace acheteur. */}
        <Route path="/membre/acheteur" element={<BuyerDashboardPage />} />

        {/* Page des demandes d'achat envoyées par l'acheteur. */}
        <Route path="/membre/acheteur/mes-demandes" element={<MyPurchaseRequestsPage />} />

        {/* Page de conversation liée à une demande d'achat. */}
        <Route path="/messages/demande/:demandeAchatId" element={<ConversationPage />} />
      </Route>

      {/* On protège toutes les routes administrateur. */}
      <Route element={<AdminRoute />}>
        {/* On définit la route du tableau de bord admin. */}
        <Route path="/admin" element={<AdminDashboardPage />} />

        {/* On définit la route de gestion des catégories. */}
        <Route path="/admin/categories" element={<ManageCategoriesPage />} />

        {/* On définit la route des réexamens admin. */}
        <Route path="/admin/reexamens" element={<AdminReviewAnnoncesPage />} />
        
        {/* Page de gestion des signalements. */}
        <Route path="/admin/signalements" element={<ManageReportsPage />} />

        {/* Page de gestion des membres. */}
        <Route path="/admin/utilisateurs" element={<ManageUsersPage />} />

        {/* Page de gestion des abonnements. */}
        <Route path="/admin/abonnements" element={<ManageSubscriptionsPage />} />
      </Route>
    </Routes>
  );
}

// On exporte le composant des routes.
export default AppRoutes;