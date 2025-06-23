# API Reference - SOHO IoT Platform

This document provides a **verified and tested** reference for the key API endpoints exposed by the SOHO IoT platform services.

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

### Device Management

#### `GET /v1/devices`
- **Description**: Get all devices with computed status and location information
- **Query Parameters**:
  - `status` (string): Filter by status (CONFIGURED, NEEDS_LOCATION, NEEDS_SETUP, ORPHAN, DECOMMISSIONED)
  - `limit` (int): Maximum number of devices to return (default: 100)
  - `offset` (int): Number of devices to skip (default: 0)
- **Returns**: Array of device objects with computed status

#### `GET /v1/devices/{deveui}`
- **Description**: Get single device by DevEUI
- **Returns**: Device object with full details

#### `PUT /v1/devices/{deveui}`
- **Description**: Update device name and metadata
- **Payload**:
```json
{
  "name": "Device Name",
  "device_type_id": 1,
  "status": "CONFIGURED"
}
```

#### `PUT /v1/devices/{deveui}/location`
- **Description**: Assign device to a location (zone)
- **Payload**:
```json
{
  "zone_id": 1
}
```

### Device Types

#### `GET /v1/device-types`
- **Description**: Get all device types
- **Returns**: Array of device type objects

### Location Management

#### `GET /v1/locations/hierarchy`
- **Description**: Get complete location hierarchy for all sites
- **Returns**: Array of sites with nested floors, rooms, and zones
- **Status**: ✅ **WORKING**

#### `GET /v1/sites`
- **Description**: Get all sites (including archived)
- **Returns**: Array of site objects
- **Status**: ✅ **WORKING**

#### `GET /v1/sites/{site_id}`
- **Description**: Get individual site details
- **Returns**: Site object
- **Status**: ✅ **WORKING**

#### `PUT /v1/sites/{site_id}`
- **Description**: Update site details including archive functionality
- **Payload**:
```json
{
  "name": "Site Name",
  "address": "Site Address",
  "archived_at": null
}
```
- **Status**: ✅ **WORKING**

#### `GET /v1/zones`
- **Description**: Get all zones with full location context
- **Returns**: Array of zones with full path information
- **Status**: ✅ **WORKING**

### Location Creation (CRUD - Create Only)

#### `POST /v1/locations/floor`
- **Description**: Create a new floor
- **Payload**:
```json
{
  "name": "Floor Name",
  "site_id": 1
}
```
- **Returns**: `{"id": 2, "name": "Floor Name", "site_id": 1, "message": "Floor created successfully"}`
- **Constraints**: Unique constraint on (name, site_id)
- **Status**: ✅ **WORKING**

#### `POST /v1/locations/room`
- **Description**: Create a new room
- **Payload**:
```json
{
  "name": "Room Name",
  "floor_id": 1
}
```
- **Returns**: `{"id": 4, "name": "Room Name", "floor_id": 1, "message": "Room created successfully"}`
- **Status**: ✅ **WORKING**

#### `POST /v1/locations/zone`
- **Description**: Create a new zone
- **Payload**:
```json
{
  "name": "Zone Name",
  "room_id": 1
}
```
- **Returns**: `{"id": 3, "name": "Zone Name", "room_id": 1, "message": "Zone created successfully"}`
- **Status**: ✅ **WORKING**

### Summary & Statistics

#### `GET /v1/summary`
- **Description**: Get device summary statistics with computed status counts
- **Returns**: Object with device counts by status
- **Status**: ✅ **WORKING**

---

## 🚧 Missing/Not Implemented Endpoints

### Location Updates & Deletion
- `PUT /v1/locations/floors/{id}` - ❌ **404 Not Found**
- `PUT /v1/locations/rooms/{id}` - ❌ **404 Not Found**  
- `PUT /v1/locations/zones/{id}` - ❌ **404 Not Found**
- `DELETE /v1/locations/floors/{id}` - ❌ **Not Available**
- `DELETE /v1/locations/rooms/{id}` - ❌ **Not Available**
- `DELETE /v1/locations/zones/{id}` - ❌ **Not Available**

