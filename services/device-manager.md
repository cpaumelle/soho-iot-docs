# Device Manager Service

## Overview

FastAPI-based backend service for managing device metadata, locations, decoding, and uplinks.

## Key Endpoints

- `/v1/devices/api/summary` — Dashboard overview
- `/v1/devices/api/uplinks` — Recent uplinks

## Reverse Proxy

Handled via Caddy:
```
route /api/device-manager* {
    rewrite /api/device-manager(.*) /v1/devices/api$1
    reverse_proxy device-manager-device-server-1:9000
}
```

## Vue UI Fetch

```js
const res = await fetch("/api/device-manager/summary");
```

File path: `~/iot/frontend/soho-iot-ui/src/views/DashboardView.vue`
