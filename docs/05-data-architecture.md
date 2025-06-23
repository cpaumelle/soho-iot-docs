# Data Architecture

## Databases

### ingest
Stores raw IoT uplink records.

### device_db
Stores device metadata, types, and related data.

## Table Definitions

### ingest.raw_uplinks
| Column       | Type       | Description                  |
|--------------|------------|------------------------------|
| id           | SERIAL PK  | Unique uplink identifier     |
| device_id    | TEXT       | Originating device external ID |
| timestamp    | TIMESTAMP  | Arrival time of uplink       |
| payload_json | JSONB      | Raw payload content          |
| forwarded    | BOOLEAN    | Processing flag              |

### device_db.devices
| Column      | Type       | Description                      |
|-------------|------------|----------------------------------|
| id          | SERIAL PK  | Internal device identifier       |
| external_id | TEXT       | Unique device external ID        |
| name        | TEXT       | Human-readable device name       |
| type_id     | INT FK     | References device_types(id)      |
| created_at  | TIMESTAMP  | Record creation timestamp        |

### device_db.device_types
| Column      | Type       | Description                      |
|-------------|------------|----------------------------------|
| id          | SERIAL PK  | Type identifier                  |
| name        | TEXT       | Device type name                 |
| schema_json | JSONB      | JSON schema for payload validation |

## ER Diagram & Relationships
- **One-to-many**: device_types → devices  
- **One-to-many**: devices → raw_uplinks  
- **Devices** may also link to **locations**, **floors**, **rooms**.

## Storage & Retention
- **Raw uplinks**: retained 30 days, then archived to backup server.  
- **Metadata DB**: daily snapshots; RPO = 24h, RTO = 1h.
