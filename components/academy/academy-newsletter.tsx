"use client";

import { useState } from "react";
import { Send, CheckCircle, Loader2, Mail, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tx } from "@/components/i18n/tx";

export function AcademyNewsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    setErrorMsg("");

    try {
      // Attempt to POST to the existing newsletter/subscribe endpoint
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), source: "Academy newsletter" }),
      });

      if (res.ok) {
        setStatus("success");
      } else {
        const data = await res.json().catch(() => ({}));
        setErrorMsg(data?.error ?? "Something went wrong. Please try again.");
        setStatus("error");
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
      setStatus("error");
    }
  };

  return (
    <section
      id="academy-newsletter"
      className="relative overflow-hidden rounded-3xl border border-primary/20"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.21 0.02 275) 0%, oklch(0.18 0.025 290) 50%, oklch(0.20 0.02 220) 100%)",
      }}
    >
      {/* Decorative glow */}
      <div
        className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full"
        style={{
          background: "radial-gradient(circle, oklch(0.64 0.2 290 / 0.20) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      <div
        className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full"
        style={{
          background: "radial-gradient(circle, oklch(0.76 0.13 220 / 0.15) 0%, transparent 70%)",
          filter: "blur(36px)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-5 px-4 py-8 text-center sm:px-8 sm:py-10">
        {/* Icon badge */}
        <div
          className="flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/30"
          style={{
            background: "linear-gradient(135deg, oklch(0.64 0.2 290 / 0.15), oklch(0.76 0.13 220 / 0.10))",
          }}
        >
          <Mail className="h-6 w-6 text-primary" />
        </div>

        {/* Heading */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            <Tx en="Stay in the loop" fr="Restez informé" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            <Tx
              en="Get new resources delivered to your inbox"
              fr="Recevez de nouvelles ressources dans votre boîte de réception"
            />
          </h2>
          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            <Tx
              en="Join developers who get notified first when new articles, cheat sheets, and books drop — no spam, unsubscribe anytime."
              fr="Rejoignez les développeurs qui sont informés en premier lorsque de nouveaux articles, aide-mémoires et livres sont publiés — pas de spam, désabonnez-vous à tout moment."
            />
          </p>
        </div>

        {/* Form */}
        {status === "success" ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-8 py-6">
            <CheckCircle className="h-8 w-8 text-emerald-400" />
            <p className="font-semibold text-emerald-400">
              <Tx en="You're subscribed!" fr="Vous êtes abonné !" />
            </p>
            <p className="text-sm text-muted-foreground">
              <Tx
                en="Check your inbox for a confirmation email."
                fr="Consultez votre boîte de réception pour un e-mail de confirmation."
              />
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex w-full max-w-md flex-col gap-3 sm:flex-row"
            noValidate
          >
            <input
              id="newsletter-email"
              type="email"
              required
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === "loading"}
              className="flex-1 rounded-xl border border-border/50 bg-background/40 px-4 py-3 text-sm placeholder:text-muted-foreground/60 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 disabled:opacity-60 transition-colors backdrop-blur-sm"
            />
            <Button
              id="newsletter-subscribe-btn"
              type="submit"
              disabled={status === "loading" || !email.trim()}
              className="gap-2 px-6 py-3"
            >
              {status === "loading" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              <Tx en="Subscribe" fr="S'abonner" />
            </Button>
          </form>
        )}

        {/* Error message */}
        {status === "error" && (
          <p className="text-sm text-destructive">{errorMsg}</p>
        )}

        {/* Privacy note */}
        <p className="text-xs text-muted-foreground/60">
          <Tx
            en="We respect your privacy. No spam, ever."
            fr="Nous respectons votre vie privée. Aucun spam, jamais."
          />
        </p>
      </div>
    </section>
  );
}
