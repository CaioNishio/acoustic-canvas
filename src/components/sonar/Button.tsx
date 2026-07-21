import { Link } from "react-router-dom";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "onDark";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-body font-medium tracking-tight " +
  "transition-colors duration-micro ease-snr cursor-pointer whitespace-nowrap";

const variants: Record<Variant, string> = {
  primary: "bg-snr-petrol text-snr-white hover:bg-snr-petrol-light",
  secondary:
    "border border-snr-graphite/25 text-snr-graphite hover:border-snr-graphite hover:bg-snr-graphite hover:text-snr-white",
  ghost: "text-snr-ocean hover:text-snr-petrol underline-offset-4 hover:underline",
  onDark: "border border-snr-white/70 text-snr-white hover:bg-snr-white hover:text-snr-graphite",
};

/* Alvos de toque: mínimo 44px de altura */
const sizes: Record<Size, string> = {
  md: "min-h-11 px-6 text-sm",
  lg: "min-h-12 px-8 text-base",
};

interface Props {
  children: ReactNode;
  to?: string;
  href?: string;
  onClick?: () => void;
  variant?: Variant;
  size?: Size;
  className?: string;
  type?: "button" | "submit";
  "aria-label"?: string;
}

export function SonarButton({
  children,
  to,
  href,
  onClick,
  variant = "primary",
  size = "md",
  className,
  type = "button",
  ...rest
}: Props) {
  const classes = cn(base, variants[variant], variant !== "ghost" && sizes[size], className);

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={classes} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes} {...rest}>
      {children}
    </button>
  );
}
