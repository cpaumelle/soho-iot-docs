# PostgreSQL Schema Summary

## Credentials

- Username: `iot`
- Password: `secret` (only in dev; secure via env vars in prod)

## Schemas

- `devices`: main schema for all tables
- `public`: temporary uplinks (to be deprecated)

## Key Tables

- `devices.devices`
- `devices.device_types`
- `devices.uplinks`
- `devices.sites`, `floors`, `rooms`, `zones`
