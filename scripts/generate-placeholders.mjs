/**
 * Génère des images placeholder « verre & laiton » de haute qualité
 * pour le hero, les cartes expertises et la galerie.
 *
 * Usage : npm run images
 *
 * ⚠️ Ces images sont des compositions abstraites de démonstration.
 * Remplacer chaque fichier par la vraie photo (même nom de fichier).
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const OUT = path.resolve(process.cwd(), "public/images");

/** PRNG déterministe — mêmes images à chaque exécution */
function mulberry32(seed) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const palettes = {
  brass: {
    bg: ["#141210", "#1e1a15"],
    shards: ["#c9a66b", "#e3c795", "#8a6f42", "#5c4a2e", "#f0dcb8"],
    glow: "#c9a66b",
  },
  bronze: {
    bg: ["#171310", "#241c14"],
    shards: ["#a97e50", "#d4a970", "#6e5133", "#8f6b40", "#e8c896"],
    glow: "#d4a970",
  },
  vitrail: {
    bg: ["#100f14", "#1a1520"],
    shards: ["#b3543f", "#c9a66b", "#3f6f6a", "#7a4a6e", "#d9b26a", "#4a6e8f"],
    glow: "#d9b26a",
  },
  steel: {
    bg: ["#0e1012", "#181c20"],
    shards: ["#9fb0bd", "#c8d4dc", "#5c6b78", "#7d8e9c", "#e6edf2"],
    glow: "#c8d4dc",
  },
  frost: {
    bg: ["#101112", "#1b1d1e"],
    shards: ["#d8dcdd", "#b8bfc2", "#8e989c", "#eef1f2", "#c9a66b"],
    glow: "#eef1f2",
  },
};

function shardPolygon(rng, w, h) {
  // Longue lame diagonale — évoque une plaque de verre inclinée
  const cx = rng() * w;
  const cy = rng() * h;
  const len = (0.5 + rng() * 0.9) * Math.max(w, h);
  const wid = (0.04 + rng() * 0.12) * Math.max(w, h);
  const angle = (rng() * 40 + 50) * (Math.PI / 180) * (rng() > 0.5 ? 1 : -1);
  const dx = Math.cos(angle), dy = Math.sin(angle);
  const px = -dy, py = dx;
  const pts = [
    [cx - dx * len / 2 + px * wid / 2, cy - dy * len / 2 + py * wid / 2],
    [cx + dx * len / 2 + px * wid / 2, cy + dy * len / 2 + py * wid / 2],
    [cx + dx * len / 2 - px * wid / 2, cy + dy * len / 2 - py * wid / 2],
    [cx - dx * len / 2 - px * wid / 2, cy - dy * len / 2 - py * wid / 2],
  ];
  return pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
}

