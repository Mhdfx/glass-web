"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { company } from "@/data/company";
import { projectTypes } from "@/data/services";
import { quoteWhatsappLink, type QuoteRequest } from "@/lib/whatsapp";
import { Button } from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import {
  CheckIcon,
  SpinnerIcon,
  WhatsAppIcon,
} from "@/components/ui/icons";

type Errors = Partial<Record<keyof QuoteRequest, string>>;

function validate(values: QuoteRequest): Errors {
  const errors: Errors = {};
  if (values.name.trim().length < 2)
    errors.name = "Veuillez indiquer votre nom complet.";
  if (!/^[+\d][\d\s.-]{7,}$/.test(values.phone.trim()))
    errors.phone =
      "Numéro invalide — indiquez un numéro joignable sur WhatsApp (ex. 06 12 34 56 78).";
  if (values.city.trim().length < 2)
    errors.city = "Veuillez indiquer votre ville.";
  if (!values.projectType)
    errors.projectType = "Choisissez le type de projet.";
  if (values.description.trim().length < 10)
    errors.description =
      "Décrivez brièvement votre projet (dimensions approximatives, pièce concernée…).";
  return errors;
}

const inputClass = (hasError: boolean) =>
  `w-full min-h-[48px] rounded-lg border bg-porcelain-50 px-4 py-3 text-sm text-smoke-950 placeholder:text-smoke-400 transition-[border-color,box-shadow] duration-200 focus:border-brass-600/60 focus:shadow-[0_0_0_3px_rgb(169_136_78/0.14)] focus:outline-none ${
    hasError ? "border-red-500/60" : "border-smoke-950/15"
  }`;

