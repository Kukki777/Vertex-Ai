import axios from "axios";

const baseURL = import.meta.env.PROD
    ? window.location.origin
    : import.meta.env.VITE_SERVER_URL || "http://localhost:3000";

export const api = axios.create({
    baseURL,
    withCredentials: true
});
