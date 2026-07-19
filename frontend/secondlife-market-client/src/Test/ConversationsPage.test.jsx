// On importe render pour afficher la page dans le faux navigateur.
import { render } from "@testing-library/react";

// On importe screen pour rechercher des éléments dans toute la page.
import { screen } from "@testing-library/react";

// On importe within pour rechercher des éléments dans une carte précise.
import { within } from "@testing-library/react";

// On importe MemoryRouter pour permettre l'utilisation des liens React Router.
import { MemoryRouter } from "react-router-dom";

// On importe le contexte d'authentification.
import { AuthContext } from "../context/AuthContext.jsx";

// On importe la fonction qui récupère les conversations.
import { getMyConversationsRequest } from "../api/conversationApi.js";

// On importe la page que nous voulons tester.
import ConversationsPage from "../pages/messages/ConversationsPage.jsx";

// On remplace la véritable fonction API par une fausse fonction.
vi.mock("../api/conversationApi.js", () => ({
  // On crée un mock pour la récupération des conversations.
  getMyConversationsRequest: vi.fn(),
}));

// On prépare un membre qui joue le rôle d'acheteur.
const membreAcheteur = {
  // On utilise volontairement une chaîne de caractères.
  // Le composant transforme cet identifiant en nombre.
  id: "1",

  // On définit le nom du membre.
  nom: "Siewe",

  // On définit le prénom du membre.
  prenom: "Alix",

  // On définit son adresse email.
  email: "alix@test.com",

  // On définit son rôle.
  role: "Membre",
};

// On prépare un membre qui joue le rôle de vendeur.
const membreVendeur = {
  // On définit son identifiant.
  id: 2,

  // On définit son nom.
  nom: "Mbappe",

  // On définit son prénom.
  prenom: "Jean",

  // On définit son adresse email.
  email: "jean@test.com",

  // On définit son rôle.
  role: "Membre",
};

// On prépare une conversation contenant plusieurs messages.
const conversationAvecMessages = {
  // On définit l'identifiant de la conversation.
  id: 50,

  // On définit l'identifiant de la demande d'achat.
  demandeAchatId: 10,

  // On définit l'identifiant de l'annonce.
  annonceId: 101,

  // On définit le titre de l'annonce.
  annonceTitre: "Vélo de ville",

  // On définit l'identifiant de l'acheteur.
  acheteurId: 1,

  // On définit le nom complet de l'acheteur.
  acheteurNomComplet: "Alix Siewe",

  // On définit l'identifiant du vendeur.
  vendeurId: 2,

  // On définit le nom complet du vendeur.
  vendeurNomComplet: "Jean Mbappe",

  // On définit la date de création de la conversation.
  dateCreation: "2026-07-18T09:00:00",

  // On prépare les messages de la conversation.
  messages: [
    // On prépare le premier message.
    {
      // On définit l'identifiant du message.
      id: 100,

      // On définit son contenu.
      contenu: "Bonjour, le vélo est-il disponible ?",

      // On définit sa date d'envoi.
      dateEnvoi: "2026-07-18T10:00:00",
    },

    // On prépare le deuxième et dernier message.
    {
      // On définit l'identifiant du message.
      id: 101,

      // On définit son contenu.
      contenu: "Oui, il est toujours disponible.",

      // On définit sa date d'envoi.
      dateEnvoi: "2026-07-18T11:30:00",
    },
  ],
};

// On prépare une conversation qui ne contient aucun message.
const conversationSansMessage = {
  // On définit l'identifiant de la conversation.
  id: 51,

  // On définit l'identifiant de la demande d'achat.
  demandeAchatId: 11,

  // On définit l'identifiant de l'annonce.
  annonceId: 102,

  // On définit le titre de l'annonce.
  annonceTitre: "Machine à café",

  // On définit l'identifiant de l'acheteur.
  acheteurId: 1,

  // On définit le nom complet de l'acheteur.
  acheteurNomComplet: "Alix Siewe",

  // On définit l'identifiant du vendeur.
  vendeurId: 3,

  // On définit le nom complet du vendeur.
  vendeurNomComplet: "Marie Tchoumi",

  // On définit la date de création de la conversation.
  dateCreation: "2026-07-17T08:15:00",

  // On indique que la conversation ne contient aucun message.
  messages: [],
};

