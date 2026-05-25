FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@9 --activate
WORKDIR /app

# Install dependencies
FROM base AS deps
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/web/package.json ./apps/web/
COPY apps/admin/package.json ./apps/admin/
COPY packages/database/package.json ./packages/database/
COPY packages/auth/package.json ./packages/auth/
COPY packages/config/package.json ./packages/config/
COPY packages/modules/package.json ./packages/modules/
COPY packages/email/package.json ./packages/email/
COPY packages/queue/package.json ./packages/queue/
COPY packages/themes/package.json ./packages/themes/
COPY packages/ui/package.json ./packages/ui/
RUN pnpm install --frozen-lockfile

# Generate Prisma client
FROM deps AS prisma
COPY packages/database/prisma ./packages/database/prisma
RUN pnpm --filter @yogara/database exec prisma generate

# Build web app
FROM prisma AS build-web
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm --filter web build

# Build admin app
FROM prisma AS build-admin
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm --filter admin build

# Production web
FROM base AS web
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=build-web /app/apps/web/.next/standalone ./
COPY --from=build-web /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=build-web /app/apps/web/public ./apps/web/public
EXPOSE 3000
CMD ["node", "apps/web/server.js"]

# Production admin
FROM base AS admin
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=build-admin /app/apps/admin/.next/standalone ./
COPY --from=build-admin /app/apps/admin/.next/static ./apps/admin/.next/static
COPY --from=build-admin /app/apps/admin/public ./apps/admin/public
EXPOSE 3001
CMD ["node", "apps/admin/server.js"]
