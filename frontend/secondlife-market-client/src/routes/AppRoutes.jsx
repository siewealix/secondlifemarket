// On importe Routes et Route.
import { Routes, Route } from "react-router-dom";

// On importe la page d'accueil.
import HomePage from "../pages/public/HomePage.jsx";

// On importe la page de connexion.
import LoginPage from "../pages/public/LoginPage.jsx";

// On importe la page d'inscription.
import RegisterPage from "../pages/public/RegisterPage.jsx";

// On importe la page membre.
import MemberDashboardPage from "../pages/member/MemberDashboardPage.jsx";

// On importe la page admin.
import AdminDashboardPage from "../pages/admin/AdminDashboardPage.jsx";

// On importe la protection membre.
import PrivateRoute from "./PrivateRoute.jsx";

// On importe la protection admin.
import AdminRoute from "./AdminRoute.jsx";

// On importe la page de gestion des catégories.
import ManageCategoriesPage from "../pages/admin/ManageCategoriesPage.jsx";

// On crée les routes.
function AppRoutes() {
  // On retourne toutes les routes.
  return (
    // On regroupe les routes.
    <Routes>
      {/* Route publique accueil. */}
      <Route path="/" element={<HomePage />} />

      {/* Route publique connexion. */}
      <Route path="/connexion" element={<LoginPage />} />

      {/* Route publique inscription. */}
      <Route path="/inscription" element={<RegisterPage />} />

      {/* Groupe de routes protégées membre. */}
      <Route element={<PrivateRoute />}>
        {/* Route espace membre. */}
        <Route path="/membre" element={<MemberDashboardPage />} />
      </Route>

      {/* Groupe de routes protégées admin. */}
      <Route element={<AdminRoute />}>
        {/* Route espace admin. */}
        <Route path="/admin" element={<AdminDashboardPage />} />
        {/* Route gestion catégories. */}
        <Route path="/admin/categories" element={<ManageCategoriesPage />} />
      </Route>
    </Routes>
  );
}

// On exporte les routes.
export default AppRoutes;