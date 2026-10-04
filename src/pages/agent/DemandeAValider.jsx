
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./ListeDemandes.css";

const DemandeAValider = () => {
    const [demandes, setDemandes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Filtres
    const [matriculeRecherche, setMatriculeRecherche] = useState("");
    const [numDemandeRecherche, setNumDemandeRecherche] = useState("");
    const [delaiRecherche, setDelaiRecherche] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        chargerDemandes();
    }, []);

    const chargerDemandes = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get(
                "/demandes-liquidation/a-valider"
            );

            console.log(response.data);
            setDemandes(response.data);
        } catch (error) {
            console.error(
                "Erreur lors du chargement des demandes :",
                error
            );

            setError(
                "Impossible de charger les demandes à contrôler."
            );
        } finally {
            setLoading(false);
        }
    };

    const consulterDemande = (numero) => {
        navigate(`/controleur/demandes/${numero}`);
    };

    // ==========================================================
    // Calcul du nombre de jours depuis la date de demande
    // ==========================================================
    const calculerNombreJours = (dateDemande) => {
        if (!dateDemande) {
            return null;
        }

        const date = new Date(dateDemande);

        if (isNaN(date.getTime())) {
            return null;
        }

        const aujourdHui = new Date();

        // On compare uniquement les dates
        aujourdHui.setHours(0, 0, 0, 0);
        date.setHours(0, 0, 0, 0);

        const differenceMs = aujourdHui - date;

        return Math.floor(
            differenceMs / (1000 * 60 * 60 * 24)
        );
    };

      const handleValiderSaisie = (num) => {

    navigate(
      `/agent/recherche/validation/${num}`
    );
  };

    // ==========================================================
    // Vérifie si la demande correspond au filtre délai
    // ==========================================================
    const correspondAuDelai = (demande) => {
        if (!delaiRecherche) {
            return true;
        }

        const nombreJours = calculerNombreJours(
            demande.dateDemande
        );

        if (nombreJours === null) {
            return false;
        }

        switch (delaiRecherche) {
            case "recent":
                // Aujourd'hui
                return nombreJours === 0;
            case "1":
                return nombreJours <= 1;

            case "2":
                return nombreJours <= 2;

            case "3":
                return nombreJours <= 3;

            case "4":
                return nombreJours <= 4;

            case "5":
                return nombreJours <= 5;

            case "6":
                return nombreJours <= 6;

            case "7":
                return nombreJours <= 7;

            case "14":
                return nombreJours <= 14;

            case "21":
                return nombreJours <= 21;

            case "30":
                return nombreJours <= 30;

            default:
                return true;
        }
    };

    // ==========================================================
    // Application des filtres
    // ==========================================================
    const demandesFiltrees = demandes.filter((demande) => {
        // ------------------------------------------------------
        // Recherche par matricule
        // ------------------------------------------------------
        const matricule =
            demande.affilie?.matricule?.toString().toLowerCase() || "";

        const rechercheMatricule =
            matriculeRecherche.toLowerCase().trim();

        const correspondMatricule =
            matricule.includes(rechercheMatricule);

        // ------------------------------------------------------
        // Recherche par numéro de demande
        // ------------------------------------------------------
        const numeroDemande =
            demande.num?.toString().toLowerCase() || "";

        const rechercheNumero =
            numDemandeRecherche.toLowerCase().trim();

        const correspondNumero =
            numeroDemande.includes(rechercheNumero);

        // ------------------------------------------------------
        // Recherche par délai
        // ------------------------------------------------------
        const correspondDelai =
            correspondAuDelai(demande);

        return (
            correspondMatricule &&
            correspondNumero &&
            correspondDelai
        );
    });

    // ==========================================================
    // Réinitialiser les filtres
    // ==========================================================
    const reinitialiserFiltres = () => {
        setMatriculeRecherche("");
        setNumDemandeRecherche("");
        setDelaiRecherche("");
    };

    if (loading) {
        return (
            <div className="demandes-container">
                <p>Chargement des demandes...</p>
            </div>
        );
    }

    return (
        <div className="demandes-container">

            {/* ============================= */}
            {/* EN-TÊTE */}
            {/* ============================= */}

            <div className="page-header">
                <div>
                    <h2>Demandes à contrôler</h2>

                    <p>
                        Liste des demandes en cours de contrôle
                    </p>
                </div>

                <span className="nombre-demandes">
                    {demandesFiltrees.length} demande(s)
                </span>
            </div>

            {/* ============================= */}
            {/* MESSAGE ERREUR */}
            {/* ============================= */}

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            {/* ============================= */}
            {/* FILTRES */}
            {/* ============================= */}

            {!error && (
                <div className="filtres-container">

                    {/* Recherche matricule */}
                    <div className="filtre-group">
                        <label htmlFor="matricule">
                            Matricule affilié
                        </label>

                        <input
                            id="matricule"
                            type="text"
                            placeholder="Rechercher par matricule..."
                            value={matriculeRecherche}
                            onChange={(e) =>
                                setMatriculeRecherche(
                                    e.target.value
                                )
                            }
                        />
                    </div>

                    {/* Recherche numéro demande */}
                    <div className="filtre-group">
                        <label htmlFor="numDemande">
                            N° demande
                        </label>

                        <input
                            id="numDemande"
                            type="text"
                            placeholder="Rechercher par N°..."
                            value={numDemandeRecherche}
                            onChange={(e) =>
                                setNumDemandeRecherche(
                                    e.target.value
                                )
                            }
                        />
                    </div>

                    {/* Recherche délai */}
                    <div className="filtre-group">
                        <label htmlFor="delai">
                            Délai depuis la demande
                        </label>

                        <select
                            id="delai"
                            value={delaiRecherche}
                            onChange={(e) =>
                                setDelaiRecherche(
                                    e.target.value
                                )
                            }
                        >
                            <option value="">
                                Tous les délais
                            </option>

                            <option value="recent">
                                Récent — aujourd'hui
                            </option>

                            <option value="1">
                                1 jour
                            </option>

                            <option value="2">
                                2 jours
                            </option>

                            <option value="3">
                                3 jours
                            </option>

                            <option value="4">
                                4 jours
                            </option>

                            <option value="5">
                                5 jours
                            </option>

                            <option value="6">
                                6 jours
                            </option>

                            <option value="7">
                                1 semaine
                            </option>

                            <option value="14">
                                2 semaines
                            </option>

                            <option value="21">
                                3 semaines
                            </option>

                            <option value="30">
                                1 mois
                            </option>
                        </select>
                    </div>

                    {/* Bouton réinitialiser */}
                    <div className="filtre-actions">
                        <button
                            type="button"
                            onClick={reinitialiserFiltres}
                            className="btn-reset-filtres"
                        >
                            Réinitialiser
                        </button>
                    </div>

                </div>
            )}

            {/* ============================= */}
            {/* AUCUNE DEMANDE */}
            {/* ============================= */}

            {!error &&
                demandesFiltrees.length === 0 && (
                    <div className="empty-message">
                        Aucune demande ne correspond aux critères
                        de recherche.
                    </div>
                )}

            {/* ============================= */}
            {/* TABLEAU */}
            {/* ============================= */}

            {demandesFiltrees.length > 0 && (
                <div className="table-container">

                    <table>
                        <thead>
                            <tr>
                                <th>N° Demande</th>
                                <th>Matricule</th>
                                <th>Nom</th>
                                <th>Prénom</th>
                                <th>Date départ</th>
                                <th>Date demande</th>
                                <th>Délai</th>
                                <th>Statut</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {demandesFiltrees.map((demande) => {

                                const nombreJours =
                                    calculerNombreJours(
                                        demande.dateDemande
                                    );

                                return (
                                    <tr key={demande.num}>

                                        <td>
                                            {demande.num}
                                        </td>

                                        <td>
                                            {demande.affilie?.matricule}
                                        </td>

                                        <td>
                                            {demande.affilie?.nom}
                                        </td>

                                        <td>
                                            {demande.affilie?.prenom}
                                        </td>

                                        <td>
                                            {demande.dateDepart}
                                        </td>

                                        <td>
                                            {demande.dateDemande}
                                        </td>

                                        <td>
                                            {nombreJours === 0
                                                ? "Aujourd'hui"
                                                : `${nombreJours} jour(s)`}
                                        </td>

                                        <td>
                                            <span className="statut en-cours">
                                                {demande.statutDemande}
                                            </span>
                                        </td>

                                        <td>
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
                                        </td>

                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                </div>
            )}
        </div>
    );
};

export default DemandeAValider;


