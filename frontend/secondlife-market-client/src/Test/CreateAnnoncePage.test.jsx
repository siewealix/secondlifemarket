// On importe render pour afficher la page.
import { render } from "@testing-library/react";

// On importe screen pour rechercher les éléments affichés.
import { screen } from "@testing-library/react";

// On importe MemoryRouter pour simuler la navigation.
// On importe Route et Routes pour créer les fausses pages du test.
import {
  MemoryRouter,
  Route,
  Routes,
} from "react-router-dom";

// On importe le contexte d'authentification.
import { AuthContext } from "../context/AuthContext.jsx";

// On importe la fonction de récupération des catégories.
import { getActiveCategoriesRequest } from "../api/categorieApi.js";

// On importe userEvent pour simuler les actions de l'utilisateur.
import userEvent from "@testing-library/user-event";

// On importe les fonctions des annonces que nous allons simuler.
import {
  createAnnonceRequest,
  uploadAnnoncePhotoRequest,
  publishAnnonceRequest,
} from "../api/annonceApi.js";

// On importe la page de création d'une annonce.
import CreateAnnoncePage from "../pages/seller/CreateAnnoncePage.jsx";

// On remplace la véritable fonction des catégories par une fausse fonction.
vi.mock("../api/categorieApi.js", () => ({
  // On crée un mock pour récupérer les catégories.
  getActiveCategoriesRequest: vi.fn(),
}));

// On remplace les véritables fonctions des annonces par de fausses fonctions.
vi.mock("../api/annonceApi.js", () => ({
  // On crée un mock pour la création d'une annonce.
  createAnnonceRequest: vi.fn(),

  // On crée un mock pour l'envoi d'une photo.
  uploadAnnoncePhotoRequest: vi.fn(),

  // On crée un mock pour la publication d'une annonce.
  publishAnnonceRequest: vi.fn(),
}));

