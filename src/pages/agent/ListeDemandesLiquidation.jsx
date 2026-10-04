import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  rechercherDemandesLiquidation,
} from "../../services/DemandeLiquidationService";

import "./ListeDemandes.css";
import { getUsername } from "../../services/AuthService";


const ListeDemandesLiquidation = () => {

  const navigate = useNavigate();

  const [demandes, setDemandes] = useState([]);

  const [statutDemande, setStatutDemande] = useState("");
  const [mesDemandes, setMesDemandes] = useState(false);

  const [affilie, setAffilie] = useState("");
  const [numeroDemande, setNumeroDemande] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =========================================================
  // CHARGER LES DEMANDES
  // =========================================================

  const chargerDemandes = async () => {

    try {

      setLoading(true);
      setError("");

      const result =
        await rechercherDemandesLiquidation({
          statutDemande:
            statutDemande || undefined,

          mesDemandes,

          affilie,

          numeroDemande:
            numeroDemande
              ? Number(numeroDemande)
              : undefined,
        });

      setDemandes(result);

    } catch (err) {
      console.error(err);
      setError(
        "Erreur lors du chargement des demandes."
      );
    } finally {

      setLoading(false);
    }
  };

  // =========================================================
  // CHARGEMENT INITIAL
  // =========================================================

  useEffect(() => {
    chargerDemandes();
  }, []);

  // =========================================================
  // RECHERCHER
  // =========================================================

  const handleRecherche = (e) => {

    e.preventDefault();

    chargerDemandes();
  };

  // =========================================================
  // RESET
  // =========================================================

  const handleReset = () => {

    setStatutDemande("");
    setMesDemandes(false);
    setAffilie("");
    setNumeroDemande("");

    // Recharger toutes les demandes
    setTimeout(() => {
      chargerDemandes();
    }, 0);
  };

  // =========================================================
  // VOIR LE DOSSIER
  // =========================================================

  const handleVoir = (num) => {

    navigate(
      `/agent/demandes-liquidation/${num}/validation`
    );
  };

  // =========================================================
  // VALIDER LA SAISIE
  // =========================================================

  const handleValiderSaisie = (num) => {

    navigate(
      `/agent/recherche/validation/${num}`
    );
  };

  return (
    <div className="liste-demandes-container">

      <h2>
        Liste des demandes de liquidation
      </h2>

      {/* =====================================================
          FILTRES
          ===================================================== */}

      <form
        className="filtres-container"
        onSubmit={handleRecherche}
      >

        {/* STATUT */}

        <div className="filtre-group">

          <label>
            Statut
          </label>

          <select
            value={statutDemande}
            onChange={(e) =>
              setStatutDemande(e.target.value)
            }
          >

            <option value="">
              Tous
            </option>

            <option value="NOUVELLE">
              Nouvelle
            </option>

            <option value="EN_COURS">
              En cours
            </option>

            <option value="EN_CONTROLE">
              En contrôle
            </option>

            <option value="EN_ATTENTE_PIECES">
              En attente pièces
            </option>

            <option value="REJETEE">
              Rejetée
            </option>

            <option value="ANOMALIE">
              Anomalie
            </option>

            <option value="LIQUIDEE">
              Liquidée
            </option>

          </select>

        </div>


        {/* MES DEMANDES */}

        <div className="filtre-group checkbox-group">

          <label>

            <input
              type="checkbox"
              checked={mesDemandes}
              onChange={(e) =>
                setMesDemandes(e.target.checked)
              }
            />

            Mes demandes

          </label>

        </div>


        {/* AFFILIE */}

        <div className="filtre-group">

          <label>
            Affilié
          </label>

          <input
            type="text"
            value={affilie}
            onChange={(e) =>
              setAffilie(e.target.value)
            }
            placeholder="Matricule, nom ou prénom"
          />

        </div>


        {/* NUMERO DEMANDE */}

        <div className="filtre-group">

          <label>
            Numéro demande
          </label>

          <input
            type="number"
            value={numeroDemande}
            onChange={(e) =>
              setNumeroDemande(e.target.value)
            }
            placeholder="Numéro"
          />

        </div>


        {/* BOUTONS */}

        <div className="filtres-buttons">

          <button
            type="submit"
            className="btn-rechercher"
          >
            Rechercher
          </button>

          <button
            type="button"
            className="btn-reset"
            onClick={handleReset}
          >
            Réinitialiser
          </button>

        </div>

      </form>


      {/* =====================================================
          ERREUR
          ===================================================== */}

      {error && (
        <div className="message-error">
          {error}
        </div>
      )}


      {/* =====================================================
          CHARGEMENT
          ===================================================== */}

      {loading ? (

        <div className="loading">
          Chargement...
        </div>

      ) : (

        <>

          {/* =================================================
              AUCUNE DEMANDE
              ================================================= */}

          {demandes.length === 0 ? (

            <div className="aucune-demande">
              Aucune demande trouvée.
            </div>

          ) : (

            <div className="table-container">

              <table className="demandes-table">

                <thead>

                  <tr>

                    <th>
                      N° demande
                    </th>

                    <th>
                      Date demande
                    </th>

                    <th>
                      Matricule
                    </th>

                    <th>
                      CIN
                    </th>

                    <th>
                      Nom
                    </th>

                    <th>
                      Prénom
                    </th>

                    <th>
                      Statut
                    </th>

                    <th>
                      Type liquidation
                    </th>

                    <th>
                      Date départ
                    </th>

                    <th>
                      Agent
                    </th>

                    <th>
                      Actions
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {demandes.map((demande) => {

                    const agent =
                      demande.agent;

                    const affilie =
                      demande.affilie;


                    /*
                     * IMPORTANT :
                     * Le bouton "Valider la saisie"
                     * est affiché uniquement lorsque
                     * la demande est NOUVELLE.
                     *
                     * Le backend a déjà filtré
                     * "Mes demandes" si demandé.
                     */

                    const peutValider =
                      demande.statutDemande ===
                      "NOUVELLE";


                    return (

                      <tr key={demande.num}>

                        <td>
                          {demande.num}
                        </td>

                        <td>
                          {demande.dateDemande || "-"}
                        </td>

                        <td>
                          {affilie?.matricule || "-"}
                        </td>

                        <td>
                          {affilie?.cin || "-"}
                        </td>

                        <td>
                          {affilie?.nom || "-"}
                        </td>

                        <td>
                          {affilie?.prenom || "-"}
                        </td>

                        <td>
                          {demande.statutDemande || "-"}
                        </td>

                        <td>
                          {demande.typeLiquidation || "-"}
                        </td>

                        <td>
                          {demande.dateDepart || "-"}
                        </td>

                        <td>
                          {agent
                            ? `${agent.nom || ""} ${agent.prenom || ""}`
                            : "-"
                          }
                        </td>

                        <td>

                          <div className="actions">

                            {/* VOIR DOSSIER */}

                            <button
                              type="button"
                              className="btn-voir"
                              onClick={() =>
                                handleVoir(
                                  demande.num
                                )
                              }
                            >
                              Voir
                            </button>


                            {/* VALIDER SAISIE */}
                            {peutValider && demande.agent?.username == getUsername() && (

                              <button
                                type="button"
                                className="btn-valider"
                                onClick={() =>
                                  handleValiderSaisie(
                                    demande.num
                                  )
                                }
                              >
                                Valider la saisie
                              </button>

                            )}

                          </div>

                        </td>

                      </tr>

                    );
                  })}

                </tbody>

              </table>

            </div>

          )}

        </>

      )}

    </div>
  );
};

export default ListeDemandesLiquidation;