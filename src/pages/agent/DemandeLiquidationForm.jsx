import React, { useState } from "react";
import {
  verifierMatricule,
  creerDemandeLiquidation,
  
} from "../../services/DemandeLiquidationService";
import "./DemandeLiquidationForm.css";


const DemandeLiquidation = () => {
  // =========================================================
  // MATRICULE / AFFILIE
  // =========================================================

  const [matricule, setMatricule] = useState("");
  const [conflitDates, setConflitDates] = useState("");

  const [affilie, setAffilie] = useState(null);
  const [saisieAutorisee, setSaisieAutorisee] = useState(false);

  const [conjoints, setConjoints] = useState([]);
const [enfants, setEnfants] = useState([]);

  // =========================================================
  // MESSAGES
  // =========================================================

  const [message, setMessage] = useState("");
  const [typeMessage, setTypeMessage] = useState("");

  // =========================================================
  // FORMULAIRE DEMANDE
  // =========================================================
  const initialFormData = {
  dateDemande: "",
  ville: "",
  codePostal: "",
  gsm: "",
  fax: "",
  telephone: "",
  pays: "",
  sexe: "",
  email: "",
  adresse: "",
  statutMatrimonial: "",
  typeLiquidation: "",
  nomAgence: "",
  adresseAgence: "",
  rib: "",
  villeAgence: "",
  typePaiement: "",
  dateDepart: "",
  dateCessationActivite: "",
};

  const [formData, setFormData] = useState(initialFormData);


  // =========================================================
  // MODIFICATION MATRICULE
  // =========================================================

 const handleMatriculeChange = (e) => {
  const nouveauMatricule = e.target.value;

  setMatricule(nouveauMatricule);

  // Réinitialiser l'ancien affilié
  setAffilie(null);

  // Empêcher la saisie tant que le nouveau matricule
  // n'est pas vérifié
  setSaisieAutorisee(false);

  // Réinitialiser les messages
  setMessage("");
  setTypeMessage("");

  // Réinitialiser les informations de la famille
  setEnfants([]);
  setConjoints([]);

  // Réinitialiser TOUS les champs du formulaire
  setFormData(initialFormData);
};

  // =========================================================
  // VERIFICATION MATRICULE + STATUT + AGE
  // =========================================================

  const verifier = async () => {
    if (!matricule.trim()) {
      setAffilie(null);
      setSaisieAutorisee(false);
      setMessage("Veuillez saisir un matricule.");
      setTypeMessage("error");
      return;
    }

    try {
      const data = await verifierMatricule(matricule.trim());

      setAffilie(data);

      if( data.dateCessationActivite > data.dateDepart) {
        setConflitDates("La date de cessation d'activité est postérieure à la date de départ. Veuillez vérifier les dates.");
        setSaisieAutorisee(false);
        setMessage(
          "La date de cessation d'activité est postérieure à la date de départ. Veuillez vérifier les dates."
        );
        setTypeMessage("error");
        return;
      }

      // -----------------------------------------------------
      // CALCUL AGE
      // -----------------------------------------------------

      if (!data.dateNaissance) {
        setSaisieAutorisee(false);
        setMessage(
          "La date de naissance de cet affilié est introuvable."
        );
        setTypeMessage("error");
        return;
      }

      const naissance = new Date(data.dateNaissance);
      const aujourdHui = new Date();

      let age =
        aujourdHui.getFullYear() -
        naissance.getFullYear();

      const mois =
        aujourdHui.getMonth() -
        naissance.getMonth();

      if (
        mois < 0 ||
        (mois === 0 &&
          aujourdHui.getDate() < naissance.getDate())
      ) {
        age--;
      }

      // -----------------------------------------------------
      // STATUT LIQUIDEE
      // -----------------------------------------------------

      if (data.statut === "LIQUIDEE") {
        setSaisieAutorisee(false);

        setMessage(
          "Cet affilié est déjà liquidé. Une nouvelle demande de liquidation est impossible."
        );
        setTypeMessage("error");
        return;
      }

      // -----------------------------------------------------
      // AGE < 50
      // -----------------------------------------------------

      if (age < 50) {
        setSaisieAutorisee(false);
        setMessage(
          `L'affilié a ${age} ans. Il doit avoir au moins 50 ans pour poursuivre la demande.`
        );
        setTypeMessage("error");
        return;
      }

      // -----------------------------------------------------
      // ACTIF + AGE >= 50
      // -----------------------------------------------------

      setSaisieAutorisee(true);
      
      setMessage(
        `Affilié vérifié avec succès. Âge : ${age} ans.`
      );

      setTypeMessage("success");

    } catch (error) {
      setAffilie(null);
      setSaisieAutorisee(false);
      setEnfants([]);
      setMessage(
        error.response?.data?.message ||
        "Aucun affilié trouvé avec ce matricule."
      );

      setTypeMessage("error");
    }
  };

  // =========================================================
  // MODIFICATION DES CHAMPS
  // =========================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

const ajouterEnfant = () => {
  setEnfants([
    ...enfants,
    {
      nom: "",
      prenom: "",
      dateNaissance: "",
      handicap: false,
      scolarise: false,
      marie: false,
    },
  ]);
};

const supprimerEnfant = (index) => {
  setEnfants(enfants.filter((_, i) => i !== index));
};

const modifierEnfant = (index, field, value) => {
  const nouveauxEnfants = [...enfants];

  nouveauxEnfants[index][field] = value;

  setEnfants(nouveauxEnfants);
};


const ajouterConjoint = () => {
  if (conjoints.length >= 4) {
    return;
  }

  setConjoints([
    ...conjoints,
    {
      nom: "",
      prenom: "",
      cin: "",
      dateMariage: "",
    },
  ]);
};

const supprimerConjoint = (index) => {
  setConjoints(conjoints.filter((_, i) => i !== index));
};

const modifierConjoint = (index, field, value) => {
  const nouveauxConjoints = [...conjoints];

  nouveauxConjoints[index][field] = value;

  setConjoints(nouveauxConjoints);
};

  // =========================================================
  // STATUT MATRIMONIAL
  // =========================================================

  const afficherFamille =
    formData.statutMatrimonial === "MARIE" ||
    formData.statutMatrimonial === "VEUF";


    // Vérification du sexe saisi avec le sexe réel de l'affilié
    const verifierSexe = () => {
    if (!affilie) {
      return {
        valide: false,
        message: "Veuillez d'abord vérifier le matricule de l'affilié."
      };
  }

  if (!formData.sexe) {
    return {
      valide: false,
      message: "Veuillez sélectionner le sexe."
    };
  }

  if (formData.sexe !== affilie.sexe) {
    return {
      valide: false,
      message: "Le sexe saisi ne correspond pas au sexe de l'affilié."
    };
  }
  return { valide: true };
};


// Vérification des CIN des conjoints
const verifierConjoints = () => {
  for (let i = 0; i < conjoints.length; i++) {
    const conjoint = conjoints[i];

    // CIN obligatoire
    if (!conjoint.cin || conjoint.cin.trim() === "") {
      return {
        valide: false,
        message: `Veuillez saisir le CIN du conjoint ${i + 1}.`
      };
    }

    // CIN doit contenir exactement 9 caractères
    if (conjoint.cin.trim().length !== 9) {
      return {
        valide: false,
        message: `Le CIN du conjoint ${i + 1} doit contenir exactement 9 caractères.`
      };
    }

    // Autoriser uniquement les caractères alphanumériques
    if (!/^[A-Za-z0-9]{9}$/.test(conjoint.cin.trim())) {
      return {
        valide: false,
        message: `Le CIN du conjoint ${i + 1} doit contenir uniquement 9 caractères alphanumériques.`
      };
    }
  }

  return { valide: true };
};


// Vérification de l'email
const verifierEmail = () => {
  if (!formData.email || formData.email.trim() === "") {
    return {
      valide: false,
      message: "Veuillez saisir votre adresse email."
    };
  }

  // Vérification simple du format email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(formData.email.trim())) {
    return {
      valide: false,
      message: "Veuillez saisir une adresse email valide contenant @."
    };
  }

  return { valide: true };
};


  // =========================================================
  // SUBMIT
  // =========================================================


  const handleSubmit = async (e) => {
    e.preventDefault();
    // -------------------------------------------------------
    // VERIFICATIONS
    // -------------------------------------------------------
    if (!affilie) {
      setMessage(
        "Veuillez d'abord vérifier le matricule."
      );
      setTypeMessage("error");
      return;
    }
    if (!saisieAutorisee) {
      setMessage(
        "La demande ne peut pas être créée pour cet affilié."
      );
      setTypeMessage("error");
      return;
    }
    if (affilie.statut !== "ACTIF") {
      setMessage(
        "L'affilié n'est pas actif."
      );
      setTypeMessage("error");
      return;
    }

    if (!affilie.dateNaissance) {
      setMessage(
        "La date de naissance de l'affilié est obligatoire."
      );
      setTypeMessage("error");
      return;
    }

    // -------------------------------------------------------
    // VERIFICATION AGE
    // -------------------------------------------------------

    const naissance = new Date(
      affilie.dateNaissance
    );

    const aujourdHui = new Date();

    let age =
      aujourdHui.getFullYear() -
      naissance.getFullYear();

    const mois =
      aujourdHui.getMonth() -
      naissance.getMonth();

    if (
      mois < 0 ||
      (mois === 0 &&
        aujourdHui.getDate() < naissance.getDate())
    ) {
      age--;
    }

    if (age < 50) {
      setMessage(
        "L'affilié doit avoir au moins 50 ans."
      );
      setTypeMessage("error");
      return;
    }
      // ==============================
      // Vérification du sexe
      // ==============================
      const resultatSexe = verifierSexe();

      if (!resultatSexe.valide) {
     setMessage(resultatSexe.message);
     setTypeMessage("error");
       return;
      }

    // ==============================
    // Vérification de l'email
    // ==============================
    const resultatEmail = verifierEmail();

   if (!resultatEmail.valide) {
    setMessage(resultatEmail.message);
    setTypeMessage("error");
  return;
}

if (afficherFamille && conjoints.length > 0) {
  const resultatConjoints = verifierConjoints();

  if (!resultatConjoints.valide) {
    setMessage(resultatConjoints.message);
    setTypeMessage("error");
    return;
  }
}

    // -------------------------------------------------------
    // DONNEES ENVOYEES
    // -------------------------------------------------------

    const data = {
      ...formData,
      matricule: matricule.trim(),
      // Pour le moment, les enfants sont ajoutés
      // dans le JSON. Le backend devra accepter ce champ.
      ...(afficherFamille && {
        enfants: enfants,
        conjoints: conjoints,
      }),
    };
  // Assurez-vous que le numéro de demande est stocké dans formData
 try {
    const resultat = await creerDemandeLiquidation(data);

    // ==============================
    // RÉINITIALISATION
    // ==============================

    setFormData(initialFormData);
    setMatricule("");
    setAffilie(null);
    setSaisieAutorisee(false);
    setEnfants([]);
    setConjoints([]);

    setMessage("Demande de liquidation créée avec succès.");
    setTypeMessage("success");

    console.log("Demande créée :", resultat);

 }catch (error) {
    console.error("Erreur création demande :", error);

    alert(
        error.response?.data?.message ||
        error.response?.data ||
        "Une erreur est survenue lors de la création de la demande."
    );
}

} 
 // =========================================================
  // RENDER
  // =========================================================

  return (
   
    
    <div className="demande-liquidation-page">

      {/* =====================================================
          TITRE
      ===================================================== */}

      <div className="page-header">

        <h1>
          Nouvelle demande de liquidation
        </h1>

        <p>
          Vérifiez l'affilié avant de saisir la demande.
        </p>

      </div>

      {/* =====================================================
          MATRICULE
      ===================================================== */}

      <div className="verification-card">

        <h2>
          Vérification de l'affilié
        </h2>

        <div className="matricule-row">

          <div className="form-group">

            <label htmlFor="matricule">
              Matricule
            </label>

            <input
              id="matricule"
              type="text"
              value={matricule}
              onChange={handleMatriculeChange}
              placeholder="Ex : AFF00001"
            />

          </div>

          <button
            type="button"
            className="btn-verifier"
            onClick={verifier}
          >
            Vérifier
          </button>

        </div>

        {/* MESSAGE */}

        {message && (
          <div
            className={`message ${typeMessage}`}
          >
            {message}
          </div>
        )}

      </div>

      {/* =====================================================
          INFORMATIONS AFFILIE
      ===================================================== */}

      {affilie && (

        <div className="affilie-card">

          <div className="card-header">

            <h2>
              Informations de l'affilié
            </h2>

          </div>

          <div className="affilie-grid">

            <div className="info-item">
              <label>Matricule</label>
              <span>
                {affilie.matricule}
              </span>
            </div>

            <div className="info-item">
              <label>CIN</label>
              <span>
                {affilie.cin}
              </span>
            </div>

            <div className="info-item">
              <label>Nom</label>
              <span>
                {affilie.nom}
              </span>
            </div>

            <div className="info-item">
              <label>Prénom</label>
              <span>
                {affilie.prenom}
              </span>
            </div>

            <div className="info-item">
              <label>Date de naissance</label>
              <span>
                {affilie.dateNaissance}
              </span>
            </div>

            <div className="info-item">
              <label>Sexe</label>
              <span>
                {affilie.sexe === "M"
                  ? "Masculin"
                  : "Féminin"}
              </span>
            </div>

            <div className="info-item">
              <label>Statut</label>

              <span
                className={
                  affilie.statut === "ACTIF"
                    ? "statut-actif"
                    : "statut-liquidee"
                }
              >
                {affilie.statut === "ACTIF"
                  ? "Actif"
                  : "Liquidée"}
              </span>

            </div>

          </div>

        </div>

      )}

      {/* =====================================================
          FORMULAIRE
          SEULEMENT SI ACTIF + AGE >= 50
      ===================================================== */}

      {saisieAutorisee && affilie && (
        <form
          className="liquidation-form"
          onSubmit={handleSubmit}
        >
          {/* =================================================
              INFORMATIONS PERSONNELLES
          ================================================= */}

          <section className="form-section">

            <div className="section-title">

              <h2>
                Informations personnelles
              </h2>

            </div>
            <div className="form-grid">
              {/* DATE DEMANDE */}
              <div className="form-group">
                <label>
                  Date de demande
                </label>
                <input
                  type="date"
                  name="dateDemande"
                  value={formData.dateDemande}
                  onChange={handleChange}
                />
              </div>
              {/* SEXE */}
              <div className="form-group">
                <label>
                  Sexe
                </label>
                <select
                  name="sexe"
                  value={formData.sexe}
                  onChange={handleChange}
                  required
                >
                <option value="">
                    Sélectionner
                </option>
                <option value="M">
                    Masculin
                </option>
                <option value="F">
                    Féminin
                </option>
                </select>
              </div>

              {/* VILLE */}

              <div className="form-group">

                <label>
                  Ville
                </label>

                <input
                  type="text"
                  name="ville"
                  value={formData.ville}
                  onChange={handleChange}
                />

              </div>

              {/* CODE POSTAL */}

              <div className="form-group">

                <label>
                  Code postal
                </label>

                <input
                  type="text"
                  name="codePostal"
                  value={formData.codePostal}
                  onChange={handleChange}
                />

              </div>

              {/* GSM */}

              <div className="form-group">

                <label>
                  GSM
                </label>

                <input
                  type="text"
                  name="gsm"
                  value={formData.gsm}
                  onChange={handleChange}
                />

              </div>

              {/* FAX */}

              <div className="form-group">

                <label>
                  Fax
                </label>

                <input
                  type="text"
                  name="fax"
                  value={formData.fax}
                  onChange={handleChange}
                />

              </div>

              {/* TELEPHONE */}

              <div className="form-group">

                <label>
                  Téléphone
                </label>

                <input
                  type="text"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleChange}
                />

              </div>

              {/* PAYS */}

              <div className="form-group">

                <label>
                  Pays
                </label>

                <input
                  type="text"
                  name="pays"
                  value={formData.pays}
                  onChange={handleChange}
                />

              </div>

              {/* EMAIL */}

              <div className="form-group">

                <label>
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />

              </div>

              {/* ADRESSE */}

              <div className="form-group full-width">
                <label>
                  Adresse
                </label>

                <textarea
                  name="adresse"
                  value={formData.adresse}
                  onChange={handleChange}
                  rows="3"
                />

              </div>

            </div>

          </section>

          {/* =================================================
              SITUATION FAMILIALE
          ================================================= */}

          <section className="form-section">

            <div className="section-title">

              <h2>
                Situation familiale
              </h2>

            </div>

            <div className="form-grid">

              <div className="form-group">

                <label>
                  Statut matrimonial
                </label>

                <select
                  name="statutMatrimonial"
                  value={formData.statutMatrimonial}
                  onChange={handleChange}
                  required
                >

                  <option value="">
                    Sélectionner
                  </option>

                  <option value="CELIBATAIRE">
                    Célibataire
                  </option>

                  <option value="MARIE">
                    Marié(e)
                  </option>

                  <option value="VEUF">
                    Veuf / Veuve
                  </option>

                  <option value="DIVORCE">
                    Divorcé(e)
                  </option> 

                </select>

              </div>

            </div>

          </section>

          {/* =================================================
              CONJOINT + ENFANTS
              MARIE OU VEUF UNIQUEMENT
          ================================================= */}

          {afficherFamille && (
            <section className="form-section famille-section">

              <div className="section-title">

                <h2>
                  Situation familiale détaillée
                </h2>

              </div>

            {/* =============================================
    CONJOINT
============================================= */}

<div className="conjoint-section">

  <div className="enfants-header">
    <h3>
      Conjoints
    </h3>

    <button
      type="button"
      className="btn-add"
      onClick={ajouterConjoint}
      disabled={conjoints.length >= 4}
    >
      + Ajouter un conjoint
    </button>
  </div>

  {conjoints.length === 0 && (
    <div className="info-message">
      Aucun conjoint ajouté.
    </div>
  )}

  {conjoints.map((conjoint, index) => (

    <div
      className="enfant-card"
      key={index}
    >

      <div className="enfant-header">

        <h4>
          Conjoint {index + 1}
        </h4>

        <button
          type="button"
          className="btn-delete"
          onClick={() =>
            supprimerConjoint(index)
          }
        >
          Supprimer
        </button>

      </div>

      <div className="form-grid">

        {/* NOM */}

        <div className="form-group">

          <label>
            Nom
          </label>

          <input
            type="text"
            value={conjoint.nom}
            onChange={(e) =>
              modifierConjoint(
                index,
                "nom",
                e.target.value
              )
            }
            required
          />

        </div>

        {/* PRENOM */}

        <div className="form-group">

          <label>
            Prénom
          </label>

          <input
            type="text"
            value={conjoint.prenom}
            onChange={(e) =>
              modifierConjoint(
                index,
                "prenom",
                e.target.value
              )
            }
            required
          />

        </div>

        {/* CIN */}

        <div className="form-group">

          <label>
            CIN
          </label>

          <input
            type="text"
            value={conjoint.cin}
            onChange={(e) =>
              modifierConjoint(
                index,
                "cin",
                e.target.value
              )
            }
            required
          />

        </div>

        {/* DATE MARIAGE */}

        <div className="form-group">

          <label>
            Date de mariage
          </label>

          <input
            type="date"
            value={conjoint.dateMariage}
            onChange={(e) =>
              modifierConjoint(
                index,
                "dateMariage",
                e.target.value
              )
            }
            required
          />

        </div>

      </div>

    </div>

  ))}

</div>
        {/* =============================================
                  ENFANTS
         ============================================= */}
           <div className="enfants-section">
           <div className="enfants-header">
            <h3>
               Enfants
                  </h3>
                  <button
                    type="button"
                    className="btn-add"
                    onClick={ajouterEnfant}
                  >
                    + Ajouter un enfant
                  </button>

                </div>

                {enfants.length === 0 && (

                  <div className="empty-enfants">
                    Aucun enfant ajouté.
                  </div>

                )}

                {enfants.map(
                  (enfant, index) => (

                    <div
                      className="enfant-card"
                      key={index}
                    >

                      <div className="enfant-header">

                        <h4>
                          Enfant {index + 1}
                        </h4>

                        <button
                          type="button"
                          className="btn-delete"
                          onClick={() =>
                            supprimerEnfant(index)
                          }
                        >
                          Supprimer
                        </button>

                      </div>

                      <div className="form-grid">

                        {/* NOM */}

                        <div className="form-group">

                          <label>
                            Nom
                          </label>

                          <input
                            type="text"
                            value={enfant.nom}
                            onChange={(e) =>
                              modifierEnfant(
                                index,
                                "nom",
                                e.target.value
                              )
                            }
                          />

                        </div>

                        {/* PRENOM */}

                        <div className="form-group">

                          <label>
                            Prénom
                          </label>

                          <input
                            type="text"
                            value={enfant.prenom}
                            onChange={(e) =>
                              modifierEnfant(
                                index,
                                "prenom",
                                e.target.value
                              )
                            }
                          />
                        </div>

                        {/* DATE NAISSANCE */}

                        <div className="form-group">

                          <label>
                            Date de naissance
                          </label>

                          <input
                            type="date"
                            value={
                              enfant.dateNaissance
                            }
                            onChange={(e) =>
                              modifierEnfant(
                                index,
                                "dateNaissance",
                                e.target.value
                              )
                            }
                          />

                        </div>

                        {/* HANDICAP */}

                        <div className="checkbox-group">

                          <label>

                            <input
                              type="checkbox"
                              checked={
                                enfant.handicap
                              }
                              onChange={(e) =>
                                modifierEnfant(
                                  index,
                                  "handicap",
                                  e.target.checked
                                )
                              }
                            />

                            Handicapé

                          </label>

                        </div>

                        {/* SCOLARISE */}

                        <div className="checkbox-group">

                          <label>

                            <input
                              type="checkbox"
                              checked={
                                enfant.scolarise
                              }
                              onChange={(e) =>
                                modifierEnfant(
                                  index,
                                  "scolarise",
                                  e.target.checked
                                )
                              }/>

                            Scolarisé

                          </label>

                        </div>

                        {/* MARIE */}

                        <div className="checkbox-group">

                          <label>

                            <input
                              type="checkbox"
                              checked={
                                enfant.marie
                              }
                              onChange={(e) =>
                                modifierEnfant(
                                  index,
                                  "marie",
                                  e.target.checked
                                )
                              }
                            />

                            Marié

                          </label>

                        </div>

                      </div>

                    </div>

                  )
                )}

              </div>

            </section>

          )}

          {/* =================================================
              LIQUIDATION
          ================================================= */}

          <section className="form-section">

            <div className="section-title">

              <h2>
                Informations de liquidation
              </h2>

            </div>

            <div className="form-grid">

              {/* TYPE LIQUIDATION */}

              <div className="form-group">

                <label>
                  Type de liquidation
                </label>

                <select
                  name="typeLiquidation"
                  value={formData.typeLiquidation}
                  onChange={handleChange}
                >

                  <option value="">
                    Sélectionner
                  </option>

                  <option value="EN_CAPITAL">
                    En capital
                  </option>

                  <option value="MIXTE">
                    Mixte
                  </option>

                  <option value="SANS_OPTION">
                    Sans option
                  </option>

                </select>

              </div>

              {/* DATE DEPART */}

              <div className="form-group">

                <label>
                  Date de départ
                </label>

                <input
                  type="date"
                  name="dateDepart"
                  value={formData.dateDepart}
                  onChange={handleChange}
                />

              </div>

              {/* DATE CESSATION */}

              <div className="form-group">

                <label>
                  Date de cessation d'activité
                </label>

                <input
                  type="date"
                  name="dateCessationActivite"
                  value={
                    formData.dateCessationActivite
                  }
                  onChange={handleChange}
                />

              </div>

            </div>

          </section>

          {/* =================================================
              AGENCE
          ================================================= */}

          <section className="form-section">

            <div className="section-title">

              <h2>
                Informations paiement [agence]
              </h2>

            </div>

            <div className="form-grid">

              {/* NOM AGENCE */}

              <div className="form-group">

                <label>
                  Nom agence
                </label>

                <input
                  type="text"
                  name="nomAgence"
                  value={formData.nomAgence}
                  onChange={handleChange}
                />
              </div>

              {/* VILLE AGENCE */}

              <div className="form-group">
                <label>
                  Ville agence
                </label>
                <input
                  type="text"
                  name="villeAgence"
                  value={formData.villeAgence}
                  onChange={handleChange}
                />
              </div>

              {/* ADRESSE AGENCE */}

              <div className="form-group full-width">
                <label>
                  Adresse agence
                </label>
                <textarea
                  name="adresseAgence"
                  value={formData.adresseAgence}
                  onChange={handleChange}
                  rows="3"
                />
              </div>
            </div>
          </section>
          {/* =================================================
              PAIEMENT
          ================================================= */}

          <section className="form-section">

            <div className="section-title">

              <h2>
                Informations de paiement [compte bancaire]
              </h2>

            </div>

            <div className="form-grid">

              {/* TYPE PAIEMENT */}

              <div className="form-group">

                <label>
                  Type de paiement
                </label>

                <select name="typePaiement" value={formData.typePaiement} onChange={handleChange} required>

                 <option value="">
                    Sélectionner
                  </option>

                  <option value="VIREMENT_MAROC">
                    Virement Maroc
                  </option>

                  <option value="VIREMENT_ETRANGER">
                    Virement étranger
                  </option>
                </select>
              </div>
              {/* RIB */}
              <div className="form-group">

                <label>
                  RIB
                </label>

                <input
                  type="text"
                  name="rib"
                  value={formData.rib}
                  onChange={handleChange}
                />

              </div>

            </div>

          </section>

          {/* =================================================
              SUBMIT
          ================================================= */}

          <div className="form-actions">

            <button type="submit" className="btn-submit">
              Créer la demande
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
export default DemandeLiquidation;