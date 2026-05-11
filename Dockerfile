# 1. Base Setup
FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# 2. Prune stage
FROM base AS pruner
# Default to 'api' if no APP_NAME is provided
ARG APP_NAME=api
WORKDIR /app
RUN npm install -g turbo
COPY . .
RUN turbo prune ${APP_NAME} --docker

# 3. Installer stage
FROM base AS installer
ARG APP_NAME=api
WORKDIR /app
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install --frozen-lockfile

# 4. Build stage
COPY --from=pruner /app/out/full/ .
RUN npx turbo build --filter=${APP_NAME}

# Ensure directories exist
RUN mkdir -p apps/${APP_NAME}/dist \
             apps/${APP_NAME}/.next/standalone \
             apps/${APP_NAME}/.next/static \
             apps/${APP_NAME}/public

# 5. Runner stage
FROM base AS runner
ARG APP_NAME=api
ENV APP_NAME=${APP_NAME}
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodeuser
USER nodeuser

# Copy built outputs
COPY --from=installer /app/apps/${APP_NAME}/dist ./apps/${APP_NAME}/dist
COPY --from=installer /app/node_modules ./node_modules
COPY --from=installer /app/apps/${APP_NAME}/package.json ./apps/${APP_NAME}/package.json
COPY --from=installer /app/apps/${APP_NAME}/node_modules* ./apps/${APP_NAME}/node_modules/

# For Next.js standalone folder and assets
COPY --from=installer /app/apps/${APP_NAME}/.next/standalone ./
COPY --from=installer /app/apps/${APP_NAME}/.next/static ./apps/${APP_NAME}/.next/static
COPY --from=installer /app/apps/${APP_NAME}/public ./apps/${APP_NAME}/public

EXPOSE 3000 3001 8000
CMD ["sh", "-c", "if [ -f apps/${APP_NAME}/server.js ]; then node apps/${APP_NAME}/server.js; else node apps/${APP_NAME}/dist/main.js; fi"]