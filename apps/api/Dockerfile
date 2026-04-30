FROM node:20-alpine AS base

# Install pnpm and turbo
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
RUN pnpm add -g turbo

FROM base AS pruner
WORKDIR /app
COPY . .
RUN turbo prune api --docker

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
RUN pnpm run build --filter=api

FROM base AS runner
WORKDIR /app

# Copy the built files
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

# Add packages/ shared dependencies if any (api might depend on @repo/ui etc)
# In this specific repo, api seems to be independent but let's be safe
COPY --from=builder /app/packages ./packages

EXPOSE 8000
CMD ["node", "dist/main"]
