import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    getDemandeValidation
} from "../../services/DemandeLiquidationService";

import "./VoirDemandeLiquidation.css";

const STATUTS_VALIDES = [
    "EN_CONTROLE",
    "EN_ATTENTE_PIECES",
    "ANOMALIE"
];

const TYPES_PIECES = {
    COPIE_CIN: "Copie CIN",
    RIB: "RIB",
    ATTESTATION_DECLARATION_SALAIRE:
        "Attestation déclaration salaire",
    ACTE_MARIAGE: "Acte de mariage",
    SITUATION_COTISATION_SALARIALE:
        "Situation de cotisation salariale"
};



const VoirDemandeLiquidation = () => {

    const { num } = useParams();

    const navigate = useNavigate();

    const [demande, setDemande] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    useEffect(() => {

        const chargerDemande = async () => {

            try {

                setLoading(true);
                setError("");

                const data =
                    await getDemandeValidation(num);

                /*
                 * =================================================
                 * DEMANDE NON VALIDÉE
                 * =================================================
                 *
                 * Une demande NOUVELLE n'a pas encore été validée.
                 *
                 * On redirige automatiquement vers la page
                 * de validation.
                 */

                if (
                    !STATUTS_VALIDES.includes(
                        data.statutDemande
                    )
                ) {

                    navigate(
                        `/agent/recherche/validation/${num}`,
                        {
                            replace: true
                        }
                    );

                    return;
                }//  /agent/recherche/validation/:num

                /*
                 * =================================================
                 * DEMANDE VALIDÉE
                 * =================================================
                 */

                setDemande(data);

            } catch (err) {

                console.error(err);

                setError(
                    err.response?.data?.message ||
                    "Impossible de charger la demande."
                );

            } finally {

                setLoading(false);
            }
        };


        chargerDemande();

    }, [num, navigate]);


    // =====================================================
    // FORMAT DATE
    // =====================================================

    const formatDate = (date) => {

        if (!date) {
            return "-";
        }

        return new Date(date)
            .toLocaleDateString("fr-FR");
    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (
            <div className="voir-demande-container">

                <div className="voir-loading">
                    Chargement de la demande...
                </div>

            </div>
        );
    }


    // =====================================================
    // ERREUR
    // =====================================================

    if (error) {

        return (
            <div className="voir-demande-container">

                <div className="voir-error">
                    {error}
                </div>

            </div>
        );
    }


    if (!demande) {
        return null;
    }


    const affilie =
        demande.affilie;

    const pieces =
        demande.pieces || [];

    const anomalies =
        demande.anomalies || [];

    const affiliations =
        demande.affiliations || [];


    return (

        <div className="voir-demande-container">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="voir-header">

                <div>

                    <h1>
                        Détails de la demande
                    </h1>

                    <p>
                        Demande n° {demande.num}
                    </p>

                </div>


                <div className="voir-status">

                    <span>
                        Statut
                    </span>

                    <strong
                        className={
                            `status-${demande.statutDemande}`
                        }
                    >
                        {demande.statutDemande}
                    </strong>

                </div>

            </div>


            {/* =================================================
                SECTION 1
                INFORMATIONS AFFILIE
            ================================================= */}

            <section className="voir-section">

                <div className="voir-section-title">

                    <h2>
                        Informations de l'affilié
                    </h2>

                </div>


                <div className="voir-info-grid">

                    <div className="voir-info-item">
                        <label>Matricule</label>
                        <span>
                            {affilie?.matricule || "-"}
                        </span>
                    </div>


                    <div className="voir-info-item">
                        <label>CIN</label>
                        <span>
                            {affilie?.cin || "-"}
                        </span>
                    </div>


                    <div className="voir-info-item">
                        <label>Nom</label>
                        <span>
                            {affilie?.nom || "-"}
                        </span>
                    </div>


                    <div className="voir-info-item">
                        <label>Prénom</label>
                        <span>
                            {affilie?.prenom || "-"}
                        </span>
                    </div>


                    <div className="voir-info-item">
                        <label>Date de naissance</label>
                        <span>
                            {formatDate(
                                affilie?.dateNaissance
                            )}
                        </span>
                    </div>


                    <div className="voir-info-item">
                        <label>Sexe</label>
                        <span>
                            {affilie?.sexe || "-"}
                        </span>
                    </div>


                    <div className="voir-info-item">
                        <label>Statut affilié</label>
                        <span>
                            {affilie?.statut || "-"}
                        </span>
                    </div>


                    <div className="voir-info-item">
                        <label>Statut matrimonial</label>
                        <span>
                            {demande.statutMatrimonial || "-"}
                        </span>
                    </div>

                </div>

            </section>


            {/* =================================================
                SECTION 2
                INFORMATIONS DEMANDE
            ================================================= */}

            <section className="voir-section">

                <div className="voir-section-title">

                    <h2>
                        Informations de la demande
                    </h2>

                </div>


                <div className="voir-info-grid">

                    <div className="voir-info-item">

                        <label>
                            Numéro demande
                        </label>

                        <span>
                            {demande.num}
                        </span>

                    </div>


                    <div className="voir-info-item">

                        <label>
                            Date de demande
                        </label>

                        <span>
                            {formatDate(
                                demande.dateDemande
                            )}
                        </span>

                    </div>


                    <div className="voir-info-item">

                        <label>
                            Type liquidation
                        </label>

                        <span>
                            {demande.typeLiquidation || "-"}
                        </span>

                    </div>


                    <div className="voir-info-item">

                        <label>
                            Date départ
                        </label>

                        <span>
                            {formatDate(
                                demande.dateDepart
                            )}
                        </span>

                    </div>


                    <div className="voir-info-item">

                        <label>
                            Date cessation activité
                        </label>

                        <span>
                            {formatDate(
                                demande.dateCessationActivite
                            )}
                        </span>

                    </div>


                    <div className="voir-info-item">

                        <label>
                            Ville
                        </label>

                        <span>
                            {demande.ville || "-"}
                        </span>

                    </div>


                    <div className="voir-info-item">

                        <label>
                            Pays
                        </label>

                        <span>
                            {demande.pays || "-"}
                        </span>

                    </div>


                    <div className="voir-info-item">

                        <label>
                            Code postal
                        </label>

                        <span>
                            {demande.codePostal || "-"}
                        </span>

                    </div>


                    <div className="voir-info-item">

                        <label>
                            Téléphone
                        </label>

                        <span>
                            {demande.telephone || "-"}
                        </span>

                    </div>


                    <div className="voir-info-item">

                        <label>
                            GSM
                        </label>

                        <span>
                            {demande.gsm || "-"}
                        </span>

                    </div>


                    <div className="voir-info-item">

                        <label>
                            Email
                        </label>

                        <span>
                            {demande.email || "-"}
                        </span>

                    </div>


                    <div className="voir-info-item">

                        <label>
                            Adresse
                        </label>

                        <span>
                            {demande.adresse || "-"}
                        </span>

                    </div>

                </div>

            </section>


            {/* =================================================
                SECTION 3
                PIECES
            ================================================= */}

            <section className="voir-section">

                <div className="voir-section-title">

                    <h2>
                        Pièces justificatives
                    </h2>

                    <p>
                        Statut des pièces lors de la validation.
                    </p>

                </div>


                {pieces.length === 0 ? (

                    <div className="voir-empty">
                        Aucune pièce enregistrée.
                    </div>

                ) : (

                    <div className="voir-table-wrapper">

                        <table className="voir-table">

                            <thead>

                                <tr>

                                    <th>
                                        Pièce
                                    </th>

                                    <th>
                                        Statut
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {pieces.map(piece => (

                                    <tr key={piece.id}>

                                        <td>

                                            {
                                                TYPES_PIECES[
                                                    piece.typePiece
                                                ] ||
                                                piece.nomPiece ||
                                                piece.typePiece
                                            }

                                        </td>


                                        <td>

                                            <span
                                                className={
                                                    `piece-badge piece-${piece.statutPiece}`
                                                }
                                            >
                                                {
                                                    piece.statutPiece
                                                }
                                            </span>

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                )}

            </section>


            {/* =================================================
                SECTION 4
                ANOMALIES
            ================================================= */}

            <section className="voir-section">

                <div className="voir-section-title">

                    <h2>
                        Anomalies détectées
                    </h2>

                    <p>
                        Anomalies enregistrées lors de la
                        validation de la demande.
                    </p>

                </div>


                {anomalies.length === 0 ? (

                    <div className="voir-empty success-empty">

                        Aucune anomalie détectée.

                    </div>

                ) : (

                    <div className="voir-anomalies">

                        {anomalies.map(
                            anomalie => (

                                <div
                                    className="voir-anomalie"
                                    key={anomalie.id}
                                >

                                    <div className="anomalie-title">

                                        <strong>
                                            {
                                                anomalie.typeAnomalie
                                            }
                                        </strong>

                                    </div>


                                    <p>
                                        {
                                            anomalie.description
                                        }
                                    </p>


                                    {anomalie.utilisateurNom && (

                                        <small>

                                            Détectée par :{" "}

                                            {
                                                anomalie.utilisateurPrenom
                                            }{" "}

                                            {
                                                anomalie.utilisateurNom
                                            }

                                        </small>

                                    )}

                                </div>

                            )
                        )}

                    </div>

                )}

            </section>


            {/* =================================================
                SECTION 5
                PERIODES DE COTISATION
            ================================================= */}

            <section className="voir-section">

                <div className="voir-section-title">

                    <h2>
                        Périodes de cotisation
                    </h2>

                </div>


                {affiliations.length === 0 ? (

                    <div className="voir-empty">

                        Aucune période de cotisation.

                    </div>

                ) : (

                    <div className="voir-affiliations">

                        {affiliations.map(
                            affiliation => (

                                <div
                                    className="voir-affiliation"
                                    key={
                                        affiliation.id
                                    }
                                >

                                    <div className="affiliation-header">

                                        <div>

                                            <h3>
                                                {
                                                    affiliation.raisonSociale ||
                                                    "Adhérent"
                                                }
                                            </h3>

                                            <p>
                                                ICE :{" "}
                                                {
                                                    affiliation.ice ||
                                                    "-"
                                                }
                                            </p>

                                        </div>


                                        <span className="regime-badge">

                                            {
                                                affiliation.typeRegime
                                            }

                                        </span>

                                    </div>


                                    <div className="voir-info-grid">

                                        <div className="voir-info-item">

                                            <label>
                                                Date début
                                            </label>

                                            <span>
                                                {
                                                    formatDate(
                                                        affiliation.dateDebut
                                                    )
                                                }
                                            </span>

                                        </div>


                                        <div className="voir-info-item">

                                            <label>
                                                Date fin
                                            </label>

                                            <span>
                                                {
                                                    formatDate(
                                                        affiliation.dateFin
                                                    )
                                                }
                                            </span>

                                        </div>


                                        <div className="voir-info-item">

                                            <label>
                                                Taux contribution
                                            </label>

                                            <span>
                                                {
                                                    affiliation
                                                        .tauxContribution ??
                                                    "-"
                                                }
                                            </span>

                                        </div>

                                    </div>


                                    {affiliation.contributions &&
                                        affiliation.contributions.length >
                                        0 && (

                                            <div className="voir-contributions">

                                                <h4>
                                                    Contributions
                                                </h4>


                                                <div className="voir-table-wrapper">

                                                    <table className="voir-table">

                                                        <thead>

                                                            <tr>

                                                                <th>
                                                                    Trimestre
                                                                </th>

                                                                <th>
                                                                    Année
                                                                </th>

                                                                <th>
                                                                    Salaire
                                                                </th>

                                                                <th>
                                                                    Part salariale
                                                                </th>

                                                                <th>
                                                                    Part patronale
                                                                </th>

                                                                <th>
                                                                    Points
                                                                </th>

                                                            </tr>

                                                        </thead>


                                                        <tbody>

                                                            {affiliation
                                                                .contributions
                                                                .map(
                                                                    contribution => (

                                                                        <tr
                                                                            key={
                                                                                contribution.id
                                                                            }
                                                                        >

                                                                            <td>
                                                                                {
                                                                                    contribution.trimestre
                                                                                }
                                                                            </td>

                                                                            <td>
                                                                                {
                                                                                    contribution.annee
                                                                                }
                                                                            </td>

                                                                            <td>
                                                                                {
                                                                                    contribution.salaireTri ??
                                                                                    "-"
                                                                                }
                                                                            </td>

                                                                            <td>
                                                                                {
                                                                                    contribution.contriPartSalariale ??
                                                                                    "-"
                                                                                }
                                                                            </td>

                                                                            <td>
                                                                                {
                                                                                    contribution.contriPartPatronale ??
                                                                                    "-"
                                                                                }
                                                                            </td>

                                                                            <td>
                                                                                {
                                                                                    contribution.pointsTri ??
                                                                                    "-"
                                                                                }
                                                                            </td>

                                                                        </tr>

                                                                    )
                                                                )}

                                                        </tbody>

                                                    </table>

                                                </div>

                                            </div>

                                        )}

                                </div>

                            )
                        )}

                    </div>

                )}

            </section>


            {/* =================================================
                RETOUR
            ================================================= */}

            <div className="voir-actions">

                <button type="button" className="voir-button-retour" onClick={() =>
                        navigate(-1)
                    }>
                    Retour à la liste
                </button>
            </div>

        </div>
    );
};


export default VoirDemandeLiquidation;