// Cette fonction affiche la page avec un utilisateur authentifié.
function renderConversationsPage(
  user = membreAcheteur,
  accessToken = "faux-token-jwt",
) {
  // On prépare les données du contexte d'authentification.
  const authValue = {
    // On fournit l'utilisateur connecté.
    user,

    // On fournit le faux token.
    accessToken,

    // On indique que l'utilisateur est authentifié.
    isAuthenticated: Boolean(user && accessToken),

    // On indique que la session n'est pas en chargement.
    loading: false,

    // On crée une fausse fonction de déconnexion.
    logout: vi.fn(),
  };

  // On affiche la page dans le routeur et le contexte.
  render(
    <MemoryRouter>
      <AuthContext.Provider value={authValue}>
        <ConversationsPage />
      </AuthContext.Provider>
    </MemoryRouter>,
  );
}

// On regroupe tous les tests de la page des conversations.
describe("ConversationsPage", () => {
  // Avant chaque test, on nettoie les mocks.
  beforeEach(() => {
    // On supprime les appels et les résultats des tests précédents.
    vi.clearAllMocks();
  });

  // Premier test.
  it("affiche le chargement pendant la récupération des conversations", () => {
    // =========================
    // ARRANGE : Préparation
    // =========================

    // On crée une promesse qui ne se termine pas.
    const pendingPromise = new Promise(() => {});

    // On indique que la récupération reste en cours.
    getMyConversationsRequest.mockReturnValue(
      pendingPromise,
    );

    // =========================
    // ACT : Action
    // =========================

    // On affiche la page.
    renderConversationsPage();

    // On recherche le message de chargement.
    const loadingMessage = screen.getByText(
      "Chargement de vos conversations...",
    );

    // =========================
    // ASSERT : Vérifications
    // =========================

    // On vérifie que la fonction API a été appelée une fois.
    expect(
      getMyConversationsRequest,
    ).toHaveBeenCalledTimes(1);

    // On vérifie que le token a été transmis.
    expect(
      getMyConversationsRequest,
    ).toHaveBeenCalledWith("faux-token-jwt");

    // On vérifie que le message de chargement est affiché.
    expect(loadingMessage).toBeInTheDocument();

    // On vérifie que l'état vide n'est pas affiché.
    expect(
      screen.queryByRole("heading", {
        name: "Aucune conversation",
      }),
    ).not.toBeInTheDocument();

    // On vérifie qu'aucune erreur n'est affichée.
    expect(
      screen.queryByRole("alert"),
    ).not.toBeInTheDocument();
  });

  // Deuxième test.
  it("affiche le vendeur et le dernier message lorsque le membre est l'acheteur", async () => {
    // =========================
    // ARRANGE : Préparation
    // =========================

    // On indique que le backend retourne une conversation.
    getMyConversationsRequest.mockResolvedValue([
      conversationAvecMessages,
    ]);

    // On prépare la date attendue du dernier message.
    const expectedLastMessageDate = new Date(
      "2026-07-18T11:30:00",
    ).toLocaleString("fr-FR");

    // =========================
    // ACT : Action
    // =========================

    // On affiche la page avec le membre acheteur.
    renderConversationsPage(membreAcheteur);

    // On attend que le nom du vendeur soit affiché.
    const otherMemberName = await screen.findByRole(
      "heading",
      {
        name: "Jean Mbappe",
      },
    );

    // On récupère la carte contenant cette conversation.
    const conversationCard =
      otherMemberName.closest("article");

    // =========================
    // ASSERT : Vérifications
    // =========================

    // On vérifie que la fonction API a été appelée une fois.
    expect(
      getMyConversationsRequest,
    ).toHaveBeenCalledTimes(1);

    // On vérifie que le nom du vendeur est affiché.
    expect(otherMemberName).toBeInTheDocument();

    // On vérifie que la carte de conversation existe.
    expect(conversationCard).toBeInTheDocument();

    // On vérifie que le titre de l'annonce est affiché.
    expect(
      within(conversationCard).getByText(
        "Annonce : Vélo de ville",
      ),
    ).toBeInTheDocument();

    // On vérifie que le dernier message est affiché.
    expect(
      within(conversationCard).getByText(
        "Oui, il est toujours disponible.",
      ),
    ).toBeInTheDocument();

    // On vérifie que l'ancien message n'est pas affiché.
    expect(
      within(conversationCard).queryByText(
        "Bonjour, le vélo est-il disponible ?",
      ),
    ).not.toBeInTheDocument();

    // On vérifie que la date du dernier message est affichée.
    expect(
      within(conversationCard).getByText(
        expectedLastMessageDate,
      ),
    ).toBeInTheDocument();

    // On recherche le lien qui ouvre la conversation.
    const openLink = within(conversationCard).getByRole(
      "link",
      {
        name: "Ouvrir",
      },
    );

    // On vérifie que le lien est affiché.
    expect(openLink).toBeInTheDocument();

    // On vérifie que le lien utilise l'identifiant de la demande.
    expect(openLink).toHaveAttribute(
      "href",
      "/messages/demande/10",
    );

    // On vérifie que le chargement a disparu.
    expect(
      screen.queryByText(
        "Chargement de vos conversations...",
      ),
    ).not.toBeInTheDocument();
  });

  // Troisième test.
  it("affiche l'acheteur lorsque le membre connecté est le vendeur", async () => {
    // =========================
    // ARRANGE : Préparation
    // =========================

    // On indique que le backend retourne une conversation.
    getMyConversationsRequest.mockResolvedValue([
      conversationAvecMessages,
    ]);

    // =========================
    // ACT : Action
    // =========================

    // On affiche la page avec le membre vendeur.
    renderConversationsPage(membreVendeur);

    // On attend que le nom de l'acheteur soit affiché.
    const buyerName = await screen.findByRole("heading", {
      name: "Alix Siewe",
    });

    // On récupère la carte de la conversation.
    const conversationCard = buyerName.closest("article");

    // =========================
    // ASSERT : Vérifications
    // =========================

    // On vérifie que l'API a été appelée une fois.
    expect(
      getMyConversationsRequest,
    ).toHaveBeenCalledTimes(1);

    // On vérifie que le nom de l'acheteur est affiché.
    expect(buyerName).toBeInTheDocument();

    // On vérifie que le nom du vendeur n'est pas utilisé comme titre.
    expect(
      screen.queryByRole("heading", {
        name: "Jean Mbappe",
      }),
    ).not.toBeInTheDocument();

    // On vérifie que la carte existe.
    expect(conversationCard).toBeInTheDocument();

    // On vérifie que le titre de l'annonce est affiché.
    expect(
      within(conversationCard).getByText(
        "Annonce : Vélo de ville",
      ),
    ).toBeInTheDocument();

    // On vérifie que le dernier message est affiché.
    expect(
      within(conversationCard).getByText(
        "Oui, il est toujours disponible.",
      ),
    ).toBeInTheDocument();

    // On recherche le lien d'ouverture.
    const openLink = within(conversationCard).getByRole(
      "link",
      {
        name: "Ouvrir",
      },
    );

    // On vérifie que le lien ouvre la bonne conversation.
    expect(openLink).toHaveAttribute(
      "href",
      "/messages/demande/10",
    );
  });

  // Quatrième test.
  it("affiche un texte par défaut lorsqu'une conversation ne contient aucun message", async () => {
    // =========================
    // ARRANGE : Préparation
    // =========================

    // On indique que le backend retourne une conversation vide.
    getMyConversationsRequest.mockResolvedValue([
      conversationSansMessage,
    ]);

    // On prépare la date de création attendue.
    const expectedCreationDate = new Date(
      "2026-07-17T08:15:00",
    ).toLocaleString("fr-FR");

    // =========================
    // ACT : Action
    // =========================

    // On affiche la page avec l'acheteur.
    renderConversationsPage(membreAcheteur);

    // On attend que le nom du vendeur soit affiché.
    const otherMemberName = await screen.findByRole(
      "heading",
      {
        name: "Marie Tchoumi",
      },
    );

    // On récupère la carte de la conversation.
    const conversationCard =
      otherMemberName.closest("article");

    // =========================
    // ASSERT : Vérifications
    // =========================

    // On vérifie que le nom de l'autre membre est affiché.
    expect(otherMemberName).toBeInTheDocument();

    // On vérifie que la carte existe.
    expect(conversationCard).toBeInTheDocument();

    // On vérifie que le titre de l'annonce est affiché.
    expect(
      within(conversationCard).getByText(
        "Annonce : Machine à café",
      ),
    ).toBeInTheDocument();

    // On vérifie que le message par défaut est affiché.
    expect(
      within(conversationCard).getByText(
        "Aucun message pour le moment.",
      ),
    ).toBeInTheDocument();

    // On vérifie que la date de création est utilisée.
    expect(
      within(conversationCard).getByText(
        expectedCreationDate,
      ),
    ).toBeInTheDocument();

    // On recherche le lien d'ouverture.
    const openLink = within(conversationCard).getByRole(
      "link",
      {
        name: "Ouvrir",
      },
    );

    // On vérifie que le lien utilise la bonne demande.
    expect(openLink).toHaveAttribute(
      "href",
      "/messages/demande/11",
    );
  });

  // Cinquième test.
  it("affiche un message lorsqu'aucune conversation n'existe", async () => {
    // =========================
    // ARRANGE : Préparation
    // =========================

    // On indique que le backend retourne une liste vide.
    getMyConversationsRequest.mockResolvedValue([]);

    // =========================
    // ACT : Action
    // =========================

    // On affiche la page.
    renderConversationsPage();

    // On attend que le titre de l'état vide soit affiché.
    const emptyStateTitle = await screen.findByRole(
      "heading",
      {
        name: "Aucune conversation",
      },
    );

    // On recherche le lien vers les annonces.
    const announcementsLink = screen.getByRole("link", {
      name: "Voir les annonces",
    });

    // =========================
    // ASSERT : Vérifications
    // =========================

    // On vérifie que l'API a été appelée une fois.
    expect(
      getMyConversationsRequest,
    ).toHaveBeenCalledTimes(1);

    // On vérifie que le token a été transmis.
    expect(
      getMyConversationsRequest,
    ).toHaveBeenCalledWith("faux-token-jwt");

    // On vérifie que le titre de l'état vide est affiché.
    expect(emptyStateTitle).toBeInTheDocument();

    // On vérifie que l'explication est affichée.
    expect(
      screen.getByText(
        "Vous n'avez encore aucune conversation.",
      ),
    ).toBeInTheDocument();

    // On vérifie que le lien vers les annonces est affiché.
    expect(announcementsLink).toBeInTheDocument();

    // On vérifie que le lien dirige vers les annonces.
    expect(announcementsLink).toHaveAttribute(
      "href",
      "/annonces",
    );

    // On vérifie que le chargement a disparu.
    expect(
      screen.queryByText(
        "Chargement de vos conversations...",
      ),
    ).not.toBeInTheDocument();

    // On vérifie qu'aucun lien Ouvrir n'est affiché.
    expect(
      screen.queryByRole("link", {
        name: "Ouvrir",
      }),
    ).not.toBeInTheDocument();

    // On vérifie qu'aucune erreur n'est affichée.
    expect(
      screen.queryByRole("alert"),
    ).not.toBeInTheDocument();
  });

  // Sixième test.
  it("affiche une erreur lorsque le chargement des conversations échoue", async () => {
    // =========================
    // ARRANGE : Préparation
    // =========================

    // On prépare le message d'erreur du backend.
    const backendErrorMessage =
      "Impossible de charger vos conversations.";

    // On indique que la récupération va échouer.
    getMyConversationsRequest.mockRejectedValue(
      new Error(backendErrorMessage),
    );

    // =========================
    // ACT : Action
    // =========================

    // On affiche la page.
    renderConversationsPage();

    // On attend que la zone d'erreur soit affichée.
    const errorMessage = await screen.findByRole("alert");

    // =========================
    // ASSERT : Vérifications
    // =========================

    // On vérifie que l'API a été appelée une fois.
    expect(
      getMyConversationsRequest,
    ).toHaveBeenCalledTimes(1);

    // On vérifie que le token a été transmis.
    expect(
      getMyConversationsRequest,
    ).toHaveBeenCalledWith("faux-token-jwt");

    // On vérifie que la zone d'erreur est affichée.
    expect(errorMessage).toBeInTheDocument();

    // On vérifie que le message du backend est affiché.
    expect(errorMessage).toHaveTextContent(
      backendErrorMessage,
    );

    // On vérifie que le chargement a disparu.
    expect(
      screen.queryByText(
        "Chargement de vos conversations...",
      ),
    ).not.toBeInTheDocument();

    // On vérifie que l'état vide n'est pas affiché.
    expect(
      screen.queryByRole("heading", {
        name: "Aucune conversation",
      }),
    ).not.toBeInTheDocument();

    // On vérifie qu'aucune conversation n'est affichée.
    expect(
      screen.queryByRole("link", {
        name: "Ouvrir",
      }),
    ).not.toBeInTheDocument();
  });
});