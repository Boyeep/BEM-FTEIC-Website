FROM node:20-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

FROM base AS deps

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile
RUN rm -f ~/.npmrc

FROM base AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG BUILD_STANDALONE=true

ENV NODE_ENV=production
ENV BUILD_STANDALONE=$BUILD_STANDALONE

# Docker Compose automatically loads `env_file` for the running container, but
# not for image build-time variable interpolation. Normalize Windows CRLF and
# source `.env.production` here so `docker compose up -d --build` works without
# extra CLI flags.
RUN if [ -f .env.production ]; then tr -d '\r' < .env.production > /tmp/.env.production && set -a && . /tmp/.env.production && set +a; fi && pnpm build

FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

RUN addgroup -S nodejs && adduser -S nextjs -G nodejs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
