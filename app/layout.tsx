import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { company, yearsOfExperience } from "@/data/company";
import SmoothScroll from "@/components/SmoothScroll";
import "./globals.css";

/* Cormorant Garamond : ses pleins et déliés très fins évoquent la gravure
   sur verre — remplace Fraunces dans la direction « lumière froide » (v2) */
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
  weight: ["500", "600"],
  style: ["normal", "italic"],
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(company.siteUrl),
  title: {
    default: `${company.name} — Miroiterie, vitraux & verre sur-mesure à ${company.shortLocation}`,
    template: `%s — ${company.name}`,
  },
  description: `Atelier de miroiterie et vitraux d'art à ${company.shortLocation} depuis ${company.foundedYear}. Miroirs antiques, vitraux peints à la main, verre trempé structurel, cabines de douche sur-mesure. Devis gratuit.`,
  keywords: [
    `miroiterie ${company.city}`,
    "miroiterie Aïn Sebaâ",
    "vitraux Maroc",
    "verre trempé",
    "miroir sur mesure",
    "garde-corps verre",
    "cabine de douche",
    "Lacobel",
    "vitrail d'art",
  ],
  openGraph: {
    type: "website",
    locale: "fr_MA",
    url: company.siteUrl,
    siteName: company.name,
    title: `${company.name} — Miroiterie, vitraux & verre sur-mesure`,
    description: `Artisanat verrier haut de gamme à ${company.shortLocation} : miroirs antiques, vitraux d'art, verre trempé structurel. ${yearsOfExperience()} ans de savoir-faire.`,
    images: [{ url: "/images/og.jpg", width: 1200, height: 630 }],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#F7F8F9",
  width: "device-width",
  initialScale: 1,
};

function jsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: company.name,
    description:
      `Atelier de miroiterie, vitraux d'art, verre trempé et menuiserie verre sur-mesure à ${company.shortLocation}.`,
    url: company.siteUrl,
    telephone: `+${company.phoneRaw}`,
    email: company.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: company.neighborhood,
      addressLocality: company.city,
      addressCountry: "MA",
    },
    areaServed: company.serviceArea,
    foundingDate: String(company.foundedYear),
    image: `${company.siteUrl}/images/og.jpg`,
    priceRange: "$$",
  };
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${cormorant.variable} ${manrope.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd()) }}
        />
        <SmoothScroll />
        {children}
        {/* Grain argentique global — sous la lightbox (z-80), au-dessus du reste */}
        <div aria-hidden className="grain-overlay" />
      </body>
    </html>
  );
}
