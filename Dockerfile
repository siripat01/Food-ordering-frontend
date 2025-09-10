# syntax=docker/dockerfile:1

# --- Build arguments for versions ---
ARG NODE_VERSION=22.14.0
ARG PNPM_VERSION=10.4.1

# --- Base image with corepack and pnpm enabled ---
FROM node:${NODE_VERSION} AS base
RUN --mount=type=cache,target=/root/.npm \
    npm install --global corepack@latest
RUN corepack enable && corepack prepare pnpm@${PNPM_VERSION} --activate
WORKDIR /app

# --- Builder stage: install dependencies and build ---
FROM base AS builder
WORKDIR /app

# Copy only package manager files first for better caching
COPY --link package.json pnpm-lock.yaml ./

# Set up pnpm cache
ENV PNPM_HOME=/root/.local/share/pnpm
ENV PATH=$PNPM_HOME:$PATH
ENV PNPM_STORE_DIR=/root/.pnpm-store

# Install dependencies (including dev dependencies for build)
RUN --mount=type=cache,target=${PNPM_STORE_DIR} \
    pnpm install --frozen-lockfile

# Copy the rest of the application source (excluding files in .dockerignore)
COPY --link . .

# Build the Next.js app (outputs to .next)
RUN pnpm run build

# --- Production image ---
FROM node:${NODE_VERSION}-slim AS final

# Security: create non-root user
RUN addgroup --system --gid 1001 appgroup && \
    adduser --system --uid 1001 --ingroup appgroup appuser

WORKDIR /app

# Copy only the necessary files and built output from builder
COPY --from=builder --link /app/package.json ./
COPY --from=builder --link /app/node_modules ./node_modules
COPY --from=builder --link /app/public ./public
COPY --from=builder --link /app/.next ./.next
COPY --from=builder --link /app/next.config.ts ./next.config.ts

ENV NODE_ENV=production
EXPOSE 3000
USER appuser

CMD ["pnpm", "start"]
