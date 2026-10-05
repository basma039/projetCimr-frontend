import axios from "axios";

/* api.get("/demandes"); */

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8084/api";

const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});


// Ajouter automatiquement le token JWT
api.interceptors.request.use((config) => {

    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default api;