# Admin UI (Adminer via Caddy)

## Overview

Adminer is a lightweight PHP-based database management UI. It's served using a Caddy container and provides web-based access to PostgreSQL.

## Access URLs

- Local: http://localhost:8080/
- Planned: http://api.verdegris.eu/admin

## Docker Setup

- Container name: adminer_dashboard_caddy
- Image: caddy:latest
- Port: 8080:80
- Mounted volumes:
  - ./Caddyfile → /etc/caddy/Caddyfile
  - ~/adminer_files → /var/www/html

## Notes

- Adminer is mounted statically via Caddy.
- Intended for local/dev use — restrict access externally in production.
