import { useSession } from "@/hooks/auth.hooks";
import { Navigate, Outlet, useLocation } from "react-router";
import { Button } from "./ui/button";

/** Layout route: renders the page when signed in, otherwise sends you to /login and back afterwards. */
function RequireAuth() {
    const { data: session, isPending, isError, refetch, isFetching } = useSession();
    const location = useLocation();

    if (session) return <Outlet />;
    if (isPending) return <p className="p-5 text-left text-muted-foreground">Loading...</p>;
    if (isError) {
        return (
            <div className="flex flex-col items-start gap-3 p-5 text-left">
                <p className="text-destructive">Can't reach the server right now.</p>
                <Button variant="outline" size="lg" onClick={() => refetch()} disabled={isFetching}>
                    {isFetching ? "Retrying..." : "Try again"}
                </Button>
            </div>
        );
    }
    return <Navigate to="/login" replace state={{ from: location }} />;
}

export default RequireAuth;
