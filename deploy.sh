#!/usr/bin/env bash
# Déploiement sans coupure visible, avec rollback automatique.
#
# Usage sur le VPS :   ./deploy.sh
# Prérequis : docker + docker compose v2, .env présent à la racine.
set -euo pipefail

APP_NAME="chaimae-glass"
HEALTH_URL="http://127.0.0.1:3000/api/health"
HEALTH_RETRIES=30   # 30 × 2s = 60s max d'attente
HEALTH_INTERVAL=2

log() { printf "\n\033[1;33m▸ %s\033[0m\n" "$*"; }

cd "$(dirname "$0")"

log "Mise à jour du code (git pull)"
git pull --ff-only

# Conserver l'image actuelle comme point de rollback
if docker image inspect "${APP_NAME}:latest" >/dev/null 2>&1; then
  log "Sauvegarde de l'image actuelle → ${APP_NAME}:previous"
  docker tag "${APP_NAME}:latest" "${APP_NAME}:previous"
fi

log "Build de la nouvelle image (l'ancienne continue de tourner)"
docker compose build app

log "Bascule vers le nouveau conteneur"
docker compose up -d --no-deps app

log "Vérification de santé (${HEALTH_URL})"
healthy=false
for i in $(seq 1 "$HEALTH_RETRIES"); do
  if curl -fsS --max-time 3 "$HEALTH_URL" >/dev/null 2>&1; then
    healthy=true
    break
  fi
  sleep "$HEALTH_INTERVAL"
done

if [ "$healthy" = true ]; then
  log "✅ Déploiement réussi — l'application répond."
  docker image prune -f >/dev/null
  exit 0
fi

log "❌ L'application ne répond pas — ROLLBACK vers l'image précédente"
if docker image inspect "${APP_NAME}:previous" >/dev/null 2>&1; then
  docker tag "${APP_NAME}:previous" "${APP_NAME}:latest"
  docker compose up -d --no-deps app
  log "Rollback effectué. Vérifiez les logs : docker compose logs app"
else
  log "Aucune image précédente disponible. Vérifiez : docker compose logs app"
fi
exit 1
