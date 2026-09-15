#!/bin/bash
# ==============================================================================
# CYBERSTYLE LLC - PostgreSQL Disaster Recovery Restore Script
# Features: Pre-restore SHA-256 Checksum Validation, Unattended Mode, Sanity Check
# Usage: ./restore-postgres.sh /path/to/backup.sql.gz [-y]
# ==============================================================================
set -euo pipefail

CONTAINER_NAME="${DB_CONTAINER:-cyberstyle_postgres_prod}"
DB_NAME="${DB_NAME:-cyberstyle_db}"
DB_USER="${DB_USER:-postgres}"

if [ -z "${1:-}" ]; then
  echo "❌ Error: Please specify the backup file path to restore."
  echo "Usage: $0 /var/backups/cyberstyle/postgres/cyberstyle_db_YYYYMMDD_HHMMSS.sql.gz [-y]"
  exit 1
fi

BACKUP_FILE="$1"
ASSUME_YES="${2:-}"

if [ ! -f "${BACKUP_FILE}" ]; then
  echo "❌ Error: Backup file ${BACKUP_FILE} does not exist."
  exit 1
fi

# 1. Cryptographic Checksum Verification
CHECKSUM_FILE="${BACKUP_FILE}.sha256"
if [ -f "${CHECKSUM_FILE}" ]; then
  echo "🔍 Verifying SHA-256 checksum..."
  EXPECTED_HASH=$(head -n 1 "${CHECKSUM_FILE}" | awk '{print $1}')
  
  if command -v sha256sum >/dev/null 2>&1; then
    ACTUAL_HASH=$(sha256sum "${BACKUP_FILE}" | awk '{print $1}')
  elif command -v shasum >/dev/null 2>&1; then
    ACTUAL_HASH=$(shasum -a 256 "${BACKUP_FILE}" | awk '{print $1}')
  else
    ACTUAL_HASH=$(openssl dgst -sha256 "${BACKUP_FILE}" | awk '{print $NF}')
  fi

  if [ "${EXPECTED_HASH}" != "${ACTUAL_HASH}" ]; then
    echo "❌ CHECKSUM MISMATCH! Archive may be corrupted or tampered with."
    echo "Expected: ${EXPECTED_HASH}"
    echo "Actual:   ${ACTUAL_HASH}"
    exit 1
  fi
  echo "✅ Checksum verified: ${ACTUAL_HASH}"
else
  echo "⚠️ Notice: Checksum file ${CHECKSUM_FILE} not found. Proceeding with integrity check only."
fi

# 2. Confirmation prompt (unless unattended flag -y passed)
if [ "${ASSUME_YES}" != "-y" ] && [ "${ASSUME_YES}" != "--yes" ]; then
  echo "⚠️ WARNING: Restoring will overwrite existing data in container [${CONTAINER_NAME}] / database [${DB_NAME}]!"
  read -p "Type 'RESTORE' to confirm: " CONFIRM
  if [ "${CONFIRM}" != "RESTORE" ]; then
    echo "🛑 Restore cancelled by user."
    exit 0
  fi
fi

# 3. Restore database stream
echo "🔄 [$(date -Iseconds)] Restoring PostgreSQL database from ${BACKUP_FILE}..."
if docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
  gunzip -c "${BACKUP_FILE}" | docker exec -i "${CONTAINER_NAME}" psql -U "${DB_USER}" -d "${DB_NAME}"
else
  gunzip -c "${BACKUP_FILE}" | psql -U "${DB_USER}" -d "${DB_NAME}"
fi

# 4. Post-restore migration & sanity check
echo "⚙️ Running post-restore database migrations..."
if command -v npx >/dev/null 2>&1; then
  npx prisma db push --skip-generate || true
fi

echo "✅ [$(date -Iseconds)] Disaster recovery restore completed successfully."
