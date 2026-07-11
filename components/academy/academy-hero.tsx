"use client";

import { useEffect, useRef } from "react";
import { BookOpen, FileText, Zap } from "lucide-react";
import { Tx } from "@/components/i18n/tx";

export function AcademyHero() {
  const blobRef1 = useRef<HTMLDivElement>(null);
  const blobRef2 = useRef<HTMLDivElement>(null);

  // Subtle floating animation via RAF
  useEffect(() => {
    let frame: number;
    let t = 0;
    const animate = () => {
      t += 0.005;
      if (blobRef1.current) {
        blobRef1.current.style.transform = `translate(${Math.sin(t) * 18}px, ${Math.cos(t * 0.8) * 14}px)`;
      }
      if (blobRef2.current) {
        blobRef2.current.style.transform = `translate(${Math.cos(t * 0.7) * 22}px, ${Math.sin(t * 1.1) * 16}px)`;
      }
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  const stats = [
    {
      icon: FileText,
      labelEn: "Articles",
      labelFr: "Articles",
      count: "5+",
      color: "text-violet-400",
      bg: "bg-violet-500/10 border-violet-500/20",
    },
    {
      icon: Zap,
      labelEn: "Cheat Sheets",
      labelFr: "Aide-mémoires",
      count: "5+",
      color: "text-cyan-400",
      bg: "bg-cyan-500/10 border-cyan-500/20",
    },
    {
      icon: BookOpen,
      labelEn: "Books",
      labelFr: "Livres",
      count: "5+",
      color: "text-amber-400",
      bg: "bg-amber-500/10 border-amber-500/20",
    },
  ];

  return (
    <section
      id="academy-hero"
      className="relative overflow-hidden rounded-3xl border border-primary/20 bg-card/60"
    >
      {/* Animated blobs */}
      <div
        ref={blobRef1}
        className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full"
        style={{
          background:
            "radial-gradient(circle, oklch(0.64 0.2 290 / 0.30) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      <div
        ref={blobRef2}
        className="pointer-events-none absolute -bottom-16 -right-16 h-80 w-80 rounded-full"
        style={{
          background:
            "radial-gradient(circle, oklch(0.76 0.13 220 / 0.25) 0%, transparent 70%)",
          filter: "blur(48px)",
        }}
      />
      {/* Grid overlay */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(oklch(0.52 0.05 285 / 0.06) 1px, transparent 1px), linear-gradient(90deg, oklch(0.52 0.05 285 / 0.06) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 flex flex-col items-center justify-center gap-5 px-6 py-10 text-center sm:px-10 sm:py-12">
        {/* Label */}
        <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          <Tx en="Learning Hub" fr="Centre d'Apprentissage" />
        </span>

        {/* Heading */}
        <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
          <Tx
            en={
              <>
                Grow your skills with the{" "}
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage:
                      "linear-gradient(135deg, oklch(0.64 0.2 290), oklch(0.76 0.13 220))",
                  }}
                >
                  Academy
                </span>
              </>
            }
            fr={
              <>
                Développez vos compétences avec l&apos;
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage:
                      "linear-gradient(135deg, oklch(0.64 0.2 290), oklch(0.76 0.13 220))",
                  }}
                >
                  Académie
                </span>
              </>
            }
          />
        </h1>

        {/* Sub-tagline */}
        <p className="max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          <Tx
            en="Curated articles, printable cheat sheets, and in-depth books on web development, DevOps, and computer science — free downloads and premium editions."
            fr="Articles sélectionnés, aide-mémoires imprimables et livres approfondis sur le développement web, DevOps et l'informatique — téléchargements gratuits et éditions premium."
          />
        </p>

        {/* Stats row */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          {stats.map(({ icon: Icon, labelEn, labelFr, count, color, bg }) => (
            <div
              key={labelEn}
              className={`flex items-center gap-2.5 rounded-xl border px-4 py-2.5 text-sm font-medium backdrop-blur-sm ${bg}`}
            >
              <Icon className={`h-4 w-4 ${color}`} />
              <span className={`text-lg font-bold ${color}`}>{count}</span>
              <span className="text-muted-foreground">
                <Tx en={labelEn} fr={labelFr} />
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
