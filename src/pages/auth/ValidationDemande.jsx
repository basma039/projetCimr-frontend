import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
//import "./ValidationDemande.css";

// =====================================================
// FORMATTERS
// =====================================================

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


// =====================================================
// COMPONENT
// =====================================================

export default function ValidationDemande() {

  const { id } = useParams();
  const navigate = useNavigate();

  // ===================================================
  // STATES
  // ===================================================

  const [dossier, setDossier] = useState(null);

  const [anomalies, setAnomalies] = useState([
    ""
  ]);

  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  // ===================================================
  // CHARGEMENT DU DOSSIER
  // ===================================================

  useEffect(() => {
    chargerDossier();
  }, [id]);

  async function chargerDossier() {

    try {

      setLoading(true);

      const res = await api.get(
        `/demandes-liquidation/${id}/dossier-complet`
      );

      setDossier(res.data);

    } catch (e) {

      console.error(
        "Erreur lors du chargement du dossier :",e);

      alert(
        "Impossible de charger le dossier."
      );

    } finally {

      setLoading(false);

    }
  }
 async function validerDemande() {
    try {
        setSending(true);

        const anomaliesValides = anomalies
            .map((a) => a.trim())
            .filter((a) => a.length > 0);

        const dto = {
            anomalies: anomaliesValides
        };

        await api.patch(
            `/demandes-liquidation/${id}/validation`,
            dto
        );

        if (anomaliesValides.length > 0) {
            alert("La demande a été signalée avec anomalie.");
        } else {
            alert("La saisie a été validée.");
        }

        navigate(-1);

    } catch (e) {
        console.error("Erreur lors de la validation :", e);

        alert(
            e.response?.data?.message ||
            "Une erreur est survenue lors de la validation."
        );

    } finally {
        setSending(false);
    }
}


  // ===================================================
  // GESTION DES ANOMALIES
  // ===================================================

  function ajouterAnomalie() {

    setAnomalies((ancienneListe) => [
      ...ancienneListe,
      ""
    ]);
  }

  function modifierAnomalie(index, valeur) {

    setAnomalies((ancienneListe) => {

      const nouvelleListe = [
        ...ancienneListe
      ];

      nouvelleListe[index] = valeur;

      return nouvelleListe;
    });
  }

  function supprimerAnomalie(index) {

    setAnomalies((ancienneListe) => {

      // S'il n'y a qu'une ligne,
      // on la vide au lieu de supprimer complètement
      if (ancienneListe.length === 1) {
        return [""];
      }

      return ancienneListe.filter(
        (_, i) => i !== index
      );
    });
  }

  // ===================================================
  // RÉCUPÉRER LES ANOMALIES RÉELLES
  // ===================================================

  function getAnomaliesValides() {

    return anomalies
      .map((anomalie) => anomalie.trim())
      .filter(
        (anomalie) => anomalie.length > 0
      );
  }

  // ===================================================
  // CONTRÔLE DE LA DEMANDE
  // ===================================================

  async function controlerDemande(action) {

    // -----------------------------------------------
    // Anomalies réellement saisies
    // -----------------------------------------------

    const anomaliesValides =
      getAnomaliesValides();


    // -----------------------------------------------
    // Si ANOMALIE
    // -----------------------------------------------

    if (
      action === "ANOMALIE"
      && anomaliesValides.length === 0
    ) {

      alert(
        "Veuillez saisir au moins une anomalie."
      );

      return;
    }


    // -----------------------------------------------
    // Confirmation
    // -----------------------------------------------

    let message = "";

    if (action === "VALIDATION") {

      message =
        "Voulez-vous vraiment valider cette demande ?";

    } else if (action === "ANOMALIE") {

      message =
        "Voulez-vous signaler cette demande avec les anomalies saisies ?";

    }


    const confirmation =
      window.confirm(message);

    if (!confirmation) {
      return;
    }


    // -----------------------------------------------
    // DTO envoyé au backend
    // -----------------------------------------------

    const dto = {

      action: action,

      anomalies:
        action === "ANOMALIE"
          ? anomaliesValides
          : []

    };


    try {

      setSending(true);


      await api.patch(
        `/demandes-liquidation/${id}/controle`,
        dto
      );


      // ---------------------------------------------
      // Message
      // ---------------------------------------------

      if (action === "VALIDATION") {

        alert(
          "La demande a été validée avec succès."
        );

      } else {

        alert(
          "Les anomalies ont été enregistrées avec succès."
        );

      }


      // ---------------------------------------------
      // Retour
      // ---------------------------------------------

      navigate(-1);

    } catch (e) {

      console.error(
        "Erreur lors du contrôle :",
        e
      );


      const messageErreur =
        e.response?.data?.message
        || e.response?.data
        || "Une erreur est survenue lors du contrôle.";


      alert(messageErreur);

    } finally {

      setSending(false);
    }
  }

  // ===================================================
  // LOADING
  // ===================================================

  if (loading) {

    return (
      <div className="validation-container">
        <h2>Chargement...</h2>
      </div>
    );
  }


  // ===================================================
  // DOSSIER NON TROUVÉ
  // ===================================================

  if (!dossier) {

    return (
      <div className="validation-container">

        <h2>
          Dossier introuvable
        </h2>

        <button
          className="btn-annuler"
          onClick={() => navigate(-1)}
        >
          Retour
        </button>

      </div>
    );
  }


  // ===================================================
  // RENDER
  // ===================================================

  return (

    <div className="validation-container">

      <h2>
        Contrôle de la demande
      </h2>


      {/* =================================================
          INFORMATIONS GÉNÉRALES
      ================================================= */}

      <div className="bloc">

        <h3>
          Informations générales
        </h3>

        <div className="grid">

          <div>
            <label>
              N° demande
            </label>

            <input
              value={dossier.num ?? ""}
              disabled
            />
          </div>


          <div>
            <label>
              Matricule
            </label>

            <input
              value={
                dossier.ficheSignaletique?.matricule
                ?? ""
              }
              disabled
            />
          </div>


          <div>
            <label>
              Nom
            </label>

            <input
              value={
                dossier.ficheSignaletique?.nom
                ?? ""
              }
              disabled
            />
          </div>


          <div>
            <label>
              Prénom
            </label>

            <input
              value={
                dossier.ficheSignaletique?.prenom
                ?? ""
              }
              disabled
            />
          </div>


          <div>
            <label>
              CIN
            </label>

            <input
              value={
                dossier.ficheSignaletique?.cin
                ?? ""
              }
              disabled
            />
          </div>


          <div>
            <label>
              Type liquidation
            </label>

            <input
              value={
                dossier.typeLiquidation
                ?? ""
              }
              disabled
            />
          </div>


          <div>
            <label>
              Base liquidation
            </label>

            <input
              value={
                dossier.baseLiquidation
                ?? ""
              }
              disabled
            />
          </div>


          <div>
            <label>
              Statut
            </label>

            <input
              value={
                dossier.statut
                ?? ""
              }
              disabled
            />
          </div>

        </div>

      </div>


      {/* =================================================
          DÉCLARATION DES SALAIRES
      ================================================= */}

      <div className="bloc">

        <h3>
          Déclaration individuelle des salaires
        </h3>


        {dossier.declarationSalaires
          && dossier.declarationSalaires.length > 0 ? (

          <table className="rd-table">

            <thead>

              <tr>

                <th>
                  Adhérent employeur
                </th>

                <th>
                  Catégorie
                </th>

                <th>
                  Type de régime
                </th>

                <th>
                  Montant
                </th>

                <th>
                  Taux contribution
                </th>

                <th>
                  Montant contribution
                </th>

                <th>
                  Salaire net
                </th>

              </tr>

            </thead>


            <tbody>

              {dossier.declarationSalaires.map(
                (s) => (

                  <tr key={s.id}>

                    <td>
                      {s.adherentRaisonSociale}
                    </td>

                    <td>
                      {s.categorie}
                    </td>

                    <td>
                      {s.typeRegime}
                    </td>

                    <td>
                      {formatMontant(s.montant)}
                    </td>

                    <td>
                      {formatTaux(
                        s.tauxContribution
                      )}
                    </td>

                    <td>
                      {formatMontant(
                        s.montantContribution
                      )}
                    </td>

                    <td>
                      {formatMontant(
                        s.salaireNet
                      )}
                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        ) : (

          <p className="rd-muted">
            Aucune déclaration de salaire trouvée.
          </p>

        )}

      </div>


      {/* =================================================
          ASSURANCES
      ================================================= */}

      <div className="bloc">

        <h3>
          Assurances
        </h3>


        <table>

          <thead>

            <tr>

              <th>
                Code
              </th>

              <th>
                Libellé
              </th>

            </tr>

          </thead>


          <tbody>

            {dossier.assurances
              ?.map((assurance) => (

                <tr
                  key={
                    assurance.codeAssurance
                  }
                >

                  <td>
                    {assurance.codeAssurance}
                  </td>

                  <td>
                    {assurance.nomAssurance}
                  </td>

                </tr>

              ))}

          </tbody>

        </table>

      </div>


      {/* =================================================
          PIÈCES JOINTES
      ================================================= */}

      <div className="bloc">

        <h3>
          Pièces jointes
        </h3>


        <table>

          <thead>

            <tr>

              <th>
                Nom
              </th>

              <th>
                Type
              </th>

              <th>
                Document
              </th>

            </tr>

          </thead>


          <tbody>

            {dossier.piecesJointes
              ?.map((piece) => (

                <tr key={piece.id}>

                  <td>
                    {piece.nom}
                  </td>

                  <td>
                    {piece.typePiece}
                  </td>

                  <td>

                    <a
                      href={
                        `http://localhost:8084/${
                          piece.chemin
                            ?.replace(/\\/g, "/")
                        }`
                      }
                      target="_blank"
                      rel="noreferrer"
                    >
                      Consulter
                    </a>

                  </td>

                </tr>

              ))}

          </tbody>

        </table>

      </div>


      {/* =================================================
          ANOMALIES
      ================================================= */}

      <div className="bloc anomalies-bloc">

        <div className="anomalies-header">

          <div>

            <h3>
              Anomalies
            </h3>


          </div>


          <button
            type="button"
            className="btn-ajouter-anomalie"
            onClick={ajouterAnomalie}
            disabled={sending}
          >
            + Ajouter une anomalie
          </button>

        </div>


        <div className="anomalies-list">

          {anomalies.map(
            (anomalie, index) => (

              <div
                className="anomalie-row"
                key={index}
              >

                <span className="anomalie-numero">
                  {index + 1}
                </span>


               <textarea id={`anomalie-${index}`}
                name={`anomalie-${index}`}
                value={anomalie}
                onChange={(e) =>
                modifierAnomalie(index, e.target.value)
                 }
                placeholder="Décrire l'anomalie constatée..."
                disabled={sending}
                aria-label={`Description de l'anomalie ${index + 1}`}
                />


                <button
                  type="button"
                  className="btn-supprimer-anomalie"
                  onClick={() =>
                    supprimerAnomalie(index)
                  }
                  disabled={sending}
                  title="Supprimer cette anomalie"
                >
                  ×
                </button>

              </div>

            )
          )}

        </div>

      </div>


      {/* =================================================
          ACTIONS
      ================================================= */}

      <div className="actions">

        <button
          type="button"
          className="btn-annuler"
          onClick={() => navigate(-1)}
          disabled={sending}
        >
          Retour
        </button>

        <button
          type="button"
          className="btn-valider"
          onClick={() =>
            validerDemande()
          }
          disabled={sending}
        >

          {sending
            ? "Traitement..."
            : "Valider la demande"}

        </button>

      </div>

    </div>
  );
}