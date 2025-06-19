# Device Manager Service

## Overview

FastAPI-based backend managing:
- Device metadata
- Location twinning
- Decoding logic
- Uplink storage

## API Base Path

/v1/devices/api

## API Endpoints

| Method | Path                | Purpose                        |
|--------|---------------------|--------------------------------|
| GET    | /device-types       | List known device types        |
| GET    | /orphans            | Devices not yet twinned        |
| GET    | /locations          | Get all locations              |
| POST   | /locations          | Add a new location             |
| PUT    | /locations/{id}     | Update an existing location    |
| DELETE | /locations/{id}     | Delete a location              |
| GET    | /debug/search-path  | Show current DB search_path    |

## Environment Variables (example)

POSTGRES_USER=iot  
POSTGRES_PASSWORD=secret  
POSTGRES_DB=device_db  
POSTGRES_HOST=device-manager-postgres-1

## UI Access (Development)

- /static/       → Bootstrap-based UI
- /twinning/     → Device twinning interface
