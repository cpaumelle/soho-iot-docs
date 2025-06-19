# PostgreSQL Schema Overview

## Databases

| Name        | Used By          |
|-------------|------------------|
| device_db   | Device Manager   |
| ingest      | Ingest Service   |

## Schemas & Tables

| Database    | Schema   | Table             | Purpose                                |
|-------------|----------|------------------|----------------------------------------|
| device_db   | devices  | device_types      | Decoder reference definitions          |
|             | devices  | devices           | DevEUI and location associations       |
|             | devices  | uplinks           | Decoded uplink payloads                |
|             | devices  | sites, rooms, floors, zones | Location hierarchy        |
| ingest      | public   | raw_uplinks       | Raw payloads from Actility/gateways    |

## Planned Schema Consolidation

| Schema      | Purpose                    |
|-------------|----------------------------|
| ingestion   | Raw device data            |
| devices     | Registry and twinning      |
| processing  | Enriched payloads          |
| analytics   | Aggregates and alerts      |
| system      | Configuration & auth       |
