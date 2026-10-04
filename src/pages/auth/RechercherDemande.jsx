import React, { useState } from "react";
import "./RecherchezDemandePage.css";
import api from "../../services/api";
import AuthService from "../../services/AuthService";
import { useNavigate } from "react-router-dom";

/**
 * RecherchezDemandePage
 * ----------------------------------------------------------------
 * Recherche d'une DemandeLiquidation par son numéro (num), puis
 * affichage du dossier complet de l'affilié.
 *
 * Endpoint : GET /api/demandes-liquidation/{num}/dossier-complet
 * Réponse  : DemandeLiquidationDossierDTO (voir backend)
 * {
 *   num, dateDemande, statut, typeLiquidation, baseLiquidation,
 *
 *   ficheSignaletique: {              // AffilieResponseDTO
 *     id, matricule, cin, nom, prenom, dateNaissance, adresse, email,
 *     ville, gsm, fax, pays, sexe, statut, dateCessationAct, nombreEnfants
 *   },
 *
 *   enfants: [{ id, nom, prenom, dateNaissance, activite }],
 *
 *   assurancesLibelles: string[],     // organismes concernés par l'option en capital
 *
 *   declarationSalaires: [{
 *     id, adherentId, adherentRaisonSociale, categorie, typeRegime,
 *     dateEmbauche, depart, montant, tauxContribution,
 *     montantContribution, salaireNet
 *   }],
 *
 *   modesPaiement: [{
 *     id, libelle, agenceName, adresseAgence, villeAgence, rib, typeVirement
 *   }],
 *
 *   cotisationsSalariales: [{
 *     codeAssurance, nomAssurance, numeroAdherent, adherentNom, periode
 *   }]
 * }
 * ----------------------------------------------------------------
 */


// StatutMatrimonial
const STATUT_LABELS = {
  CELIBATAIRE: "Célibataire",
  MARIE: "Marié(e)",
  VEUF: "Veuf(ve)",
  DIVORCE: "Divorcé(e)",
};

// TypeLiquidation
const TYPE_LIQ_LABELS = {
  EN_CAPITAL: "En capital",
  MIXTE: "Mixte",
  SANS_OPTION: "Sans option",
};

// TypePaiement
const TYPE_PAIEMENT_LABELS = {
  VIREMENT_MAROC: "Virement Maroc",
  VIREMENT_ETRANGER: "Virement étranger",
};

// Sexe
const SEXE_LABELS = {
  MASCULIN: "Masculin",
  FEMININ: "Féminin",
};

// StatutDemande
const STATUT_DEMANDE_LABELS = {
  NOUVELLE: "Nouvelle (non validée)",
  EN_CONTROLE: "En contrôle",
  EN_ATTENTE_PIECES: "En attente de pièces",
  VALIDEE: "Validée",
  REJETEE: "Rejetée",
  ANOMALIE: "Anomalie",
  LIQUIDEE: "Liquidée",
};

// BaseLiquidation — pas de libellé métier connu, affichage brut du code (DBR / DTR)
const BASE_LIQUIDATION_LABELS = {};

function formatMontant(valeur) {
  if (valeur === null || valeur === undefined) return "—";
  return new Intl.NumberFormat("fr-MA", {
    style: "currency",
    currency: "MAD",
    minimumFractionDigits: 2,
  }).format(valeur);
}

function formatDate(dateStr) {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr).toLocaleDateString("fr-FR");
  } catch {
    return dateStr;
  }
}

  

function formatTaux(taux) {
  if (taux === null || taux === undefined) return "—";
  return `${(taux * 100).toFixed(2)} %`;
}

function Section({ title, children, badge }) {
  return (
    <section className="rd-section">
      <div className="rd-section-header">
        <h2>{title}</h2>
        {badge ? <span className="rd-badge">{badge}</span> : null}
      </div>
      <div className="rd-section-body">{children}</div>
    </section>
  );
}

function Field({ label, value }) {
  return (
    <div className="rd-field">
      <span className="rd-field-label">{label}</span>
      <span className="rd-field-value">{value ?? "—"}</span>
    </div>
  );
}

