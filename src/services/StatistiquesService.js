import axios from "axios";

const API_URL = "http://localhost:8084/api/admin/statistiques";

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");

    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};

export const getStatistiquesAdmin = async () => {
    const response = await axios.get(
        API_URL,
        getAuthHeaders()
    );

    return response.data;
};