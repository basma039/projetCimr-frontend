import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./userForm.css";
import api from "../../../services/api";

function EditUser() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const [user, setUser] = useState({
        username: "",
        nom: "",
        prenom: "",
        email: "",
        role: "AGENT_SAISIE",
        actif: true
    });

    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {

        try {

            const response = await api.get(`/admin/users/${id}`);

            setUser(response.data);

        } catch (error) {

            console.error(error);
            alert("Impossible de charger l'utilisateur.");

        }

    };

    const handleChange = (e) => {

        const { name, value, type, checked } = e.target;

        setUser({
            ...user,
            [name]: type === "checkbox" ? checked : value
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            setLoading(true);

            await api.put(`/admin/users/${id}`, user);

            alert("Utilisateur modifié avec succès.");

            navigate("/admin/users");

        } catch (error) {

            console.error(error);

            alert("Erreur lors de la modification.");

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className="user-form-container">

            <div className="user-form-card">

                <h2>Modifier un utilisateur</h2>

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

                            <option value="ADMIN">
                                Administrateur
                            </option>

                        </select>

                    </div>

                    <div className="checkbox">

                        <input
                            type="checkbox"
                            id="actif"
                            name="actif"
                            checked={user.actif}
                            onChange={handleChange}
                        />

                        <label htmlFor="actif">
                            Compte actif
                        </label>

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
                            {loading ? "Enregistrement..." : "Enregistrer"}
                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

}

export default EditUser;