export default function RechercherDemandePage() {
  const [numeroDemande, setNumeroDemande] = useState("");
  const [dossier, setDossier] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [anomalies, setAnomalies] = useState([]);
  const [searched, setSearched] = useState(false);


  const navigate = useNavigate();

  async function suivant() {
         if(AuthService.getRole()=="ADMIN"){
      navigate(`/admin/recherche/validation/${numeroDemande}`);
    }
    if(AuthService.getRole()=="AGENT_SAISIE"){
      navigate(`/agent/recherche/validation/${numeroDemande}`);
    }else{      
      console.log("vous êtes peut être un controleur");
    }
  }


 async function handleSearch(e) {
  e.preventDefault();

  const numero = numeroDemande.trim();

  if (!numero) {
    setError("Veuillez saisir un numéro de demande.");
    return;
  }

  setLoading(true);
  setError(null);
  setSearched(true);
  setDossier(null);
  setAnomalies([]);

  try {
    // 1. Récupérer le dossier complet
    const response = await api.get(
      `/demandes-liquidation/${encodeURIComponent(numero)}/dossier-complet`
    );

    const dossierData = response.data;

    // 2. Stocker le dossier
    setDossier(dossierData);

    // 3. Si le statut est ANOMALIE,
    //    récupérer les anomalies séparément
    if (dossierData.statut === "ANOMALIE") {
      try {
        const anomaliesResponse = await api.get(
          `/anomalies/demande/${dossierData.num}`
        );

        setAnomalies(anomaliesResponse.data);

      } catch (err) {
        console.error("Erreur lors de la récupération des anomalies :", err);

        setAnomalies([]);

        // On ne bloque pas l'affichage du dossier
        // si la récupération des anomalies échoue.
      }
    }

  } catch (err) {
    setDossier(null);
    setAnomalies([]);

    if (err.response?.status === 404) {
      setError(`Aucune demande trouvée pour le numéro "${numero}".`);

    } else if (err.response?.status === 403) {
      setError("Vous n'avez pas les droits pour consulter cette demande.");

    } else {
      setError("Une erreur est survenue lors de la recherche.");
    }

  } finally {
    setLoading(false);
  }
}

  return (
    <div className="rd-page">
      <header className="rd-page-header">
        <h1>Recherche d'une demande de liquidation</h1>
        <p>Consultez le dossier complet d'un affilié à partir du numéro de sa demande.</p>
      </header>

      <form className="rd-search-bar" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="N° de demande (ex: 123)"
          value={numeroDemande}
          onChange={(e) => setNumeroDemande(e.target.value)}
          className="rd-search-input"
        />
        <button type="submit" className="rd-search-button" disabled={loading}>
          {loading ? "Recherche..." : "Rechercher"}
        </button>
      </form>

      {error && <div className="rd-alert rd-alert-error">{error}</div>}

      {!dossier && !loading && !error && searched && (
        <div className="rd-empty-state">Aucun résultat à afficher.</div>
      )}

      {dossier && (
        <div className="rd-dossier">
          <div className="rd-dossier-meta">
            <Field label="N° de demande" value={dossier.num} />
            <Field label="Date de la demande" value={formatDate(dossier.dateDemande)} />
            <Field label="Statut" value={STATUT_DEMANDE_LABELS[dossier.statut] || dossier.statut} />
          </div>

          {/* Fiche signalétique */}
          <Section title="Fiche signalétique">
            <div className="rd-grid">
              <Field label="Matricule affilié" value={dossier.ficheSignaletique?.matricule} />
              <Field label="Nom" value={dossier.ficheSignaletique?.nom} />
              <Field label="Prénom" value={dossier.ficheSignaletique?.prenom} />
              <Field label="CIN" value={dossier.ficheSignaletique?.cin} />
              <Field label="Sexe" value={SEXE_LABELS[dossier.ficheSignaletique?.sexe] || dossier.ficheSignaletique?.sexe} />
              <Field label="Date de naissance" value={formatDate(dossier.ficheSignaletique?.dateNaissance)} />
              <Field label="Pays" value={dossier.ficheSignaletique?.pays} />
              <Field label="Adresse" value={dossier.ficheSignaletique?.adresse} />
              <Field label="Ville" value={dossier.ficheSignaletique?.ville} />
              <Field label="GSM" value={dossier.ficheSignaletique?.gsm} />
              <Field label="Fax" value={dossier.ficheSignaletique?.fax} />
              <Field label="Email" value={dossier.ficheSignaletique?.email} />
              <Field label="Date de cessation d'activité" value={formatDate(dossier.ficheSignaletique?.dateCessationAct)} />
            </div>
          </Section>

          {/* Statut matrimonial et enfants à charge */}
          <Section
            title="Statut matrimonial et enfants à charge"
            badge={STATUT_LABELS[dossier.ficheSignaletique?.statut] || dossier.ficheSignaletique?.statut}
          >
            {dossier.enfants && dossier.enfants.length > 0 ? (
              <table className="rd-table">
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Prénom</th>
                    <th>Date de naissance</th>
                    <th>Activité</th>
                  </tr>
                </thead>
                <tbody>
                  {dossier.enfants.map((enfant) => (
                    <tr key={enfant.id}>
                      <td>{enfant.nom}</td>
                      <td>{enfant.prenom}</td>
                      <td>{formatDate(enfant.dateNaissance)}</td>
                      <td>{enfant.activite || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="rd-muted">Aucun enfant déclaré.</p>
            )}
          </Section>

          {/* Type de liquidation */}
          <Section title="Type de liquidation">
            <div className="rd-grid">
              <Field
                label="Type choisi"
                value={TYPE_LIQ_LABELS[dossier.typeLiquidation] || dossier.typeLiquidation}
              />
              <Field
                label="Base de liquidation"
                value={BASE_LIQUIDATION_LABELS[dossier.baseLiquidation] || dossier.baseLiquidation}
              />
            </div>

            {/* Organismes pertinents uniquement si une option en capital existe */}
            {dossier.typeLiquidation !== "SANS_OPTION" && (
              <div className="rd-subsection">
                <h3>Organismes concernés par l'option en capital</h3>
                {dossier.assurancesLibelles?.length > 0 ? (
                  <ul className="rd-list">
                    {dossier.assurancesLibelles.map((nom, idx) => (
                      <li key={idx}>{nom}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="rd-muted">Aucun organisme renseigné.</p>
                )}
              </div>
            )}
          </Section>

          {/* Déclaration individuelle des salaires */}
          <Section title="Déclaration individuelle des salaires">
            {dossier.declarationSalaires && dossier.declarationSalaires.length > 0 ? (
              <table className="rd-table">
                <thead>
                  <tr>
                    <th>Adhérent employeur</th>
                    <th>Catégorie</th>
                    <th>Type de régime</th>
                    <th>Montant</th>
                    <th>Taux contribution</th>
                    <th>Montant contribution</th>
                    <th>Salaire net</th>
                  </tr>
                </thead>
                <tbody>
                  {dossier.declarationSalaires.map((s) => (
                    <tr key={s.id}>
                      <td>{s.adherentRaisonSociale}</td>
                      <td>{s.categorie}</td>
                      <td>{s.typeRegime}</td>
                      <td>{formatMontant(s.montant)}</td>
                      <td>{formatTaux(s.tauxContribution)}</td>
                      <td>{formatMontant(s.montantContribution)}</td>
                      <td>{formatMontant(s.salaireNet)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="rd-muted">Aucune déclaration de salaire trouvée.</p>
            )}
          </Section>

          {/* Mode de paiement */}
          <Section title="Mode de paiement">
            {dossier.modesPaiement && dossier.modesPaiement.length > 0 ? (
              dossier.modesPaiement.map((mp) => (
                <div className="rd-grid rd-subsection" key={mp.id}>
                  <Field label="Libellé" value={mp.libelle} />
                  <Field
                    label="Type de virement"
                    value={TYPE_PAIEMENT_LABELS[mp.typeVirement] || mp.typeVirement}
                  />
                  <Field label="Agence" value={mp.agenceName} />
                  <Field label="Adresse agence" value={mp.adresseAgence} />
                  <Field label="Ville agence" value={mp.villeAgence} />
                  <Field label="RIB" value={mp.rib} />
                </div>
              ))
            ) : (
              <p className="rd-muted">Aucun mode de paiement renseigné.</p>
            )}
          </Section>
          {/* Anomalies */}
{dossier.statut === "ANOMALIE" && (
  <Section
    title="Anomalies détectées"
    badge={`${anomalies.length} anomalie(s)`}
  >
    {anomalies.length > 0 ? (
      <div className="rd-anomalies">
        {anomalies.map((anomalie) => (
          <div className="rd-anomalie" key={anomalie.id}>
            <div className="rd-anomalie-header">
              <strong>Anomalie #{anomalie.id}</strong>

              {anomalie.dateCreation && (
                <span>
                  {formatDate(anomalie.dateCreation)}
                </span>
              )}
            </div>

            <p>{anomalie.description}</p>
          </div>
        ))}
      </div>
    ) : (
      <p className="rd-muted">
        Aucune anomalie enregistrée pour cette demande.
      </p>
    )}
  </Section>
)}

          {/* Déclaration de situation des cotisations salariales */}
          <Section title="Déclaration de situation des cotisations salariales">
            {dossier.cotisationsSalariales && dossier.cotisationsSalariales.length > 0 ? (
              <table className="rd-table">
                <thead>
                  <tr>
                    <th>Code assurance</th>
                    <th>Assurance</th>
                    <th>N° Adhérent</th>
                    <th>Adhérent</th>
                    <th>Période</th>
                  </tr>
                </thead>
                <tbody>
                  {dossier.cotisationsSalariales.map((c, idx) => (
                    <tr key={`${c.codeAssurance}-${c.numeroAdherent}-${idx}`}>
                      <td>{c.codeAssurance}</td>
                      <td>{c.nomAssurance}</td>
                      <td>{c.numeroAdherent}</td>
                      <td>{c.adherentNom}</td>
                      <td>{c.periode}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="rd-muted">Aucune cotisation trouvée.</p>
            )}
          </Section>
           <button type="submit" className="rd-search-button" 
           onClick={()=>{suivant()}}
            disabled={dossier.statut !== "NOUVELLE" ||  AuthService.getRole() === "CONTROLEUR"}>
          {loading ? "suivant...": "Suivant"}
        </button>
        </div>
      )}
    </div>
  );
}