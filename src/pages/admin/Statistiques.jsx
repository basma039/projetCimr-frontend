import React, { useEffect, useState } from "react";
import { getStatistiquesAdmin } from "../../services/StatistiquesService";
import "./statistiques.css";

const Statistiques = () => {

    const [statistiques, setStatistiques] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        chargerStatistiques();
    }, []);

    const chargerStatistiques = async () => {

        try {

            setLoading(true);
            setError("");

            const data = await getStatistiquesAdmin();

            console.log("Statistiques Admin :", data);

            setStatistiques(data);

        } catch (err) {

            console.error(
                "Erreur chargement statistiques :",
                err
            );

            setError(
                "Impossible de charger les statistiques."
            );

        } finally {

            setLoading(false);
        }
    };


    /*
     * ==========================================================
     * CHARGEMENT
     * ==========================================================
     */

    if (loading) {
        return (
            <div className="dashboard-loading">
                <div className="spinner"></div>
                <p>Chargement des statistiques...</p>
            </div>
        );
    }


    /*
     * ==========================================================
     * ERREUR
     * ==========================================================
     */

    if (error) {
        return (
            <div className="dashboard-error">

                <h3>Erreur</h3>

                <p>{error}</p>

                <button
                    onClick={chargerStatistiques}
                    className="btn-retry"
                >
                    Réessayer
                </button>

            </div>
        );
    }


    if (!statistiques) {
        return null;
    }


    /*
     * ==========================================================
     * DONNEES
     * ==========================================================
     */

    const statuts = [
        {
            nom: "Nouvelles",
            valeur: statistiques.nouvelles,
            classe: "stat-nouvelle",
        },
        {
            nom: "En cours",
            valeur: statistiques.enCours,
            classe: "stat-encours",
        },
        {
            nom: "En contrôle",
            valeur: statistiques.enControle,
            classe: "stat-controle",
        },
        {
            nom: "En attente de pièces",
            valeur: statistiques.enAttentePieces,
            classe: "stat-attente",
        },
        {
            nom: "Validées",
            valeur: statistiques.validees,
            classe: "stat-validee",
        },
        {
            nom: "Rejetées",
            valeur: statistiques.rejetees,
            classe: "stat-rejetee",
        },
        {
            nom: "Anomalies",
            valeur: statistiques.anomalies,
            classe: "stat-anomalie",
        },
        {
            nom: "Liquidées",
            valeur: statistiques.liquidees,
            classe: "stat-liquidee",
        },
    ];


    /*
     * ==========================================================
     * MAX POUR LES BARRES
     * ==========================================================
     */

    const maxStatut = Math.max(
        ...statuts.map((s) => s.valeur),
        1
    );


    /*
     * ==========================================================
     * NOM DU MOIS
     * ==========================================================
     */

    const getNomMois = (mois) => {

        const moisNoms = [
            "Jan",
            "Fév",
            "Mar",
            "Avr",
            "Mai",
            "Juin",
            "Juil",
            "Août",
            "Sep",
            "Oct",
            "Nov",
            "Déc",
        ];

        return moisNoms[mois - 1] || mois;
    };


    /*
     * ==========================================================
     * MAX EVOLUTION
     * ==========================================================
     */

    const toutesLesValeurs = [
        ...(statistiques.nouvellesParMois || []),
        ...(statistiques.liquideesParMois || []),
        ...(statistiques.rejeteesParMois || []),
    ].map((item) => item.nombre);

    const maxMois = Math.max(
        ...toutesLesValeurs,
        1
    );


    /*
     * ==========================================================
     * AFFICHAGE
     * ==========================================================
     */

    return (
        <div className="dashboard-admin">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="dashboard-header">

                <div>
                    <h1>Dashboard Administrateur</h1>

                    <p>
                        Vue globale du traitement des demandes
                        de liquidation.
                    </p>
                </div>

                <button
                    className="btn-refresh"
                    onClick={chargerStatistiques}
                >
                    ↻ Actualiser
                </button>

            </div>


            {/* =================================================
                CARTES PRINCIPALES
            ================================================= */}

            <div className="stats-cards">

                <div className="stat-card total">

                    <div className="stat-card-icon">
                        📋
                    </div>

                    <div>
                        <span>Total demandes</span>
                        <strong>
                            {statistiques.totalDemandes}
                        </strong>
                    </div>

                </div>


                <div className="stat-card en-cours">

                    <div className="stat-card-icon">
                        ⏳
                    </div>

                    <div>
                        <span>En cours</span>
                        <strong>
                            {statistiques.enCours}
                        </strong>
                    </div>

                </div>


                <div className="stat-card controle">

                    <div className="stat-card-icon">
                        🔎
                    </div>

                    <div>
                        <span>En contrôle</span>
                        <strong>
                            {statistiques.enControle}
                        </strong>
                    </div>

                </div>


                <div className="stat-card validee">

                    <div className="stat-card-icon">
                        ✓
                    </div>

                    <div>
                        <span>Validées</span>
                        <strong>
                            {statistiques.validees}
                        </strong>
                    </div>

                </div>


                <div className="stat-card rejetee">

                    <div className="stat-card-icon">
                        ✕
                    </div>

                    <div>
                        <span>Rejetées</span>
                        <strong>
                            {statistiques.rejetees}
                        </strong>
                    </div>

                </div>


                <div className="stat-card liquidee">

                    <div className="stat-card-icon">
                        ✓
                    </div>

                    <div>
                        <span>Liquidées</span>
                        <strong>
                            {statistiques.liquidees}
                        </strong>
                    </div>

                </div>

            </div>


            {/* =================================================
                STATUTS
            ================================================= */}

            <div className="dashboard-grid">

                <div className="dashboard-box">

                    <div className="box-header">

                        <h2>Répartition actuelle</h2>

                        <span>
                            {statistiques.totalDemandes} demandes
                        </span>

                    </div>


                    <div className="status-list">

                        {statuts.map((statut) => {

                            const pourcentage =
                                statistiques.totalDemandes > 0
                                    ? (
                                        statut.valeur /
                                        statistiques.totalDemandes
                                    ) * 100
                                    : 0;

                            return (
                                <div
                                    className="status-row"
                                    key={statut.nom}
                                >

                                    <div className="status-info">

                                        <span>
                                            {statut.nom}
                                        </span>

                                        <strong>
                                            {statut.valeur}
                                        </strong>

                                    </div>


                                    <div className="status-bar-container">

                                        <div
                                            className={`status-bar ${statut.classe}`}
                                            style={{
                                                width: `${(
                                                    statut.valeur /
                                                    maxStatut
                                                ) * 100}%`,
                                            }}
                                        />

                                    </div>


                                    <span className="status-percentage">
                                        {pourcentage.toFixed(1)}%
                                    </span>

                                </div>
                            );

                        })}

                    </div>

                </div>


                {/* =================================================
                    INFORMATIONS COMPLEMENTAIRES
                ================================================= */}

                <div className="dashboard-box">

                    <div className="box-header">

                        <h2>Informations importantes</h2>

                    </div>


                    <div className="info-list">

                        <div className="info-item">

                            <div>
                                <span>
                                    Demandes avec anomalie
                                </span>

                                <small>
                                    Ayant connu au moins une anomalie
                                </small>
                            </div>

                            <strong>
                                {statistiques.demandesAvecAnomalie}
                            </strong>

                        </div>


                        <div className="info-item">

                            <div>
                                <span>
                                    En attente de pièces
                                </span>

                                <small>
                                    Actuellement en attente
                                </small>
                            </div>

                            <strong>
                                {statistiques.demandesEnAttentePieces}
                            </strong>

                        </div>


                        <div className="info-item">

                            <div>
                                <span>
                                    Demandes rejetées
                                </span>

                                <small>
                                    Total des demandes rejetées
                                </small>
                            </div>

                            <strong>
                                {statistiques.demandesRejetees}
                            </strong>

                        </div>


                        <div className="info-item">

                            <div>
                                <span>
                                    Temps moyen
                                </span>

                                <small>
                                    Traitement d'une demande
                                </small>
                            </div>

                            <strong>
                                {statistiques.tempsMoyenTraitementJours}
                                {" "}jours
                            </strong>

                        </div>

                    </div>

                </div>

            </div>


            {/* =================================================
                EVOLUTION MENSUELLE
            ================================================= */}

            <div className="dashboard-box evolution-box">

                <div className="box-header">

                    <div>

                        <h2>Évolution mensuelle</h2>

                        <p>
                            Nombre de demandes selon leur évolution
                        </p>

                    </div>

                </div>


                <div className="monthly-chart">

                    {statistiques.nouvellesParMois?.map(
                        (item, index) => {

                            const liquidation =
                                statistiques.liquideesParMois?.find(
                                    (l) =>
                                        l.annee === item.annee &&
                                        l.mois === item.mois
                                );

                            const rejet =
                                statistiques.rejeteesParMois?.find(
                                    (r) =>
                                        r.annee === item.annee &&
                                        r.mois === item.mois
                                );

                            const nouvelleHeight =
                                (item.nombre / maxMois) * 100;

                            const liquidationHeight =
                                ((liquidation?.nombre || 0) /
                                    maxMois) * 100;

                            const rejetHeight =
                                ((rejet?.nombre || 0) /
                                    maxMois) * 100;

                            return (
                                <div
                                    className="month-column"
                                    key={`${item.annee}-${item.mois}`}
                                >

                                    <div className="bars">

                                        <div
                                            className="month-bar nouvelles"
                                            style={{
                                                height:
                                                    `${nouvelleHeight}%`,
                                            }}
                                            title={`Nouvelles : ${item.nombre}`}
                                        />

                                        <div
                                            className="month-bar liquidees"
                                            style={{
                                                height:
                                                    `${liquidationHeight}%`,
                                            }}
                                            title={`Liquidées : ${liquidation?.nombre || 0}`}
                                        />

                                        <div
                                            className="month-bar rejetees"
                                            style={{
                                                height:
                                                    `${rejetHeight}%`,
                                            }}
                                            title={`Rejetées : ${rejet?.nombre || 0}`}
                                        />

                                    </div>

                                    <span>
                                        {getNomMois(item.mois)}
                                    </span>

                                    <small>
                                        {item.annee}
                                    </small>

                                </div>
                            );

                        }
                    )}

                </div>


                <div className="chart-legend">

                    <span>
                        <i className="legend-nouvelles"></i>
                        Nouvelles
                    </span>

                    <span>
                        <i className="legend-liquidees"></i>
                        Liquidées
                    </span>

                    <span>
                        <i className="legend-rejetees"></i>
                        Rejetées
                    </span>

                </div>

            </div>


            {/* =================================================
                TRANSITIONS
            ================================================= */}

            <div className="dashboard-box">

                <div className="box-header">

                    <div>

                        <h2>Transitions de statut</h2>

                        <p>
                            Historique des changements de statut
                        </p>

                    </div>

                </div>


                <div className="table-container">

                    <table>

                        <thead>

                            <tr>
                                <th>Ancien statut</th>
                                <th></th>
                                <th>Nouveau statut</th>
                                <th>Nombre</th>
                            </tr>

                        </thead>

                        <tbody>

                            {statistiques.transitions?.length > 0 ? (

                                statistiques.transitions.map(
                                    (transition, index) => (

                                        <tr key={index}>

                                            <td>
                                                <span className="status-badge">
                                                    {transition.ancienStatut}
                                                </span>
                                            </td>

                                            <td className="arrow">
                                                →
                                            </td>

                                            <td>
                                                <span className="status-badge">
                                                    {transition.nouveauStatut}
                                                </span>
                                            </td>

                                            <td>
                                                <strong>
                                                    {transition.nombre}
                                                </strong>
                                            </td>

                                        </tr>

                                    )
                                )

                            ) : (

                                <tr>

                                    <td
                                        colSpan="4"
                                        className="empty"
                                    >
                                        Aucune transition disponible.
                                    </td>

                                </tr>

                            )}

                        </tbody>

                    </table>

                </div>

            </div>


            {/* =================================================
                ACTIVITE UTILISATEURS
            ================================================= */}

            <div className="dashboard-box">

                <div className="box-header">

                    <div>

                        <h2>Activité des utilisateurs</h2>

                        <p>
                            Nombre de changements de statut enregistrés
                        </p>

                    </div>

                </div>


                <div className="table-container">

                    <table>

                        <thead>

                            <tr>
                                <th>Utilisateur</th>
                                <th>Nombre d'actions</th>
                            </tr>

                        </thead>

                        <tbody>

                            {statistiques.actionsParUtilisateur?.length > 0 ? (

                                statistiques.actionsParUtilisateur.map(
                                    (utilisateur) => (

                                        <tr
                                            key={utilisateur.utilisateurId}
                                        >

                                            <td>
                                                {utilisateur.username}
                                            </td>

                                            <td>
                                                <strong>
                                                    {utilisateur.nombreActions}
                                                </strong>
                                            </td>

                                        </tr>

                                    )
                                )

                            ) : (

                                <tr>

                                    <td
                                        colSpan="2"
                                        className="empty"
                                    >
                                        Aucune activité disponible.
                                    </td>

                                </tr>

                            )}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>
    );
};

export default Statistiques;