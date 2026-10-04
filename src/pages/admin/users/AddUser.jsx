import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./userForm.css";
import api from "../../../services/api";

function AddUser() {

    const navigate = useNavigate();

    const [user, setUser] = useState({
        username: "",
        password: "",
        nom: "",
        prenom: "",
        email: "",
        role: "AGENT_SAISIE"
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {

        setUser({
            ...user,
            [e.target.name]: e.target.value
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            setLoading(true);

            await api.post("/admin/users", user);

            alert("Utilisateur créé avec succès.");

            navigate("/admin/users");

        } catch (error) {

            console.error(error);

            alert("Erreur lors de la création.");

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className="user-form-container">

            <div className="user-form-card">

                <h2>Créer un utilisateur</h2>

                <form onSubmit={handleSubmit}>

                    <div className="form-group">
                        <label>Nom</label>

                        <input
                            type="text"
                            name="nom"
                            value={user.nom}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Prénom</label>

                        <input
                            type="text"
                            name="prenom"
                            value={user.prenom}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Nom d'utilisateur</label>

                        <input
                            type="text"
                            name="username"
                            value={user.username}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Email</label>

                        <input
                            type="email"
                            name="email"
                            value={user.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Mot de passe</label>

                        <input
                            type="password"
                            name="password"
                            value={user.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Rôle</label>

                        <select
                            name="role"
                            value={user.role}
                            onChange={handleChange}
                        >
                            <option value="AGENT_SAISIE">
                                Agent de saisie
                            </option>

                            <option value="CONTROLEUR">
                                Contrôleur
                            </option>
                        </select>

                    </div>

                    <div className="buttons">

                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={() => navigate("/admin/users")}
                        >
                            Annuler
                        </button>

                        <button
                            type="submit"
                            className="save-btn"
                            disabled={loading}
                        >
                            {loading ? "Création..." : "Créer"}
                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

}

export default AddUser;