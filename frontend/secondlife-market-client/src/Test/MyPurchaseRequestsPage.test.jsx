// On importe render pour afficher la page dans le faux navigateur.
import { render } from "@testing-library/react";

// On importe screen pour rechercher les éléments affichés.
import { screen } from "@testing-library/react";

// On importe userEvent pour simuler les actions de l'utilisateur.
import userEvent from "@testing-library/user-event";

// On importe MemoryRouter pour permettre l'utilisation des liens.
import { MemoryRouter } from "react-router-dom";

// On importe le contexte d'authentification.
import { AuthContext } from "../context/AuthContext.jsx";

// On importe les fonctions liées aux demandes d'achat.
import {
  getMyDemandesAchatRequest,
  cancelDemandeAchatRequest,
} from "../api/demandeApi.js";

// On importe la page que nous voulons tester.
import MyPurchaseRequestsPage from "../pages/buyer/MyPurchaseRequestsPage.jsx";

// On remplace les vraies fonctions des demandes d'achat par des mocks.
vi.mock("../api/demandeApi.js", () => ({
  // On simule la récupération des demandes envoyées.
  getMyDemandesAchatRequest: vi.fn(),

  // On simule l'annulation d'une demande.
  cancelDemandeAchatRequest: vi.fn(),
}));

// On remplace la fonction qui construit l'adresse des photos.
vi.mock("../api/annonceApi.js", () => ({
  // On retourne simplement l'adresse reçue.
  getPhotoUrl: vi.fn((photoUrl) => photoUrl),
}));

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

  // On fournit un faux token d'accès.
  accessToken: "faux-token-jwt",

  // On indique que le membre est authentifié.
  isAuthenticated: true,

  // On indique que la session n'est pas en chargement.
  loading: false,

  // On crée une fausse fonction de déconnexion.
  logout: vi.fn(),
};

// On prépare une demande en attente réutilisable dans les tests.
const demandeEnAttente = {
  // On définit l'identifiant de la demande.
  id: 10,

  // On définit l'identifiant de l'annonce concernée.
  annonceId: 101,

  // On définit le titre de l'annonce.
  annonceTitre: "Vélo de ville",

  // On définit le prix de l'annonce.
  annoncePrix: 85000,

  // On indique qu'aucune photo n'est disponible.
  annoncePhotoUrl: "",

  // On définit le nom complet du vendeur.
  vendeurNomComplet: "Jean Mbappe",

  // On définit la date de la demande.
  dateDemande: "2026-07-18T10:00:00",

  // On définit le message envoyé au vendeur.
  message: "Bonjour, ce vélo est-il toujours disponible ?",

  // On définit le statut de la demande.
  statut: "En attente",
};

// On prépare une demande refusée réutilisable dans les tests.
const demandeRefusee = {
  // On définit l'identifiant de la demande.
  id: 11,

  // On définit l'identifiant de l'annonce concernée.
  annonceId: 102,

  // On définit le titre de l'annonce.
  annonceTitre: "Machine à café",

  // On définit le prix de l'annonce.
  annoncePrix: 35000,

  // On indique qu'aucune photo n'est disponible.
  annoncePhotoUrl: "",

  // On définit le nom complet du vendeur.
  vendeurNomComplet: "Marie Tchoumi",

  // On définit la date de la demande.
  dateDemande: "2026-07-17T09:00:00",

  // Aucun message n'a été envoyé.
  message: "",

  // On définit le statut de la demande.
  statut: "Refusée",
};

// Cette fonction affiche la page avec les éléments nécessaires.
function renderPurchaseRequestsPage() {
  // On affiche la page dans le routeur et le contexte d'authentification.
  render(
    <MemoryRouter>
      <AuthContext.Provider value={authValue}>
        <MyPurchaseRequestsPage />
      </AuthContext.Provider>
    </MemoryRouter>,
  );
}

