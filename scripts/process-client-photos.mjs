/**
 * Traite les photos client (photos-client/) vers public/images/ :
 * recadrage intelligent, légère amélioration couleur, compression web.
 *
 * Usage : node scripts/process-client-photos.mjs
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const SRC = path.resolve(process.cwd(), "photos-client");
const OUT = path.resolve(process.cwd(), "public/images");

// crop: "top" = ancré en haut (coupe le bas), "attention" = zone la plus
// intéressante détectée, "center" = centré
const jobs = [
  // Hero — mur miroir biseauté + lustres dorés (recadré haut : coupe le sol de chantier)
  { src: "photo-06.jpeg", out: "hero/hero.jpg", w: 1920, h: 1150, crop: "top" },
  { src: "photo-06.jpeg", out: "og.jpg", w: 1200, h: 630, crop: "top" },

  // Cartes expertises
  { src: "photo-05.jpeg", out: "expertises/miroiterie.jpg", w: 1400, h: 1050, crop: "top" },
  { src: "photo-13.jpeg", out: "expertises/structurel.jpg", w: 960, h: 720, crop: "attention" },

  // Galerie — photos réelles
  { src: "photo-06.jpeg", out: "gallery/habillage-miroir-salon.jpg", w: 1600, h: 900, crop: "top" },
  // extractTop : ne garde que le haut de l'image (coupe le carton reflété en bas)
  { src: "photo-05.jpeg", out: "gallery/mur-losanges-sables.jpg", w: 1200, h: 1600, crop: "top", extractTop: 1000 },
  { src: "photo-10.jpeg", out: "gallery/miroir-losange-laiton.jpg", w: 1200, h: 1600, crop: "center" },
  { src: "photo-01.jpeg", out: "gallery/panneau-biseaute-artdeco.jpg", w: 1200, h: 1600, crop: "center" },
  // Format natif portrait 3:4 — plein cadre, aucun zoom
  { src: "photo-07.jpeg", out: "gallery/miroir-led-marbre.jpg", w: 1200, h: 1600, crop: "center" },
  // Portrait étroit — recadrage minimal vers 3:4
  { src: "photo-13.jpeg", out: "gallery/garde-corps-escalier.jpg", w: 1200, h: 1600, crop: "center" },

  // Projets restaurant / hôtel — en tête de galerie, ratios quasi natifs
  { src: "photo-12.jpeg", out: "gallery/agencement-restaurant.jpg", w: 1200, h: 1225, crop: "top" },
  // trim : retire les bandes noires — flop : la capture vidéo est en miroir
  { src: "photo-18.jpeg", out: "gallery/facade-lobby.jpg", w: 1000, h: 1700, crop: "attention", trim: true, flop: true },

  // ————— Reste du fonds photo — tout le catalogue en galerie —————
  { src: "photo-02.jpeg", out: "gallery/table-laquee.jpg", w: 1200, h: 1600, crop: "center" },
  { src: "photo-03.jpeg", out: "gallery/table-verre.jpg", w: 1200, h: 1600, crop: "center" },
  // photo-04 (300px) retirée de la galerie — remplacée par
  // gallery/vitrine-comptoir.jpg, détail extrait de photos-client/finition-01
  // (crop 320,420 853x640 sur la version 1920px → 800x600, lanczos + sharpen)
  { src: "photo-08.jpeg", out: "gallery/miroirs-organiques.jpg", w: 1200, h: 1600, crop: "center" },
  { src: "photo-11.jpeg", out: "gallery/miroir-fume.jpg", w: 1200, h: 1600, crop: "center" },
  { src: "photo-14.jpeg", out: "gallery/garde-corps-vue.jpg", w: 1200, h: 832, crop: "attention" },
  { src: "photo-15.jpeg", out: "gallery/residence-vitrages.jpg", w: 1200, h: 1600, crop: "attention" },
  { src: "photo-17.jpeg", out: "gallery/agencement-cafe.jpg", w: 1000, h: 1700, crop: "attention", trim: true },

  // Vitraux d'art — photos réelles (réactive le filtre galerie)
  { src: "photo-09.jpeg", out: "gallery/porte-vitrail.jpg", w: 1200, h: 1600, crop: "center" },
  { src: "photo-16.jpeg", out: "gallery/vitrail-floral.jpg", w: 1200, h: 1600, crop: "center" },
];

const positions = {
  top: "top",
  center: "centre",
  attention: sharp.strategy.attention,
};

for (const job of jobs) {
  const dest = path.join(OUT, job.out);
  await mkdir(path.dirname(dest), { recursive: true });
  let img = sharp(path.join(SRC, job.src)).rotate(); // orientation EXIF

  if (job.trim) {
    // Supprime les bordures noires puis repart d'un buffer propre
    const trimmed = await img.trim({ threshold: 25 }).toBuffer();
    img = sharp(trimmed);
  }
  if (job.flop) img = img.flop(); // corrige une image en miroir

  const meta = await img.metadata();

  if (job.extractTop) {
    img = img.extract({
      left: 0,
      top: 0,
      width: meta.width,
      height: Math.min(job.extractTop, meta.height),
    });
  }

  // Jamais d'upscale : la sortie est plafonnée à la zone de recadrage
  // native (l'agrandissement rendait les tuiles floues — le navigateur
  // agrandit mieux une image nette que nous une image gonflée)
  const dims = job.extractTop
    ? { width: meta.width, height: Math.min(job.extractTop, meta.height) }
    : { width: meta.width, height: meta.height };
  const aspect = job.w / job.h;
  const regionW = Math.min(dims.width, dims.height * aspect);
  const outW = Math.min(job.w, Math.floor(regionW));
  const outH = Math.round(outW / aspect);

  await img
    .resize(outW, outH, { fit: "cover", position: positions[job.crop] })
    // Légère mise en valeur — subtile, pas de filtre visible
    .modulate({ brightness: 1.03, saturation: 1.07 })
    .sharpen({ sigma: 0.7 })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(dest);

  console.log(`✓ ${job.out}  (${meta.width}x${meta.height} → ${outW}x${outH}, ${job.crop})`);
}
console.log(`\n${jobs.length} images traitées.`);
