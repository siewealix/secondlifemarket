// On importe useEffect pour vérifier le formulaire en temps réel.
import { useEffect } from "react";

// On importe useState pour stocker les données du formulaire.
import { useState } from "react";

// On crée un hook réutilisable pour gérer les formulaires.
function useForm(initialValues, validate) {
  // On stocke les valeurs saisies dans le formulaire.
  const [values, setValues] = useState(initialValues);

  // On stocke les erreurs du formulaire.
  const [errors, setErrors] = useState(validate(initialValues));

  // On stocke les champs déjà touchés par l'utilisateur.
  const [touched, setTouched] = useState({});

  // On stocke l'état de soumission.
  const [isSubmitting, setIsSubmitting] = useState(false);

  // On stocke si l'utilisateur a déjà essayé de soumettre le formulaire.
  const [isSubmitted, setIsSubmitted] = useState(false);

  // On vérifie le formulaire automatiquement dès qu'une valeur change.
  useEffect(() => {
    // On récupère les erreurs actuelles.
    const currentErrors = validate(values);

    // On met à jour les erreurs en temps réel.
    setErrors(currentErrors);
  }, [values, validate]);

  // On vérifie si le formulaire est valide.
  const isValid = Object.keys(errors).length === 0;

  // On vérifie si le formulaire peut être soumis.
  const canSubmit = isValid && !isSubmitting;

  // On met à jour un champ quand l'utilisateur écrit.
  const handleChange = (event) => {
    // On récupère le nom du champ.
    const name = event.target.name;

    // On récupère la valeur saisie.
    const value = event.target.value;

    // On met à jour les valeurs du formulaire.
    setValues((currentValues) => ({
      // On garde les anciennes valeurs.
      ...currentValues,

      // On remplace seulement la valeur du champ modifié.
      [name]: value,
    }));

    // On marque le champ comme touché.
    setTouched((currentTouched) => ({
      // On garde les anciens champs touchés.
      ...currentTouched,

      // On indique que ce champ a été touché.
      [name]: true,
    }));
  };

  // On marque un champ comme touché quand l'utilisateur le quitte.
  const handleBlur = (event) => {
    // On récupère le nom du champ.
    const name = event.target.name;

    // On marque le champ comme touché.
    setTouched((currentTouched) => ({
      // On garde les anciens champs touchés.
      ...currentTouched,

      // On indique que ce champ a été quitté.
      [name]: true,
    }));
  };

  // On récupère l'erreur visible d'un champ.
  const getError = (name) => {
    // On affiche l'erreur si le champ est touché ou si le formulaire a été soumis.
    if (touched[name] || isSubmitted) return errors[name];

    // On cache l'erreur si le champ n'est pas encore touché.
    return "";
  };

  // On gère la soumission du formulaire.
  const handleSubmit = (callback) => {
    // On retourne une fonction utilisable dans onSubmit.
    return async (event) => {
      // On empêche le rechargement de la page.
      event.preventDefault();

      // On indique que l'utilisateur a essayé de soumettre le formulaire.
      setIsSubmitted(true);

      // On vérifie encore une fois les erreurs.
      const currentErrors = validate(values);

      // On met à jour les erreurs.
      setErrors(currentErrors);

      // On vérifie s'il y a au moins une erreur.
      const hasErrors = Object.keys(currentErrors).length > 0;

      // On bloque l'envoi s'il y a une erreur.
      if (hasErrors) return;

      // On indique que le formulaire est en cours d'envoi.
      setIsSubmitting(true);

      // On exécute l'action prévue.
      await callback(values);

      // On indique que l'envoi est terminé.
      setIsSubmitting(false);
    };
  };

  // On retourne tout ce dont le formulaire a besoin.
  return {
    // On retourne les valeurs.
    values,

    // On retourne les erreurs.
    errors,

    // On retourne l'état de soumission.
    isSubmitting,

    // On retourne la validité du formulaire.
    isValid,

    // On retourne si le formulaire peut être soumis.
    canSubmit,

    // On retourne la fonction de changement.
    handleChange,

    // On retourne la fonction de sortie du champ.
    handleBlur,

    // On retourne la fonction pour récupérer une erreur visible.
    getError,

    // On retourne la fonction de soumission.
    handleSubmit,
  };
}

// On exporte le hook.
export default useForm;