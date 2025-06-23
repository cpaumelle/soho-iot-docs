# SOHO IoT Platform Documentation

A compact, maintainable, and production-ready platform for ingesting, processing, managing, and visualizing IoT data across SOHO (Small Office/Home Office) and SME (Small and Medium-sized Enterprise) environments.

## Table of Contents

* [Purpose](#purpose)
* [Architecture Overview](#architecture-overview)
    * [Containers](#containers)
    * [Proxy & Domains](#proxy--domains)
* [File & Folder Structure](#file--folder-structure)
* [API Endpoints](#api-endpoints)
    * [Ingest Server](#ingest-server)
    * [Device Manager](#device-manager)
* [Environment Variables](#environment-variables)
* [Quick Start](#quick-start)
* [Detailed Service Documentation](#detailed-service-documentation)

## Purpose

This platform is designed to provide a robust and scalable solution for handling IoT data, from initial ingestion to advanced processing, device management, and data visualization. It's built with maintainability in mind, making it suitable for both small-scale deployments and environments requiring more comprehensive data handling.

## Architecture Overview

The SOHO IoT Platform is built using a modular, containerized architecture for flexibility and ease of deployment.

### Containers

| Service          | Purpose                                | Internal Port | Source Folder             |
| :--------------- | :------------------------------------- | :------------ | :------------------------ |
| `ingest-server`  | Public ingest gateway for LoRaWAN payloads | `8000`        | `~/iot/ingest-server/`    |
| `device-manager` | Device CRUD, metadata & decoding logic   | `9000`        | `~/iot/device-manager/`   |
| `reverse-proxy`  | Caddy TLS & routing                    | `80/443`      | `~/iot/unified-caddyfile` |
| `ingest-database`| PostgreSQL for raw uplinks             | `5432`        | `volume ingest-server_pgdata` |
| `device-database`| PostgreSQL for device metadata         | `5432`        | `volume postgres_data`    |

### Proxy & Domains

The platform utilizes a reverse proxy (Caddy) to handle TLS termination and route traffic to the appropriate services.

* `ingest.verdegris.eu` &rarr; `ingest-service:8000`
* `api.verdegris.eu` &rarr; `device-manager:9000`
* `adminer.verdegris.eu` &rarr; `adminer-ui:8080` (assuming you have an Adminer service)
* `app.verdegris.eu` &rarr; static frontend

## File & Folder Structure

The core repository structure is as follows:
