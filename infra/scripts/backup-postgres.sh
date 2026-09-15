#!/bin/bash
# ==============================================================================
# CYBERSTYLE LLC - PostgreSQL Automated Production Backup Script
# Features: Gzip compression, SHA-256 Checksum, Retention Pruning (Daily & Weekly)
# ==============================================================================
set -euo pipefail

BACKUP_DIR="${BACKUP_DIR:-/var/backups/cyberstyle/postgres}"
CONTAINER_NAME="${DB_CONTAINER:-cyberstyle_postgres_prod}"
DB_NAME="${DB_NAME:-cyberstyle_db}"
DB_USER="${DB_USER:-postgres}"

TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/cyberstyle_db_${TIMESTAMP}.sql.gz"
CHECKSUM_FILE="${BACKUP_FILE}.sha256"
RETENTION_DAYS="${RETENTION_DAYS:-14}"

mkdir -p "${BACKUP_DIR}"

echo "📦 [$(date -Iseconds)] Starting PostgreSQL database backup for CYBERSTYLE..."

# 1. Dump and gzip database from Docker container or local pg_dump
if docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
  docker exec -t "${CONTAINER_NAME}" pg_dump -U "${DB_USER}" "${DB_NAME}" | gzip > "${BACKUP_FILE}"
else
  echo "⚠️ Container ${CONTAINER_NAME} not running directly. Running pg_dump via local connection..."
  pg_dump -U "${DB_USER}" "${DB_NAME}" | gzip > "${BACKUP_FILE}"
fi

# 2. Compute SHA-256 Checksum
if command -v sha256sum >/dev/null 2>&1; then
  sha256sum "${BACKUP_FILE}" > "${CHECKSUM_FILE}"
elif command -v shasum >/dev/null 2>&1; then
  shasum -a 256 "${BACKUP_FILE}" > "${CHECKSUM_FILE}"
else
  openssl dgst -sha256 "${BACKUP_FILE}" | awk '{print $NF}' > "${CHECKSUM_FILE}"
fi

FILE_SIZE=$(wc -c < "${BACKUP_FILE}" | tr -d ' ')
CHECKSUM_VAL=$(head -n 1 "${CHECKSUM_FILE}" | awk '{print $1}')

echo "✅ Backup created successfully at: ${BACKUP_FILE}"
echo "📏 Size: ${FILE_SIZE} bytes"
echo "🔒 SHA-256: ${CHECKSUM_VAL}"

# 3. Retention policy: Prune daily archives older than configured retention period
echo "🧹 Pruning backups older than ${RETENTION_DAYS} days..."
find "${BACKUP_DIR}" -name "cyberstyle_db_*.sql.gz" -type f -mtime +"${RETENTION_DAYS}" -exec rm -f {} +
find "${BACKUP_DIR}" -name "cyberstyle_db_*.sql.gz.sha256" -type f -mtime +"${RETENTION_DAYS}" -exec rm -f {} +

echo "🎉 [$(date -Iseconds)] Backup operation completed successfully."
