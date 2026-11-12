import axios from "axios";

const isDev = import.meta.env.DEV;
const VITE_URL = import.meta.env.VITE_API_URL;

export const api = axios.create({ baseURL: isDev ? "http://localhost:3000" : VITE_URL });
