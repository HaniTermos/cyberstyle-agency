# CYBERSTYLE Platform — Disaster Recovery & Backup Runbook

## 1. Overview & Policy
This runbook governs database backup, retention, cryptographic integrity verification, and disaster recovery procedures for CYBERSTYLE LLC's production and staging environments.

- **Recovery Point Objective (RPO)**: $\le 24$ hours (nightly automated dumps + on-demand pre-deployment snapshots).
- **Recovery Time Objective (RTO)**: $\le 15$ minutes for complete database recovery.
- **Storage Location**: Encrypted local backup directory `/var/backups/cyberstyle/postgres` (or `backups/postgres` in development) mirrored to private S3 bucket.

---

## 2. Backup Architecture & Automation

### Archive Naming & Format
Backups are produced using PostgreSQL dumps compressed via gzip with timestamps:
```text
cyberstyle_db_YYYYMMDD_HHMMSS.sql.gz
cyberstyle_db_YYYYMMDD_HHMMSS.sql.gz.sha256
```

### Cryptographic Checksum
Every backup file is accompanied by a SHA-256 checksum file generated immediately following compression:
```bash
sha256sum cyberstyle_db_20260913_200000.sql.gz > cyberstyle_db_20260913_200000.sql.gz.sha256
```

### Retention Policy
- **Daily Backups**: Kept for 14 calendar days. Older daily archives are pruned automatically by the backup script.
- **Weekly Snapshots**: Captured every Sunday and retained for 8 weeks.
- **Monthly Archives**: Preserved for 12 months for compliance.

---

## 3. Running Backups

### Automated Cron Job (Production Server)
```cron
# Nightly backup at 02:00 UTC
0 2 * * * /opt/cyberstyle/infra/scripts/backup-postgres.sh >> /var/log/cyberstyle-backups.log 2>&1
```

### Manual Trigger via CLI
```bash
# In production Docker environment:
./infra/scripts/backup-postgres.sh

# In local / CI environment via Node runner:
npm run backup --workspace=@cyberstyle/api
```

### Manual Trigger via Admin API
```http
POST /api/monitoring/backups/run
Authorization: Bearer <ADMIN_JWT>
```

---

## 4. Disaster Recovery Restore Procedure

### Step 1: Locate and Validate the Archive
```bash
cd /var/backups/cyberstyle/postgres
ls -la cyberstyle_db_*.sql.gz

# Verify checksum before restoring
sha256sum -c cyberstyle_db_20260913_200000.sql.gz.sha256
```

### Step 2: Execute Restore Script
```bash
# Interactive restore (will prompt for typed confirmation):
./infra/scripts/restore-postgres.sh /var/backups/cyberstyle/postgres/cyberstyle_db_20260913_200000.sql.gz

# Unattended mode (for CI or automated failover):
./infra/scripts/restore-postgres.sh /var/backups/cyberstyle/postgres/cyberstyle_db_20260913_200000.sql.gz -y
```

### Step 3: Run Database Migrations & Sanity Verification
```bash
npx prisma db push --skip-generate
```

### Step 4: Verify Health Endpoint
```bash
curl -f http://localhost:4000/api/health
```

---

## 5. Regular Restore Drill (Operational Verification)

To prove backup integrity without impacting live traffic:
1. Trigger the restore drill runner:
   ```bash
   npm run test:restore --workspace=@cyberstyle/api
   ```
2. The drill runner:
   * Inspects the latest backup archive.
   * Validates the cryptographic SHA-256 hash.
   * Decompresses and verifies critical entity tables (`User`, `ClientOrganization`, `Project`, `Invoice`, `FileAsset`, `EmailTemplate`).
   * Validates database query execution.
   * Records a `RESTORE_DRILL_EXECUTED` audit event in the system audit trail.
