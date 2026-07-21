import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------
   Section — respiro vertical e container de 12 colunas
   ------------------------------------------------------------------ */

type Tone = "light" | "paper" | "wash" | "dark";

const toneClass: Record<Tone, string> = {
  light: "bg-snr-white text-snr-graphite",
  paper: "bg-snr-paper text-snr-graphite",
  wash: "bg-snr-ocean-wash text-snr-graphite",
  dark: "bg-snr-graphite text-snr-white snr-on-dark",
};

interface SectionProps {
  children: ReactNode;
  tone?: Tone;
  size?: "default" | "lg";
  className?: string;
  id?: string;
}

export function Section({ children, tone = "light", size = "default", className, id }: SectionProps) {
  return (
    <section
      id={id}
      className={cn(size === "lg" ? "snr-section-lg" : "snr-section", toneClass[tone], className)}
    >
      <div className="snr-container">{children}</div>
    </section>
  );
}

/* ------------------------------------------------------------------
   Eyebrow — legenda técnica com divisória editorial
   ------------------------------------------------------------------ */

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn("snr-caption snr-rule-editorial text-snr-mineral-700", className)}>{children}</p>
  );
}

/* ------------------------------------------------------------------
   Títulos
   ------------------------------------------------------------------ */

export function SectionTitle({ children, className }: { children: ReactNode; className?: string }) {
  return <h2 className={cn("snr-title", className)}>{children}</h2>;
}

export function Lead({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn("snr-body snr-measure text-snr-mineral-700", className)}>{children}</p>;
}

/* ------------------------------------------------------------------
   Reveal — movimento narrativo acionado por scroll
   ------------------------------------------------------------------ */

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.05 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn("snr-reveal", className)}
      data-visible={visible}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------
   Divisórias
   ------------------------------------------------------------------ */

export function Rule({ variant = "structural" }: { variant?: "structural" | "technical" }) {
  return <hr className={variant === "technical" ? "snr-rule-technical" : "snr-rule"} />;
}
