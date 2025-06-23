# Backups



## Backups
- **backups/**  
  - Daily snapshots in `YYYY-MM-DD_HH-MM-SS`  
  - Retention: last 14 days  
- **backup-YYYYMMDD-*** – full-server archives

**Procedures**
1. Rotate: automatic daily cron at 02:00 UTC  
2. Restore: `restore.sh backups/YYYY-MM-DD_HH-MM-SS`  
3. Archive storage: `/mnt/archives/`

