import { createAuthClient } from "better-auth/client";
import { API_URL } from "./axios";

// Talks to the backend's Better Auth handler at `${API_URL}/api/auth`; sends cookies by default.
export const authClient = createAuthClient({ baseURL: API_URL });

export type Session = typeof authClient.$Infer.Session;
