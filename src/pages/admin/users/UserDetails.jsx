import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../services/api";

function UserDetails() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [user, setUser] = useState(null);

    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {

        try {

            const response = await api.get(`/admin/users/${id}`);

            setUser(response.data);

        } catch (error) {

            console.error(error);
            alert("Impossible de charger les informations.");

        }

    };

    if (!user) {
        return <h3>Chargement...</h3>;
    }

    return (

        <div className="details-container">

            <div className="details-card">

                <h2>Détails de l'utilisateur</h2>

                <div className="details-grid">

                    <div className="item">
                        <span>Nom</span>
                        <p>{user.nom}</p>
                    </div>

                    <div className="item">
                        <span>Prénom</span>
                        <p>{user.prenom}</p>
                    </div>

                    <div className="item">
                        <span>Nom d'utilisateur</span>
                        <p>{user.username}</p>
                    </div>

                    <div className="item">
                        <span>Email</span>
                        <p>{user.email}</p>
                    </div>

                    <div className="item">
                        <span>Rôle</span>
                        <p>{user.role}</p>
                    </div>

                    <div className="item">
                        <span>Statut</span>

                        <p>

                            {
                                user.actif
                                    ? "Actif"
                                    : "Désactivé"
                            }

                        </p>

                    </div>

                    <div className="item">
                        <span>Date de création</span>
                        <p>{user.createdAt}</p>
                    </div>

                    <div className="item">
                        <span>Dernière connexion</span>

                        <p>

                            {
                                user.dernierLogin
                                    ? user.dernierLogin
                                    : "-"
                            }

                        </p>

                    </div>

                </div>

                <div className="details-buttons">

                    <button
                        className="back-btn"
                        onClick={() => navigate("/admin/users")}
                    >
                        Retour
                    </button>

                    <button
                        className="edit-btn"
                        onClick={() => navigate(`/admin/users/edit/${id}`)}
                    >
                        Modifier
                    </button>

                </div>

            </div>

        </div>

    );

}

export default UserDetails;