import api from "./api";



api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getDemandeValidation = async (num) => {
    const response = await api.get(
        `/demandes-liquidation/${num}/validation`
    );

    return response.data;
};


export const validerDemande = async (num, data) => {
    const response = await api.put(
        `/demandes-liquidation/${num}/validation`,
        data
    );

    return response.data;
};

/*
 * Vérifier si un affilié existe avec son matricule
 */
export const verifierMatricule = async (matricule) => {
  const response = await api.get(
    `/affilies/matricule/${encodeURIComponent(matricule)}`
  );

  return response.data;
};


/*
 * Créer une demande de liquidation
 */
export const creerDemandeLiquidation = async (request) => {
  const response = await api.post(
    "/demandes-liquidation",
    request
  );

  return response.data;
};


/*
 * Récupérer une demande
 */
export const getDemandeLiquidation = async (num) => {
  const response = await api.get(
    `/demandes-liquidation/${num}`
  );

  return response.data;
};


/*
 * Supprimer une demande
 */
export const supprimerDemandeLiquidation = async (num) => {
  const response = await api.delete(
    `/demandes-liquidation/delete/${num}`
  );

  return response.data;
};


/*
 * Rechercher les demandes de liquidation
 */
export const rechercherDemandesLiquidation = async ({
  statutDemande,
  mesDemandes,
  affilie,
  numeroDemande,
} = {}) => {
  const params = {};

  if (statutDemande) {
    params.statutDemande = statutDemande;
  }

  if (mesDemandes) {
    params.mesDemandes = true;
  }

  if (affilie?.trim()) {
    params.affilie = affilie.trim();
  }

  if (numeroDemande) {
    params.numeroDemande = numeroDemande;
  }

  const response = await api.get(
    "/demandes-liquidation/recherche",
    { params }
  );

  return response.data;
};


/*
 * Valider la saisie d'une demande
 */
export const validerSaisieDemande = async (num) => {
  const response = await api.put(
    `/demandes-liquidation/${num}/valider-saisie`
  );

  return response.data;
};