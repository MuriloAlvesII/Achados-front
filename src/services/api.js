import axios from "axios";

const api = axios.create({
    baseURL: "https://api-achados.jefersonqueiroga.com.br",
    headers: {
        "X-Api-Key": import.meta.env.VITE_API_KEY,
    },
});

function getApiError(error) {
    if (error && error.response && error.response.data && error.response.data.detail) {
        const detail = error.response.data.detail;

        if (typeof detail === "string") {
            return detail;
        } else {
            return JSON.stringify(detail);
        }
    }

    if (error && error.response && error.response.status === 401) {
        return "Chave ausente ou inválida. Confira o arquivo .env e reinicie o Vite.";
    }

    if (error && error.response && error.response.status === 404) {
        return "O item solicitado não foi encontrado.";
    }

    if (error && error.response && error.response.status === 422) {
        return "Os dados enviados são inválidos. Confira os campos.";
    }

    if (error && error.message === "Network Error") {
        return "Não foi possível conectar à API. Verifique sua conexão.";
    }

    if (error && error.message) {
        return error.message;
    }

    return "Ocorreu um erro inesperado.";
}

export { getApiError };
export default api;