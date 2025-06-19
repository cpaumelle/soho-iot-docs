# CHANGELOG

## [2025-06-19]
### Added
- Merged v32 and v34 documentation into markdown files
- Documented Caddy, Adminer, and Vue-based UI services
- Confirmed port mappings for all containers in production

### Improved
- Removed legacy networks and volumes: `device-manager-dev_*`, `soho-iot-ui_*`
- Archived `twinning-dev` folder and removed stale `index.php`
- Cleaned and aligned container naming across layers

### Pending
- Add full description of processing and analytics layers (planned)
- Clarify use of `frontend/` vs. Dockerized UI build
