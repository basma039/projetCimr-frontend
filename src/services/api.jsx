import axios from "axios";

/* api.get("/demandes"); */

const api = axios.create({
    baseURL: "http://localhost:8084/api",
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