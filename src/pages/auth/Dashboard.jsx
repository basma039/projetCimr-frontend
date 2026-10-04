import { useEffect, useState } from "react";
import api from "../../services/api";
import AuthService from "../../services/AuthService";
import "./Dashboard.css";

export default function Dashboard() {

    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);

    const role = AuthService.getRole();

    useEffect(() => {

        const loadDashboard = async () => {

            try {

                const response = await api.get("/dashboard");

                setDashboard(response.data);

            } catch (error) {

                console.error(
                    "Erreur dashboard :",
                    error
                );

            } finally {

                setLoading(false);
            }
        };

        loadDashboard();

    }, []);

    if (loading) {
        return (
            <div className="dashboard-loading">
                Chargement...
            </div>
        );
    }

    if (!dashboard) {
        return (
            <div className="dashboard-error">
                Impossible de charger le dashboard.
            </div>
        );
    }

    return (
        <div className="dashboard">

            <div className="dashboard-header">

                <div>
                    <h1>Dashboard</h1>

                    <p>
                        Vue d'ensemble de l'activité
                    </p>
                </div>

                <span className="dashboard-role">
                    {role}
                </span>

            </div>


            {/* STATISTIQUES */}

            <div className="dashboard-cards">

                <StatCard
                    title="Total demandes"
                    value={dashboard.totalDemandes}
                />

                <StatCard
                    title="Nouvelles"
                    value={dashboard.nouvelles}
                />

                <StatCard
                    title="En cours"
                    value={dashboard.enCours}
                />

                <StatCard
                    title="En contrôle"
                    value={dashboard.enControle}
                />

                <StatCard
                    title="En attente pièces"
                    value={dashboard.enAttentePieces}
                />

                <StatCard
                    title="Liquidées"
                    value={dashboard.liquidees}
                />

            </div>


            {/* CONTENU SELON ROLE */}

            {role === "AGENT_SAISIE" && (

                <AgentDashboard
                    dashboard={dashboard}
                />

            )}


            {role === "CONTROLEUR" && (

                <ControleurDashboard
                    dashboard={dashboard}
                />

            )}


            {role === "ADMIN" && (

                <AdminDashboard
                    dashboard={dashboard}
                />

            )}

        </div>
    );
}