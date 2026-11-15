import axios from "axios";
import { getAuthToken } from "./authToken";

export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export const api = axios.create({ baseURL: API_URL });

// Better Auth bearer session token (see lib/auth.ts).
api.interceptors.request.use((config) => {
    const token = getAuthToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export function isUnauthorized(error: unknown) {
    return axios.isAxiosError(error) && error.response?.status === 401;
}
