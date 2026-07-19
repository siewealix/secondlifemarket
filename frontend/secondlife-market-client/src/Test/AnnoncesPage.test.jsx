// On importe render pour afficher les composants.
// On importe screen pour rechercher les éléments dans toute la page.
// On importe within pour rechercher un élément dans une zone précise.
import {
  render,
  screen,
  within,
} from "@testing-library/react";

// On importe userEvent pour simuler la saisie de l'utilisateur.
import userEvent from "@testing-library/user-event";

// On importe MemoryRouter pour permettre la navigation et les liens.
import { MemoryRouter } from "react-router-dom";

// On importe le contexte d'authentification utilisé par la barre de navigation.
import { AuthContext } from "../context/AuthContext.jsx";

// On importe la fonction API que nous allons simuler.
import { getPublicAnnoncesRequest } from "../api/annonceApi.js";

// On importe la page des annonces à tester.
import AnnoncesPage from "../pages/public/AnnoncesPage.jsx";

// On remplace les vraies fonctions du fichier annonceApi par de fausses fonctions.
vi.mock("../api/annonceApi.js", () => ({
  // On transforme la récupération des annonces en fausse fonction.
  getPublicAnnoncesRequest: vi.fn(),

  // On simule la fonction utilisée pour construire l'adresse des photos.
  getPhotoUrl: vi.fn(() => ""),
}));

