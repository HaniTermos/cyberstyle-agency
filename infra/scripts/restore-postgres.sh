#!/bin/bash
# ==============================================================================
# CYBERSTYLE LLC - PostgreSQL Disaster Recovery Restore Script
# Usage: ./restore-postgres.sh /path/to/backup.sql.gz
# ==============================================================================
set -e

if [ -z "$1" ]; then
  echo "❌ Error: Please specify the backup file path to restore."
  echo "Usage: $0 /var/backups/cyberstyle/postgres/cyberstyle_db_YYYYMMDD_HHMMSS.sql.gz"
  exit 1
fi

BACKUP_FILE="$1"

if [ ! -f "${BACKUP_FILE}" ]; then
  echo "❌ Error: Backup file ${BACKUP_FILE} does not exist."
  exit 1
fi

echo "⚠️ WARNING: This will overwrite the existing database in container [cyberstyle_postgres_prod]!"
read -p "Are you sure you want to continue? (yes/no): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
  echo "🛑 Restore aborted."
  exit 0
fi

echo "🔄 Restoring database from: ${BACKUP_FILE}..."
gunzip -c "${BACKUP_FILE}" | docker exec -i cyberstyle_postgres_prod psql -U postgres -d cyberstyle_db

echo "✅ Database restored successfully."
