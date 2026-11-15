import { useSignOut } from "@/hooks/auth.hooks";
import { Clock, LogOut, Plus, Sprout } from "lucide-react";
import { Button } from "./ui/button";

function Header() {
    const { mutate: signOut, isPending: signingOut } = useSignOut();

    return (
        <>
            <header className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Sprout className="size-6.5 text-primary" aria-hidden="true" />
                    <span className="text-xl font-semibold text-foreground">Sprout</span>
                </div>
                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="icon-lg"
                        className="size-11 rounded-full text-muted-foreground"
                        aria-label="Sign out"
                        disabled={signingOut}
                        onClick={() => signOut()}
                    >
                        <LogOut className="size-5" />
                    </Button>
                    <Button size="icon-lg" className="size-11 rounded-full" aria-label="Add a plant">
                        <Plus className="size-5" />
                    </Button>
                </div>
            </header>

            <div className="flex flex-col gap-1.5">
                <h1 className="m-0 text-4xl leading-tight font-semibold tracking-normal text-foreground">My plants</h1>
                <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Clock className="size-4" aria-hidden="true" />
                    Updates every 5 min
                </p>
            </div>
        </>
    );
}

export default Header;
