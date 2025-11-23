#!/usr/bin/with-contenv bashio
set -e

bashio::log.info "Starting Vue Dashboard Panel..."

# Get configuration from options
THEME=$(bashio::config 'theme')
REFRESH_INTERVAL=$(bashio::config 'refresh_interval')

# Ingress info
INGRESS_PATH=$(bashio::addon.ingress_entry)
INGRESS_URL=$(bashio::addon.ingress_url)

bashio::log.info "Ingress available at: ${INGRESS_URL}"
bashio::log.info "Theme: ${THEME}, Refresh: ${REFRESH_INTERVAL}s"

# Create runtime configuration for Vue app
cat > /var/www/html/config.json << EOF
{
  "theme": "${THEME}",
  "refreshInterval": ${REFRESH_INTERVAL},
  "ingressPath": "${INGRESS_PATH}"
}
EOF

bashio::log.info "Configuration file created successfully"

# Start Nginx
bashio::log.info "Starting Nginx web server..."
exec nginx -g 'daemon off;'
