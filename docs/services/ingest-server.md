# Service: Ingest Server

## Overview
The **ingest-server** receives raw IoT uplink data, parses it, and writes to the Postgres “ingest” database for downstream processing.

## Components
- **app/**  
  - `main.py` – FastAPI entrypoint  
  - `forwarder.py` – forwards validated data  
  - `routers/` – FastAPI route definitions  
- **caddy_config/**  
  - `Caddyfile` – reverse-proxy routing to this service on port 8000  

## Runtime & Dependencies
- **Base image**: `python:3.11-slim`  
- **Framework**: FastAPI (uvicorn)  
- **Key libs**:  
  - `SQLAlchemy` for DB ORM  
  - `pydantic` for validation  
  - `python-dotenv` for .env support  
- **Extras**: `httpie`, `curl` for debugging

## Configuration
| Env Var             | Description                 | Default           |
|---------------------|-----------------------------|-------------------|
| `POSTGRES_HOST`     | Hostname of ingest database | `ingest-database` |
| `POSTGRES_DB`       | Database name               | `ingest`          |
| `POSTGRES_USER`     | DB user                     | `ingestuser`      |
| `POSTGRES_PASSWORD` | DB password                 | `ingestpass`      |

## Build & Deployment

### Dockerfile
\`\`\`dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt \
    && pip install httpie \
    && apt-get update && apt-get install -y curl
COPY . .
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
\`\`\`

### Docker Compose (excerpt)
\`\`\`yaml
services:
  ingest-service:
    build:
      context: ./ingest-server
    container_name: ingest-service
    environment:
      - POSTGRES_HOST=ingest-database
      - POSTGRES_DB=ingest
      - POSTGRES_USER=ingestuser
      - POSTGRES_PASSWORD=ingestpass
    networks:
      - iot-network
    restart: unless-stopped

  ingest-database:
    image: postgres:15
    container_name: ingest-database
    environment:
      POSTGRES_DB: ingest
      POSTGRES_USER: ingestuser
      POSTGRES_PASSWORD: ingestpass
    volumes:
      - ingest-server_pgdata:/var/lib/postgresql/data
    networks:
      - iot-network
    restart: unless-stopped
\`\`\`

## Logging & Monitoring
- **Application logs**: stdout (captured by Docker)  
- **Cron logs**: `/home/charles/iot/ingest-server/cron.log`  
- **Health-check**: GET `/health` (if implemented in `main.py`)

## Commands & Snippets
\`\`\`bash
# Run locally without Docker
cd ~/iot/ingest-server
pip install -r requirements.txt
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000

# Tail live logs
docker logs -f ingest-service

# Test a sample uplink
http POST http://localhost:8000/uplink id=123 data='{"temp":22.5}'
\`\`\`