export default function QuoteForm() {
  const [values, setValues] = useState<QuoteRequest>({
    name: "",
    phone: "",
    city: "",
    projectType: "",
    description: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof QuoteRequest, boolean>>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [honeypot, setHoneypot] = useState("");
  const sectionRef = useRef<HTMLElement>(null);

  // Quand la section sort de l'écran, on efface les messages d'erreur :
  // ils réapparaîtront à la prochaine interaction si les champs sont
  // toujours invalides (évite le « bruit » visuel en explorant la page).
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          setErrors({});
          setTouched({});
        }
      },
      { threshold: 0 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const set = (field: keyof QuoteRequest) => (value: string) => {
    setValues((v) => ({ ...v, [field]: value }));
    if (touched[field]) {
      setErrors(validate({ ...values, [field]: value }));
    }
  };

  const blur = (field: keyof QuoteRequest) => () => {
    setTouched((t) => ({ ...t, [field]: true }));
    setErrors(validate(values));
  };

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (honeypot) return; // bot détecté — on ignore silencieusement

    const nextErrors = validate(values);
    setErrors(nextErrors);
    setTouched({ name: true, phone: true, city: true, projectType: true, description: true });
    if (Object.keys(nextErrors).length > 0) {
      const first = Object.keys(nextErrors)[0];
      document.getElementById(`quote-${first}`)?.focus();
      return;
    }

    setStatus("sending");

    // 1. Notification email (non bloquante — le devis part quoi qu'il arrive)
    try {
      await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
    } catch {
      // L'email est un canal secondaire : on n'interrompt pas le parcours
    }

    // 2. Ouverture de WhatsApp avec le message pré-rempli
    window.open(quoteWhatsappLink(values), "_blank", "noopener,noreferrer");
    setStatus("sent");
  }

  const err = (field: keyof QuoteRequest) =>
    touched[field] ? errors[field] : undefined;

  return (
    <section
      ref={sectionRef}
      id="devis"
      className="bg-porcelain-50 py-24 sm:py-32"
      aria-labelledby="devis-titre"
    >
      <div className="container-site">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="section-label">Devis gratuit</p>
          <h2
            id="devis-titre"
            className="heading-display mt-4 text-3xl sm:text-4xl lg:text-[2.75rem] lg:leading-tight"
          >
            Parlez-nous de votre projet
          </h2>
          <p className="mt-5 leading-relaxed text-smoke-600">
            Décrivez votre besoin : nous revenons vers vous rapidement sur
            WhatsApp avec une estimation et, si besoin, une prise de mesure à
            domicile.
          </p>
          <ul className="mt-7 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-smoke-700">
            {[
              "Réponse rapide sur WhatsApp",
              "Prise de mesure sur place",
              "Sans engagement",
            ].map((line) => (
              <li key={line} className="flex items-center gap-2.5">
                <CheckIcon className="h-4 w-4 text-brass-600" />
                {line}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.12} className="mx-auto mt-12 max-w-3xl">
          {status === "sent" ? (
            <div className="pane rounded-2xl p-10 text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-brass-600/30 bg-brass-500/10">
                <CheckIcon className="h-7 w-7 text-brass-600" />
              </span>
              <h3 className="mt-6 font-display text-2xl font-medium text-smoke-950">
                Votre demande est prête
              </h3>
              <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-smoke-600">
                WhatsApp s&apos;est ouvert avec votre message pré-rempli.
                Envoyez-le pour finaliser votre demande de devis, nous vous
                répondons au plus vite.
              </p>
              <button
                type="button"
                onClick={() => setStatus("idle")}
                className="mt-6 cursor-pointer text-sm font-semibold text-brass-700 transition-colors hover:text-brass-600"
              >
                Envoyer une autre demande
              </button>
            </div>
          ) : (
            <form
              onSubmit={onSubmit}
              noValidate
              className="pane rounded-2xl p-6 sm:p-10"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="quote-name" className="mb-1.5 block text-sm font-medium text-smoke-800">
                    Nom complet <span className="text-brass-700">*</span>
                  </label>
                  <input
                    id="quote-name"
                    type="text"
                    autoComplete="name"
                    placeholder="Votre nom"
                    value={values.name}
                    onChange={(e) => set("name")(e.target.value)}
                    onBlur={blur("name")}
                    aria-invalid={!!err("name")}
                    aria-describedby={err("name") ? "quote-name-error" : undefined}
                    className={inputClass(!!err("name"))}
                  />
                  {err("name") && (
                    <p id="quote-name-error" role="alert" className="mt-1.5 text-xs text-red-600">
                      {err("name")}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="quote-phone" className="mb-1.5 block text-sm font-medium text-smoke-800">
                    Téléphone / WhatsApp <span className="text-brass-700">*</span>
                  </label>
                  <input
                    id="quote-phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="06 12 34 56 78"
                    value={values.phone}
                    onChange={(e) => set("phone")(e.target.value)}
                    onBlur={blur("phone")}
                    aria-invalid={!!err("phone")}
                    aria-describedby={err("phone") ? "quote-phone-error" : undefined}
                    className={inputClass(!!err("phone"))}
                  />
                  {err("phone") && (
                    <p id="quote-phone-error" role="alert" className="mt-1.5 text-xs text-red-600">
                      {err("phone")}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="quote-city" className="mb-1.5 block text-sm font-medium text-smoke-800">
                    Ville <span className="text-brass-700">*</span>
                  </label>
                  <input
                    id="quote-city"
                    type="text"
                    autoComplete="address-level2"
                    placeholder={company.neighborhood}
                    value={values.city}
                    onChange={(e) => set("city")(e.target.value)}
                    onBlur={blur("city")}
                    aria-invalid={!!err("city")}
                    aria-describedby={err("city") ? "quote-city-error" : undefined}
                    className={inputClass(!!err("city"))}
                  />
                  {err("city") && (
                    <p id="quote-city-error" role="alert" className="mt-1.5 text-xs text-red-600">
                      {err("city")}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="quote-projectType" className="mb-1.5 block text-sm font-medium text-smoke-800">
                    Type de projet <span className="text-brass-700">*</span>
                  </label>
                  <select
                    id="quote-projectType"
                    value={values.projectType}
                    onChange={(e) => set("projectType")(e.target.value)}
                    onBlur={blur("projectType")}
                    aria-invalid={!!err("projectType")}
                    aria-describedby={err("projectType") ? "quote-projectType-error" : undefined}
                    className={`${inputClass(!!err("projectType"))} cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23697077%22%20stroke-width%3D%221.5%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:18px] bg-[position:right_14px_center] bg-no-repeat pr-11 ${values.projectType ? "" : "text-smoke-400"}`}
                  >
                    <option value="" disabled>
                      Choisir…
                    </option>
                    {projectTypes.map((type) => (
                      <option key={type} value={type} className="bg-white text-smoke-950">
                        {type}
                      </option>
                    ))}
                  </select>
                  {err("projectType") && (
                    <p id="quote-projectType-error" role="alert" className="mt-1.5 text-xs text-red-600">
                      {err("projectType")}
                    </p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="quote-description" className="mb-1.5 block text-sm font-medium text-smoke-800">
                    Description du projet <span className="text-brass-700">*</span>
                  </label>
                  <textarea
                    id="quote-description"
                    rows={4}
                    placeholder="Ex. : garde-corps en verre pour un escalier intérieur, environ 4 m linéaires…"
                    value={values.description}
                    onChange={(e) => set("description")(e.target.value)}
                    onBlur={blur("description")}
                    aria-invalid={!!err("description")}
                    aria-describedby={
                      err("description")
                        ? "quote-description-error"
                        : "quote-description-help"
                    }
                    className={`${inputClass(!!err("description"))} resize-y`}
                  />
                  {err("description") ? (
                    <p id="quote-description-error" role="alert" className="mt-1.5 text-xs text-red-600">
                      {err("description")}
                    </p>
                  ) : (
                    <p id="quote-description-help" className="mt-1.5 text-xs text-smoke-500">
                      Dimensions approximatives, pièce concernée, délais souhaités…
                    </p>
                  )}
                </div>
              </div>

              {/* Honeypot anti-spam — invisible pour les humains */}
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                className="absolute -left-[9999px] h-0 w-0 opacity-0"
                aria-hidden="true"
              />

              <Button
                type="submit"
                variant="whatsapp"
                disabled={status === "sending"}
                className="mt-7 w-full disabled:pointer-events-none disabled:opacity-60"
              >
                {status === "sending" ? (
                  <SpinnerIcon />
                ) : (
                  <WhatsAppIcon className="h-5 w-5" />
                )}
                {status === "sending"
                  ? "Préparation…"
                  : "Envoyer ma demande sur WhatsApp"}
              </Button>
              <p className="mt-3 text-center text-xs text-smoke-500">
                En envoyant, WhatsApp s&apos;ouvre avec votre message
                pré-rempli — rien n&apos;est envoyé sans votre confirmation.
              </p>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}
