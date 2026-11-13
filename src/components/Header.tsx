import { Clock, Plus, Sprout } from "lucide-react";
import { Button } from "./ui/button";

function Header() {
    return (
        <>
            <header className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Sprout className="size-6.5 text-primary" aria-hidden="true" />
                    <span className="text-xl font-semibold text-foreground">Sprout</span>
                </div>
                <Button size="icon-lg" className="size-11 rounded-full" aria-label="Add a plant">
                    <Plus className="size-5" />
                </Button>
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
