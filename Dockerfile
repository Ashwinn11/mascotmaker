# ── Stage 1: Install deps & build ──────────────────────────────────────────
FROM node:20-alpine AS builder

# sharp needs these native libs
RUN apk add --no-cache libc6-compat python3 make g++

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

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

# Create a writable directory for SQLite DB (mounted as Cloud Run volume)
RUN mkdir -p /data && chown -R node:node /data
ENV DATABASE_PATH=/data/mascot.db

USER node

EXPOSE 8080

CMD ["node", "server.js"]
