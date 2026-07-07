import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { ArrowRightIcon } from "@/components/ui/icons";

const base =
  "group relative inline-flex min-h-[48px] cursor-pointer items-center justify-center gap-2.5 overflow-hidden rounded-full px-7 py-3 text-sm font-semibold tracking-wide transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] select-none";

const variants = {
  primary:
    "bg-brass-500 text-smoke-950 shadow-brass hover:bg-brass-400 hover:shadow-lg active:scale-[0.98]",
  ghost:
    "border border-smoke-950/15 bg-white/70 text-smoke-900 hover:border-brass-500/60 hover:bg-white active:scale-[0.98]",
  whatsapp:
    "bg-whatsapp text-smoke-950 hover:brightness-110 active:scale-[0.98] shadow-[0_10px_36px_-12px_rgb(37_211_102/0.45)]",
} as const;

type Variant = keyof typeof variants;

/** Reflet qui traverse le bouton au survol — clin d'œil au verre */
function Shine() {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-y-0 w-1/3 -translate-x-[150%] skew-x-[-18deg] bg-white/30 blur-sm transition-transform duration-700 ease-out group-hover:translate-x-[350%]"
    />
  );
}

/**
 * Flèche nichée dans sa propre pastille — l'icône n'est jamais posée nue
 * à côté du texte. Au survol elle glisse en diagonale : tension cinétique
 * interne au bouton.
 */
function ArrowCap() {
  return (
    <span
      aria-hidden
      className="-mr-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-smoke-950/10 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5 group-hover:-translate-y-px group-hover:scale-105"
    >
      <ArrowRightIcon className="h-4 w-4" />
    </span>
  );
}

interface ButtonLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: Variant;
  /** Ajoute la flèche nichée en pastille à droite du libellé */
  arrow?: boolean;
  children: ReactNode;
}

export function ButtonLink({
  variant = "primary",
  arrow = false,
  className = "",
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <a className={`${base} ${variants[variant]} ${className}`} {...props}>
      <Shine />
      {children}
      {arrow && <ArrowCap />}
    </a>
  );
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  arrow?: boolean;
  children: ReactNode;
}

export function Button({
  variant = "primary",
  arrow = false,
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      <Shine />
      {children}
      {arrow && <ArrowCap />}
    </button>
  );
}
