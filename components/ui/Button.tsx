import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

const base =
  "group relative inline-flex min-h-[48px] cursor-pointer items-center justify-center gap-2.5 overflow-hidden rounded-full px-7 py-3 text-sm font-semibold tracking-wide transition-all duration-300 select-none";

const variants = {
  primary:
    "bg-brass-500 text-ink-950 shadow-brass hover:bg-brass-400 hover:shadow-lg active:scale-[0.98]",
  ghost:
    "glass-panel text-ivory-100 hover:border-brass-500/40 hover:bg-white/[0.08] active:scale-[0.98]",
  whatsapp:
    "bg-whatsapp text-ink-950 hover:brightness-110 active:scale-[0.98] shadow-[0_10px_40px_-10px_rgb(37_211_102/0.4)]",
} as const;

type Variant = keyof typeof variants;

/** Reflet qui traverse le bouton au survol — clin d'œil au verre */
function Shine() {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-y-0 w-1/3 -translate-x-[150%] skew-x-[-18deg] bg-white/25 blur-sm transition-transform duration-700 ease-out group-hover:translate-x-[350%]"
    />
  );
}

interface ButtonLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: Variant;
  children: ReactNode;
}

export function ButtonLink({
  variant = "primary",
  className = "",
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <a className={`${base} ${variants[variant]} ${className}`} {...props}>
      <Shine />
      {children}
    </a>
  );
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  children: ReactNode;
}

export function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      <Shine />
      {children}
    </button>
  );
}
