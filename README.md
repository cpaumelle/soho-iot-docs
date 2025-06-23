# SOHO IoT Platform Documentation

A compact, maintainable, and production-ready platform for ingesting, processing, managing, and visualizing IoT data across SOHO (Small Office/Home Office) and SME (Small and Medium-sized Enterprise) environments.

## Table of Contents

- [Purpose](#purpose)
- [Architecture Overview](#architecture-overview)
  - [Containers](#containers)
  - [Proxy & Domains](#proxy--domains)
- [File & Folder Structure](#file--folder-structure)
- [API Endpoints](#api-endpoints)
  - [Ingest Server](#ingest-server)
  - [Device Manager](#device-manager)
- [Environment Variables](#environment-variables)
- [Quick Start](#quick-start)
- [Detailed Service Documentation](#detailed-service-documentation)
- [Data Architecture](#data-architecture)
- [Diagrams & Workflows](#diagrams--workflows)

---

## Purpose

This platform is designed to provide a robust and scalable solution for handling IoT data, from initial ingestion to advanced processing, device management, and data visualization. It's built with maintainability in mind, making it suitable for both small-scale deployments and environments requiring more comprehensive data handling.

---

## Architecture Overview

The SOHO IoT Platform is built using a modular, containerized architecture for flexibility and ease of deployment.

### Containers

| Service          | Purpose                                   | Internal Port | Source Folder             |
|------------------|--------------------------------------------|----------------|----------------------------|
| `ingest-server`  | Public ingest gateway for LoRaWAN payloads| `8000`         | `~/iot/ingest-server/`     |
| `device-manager` | Device CRUD, metadata & decoding logic    | `9000`         | `~/iot/device-manager/`    |
| `reverse-proxy`  | Caddy TLS & routing                       | `80/443`       | `~/iot/unified-caddyfile`  |
| `ingest-database`| PostgreSQL for raw uplinks                | `5432`         | Docker volume              |
| `device-database`| PostgreSQL for device metadata            | `5432`         | Docker volume              |
| `adminer-ui`     | Database web admin (optional)            | `8080`         | `~/iot/adminer-dashboard/` |

### Proxy & Domains

The platform utilizes a reverse proxy (Caddy) to handle TLS termination and route traffic to the appropriate services.

- `https://ingest.verdegris.eu` → `ingest-service:8000`
- `https://api.verdegris.eu` → `device-manager:9000`
- `https://adminer.verdegris.eu` → `adminer-ui:8080`
- `https://app.verdegris.eu` → static frontend (with `/vX/*` versioned routing)

---

## File & Folder Structure
~/iot/
├── ingest-server/
├── device-manager/
├── adminer-dashboard/
├── unified-caddyfile/
├── refactor-frontend/
├── ui-versions/
│   ├── v1/src/
│   ├── v2/src/
│   ├── v3/src/
├── documentation-soho-iot/
│   ├── docs/
│   ├── scripts/
│   └── backups/

---

## API Endpoints

### Ingest Server

- `POST /uplink`: Receives incoming payloads
- `GET /health`: Health check

### Device Manager

- `GET /v1/devices/api/summary`: Get device overview
- `GET /v1/devices/api/uplinks`: List uplinks (with `limit/skip`)
- `POST /v1/devices/api/device-types`: Register device type
- `GET /v1/status`: Backend health

---

## Environment Variables

See each service folder for `.env.sample` files. Sensitive credentials are passed via `docker-compose.yml` or `.env`.

---

## Quick Start

```bash
cd ~/iot
docker compose up -d

	•	Verify https://app.verdegris.eu renders the UI
	•	Check Caddy logs: docker logs -f iot-reverse-proxy

⸻

Detailed Service Documentation
	•	docs/01-ingest-server.md
	•	docs/02-device-manager.md
	•	docs/03-reverse-proxy.md
	•	docs/04-adminer-dashboard.md

⸻

Data Architecture

See docs/05-data-architecture.md
	•	Tables: raw_uplinks, devices, device_types
	•	Relationships & retention policy
	•	ER diagram and schema strategy

⸻

Diagrams & Workflows
	•	Service Interdependencies: docs/06-service-interdependencies.md
	•		•	UI Versioning Strategy: scripts/UI-version-copy-script.md
	•	Describes safe iterative development workflow via create-ui-version.sh

⸻

Contributions & Maintenance
	•	Backup script: ~/iot/backup.sh
	•	Snapshots: snapshot.sh tags git with timestamp
	•	Daily cron: 0 2 * * * /home/charles/iot/backup.sh >> /home/charles/iot/backup.log 2>&1

⸻

✅ Everything you need to develop, debug, extend, and deploy this platform lives here.


