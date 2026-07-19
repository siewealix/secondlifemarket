// On importe render pour afficher la page dans le faux navigateur.
import { render } from "@testing-library/react";

// On importe screen pour rechercher des éléments dans toute la page.
import { screen } from "@testing-library/react";

// On importe within pour rechercher des éléments dans une zone précise.
import { within } from "@testing-library/react";

// On importe userEvent pour simuler les actions de l'administrateur.
import userEvent from "@testing-library/user-event";

// On importe MemoryRouter pour permettre l'utilisation des liens.
import { MemoryRouter } from "react-router-dom";

// On importe le contexte d'authentification.
import { AuthContext } from "../context/AuthContext.jsx";

// On importe les fonctions API des catégories.
import {
  getAdminCategoriesRequest,
  createCategoryRequest,
  updateCategoryRequest,
  deleteCategoryRequest,
} from "../api/categorieApi.js";

// On importe la page que nous voulons tester.
import ManageCategoriesPage from "../pages/admin/ManageCategoriesPage.jsx";

// On remplace les vraies fonctions API par de fausses fonctions.
vi.mock("../api/categorieApi.js", () => ({
  // On simule la récupération des catégories.
  getAdminCategoriesRequest: vi.fn(),

  // On simule la création d'une catégorie.
  createCategoryRequest: vi.fn(),

  // On simule la modification d'une catégorie.
  updateCategoryRequest: vi.fn(),

  // On simule la désactivation d'une catégorie.
  deleteCategoryRequest: vi.fn(),
}));

// On prépare une première catégorie réutilisable.
const categorieInformatique = {
  // On définit son identifiant.
  id: 1,

  // On définit son nom.
  nom: "Informatique",

  // On définit sa description.
  description: "Ordinateurs et accessoires informatiques.",

  // On définit son icône.
  icone: "💻",

  // On indique que la catégorie est active.
  estActive: true,
};

// On prépare une deuxième catégorie réutilisable.
const categorieMaison = {
  // On définit son identifiant.
  id: 2,

  // On définit son nom.
  nom: "Maison",

  // On définit sa description.
  description: "Tables, chaises et armoires.",

  // On définit son icône.
  icone: "🏠",

  // On indique que la catégorie est inactive.
  estActive: false,
};

// On prépare les informations de l'administrateur connecté.
const authValue = {
  // On prépare l'administrateur.
  user: {
    // On définit son identifiant.
    id: 5,

    // On définit son nom.
    nom: "Admin",

    // On définit son prénom.
    prenom: "Alix",

    // On définit son adresse email.
    email: "admin@test.com",

    // On définit son rôle.
    role: "Administrateur",
  },

  // On fournit un faux token JWT.
  accessToken: "faux-token-admin",

  // On indique que l'administrateur est connecté.
  isAuthenticated: true,

  // On indique que la session n'est pas en chargement.
  loading: false,

  // On crée une fausse fonction de déconnexion.
  logout: vi.fn(),
};

// Cette fonction affiche la page avec le contexte nécessaire.
function renderManageCategoriesPage() {
  // On affiche la page dans un routeur.
  render(
    <MemoryRouter initialEntries={["/admin/categories"]}>
      <AuthContext.Provider value={authValue}>
        <ManageCategoriesPage />
      </AuthContext.Provider>
    </MemoryRouter>,
  );
}

