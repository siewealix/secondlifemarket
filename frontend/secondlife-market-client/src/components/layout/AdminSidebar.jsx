// On importe les outils de navigation.
import {
  Link,
  NavLink,
  useNavigate,
} from "react-router-dom";

// On importe les icônes du menu.
import {
  Bot,
  ChevronRight,
  CreditCard,
  ExternalLink,
  Flag,
  LayoutDashboard,
  LogOut,
  ShieldCheck,
  ShoppingBag,
  Tags,
  Users,
} from "lucide-react";

// On importe le hook d'authentification.
import useAuth from "../../hooks/useAuth.js";

// On crée le composant Sidebar de l'administrateur.
export default function AdminSidebar() {
  // On récupère l'administrateur et la fonction de déconnexion.
  const { user, logout } = useAuth();

  // On prépare la navigation.
  const navigate = useNavigate();

  // On crée le nom complet de l'administrateur.
  const adminName =
    `${user?.prenom || ""} ${user?.nom || ""}`.trim() ||
    "Administrateur";

  // On récupère la première lettre du prénom.
  const firstNameInitial =
    user?.prenom?.charAt(0)?.toUpperCase() || "";

  // On récupère la première lettre du nom.
  const lastNameInitial =
    user?.nom?.charAt(0)?.toUpperCase() || "";

  // On crée les initiales affichées dans l'avatar.
  const adminInitials =
    `${firstNameInitial}${lastNameInitial}` || "A";

  // Cette fonction donne une classe au lien actif.
  function getLinkClassName({ isActive }) {
    // On ajoute is-active lorsque la route correspond au lien.
    return isActive
      ? "admin-sidebar-link is-active"
      : "admin-sidebar-link";
  }

  // Cette fonction déconnecte l'administrateur.
  async function handleLogout() {
    // On essaie de déconnecter l'utilisateur.
    try {
      // On appelle la déconnexion du contexte.
      await logout();
    } finally {
      // On redirige toujours vers la connexion.
      navigate("/connexion");
    }
  }

  // On retourne le menu latéral.
  return (
    <aside className="admin-sidebar">
      {/* On affiche l'identité du site. */}
      <Link className="admin-sidebar-brand" to="/admin">
        {/* On affiche le logo. */}
        <span className="admin-sidebar-brand-icon">
          <ShoppingBag size={25} aria-hidden="true" />
        </span>

        {/* On affiche le nom de l'application. */}
        <span className="admin-sidebar-brand-text">
          <strong>SecondLife Market</strong>
          <small>Administration</small>
        </span>
      </Link>

      {/* On affiche l'administrateur connecté. */}
      <div className="admin-sidebar-user">
        {/* On affiche ses initiales. */}
        <span
          className="admin-sidebar-avatar"
          aria-hidden="true"
        >
          {adminInitials}
        </span>

        {/* On affiche ses informations. */}
        <span className="admin-sidebar-user-info">
          <strong>{adminName}</strong>

          <small>
            <ShieldCheck size={14} aria-hidden="true" />
            Administrateur
          </small>
        </span>
      </div>

      {/* On crée la navigation administrative. */}
      <nav
        className="admin-sidebar-navigation"
        aria-label="Navigation administrateur"
      >
        {/* On affiche le titre du menu. */}
        <span className="admin-sidebar-section-label">
          Menu principal
        </span>

        {/* On regroupe les liens. */}
        <div className="admin-sidebar-links">
          {/* Lien du tableau de bord. */}
          <NavLink
            to="/admin"
            end
            className={getLinkClassName}
          >
            <LayoutDashboard size={20} aria-hidden="true" />

            <span>Tableau de bord</span>

            <ChevronRight
              className="admin-sidebar-arrow"
              size={17}
              aria-hidden="true"
            />
          </NavLink>

          {/* Lien des catégories. */}
          <NavLink
            to="/admin/categories"
            className={getLinkClassName}
          >
            <Tags size={20} aria-hidden="true" />

            <span>Catégories</span>

            <ChevronRight
              className="admin-sidebar-arrow"
              size={17}
              aria-hidden="true"
            />
          </NavLink>

          {/* Lien des membres. */}
          <NavLink
            to="/admin/utilisateurs"
            className={getLinkClassName}
          >
            <Users size={20} aria-hidden="true" />

            <span>Membres</span>

            <ChevronRight
              className="admin-sidebar-arrow"
              size={17}
              aria-hidden="true"
            />
          </NavLink>

          {/* Lien des réexamens IA. */}
          <NavLink
            to="/admin/reexamens"
            className={getLinkClassName}
          >
            <Bot size={20} aria-hidden="true" />

            <span>Réexamens IA</span>

            <ChevronRight
              className="admin-sidebar-arrow"
              size={17}
              aria-hidden="true"
            />
          </NavLink>

          {/* Lien des signalements. */}
          <NavLink
            to="/admin/signalements"
            className={getLinkClassName}
          >
            <Flag size={20} aria-hidden="true" />

            <span>Signalements</span>

            <ChevronRight
              className="admin-sidebar-arrow"
              size={17}
              aria-hidden="true"
            />
          </NavLink>

          {/* Lien des abonnements. */}
          <NavLink
            to="/admin/abonnements"
            className={getLinkClassName}
          >
            <CreditCard size={20} aria-hidden="true" />

            <span>Abonnements</span>

            <ChevronRight
              className="admin-sidebar-arrow"
              size={17}
              aria-hidden="true"
            />
          </NavLink>
        </div>
      </nav>

      {/* On affiche les actions secondaires. */}
      <div className="admin-sidebar-footer">
        {/* On permet de revenir au site public. */}
        <Link className="admin-sidebar-public-link" to="/">
          <ExternalLink size={18} aria-hidden="true" />
          Voir le site
        </Link>

        {/* On permet de se déconnecter. */}
        <button
          type="button"
          className="admin-sidebar-logout"
          onClick={handleLogout}
        >
          <LogOut size={18} aria-hidden="true" />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}