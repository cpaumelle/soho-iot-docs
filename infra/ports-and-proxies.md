# Port & Reverse Proxy Mapping

## External Domains

| Domain                | Purpose                            |
|-----------------------|------------------------------------|
| api.verdegris.eu      | Unified API Gateway (Caddy)        |
| ingest.verdegris.eu   | Direct ingest for sensors          |
| devices.verdegris.eu  | Legacy redirect to `/v1/devices`   |

## Internal Port Map (All Services)

| Port | Purpose                        | Container/Layer           |
|------|--------------------------------|----------------------------|
| 8000 | FastAPI ingest endpoint        | ingest-server-ingest-1    |
| 8080 | Adminer DB UI (via Caddy)      | adminer_dashboard_caddy   |
| 8090 | HTTP API Gateway (Caddy)       | iot-api-gateway           |
| 8443 | HTTPS API Gateway (Caddy)      | iot-api-gateway           |
| 8800 | Vue UI (during dev)            | soho-iot-ui (internally exposed) |
| 9000 | FastAPI device manager         | device-manager-device-server-1 |
| 5432 | PostgreSQL for ingest          | ingest-server-postgres-1  |
| 5433 | PostgreSQL for device manager  | device-manager-postgres-1 |

## Notes

- All legacy containers, volumes, and networks have been removed.
- `frontend/` folder may be deprecated in favor of dockerized `soho-iot-ui`.
