SOHO IoT Platform Documentation

Purpose

A compact, maintainable, and production-ready platform for ingesting, processing, managing, and visualizing IoT data across SOHO and SME environments.

Architecture Overview

Containers
Service
Purpose
Internal Port
Source Folder
ingest-server
Public ingest gateway for LoRaWAN payloads
8000
~/iot/ingest-server/
device-manager
Device CRUD, metadata & decoding logic
9000
~/iot/device-manager/
reverse-proxy
Caddy TLS & routing
80/443
~/iot/unified-caddyfile
ingest-database
PostgreSQL for raw uplinks
5432
volume ingest-server_pgdata
device-database
PostgreSQL for device metadata
5432
volume postgres_data

Proxy & Domains
	•	ingest.verdegris.eu → ingest-service:8000
	•	api.verdegris.eu     → device-manager:9000
	•	adminer.verdegris.eu → adminer-ui:8080
	•	app.verdegris.eu     → static frontend

File & Folder Structure

~/iot/
├── ingest-server/
├── device-manager/
├── unified-caddyfile
├── docker-compose.yml
└── docs/                    # This repo’s docs
└── services/            # Service-specific docs

API Endpoints

Ingest Server
	•	POST /uplink → Receive and store raw payloads
	•	GET  /health → Health check

Device Manager
	•	GET    /v1/devices
	•	POST   /v1/devices
	•	PUT    /v1/devices/{id}
	•	DELETE /v1/devices/{id}
	•	UI served at /static/

Environment Variables (example)

POSTGRES_HOST=ingest-database
POSTGRES_DB=ingest
POSTGRES_USER=ingestuser
POSTGRES_PASSWORD=ingestpass
DATABASE_URL=postgresql+psycopg2://iot:secret@device-database:5432/device_db

Quick Start

git clone git@github.com:cpaumelle/soho-iot-docs.git
cd soho-iot-docs
less docs/services/ingest-server.md

Detailed Service Docs
	•	Ingest Server → ./docs/services/ingest-server.md
	•	API Gateway    → ./docs/services/api-gateway.md
	•	Device Manager → ./docs/services/device-manager.md
	•	Adminer Dash   → ./docs/services/adminer-dashboard.md
	•	Adminer Config → ./docs/services/adminer-config.md