function buildSvg({ w, h, palette, seed, streaks = 10 }) {
  const p = palettes[palette];
  const rng = mulberry32(seed);
  let shapes = "";
  for (let i = 0; i < streaks; i++) {
    const color = p.shards[Math.floor(rng() * p.shards.length)];
    const opacity = (0.05 + rng() * 0.22).toFixed(2);
    shapes += `<polygon points="${shardPolygon(rng, w, h)}" fill="${color}" opacity="${opacity}"/>`;
  }
  // fines lignes lumineuses (arêtes de verre)
  let lines = "";
  for (let i = 0; i < Math.ceil(streaks / 2); i++) {
    const x1 = rng() * w, y1 = rng() * h;
    const ang = (rng() * 40 + 50) * (Math.PI / 180) * (rng() > 0.5 ? 1 : -1);
    const l = (0.4 + rng() * 0.8) * Math.max(w, h);
    lines += `<line x1="${x1}" y1="${y1}" x2="${x1 + Math.cos(ang) * l}" y2="${y1 + Math.sin(ang) * l}" stroke="${p.glow}" stroke-width="${(0.6 + rng() * 1.6).toFixed(1)}" opacity="${(0.12 + rng() * 0.25).toFixed(2)}"/>`;
  }
  const gx = 20 + rng() * 60;
  const gy = 15 + rng() * 40;
  return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${p.bg[0]}"/><stop offset="1" stop-color="${p.bg[1]}"/>
    </linearGradient>
    <radialGradient id="glow" cx="${gx}%" cy="${gy}%" r="75%">
      <stop offset="0" stop-color="${p.glow}" stop-opacity="0.30"/>
      <stop offset="0.55" stop-color="${p.glow}" stop-opacity="0.08"/>
      <stop offset="1" stop-color="${p.glow}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="vignette" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0.55" stop-color="#000" stop-opacity="0"/>
      <stop offset="1" stop-color="#000" stop-opacity="0.45"/>
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#bg)"/>
  <rect width="${w}" height="${h}" fill="url(#glow)"/>
  ${shapes}
  ${lines}
  <rect width="${w}" height="${h}" fill="url(#vignette)"/>
</svg>`;
}

const images = [
  // Hero
  { file: "hero/hero.jpg", w: 2400, h: 1500, palette: "brass", seed: 7, streaks: 16 },
  { file: "hero/hero-mobile.jpg", w: 900, h: 1400, palette: "brass", seed: 7, streaks: 12 },
  // Expertises
  { file: "expertises/miroiterie.jpg", w: 1600, h: 1200, palette: "bronze", seed: 21 },
  { file: "expertises/vitraux.jpg", w: 1600, h: 1200, palette: "vitrail", seed: 22 },
  { file: "expertises/structurel.jpg", w: 1600, h: 1200, palette: "steel", seed: 23 },
  { file: "expertises/menuiserie.jpg", w: 1600, h: 1200, palette: "frost", seed: 24 },
  // Galerie — miroiterie
  { file: "gallery/miroir-antique-plafond.jpg", w: 2000, h: 1250, palette: "bronze", seed: 31 },
  { file: "gallery/panneaux-bronze.jpg", w: 1600, h: 1200, palette: "bronze", seed: 32 },
  { file: "gallery/miroir-laiton.jpg", w: 1200, h: 1600, palette: "brass", seed: 33 },
  { file: "gallery/lacobel-noir.jpg", w: 1600, h: 1200, palette: "frost", seed: 34 },
  { file: "gallery/miroir-led.jpg", w: 1600, h: 1200, palette: "brass", seed: 35 },
  // Galerie — vitraux
  { file: "gallery/coupole-vitrail.jpg", w: 2000, h: 1250, palette: "vitrail", seed: 41 },
  { file: "gallery/porte-vitrail.jpg", w: 1200, h: 1600, palette: "vitrail", seed: 42 },
  { file: "gallery/fenetre-vitrail.jpg", w: 1600, h: 1200, palette: "vitrail", seed: 43 },
  { file: "gallery/separation-vitrail.jpg", w: 1600, h: 1200, palette: "vitrail", seed: 44 },
  // Galerie — structurel
  { file: "gallery/escalier-verre.jpg", w: 1200, h: 1600, palette: "steel", seed: 51 },
  { file: "gallery/garde-corps.jpg", w: 1600, h: 1200, palette: "steel", seed: 52 },
  { file: "gallery/facade-verre.jpg", w: 2000, h: 1250, palette: "steel", seed: 53 },
  { file: "gallery/cloison-bureau.jpg", w: 1600, h: 1200, palette: "frost", seed: 54 },
  // Galerie — menuiserie
  { file: "gallery/douche-italienne.jpg", w: 1200, h: 1600, palette: "frost", seed: 61 },
  { file: "gallery/porte-coulissante.jpg", w: 1600, h: 1200, palette: "frost", seed: 62 },
  { file: "gallery/douche-niche.jpg", w: 1600, h: 1200, palette: "frost", seed: 63 },
  // Open Graph
  { file: "og.jpg", w: 1200, h: 630, palette: "brass", seed: 99, streaks: 14 },
];

for (const img of images) {
  const dest = path.join(OUT, img.file);
  await mkdir(path.dirname(dest), { recursive: true });
  const svg = buildSvg(img);
  await sharp(Buffer.from(svg))
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(dest);
  console.log("✓", img.file);
}
console.log(`\n${images.length} images générées dans public/images/`);
