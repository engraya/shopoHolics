"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle2, Mail, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setError(null);
    setStatus("done");
  };

  return (
    <section className="mx-auto max-w-7xl px-4 pb-16 pt-4 sm:px-6 sm:pb-20 lg:px-8">
      <div className="relative isolate overflow-hidden rounded-3xl border border-border bg-card px-6 py-14 text-center shadow-sm sm:px-12">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_70%_80%_at_50%_50%,black,transparent)]" />
          <div className="absolute -left-20 -top-24 h-72 w-72 rounded-full bg-[hsl(var(--brand-from)/0.22)] blur-3xl animate-drift" />
          <div className="absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-[hsl(var(--brand-to)/0.18)] blur-3xl animate-drift [animation-delay:-8s]" />
        </div>

        <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-brand text-brand-ink shadow-lg shadow-primary/25">
          <Mail className="h-5 w-5" />
        </span>

        <h2 className="mt-6 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Get ₦5,000 off your first order
        </h2>
        <p className="mx-auto mt-3 max-w-md text-muted-foreground">
          Join the list for early access to drops, members-only pricing and the
          occasional very good deal. Unsubscribe anytime.
        </p>

        {status === "done" ? (
          <div
            role="status"
            className="mx-auto mt-8 flex max-w-md animate-fade-in-scale items-center justify-center gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3.5 text-sm font-medium text-emerald-600 dark:text-emerald-400"
          >
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            You&apos;re in — check your inbox for the code.
          </div>
        ) : (
          <form
            onSubmit={onSubmit}
            noValidate
            className="mx-auto mt-8 max-w-md text-left"
          >
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Input
                id="newsletter-email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? "newsletter-error" : undefined}
                className="h-11 flex-1 bg-background/70 backdrop-blur"
              />
              <Button
                type="submit"
                size="lg"
                className="group shrink-0 shadow-lg shadow-primary/20"
              >
                Subscribe
                <Send className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </div>
            {error && (
              <p
                id="newsletter-error"
                role="alert"
                className="mt-2 text-sm text-destructive"
              >
                {error}
              </p>
            )}
          </form>
        )}
      </div>
    </section>
  );
}
