# ── Stage 1: Install deps & build ──────────────────────────────────────────
FROM node:20-alpine AS builder

# sharp needs these native libs
RUN apk add --no-cache libc6-compat python3 make g++

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# NEXT_PUBLIC_ vars must be present at build time — Next.js inlines them into the client bundle.
# These are public LemonSqueezy variant IDs (visible in browser), safe to hardcode.
ENV NEXT_PUBLIC_LS_VARIANT_100=1358426
ENV NEXT_PUBLIC_LS_VARIANT_500=1358430
ENV NEXT_PUBLIC_LS_VARIANT_1500=1358431

# Build Next.js (standalone output for small final image)
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ── Stage 2: Minimal production image ──────────────────────────────────────
FROM node:20-alpine AS runner

RUN apk add --no-cache libc6-compat

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=8080

# Next.js standalone bundles everything needed
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Writable cache dir for Next.js image optimization
RUN mkdir -p /app/.next/cache && chown -R node:node /app/.next/cache

# Create a writable directory for SQLite DB (mounted as Cloud Run volume)
RUN mkdir -p /data && chown -R node:node /data
ENV DATABASE_PATH=/data/mascot.db

USER node

EXPOSE 8080

CMD ["node", "server.js"]