// On regroupe les tests de la page des demandes envoyées.
describe("MyPurchaseRequestsPage", () => {
  // Avant chaque test, on remet les mocks à zéro.
  beforeEach(() => {
    // On supprime les appels et résultats des tests précédents.
    vi.clearAllMocks();
  });

  // Après chaque test, on restaure les fonctions surveillées.
  afterEach(() => {
    // On restaure notamment window.confirm.
    vi.restoreAllMocks();
  });

  // Premier test.
  it("affiche le chargement pendant la récupération des demandes", () => {
    // =========================
    // ARRANGE : Préparation
    // =========================

    // On crée une promesse qui reste en attente.
    const pendingPromise = new Promise(() => {});

    // On indique que la récupération des demandes reste en cours.
    getMyDemandesAchatRequest.mockReturnValue(pendingPromise);

    // =========================
    // ACT : Action
    // =========================

    // On affiche la page.
    renderPurchaseRequestsPage();

    // On recherche le message de chargement.
    const loadingMessage = screen.getByText(
      "Chargement de vos demandes...",
    );

    // =========================
    // ASSERT : Vérifications
    // =========================

    // On vérifie que la fonction de récupération a été appelée une fois.
    expect(getMyDemandesAchatRequest).toHaveBeenCalledTimes(1);

    // On vérifie que le token du membre a été transmis.
    expect(getMyDemandesAchatRequest).toHaveBeenCalledWith(
      "faux-token-jwt",
    );

    // On vérifie que le message de chargement est affiché.
    expect(loadingMessage).toBeInTheDocument();

    // On vérifie que l'annulation n'a pas été appelée.
    expect(cancelDemandeAchatRequest).not.toHaveBeenCalled();
  });

  // Deuxième test.
  it("affiche les demandes d'achat reçues du backend", async () => {
    // =========================
    // ARRANGE : Préparation
    // =========================

    // On indique que le backend retourne les deux demandes.
    getMyDemandesAchatRequest.mockResolvedValue([
      demandeEnAttente,
      demandeRefusee,
    ]);

    // =========================
    // ACT : Action
    // =========================

    // On affiche la page.
    renderPurchaseRequestsPage();

    // On attend que la première demande soit affichée.
    const firstRequestTitle = await screen.findByRole("heading", {
      name: "Vélo de ville",
    });

    // On recherche le titre de la deuxième demande.
    const secondRequestTitle = screen.getByRole("heading", {
      name: "Machine à café",
    });

    // =========================
    // ASSERT : Vérifications
    // =========================

    // On vérifie que le backend a été appelé une seule fois.
    expect(getMyDemandesAchatRequest).toHaveBeenCalledTimes(1);

    // On vérifie que le token a été transmis au backend.
    expect(getMyDemandesAchatRequest).toHaveBeenCalledWith(
      "faux-token-jwt",
    );

    // On vérifie que la première demande est affichée.
    expect(firstRequestTitle).toBeInTheDocument();

    // On vérifie que la deuxième demande est affichée.
    expect(secondRequestTitle).toBeInTheDocument();

    // On vérifie que le prix du vélo est affiché.
    expect(
      screen.getByText(/85\s000 FCFA/),
    ).toBeInTheDocument();

    // On vérifie que le prix de la machine à café est affiché.
    expect(
      screen.getByText(/35\s000 FCFA/),
    ).toBeInTheDocument();

    // On vérifie que le nom du premier vendeur est affiché.
    expect(
      screen.getByText("Vendeur : Jean Mbappe"),
    ).toBeInTheDocument();

    // On vérifie que le nom du deuxième vendeur est affiché.
    expect(
      screen.getByText("Vendeur : Marie Tchoumi"),
    ).toBeInTheDocument();

    // On vérifie que le message envoyé au vendeur est affiché.
    expect(
      screen.getByText(
        "Message : Bonjour, ce vélo est-il toujours disponible ?",
      ),
    ).toBeInTheDocument();

    // On vérifie que le statut En attente est affiché.
    expect(
      screen.getByText("En attente"),
    ).toBeInTheDocument();

    // On vérifie que le statut Refusée est affiché.
    expect(
      screen.getByText("Refusée"),
    ).toBeInTheDocument();

    // On récupère les liens permettant de consulter les annonces.
    const announcementLinks = screen.getAllByRole("link", {
      name: "Voir l'annonce",
    });

    // On vérifie qu'un lien est affiché pour chaque demande.
    expect(announcementLinks).toHaveLength(2);

    // On vérifie que le premier lien ouvre la bonne annonce.
    expect(announcementLinks[0]).toHaveAttribute(
      "href",
      "/annonces/101",
    );

    // On vérifie que le deuxième lien ouvre la bonne annonce.
    expect(announcementLinks[1]).toHaveAttribute(
      "href",
      "/annonces/102",
    );

    // On recherche le lien de conversation.
    const conversationLink = screen.getByRole("link", {
      name: "Échanger avec le vendeur",
    });

    // On vérifie que le lien ouvre la conversation de la bonne demande.
    expect(conversationLink).toHaveAttribute(
      "href",
      "/messages/demande/10",
    );

    // On vérifie que le bouton Annuler est affiché.
    expect(
      screen.getByRole("button", {
        name: "Annuler",
      }),
    ).toBeInTheDocument();

    // On vérifie que le message de chargement a disparu.
    expect(
      screen.queryByText("Chargement de vos demandes..."),
    ).not.toBeInTheDocument();

    // On vérifie que l'annulation n'a pas été appelée.
    expect(cancelDemandeAchatRequest).not.toHaveBeenCalled();
  });

  // Troisième test.
  it("affiche un message lorsqu'aucune demande n'a été envoyée", async () => {
    // =========================
    // ARRANGE : Préparation
    // =========================

    // On indique que le backend retourne une liste vide.
    getMyDemandesAchatRequest.mockResolvedValue([]);

    // =========================
    // ACT : Action
    // =========================

    // On affiche la page.
    renderPurchaseRequestsPage();

    // On attend que le titre de l'état vide soit affiché.
    const emptyStateTitle = await screen.findByRole("heading", {
      name: "Aucune demande envoyée",
    });

    // On recherche le lien vers les annonces.
    const announcementsLink = screen.getByRole("link", {
      name: "Voir les annonces",
    });

    // =========================
    // ASSERT : Vérifications
    // =========================

    // On vérifie que la récupération des demandes a été appelée une fois.
    expect(getMyDemandesAchatRequest).toHaveBeenCalledTimes(1);

    // On vérifie que le token du membre a été transmis.
    expect(getMyDemandesAchatRequest).toHaveBeenCalledWith(
      "faux-token-jwt",
    );

    // On vérifie que le titre de l'état vide est affiché.
    expect(emptyStateTitle).toBeInTheDocument();

    // On vérifie que l'explication est affichée.
    expect(
      screen.getByText(
        "Vous n'avez pas encore fait de demande d'achat.",
      ),
    ).toBeInTheDocument();

    // On vérifie que le lien vers les annonces est affiché.
    expect(announcementsLink).toBeInTheDocument();

    // On vérifie que le lien dirige vers la page des annonces.
    expect(announcementsLink).toHaveAttribute(
      "href",
      "/annonces",
    );

    // On vérifie que le chargement n'est plus affiché.
    expect(
      screen.queryByText("Chargement de vos demandes..."),
    ).not.toBeInTheDocument();

    // On vérifie qu'aucun bouton d'annulation n'est affiché.
    expect(
      screen.queryByRole("button", {
        name: "Annuler",
      }),
    ).not.toBeInTheDocument();

    // On vérifie que la fonction d'annulation n'a pas été appelée.
    expect(cancelDemandeAchatRequest).not.toHaveBeenCalled();
  });

  // Quatrième test.
  it("affiche une erreur lorsque le chargement des demandes échoue", async () => {
    // =========================
    // ARRANGE : Préparation
    // =========================

    // On prépare le message d'erreur du backend.
    const backendErrorMessage =
      "Impossible de charger vos demandes d'achat.";

    // On indique que la récupération va échouer.
    getMyDemandesAchatRequest.mockRejectedValue(
      new Error(backendErrorMessage),
    );

    // =========================
    // ACT : Action
    // =========================

    // On affiche la page.
    renderPurchaseRequestsPage();

    // On attend que le message d'erreur soit affiché.
    const errorMessage = await screen.findByRole("alert");

    // =========================
    // ASSERT : Vérifications
    // =========================

    // On vérifie que la récupération a été appelée une fois.
    expect(getMyDemandesAchatRequest).toHaveBeenCalledTimes(1);

    // On vérifie que le token a été transmis.
    expect(getMyDemandesAchatRequest).toHaveBeenCalledWith(
      "faux-token-jwt",
    );

    // On vérifie que la zone d'erreur est affichée.
    expect(errorMessage).toBeInTheDocument();

    // On vérifie que le message du backend est affiché.
    expect(errorMessage).toHaveTextContent(
      backendErrorMessage,
    );

    // On vérifie que le chargement a disparu.
    expect(
      screen.queryByText("Chargement de vos demandes..."),
    ).not.toBeInTheDocument();

    // On vérifie que l'état vide n'est pas affiché.
    expect(
      screen.queryByRole("heading", {
        name: "Aucune demande envoyée",
      }),
    ).not.toBeInTheDocument();

    // On vérifie qu'aucune demande n'est affichée.
    expect(
      screen.queryByRole("heading", {
        name: "Vélo de ville",
      }),
    ).not.toBeInTheDocument();

    // On vérifie que l'annulation n'a pas été appelée.
    expect(cancelDemandeAchatRequest).not.toHaveBeenCalled();
  });

  // Cinquième test.
  it("annule une demande après confirmation de l'utilisateur", async () => {
    // =========================
    // ARRANGE : Préparation
    // =========================

    // On prépare l'outil qui simule les actions de l'utilisateur.
    const user = userEvent.setup();

    // On indique que le backend retourne une demande en attente.
    getMyDemandesAchatRequest.mockResolvedValue([
      demandeEnAttente,
    ]);

    // On prépare la demande mise à jour après son annulation.
    const demandeAnnulee = {
      // On conserve toutes les informations de la demande.
      ...demandeEnAttente,

      // On remplace le statut par Annulée.
      statut: "Annulée",
    };

    // On indique que l'annulation réussit.
    cancelDemandeAchatRequest.mockResolvedValue(
      demandeAnnulee,
    );

    // On surveille la boîte de confirmation du navigateur.
    const confirmMock = vi
      .spyOn(window, "confirm")
      .mockReturnValue(true);

    // On affiche la page.
    renderPurchaseRequestsPage();

    // On attend que la demande soit affichée.
    await screen.findByRole("heading", {
      name: "Vélo de ville",
    });

    // On recherche le bouton d'annulation.
    const cancelButton = screen.getByRole("button", {
      name: "Annuler",
    });

    // =========================
    // ACT : Action
    // =========================

    // On clique sur le bouton Annuler.
    await user.click(cancelButton);

    // On attend que le nouveau statut soit affiché.
    const cancelledStatus = await screen.findByText(
      "Annulée",
    );

    // =========================
    // ASSERT : Vérifications
    // =========================

    // On vérifie que la confirmation a été demandée une seule fois.
    expect(confirmMock).toHaveBeenCalledTimes(1);

    // On vérifie le message de confirmation.
    expect(confirmMock).toHaveBeenCalledWith(
      "Voulez-vous vraiment annuler cette demande d'achat ?",
    );

    // On vérifie que la fonction d'annulation a été appelée une fois.
    expect(cancelDemandeAchatRequest).toHaveBeenCalledTimes(1);

    // On vérifie que la bonne demande et le bon token ont été envoyés.
    expect(cancelDemandeAchatRequest).toHaveBeenCalledWith(
      10,
      "faux-token-jwt",
    );

    // On vérifie que le statut Annulée est affiché.
    expect(cancelledStatus).toBeInTheDocument();

    // On vérifie que l'ancien statut n'est plus affiché.
    expect(
      screen.queryByText("En attente"),
    ).not.toBeInTheDocument();

    // On vérifie que le bouton Annuler a disparu.
    expect(
      screen.queryByRole("button", {
        name: "Annuler",
      }),
    ).not.toBeInTheDocument();

    // On vérifie que le lien de conversation a disparu.
    expect(
      screen.queryByRole("link", {
        name: "Échanger avec le vendeur",
      }),
    ).not.toBeInTheDocument();

    // On vérifie que le lien vers l'annonce reste disponible.
    expect(
      screen.getByRole("link", {
        name: "Voir l'annonce",
      }),
    ).toHaveAttribute(
      "href",
      "/annonces/101",
    );
  });

  // Sixième test.
  it("n'annule pas la demande lorsque l'utilisateur refuse la confirmation", async () => {
    // =========================
    // ARRANGE : Préparation
    // =========================

    // On prépare l'outil qui simule les actions de l'utilisateur.
    const user = userEvent.setup();

    // On indique que le backend retourne une demande en attente.
    getMyDemandesAchatRequest.mockResolvedValue([
      demandeEnAttente,
    ]);

    // On surveille la boîte de confirmation du navigateur.
    const confirmMock = vi
      .spyOn(window, "confirm")
      .mockReturnValue(false);

    // On affiche la page.
    renderPurchaseRequestsPage();

    // On attend que la demande soit affichée.
    await screen.findByRole("heading", {
      name: "Vélo de ville",
    });

    // On recherche le bouton Annuler.
    const cancelButton = screen.getByRole("button", {
      name: "Annuler",
    });

    // =========================
    // ACT : Action
    // =========================

    // On clique sur le bouton Annuler.
    await user.click(cancelButton);

    // =========================
    // ASSERT : Vérifications
    // =========================

    // On vérifie que la confirmation a été demandée une seule fois.
    expect(confirmMock).toHaveBeenCalledTimes(1);

    // On vérifie le message de confirmation.
    expect(confirmMock).toHaveBeenCalledWith(
      "Voulez-vous vraiment annuler cette demande d'achat ?",
    );

    // On vérifie que l'API d'annulation n'a pas été appelée.
    expect(cancelDemandeAchatRequest).not.toHaveBeenCalled();

    // On vérifie que le statut reste En attente.
    expect(
      screen.getByText("En attente"),
    ).toBeInTheDocument();

    // On vérifie que le statut Annulée n'est pas affiché.
    expect(
      screen.queryByText("Annulée"),
    ).not.toBeInTheDocument();

    // On vérifie que le bouton Annuler reste affiché.
    expect(
      screen.getByRole("button", {
        name: "Annuler",
      }),
    ).toBeInTheDocument();

    // On vérifie que le lien de conversation reste affiché.
    expect(
      screen.getByRole("link", {
        name: "Échanger avec le vendeur",
      }),
    ).toHaveAttribute(
      "href",
      "/messages/demande/10",
    );
  });
});