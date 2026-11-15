const STORAGE_KEY = "sprout.session-token";

// Kept in memory too, so signing in still works for this page load if storage is blocked.
let token: string | null | undefined;

/** Better Auth bearer session token, or null when signed out. */
export function getAuthToken(): string | null {
    if (token === undefined) {
        try {
            token = localStorage.getItem(STORAGE_KEY);
        } catch {
            token = null;
        }
    }
    return token;
}

export function setAuthToken(value: string | null) {
    token = value;
    try {
        if (value) localStorage.setItem(STORAGE_KEY, value);
        else localStorage.removeItem(STORAGE_KEY);
    } catch {
        // Storage unavailable: the in-memory token lasts until the page reloads.
    }
}
