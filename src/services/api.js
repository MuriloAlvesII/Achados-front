import axios from "axios";

const api = axios.create({
    baseURL: "https://api-achados.jefersonqueiroga.com.br",
    headers: {
        "X-Api-Key": import.meta.env.VITE_API_KEY,
    },
});

export default api;