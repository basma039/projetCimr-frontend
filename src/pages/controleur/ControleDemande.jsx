import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import api from "../../services/api";

import "./ControleDemande.css";

const ControleDemande = () => {
    const { num } = useParams();
    const navigate = useNavigate();

    const [demande, setDemande] = useState(null);
    const [resultatCalcul, setResultatCalcul] = useState(null);

    const [loading, setLoading] = useState(true);
    const [calculEnCours, setCalculEnCours] = useState(false);
    const [validationEnCours, setValidationEnCours] = useState(false);

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    // =====================================================
    // CHARGER LA DEMANDE
    // =====================================================

    useEffect(() => {
        chargerDemande();
    }, [num]);

    const chargerDemande = async () => {
        try {
            setLoading(true);
            setError("");
            setMessage("");

            const response = await api.get(
                `/demandes-liquidation/${num}/controle`
            );

            console.log("Demande chargée :", response.data);

            setDemande(response.data);
        } catch (error) {
            console.error("Erreur chargement :", error);

            setError(
                error.response?.data?.message ||
                "Impossible de charger la demande."
            );
        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // CALCULER LA PENSION
    // =====================================================

    const calculerPension = async () => {
        try {
            setCalculEnCours(true);
            setError("");
            setMessage("");

            const response = await api.post(
                `/demandes-liquidation/${num}/calcul-pension`
            );

            console.log(
                "Résultat du calcul :",
                response.data
            );

            setResultatCalcul(response.data);

            setMessage(
                "Le calcul de la pension a été effectué avec succès."
            );
        } catch (error) {
            console.error("Erreur calcul :", error);

            setError(
                error.response?.data?.message ||
                "Erreur lors du calcul de la pension."
            );
        } finally {
            setCalculEnCours(false);
        }
    };

    // =====================================================
    // REJETER LA DEMANDE 
    // =====================================================

    const rejeterDemande = async () => {
        const confirmation = window.confirm(
            "Voulez-vous vraiment rejeter cette demande ?"
        );
        if(!confirmation) {
            return;
        }
        try {
            setError("");
            setMessage("");

            await api.post(`/demandes-liquidation/${num}/rejeter-demande`);
            setMessage(
                "Demande rejetée avec succès."
            );
            alert("Demande rejetée avec succès. Vous allez être redirigé vers la page précédente.");
            setTimeout(() => {
            navigate(-1);
            }, 1000);} catch (error) {
                alert("Erreur lors du rejet de la demande. Veuillez réessayer.");
            console.error(
                "Erreur rejet demande :",
                error
            );
        }
    }


    // =====================================================
    // VALIDER LE CALCUL
    // =====================================================

    const validerCalcul = async () => {
        if (!resultatCalcul) {
            return;
        }

        const confirmation = window.confirm(
            "Voulez-vous vraiment valider le calcul de cette demande ?"
        );

        if (!confirmation) {
            return;
        }

        try {
            setValidationEnCours(true);
            setError("");
            setMessage("");

            await api.post(`/demandes-liquidation/${num}/validation-calcul`);
            setMessage(
                "Calcul validé avec succès."
            );
            alert("Calcul validé avec succès. Vous allez être redirigé vers la page précédente.");
            setTimeout(() => {
            navigate(-1);
            }, 1000);
        } catch (error) {
            console.error(
                "Erreur validation calcul :",
                error
            );

            setError(
                error.response?.data?.message ||
                "Erreur lors de la validation du calcul."
            );
        } finally {
            setValidationEnCours(false);
        }
    };

    // =====================================================
    // CHARGEMENT
    // =====================================================

    if (loading) {
        return (
            <div className="controle-demande">
                <div className="loading">
                    Chargement de la demande...
                </div>
            </div>
        );
    }

    // =====================================================
    // ERREUR / PAS DE DEMANDE
    // =====================================================

    if (!demande) {
        return (
            <div className="controle-demande">
                <div className="error-message">
                    {error || "Aucune demande trouvée."}
                </div>
            </div>
        );
    }

    // =====================================================
    // VARIABLES
    // =====================================================

    const affiliations = demande.affiliations || [];

    return (
        <div className="controle-demande">

            {/* =================================================
                TITRE
            ================================================= */}

            <div className="page-header">
                <div>
                    <h2>
                        Contrôle de la demande N° {demande.num}
                    </h2>

                    <p>
                        Vérification et calcul de la pension
                    </p>
                </div>

                <span className="statut-badge">
                    {demande.statutDemande}
                </span>
            </div>

            {/* =================================================
                MESSAGES
            ================================================= */}

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            {message && (
                <div className="success-message">
                    {message}
                </div>
            )}

            {/* =================================================
                INFORMATIONS AFFILIÉ
            ================================================= */}

            <section className="controle-section">

                <div className="section-title">
                    <span>1</span>
                    <h3>
                        Informations de l'affilié
                    </h3>
                </div>

                <div className="info-grid">

                    <div className="info-item">
                        <label>Matricule</label>
                        <strong>
                            {demande.matricule || "-"}
                        </strong>
                    </div>

                    <div className="info-item">
                        <label>CIN</label>
                        <strong>
                            {demande.cin || "-"}
                        </strong>
                    </div>

                    <div className="info-item">
                        <label>Nom</label>
                        <strong>
                            {demande.nom || "-"}
                        </strong>
                    </div>

                    <div className="info-item">
                        <label>Prénom</label>
                        <strong>
                            {demande.prenom || "-"}
                        </strong>
                    </div>

                    <div className="info-item">
                        <label>Date de naissance</label>
                        <strong>
                            {demande.dateNaissance || "-"}
                        </strong>
                    </div>

                    <div className="info-item">
                        <label>Sexe</label>
                        <strong>
                            {demande.sexe || "-"}
                        </strong>
                    </div>

                    <div className="info-item">
                        <label>Nationalité</label>
                        <strong>
                            {demande.nationalite || "-"}
                        </strong>
                    </div>

                    <div className="info-item highlight">
                        <label>Âge au départ</label>
                        <strong>
                            {demande.ageAlaRetraite != null
                                ? `${demande.ageAlaRetraite} ans`
                                : "-"}
                        </strong>
                    </div>

                </div>
            </section>

            {/* =================================================
                SECTION 1 — AFFILIATIONS
            ================================================= */}

            <section className="controle-section">

                <div className="section-title">
                    <span>2</span>
                    <h3>
                        Section 1 — Affiliations
                    </h3>
                </div>

                {affiliations.length === 0 ? (
                    <div className="empty-message">
                        Aucune affiliation trouvée.
                    </div>
                ) : (
                    <div className="table-container">

                        <table className="controle-table">

                            <thead>
                                <tr>
                                    <th>Adhérent</th>
                                    <th>Régime</th>
                                    <th>Date début</th>
                                    <th>Date fin</th>
                                    <th>Taux contribution</th>
                                    <th>Total contributions</th>
                                    <th>Total points</th>
                                </tr>
                            </thead>

                            <tbody>

                                {affiliations.map(
                                    (affiliation) => (
                                        <tr
                                            key={
                                                affiliation.id
                                            }
                                        >

                                            <td>
                                                {affiliation.raisonSociale ||
                                                    "-"}
                                            </td>

                                            <td>
                                                <span className="regime-badge">
                                                    {affiliation.typeRegime ||
                                                        "-"}
                                                </span>
                                            </td>

                                            <td>
                                                {affiliation.dateDebut ||
                                                    "-"}
                                            </td>

                                            <td>
                                                {affiliation.dateFin ||
                                                    "En cours"}
                                            </td>

                                            <td>
                                                {affiliation.tauxContribution !=
                                                null
                                                    ? `${affiliation.tauxContribution} %`
                                                    : "-"}
                                            </td>

                                            <td>
                                                {affiliation.totalContributions !=
                                                null
                                                    ? Number(
                                                          affiliation.totalContributions
                                                      ).toFixed(2)
                                                    : "0.00"}
                                            </td>

                                            <td>
                                                {affiliation.totalPoints !=
                                                null
                                                    ? Number(
                                                          affiliation.totalPoints
                                                      ).toFixed(4)
                                                    : "0.0000"}
                                            </td>

                                        </tr>
                                    )
                                )}

                            </tbody>

                        </table>
                    </div>
                )}
            </section>

            {/* =================================================
                SECTION 2 — INFORMATIONS DEMANDE
            ================================================= */}

            <section className="controle-section">

                <div className="section-title">
                    <span>3</span>
                    <h3>
                        Section 2 — Informations générales
                    </h3>
                </div>

                <div className="info-grid">

                    <div className="info-item">
                        <label>Numéro demande</label>
                        <strong>
                            {demande.num}
                        </strong>
                    </div>

                    <div className="info-item">
                        <label>Date de demande</label>
                        <strong>
                            {demande.dateDemande || "-"}
                        </strong>
                    </div>

                    <div className="info-item">
                        <label>Type de liquidation</label>
                        <strong>
                            {demande.typeLiquidation || "-"}
                        </strong>
                    </div>

                    <div className="info-item">
                        <label>Statut</label>
                        <strong>
                            {demande.statutDemande || "-"}
                        </strong>
                    </div>

                    <div className="info-item">
                        <label>Date de départ</label>
                        <strong>
                            {demande.dateDepart || "-"}
                        </strong>
                    </div>

                    <div className="info-item">
                        <label>
                            Date cessation activité
                        </label>
                        <strong>
                            {demande.dateCessationActivite ||
                                "-"}
                        </strong>
                    </div>

                </div>
            </section>

            {/* =================================================
                SECTION 3 — CONTRIBUTIONS
            ================================================= */}

            <section className="controle-section">

                <div className="section-title">
                    <span>4</span>
                    <h3>
                        Section 3 — Contributions
                    </h3>
                </div>

                <div className="totals-grid">

                    <div className="total-card">
                        <span>
                            Nombre d'affiliations
                        </span>

                        <strong>
                            {affiliations.length}
                        </strong>
                    </div>

                    <div className="total-card">
                        <span>
                            Total des contributions
                        </span>

                        <strong>
                            {demande.totalContributions !=
                            null
                                ? Number(
                                      demande.totalContributions
                                  ).toFixed(2)
                                : "0.00"}
                        </strong>
                    </div>

                    <div className="total-card">
                        <span>
                            Total des points
                        </span>

                        <strong>
                            {demande.totalPoints != null
                                ? Number(
                                      demande.totalPoints
                                  ).toFixed(4)
                                : "0.0000"}
                        </strong>
                    </div>

                </div>
            </section>

            {/* =================================================
                SECTION 4 — POINTS PAR RÉGIME
            ================================================= */}

            <section className="controle-section">

                <div className="section-title">
                    <span>5</span>
                    <h3>
                        Section 4 — Points par régime
                    </h3>
                </div>

                <div className="table-container">

                    <table className="controle-table">

                        <thead>
                            <tr>
                                <th>Régime</th>
                                <th>Points avant ajustement</th>
                                
                            </tr>
                        </thead>

                        <tbody>

                            {affiliations.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="6"
                                        className="empty-cell"
                                    >
                                        Aucun point disponible.
                                    </td>
                                </tr>
                            ) : (
                                affiliations.map(
                                    (affiliation) => (
                                        <tr
                                            key={
                                                `point-${affiliation.id}`
                                            }
                                        >

                                            <td>
                                                <span className="regime-badge">
                                                    {
                                                        affiliation.typeRegime
                                                    }
                                                </span>
                                            </td>

                                            <td>
                                                {affiliation.totalPoints !=
                                                null
                                                    ? Number(
                                                          affiliation.totalPoints
                                                      ).toFixed(4)
                                                    : "0.0000"}
                                            </td>

                                           

                                        </tr>
                                    )
                                )
                            )}

                        </tbody>

                    </table>
                </div>

                <p className="info-note">
                    Les coefficients d'anticipation ou de
                    prorogation seront appliqués lors du calcul
                    de la pension.
                </p>

            </section>

            {/* =================================================
                CALCUL PENSION
            ================================================= */}

            <section className="calculation-section">

                <div className="calculation-header">

                    <div>
                        <h3>
                            Calcul de la pension
                        </h3>

                        <p>
                            Le calcul applique les coefficients
                            d'anticipation ou de prorogation
                            selon le régime et l'âge de départ.
                        </p>
                    </div>

                    <button
                        className="btn-calcul"
                        onClick={calculerPension}
                        disabled={calculEnCours}
                    >
                        {calculEnCours
                            ? "Calcul en cours..."
                            : "Calculer la pension"}
                    </button>

                </div>

            </section>

            {/* =================================================
                RÉSULTAT DU CALCUL
            ================================================= */}

            {resultatCalcul && (

                <section className="controle-section resultat-section">

                    <div className="section-title">
                        <span>6</span>
                        <h3>
                            Résultat de la liquidation
                        </h3>
                    </div>

                    {/* ===============================
                        PARAMÈTRES
                    =============================== */}

                    <div className="info-grid">

                        <div className="info-item">
                            <label>
                                Âge à la retraite
                            </label>

                            <strong>
                                {
                                    resultatCalcul.ageAlaRetraite
                                }{" "}
                                ans
                            </strong>
                        </div>

                        <div className="info-item">
                            <label>
                                Valeur du point en liquidation
                            </label>

                            <strong>
                                {
                                    resultatCalcul.valeurPointLiquidation
                                }
                            </strong>
                        </div>

                        <div className="info-item">
                            <label>
                                Valeur du point en service
                            </label>

                            <strong>
                                {
                                    resultatCalcul.valeurPointService
                                }
                            </strong>
                        </div>

                    </div>

                    {/* ===============================
                        RÉSULTAT PAR RÉGIME
                    =============================== */}

                    <h4 className="sub-title">
                        Points par régime après ajustement
                    </h4>

                    <div className="table-container">

                        <table className="controle-table">

                            <thead>
                                <tr>
                                    <th>Régime</th>
                                    <th>
                                        Points avant ajustement
                                    </th>
                                    <th>
                                        Ajustement
                                    </th>
                                    <th>
                                        Années
                                    </th>
                                    <th>
                                        Coefficient
                                    </th>
                                    <th>
                                        Points en liquidation
                                    </th>
                                </tr>
                            </thead>

                            <tbody>

                                {(
                                    resultatCalcul.regimes ||
                                    []
                                ).map((regime, index) => (

                                    <tr key={index}>

                                        <td>
                                            <span className="regime-badge">
                                                {
                                                    regime.regime
                                                }
                                            </span>
                                        </td>

                                        <td>
                                            {Number(
                                                regime.totalPointsAvantAjustement
                                            ).toFixed(4)}
                                        </td>

                                        <td>
                                            {
                                                regime.typeAjustement
                                            }
                                        </td>

                                        <td>
                                            {
                                                regime.nombreAnnees
                                            }
                                        </td>

                                        <td>
                                            {Number(
                                                regime.coefficient
                                            ).toFixed(2)}
                                        </td>

                                        <td className="important-value">
                                            {Number(
                                                regime.pointsEnLiquidation
                                            ).toFixed(4)}
                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>
                    </div>

                    {/* ===============================
                        TOTAUX
                    =============================== */}

                    <div className="pension-result">

                        <div className="result-card">

                            <span>
                                Total points en liquidation
                            </span>

                            <strong>
                                {Number(
                                    resultatCalcul.totalPointsLiquidation
                                ).toFixed(4)}
                            </strong>

                        </div>

                        <div className="result-card">

                            <span>
                                Total points en service
                            </span>

                            <strong>
                                {Number(
                                    resultatCalcul.totalPointsEnService
                                ).toFixed(4)}
                            </strong>

                        </div>

                        <div className="result-card">

                            <span>
                                Pension annuelle
                            </span>

                            <strong>
                                {Number(
                                    resultatCalcul.pensionAnnuelle
                                ).toFixed(2)}{" "}
                                DH
                            </strong>

                        </div>

                        <div className="result-card principal">

                            <span>
                                Pension mensuelle
                            </span>

                            <strong>
                                {Number(
                                    resultatCalcul.pensionMensuelle
                                ).toFixed(2)}{" "}
                                DH
                            </strong>

                        </div>

                    </div>

                    {/* ===============================
                        FORMULES
                    =============================== */}

                    <div className="formules">

                        <h4>
                            Détail du calcul
                        </h4>

                        <p>
                            <strong>
                                Pl
                            </strong>{" "}
                            = Total des points en liquidation
                        </p>

                        <p>
                            <strong>
                                Ps
                            </strong>{" "}
                            = Pl × VPL ÷ VPS
                        </p>

                        <p>
                            <strong>
                                Pension annuelle
                            </strong>{" "}
                            = Ps × VPS
                        </p>

                        <p>
                            <strong>
                                Pension mensuelle
                            </strong>{" "}
                            = Pension annuelle ÷ 12
                        </p>

                    </div>

                    {/* ===============================
                        VALIDATION
                    =============================== */}

                    <div className="validation-container">

                        <div>
                            <h4>
                                Validation du calcul
                            </h4>

                            <p>
                                Vérifiez les résultats avant
                                de valider définitivement
                                le calcul.
                            </p>
                        </div>

                        <button
                            className="btn-validation"
                            onClick={validerCalcul}
                            disabled={
                                validationEnCours
                            }
                        >
                            {validationEnCours
                                ? "Validation..."
                                : "Validation Calcul"}
                        </button>
                        
                        <button
                            className="btn-rejeter"
                            onClick={rejeterDemande}
                            
                        >
                          Rejeter la demande
                        </button>

                    </div>

                </section>
            )}

        </div>
    );
};

export default ControleDemande;