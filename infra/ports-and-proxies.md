# Port & Reverse Proxy Mapping

## 🧭 External Domains

| Domain                  | Purpose                              |
|-------------------------|--------------------------------------|
| `api.verdegris.eu`      | Unified API Gateway                  |
| `ingest.verdegris.eu`   | Direct high-volume ingest endpoint   |
| `devices.verdegris.eu`  | Legacy redirect to `/v1/devices/`    |

## 🔁 Reverse Proxy (Caddy)

- `/api/device-manager/*` → `device-manager-device-server-1:9000`
- `/api/ingest/*` → `ingest-server-ingest-1:8000`
- `/admin` → `adminer_dashboard_caddy:80`
- `/health` → JSON response
- Enables CORS, gzip, and automatic SSL via Let’s Encrypt

## 📍 Port Mappings

| Port | Purpose                        | Layer               |
|------|--------------------------------|---------------------|
| 8000 | Ingest FastAPI                 | Ingestion           |
| 8080 | Adminer DB UI                  | Admin UI            |
| 8090 | API Gateway HTTP               | Reverse proxy       |
| 8443 | API Gateway HTTPS              | Reverse proxy       |
| 8800 | Vue Dev Server                 | Dashboard UI        |
| 9000 | Device Manager API             | Device registry     |
| 5432 | PostgreSQL (Ingest)            | Raw uplinks DB      |
| 5433 | PostgreSQL (Device Manager)    | Device metadata DB  |
