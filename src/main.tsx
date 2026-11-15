import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import { BrowserRouter } from "react-router";
import App from "./App.tsx";
import { sessionQueryKey } from "./hooks/auth.hooks";
import { isUnauthorized } from "./lib/axios";
import "./index.css";

// A 401 from the API means the session expired or was revoked: re-check it, and
// RequireAuth sends you to /login if it's gone.
function onApiError(error: unknown) {
    if (isUnauthorized(error)) queryClient.invalidateQueries({ queryKey: sessionQueryKey });
}

const queryClient = new QueryClient({
    queryCache: new QueryCache({ onError: onApiError }),
    mutationCache: new MutationCache({ onError: onApiError }),
    defaultOptions: {
        queries: { retry: (failureCount, error) => !isUnauthorized(error) && failureCount < 3 },
    },
});

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <App />
                <Toaster />
            </BrowserRouter>
        </QueryClientProvider>
    </StrictMode>,
);
