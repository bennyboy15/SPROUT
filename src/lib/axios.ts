import axios from "axios";

export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

// Auth is the Better Auth session cookie, so it must be sent cross-origin.
export const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});

export function isUnauthorized(error: unknown) {
    return axios.isAxiosError(error) && error.response?.status === 401;
}
