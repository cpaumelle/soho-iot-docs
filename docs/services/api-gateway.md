# Service: API Gateway

## Overview
The **API Gateway** sits at the edge, routing traffic to upstream services (ingest-server, device-manager, adminer, frontend) and handling TLS termination via Caddy.

## Components
- **unified-caddyfile** – Combined Caddy configuration defining site blocks and reverse proxies.

## Runtime & Dependencies
- **Image**: \`caddy:latest\` (automatic TLS via Let’s Encrypt)  
- **Features**: HTTP/2, HTTP/3, static file serving, path matching.

## Configuration
| File                | Container Path              | Purpose                                    |
|---------------------|-----------------------------|--------------------------------------------|
| \`unified-caddyfile\` | \`/etc/caddy/Caddyfile\`    | Site definitions and reverse-proxy rules   |

### Routes
- \`ingest.verdegris.eu\` → \`ingest-service:8000\`  
- \`api.verdegris.eu\` & \`devices.verdegris.eu\` → \`device-manager:9000\`  
- \`adminer.verdegris.eu\` → \`adminer-ui:8080\`  
- \`app.verdegris.eu\` → static files at \`/var/www/frontend\`, with \`/v1/*\` proxied to \`api.verdegris.eu\`

## Build & Deployment

### Docker Compose excerpt
\`\`\`yaml
services:
  reverse-proxy:
    image: caddy:latest
    container_name: iot-reverse-proxy
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./unified-caddyfile:/etc/caddy/Caddyfile
      - caddy_data:/data
      - caddy_config:/config
      - ./refactor-frontend/src:/var/www/frontend:ro
    networks:
      - iot-network
    depends_on:
      - device-manager
      - ingest-service
      - adminer
    restart: unless-stopped
\`\`\`

## Logging & Monitoring
- **Caddy logs**: streamed to stdout (view with \`docker logs -f iot-reverse-proxy\`).  
- **Access logs**: default Caddy access logging; enable in Caddyfile if detailed logs are needed.

## Commands & Snippets
\`\`\`bash
# Tail gateway logs
docker logs -f iot-reverse-proxy

# Test ingest endpoint
curl https://ingest.verdegris.eu/health

# Test API endpoint
curl https://api.verdegris.eu/v1/status

# Test static site endpoint
curl https://app.verdegris.eu/index.html
\`\`\`