// On regroupe les tests de la page de création d'une annonce.
describe("CreateAnnoncePage", () => {
  // Avant chaque test, on remet les mocks à zéro.
  beforeEach(() => {
    // On efface les appels effectués pendant les tests précédents.
    vi.clearAllMocks();
  });

  // Premier test.
  it("affiche le formulaire et charge les catégories", async () => {
    // =========================
    // ARRANGE : Préparation
    // =========================

    // On prépare une première catégorie.
    const categorieInformatique = {
      // On définit l'identifiant de la catégorie.
      id: 1,

      // On définit le nom de la catégorie.
      nom: "Informatique",

      // On définit son icône.
      icone: "💻",
    };

    // On prépare une deuxième catégorie.
    const categorieMaison = {
      // On définit l'identifiant de la catégorie.
      id: 2,

      // On définit le nom de la catégorie.
      nom: "Maison",

      // On définit son icône.
      icone: "🏠",
    };

    // On indique que l'API retourne les deux catégories.
    getActiveCategoriesRequest.mockResolvedValue([
      categorieInformatique,
      categorieMaison,
    ]);

    // On prépare les informations du membre connecté.
    const authValue = {
      // On prépare le membre.
      user: {
        // On définit son identifiant.
        id: 1,

        // On définit son nom.
        nom: "Siewe",

        // On définit son prénom.
        prenom: "Alix",

        // On définit son rôle.
        role: "Membre",
      },

      // On indique que le membre est authentifié.
      isAuthenticated: true,

      // On fournit un faux token d'accès.
      accessToken: "faux-token-jwt",

      // On indique que la session n'est pas en chargement.
      loading: false,

      // On crée une fausse fonction de déconnexion.
      logout: vi.fn(),
    };

    // =========================
    // ACT : Action
    // =========================

    // On affiche la page dans un routeur et dans le contexte d'authentification.
    render(
      <MemoryRouter>
        <AuthContext.Provider value={authValue}>
          <CreateAnnoncePage />
        </AuthContext.Provider>
      </MemoryRouter>,
    );

    // On attend que la catégorie Informatique soit chargée.
    const informatiqueOption = await screen.findByRole("option", {
      name: /Informatique/i,
    });

    // On recherche la deuxième catégorie.
    const maisonOption = screen.getByRole("option", {
      name: /Maison/i,
    });

    // On recherche le champ du titre.
    const titleInput = screen.getByLabelText(/^Titre de l’annonce/i);

    // On recherche le champ de la description.
    const descriptionInput = screen.getByLabelText(/^Description/i);

    // On recherche le champ du prix.
    const priceInput = screen.getByLabelText(/^Prix en FCFA/i);

    // On recherche le champ de la ville.
    const cityInput = screen.getByLabelText(/^Ville/i);

    // On recherche la liste des états.
    const conditionSelect = screen.getByLabelText(/^État de l’objet/i);

    // On recherche la liste des catégories.
    const categorySelect = screen.getByLabelText(/^Catégorie/i);

    // On recherche le champ des photos.
    const photosInput = screen.getByLabelText(/^Photos de l’annonce/i);

    // On recherche le bouton de publication.
    const submitButton = screen.getByRole("button", {
      name: /Publier l’annonce/i,
    });

    // =========================
    // ASSERT : Vérifications
    // =========================

    // On vérifie que l'API des catégories a été appelée une seule fois.
    expect(getActiveCategoriesRequest).toHaveBeenCalledTimes(1);

    // On vérifie que le titre principal de la page est affiché.
    expect(
      screen.getByRole("heading", {
        name: "Publier une annonce",
      }),
    ).toBeInTheDocument();

    // On vérifie que le champ du titre est affiché.
    expect(titleInput).toBeInTheDocument();

    // On vérifie que le champ du titre est vide.
    expect(titleInput).toHaveValue("");

    // On vérifie que le champ de la description est affiché.
    expect(descriptionInput).toBeInTheDocument();

    // On vérifie que le champ de la description est vide.
    expect(descriptionInput).toHaveValue("");

    // On vérifie que le champ du prix est affiché.
    expect(priceInput).toBeInTheDocument();

    // On vérifie que le champ du prix est vide.
    expect(priceInput).toHaveValue(null);

    // On vérifie que le champ de la ville est affiché.
    expect(cityInput).toBeInTheDocument();

    // On vérifie que le champ de la ville est vide.
    expect(cityInput).toHaveValue("");

    // On vérifie qu'aucun état n'est encore sélectionné.
    expect(conditionSelect).toHaveValue("");

    // On vérifie qu'aucune catégorie n'est encore sélectionnée.
    expect(categorySelect).toHaveValue("");

    // On vérifie que la catégorie Informatique est affichée.
    expect(informatiqueOption).toBeInTheDocument();

    // On vérifie que la catégorie Maison est affichée.
    expect(maisonOption).toBeInTheDocument();

    // On vérifie que le champ des photos accepte plusieurs fichiers.
    expect(photosInput).toHaveAttribute("multiple");

    // On vérifie que le champ accepte les formats d'image autorisés.
    expect(photosInput).toHaveAttribute(
      "accept",
      "image/jpeg,image/png,image/webp",
    );

    // On vérifie que le bouton de publication est affiché.
    expect(submitButton).toBeInTheDocument();

    // On vérifie qu'aucune annonce n'a été créée.
    expect(createAnnonceRequest).not.toHaveBeenCalled();

    // On vérifie qu'aucune photo n'a été envoyée.
    expect(uploadAnnoncePhotoRequest).not.toHaveBeenCalled();

    // On vérifie qu'aucune annonce n'a été publiée.
    expect(publishAnnonceRequest).not.toHaveBeenCalled();
  });

    // Deuxième test.
  it("refuse la publication lorsque le formulaire est incomplet", async () => {
    // =========================
    // ARRANGE : Préparation
    // =========================

    // On prépare l'outil qui simule les actions de l'utilisateur.
    const user = userEvent.setup();

    // On prépare une catégorie disponible.
    const categorieInformatique = {
      // On définit l'identifiant de la catégorie.
      id: 1,

      // On définit le nom de la catégorie.
      nom: "Informatique",

      // On définit son icône.
      icone: "💻",
    };

    // On indique que l'API retourne la catégorie préparée.
    getActiveCategoriesRequest.mockResolvedValue([
      categorieInformatique,
    ]);

    // On prépare les informations du membre connecté.
    const authValue = {
      // On prépare le membre.
      user: {
        // On définit son identifiant.
        id: 1,

        // On définit son nom.
        nom: "Siewe",

        // On définit son prénom.
        prenom: "Alix",

        // On définit son rôle.
        role: "Membre",
      },

      // On indique que le membre est authentifié.
      isAuthenticated: true,

      // On fournit un faux token d'accès.
      accessToken: "faux-token-jwt",

      // On indique que la session n'est pas en chargement.
      loading: false,

      // On crée une fausse fonction de déconnexion.
      logout: vi.fn(),
    };

    // On affiche la page dans le routeur.
    render(
      <MemoryRouter>
        <AuthContext.Provider value={authValue}>
          <CreateAnnoncePage />
        </AuthContext.Provider>
      </MemoryRouter>,
    );

    // On attend que les catégories soient chargées.
    await screen.findByRole("option", {
      name: /Informatique/i,
    });

    // On recherche le champ du titre.
    const titleInput = screen.getByLabelText(/^Titre de l’annonce/i);

    // On recherche le champ de la description.
    const descriptionInput = screen.getByLabelText(/^Description/i);

    // On recherche le champ du prix.
    const priceInput = screen.getByLabelText(/^Prix en FCFA/i);

    // On recherche le champ de la ville.
    const cityInput = screen.getByLabelText(/^Ville/i);

    // On recherche la liste des états.
    const conditionSelect = screen.getByLabelText(/^État de l’objet/i);

    // On recherche la liste des catégories.
    const categorySelect = screen.getByLabelText(/^Catégorie/i);

    // On recherche le bouton de publication.
    const submitButton = screen.getByRole("button", {
      name: /Publier l’annonce/i,
    });

    // =========================
    // ACT : Action
    // =========================

    // On clique sur le bouton sans remplir le formulaire.
    await user.click(submitButton);

    // =========================
    // ASSERT : Vérifications
    // =========================

    // On vérifie que le champ du titre est invalide.
    expect(titleInput).toBeInvalid();

    // On vérifie que le champ de la description est invalide.
    expect(descriptionInput).toBeInvalid();

    // On vérifie que le champ du prix est invalide.
    expect(priceInput).toBeInvalid();

    // On vérifie que le champ de la ville est invalide.
    expect(cityInput).toBeInvalid();

    // On vérifie que la sélection de l'état est invalide.
    expect(conditionSelect).toBeInvalid();

    // On vérifie que la sélection de la catégorie est invalide.
    expect(categorySelect).toBeInvalid();

    // On vérifie que la création de l'annonce n'a pas été appelée.
    expect(createAnnonceRequest).not.toHaveBeenCalled();

    // On vérifie qu'aucune photo n'a été envoyée.
    expect(uploadAnnoncePhotoRequest).not.toHaveBeenCalled();

    // On vérifie que la publication n'a pas été appelée.
    expect(publishAnnonceRequest).not.toHaveBeenCalled();
  });

    // Troisième test.
  it("refuse la publication lorsqu'aucune photo n'est ajoutée", async () => {
    // =========================
    // ARRANGE : Préparation
    // =========================

    // On prépare l'outil qui simule les actions de l'utilisateur.
    const user = userEvent.setup();

    // On prépare une catégorie disponible.
    const categorieInformatique = {
      // On définit l'identifiant de la catégorie.
      id: 1,

      // On définit le nom de la catégorie.
      nom: "Informatique",

      // On définit l'icône de la catégorie.
      icone: "💻",
    };

    // On indique que l'API retourne la catégorie préparée.
    getActiveCategoriesRequest.mockResolvedValue([
      categorieInformatique,
    ]);

    // On prépare les informations du membre connecté.
    const authValue = {
      // On prépare le membre.
      user: {
        // On définit son identifiant.
        id: 1,

        // On définit son nom.
        nom: "Siewe",

        // On définit son prénom.
        prenom: "Alix",

        // On définit son rôle.
        role: "Membre",
      },

      // On indique que le membre est authentifié.
      isAuthenticated: true,

      // On fournit un faux token d'accès.
      accessToken: "faux-token-jwt",

      // On indique que la session n'est pas en chargement.
      loading: false,

      // On crée une fausse fonction de déconnexion.
      logout: vi.fn(),
    };

    // On affiche la page dans un routeur.
    render(
      <MemoryRouter>
        <AuthContext.Provider value={authValue}>
          <CreateAnnoncePage />
        </AuthContext.Provider>
      </MemoryRouter>,
    );

    // On attend que la catégorie soit chargée.
    await screen.findByRole("option", {
      name: /Informatique/i,
    });

    // On recherche le champ du titre.
    const titleInput = screen.getByLabelText(/^Titre de l’annonce/i);

    // On recherche le champ de la description.
    const descriptionInput = screen.getByLabelText(/^Description/i);

    // On recherche le champ du prix.
    const priceInput = screen.getByLabelText(/^Prix en FCFA/i);

    // On recherche le champ de la ville.
    const cityInput = screen.getByLabelText(/^Ville/i);

    // On recherche la liste des états.
    const conditionSelect = screen.getByLabelText(/^État de l’objet/i);

    // On recherche la liste des catégories.
    const categorySelect = screen.getByLabelText(/^Catégorie/i);

    // On recherche le champ des photos.
    const photosInput = screen.getByLabelText(/^Photos de l’annonce/i);

    // On recherche le bouton de publication.
    const submitButton = screen.getByRole("button", {
      name: /Publier l’annonce/i,
    });

    // =========================
    // ACT : Action
    // =========================

    // On saisit le titre de l'annonce.
    await user.type(titleInput, "Ordinateur portable Lenovo");

    // On saisit la description de l'annonce.
    await user.type(
      descriptionInput,
      "Ordinateur en bon état avec son chargeur.",
    );

    // On saisit le prix de l'annonce.
    await user.type(priceInput, "250000");

    // On saisit la ville.
    await user.type(cityInput, "Douala");

    // On sélectionne l'état de l'objet.
    await user.selectOptions(conditionSelect, "Bon état");

    // On sélectionne la catégorie Informatique.
    await user.selectOptions(categorySelect, "1");

    // On clique sur le bouton sans ajouter de photo.
    await user.click(submitButton);

    // =========================
    // ASSERT : Vérifications
    // =========================

    // On vérifie que le champ des photos est toujours vide.
    expect(photosInput.files).toHaveLength(0);

    // On recherche le message d'erreur affiché.
    const errorMessage = await screen.findByRole("alert");

    // On vérifie que le bon message d'erreur est affiché.
    expect(errorMessage).toHaveTextContent(
      "Vous devez ajouter au moins une photo pour publier une annonce.",
    );

    // On vérifie que l'annonce n'a pas été créée.
    expect(createAnnonceRequest).not.toHaveBeenCalled();

    // On vérifie qu'aucune photo n'a été envoyée.
    expect(uploadAnnoncePhotoRequest).not.toHaveBeenCalled();

    // On vérifie que l'annonce n'a pas été publiée.
    expect(publishAnnonceRequest).not.toHaveBeenCalled();
  });

    // Quatrième test.
  it("refuse la sélection de plus de cinq photos", async () => {
    // =========================
    // ARRANGE : Préparation
    // =========================

    // On prépare l'outil qui simule les actions de l'utilisateur.
    const user = userEvent.setup();

    // On prépare une catégorie disponible.
    const categorieInformatique = {
      // On définit l'identifiant de la catégorie.
      id: 1,

      // On définit le nom de la catégorie.
      nom: "Informatique",

      // On définit l'icône de la catégorie.
      icone: "💻",
    };

    // On indique que l'API retourne la catégorie préparée.
    getActiveCategoriesRequest.mockResolvedValue([
      categorieInformatique,
    ]);

    // On prépare les informations du membre connecté.
    const authValue = {
      // On prépare le membre.
      user: {
        // On définit son identifiant.
        id: 1,

        // On définit son nom.
        nom: "Siewe",

        // On définit son prénom.
        prenom: "Alix",

        // On définit son rôle.
        role: "Membre",
      },

      // On indique que le membre est authentifié.
      isAuthenticated: true,

      // On fournit un faux token d'accès.
      accessToken: "faux-token-jwt",

      // On indique que la session n'est pas en chargement.
      loading: false,

      // On crée une fausse fonction de déconnexion.
      logout: vi.fn(),
    };

    // On prépare une première fausse photo.
    const photo1 = new File(
      ["contenu-photo-1"],
      "photo1.png",
      {
        type: "image/png",
      },
    );

    // On prépare une deuxième fausse photo.
    const photo2 = new File(
      ["contenu-photo-2"],
      "photo2.png",
      {
        type: "image/png",
      },
    );

    // On prépare une troisième fausse photo.
    const photo3 = new File(
      ["contenu-photo-3"],
      "photo3.png",
      {
        type: "image/png",
      },
    );

    // On prépare une quatrième fausse photo.
    const photo4 = new File(
      ["contenu-photo-4"],
      "photo4.png",
      {
        type: "image/png",
      },
    );

    // On prépare une cinquième fausse photo.
    const photo5 = new File(
      ["contenu-photo-5"],
      "photo5.png",
      {
        type: "image/png",
      },
    );

    // On prépare une sixième fausse photo.
    const photo6 = new File(
      ["contenu-photo-6"],
      "photo6.png",
      {
        type: "image/png",
      },
    );

    // On affiche la page dans un routeur.
    render(
      <MemoryRouter>
        <AuthContext.Provider value={authValue}>
          <CreateAnnoncePage />
        </AuthContext.Provider>
      </MemoryRouter>,
    );

    // On attend que la catégorie soit chargée.
    await screen.findByRole("option", {
      name: /Informatique/i,
    });

    // On recherche le champ permettant de sélectionner les photos.
    const photosInput = screen.getByLabelText(
      /^Photos de l’annonce/i,
    );

    // =========================
    // ACT : Action
    // =========================

    // On essaie de sélectionner six photos.
    await user.upload(photosInput, [
      photo1,
      photo2,
      photo3,
      photo4,
      photo5,
      photo6,
    ]);

    // =========================
    // ASSERT : Vérifications
    // =========================

    // On recherche le message d'erreur affiché.
    const errorMessage = await screen.findByRole("alert");

    // On vérifie que le message indique la limite de cinq photos.
    expect(errorMessage).toHaveTextContent(
      "Vous pouvez ajouter au maximum 5 photos.",
    );

    // On vérifie que la première photo n'est pas affichée dans la liste.
    expect(
      screen.queryByText("photo1.png"),
    ).not.toBeInTheDocument();

    // On vérifie que la sixième photo n'est pas affichée dans la liste.
    expect(
      screen.queryByText("photo6.png"),
    ).not.toBeInTheDocument();

    // On vérifie que l'annonce n'a pas été créée.
    expect(createAnnonceRequest).not.toHaveBeenCalled();

    // On vérifie qu'aucune photo n'a été envoyée au backend.
    expect(uploadAnnoncePhotoRequest).not.toHaveBeenCalled();

    // On vérifie que l'annonce n'a pas été publiée.
    expect(publishAnnonceRequest).not.toHaveBeenCalled();
  });

    // Cinquième test.
  it("crée, ajoute une photo et publie une annonce disponible", async () => {
    // =========================
    // ARRANGE : Préparation
    // =========================

    // On prépare l'outil qui simule les actions de l'utilisateur.
    const user = userEvent.setup();

    // On prépare une catégorie disponible.
    const categorieInformatique = {
      // On définit l'identifiant de la catégorie.
      id: 1,

      // On définit le nom de la catégorie.
      nom: "Informatique",

      // On définit l'icône de la catégorie.
      icone: "💻",
    };

    // On indique que l'API retourne la catégorie préparée.
    getActiveCategoriesRequest.mockResolvedValue([
      categorieInformatique,
    ]);

    // On prépare la réponse retournée après la création de l'annonce.
    const createdAnnonce = {
      // On définit l'identifiant de l'annonce créée.
      id: 25,

      // On définit son statut initial.
      statut: "En création",
    };

    // On indique que la création de l'annonce réussit.
    createAnnonceRequest.mockResolvedValue(createdAnnonce);

    // On indique que l'envoi de la photo réussit.
    uploadAnnoncePhotoRequest.mockResolvedValue({
      // On définit l'identifiant de la photo.
      id: 10,

      // On définit son adresse.
      url: "/uploads/annonces/ordinateur.png",
    });

    // On prépare la réponse obtenue après la publication.
    const publishedAnnonce = {
      // On conserve l'identifiant de l'annonce.
      id: 25,

      // On indique que l'annonce est disponible.
      statut: "Disponible",
    };

    // On indique que la publication réussit.
    publishAnnonceRequest.mockResolvedValue(publishedAnnonce);

    // On prépare les informations du membre connecté.
    const authValue = {
      // On prépare le membre.
      user: {
        // On définit son identifiant.
        id: 1,

        // On définit son nom.
        nom: "Siewe",

        // On définit son prénom.
        prenom: "Alix",

        // On définit son rôle.
        role: "Membre",
      },

      // On indique que le membre est authentifié.
      isAuthenticated: true,

      // On fournit un faux token d'accès.
      accessToken: "faux-token-jwt",

      // On indique que la session n'est pas en chargement.
      loading: false,

      // On crée une fausse fonction de déconnexion.
      logout: vi.fn(),
    };

    // On prépare une fausse photo.
    const photo = new File(
      // On prépare le contenu du fichier.
      ["contenu-de-la-photo"],

      // On définit le nom du fichier.
      "ordinateur.png",

      // On définit le type du fichier.
      {
        type: "image/png",
      },
    );

    // On affiche la page avec les routes nécessaires.
    render(
      <MemoryRouter
        initialEntries={[
          "/membre/vendeur/annonces/nouvelle",
        ]}
      >
        <AuthContext.Provider value={authValue}>
          <Routes>
            <Route
              path="/membre/vendeur/annonces/nouvelle"
              element={<CreateAnnoncePage />}
            />

            <Route
              path="/annonces/:id"
              element={<h1>Détail de l’annonce publiée</h1>}
            />
          </Routes>
        </AuthContext.Provider>
      </MemoryRouter>,
    );

    // On attend que la catégorie soit chargée.
    await screen.findByRole("option", {
      name: /Informatique/i,
    });

    // On recherche le champ du titre.
    const titleInput = screen.getByLabelText(
      /^Titre de l’annonce/i,
    );

    // On recherche le champ de la description.
    const descriptionInput = screen.getByLabelText(
      /^Description/i,
    );

    // On recherche le champ du prix.
    const priceInput = screen.getByLabelText(
      /^Prix en FCFA/i,
    );

    // On recherche le champ de la ville.
    const cityInput = screen.getByLabelText(/^Ville/i);

    // On recherche la liste des états.
    const conditionSelect = screen.getByLabelText(
      /^État de l’objet/i,
    );

    // On recherche la liste des catégories.
    const categorySelect = screen.getByLabelText(
      /^Catégorie/i,
    );

    // On recherche le champ des photos.
    const photosInput = screen.getByLabelText(
      /^Photos de l’annonce/i,
    );

    // On recherche le bouton de publication.
    const submitButton = screen.getByRole("button", {
      name: /Publier l’annonce/i,
    });

    // =========================
    // ACT : Actions
    // =========================

    // On saisit le titre de l'annonce.
    await user.type(
      titleInput,
      "Ordinateur portable Lenovo",
    );

    // On saisit la description de l'annonce.
    await user.type(
      descriptionInput,
      "Ordinateur en bon état avec son chargeur.",
    );

    // On saisit le prix de l'annonce.
    await user.type(priceInput, "250000");

    // On saisit la ville.
    await user.type(cityInput, "Douala");

    // On sélectionne l'état de l'objet.
    await user.selectOptions(
      conditionSelect,
      "Bon état",
    );

    // On sélectionne la catégorie Informatique.
    await user.selectOptions(categorySelect, "1");

    // On ajoute la photo.
    await user.upload(photosInput, photo);

    // On clique sur le bouton de publication.
    await user.click(submitButton);

    // =========================
    // ASSERT : Vérifications
    // =========================

    // On vérifie que l'API des catégories a été appelée.
    expect(
      getActiveCategoriesRequest,
    ).toHaveBeenCalledTimes(1);

    // On vérifie que la création a été appelée une seule fois.
    expect(createAnnonceRequest).toHaveBeenCalledTimes(1);

    // On vérifie que les bonnes données ont été envoyées.
    expect(createAnnonceRequest).toHaveBeenCalledWith(
      {
        titre: "Ordinateur portable Lenovo",
        description:
          "Ordinateur en bon état avec son chargeur.",
        prix: 250000,
        ville: "Douala",
        etatObjet: "Bon état",
        categorieId: 1,
      },
      "faux-token-jwt",
    );

    // On vérifie que la photo a été envoyée une seule fois.
    expect(
      uploadAnnoncePhotoRequest,
    ).toHaveBeenCalledTimes(1);

    // On vérifie que la photo a été associée à la bonne annonce.
    expect(
      uploadAnnoncePhotoRequest,
    ).toHaveBeenCalledWith(
      25,
      photo,
      "faux-token-jwt",
    );

    // On vérifie que la publication a été appelée une seule fois.
    expect(
      publishAnnonceRequest,
    ).toHaveBeenCalledTimes(1);

    // On vérifie que la bonne annonce a été publiée.
    expect(
      publishAnnonceRequest,
    ).toHaveBeenCalledWith(
      25,
      "faux-token-jwt",
    );

    // On vérifie que la page de détail est affichée.
    expect(
      await screen.findByRole("heading", {
        name: "Détail de l’annonce publiée",
      }),
    ).toBeInTheDocument();
  });

    // Sixième test.
  it("redirige vers les annonces du membre lorsque l'annonce est en réexamen administratif", async () => {
    // =========================
    // ARRANGE : Préparation
    // =========================

    // On prépare l'outil qui simule les actions de l'utilisateur.
    const user = userEvent.setup();

    // On surveille la fonction alert du navigateur.
    const alertMock = vi
      .spyOn(window, "alert")
      .mockImplementation(() => {});

    // On prépare une catégorie disponible.
    const categorieInformatique = {
      // On définit l'identifiant de la catégorie.
      id: 1,

      // On définit le nom de la catégorie.
      nom: "Informatique",

      // On définit l'icône de la catégorie.
      icone: "💻",
    };

    // On indique que l'API retourne la catégorie préparée.
    getActiveCategoriesRequest.mockResolvedValue([
      categorieInformatique,
    ]);

    // On prépare la réponse de création de l'annonce.
    const createdAnnonce = {
      // On définit l'identifiant de l'annonce créée.
      id: 26,

      // On définit son statut initial.
      statut: "En création",
    };

    // On indique que la création de l'annonce réussit.
    createAnnonceRequest.mockResolvedValue(createdAnnonce);

    // On indique que l'envoi de la photo réussit.
    uploadAnnoncePhotoRequest.mockResolvedValue({
      // On définit l'identifiant de la photo.
      id: 11,

      // On définit l'adresse de la photo.
      url: "/uploads/annonces/telephone.png",
    });

    // On prépare la réponse obtenue après l'analyse de l'annonce.
    const publishedAnnonce = {
      // On conserve l'identifiant de l'annonce.
      id: 26,

      // On indique que l'annonce doit être réexaminée.
      statut: "En réexamen admin",
    };

    // On indique que la publication retourne ce statut.
    publishAnnonceRequest.mockResolvedValue(publishedAnnonce);

    // On prépare les informations du membre connecté.
    const authValue = {
      // On prépare le membre.
      user: {
        // On définit son identifiant.
        id: 1,

        // On définit son nom.
        nom: "Siewe",

        // On définit son prénom.
        prenom: "Alix",

        // On définit son rôle.
        role: "Membre",
      },

      // On indique que le membre est authentifié.
      isAuthenticated: true,

      // On fournit un faux token d'accès.
      accessToken: "faux-token-jwt",

      // On indique que la session n'est pas en chargement.
      loading: false,

      // On crée une fausse fonction de déconnexion.
      logout: vi.fn(),
    };

    // On prépare une fausse photo.
    const photo = new File(
      // On prépare le contenu du fichier.
      ["contenu-de-la-photo"],

      // On définit le nom du fichier.
      "telephone.png",

      // On définit le type du fichier.
      {
        type: "image/png",
      },
    );

    // On affiche la page avec les routes nécessaires.
    render(
      <MemoryRouter
        initialEntries={[
          "/membre/vendeur/annonces/nouvelle",
        ]}
      >
        <AuthContext.Provider value={authValue}>
          <Routes>
            <Route
              path="/membre/vendeur/annonces/nouvelle"
              element={<CreateAnnoncePage />}
            />

            <Route
              path="/membre/vendeur/mes-annonces"
              element={<h1>Mes annonces</h1>}
            />
          </Routes>
        </AuthContext.Provider>
      </MemoryRouter>,
    );

    // On attend que la catégorie soit chargée.
    await screen.findByRole("option", {
      name: /Informatique/i,
    });

    // On recherche le champ du titre.
    const titleInput = screen.getByLabelText(
      /^Titre de l’annonce/i,
    );

    // On recherche le champ de la description.
    const descriptionInput = screen.getByLabelText(
      /^Description/i,
    );

    // On recherche le champ du prix.
    const priceInput = screen.getByLabelText(
      /^Prix en FCFA/i,
    );

    // On recherche le champ de la ville.
    const cityInput = screen.getByLabelText(/^Ville/i);

    // On recherche la liste des états.
    const conditionSelect = screen.getByLabelText(
      /^État de l’objet/i,
    );

    // On recherche la liste des catégories.
    const categorySelect = screen.getByLabelText(
      /^Catégorie/i,
    );

    // On recherche le champ des photos.
    const photosInput = screen.getByLabelText(
      /^Photos de l’annonce/i,
    );

    // On recherche le bouton de publication.
    const submitButton = screen.getByRole("button", {
      name: /Publier l’annonce/i,
    });

    // =========================
    // ACT : Actions
    // =========================

    // On saisit le titre de l'annonce.
    await user.type(
      titleInput,
      "Téléphone Samsung Galaxy",
    );

    // On saisit la description de l'annonce.
    await user.type(
      descriptionInput,
      "Téléphone fonctionnel vendu avec son chargeur.",
    );

    // On saisit le prix de l'annonce.
    await user.type(priceInput, "120000");

    // On saisit la ville.
    await user.type(cityInput, "Yaoundé");

    // On sélectionne l'état de l'objet.
    await user.selectOptions(
      conditionSelect,
      "Bon état",
    );

    // On sélectionne la catégorie Informatique.
    await user.selectOptions(categorySelect, "1");

    // On ajoute une photo.
    await user.upload(photosInput, photo);

    // On clique sur le bouton de publication.
    await user.click(submitButton);

    // =========================
    // ASSERT : Vérifications
    // =========================

    // On vérifie que la création de l'annonce a été appelée.
    expect(createAnnonceRequest).toHaveBeenCalledTimes(1);

    // On vérifie les données envoyées pour créer l'annonce.
    expect(createAnnonceRequest).toHaveBeenCalledWith(
      {
        titre: "Téléphone Samsung Galaxy",
        description:
          "Téléphone fonctionnel vendu avec son chargeur.",
        prix: 120000,
        ville: "Yaoundé",
        etatObjet: "Bon état",
        categorieId: 1,
      },
      "faux-token-jwt",
    );

    // On vérifie que la photo a été envoyée.
    expect(
      uploadAnnoncePhotoRequest,
    ).toHaveBeenCalledTimes(1);

    // On vérifie que la photo est associée à la bonne annonce.
    expect(
      uploadAnnoncePhotoRequest,
    ).toHaveBeenCalledWith(
      26,
      photo,
      "faux-token-jwt",
    );

    // On vérifie que la publication a été demandée.
    expect(
      publishAnnonceRequest,
    ).toHaveBeenCalledTimes(1);

    // On vérifie que la bonne annonce a été publiée.
    expect(
      publishAnnonceRequest,
    ).toHaveBeenCalledWith(
      26,
      "faux-token-jwt",
    );

    // On vérifie que le message d'information est affiché.
    expect(alertMock).toHaveBeenCalledTimes(1);

    // On vérifie le contenu du message d'information.
    expect(alertMock).toHaveBeenCalledWith(
      "Votre annonce a été envoyée à l'administrateur pour réexamen.",
    );

    // On vérifie que la page des annonces du membre est affichée.
    expect(
      await screen.findByRole("heading", {
        name: "Mes annonces",
      }),
    ).toBeInTheDocument();

    // On restaure le fonctionnement normal de window.alert.
    alertMock.mockRestore();
  });


});