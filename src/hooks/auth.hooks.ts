import { authClient } from "@/lib/auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

export const sessionQueryKey = ["session"] as const;

/** `data` is the session, or null when signed out. Errors only when the API can't be reached. */
export function useSession() {
    return useQuery({
        queryKey: sessionQueryKey,
        queryFn: async () => {
            const { data, error } = await authClient.getSession();
            if (error) throw error;
            return data;
        },
        staleTime: 5 * 60_000,
        retry: 1,
    });
}

export function useSignIn() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ email, password }: { email: string; password: string }) => {
            let result;
            try {
                result = await authClient.signIn.email({ email, password, rememberMe: true });
            } catch {
                throw new Error("Can't reach the server. Check your connection and try again.");
            }
            const { error } = result;
            if (error?.status === 429) throw new Error("Too many attempts. Wait a minute and try again.");
            if (error) throw new Error(error.message || "Couldn't sign in. Try again.");
        },
        // Returning the promise keeps the mutation pending until the new session is loaded.
        onSuccess: () => queryClient.invalidateQueries({ queryKey: sessionQueryKey }),
    });
}

export function useSignOut() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async () => {
            const { error } = await authClient.signOut();
            if (error) throw error;
        },
        onSuccess: () => {
            // RequireAuth sees the null session and redirects to /login.
            queryClient.setQueryData(sessionQueryKey, null);
            queryClient.removeQueries({ predicate: (q) => q.queryKey[0] !== sessionQueryKey[0] });
        },
        onError: () => toast.error("Couldn't sign out. Try again.", { duration: 3000 }),
    });
}
