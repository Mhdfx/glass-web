"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { company } from "@/data/company";
import { PhoneIcon } from "@/components/ui/icons";

const navLinks = [
  { href: "#accueil", label: "Accueil" },
  { href: "#expertises", label: "Nos expertises" },
  { href: "#galerie", label: "Galerie" },
  { href: "#devis", label: "Devis gratuit" },
  { href: "#contact", label: "Contact" },
];

/** Section actuellement visible — pour signaler « où on est » dans la nav */
function useActiveSection() {
  const [active, setActive] = useState("#accueil");

  useEffect(() => {
    const ids = navLinks.map((l) => l.href.slice(1));
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    // Bande de détection : le tiers central de l'écran — une section est
    // « active » quand elle l'occupe. Un seul observer, aucun listener scroll.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`);
        }
      },
      { rootMargin: "-35% 0px -55% 0px" },
    );
    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return active;
}

/** Évite aria-current côté serveur — même HTML au premier rendu client */
function useHydrated() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const active = useActiveSection();
  const hydrated = useHydrated();
  const pathname = usePathname();
  const onHome = pathname === "/";

  /** Sur une sous-page, les ancres pointent vers la home (« /#galerie ») */
  const navHref = (hash: string) => (onHome ? hash : `/${hash}`);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Bloque le scroll derrière le menu mobile + signale l'état au reste de
  // la page (le bouton WhatsApp flottant se masque via html[data-menu-open])
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    document.documentElement.toggleAttribute("data-menu-open", open);
    return () => {
      document.documentElement.style.overflow = "";
      document.documentElement.removeAttribute("data-menu-open");
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 transition-all duration-500 ${
        open
          ? "z-[60] border-b border-smoke-950/5 bg-porcelain-50"
          : scrolled
            ? "z-50 border-b border-smoke-950/5 bg-porcelain-50/85 backdrop-blur-md"
            : "z-50 bg-transparent"
      }`}
    >
      <div className="container-site flex h-[72px] items-center justify-between gap-4">
        {/* Logo */}
        <a
          href={onHome ? "#accueil" : "/"}
          className="flex items-center gap-2.5"
          aria-label={`${company.name} — retour à l'accueil`}
        >
          <LogoMark />
          <span className="font-display text-xl font-semibold tracking-wide text-smoke-950">
            {company.name}
          </span>
        </a>

        {/* Navigation desktop — soulignement balayé au survol,
            laiton permanent sur la section active */}
        <nav className="hidden items-center gap-8 lg:flex" aria-label="Navigation principale">
          {navLinks.map((link) => {
            const isActive = onHome && hydrated && active === link.href;
            return (
              <a
                key={link.href}
                href={navHref(link.href)}
                aria-current={isActive ? "true" : undefined}
                className={`group relative py-1 text-sm font-medium transition-colors duration-200 ${
                  isActive
                    ? "text-brass-700"
                    : "text-smoke-600 hover:text-smoke-950"
                }`}
              >
                {link.label}
                <span
                  aria-hidden
                  className={`absolute inset-x-0 -bottom-0.5 h-px origin-right scale-x-0 bg-brass-600/70 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:origin-left group-hover:scale-x-100 ${
                    isActive ? "origin-left scale-x-100" : ""
                  }`}
                />
              </a>
            );
          })}
        </nav>

        <div className="hidden items-center gap-5 lg:flex">
          <a
            href={`tel:+${company.phoneRaw}`}
            className="flex items-center gap-2 text-sm font-medium text-smoke-600 transition-colors hover:text-smoke-950"
          >
            <PhoneIcon className="h-4 w-4" />
            {company.phoneDisplay}
          </a>
          <a
            href={navHref("#devis")}
            className="inline-flex min-h-[44px] cursor-pointer items-center rounded-full bg-brass-500 px-6 py-2.5 text-sm font-semibold text-smoke-950 transition-all duration-300 hover:bg-brass-400 hover:shadow-brass active:scale-[0.98]"
          >
            Demander un devis
          </a>
        </div>

        {/* Burger mobile — les deux barres pivotent en X, pas de swap d'icône */}
        <button
          type="button"
          className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-smoke-950 transition-colors hover:bg-smoke-950/5 lg:hidden"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
        >
          <span aria-hidden className="relative block h-3.5 w-5">
            <span
              className={`absolute left-0 top-0 h-[1.5px] w-full rounded-full bg-current transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                open ? "translate-y-[6.25px] rotate-45" : ""
              }`}
            />
            <span
              className={`absolute bottom-0 left-0 h-[1.5px] w-full rounded-full bg-current transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                open ? "-translate-y-[6.25px] -rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </div>

      {/* Menu mobile plein écran — panneau opaque qui glisse depuis la
          droite : aucun contenu de page visible pendant l'animation */}
      <div
        className={`fixed inset-0 top-[72px] z-40 bg-porcelain-50 transition-transform duration-300 ease-out lg:hidden ${
          open
            ? "translate-x-0 pointer-events-auto"
            : "translate-x-full pointer-events-none"
        }`}
        aria-hidden={!open}
      >
        <nav
          className="container-site flex flex-col gap-1 pt-6"
          aria-label="Navigation mobile"
        >
          {navLinks.map((link, i) => (
            <a
              key={link.href}
              href={navHref(link.href)}
              onClick={() => setOpen(false)}
              className={`border-b border-smoke-950/5 py-4 font-display text-3xl font-medium transition-all duration-300 hover:text-brass-700 ${
                onHome && hydrated && active === link.href ? "text-brass-700" : "text-smoke-950"
              } ${
                open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
              }`}
              style={{ transitionDelay: open ? `${i * 50}ms` : "0ms" }}
            >
              {link.label}
            </a>
          ))}
          <div className="mt-6 flex flex-col gap-3">
            <a
              href={navHref("#devis")}
              onClick={() => setOpen(false)}
              className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-brass-500 px-6 py-3 text-sm font-semibold text-smoke-950 transition-transform active:scale-[0.98]"
            >
              Demander un devis
            </a>
            <a
              href={`tel:+${company.phoneRaw}`}
              className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-smoke-950/15 px-6 py-3 text-sm font-medium text-smoke-900"
            >
              <PhoneIcon className="h-4 w-4" />
              {company.phoneDisplay}
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}

function LogoMark() {
  return (
    <svg viewBox="0 0 32 32" className="h-8 w-8" aria-hidden="true">
      <rect
        x="6" y="6" width="20" height="20" rx="2"
        transform="rotate(45 16 16)"
        fill="none" stroke="#C9A66B" strokeWidth="1.5"
      />
      <rect
        x="10.5" y="10.5" width="11" height="11" rx="1"
        transform="rotate(45 16 16)"
        fill="#C9A66B" opacity="0.35"
      />
      <line x1="7" y1="16" x2="25" y2="16" stroke="#A9884E" strokeWidth="0.8" opacity="0.8" />
    </svg>
  );
}
