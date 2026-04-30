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

ENV NODE_ENV=production

# Use pnpm deploy to create a standalone production bundle
# We need the full builder context to resolve workspace deps
COPY --from=builder /app /app
RUN pnpm --filter=api --prod deploy /app/deployed

# Copy the built dist into the deployed folder
COPY --from=builder /app/apps/api/dist /app/deployed/dist

WORKDIR /app/deployed
EXPOSE 8000
CMD ["node", "dist/main"]
