import api from "./api";

const login = async (username, password) => {

    const response = await api.post("/auth/login", {
        username,
        password
    });

    return response.data;
};

const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
};

export const getToken = () => {
    return localStorage.getItem("token");
};

export const getRole = () => {
    return localStorage.getItem("role");
};

export const getUsername = () => {
    return localStorage.getItem("username");
};

export const getNom = () => {
    return localStorage.getItem("nom");
};
export const getPrenom = () => {
    return localStorage.getItem("prenom");
};

export const isAuthenticated = () => {
    return !!localStorage.getItem("token");
};

export default {
    login,
    logout,
    getToken,
    getRole,
    isAuthenticated,
    
};