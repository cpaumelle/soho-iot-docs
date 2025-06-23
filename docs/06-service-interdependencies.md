# Service Interdependencies

This diagram shows how the core containers and services in the SOHO IoT platform interact.

```mermaid
graph TD
  subgraph "External Access"
    A1[Browser / App UI] --> Caddy
    A2[LoRaWAN Platform] --> IngestServer
  end

  subgraph "Reverse Proxy (Caddy)"
    Caddy --> IngestServer
    Caddy --> DeviceManager
    Caddy --> Adminer
    Caddy --> StaticFrontend
  end

  subgraph "Core Services"
    IngestServer -->|Writes raw uplinks| IngestDB[(PostgreSQL - ingest)]
    DeviceManager -->|Reads metadata| DeviceDB[(PostgreSQL - device_db)]
    DeviceManager -->|Writes decoded payloads| DeviceDB
    StaticFrontend -->|Calls APIs| DeviceManager
    Adminer --> IngestDB
    Adminer --> DeviceDB
  end

  subgraph "Volumes"
    IngestDB -.->|Volume: ingest_db_data| V1[(Volume)]
    DeviceDB -.->|Volume: device_db_data| V2[(Volume)]
  end
