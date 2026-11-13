import axios from "axios";

const apiKey = import.meta.env.VITE_API_KEY;

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3000",
    headers: apiKey ? { Authorization: `Bearer ${apiKey}` } : undefined,
});
