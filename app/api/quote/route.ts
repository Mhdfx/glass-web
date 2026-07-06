import { NextResponse } from "next/server";
import { Resend } from "resend";
import { company } from "@/data/company";

export const dynamic = "force-dynamic";

interface QuotePayload {
  name?: string;
  phone?: string;
  city?: string;
  projectType?: string;
  description?: string;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Notification email d'une demande de devis.
 * Canal secondaire : le parcours principal passe par WhatsApp côté client.
 * Sans RESEND_API_KEY configurée, la route répond ok sans envoyer.
 */
export async function POST(request: Request) {
  let payload: QuotePayload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const name = (payload.name ?? "").toString().slice(0, 120).trim();
  const phone = (payload.phone ?? "").toString().slice(0, 40).trim();
  const city = (payload.city ?? "").toString().slice(0, 80).trim();
  const projectType = (payload.projectType ?? "").toString().slice(0, 120).trim();
  const description = (payload.description ?? "").toString().slice(0, 3000).trim();

  if (!name || !phone || !description) {
    return NextResponse.json({ ok: false, error: "missing_fields" }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.QUOTE_EMAIL_TO;
  if (!apiKey || !to) {
    // Email non configuré — pas d'erreur : WhatsApp reste le canal principal
    return NextResponse.json({ ok: true, email: "skipped" });
  }

  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from:
        process.env.QUOTE_EMAIL_FROM ??
        `${company.name} <onboarding@resend.dev>`,
      to,
      subject: `Nouvelle demande de devis — ${escapeHtml(name)} (${escapeHtml(projectType) || "type non précisé"})`,
      html: `
        <h2>Nouvelle demande de devis</h2>
        <table cellpadding="6" style="border-collapse:collapse;font-family:sans-serif;font-size:14px">
          <tr><td><strong>Nom</strong></td><td>${escapeHtml(name)}</td></tr>
          <tr><td><strong>Téléphone / WhatsApp</strong></td><td>${escapeHtml(phone)}</td></tr>
          <tr><td><strong>Ville</strong></td><td>${escapeHtml(city)}</td></tr>
          <tr><td><strong>Type de projet</strong></td><td>${escapeHtml(projectType)}</td></tr>
        </table>
        <h3>Description</h3>
        <p style="white-space:pre-line;font-family:sans-serif;font-size:14px">${escapeHtml(description)}</p>
      `,
    });
    return NextResponse.json({ ok: true, email: "sent" });
  } catch {
    // Le client ne doit pas être bloqué par un échec email
    return NextResponse.json({ ok: true, email: "failed" });
  }
}
