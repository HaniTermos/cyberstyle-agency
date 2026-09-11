#!/bin/bash
# ==============================================================================
# CYBERSTYLE LLC - PostgreSQL Automated Nightly Backup Script
# ==============================================================================
set -e

BACKUP_DIR="/var/backups/cyberstyle/postgres"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/cyberstyle_db_${TIMESTAMP}.sql.gz"
RETENTION_DAYS=14

mkdir -p "${BACKUP_DIR}"

echo "📦 Starting PostgreSQL database backup for CYBERSTYLE..."

# Dump and gzip database directly from docker container
docker exec cyberstyle_postgres_prod pg_dump -U postgres cyberstyle_db | gzip > "${BACKUP_FILE}"

echo "✅ Backup created successfully at: ${BACKUP_FILE}"
echo "📏 Size: $(du -sh ${BACKUP_FILE} | cut -f1)"

# Rotate old backups older than retention policy
echo "🧹 Pruning backups older than ${RETENTION_DAYS} days..."
find "${BACKUP_DIR}" -name "cyberstyle_db_*.sql.gz" -type f -mtime +${RETENTION_DAYS} -delete

echo "🎉 Backup operation completed."
