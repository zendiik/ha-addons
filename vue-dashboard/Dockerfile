ARG BUILD_FROM=ghcr.io/home-assistant/amd64-base:latest
ARG BUILD_VERSION=1.0.0

###################
# Stage 1: Builder
###################
FROM node:20-alpine AS builder

# Build arguments
ARG VITE_APP_VERSION
ARG VITE_API_URL

ENV VITE_APP_VERSION=${VITE_APP_VERSION:-1.0.0}
ENV VITE_API_URL=${VITE_API_URL:-}

# Working directory
WORKDIR /app

# Copy package files
COPY frontend/package*.json ./

# Install all dependencies (including devDependencies for build)
RUN npm ci

# Copy source code
COPY frontend/ ./

# Build Vue 3 application
RUN npm run build

###################
# Stage 2: Runtime
###################
FROM ${BUILD_FROM}

# Environment
ENV LANG=C.UTF-8

# Install runtime dependencies
RUN apk add --no-cache \
    nginx \
    bash \
    jq \
    curl

# Copy built application from builder
COPY --from=builder /app/dist /var/www/html

# Copy Nginx configuration
COPY nginx/nginx-main.conf /etc/nginx/nginx.conf
COPY nginx/nginx.conf /etc/nginx/http.d/default.conf

# Create necessary directories and set permissions
RUN mkdir -p /var/run/nginx /var/log/nginx /var/cache/nginx \
    && chown -R nginx:nginx /var/www/html \
    && chown -R nginx:nginx /var/cache/nginx \
    && chown -R nginx:nginx /var/run/nginx \
    && chown -R nginx:nginx /var/log/nginx \
    && touch /var/run/nginx/nginx.pid \
    && chown nginx:nginx /var/run/nginx/nginx.pid

# Copy run script
COPY run.sh /
RUN chmod a+x /run.sh

# Expose Ingress port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl --fail http://localhost:8080 || exit 1

# Labels
LABEL \
    io.hass.version="${BUILD_VERSION}" \
    io.hass.type="addon" \
    io.hass.arch="amd64"

# Run
CMD ["/run.sh"]
