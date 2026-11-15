import { createAuthClient } from "better-auth/client";
import { API_URL } from "./axios";
import { getAuthToken, setAuthToken } from "./authToken";

// Talks to the backend's Better Auth handler at `${API_URL}/api/auth` with bearer tokens, not
// cookies: the API is a different site, and Safari blocks cross-site cookies.
export const authClient = createAuthClient({
    baseURL: API_URL,
    fetchOptions: {
        credentials: "omit",
        auth: { type: "Bearer", token: () => getAuthToken() ?? undefined },
        // Sign-in (and session refreshes) return the signed session token in this header.
        onSuccess: (ctx) => {
            const token = ctx.response.headers.get("set-auth-token");
            if (token) setAuthToken(token);
        },
    },
});

export type Session = typeof authClient.$Infer.Session;
