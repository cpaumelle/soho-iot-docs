# SOHO IoT Platform - Version 0.1

## Overview

This is the baseline working version of the SOHO IoT platform including:

- Backend FastAPI device manager service with Location management (Sites, Floors, Rooms, Zones)
- Frontend Vue 3 SPA with Locations Manager UI and Device Dashboard
- PostgreSQL database with schema supporting locations and devices

## Backend - Device Manager API

- Code location: backend-app/
- API root prefix: /v1
- Main endpoints:
  - GET /sites - List sites with nested floors, rooms, zones
  - POST /sites - Create a new site
  - PUT /sites/{id} - Update site
  - DELETE /sites/{id} - Delete site
  - Similar CRUD for floors, rooms, zones (some endpoints to be added)
- Uses SQLAlchemy ORM with schema in models.py and pydantic schemas in schemas.py

## Frontend - Vue 3 SPA

- Code location: frontend-ui/
- Uses Vue 3 Composition API with composables/useLocations.js for location state and API calls
- Main UI components:
  - Locations.vue - Location Manager UI with nested hierarchy and CRUD modals
  - Dashboard.vue - Device status overview (basic)
- Routes defined in router/index.js

## Database

- PostgreSQL schema named "devices"
- Tables: sites, floors, rooms, zones, devices, uplinks, device_types, etc.
- Database connection configured in backend-app/database.py

## Development Notes

- Latitude/Longitude fields must be float types in Pydantic schemas to avoid API validation errors
- Locations API returns nested objects to facilitate frontend rendering of the hierarchy
- Frontend uses fetch API for CRUD operations, updates local reactive state accordingly

## Next Steps

- Complete CRUD API for floors, rooms, zones
- Enhance frontend UI for full CRUD functionality on all location levels
- Add device assignment to zones and related UI
- Optimize styling and user experience

---

Backup timestamp: 2025-06-19 17:29 UTC

