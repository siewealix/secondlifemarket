import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/public/HomePage.jsx";
import LoginPage from "../pages/public/LoginPage.jsx";
import RegisterPage from "../pages/public/RegisterPage.jsx";
import AnnoncesPage from "../pages/public/AnnoncesPage.jsx";
import AnnonceDetailsPage from "../pages/public/AnnonceDetailsPage.jsx";
import MemberDashboardPage from "../pages/member/MemberDashboardPage.jsx";
import SellerDashboardPage from "../pages/seller/SellerDashboardPage.jsx";
import CreateAnnoncePage from "../pages/seller/CreateAnnoncePage.jsx";
import MyAnnoncesPage from "../pages/seller/MyAnnoncesPage.jsx";
import EditAnnoncePage from "../pages/seller/EditAnnoncePage.jsx";
import BuyerDashboardPage from "../pages/buyer/BuyerDashboardPage.jsx";
import AdminDashboardPage from "../pages/admin/AdminDashboardPage.jsx";
import ManageCategoriesPage from "../pages/admin/ManageCategoriesPage.jsx";
import AdminReviewAnnoncesPage from "../pages/admin/AdminReviewAnnoncesPage.jsx";
import PrivateRoute from "./PrivateRoute.jsx";
import AdminRoute from "./AdminRoute.jsx";
import MyPurchaseRequestsPage from "../pages/buyer/MyPurchaseRequestsPage.jsx";
import ReceivedPurchaseRequestsPage from "../pages/seller/ReceivedPurchaseRequestsPage.jsx";
import ConversationPage from "../pages/messages/ConversationPage.jsx";
import ConversationsPage from "../pages/messages/ConversationsPage.jsx";
import ManageReportsPage from "../pages/admin/ManageReportsPage.jsx";
import ManageUsersPage from "../pages/admin/ManageUsersPage.jsx";
import SellerSubscriptionPage from "../pages/seller/SellerSubscriptionPage.jsx";
import ManageSubscriptionsPage from "../pages/admin/ManageSubscriptionsPage.jsx";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/connexion" element={<LoginPage />} />
      <Route path="/inscription" element={<RegisterPage />} />
      <Route path="/annonces" element={<AnnoncesPage />} />
      <Route path="/annonces/:id" element={<AnnonceDetailsPage />} />

      <Route element={<PrivateRoute />}>
        <Route path="/membre" element={<MemberDashboardPage />} />
        <Route path="/membre/vendeur" element={<SellerDashboardPage />} />
        <Route path="/membre/vendeur/annonces/nouvelle" element={<CreateAnnoncePage />} />
        <Route path="/membre/vendeur/mes-annonces" element={<MyAnnoncesPage />} />
        <Route path="/membre/vendeur/annonces/:id/modifier" element={<EditAnnoncePage />} />
        <Route path="/membre/vendeur/demandes-recues" element={<ReceivedPurchaseRequestsPage />} />
        <Route path="/membre/vendeur/abonnement" element={<SellerSubscriptionPage />} />
        <Route path="/membre/acheteur" element={<BuyerDashboardPage />} />
        <Route path="/membre/acheteur/mes-demandes" element={<MyPurchaseRequestsPage />} />
        <Route path="/messagerie" element={<ConversationsPage />} />
        <Route path="/messages/demande/:demandeAchatId" element={<ConversationPage />} />
      </Route>

      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/admin/categories" element={<ManageCategoriesPage />} />
        <Route path="/admin/reexamens" element={<AdminReviewAnnoncesPage />} />
        <Route path="/admin/signalements" element={<ManageReportsPage />} />
        <Route path="/admin/utilisateurs" element={<ManageUsersPage />} />
        <Route path="/admin/abonnements" element={<ManageSubscriptionsPage />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
