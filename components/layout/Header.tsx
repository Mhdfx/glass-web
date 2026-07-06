"use client";

import { useEffect, useState } from "react";
import { company } from "@/data/company";
import { CloseIcon, MenuIcon, PhoneIcon } from "@/components/ui/icons";

const navLinks = [
  { href: "#accueil", label: "Accueil" },
  { href: "#expertises", label: "Nos expertises" },
  { href: "#galerie", label: "Galerie" },
  { href: "#devis", label: "Devis gratuit" },
  { href: "#contact", label: "Contact" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Bloque le scroll derrière le menu mobile
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 transition-all duration-500 ${
        open
          ? "z-[60] border-b border-white/[0.06] bg-ink-950"
          : scrolled
            ? "z-50 border-b border-white/[0.06] bg-ink-950/85 backdrop-blur-md"
            : "z-50 bg-transparent"
      }`}
    >
      <div className="container-site flex h-[72px] items-center justify-between gap-4">
        {/* Logo */}
        <a
          href="#accueil"
          className="flex items-center gap-2.5"
          aria-label={`${company.name} — retour à l'accueil`}
        >
          <LogoMark />
          <span className="font-display text-lg font-medium tracking-wide text-ivory-50">
            {company.name}
          </span>
        </a>

        {/* Navigation desktop */}
        <nav className="hidden items-center gap-8 lg:flex" aria-label="Navigation principale">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-ivory-200/80 transition-colors duration-200 hover:text-brass-400"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-5 lg:flex">
          <a
            href={`tel:+${company.phoneRaw}`}
            className="flex items-center gap-2 text-sm font-medium text-ivory-200/80 transition-colors hover:text-brass-400"
          >
            <PhoneIcon className="h-4 w-4" />
            {company.phoneDisplay}
          </a>
          <a
            href="#devis"
            className="inline-flex min-h-[44px] cursor-pointer items-center rounded-full bg-brass-500 px-6 py-2.5 text-sm font-semibold text-ink-950 transition-all duration-300 hover:bg-brass-400 hover:shadow-brass active:scale-[0.98]"
          >
            Demander un devis
          </a>
        </div>

        {/* Burger mobile */}
        <button
          type="button"
          className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-ivory-100 transition-colors hover:bg-white/5 lg:hidden"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
        >
          {open ? <MenuIconClosed /> : <MenuIcon />}
        </button>
      </div>

      {/* Menu mobile plein écran — panneau opaque qui glisse depuis la
          droite : aucun contenu de page visible pendant l'animation */}
      <div
        className={`fixed inset-0 top-[72px] z-40 bg-ink-950 transition-transform duration-300 ease-out lg:hidden ${
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
              href={link.href}
              onClick={() => setOpen(false)}
              className={`border-b border-white/[0.06] py-4 font-display text-2xl text-ivory-100 transition-all duration-300 hover:text-brass-400 ${
                open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
              }`}
              style={{ transitionDelay: open ? `${i * 50}ms` : "0ms" }}
            >
              {link.label}
            </a>
          ))}
          <div className="mt-6 flex flex-col gap-3">
            <a
              href="#devis"
              onClick={() => setOpen(false)}
              className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-brass-500 px-6 py-3 text-sm font-semibold text-ink-950"
            >
              Demander un devis gratuit
            </a>
            <a
              href={`tel:+${company.phoneRaw}`}
              className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-white/10 px-6 py-3 text-sm font-medium text-ivory-100"
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
      <line x1="7" y1="16" x2="25" y2="16" stroke="#E3C795" strokeWidth="0.8" opacity="0.8" />
    </svg>
  );
}

function MenuIconClosed() {
  return <CloseIcon className="h-6 w-6" />;
}
