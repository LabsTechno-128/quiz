FROM node:20-slim AS base

# Install pnpm and turbo
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
# Install a specific version of turbo to match project
RUN pnpm add -g turbo@2.8.3

FROM base AS pruner
WORKDIR /app
COPY . .
RUN turbo prune main --docker

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
RUN pnpm run build --filter=main

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy the built files
COPY --from=builder /app/apps/main/next.config.ts ./
COPY --from=builder /app/apps/main/public ./apps/main/public
COPY --from=builder /app/apps/main/.next/standalone ./
COPY --from=builder /app/apps/main/.next/static ./apps/main/.next/static

EXPOSE 3000
CMD ["node", "apps/main/server.js"]
