"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

// Register ScrollTrigger
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface GsapSectionProps {
  children: React.ReactNode;
  className?: string;
  animation?: "fade-up" | "fade-in" | "slide-left" | "slide-right";
  delay?: number;
}

export function GsapSection({ children, className, animation = "fade-up", delay = 0 }: GsapSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    let fromVars: gsap.TweenVars = { opacity: 0 };

    switch (animation) {
      case "fade-up":
        fromVars = { opacity: 0, y: 50 };
        break;
      case "slide-left":
        fromVars = { opacity: 0, x: -50 };
        break;
      case "slide-right":
        fromVars = { opacity: 0, x: 50 };
        break;
      case "fade-in":
      default:
        fromVars = { opacity: 0 };
        break;
    }

    gsap.fromTo(
      el,
      fromVars,
      {
        opacity: 1,
        x: 0,
        y: 0,
        duration: 0.8,
        delay: delay,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none reverse", // Play on enter, reverse on leave back
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [animation, delay]);

  return (
    <div ref={sectionRef} className={cn("opacity-0", className)}>
      {children}
    </div>
  );
}
