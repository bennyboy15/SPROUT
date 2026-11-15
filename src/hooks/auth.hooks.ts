import { authClient } from "@/lib/auth";
import { getAuthToken, setAuthToken } from "@/lib/authToken";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const sessionQueryKey = ["session"] as const;

/** `data` is the session, or null when signed out. Errors only when the API can't be reached. */
export function useSession() {
    return useQuery({
        queryKey: sessionQueryKey,
        queryFn: async () => {
            if (!getAuthToken()) return null;
            const { data, error } = await authClient.getSession();
            if (error && error.status !== 401) throw error;
            // Expired or revoked on the server: forget the token so we stop sending it.
            if (!data) setAuthToken(null);
            return data ?? null;
        },
        staleTime: 5 * 60_000,
        retry: 1,
    });
}

export function useSignIn() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ email, password }: { email: string; password: string }) => {
            setAuthToken(null);
            let result;
            try {
                result = await authClient.signIn.email({ email, password, rememberMe: true });
            } catch {
                throw new Error("Can't reach the server. Check your connection and try again.");
            }
            const { error } = result;
            if (error?.status === 429) throw new Error("Too many attempts. Wait a minute and try again.");
            if (error) throw new Error(error.message || "Couldn't sign in. Try again.");
            // authClient stores the token from the set-auth-token header; without it we can't stay signed in.
            if (!getAuthToken()) throw new Error("Signed in, but the server didn't return a session token.");
        },
        // Returning the promise keeps the mutation pending until the new session is loaded.
        onSuccess: () => queryClient.invalidateQueries({ queryKey: sessionQueryKey }),
    });
}

export function useSignOut() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async () => {
            // Revoke the session on the server if we can; signing out here doesn't depend on it.
            await authClient.signOut().catch(() => undefined);
            setAuthToken(null);
        },
        onSuccess: () => {
            // RequireAuth sees the null session and redirects to /login.
            queryClient.setQueryData(sessionQueryKey, null);
            queryClient.removeQueries({ predicate: (q) => q.queryKey[0] !== sessionQueryKey[0] });
        },
    });
}
