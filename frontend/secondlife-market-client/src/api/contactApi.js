// On récupère l’adresse de notre API depuis le fichier .env.
const API_URL = import.meta.env.VITE_API_URL;

// On crée une fonction qui envoie le formulaire de contact.
export async function sendContactMessage(contactData) {
  // On envoie une requête vers la route POST /api/Contact.
  const response = await fetch(`${API_URL}/Contact`, {
    // On précise que nous envoyons des données.
    method: "POST",

    // On indique que les données envoyées sont au format JSON.
    headers: {
      "Content-Type": "application/json",
    },

    // On transforme les données JavaScript en texte JSON.
    body: JSON.stringify(contactData),
  });

  // On récupère la réponse JSON envoyée par le backend.
  const responseData = await response.json();

  // Si le backend retourne une erreur, on interrompt l’envoi.
  if (!response.ok) {
    // On transmet le message retourné par le backend.
    throw new Error(
      responseData.message ||
        "Impossible d’envoyer le message pour le moment."
    );
  }

  // On retourne la réponse lorsque l’envoi a réussi.
  return responseData;
}