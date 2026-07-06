import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // "standalone" uniquement pour l'image Docker (déploiement VPS) —
  // en local, `next start` classique est pleinement supporté.
  output: process.env.DOCKER_BUILD ? "standalone" : undefined,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [420, 640, 768, 1024, 1280, 1600, 1920],
    // 90 = photo du hero (quality={90}) ; 75 = valeur par défaut
    qualities: [75, 90],
  },
  poweredByHeader: false,
  compress: true,
};

export default nextConfig;
