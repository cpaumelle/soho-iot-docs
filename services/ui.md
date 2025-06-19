# UI Service (Vue + Vuetify)

## Overview

This service provides the front-end dashboard of the SOHO IoT platform. It is a Vue 3 Single Page Application (SPA) using Vuetify for UI components.

## Access Paths

- During development:
  http://localhost:8800/

- In production (planned):
  http://api.verdegris.eu/ → served by Caddy

## Folder Location

- Source code: ~/iot/frontend/soho-iot-ui/

## Dockerized Version

- Container name: soho-iot-ui
- Defined in: api-gateway/docker-compose.yml
- Served behind: iot-api-gateway (Caddy)

## Notes

- Dev workflow: npm run serve
- Production: Caddy to serve dist/ build
