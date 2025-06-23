# Service: Adminer Config

## Overview
This folder contains the core Adminer PHP files that power the database UI.

## Components
- **adminer.php** – Single-file PHP application for database management  
- **index.php** – Wrapper or redirect to `adminer.php` for cleaner URLs

## File Details
| File          | Purpose                                  |
|---------------|------------------------------------------|
| `adminer.php` | Main Adminer application (downloaded from https://www.adminer.org) |
| `index.php`   | Entrypoint to load Adminer and apply customizations |

## Customization
- Place any additional Adminer plugins or custom CSS/JS alongside `adminer.php`  
- Modify `index.php` to set default server or apply request filtering  

## Deployment
- Mounted into Caddy container at `/var/www/html`  
- Permissions: ensure files are readable by Caddy (e.g., `chmod 644 adminer.php`)

## Commands & Snippets
```bash
# Check file permissions
ls -l adminer.php index.php

# Update Adminer to latest version
curl -o adminer.php https://www.adminer.org/latest.php
