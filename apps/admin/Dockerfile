FROM node:20-slim AS base

# Install pnpm and turbo
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
RUN pnpm add -g turbo@2.8.3

FROM base AS pruner
WORKDIR /app
COPY . .
RUN turbo prune admin --docker

FROM base AS builder
WORKDIR /app

# First copy the pruned files
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml

# Install dependencies
RUN pnpm install

# Build the project
COPY --from=pruner /app/out/full/ .
COPY turbo.json turbo.json
RUN pnpm run build --filter=admin

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy the built files
COPY --from=builder /app/apps/admin/next.config.ts ./
COPY --from=builder /app/apps/admin/public ./apps/admin/public
COPY --from=builder /app/apps/admin/.next/standalone ./
COPY --from=builder /app/apps/admin/.next/static ./apps/admin/.next/static

EXPOSE 3001
CMD ["node", "apps/admin/server.js"]
