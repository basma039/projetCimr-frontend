import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";
import api from "../services/api";
import ImageLogo from "../assets/CIMR.jpg";

function Login() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        password: ""
    });

    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        try {

            const response = await api.post("/auth/login", formData);

            const data = response.data;

            // Sauvegarder le token
            localStorage.setItem("token", data.token);

            // Sauvegarder les informations de l'utilisateur
            localStorage.setItem("username", data.username);
            localStorage.setItem("role", data.role);
            localStorage.setItem("nom", data.nom);
            localStorage.setItem("prenom", data.prenom);

            // Redirection selon le rôle
            if (data.role === "ADMIN") {
                console.log('vous êtes ',data.role)
                navigate("/admin");

            } else if (data.role === "AGENT_SAISIE") {

                navigate("/agent");

            } else if (data.role === "CONTROLEUR") {

                navigate("/controleur");

            }

        } catch (err) {setError("Nom d'utilisateur ou mot de passe incorrect.");}

    };

    return (
        <div className="login-page">

            <div className="login-card">
                <img src={ImageLogo} alt="CIMR" className="login-logo"/>


                <h2>Connexion</h2>

                <form onSubmit={handleSubmit}>

                    <div className="form-group">

                        <label>Nom d'utilisateur</label>

                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />

                    </div>

                    <div className="form-group">

                        <label>Mot de passe</label>

                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />

                    </div>

                    {error && (
                        <p className="error">
                            {error}
                        </p>
                    )}

                    <button type="submit" >
                        Se connecter
                    </button>

                </form>

            </div>

        </div>
    );

}

export default Login;