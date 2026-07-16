const API_URL = import.meta.env.VITE_API_URL;

async function readResponseData(response) {
  const text = await response.text();
  return text ? JSON.parse(text) : {};
}

export async function getConversationsRequest(accessToken) {
  const response = await fetch(`${API_URL}/Conversations`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await readResponseData(response);

  if (!response.ok) {
    throw new Error(data.message || "Impossible de charger les conversations.");
  }

  return data;
}

export async function getOrCreateConversationRequest(demandeAchatId, accessToken) {
  const response = await fetch(`${API_URL}/Conversations/demande/${demandeAchatId}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await readResponseData(response);

  if (!response.ok) {
    throw new Error(data.message || "Impossible d'ouvrir la conversation.");
  }

  return data;
}
