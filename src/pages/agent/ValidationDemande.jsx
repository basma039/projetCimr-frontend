import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import "./ValidationDemandeCss.css";
import {
    getDemandeValidation,
    validerDemande
} from "../../services/DemandeLiquidationService";
import { getUsername } from "../../services/AuthService";

// import "./ValidationDemande.css";
const TYPES_PIECES = [
    {
        value: "COPIE_CIN",
        label: "Copie CIN"
    },
    {
        value: "RIB",
        label: "RIB"
    },
    {
        value: "ATTESTATION_DECLARATION_SALAIRE",
        label: "Attestation déclaration salaire"
    },
    {
        value: "ACTE_MARIAGE",
        label: "Acte de mariage"
    },
    {
        value: "SITUATION_COTISATION_SALARIALE",
        label: "Situation de cotisation salariale"
    }
];


const STATUTS_PIECE = [
    "NON_RECU",
    "RECU_CONFORME",
    "RECU_NON_CONFORME",
    "INUTILE",
    "AUTRE"
];


const ValidationDemande = () => {

    const { num } = useParams();
    const navigate = useNavigate();

    const [demande, setDemande] = useState(null);

    const [pieces, setPieces] = useState([]);

    const [anomalies, setAnomalies] = useState([]);

    const [nouvelleAnomalie, setNouvelleAnomalie] =
        useState({
            typeAnomalie: "",
            description: ""
        });

    const [loading, setLoading] = useState(true);

    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");


    // =====================================================
    // CHARGEMENT
    // =====================================================

    useEffect(() => {

        const chargerDemande = async () => {

            try {

                setLoading(true);
                setError("");

                const data =
                    await getDemandeValidation(num);

                setDemande(data);
                // -----------------------------------------
                // Pièces
                // -----------------------------------------

                const piecesBackend =
                    data.pieces || [];

                const statutMatrimonial =
                    data.statutMatrimonial;

                const piecesInitiales =
                    TYPES_PIECES
                        .filter(piece => {

                            if (
                                piece.value ===
                                "ACTE_MARIAGE"
                            ) {
                                return (
                                    statutMatrimonial ===
                                    "MARIE"
                                );
                            }

                            return true;
                        })
                        .map(piece => {

                            const existante =
                                piecesBackend.find(
                                    p =>
                                        p.typePiece ===
                                        piece.value
                                );

                            return {
                                id:
                                    existante?.id ||
                                    null,

                                typePiece:
                                    piece.value,

                                nomPiece:
                                    existante?.nomPiece ||
                                    piece.label,

                                statutPiece:
                                    existante?.statutPiece ||
                                    "NON_RECU"
                            };
                        });

                setPieces(piecesInitiales);

                // -----------------------------------------
                // Anomalies
                // -----------------------------------------

                setAnomalies(
                    data.anomalies || []
                );

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

    }, [num]);


    // =====================================================
    // MODIFICATION STATUT PIECE
    // =====================================================

    const modifierStatutPiece = (
        typePiece,
        statutPiece
    ) => {

        setPieces(prev =>
            prev.map(piece =>
                piece.typePiece === typePiece
                    ? {
                        ...piece,
                        statutPiece
                    }
                    : piece
            )
        );
    };

    // =====================================================
    // NOUVELLE ANOMALIE
    // =====================================================

    const modifierNouvelleAnomalie = (
        champ,
        valeur
    ) => {

        setNouvelleAnomalie(prev => ({
            ...prev,
            [champ]: valeur
        }));
    };


    const ajouterAnomalie = () => {

        if (
            !nouvelleAnomalie.typeAnomalie.trim()
        ) {

            alert(
                "Veuillez saisir le type de l'anomalie."
            );

            return;
        }

        if (
            !nouvelleAnomalie.description.trim()
        ) {

            alert(
                "Veuillez saisir la description de l'anomalie."
            );

            return;
        }

        setAnomalies(prev => [
            ...prev,

            {
                id: null,

                typeAnomalie:
                    nouvelleAnomalie.typeAnomalie,

                description:
                    nouvelleAnomalie.description
            }
        ]);

        setNouvelleAnomalie({
            typeAnomalie: "",
            description: ""
        });
    };


    // =====================================================
    // SUPPRIMER UNE NOUVELLE ANOMALIE
    // =====================================================

    const supprimerAnomalie = (index) => {

        const anomalie =
            anomalies[index];

        // Une anomalie déjà enregistrée
        // ne sera pas supprimée ici.
        if (anomalie.id) {

            alert(
                "Cette anomalie est déjà enregistrée et ne peut pas être supprimée depuis cette page."
            );

            return;
        }

        setAnomalies(prev =>
            prev.filter(
                (_, i) => i !== index
            )
        );
    };


    // =====================================================
    // VALIDATION
    // =====================================================

    const handleValidation = async () => {

        try {

            setSaving(true);

            setError("");
            setSuccess("");

            const payload = {

                pieces: pieces.map(piece => ({
                    id: piece.id,

                    typePiece:
                        piece.typePiece,

                    nomPiece:
                        piece.nomPiece,

                    statutPiece:
                        piece.statutPiece
                })),

                anomalies: anomalies.map(anomalie => ({
                    id: anomalie.id,

                    typeAnomalie:
                        anomalie.typeAnomalie,

                    description:
                        anomalie.description
                }))
            };


            const response =
                await validerDemande(
                    num,
                    payload
                );


            setDemande(response);


            // Recharger les anomalies
            setAnomalies(
                response.anomalies || []
            );


            // Recharger les pièces
            const piecesBackend =
                response.pieces || [];

            const piecesInitiales =
                TYPES_PIECES
                    .filter(piece => {

                        if (
                            piece.value ===
                            "ACTE_MARIAGE"
                        ) {

                            return (
                                response.statutMatrimonial ===
                                "MARIE"
                            );
                        }

                        return true;
                    })
                    .map(piece => {

                        const existante =
                            piecesBackend.find(
                                p =>
                                    p.typePiece ===
                                    piece.value
                            );

                        return {
                            id:
                                existante?.id ||
                                null,

                            typePiece:
                                piece.value,

                            nomPiece:
                                existante?.nomPiece ||
                                piece.label,

                            statutPiece:
                                existante?.statutPiece ||
                                "NON_RECU"
                        };
                    });

            setPieces(piecesInitiales);


           setSuccess(
    `Validation enregistrée. Nouveau statut : ${response.statutDemande}`
);

// Retour automatique à la page précédente
setTimeout(() => {
    navigate(-1);
}, 1000);

        } catch (err) {

            console.error(err);

            setError(
                err.response?.data?.message ||
                "Une erreur est survenue lors de la validation."
            );

        } finally {

            setSaving(false);
        }
    };


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
            <div className="validation-container">

                <div className="validation-loading">
                    Chargement de la demande...
                </div>

            </div>
        );
    }


    // =====================================================
    // ERREUR
    // =====================================================

    if (!demande) {

        return (
            <div className="validation-container">

                <div className="validation-error">
                    {error ||
                        "Demande introuvable."}
                </div>

            </div>
        );
    }


    const affilie =
        demande.affilie;

    const affiliations =
        demande.affiliations || [];


    return (

        <div className="validation-container">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="validation-header">

                <div>

                    <h1>
                        Validation de la saisie
                    </h1>

                    <p>
                        Demande n° {demande.num}
                    </p>

                </div>


                <div className="validation-status">

                    <span>
                        Statut actuel
                    </span>

                    <strong>
                        {demande.statutDemande}
                    </strong>

                </div>

            </div>


            {error && (

                <div className="validation-message error">
                    {error}
                </div>

            )}


            {success && (

                <div className="validation-message success">
                    {success}
                </div>

            )}


            {/* =================================================
                INFORMATIONS AFFILIE
            ================================================= */}

            <section className="validation-section">

                <div className="section-title">

                    <h2>
                        Informations de l'affilié
                    </h2>

                </div>


                <div className="info-grid">

                    <div className="info-item">
                        <label>Matricule</label>
                        <span>
                            {affilie?.matricule || "-"}
                        </span>
                    </div>


                    <div className="info-item">
                        <label>CIN</label>
                        <span>
                            {affilie?.cin || "-"}
                        </span>
                    </div>


                    <div className="info-item">
                        <label>Nom</label>
                        <span>
                            {affilie?.nom || "-"}
                        </span>
                    </div>


                    <div className="info-item">
                        <label>Prénom</label>
                        <span>
                            {affilie?.prenom || "-"}
                        </span>
                    </div>


                    <div className="info-item">
                        <label>Date de naissance</label>
                        <span>
                            {formatDate(
                                affilie?.dateNaissance
                            )}
                        </span>
                    </div>


                    <div className="info-item">
                        <label>Sexe</label>
                        <span>
                            {affilie?.sexe || "-"}
                        </span>
                    </div>


                    <div className="info-item">
                        <label>Statut affilié</label>
                        <span>
                            {affilie?.statut || "-"}
                        </span>
                    </div>


                    <div className="info-item">
                        <label>Statut matrimonial</label>
                        <span>
                            {demande.statutMatrimonial}
                        </span>
                    </div>

                </div>

            </section>


            {/* =================================================
                SECTION 1 — PIECES
            ================================================= */}

            <section className="validation-section">

                <div className="section-title">

                    <h2>
                        1. Pièces justificatives
                    </h2>

                    <p>
                        Indiquez le statut de chaque pièce.
                    </p>

                </div>


                <div className="table-wrapper">

                    <table className="validation-table">

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

                                <tr
                                    key={piece.typePiece}
                                >

                                    <td>

                                        <strong>
                                            {
                                                TYPES_PIECES
                                                    .find(
                                                        p =>
                                                            p.value ===
                                                            piece.typePiece
                                                    )?.label
                                            }
                                        </strong>

                                    </td>


                                    <td>

                                        <select
                                            value={
                                                piece.statutPiece
                                            }

                                            onChange={e =>
                                                modifierStatutPiece(
                                                    piece.typePiece,
                                                    e.target.value
                                                )
                                            }

                                            className={
                                                `piece-status ${piece.statutPiece}`
                                            }
                                        >

                                            {STATUTS_PIECE.map(
                                                statut => (

                                                    <option
                                                        key={
                                                            statut
                                                        }
                                                        value={
                                                            statut
                                                        }
                                                    >
                                                        {statut}
                                                    </option>

                                                )
                                            )}

                                        </select>

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            </section>


            {/* =================================================
                SECTION 2 — ANOMALIES
            ================================================= */}

            <section className="validation-section">

                <div className="section-title">

                    <h2>
                        2. Anomalies
                    </h2>

                    <p>
                        Les anomalies sont indépendantes
                        des pièces justificatives.
                    </p>

                </div>


                {/* ANOMALIES EXISTANTES */}

                {anomalies.length > 0 && (

                    <div className="anomalies-list">

                        {anomalies.map(
                            (anomalie, index) => (

                                <div
                                    className="anomalie-card"
                                    key={
                                        anomalie.id ||
                                        index
                                    }
                                >

                                    <div>

                                        <strong>
                                            {
                                                anomalie.typeAnomalie
                                            }
                                        </strong>

                                        <p>
                                            {
                                                anomalie.description
                                            }
                                        </p>
                                      </div>

                                    {!anomalie.id && (

                                        <button
                                            type="button"
                                            className="button-delete"
                                            onClick={() =>
                                                supprimerAnomalie(
                                                    index
                                                )
                                            }
                                        >
                                            Supprimer
                                        </button>

                                    )}

                                </div>

                            )
                        )}

                    </div>

                )}


                {/* AJOUT ANOMALIE */}

                <div className="anomalie-form">

                    <div className="form-group">

                        <label>
                            Type d'anomalie
                        </label>

                        <input
                            type="text"
                            value={
                                nouvelleAnomalie
                                    .typeAnomalie
                            }
                            onChange={e =>
                                modifierNouvelleAnomalie(
                                    "typeAnomalie",
                                    e.target.value
                                )
                            }
                            placeholder="Ex : Informations incorrectes"
                        />

                    </div>


                    <div className="form-group">

                        <label>
                            Description
                        </label>

                        <textarea
                            value={
                                nouvelleAnomalie
                                    .description
                            }
                            onChange={e =>
                                modifierNouvelleAnomalie(
                                    "description",
                                    e.target.value
                                )
                            }
                            placeholder="Décrire précisément l'anomalie..."
                            rows="4"
                        />

                    </div>


                    <button
                        type="button"
                        className="button-secondary"
                        onClick={
                            ajouterAnomalie
                        }
                    >
                        + Ajouter une anomalie
                    </button>

                </div>

            </section>


            {/* =================================================
                SECTION 3 — COTISATIONS
            ================================================= */}

            <section className="validation-section">

                <div className="section-title">

                    <h2>
                        3. Périodes de cotisation
                    </h2>

                    <p>
                        Historique des affiliations et
                        cotisations de l'affilié.
                    </p>

                </div>


                {affiliations.length === 0 ? (

                    <div className="empty-state">
                        Aucune période de cotisation trouvée.
                    </div>

                ) : (

                    <div className="affiliations">

                        {affiliations.map(
                            affiliation => (

                                <div
                                    className="affiliation-card"
                                    key={
                                        affiliation.id
                                    }
                                >

                                    <div className="affiliation-header">

                                        <div>

                                            <h3>
                                                {
                                                    affiliation
                                                        .raisonSociale ||
                                                    "Adhérent"
                                                }
                                            </h3>

                                            <p>
                                                ICE : {
                                                    affiliation.ice ||
                                                    "-"
                                                }
                                            </p>

                                        </div>


                                        <strong>
                                            {
                                                affiliation
                                                    .typeRegime
                                            }
                                        </strong>

                                    </div>


                                    <div className="info-grid">

                                        <div className="info-item">

                                            <label>
                                                Date début
                                            </label>

                                            <span>
                                                {
                                                    formatDate(
                                                        affiliation
                                                            .dateDebut
                                                    )
                                                }
                                            </span>

                                        </div>


                                        <div className="info-item">

                                            <label>
                                                Date fin
                                            </label>

                                            <span>
                                                {
                                                    formatDate(
                                                        affiliation
                                                            .dateFin
                                                    )
                                                }
                                            </span>

                                        </div>


                                        <div className="info-item">

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


                                    {/* CONTRIBUTIONS */}

                                    {affiliation.contributions &&
                                        affiliation.contributions.length >
                                        0 && (

                                            <div className="contributions">

                                                <h4>
                                                    Contributions
                                                </h4>


                                                <div className="table-wrapper">

                                                    <table className="validation-table">

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
                ACTIONS
            ================================================= */}

            <div className="validation-actions">

                <button
                    type="button"
                    className="button-cancel"
                    onClick={() =>
                        navigate(-1)
                    }
                    disabled={saving}
                >
                    Retour
                </button>

               {demande.agent?.username == getUsername() && demande.statutDemande === "EN_COURS" && (
                    <button
                        type="button"
                        className="button-primary"
                        onClick={
                            handleValidation
                    }
                    disabled={saving}
                >
                    {saving
                        ? "Validation..."
                        : "Valider la saisie"}
                </button>
                )}
            </div>
        </div>
    );
};

export default ValidationDemande;