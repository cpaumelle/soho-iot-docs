# Port & Reverse Proxy Mapping

| Port | Purpose                        | Owner / Layer                  |
|------|--------------------------------|--------------------------------|
| 8000 | Uplink Ingest                  | Ingest FastAPI                 |
| 8080 | Adminer DB UI                  | Adminer Caddy                  |
| 8090 | Caddy (soho-iot-ui) API proxy  | Dev reverse proxy to FastAPI  |
| 8800 | Vue Dev Server                 | Dashboard UI                   |
| 9000 | Device Manager FastAPI backend | Core device registry API       |
| 5432 | Ingest PostgreSQL              | Raw uplinks DB                 |
| 5433 | Device Manager PostgreSQL      | Device & hierarchy DB          |
