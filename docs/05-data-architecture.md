# Data Architecture

This document outlines the structure and flow of data across the SOHO IoT platform. It details the databases, table schemas, API pathways, and cross-container data routing that underpin the entire system.

---

## 1. Overview of Data Flow

The platform processes data through the following sequence:

1. **Ingestion**  
   LoRa payloads are POSTed to `https://ingest.verdegris.eu/uplink`. These requests land on the **Ingest Server** (FastAPI, port `8000`), and are written into the `ingest.raw_uplinks` table.

2. **Processing & Twinning**  
   A separate service (or background task) pulls raw uplinks and associates them with known devices in `device_db.devices`, using `external_id` as the key.

3. **Metadata & Decoding**  
   If the device exists and is assigned a `device_type`, the decoder is selected and the payload is interpreted. Results are stored in `device_db.uplinks`.

4. **Presentation Layer**  
   Dashboards or admin tools (e.g. Adminer, Vue UI) read from the `device_db` to show live device info, decoded payloads, and historical trends.

---

## 2. Databases

### `ingest` (Container: `ingest-server-postgres-1`)
- Purpose: Short-term store for raw inbound payloads.
- Retention: 30 days, then archive.

### `device_db` (Container: `device-manager-postgres-1`)
- Purpose: Device metadata, relationships, decoding logic, and processed uplinks.
- Retention: Full history; backed up daily.

---

## 3. Table Definitions

### `ingest.raw_uplinks`

| Column       | Type       | Description                            |
|--------------|------------|----------------------------------------|
| id           | SERIAL PK  | Unique uplink ID                       |
| device_id    | TEXT       | External DevEUI                        |
| timestamp    | TIMESTAMP  | Arrival time                           |
| payload_json | JSONB      | Raw payload data                       |
| forwarded    | BOOLEAN    | Whether it's been processed            |

---

### `device_db.devices`

| Column       | Type       | Description                            |
|--------------|------------|----------------------------------------|
| id           | SERIAL PK  | Internal device ID                     |
| external_id  | TEXT       | DevEUI or unique device identifier     |
| name         | TEXT       | Human-friendly device name             |
| type_id      | INT FK     | Links to `device_types(id)`           |
| created_at   | TIMESTAMP  | First seen                             |
| location1    | TEXT       | Site name                              |
| location2    | TEXT       | Floor name                             |
| location3    | TEXT       | Room name                              |
| last_gateway | TEXT       | Gateway ID that last forwarded data    |

---

### `device_db.device_types`

| Column      | Type       | Description                            |
|-------------|------------|----------------------------------------|
| id          | SERIAL PK  | Device type ID                         |
| name        | TEXT       | Human-readable model name              |
| unpacker    | TEXT       | 'Actility' or 'Local unpacker'         |
| decoder_version | TEXT   | Decoder module or script version       |

---

### `device_db.uplinks`

| Column         | Type       | Description                          |
|----------------|------------|--------------------------------------|
| id             | SERIAL PK  | Uplink ID                            |
| device_id      | INT FK     | FK to `devices(id)`                  |
| timestamp      | TIMESTAMP  | Ingest time                          |
| raw_payload    | TEXT       | Original payload                     |
| decoded_fields | JSONB      | Parsed values from decoder           |
| gateway_id     | TEXT       | Forwarding gateway ID                |

---

## 4. ER Diagram & Relationships

- `device_types (1)` ⟶ `devices (∞)`
- `devices (1)` ⟶ `uplinks (∞)`
- Devices reference 3-level location hierarchy:
  - `location1`: site
  - `location2`: floor
  - `location3`: room

---

## 5. Reverse Proxy & Routing

The reverse proxy is powered by Caddy (container: `iot-reverse-proxy`) and routes traffic to:

| URL                          | Internal Target                     | Purpose                      |
|-----------------------------|-------------------------------------|------------------------------|
| `https://ingest.verdegris.eu` | `ingest-service:8000`               | Receives LoRa POST requests  |
| `https://api.verdegris.eu`    | `device-manager:9000`               | Device and uplink APIs       |
| `https://app.verdegris.eu`    | `static /var/www/frontend`         | Vue-based frontend           |
| `https://adminer.verdegris.eu`| `adminer-ui:8080`                   | Web DB admin (Adminer)       |

---

## 6. API Overview

### Ingest Server API

| Method | Path           | Description                       |
|--------|----------------|-----------------------------------|
| POST   | `/uplink`      | Accept LoRa payloads              |
| GET    | `/health`      | Health check endpoint             |

### Device Manager API

| Method | Path                             | Description                            |
|--------|----------------------------------|----------------------------------------|
| GET    | `/v1/devices/api/uplinks`       | All decoded uplinks                    |
| GET    | `/v1/devices/api/orphans`       | Devices with no assigned location/type |
| GET    | `/v1/devices/api/device-types`  | Device model list                      |
| POST   | `/v1/devices/api/twin`          | Assign device to model/location        |

---

## 7. Retention & Backup

- **Ingest DB**: rotated every 30 days via cron; full SQL dump.
- **Device DB**: dumped daily into `~/iot/backups/YYYY-MM-DD_HH-MM` folder.
- **Configs**: Docker compose, Caddyfiles, and schema .sql backups are tarballed and stored alongside DB backups.

---

## 8. Cross-Service Notes

- **Adminer** provides a read-only UI for inspecting both databases.
- **Vue Frontend** uses `/v1/devices/api/*` routes for real-time views.
- **Uplinks** are pulled from the ingest DB and enriched with metadata from the device DB before visualisation.

---

## 9. Example Uplink Flow

```text
[LoRa Device] → POST /uplink →
[ingest-server] → INSERT INTO ingest.raw_uplinks →
[processor] → JOIN with device_db.devices →
→ DECODE using device_types.unpacker →
→ INSERT INTO device_db.uplinks →
→ Frontend/API display decoded payload
