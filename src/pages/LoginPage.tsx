import PlantCharacter from "@/components/PlantCharacter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useSession, useSignIn } from "@/hooks/auth.hooks";
import { Eye, EyeOff, Sprout } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Navigate, useLocation, type Location } from "react-router";

function LoginPage() {
    const location = useLocation();
    const from = (location.state as { from?: Location } | null)?.from;
    const redirectTo = from ? `${from.pathname}${from.search}` : "/";

    const { data: session } = useSession();
    const { mutate: signIn, isPending, error, reset } = useSignIn();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    // Also handles the redirect after a successful sign-in, once the new session is cached.
    if (session) return <Navigate to={redirectTo} replace />;

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        signIn({ email: email.trim(), password });
    }

    function clearError() {
        if (error) reset();
    }

    return (
        <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center gap-6 px-5 py-10 text-left">
            <div className="flex items-center gap-2">
                <Sprout className="size-6.5 text-primary" aria-hidden="true" />
                <span className="text-xl font-semibold text-foreground">Sprout</span>
            </div>

            <div className="flex items-center gap-4">
                <div className="flex size-19 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
                    <PlantCharacter kind="monstera" mood="happy" size={70} />
                </div>
                <div className="flex flex-col gap-1">
                    <h1 className="m-0 text-3xl leading-tight font-semibold text-foreground">Welcome back</h1>
                    <p className="text-sm text-muted-foreground">Sign in to check on your plants.</p>
                </div>
            </div>

            <Card className="rounded-3xl p-5">
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="email" className="text-sm font-medium text-foreground">
                            Email
                        </label>
                        <Input
                            id="email"
                            type="email"
                            autoComplete="email"
                            autoCapitalize="none"
                            spellCheck={false}
                            required
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                clearError();
                            }}
                            aria-invalid={error ? true : undefined}
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="password" className="text-sm font-medium text-foreground">
                            Password
                        </label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                autoComplete="current-password"
                                required
                                className="pr-12"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    clearError();
                                }}
                                aria-invalid={error ? true : undefined}
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon-lg"
                                className="absolute top-1 right-1 rounded-lg text-muted-foreground"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                                aria-pressed={showPassword}
                                onClick={() => setShowPassword((s) => !s)}
                            >
                                {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                            </Button>
                        </div>
                    </div>

                    {error && (
                        <p role="alert" className="text-sm text-destructive">
                            {error.message}
                        </p>
                    )}

                    <Button type="submit" size="lg" className="h-11 w-full rounded-xl text-base" disabled={isPending}>
                        {isPending ? "Signing in..." : "Sign in"}
                    </Button>
                </form>
            </Card>

            <p className="text-center text-sm text-muted-foreground">Accounts are invite-only, so there's no sign-up.</p>
        </main>
    );
}

export default LoginPage;
