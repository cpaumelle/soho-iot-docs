# System Overview

## Architecture Diagram
The platform consists of:
- **IoT Devices** → **Ingest Server** → **Ingest Database**  
- **API Gateway (Caddy)** routes to → **Device Manager API** → **Device Database**  
- **Adminer UI** for DB administration  
- **Static Frontend** served by Caddy

## Component Responsibilities
- **Ingest Server**: validates and stores raw payloads.  
- **Device Manager**: exposes REST API for device CRUD and twinning UI.  
- **API Gateway**: TLS termination & domain‐based routing.  
- **Adminer Dashboard**: database management UI.  
- **Frontend**: static assets served with client-side routing.

## Service Interactions & Data Flow
1. Device sends HTTP POST `/uplink` to `ingest.verdegris.eu`.  
2. Ingest Server writes to `ingest.raw_uplinks`.  
3. Users/API call `api.verdegris.eu/v1/devices` for metadata.  
4. Device Manager reads/writes to `device_db.devices` and related tables.  
5. Adminer UI connects to DB for manual inspection.
