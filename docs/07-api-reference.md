# API Reference

This document provides a concise reference for the key API endpoints exposed by the SOHO IoT platform services.

---

## Ingest Server API (`ingest-server`, Port **8000**)

### `POST /uplink`

- **Description**: Accepts a decoded or encoded LoRa uplink payload.
- **Query Parameters**:
  - `LrnDevEui` (string): Device EUI
  - `LrnFPort` (int): FPort of the payload
  - `LrnInfos` (string): Network info
  - `AS_ID` (string): Actility Server ID
  - `Time` (datetime): Timestamp
  - `Token` (string): Auth token (Actility)
- **Payload** (if applicable): Raw or pre-decoded JSON

### `GET /health`

- **Description**: Health check endpoint
- **Returns**: 200 OK if service is up

---

## Device Manager API (`device-manager`, Port **9000**)

### `GET /v1/devices/api/summary`

- **Description**: Summary of devices and their uplink activity
- **Returns**: JSON object with counts and status

### `GET /v1/devices/api/uplinks`

- **Description**: Fetch recent uplinks from known devices
- **Query Parameters**:
  - `limit` (int): Max number of results (default: 20)
  - `skip` (int): Number of records to skip (for pagination)

### `GET /v1/devices/api/orphans`

- **Description**: List devices not mapped to a location

### `GET /v1/devices/api/device-types`

- **Description**: Fetch all device types and their decoder metadata

### `POST /v1/devices/api/device-types`

- **Description**: Add a new device type
- **Payload**:

```json
{
  "name": "Browan TBHH100",
  "device_family": "Environment",
  "icon_name": "🌡️",
  "unpacker_module_name": "browan_env",
  "unpacker_function_name": "decode_env"
}
```

### `POST /v1/devices/api/twin`

- **Description**: Assign a device to a location, type, and gateway
- **Payload**:

```json
{
  "deveui": "0004A30B00FB6713",
  "device_type_id": 1,
  "location1": "FR",
  "location2": "Rennes",
  "location3": "Meeting Room 2",
  "last_gateway": "ttn-gateway-33"
}
```

---

## 🔐 Authentication

Currently, the development environment has **no authentication** enabled. Production should implement token-based authentication (e.g., JWT or API key headers) for all endpoints under `/v1`.

---

## 📦 Sample Usage

### `POST /uplink` (Ingest Server)

```bash
curl -X POST "https://ingest.verdegris.eu/uplink?LrnDevEui=0004A30B00FB6713&LrnFPort=1&LrnInfos=info&AS_ID=as1&Time=2025-06-19T12:00:00Z&Token=xyz" \
  -H "Content-Type: application/json" \
  -d '{"decoded": {"temperature": 23.5}}'
```

### `GET /v1/devices/api/uplinks` (Device Manager)

```bash
curl -s "https://api.verdegris.eu/v1/devices/api/uplinks?limit=10" | jq
```

### `POST /v1/devices/api/twin`

```bash
curl -X POST https://api.verdegris.eu/v1/devices/api/twin \
  -H "Content-Type: application/json" \
  -d '{
        "deveui": "0004A30B00FB6713",
        "device_type_id": 1,
        "location1": "FR",
        "location2": "Rennes",
        "location3": "Meeting Room 2",
        "last_gateway": "ttn-gateway-33"
      }'
```

---

## 🧾 Response Samples

### `/summary`

```json
{
  "device_count": 23,
  "active_devices": 18,
  "orphan_devices": 5,
  "last_seen": "2025-06-23T12:45:00"
}
```

### `/uplinks`

```json
[
  {
    "deveui": "0004A30B00FB6713",
    "timestamp": "2025-06-23T12:00:00",
    "payload_raw": "016A0DFF...",
    "decoded": {
      "temperature": 22.4,
      "humidity": 56
    }
  }
]
```

---

## Notes

- All endpoints respond with `application/json`
- Authentication is currently disabled in the dev setup
- Additional endpoints for schema validation, payload debugging, and admin control will be added soon