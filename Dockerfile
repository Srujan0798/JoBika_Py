# Multi-stage build for optimization

# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy source
COPY . .

# Build (if using a build step, e.g., for frontend assets or if this were a compiled app)
# For this vanilla JS/Node app, we might not need a build step, but keeping it for consistency
# RUN npm run build 

# Stage 2: Production
FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV production

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy application files
COPY --from=builder --chown=nextjs:nodejs /app .

USER nextjs

EXPOSE 3000

CMD ["node", "backend/server.js"]
