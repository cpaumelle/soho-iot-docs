Service: Adminer Dashboard

Overview

The Adminer Dashboard provides a web interface for managing PostgreSQL databases, served via Caddy for consistency and HTTPS support.

Components
	•	Caddyfile – reverse-proxy configuration for Adminer
	•	adminer_files/ – adminer.php and helper scripts under /var/www/html

Runtime & Dependencies
	•	Image: caddy:latest (Docker Hub)
	•	PHP Files: Adminer’s adminer.php, index.php

Build & Deployment

Docker Compose excerpt (adminer_web)

services:
  adminer_web:
    image: caddy:latest
    container_name: adminer_dashboard_caddy
    restart: unless-stopped
    ports:
      - "8080:80"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile:ro
      - ~/adminer_files:/var/www/html:ro
    networks:
      - adminer_network

networks:
  adminer_network:
    driver: bridge

Configuration & Environment

Env Var	Description	Default
ADMINER_DEFAULT_SERVER	Default database server hostname	device-database
ADMINER_DESIGN	Adminer UI theme	nette

These are set in the primary adminer service in the main docker-compose.yml.

Logging & Monitoring
	•	Logs: streamed to Docker logs (docker logs -f adminer_dashboard_caddy)
	•	Health-check: HTTP 200 on GET / implicitly via Caddy

Commands & Snippets

# View Caddy logs
docker logs -f adminer_dashboard_caddy

# Access Adminer
open http://localhost:8080


Overview

The API Gateway sits at the edge, routing traffic to upstream services (ingest-server, device-manager, adminer, frontend) and handling TLS termination via Caddy.

Components
	•	unified-caddyfile – Caddy configuration defining site blocks and reverse proxies

Runtime & Dependencies
	•	Image: caddy:latest (automatic TLS via Let’s Encrypt)
	•	Features: HTTP/2, HTTP/3, static file serving, path matching

Configuration

File	Path	Purpose
unified-caddyfile	/etc/caddy/Caddyfile	Combined site definitions for all services

Routes:
	•	ingest.verdegris.eu → ingest-service:8000
	•	api.verdegris.eu & devices.verdegris.eu → device-manager:9000
	•	adminer.verdegris.eu → adminer-ui:8080
	•	app.verdegris.eu → static files at /var/www/frontend, with /v1/* proxy to api.verdegris.eu

Build & Deployment

Docker Compose excerpt

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

Logging & Monitoring
	•	Caddy logs: stdout (Docker logs)
	•	Access logs: default Caddy access logging (enable via Caddyfile if needed)

Commands & Snippets

# Tail gateway logs
docker logs -f iot-reverse-proxy

# Test route to ingest
curl https://ingest.verdegris.eu/health

# Test route to API
curl https://api.verdegris.eu/v1/status

# Test static site
curl https://app.verdegris.eu/index.html
