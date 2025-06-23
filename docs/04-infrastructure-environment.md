# Infrastructure Environment

## Host OS & Docker
- **OS**: Ubuntu 22.04 LTS  
- **Docker**: 20.x  
- **Docker Compose**: 1.29.x  

## Docker Networks & Volumes
- **Network**: `iot-network` (bridge)  
- **Volumes**:  
  - `ingest-server_pgdata` → `/var/lib/postgresql/data` for ingest DB  
  - `postgres_data` → `/var/lib/postgresql/data` for device DB  
  - `caddy_data` & `caddy_config` for reverse proxy

## Ports & Firewall
- **Host ports**:  
  - 80 → Caddy HTTP  
  - 443 → Caddy HTTPS  
  - 8080 → Adminer UI  
  - 8000 → Ingest API (internal)  
  - 9000 → Device Manager API (internal)  
- **Firewall**: allow TCP 80/443; block direct 8000/9000 externally.
