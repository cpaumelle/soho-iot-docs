# Service: Device Manager

## Overview
The **device-manager** service handles IoT device CRUD operations, metadata storage, and a web UI for managing digital twins.

## Components
- **app/**  
  - `main.py` – FastAPI application entrypoint  
  - `routers/` – API endpoint definitions (devices, locations, etc.)  
  - `database/` – SQL initialization scripts  
  - `decoders/` – custom packet decoders  
- **static/twinning-ui/** – frontend assets (HTML, JS, CSS) for device twinning UI  
- SQL scripts (`*.sql`) for migrations and schema changes  

## Runtime & Dependencies
- **Base image**: `python:3.11-slim`  
- **Framework**: FastAPI (uvicorn)  
- **Key libraries**:  
  - `psycopg2-binary` – PostgreSQL driver  
  - `SQLAlchemy` – ORM  
  - `httpx` – HTTP client for internal calls  

## Configuration
| Env Var        | Description                           | Example                                                               |
|----------------|---------------------------------------|-----------------------------------------------------------------------|
| `DATABASE_URL` | SQLAlchemy connection string to Postgres | `postgresql+psycopg2://iot:secret@device-database:5432/device_db?options=-csearch_path=devices` |

## Build & Deployment

### Dockerfile
\`\`\`dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY ./app ./app
RUN ls -l ./app/routers
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "9000"]
\`\`\`

### Docker Compose excerpt
\`\`\`yaml
services:
  device-manager:
    build:
      context: ./device-manager
    container_name: device-manager
    environment:
      - DATABASE_URL=postgresql+psycopg2://iot:secret@device-database:5432/device_db?options=-csearch_path=devices
    networks:
      - iot-network
    depends_on:
      - device-database
    restart: unless-stopped
\`\`\`

## Logging & Monitoring
- **Logs**: streamed to stdout (`docker logs -f device-manager`)  
- **Health endpoint**: GET `/health` (if implemented)  

## Commands & Snippets
\`\`\`bash
# Run locally
cd ~/iot/device-manager
pip install -r requirements.txt
uvicorn app.main:app --reload --host 127.0.0.1 --port 9000

# Tail logs
docker logs -f device-manager

# Initialize schema
psql "$DATABASE_URL" -f database/init.sql
\`\`\`