// On regroupe tous les tests de la page.
describe("ManageCategoriesPage", () => {
  // Avant chaque test, on remet les mocks à zéro.
  beforeEach(() => {
    // On supprime les appels effectués dans les tests précédents.
    vi.clearAllMocks();
  });

  // Après chaque test, on restaure les fonctions du navigateur.
  afterEach(() => {
    // On restaure notamment window.confirm.
    vi.restoreAllMocks();
  });

  // Premier test.
  it("affiche les catégories reçues du backend", async () => {
    // =========================
    // ARRANGE : Préparation
    // =========================

    // On indique que le backend retourne deux catégories.
    getAdminCategoriesRequest.mockResolvedValue([
      categorieInformatique,
      categorieMaison,
    ]);

    // =========================
    // ACT : Action
    // =========================

    // On affiche la page.
    renderManageCategoriesPage();

    // On attend que la première catégorie soit affichée.
    const informatiqueRow = await screen.findByRole("row", {
      name: /Informatique/i,
    });

    // On recherche la ligne de la deuxième catégorie.
    const maisonRow = screen.getByRole("row", {
      name: /Maison/i,
    });

    // =========================
    // ASSERT : Vérifications
    // =========================

    // On vérifie que l'API a été appelée une seule fois.
    expect(
      getAdminCategoriesRequest,
    ).toHaveBeenCalledTimes(1);

    // On vérifie que le token administrateur a été transmis.
    expect(
      getAdminCategoriesRequest,
    ).toHaveBeenCalledWith("faux-token-admin");

    // On vérifie que le titre principal est affiché.
    expect(
      screen.getByRole("heading", {
        name: "Gestion des catégories",
      }),
    ).toBeInTheDocument();

    // On vérifie que la première ligne existe.
    expect(informatiqueRow).toBeInTheDocument();

    // On vérifie que la deuxième ligne existe.
    expect(maisonRow).toBeInTheDocument();

    // On vérifie que la description Informatique est affichée.
    expect(
      within(informatiqueRow).getByText(
        "Ordinateurs et accessoires informatiques.",
      ),
    ).toBeInTheDocument();

    // On vérifie que l'icône Informatique est affichée.
    expect(
      within(informatiqueRow).getByText("💻"),
    ).toBeInTheDocument();

    // On vérifie que la première catégorie est active.
    expect(
      within(informatiqueRow).getByText("Active"),
    ).toBeInTheDocument();

    // On vérifie que la description Maison est affichée.
    expect(
      within(maisonRow).getByText(
        "Tables, chaises et armoires.",
      ),
    ).toBeInTheDocument();

    // On vérifie que l'icône Maison est affichée.
    expect(
      within(maisonRow).getByText("🏠"),
    ).toBeInTheDocument();

    // On vérifie que la deuxième catégorie est inactive.
    expect(
      within(maisonRow).getByText("Inactive"),
    ).toBeInTheDocument();

    // On vérifie que chaque ligne possède un bouton Modifier.
    expect(
      within(informatiqueRow).getByRole("button", {
        name: "Modifier",
      }),
    ).toBeInTheDocument();

    // On vérifie que chaque ligne possède un bouton Désactiver.
    expect(
      within(informatiqueRow).getByRole("button", {
        name: "Désactiver",
      }),
    ).toBeInTheDocument();

    // On vérifie que le message de chargement a disparu.
    expect(
      screen.queryByText("Chargement..."),
    ).not.toBeInTheDocument();

    // On vérifie qu'aucune modification n'a été effectuée.
    expect(createCategoryRequest).not.toHaveBeenCalled();
    expect(updateCategoryRequest).not.toHaveBeenCalled();
    expect(deleteCategoryRequest).not.toHaveBeenCalled();
  });

  // Deuxième test.
  it("refuse la création lorsque les champs obligatoires sont vides", async () => {
    // =========================
    // ARRANGE : Préparation
    // =========================

    // On prépare l'outil qui simule l'administrateur.
    const user = userEvent.setup();

    // On indique que le backend ne retourne aucune catégorie.
    getAdminCategoriesRequest.mockResolvedValue([]);

    // On affiche la page.
    renderManageCategoriesPage();

    // On attend que le chargement soit terminé.
    await screen.findByText(
      "Aucune catégorie disponible.",
    );

    // On recherche le champ du nom.
    const nameInput = screen.getByLabelText(/^Nom/i);

    // On recherche le champ de la description.
    const descriptionInput =
      screen.getByLabelText(/^Description/i);

    // On recherche le champ de l'icône.
    const iconInput = screen.getByLabelText(/^Icône/i);

    // On recherche le bouton Ajouter.
    const addButton = screen.getByRole("button", {
      name: "Ajouter",
    });

    // =========================
    // ACT : Action
    // =========================

    // On clique sur Ajouter sans remplir les champs.
    await user.click(addButton);

    // =========================
    // ASSERT : Vérifications
    // =========================

    // On vérifie que le champ du nom est invalide.
    expect(nameInput).toBeInvalid();

    // On vérifie que le champ de description est invalide.
    expect(descriptionInput).toBeInvalid();

    // On vérifie que le champ de l'icône est invalide.
    expect(iconInput).toBeInvalid();

    // On vérifie que la création n'a pas été appelée.
    expect(createCategoryRequest).not.toHaveBeenCalled();

    // On vérifie que la modification n'a pas été appelée.
    expect(updateCategoryRequest).not.toHaveBeenCalled();

    // On vérifie que la désactivation n'a pas été appelée.
    expect(deleteCategoryRequest).not.toHaveBeenCalled();
  });

  // Troisième test.
  it("crée une nouvelle catégorie", async () => {
    // =========================
    // ARRANGE : Préparation
    // =========================

    // On prépare l'outil qui simule l'administrateur.
    const user = userEvent.setup();

    // On prépare la catégorie qui sera créée.
    const nouvelleCategorie = {
      // On définit son identifiant.
      id: 2,

      // On définit son nom.
      nom: "Maison",

      // On définit sa description.
      description: "Tables, chaises et armoires.",

      // On définit son icône.
      icone: "🏠",

      // On indique qu'elle est active.
      estActive: true,
    };

    // On retourne d'abord une seule catégorie.
    getAdminCategoriesRequest.mockResolvedValueOnce([
      categorieInformatique,
    ]);

    // Après la création, on retourne les deux catégories.
    getAdminCategoriesRequest.mockResolvedValueOnce([
      categorieInformatique,
      nouvelleCategorie,
    ]);

    // On indique que la création réussit.
    createCategoryRequest.mockResolvedValue(
      nouvelleCategorie,
    );

    // On affiche la page.
    renderManageCategoriesPage();

    // On attend que la catégorie existante soit affichée.
    await screen.findByRole("row", {
      name: /Informatique/i,
    });

    // On recherche le champ du nom.
    const nameInput = screen.getByLabelText(/^Nom/i);

    // On recherche le champ de la description.
    const descriptionInput =
      screen.getByLabelText(/^Description/i);

    // On recherche le champ de l'icône.
    const iconInput = screen.getByLabelText(/^Icône/i);

    // On recherche la case du statut actif.
    const activeCheckbox = screen.getByLabelText(
      "Catégorie active",
    );

    // On recherche le bouton Ajouter.
    const addButton = screen.getByRole("button", {
      name: "Ajouter",
    });

    // =========================
    // ACT : Actions
    // =========================

    // On saisit le nom de la catégorie.
    await user.type(nameInput, "Maison");

    // On saisit sa description.
    await user.type(
      descriptionInput,
      "Tables, chaises et armoires.",
    );

    // On saisit son icône.
    await user.type(iconInput, "🏠");

    // On clique sur le bouton Ajouter.
    await user.click(addButton);

    // On attend que la nouvelle catégorie soit affichée.
    const maisonRow = await screen.findByRole("row", {
      name: /Maison/i,
    });

    // =========================
    // ASSERT : Vérifications
    // =========================

    // On vérifie que la création a été appelée une seule fois.
    expect(createCategoryRequest).toHaveBeenCalledTimes(1);

    // On vérifie les données envoyées au backend.
    expect(createCategoryRequest).toHaveBeenCalledWith(
      {
        nom: "Maison",
        description: "Tables, chaises et armoires.",
        icone: "🏠",
        estActive: true,
      },
      "faux-token-admin",
    );

    // On vérifie que la liste a été chargée deux fois.
    expect(
      getAdminCategoriesRequest,
    ).toHaveBeenCalledTimes(2);

    // On vérifie que le message de succès est affiché.
    expect(
      screen.getByRole("status"),
    ).toHaveTextContent(
      "Catégorie créée avec succès.",
    );

    // On vérifie que la nouvelle catégorie est affichée.
    expect(maisonRow).toBeInTheDocument();

    // On vérifie que son statut est actif.
    expect(
      within(maisonRow).getByText("Active"),
    ).toBeInTheDocument();

    // On vérifie que le champ du nom a été vidé.
    expect(nameInput).toHaveValue("");

    // On vérifie que la description a été vidée.
    expect(descriptionInput).toHaveValue("");

    // On vérifie que le champ de l'icône a été vidé.
    expect(iconInput).toHaveValue("");

    // On vérifie que la case active est toujours cochée.
    expect(activeCheckbox).toBeChecked();

    // On vérifie qu'aucune modification n'a été appelée.
    expect(updateCategoryRequest).not.toHaveBeenCalled();

    // On vérifie qu'aucune désactivation n'a été appelée.
    expect(deleteCategoryRequest).not.toHaveBeenCalled();
  });

  // Quatrième test.
  it("modifie une catégorie existante", async () => {
    // =========================
    // ARRANGE : Préparation
    // =========================

    // On prépare l'outil qui simule l'administrateur.
    const user = userEvent.setup();

    // On prépare la catégorie après modification.
    const categorieModifiee = {
      // On conserve son identifiant.
      id: 1,

      // On définit son nouveau nom.
      nom: "Technologie",

      // On définit sa nouvelle description.
      description:
        "Ordinateurs, téléphones et accessoires.",

      // On définit sa nouvelle icône.
      icone: "📱",

      // On indique que la catégorie devient inactive.
      estActive: false,
    };

    // On retourne d'abord la catégorie originale.
    getAdminCategoriesRequest.mockResolvedValueOnce([
      categorieInformatique,
    ]);

    // Après la modification, on retourne la catégorie mise à jour.
    getAdminCategoriesRequest.mockResolvedValueOnce([
      categorieModifiee,
    ]);

    // On indique que la modification réussit.
    updateCategoryRequest.mockResolvedValue(
      categorieModifiee,
    );

    // On affiche la page.
    renderManageCategoriesPage();

    // On attend que la catégorie soit affichée.
    const informatiqueRow = await screen.findByRole(
      "row",
      {
        name: /Informatique/i,
      },
    );

    // On recherche le bouton Modifier de cette ligne.
    const editButton = within(
      informatiqueRow,
    ).getByRole("button", {
      name: "Modifier",
    });

    // =========================
    // ACT : Activation du mode modification
    // =========================

    // On clique sur le bouton Modifier.
    await user.click(editButton);

    // On recherche le titre du formulaire de modification.
    const editFormTitle = screen.getByRole("heading", {
      name: "Modifier une catégorie",
    });

    // On récupère le formulaire contenant ce titre.
    const categoryForm = editFormTitle.closest("form");

    // On recherche le champ du nom.
    const nameInput = screen.getByLabelText(/^Nom/i);

    // On recherche le champ de la description.
    const descriptionInput =
      screen.getByLabelText(/^Description/i);

    // On recherche le champ de l'icône.
    const iconInput = screen.getByLabelText(/^Icône/i);

    // On recherche la case du statut.
    const activeCheckbox = screen.getByLabelText(
      "Catégorie active",
    );

    // On vérifie que les anciennes valeurs ont été chargées.
    expect(nameInput).toHaveValue("Informatique");

    // On vérifie que l'ancienne description est chargée.
    expect(descriptionInput).toHaveValue(
      "Ordinateurs et accessoires informatiques.",
    );

    // On vérifie que l'ancienne icône est chargée.
    expect(iconInput).toHaveValue("💻");

    // On vérifie que la catégorie est actuellement active.
    expect(activeCheckbox).toBeChecked();

    // =========================
    // ACT : Modification des données
    // =========================

    // On vide l'ancien nom.
    await user.clear(nameInput);

    // On saisit le nouveau nom.
    await user.type(nameInput, "Technologie");

    // On vide l'ancienne description.
    await user.clear(descriptionInput);

    // On saisit la nouvelle description.
    await user.type(
      descriptionInput,
      "Ordinateurs, téléphones et accessoires.",
    );

    // On vide l'ancienne icône.
    await user.clear(iconInput);

    // On saisit la nouvelle icône.
    await user.type(iconInput, "📱");

    // On décoche la catégorie active.
    await user.click(activeCheckbox);

    // On recherche le bouton Modifier du formulaire uniquement.
    const submitEditButton = within(
      categoryForm,
    ).getByRole("button", {
      name: "Modifier",
    });

    // On envoie la modification.
    await user.click(submitEditButton);

    // On attend que la catégorie mise à jour soit affichée.
    const technologieRow = await screen.findByRole(
      "row",
      {
        name: /Technologie/i,
      },
    );

    // =========================
    // ASSERT : Vérifications
    // =========================

    // On vérifie que la modification a été appelée une fois.
    expect(updateCategoryRequest).toHaveBeenCalledTimes(1);

    // On vérifie les données envoyées au backend.
    expect(updateCategoryRequest).toHaveBeenCalledWith(
      1,
      {
        nom: "Technologie",
        description:
          "Ordinateurs, téléphones et accessoires.",
        icone: "📱",
        estActive: false,
      },
      "faux-token-admin",
    );

    // On vérifie que la liste a été rechargée.
    expect(
      getAdminCategoriesRequest,
    ).toHaveBeenCalledTimes(2);

    // On vérifie que le message de succès est affiché.
    expect(
      screen.getByRole("status"),
    ).toHaveTextContent(
      "Catégorie modifiée avec succès.",
    );

    // On vérifie que le nouveau nom est affiché.
    expect(technologieRow).toBeInTheDocument();

    // On vérifie que la nouvelle description est affichée.
    expect(
      within(technologieRow).getByText(
        "Ordinateurs, téléphones et accessoires.",
      ),
    ).toBeInTheDocument();

    // On vérifie que la nouvelle icône est affichée.
    expect(
      within(technologieRow).getByText("📱"),
    ).toBeInTheDocument();

    // On vérifie que la catégorie est maintenant inactive.
    expect(
      within(technologieRow).getByText("Inactive"),
    ).toBeInTheDocument();

    // On vérifie que le formulaire revient en mode ajout.
    expect(
      screen.getByRole("heading", {
        name: "Ajouter une catégorie",
      }),
    ).toBeInTheDocument();

    // On vérifie qu'aucune création n'a été effectuée.
    expect(createCategoryRequest).not.toHaveBeenCalled();

    // On vérifie qu'aucune désactivation n'a été effectuée.
    expect(deleteCategoryRequest).not.toHaveBeenCalled();
  });

  // Cinquième test.
  it("désactive une catégorie après confirmation", async () => {
    // =========================
    // ARRANGE : Préparation
    // =========================

    // On prépare l'outil qui simule l'administrateur.
    const user = userEvent.setup();

    // On prépare la catégorie après sa désactivation.
    const categorieDesactivee = {
      // On conserve toutes ses anciennes informations.
      ...categorieInformatique,

      // On indique qu'elle est maintenant inactive.
      estActive: false,
    };

    // On retourne d'abord la catégorie active.
    getAdminCategoriesRequest.mockResolvedValueOnce([
      categorieInformatique,
    ]);

    // Après la désactivation, on retourne la catégorie inactive.
    getAdminCategoriesRequest.mockResolvedValueOnce([
      categorieDesactivee,
    ]);

    // On indique que la désactivation réussit.
    deleteCategoryRequest.mockResolvedValue({
      message: "Catégorie désactivée.",
    });

    // On surveille la boîte de confirmation.
    const confirmMock = vi
      .spyOn(window, "confirm")
      .mockReturnValue(true);

    // On affiche la page.
    renderManageCategoriesPage();

    // On attend que la catégorie soit affichée.
    const informatiqueRow = await screen.findByRole(
      "row",
      {
        name: /Informatique/i,
      },
    );

    // On recherche son bouton Désactiver.
    const deleteButton = within(
      informatiqueRow,
    ).getByRole("button", {
      name: "Désactiver",
    });

    // =========================
    // ACT : Action
    // =========================

    // On clique sur Désactiver.
    await user.click(deleteButton);

    // On attend que le statut Inactive soit affiché.
    const inactiveStatus = await screen.findByText(
      "Inactive",
    );

    // =========================
    // ASSERT : Vérifications
    // =========================

    // On vérifie que la confirmation a été demandée.
    expect(confirmMock).toHaveBeenCalledTimes(1);

    // On vérifie le texte de confirmation.
    expect(confirmMock).toHaveBeenCalledWith(
      "Voulez-vous vraiment désactiver cette catégorie ?",
    );

    // On vérifie que la désactivation a été appelée une fois.
    expect(deleteCategoryRequest).toHaveBeenCalledTimes(1);

    // On vérifie l'identifiant et le token envoyés.
    expect(deleteCategoryRequest).toHaveBeenCalledWith(
      1,
      "faux-token-admin",
    );

    // On vérifie que les catégories ont été rechargées.
    expect(
      getAdminCategoriesRequest,
    ).toHaveBeenCalledTimes(2);

    // On vérifie que le nouveau statut est affiché.
    expect(inactiveStatus).toBeInTheDocument();

    // On vérifie que le message de succès est affiché.
    expect(
      screen.getByRole("status"),
    ).toHaveTextContent(
      "Catégorie désactivée avec succès.",
    );

    // On vérifie qu'aucune création n'a été effectuée.
    expect(createCategoryRequest).not.toHaveBeenCalled();

    // On vérifie qu'aucune modification n'a été effectuée.
    expect(updateCategoryRequest).not.toHaveBeenCalled();
  });

  // Sixième test.
  it("affiche une erreur lorsque le chargement des catégories échoue", async () => {
    // =========================
    // ARRANGE : Préparation
    // =========================

    // On prépare le message d'erreur du backend.
    const backendErrorMessage =
      "Impossible de charger les catégories administrateur.";

    // On indique que le chargement va échouer.
    getAdminCategoriesRequest.mockRejectedValue(
      new Error(backendErrorMessage),
    );

    // =========================
    // ACT : Action
    // =========================

    // On affiche la page.
    renderManageCategoriesPage();

    // On attend que la zone d'erreur soit affichée.
    const errorMessage = await screen.findByRole("alert");

    // =========================
    // ASSERT : Vérifications
    // =========================

    // On vérifie que l'API a été appelée une fois.
    expect(
      getAdminCategoriesRequest,
    ).toHaveBeenCalledTimes(1);

    // On vérifie que le token administrateur a été transmis.
    expect(
      getAdminCategoriesRequest,
    ).toHaveBeenCalledWith("faux-token-admin");

    // On vérifie que la zone d'erreur est affichée.
    expect(errorMessage).toBeInTheDocument();

    // On vérifie que le message du backend est affiché.
    expect(errorMessage).toHaveTextContent(
      backendErrorMessage,
    );

    // On vérifie que le chargement a disparu.
    expect(
      screen.queryByText("Chargement..."),
    ).not.toBeInTheDocument();

    // On vérifie qu'aucun tableau n'est affiché.
    expect(
      screen.queryByRole("table"),
    ).not.toBeInTheDocument();

    // On vérifie qu'aucune création n'a été effectuée.
    expect(createCategoryRequest).not.toHaveBeenCalled();

    // On vérifie qu'aucune modification n'a été effectuée.
    expect(updateCategoryRequest).not.toHaveBeenCalled();

    // On vérifie qu'aucune désactivation n'a été effectuée.
    expect(deleteCategoryRequest).not.toHaveBeenCalled();
  });
});