### Legacy Endpoints (From Original Documentation)
- `GET /v1/devices/api/summary` - ❌ **404 Not Found**
- `GET /v1/devices/api/device-types` - ❌ **404 Not Found**
- `POST /v1/devices/api/twin` - ❌ **404 Not Found**

---

## 🔐 Authentication

Currently, the development environment has **no authentication** enabled. Production should implement token-based authentication (e.g., JWT or API key headers) for all endpoints under `/v1`.

---

## 📦 Sample Usage

### Get All Devices with Status
```bash
curl -s "https://api.verdegris.eu/v1/devices" | jq
```

### Get Location Hierarchy
```bash
curl -s "https://api.verdegris.eu/v1/locations/hierarchy" | jq
```

### Create a New Floor
```bash
curl -X POST https://api.verdegris.eu/v1/locations/floor \
  -H "Content-Type: application/json" \
  -d '{"name": "Second Floor", "site_id": 1}'
```

### Create a New Room
```bash
curl -X POST https://api.verdegris.eu/v1/locations/room \
  -H "Content-Type: application/json" \
  -d '{"name": "Conference Room", "floor_id": 1}'
```

### Create a New Zone
```bash
curl -X POST https://api.verdegris.eu/v1/locations/zone \
  -H "Content-Type: application/json" \
  -d '{"name": "Meeting Area", "room_id": 1}'
```

### Assign Device to Location
```bash
curl -X PUT https://api.verdegris.eu/v1/devices/58A0CB000010162C/location \
  -H "Content-Type: application/json" \
  -d '{"zone_id": 1}'
```

---

## 🧾 Response Samples

### `/v1/devices` Response
```json
[
  {
    "deveui": "58A0CB000010162C",
    "name": null,
    "status": "CONFIGURED",
    "device_type": "Browan TBHH100",
    "location": {
      "zone": "Fridge",
      "room": "Kitchen", 
      "floor": "Ground Floor",
      "site": "Dinard"
    }
  }
]
```

### `/v1/locations/hierarchy` Response
```json
[
  {
    "id": 1,
    "name": "Dinard",
    "address": "17 rue du Bois Met, 35800 Dinard, France",
    "floors": [
      {
        "id": 1,
        "name": "Ground Floor",
        "rooms": [
          {
            "id": 1,
            "name": "Kitchen",
            "zones": [
              {
                "id": 1,
                "name": "Fridge"
              }
            ]
          }
        ]
      }
    ]
  }
]
```

### `/v1/summary` Response
```json
{
  "device_counts": {
    "configured": 1,
    "needs_location": 3,
    "needs_setup": 8,
    "orphan": 2,
    "decommissioned": 0
  },
  "total_devices": 14,
  "uplinks_24h": 45,
  "last_uplink": {
    "deveui": "58A0CB000010162C",
    "timestamp": "2025-06-23T12:45:00"
  }
}
```

---

## ⚠️ Important Notes

- **Computed Status System**: Device status is now automatically computed based on configuration (device type + location assignment)
- **Database Constraints**: Floor names must be unique per site
- **Error Handling**: APIs return descriptive error messages for constraint violations
- **Location Hierarchy**: Full CRUD only available for Sites. Floors/Rooms/Zones support CREATE only
- **No Authentication**: Development environment has no auth requirements

---

## 🔮 Roadmap - Endpoints to Implement

To complete the location management system, these endpoints should be added:

```
PUT /v1/locations/floors/{id}    - Update floor name
PUT /v1/locations/rooms/{id}     - Update room name  
PUT /v1/locations/zones/{id}     - Update zone name
DELETE /v1/locations/floors/{id} - Delete floor (cascade)
DELETE /v1/locations/rooms/{id}  - Delete room (cascade)
DELETE /v1/locations/zones/{id}  - Delete zone
```