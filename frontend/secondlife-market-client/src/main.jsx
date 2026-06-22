// On importe React pour utiliser React.
import React from "react";

// On importe ReactDOM pour afficher l'application.
import ReactDOM from "react-dom/client";

// On importe le composant principal.
import App from "./App.jsx";

// On importe le CSS global.
import "./styles/global.css";

// On récupère l'élément root dans index.html.
const rootElement = document.getElementById("root");

// On crée la racine React.
const root = ReactDOM.createRoot(rootElement);

// On affiche l'application.
root.render(
  // On affiche App sans React.StrictMode pour éviter le double appel de useEffect en développement.
  <App />
);