// On regroupe les tests de la page des annonces.
describe("AnnoncesPage", () => {
  // Avant chaque test, on remet les fausses fonctions à zéro.
  beforeEach(() => {
    // On supprime les résultats et les appels des tests précédents.
    vi.clearAllMocks();
  });

  // Premier test.
  it("affiche le chargement pendant la récupération des annonces", () => {
    // =========================
    // ARRANGE : Préparation
    // =========================

    // On crée une promesse qui reste en attente.
    const pendingPromise = new Promise(() => {});

    // On indique que l'appel API ne se termine pas immédiatement.
    getPublicAnnoncesRequest.mockReturnValue(pendingPromise);

    // On prépare un visiteur non connecté.
    const authValue = {
      // Aucun utilisateur n'est connecté.
      user: null,

      // Le visiteur n'est pas authentifié.
      isAuthenticated: false,

      // La session n'est pas en cours de chargement.
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
          <AnnoncesPage />
        </AuthContext.Provider>
      </MemoryRouter>,
    );

    // On recherche la zone de chargement.
    const loadingState = screen.getByRole("status");

    // =========================
    // ASSERT : Vérifications
    // =========================

    // On vérifie que la fonction API a été appelée une seule fois.
    expect(getPublicAnnoncesRequest).toHaveBeenCalledTimes(1);

    // On vérifie que la zone de chargement est affichée.
    expect(loadingState).toBeInTheDocument();

    // On vérifie que le titre du chargement est affiché.
    expect(
      screen.getByText("Chargement des annonces"),
    ).toBeInTheDocument();

    // On vérifie que l'explication du chargement est affichée.
    expect(
      screen.getByText(
        "Nous récupérons les objets disponibles.",
      ),
    ).toBeInTheDocument();
  });

  // Deuxième test.
  it("affiche les annonces reçues depuis le backend", async () => {
    // =========================
    // ARRANGE : Préparation
    // =========================

    // On prépare une première fausse annonce.
    const premiereAnnonce = {
      // On définit l'identifiant de l'annonce.
      id: 1,

      // On définit son titre.
      titre: "Ordinateur portable Lenovo",

      // On définit sa description.
      description: "Ordinateur en bon état avec son chargeur.",

      // On définit son prix.
      prix: 250000,

      // On définit sa ville.
      ville: "Douala",

      // On définit l'état de l'objet.
      etatObjet: "Bon état",

      // On définit l'identifiant de sa catégorie.
      categorieId: 1,

      // On définit le nom de sa catégorie.
      nomCategorie: "Informatique",

      // On définit sa date de publication.
      datePublication: "2026-07-18T10:00:00",

      // On indique qu'aucune photo principale n'est disponible.
      photoPrincipaleUrl: "",
    };

    // On prépare une deuxième fausse annonce.
    const deuxiemeAnnonce = {
      // On définit l'identifiant de l'annonce.
      id: 2,

      // On définit son titre.
      titre: "Table de bureau en bois",

      // On définit sa description.
      description: "Table solide adaptée au travail à domicile.",

      // On définit son prix.
      prix: 45000,

      // On définit sa ville.
      ville: "Yaoundé",

      // On définit l'état de l'objet.
      etatObjet: "Très bon état",

      // On définit l'identifiant de sa catégorie.
      categorieId: 2,

      // On définit le nom de sa catégorie.
      nomCategorie: "Maison",

      // On définit sa date de publication.
      datePublication: "2026-07-17T09:00:00",

      // On indique qu'aucune photo principale n'est disponible.
      photoPrincipaleUrl: "",
    };

    // On indique que l'API retourne les deux annonces préparées.
    getPublicAnnoncesRequest.mockResolvedValue([
      premiereAnnonce,
      deuxiemeAnnonce,
    ]);

    // On prépare un visiteur non connecté.
    const authValue = {
      // Aucun utilisateur n'est connecté.
      user: null,

      // Le visiteur n'est pas authentifié.
      isAuthenticated: false,

      // La session n'est pas en cours de chargement.
      loading: false,

      // On crée une fausse fonction de déconnexion.
      logout: vi.fn(),
    };

    // =========================
    // ACT : Action
    // =========================

    // On affiche la page des annonces.
    render(
      <MemoryRouter>
        <AuthContext.Provider value={authValue}>
          <AnnoncesPage />
        </AuthContext.Provider>
      </MemoryRouter>,
    );

    // On attend que le titre de la première annonce soit affiché.
    const firstAnnouncementTitle = await screen.findByText(
      "Ordinateur portable Lenovo",
    );

    // On recherche le titre de la deuxième annonce.
    const secondAnnouncementTitle = screen.getByText(
      "Table de bureau en bois",
    );

    // =========================
    // ASSERT : Vérifications
    // =========================

    // On vérifie que l'API a été appelée une seule fois.
    expect(getPublicAnnoncesRequest).toHaveBeenCalledTimes(1);

    // On vérifie que la première annonce est affichée.
    expect(firstAnnouncementTitle).toBeInTheDocument();

    // On vérifie que la deuxième annonce est affichée.
    expect(secondAnnouncementTitle).toBeInTheDocument();

    // On vérifie que la description de la première annonce est affichée.
    expect(
      screen.getByText(
        "Ordinateur en bon état avec son chargeur.",
      ),
    ).toBeInTheDocument();

    // On vérifie que la description de la deuxième annonce est affichée.
    expect(
      screen.getByText(
        "Table solide adaptée au travail à domicile.",
      ),
    ).toBeInTheDocument();

    // On vérifie que la ville Douala est affichée.
    expect(screen.getByText("Douala")).toBeInTheDocument();

    // On vérifie que la ville Yaoundé est affichée.
    expect(screen.getByText("Yaoundé")).toBeInTheDocument();

    // On récupère tous les éléments contenant la catégorie Informatique.
    const informatiqueElements = screen.getAllByText("Informatique");

    // On récupère tous les éléments contenant la catégorie Maison.
    const maisonElements = screen.getAllByText("Maison");

    // On vérifie que la catégorie Informatique apparaît dans le filtre et dans l'annonce.
    expect(informatiqueElements).toHaveLength(2);

    // On vérifie que la catégorie Maison apparaît dans le filtre et dans l'annonce.
    expect(maisonElements).toHaveLength(2);

    // On vérifie que le nombre d'annonces trouvées est correct.
    expect(
      screen.getByRole("heading", {
        name: "2 annonces trouvées",
      }),
    ).toBeInTheDocument();

    // On vérifie que le prix de la première annonce est affiché.
    expect(
      screen.getByText(/250\s000 FCFA/),
    ).toBeInTheDocument();

    // On vérifie que le prix de la deuxième annonce est affiché.
    expect(
      screen.getByText(/45\s000 FCFA/),
    ).toBeInTheDocument();

    // On récupère les liens permettant de voir les détails.
    const detailLinks = screen.getAllByRole("link", {
      name: "Voir détail",
    });

    // On vérifie qu'il existe deux liens vers les détails.
    expect(detailLinks).toHaveLength(2);

    // On vérifie que le chargement n'est plus affiché.
    expect(
      screen.queryByText("Chargement des annonces"),
    ).not.toBeInTheDocument();
  });

  // Troisième test.
  it("affiche un message lorsqu'aucune annonce n'est disponible", async () => {
    // =========================
    // ARRANGE : Préparation
    // =========================

    // On indique que le backend retourne une liste vide.
    getPublicAnnoncesRequest.mockResolvedValue([]);

    // On prépare un visiteur non connecté.
    const authValue = {
      // Aucun utilisateur n'est connecté.
      user: null,

      // Le visiteur n'est pas authentifié.
      isAuthenticated: false,

      // La session n'est pas en cours de chargement.
      loading: false,

      // On crée une fausse fonction de déconnexion.
      logout: vi.fn(),
    };

    // =========================
    // ACT : Action
    // =========================

    // On affiche la page des annonces.
    render(
      <MemoryRouter>
        <AuthContext.Provider value={authValue}>
          <AnnoncesPage />
        </AuthContext.Provider>
      </MemoryRouter>,
    );

    // On attend que le titre de l'état vide soit affiché.
    const emptyStateTitle = await screen.findByRole("heading", {
      name: "Aucune annonce disponible",
    });

    // On récupère la section qui contient le titre de l'état vide.
    const emptyStateSection = emptyStateTitle.closest("section");

    // =========================
    // ASSERT : Vérifications
    // =========================

    // On vérifie que la fonction API a été appelée une seule fois.
    expect(getPublicAnnoncesRequest).toHaveBeenCalledTimes(1);

    // On vérifie que le titre de l'état vide est affiché.
    expect(emptyStateTitle).toBeInTheDocument();

    // On vérifie que la section de l'état vide existe.
    expect(emptyStateSection).toBeInTheDocument();

    // On vérifie que l'explication est affichée.
    expect(
      screen.getByText(
        "Aucune annonce n’est actuellement publiée sur la plateforme.",
      ),
    ).toBeInTheDocument();

    // On recherche uniquement dans la section de l'état vide.
    const emptyStatePublishLink = within(emptyStateSection).getByRole(
      "link",
      {
        name: "Publier une annonce",
      },
    );

    // On vérifie que le lien de publication est affiché.
    expect(emptyStatePublishLink).toBeInTheDocument();

    // On vérifie que le lien dirige vers la création d'une annonce.
    expect(emptyStatePublishLink).toHaveAttribute(
      "href",
      "/membre/vendeur/annonces/nouvelle",
    );

    // On vérifie que la section des filtres n'est pas affichée.
    expect(
      screen.queryByRole("heading", {
        name: "Rechercher et filtrer",
      }),
    ).not.toBeInTheDocument();

    // On vérifie que le chargement n'est plus affiché.
    expect(
      screen.queryByText("Chargement des annonces"),
    ).not.toBeInTheDocument();
  });

    // Quatrième test.
  it("affiche une erreur lorsque le chargement des annonces échoue", async () => {
    // =========================
    // ARRANGE : Préparation
    // =========================

    // On prépare le message d'erreur retourné par le backend.
    const backendErrorMessage = "Le serveur est indisponible.";

    // On indique que la récupération des annonces va échouer.
    getPublicAnnoncesRequest.mockRejectedValue(
      new Error(backendErrorMessage),
    );

    // On prépare un visiteur non connecté.
    const authValue = {
      // Aucun utilisateur n'est connecté.
      user: null,

      // Le visiteur n'est pas authentifié.
      isAuthenticated: false,

      // La session n'est pas en cours de chargement.
      loading: false,

      // On crée une fausse fonction de déconnexion.
      logout: vi.fn(),
    };

    // =========================
    // ACT : Action
    // =========================

    // On affiche la page des annonces.
    render(
      <MemoryRouter>
        <AuthContext.Provider value={authValue}>
          <AnnoncesPage />
        </AuthContext.Provider>
      </MemoryRouter>,
    );

    // On attend que la zone d'erreur soit affichée.
    const errorState = await screen.findByRole("alert");

    // =========================
    // ASSERT : Vérifications
    // =========================

    // On vérifie que l'API a été appelée une seule fois.
    expect(getPublicAnnoncesRequest).toHaveBeenCalledTimes(1);

    // On vérifie que la zone d'erreur est affichée.
    expect(errorState).toBeInTheDocument();

    // On vérifie que le titre de l'erreur est affiché.
    expect(
      within(errorState).getByText(
        "Impossible de charger les annonces",
      ),
    ).toBeInTheDocument();

    // On vérifie que le message du backend est affiché.
    expect(
      within(errorState).getByText(backendErrorMessage),
    ).toBeInTheDocument();

    // On vérifie que le bouton permettant de réessayer est affiché.
    expect(
      within(errorState).getByRole("button", {
        name: "Réessayer",
      }),
    ).toBeInTheDocument();

    // On vérifie que le chargement n'est plus affiché.
    expect(
      screen.queryByText("Chargement des annonces"),
    ).not.toBeInTheDocument();

    // On vérifie que les filtres ne sont pas affichés.
    expect(
      screen.queryByRole("heading", {
        name: "Rechercher et filtrer",
      }),
    ).not.toBeInTheDocument();
  });

    // Cinquième test.
  it("recherche une annonce par son titre", async () => {
    // =========================
    // ARRANGE : Préparation
    // =========================

    // On prépare l'outil qui simule les actions de l'utilisateur.
    const user = userEvent.setup();

    // On prépare une première fausse annonce.
    const premiereAnnonce = {
      // On définit l'identifiant de l'annonce.
      id: 1,

      // On définit son titre.
      titre: "Ordinateur portable Lenovo",

      // On définit sa description.
      description: "Ordinateur en bon état avec son chargeur.",

      // On définit son prix.
      prix: 250000,

      // On définit sa ville.
      ville: "Douala",

      // On définit l'état de l'objet.
      etatObjet: "Bon état",

      // On définit l'identifiant de sa catégorie.
      categorieId: 1,

      // On définit le nom de sa catégorie.
      nomCategorie: "Informatique",

      // On définit sa date de publication.
      datePublication: "2026-07-18T10:00:00",

      // On indique qu'aucune photo principale n'est disponible.
      photoPrincipaleUrl: "",
    };

    // On prépare une deuxième fausse annonce.
    const deuxiemeAnnonce = {
      // On définit l'identifiant de l'annonce.
      id: 2,

      // On définit son titre.
      titre: "Table de bureau en bois",

      // On définit sa description.
      description: "Table solide adaptée au travail à domicile.",

      // On définit son prix.
      prix: 45000,

      // On définit sa ville.
      ville: "Yaoundé",

      // On définit l'état de l'objet.
      etatObjet: "Très bon état",

      // On définit l'identifiant de sa catégorie.
      categorieId: 2,

      // On définit le nom de sa catégorie.
      nomCategorie: "Maison",

      // On définit sa date de publication.
      datePublication: "2026-07-17T09:00:00",

      // On indique qu'aucune photo principale n'est disponible.
      photoPrincipaleUrl: "",
    };

    // On indique que l'API retourne les deux annonces.
    getPublicAnnoncesRequest.mockResolvedValue([
      premiereAnnonce,
      deuxiemeAnnonce,
    ]);

    // On prépare un visiteur non connecté.
    const authValue = {
      // Aucun utilisateur n'est connecté.
      user: null,

      // Le visiteur n'est pas authentifié.
      isAuthenticated: false,

      // La session n'est pas en cours de chargement.
      loading: false,

      // On crée une fausse fonction de déconnexion.
      logout: vi.fn(),
    };

    // On affiche la page des annonces.
    render(
      <MemoryRouter>
        <AuthContext.Provider value={authValue}>
          <AnnoncesPage />
        </AuthContext.Provider>
      </MemoryRouter>,
    );

    // On attend que les annonces soient chargées.
    await screen.findByText("Ordinateur portable Lenovo");

    // On recherche le champ de recherche.
    const searchInput = screen.getByLabelText(
      "Rechercher un produit",
    );

    // =========================
    // ACT : Action
    // =========================

    // On recherche l'annonce contenant le mot Lenovo.
    await user.type(searchInput, "Lenovo");

    // =========================
    // ASSERT : Vérifications
    // =========================

    // On vérifie que le texte saisi est présent dans le champ.
    expect(searchInput).toHaveValue("Lenovo");

    // On vérifie que l'annonce Lenovo reste affichée.
    expect(
      screen.getByText("Ordinateur portable Lenovo"),
    ).toBeInTheDocument();

    // On vérifie que l'autre annonce n'est plus affichée.
    expect(
      screen.queryByText("Table de bureau en bois"),
    ).not.toBeInTheDocument();

    // On vérifie qu'une seule annonce correspond à la recherche.
    expect(
      screen.getByRole("heading", {
        name: "1 annonce trouvée",
      }),
    ).toBeInTheDocument();

    // On vérifie qu'un filtre est actif.
    expect(
      screen.getByText("1 filtre actif"),
    ).toBeInTheDocument();

    // On vérifie que l'API n'a été appelée qu'une seule fois.
    expect(getPublicAnnoncesRequest).toHaveBeenCalledTimes(1);
  });

    // Sixième test.
  it("filtre les annonces par catégorie", async () => {
    // =========================
    // ARRANGE : Préparation
    // =========================

    // On prépare l'outil qui simule les actions de l'utilisateur.
    const user = userEvent.setup();

    // On prépare une annonce de la catégorie Informatique.
    const annonceInformatique = {
      // On définit l'identifiant de l'annonce.
      id: 1,

      // On définit le titre de l'annonce.
      titre: "Ordinateur portable Lenovo",

      // On définit la description de l'annonce.
      description: "Ordinateur en bon état avec son chargeur.",

      // On définit le prix de l'annonce.
      prix: 250000,

      // On définit la ville de l'annonce.
      ville: "Douala",

      // On définit l'état de l'objet.
      etatObjet: "Bon état",

      // On définit l'identifiant de la catégorie.
      categorieId: 1,

      // On définit le nom de la catégorie.
      nomCategorie: "Informatique",

      // On définit la date de publication.
      datePublication: "2026-07-18T10:00:00",

      // On indique qu'aucune photo principale n'est disponible.
      photoPrincipaleUrl: "",
    };

    // On prépare une annonce de la catégorie Maison.
    const annonceMaison = {
      // On définit l'identifiant de l'annonce.
      id: 2,

      // On définit le titre de l'annonce.
      titre: "Table de bureau en bois",

      // On définit la description de l'annonce.
      description: "Table solide adaptée au travail à domicile.",

      // On définit le prix de l'annonce.
      prix: 45000,

      // On définit la ville de l'annonce.
      ville: "Yaoundé",

      // On définit l'état de l'objet.
      etatObjet: "Très bon état",

      // On définit l'identifiant de la catégorie.
      categorieId: 2,

      // On définit le nom de la catégorie.
      nomCategorie: "Maison",

      // On définit la date de publication.
      datePublication: "2026-07-17T09:00:00",

      // On indique qu'aucune photo principale n'est disponible.
      photoPrincipaleUrl: "",
    };

    // On indique que l'API retourne les deux annonces.
    getPublicAnnoncesRequest.mockResolvedValue([
      annonceInformatique,
      annonceMaison,
    ]);

    // On prépare un visiteur non connecté.
    const authValue = {
      // Aucun utilisateur n'est connecté.
      user: null,

      // Le visiteur n'est pas authentifié.
      isAuthenticated: false,

      // La session n'est pas en cours de chargement.
      loading: false,

      // On crée une fausse fonction de déconnexion.
      logout: vi.fn(),
    };

    // On affiche la page des annonces.
    render(
      <MemoryRouter>
        <AuthContext.Provider value={authValue}>
          <AnnoncesPage />
        </AuthContext.Provider>
      </MemoryRouter>,
    );

    // On attend que les annonces soient chargées.
    await screen.findByText("Ordinateur portable Lenovo");

    // On recherche la liste des catégories.
    const categorySelect = screen.getByLabelText(/^Catégorie/i);

    // =========================
    // ACT : Action
    // =========================

    // On sélectionne la catégorie Informatique.
    await user.selectOptions(categorySelect, "1");

    // =========================
    // ASSERT : Vérifications
    // =========================

    // On vérifie que la catégorie Informatique est sélectionnée.
    expect(categorySelect).toHaveValue("1");

    // On vérifie que l'annonce Informatique reste affichée.
    expect(
      screen.getByText("Ordinateur portable Lenovo"),
    ).toBeInTheDocument();

    // On vérifie que l'annonce Maison n'est plus affichée.
    expect(
      screen.queryByText("Table de bureau en bois"),
    ).not.toBeInTheDocument();

    // On vérifie qu'une seule annonce correspond au filtre.
    expect(
      screen.getByRole("heading", {
        name: "1 annonce trouvée",
      }),
    ).toBeInTheDocument();

    // On vérifie qu'un filtre est actif.
    expect(
      screen.getByText("1 filtre actif"),
    ).toBeInTheDocument();

    // On vérifie que l'API n'a été appelée qu'une seule fois.
    expect(getPublicAnnoncesRequest).toHaveBeenCalledTimes(1);
  });

    // Septième test.
  it("réinitialise tous les filtres", async () => {
    // =========================
    // ARRANGE : Préparation
    // =========================

    // On prépare l'outil qui simule les actions de l'utilisateur.
    const user = userEvent.setup();

    // On prépare une première annonce.
    const premiereAnnonce = {
      // On définit l'identifiant de l'annonce.
      id: 1,

      // On définit le titre de l'annonce.
      titre: "Ordinateur portable Lenovo",

      // On définit la description de l'annonce.
      description: "Ordinateur en bon état avec son chargeur.",

      // On définit le prix de l'annonce.
      prix: 250000,

      // On définit la ville de l'annonce.
      ville: "Douala",

      // On définit l'état de l'objet.
      etatObjet: "Bon état",

      // On définit l'identifiant de la catégorie.
      categorieId: 1,

      // On définit le nom de la catégorie.
      nomCategorie: "Informatique",

      // On définit la date de publication.
      datePublication: "2026-07-18T10:00:00",

      // On indique qu'aucune photo principale n'est disponible.
      photoPrincipaleUrl: "",
    };

    // On prépare une deuxième annonce.
    const deuxiemeAnnonce = {
      // On définit l'identifiant de l'annonce.
      id: 2,

      // On définit le titre de l'annonce.
      titre: "Table de bureau en bois",

      // On définit la description de l'annonce.
      description: "Table solide adaptée au travail à domicile.",

      // On définit le prix de l'annonce.
      prix: 45000,

      // On définit la ville de l'annonce.
      ville: "Yaoundé",

      // On définit l'état de l'objet.
      etatObjet: "Très bon état",

      // On définit l'identifiant de la catégorie.
      categorieId: 2,

      // On définit le nom de la catégorie.
      nomCategorie: "Maison",

      // On définit la date de publication.
      datePublication: "2026-07-17T09:00:00",

      // On indique qu'aucune photo principale n'est disponible.
      photoPrincipaleUrl: "",
    };

    // On indique que l'API retourne les deux annonces.
    getPublicAnnoncesRequest.mockResolvedValue([
      premiereAnnonce,
      deuxiemeAnnonce,
    ]);

    // On prépare un visiteur non connecté.
    const authValue = {
      // Aucun utilisateur n'est connecté.
      user: null,

      // Le visiteur n'est pas authentifié.
      isAuthenticated: false,

      // La session n'est pas en cours de chargement.
      loading: false,

      // On crée une fausse fonction de déconnexion.
      logout: vi.fn(),
    };

    // On affiche la page des annonces.
    render(
      <MemoryRouter>
        <AuthContext.Provider value={authValue}>
          <AnnoncesPage />
        </AuthContext.Provider>
      </MemoryRouter>,
    );

    // On attend que les annonces soient chargées.
    await screen.findByText("Ordinateur portable Lenovo");

    // On recherche le champ de recherche.
    const searchInput = screen.getByLabelText(
      "Rechercher un produit",
    );

    // On recherche la liste des catégories.
    const categorySelect = screen.getByLabelText(/^Catégorie/i);

    // On recherche le bouton de réinitialisation.
    const resetButton = screen.getByRole("button", {
      name: "Réinitialiser",
    });

    // =========================
    // ACT : Actions
    // =========================

    // On saisit un texte dans le champ de recherche.
    await user.type(searchInput, "Lenovo");

    // On sélectionne la catégorie Informatique.
    await user.selectOptions(categorySelect, "1");

    // =========================
    // ASSERT : Vérifications avant réinitialisation
    // =========================

    // On vérifie que le texte de recherche est présent.
    expect(searchInput).toHaveValue("Lenovo");

    // On vérifie que la catégorie Informatique est sélectionnée.
    expect(categorySelect).toHaveValue("1");

    // On vérifie que deux filtres sont actifs.
    expect(
      screen.getByText("2 filtres actifs"),
    ).toBeInTheDocument();

    // On vérifie que le bouton de réinitialisation est actif.
    expect(resetButton).toBeEnabled();

    // =========================
    // ACT : Réinitialisation
    // =========================

    // On clique sur le bouton Réinitialiser.
    await user.click(resetButton);

    // =========================
    // ASSERT : Vérifications après réinitialisation
    // =========================

    // On vérifie que le champ de recherche est vide.
    expect(searchInput).toHaveValue("");

    // On vérifie qu'aucune catégorie n'est sélectionnée.
    expect(categorySelect).toHaveValue("");

    // On vérifie que le nombre de filtres actifs n'est plus affiché.
    expect(
      screen.queryByText("2 filtres actifs"),
    ).not.toBeInTheDocument();

    // On vérifie que les deux annonces sont de nouveau affichées.
    expect(
      screen.getByText("Ordinateur portable Lenovo"),
    ).toBeInTheDocument();

    // On vérifie que la deuxième annonce est de nouveau affichée.
    expect(
      screen.getByText("Table de bureau en bois"),
    ).toBeInTheDocument();

    // On vérifie que les deux annonces sont comptabilisées.
    expect(
      screen.getByRole("heading", {
        name: "2 annonces trouvées",
      }),
    ).toBeInTheDocument();

    // On vérifie que le bouton est de nouveau désactivé.
    expect(resetButton).toBeDisabled();

    // On vérifie que l'API n'a été appelée qu'une seule fois.
    expect(getPublicAnnoncesRequest).toHaveBeenCalledTimes(1);
  });


});