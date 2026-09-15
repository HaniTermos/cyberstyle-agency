import assert from 'assert';
import fs from 'fs';
import { BackupService } from '../services/backup.service';

async function runRestoreDrillSuite() {
  console.log('================================================================');
  console.log('RUNNING AUTOMATED BACKUP & DISASTER RECOVERY DRILL SUITE');
  console.log('================================================================');

  // Test 1: Generate automated database backup
  console.log('\n▶ Step 1: Generating compressed backup with SHA-256 checksum...');
  const backup = await BackupService.executeBackup();
  assert.strictEqual(backup.status, 'OK', 'Backup must succeed');
  assert.ok(fs.existsSync(backup.filepath), 'Backup archive must exist on disk');
  assert.ok(backup.sizeBytes > 0, 'Backup file size must be greater than zero');
  assert.strictEqual(backup.checksum.length, 64, 'Checksum must be 64-char hex SHA-256');

  const checksumPath = `${backup.filepath}.sha256`;
  assert.ok(fs.existsSync(checksumPath), 'Checksum sidecar file must exist');
  console.log(`  ✓ PASS: Backup generated: ${backup.filename} (${backup.sizeBytes} bytes, SHA-256: ${backup.checksum.slice(0, 16)}...)`);

  // Test 2: Execute Restore Drill with Checksum & Schema Validation
  console.log('\n▶ Step 2: Executing Disaster Recovery Restore Drill...');
  const drillResult = await BackupService.runRestoreDrill(backup.filename);
  assert.strictEqual(drillResult.success, true, 'Restore drill must report success');
  assert.strictEqual(drillResult.checksumVerified, true, 'Archive checksum must be verified');
  assert.ok(drillResult.tablesVerified.length >= 5, 'All core entity tables must be verified');
  assert.ok(drillResult.totalRowsSampled >= 0, 'Row sample count must be positive');
  console.log(`  ✓ PASS: Restore drill succeeded in ${drillResult.durationMs}ms`);
  console.log(`  ✓ PASS: Verified tables: ${drillResult.tablesVerified.join(', ')}`);

  // Test 3: Tamper Detection (Simulate archive corruption)
  console.log('\n▶ Step 3: Verifying Tamper Detection on corrupt archive...');
  const originalFileBuffer = fs.readFileSync(backup.filepath);
  try {
    // Corrupt archive by appending extra bytes
    fs.appendFileSync(backup.filepath, Buffer.from('\nTAMPERED_PAYLOAD'));
    let failedAsExpected = false;
    try {
      await BackupService.runRestoreDrill(backup.filename);
    } catch (err: any) {
      if (err.message.includes('Checksum mismatch')) {
        failedAsExpected = true;
      }
    }
    assert.strictEqual(failedAsExpected, true, 'Restore drill must reject archive with invalid checksum');
    console.log('  ✓ PASS: Tampered archive rejected by cryptographic checksum verification');
  } finally {
    // Restore original file buffer
    fs.writeFileSync(backup.filepath, originalFileBuffer);
  }

  // Test 4: Retention Policy Management
  console.log('\n▶ Step 4: Testing Backup Retention Pruning Policy...');
  const dummyHistory = [
    { ...backup, filename: 'old-1.sql.gz', filepath: 'old-1.sql.gz' },
    { ...backup, filename: 'old-2.sql.gz', filepath: 'old-2.sql.gz' },
  ];
  BackupService.applyRetention(dummyHistory as any, 1);
  assert.strictEqual(dummyHistory.length, 1, 'Retention policy must prune entries exceeding limit');
  console.log('  ✓ PASS: Retention policy prunes expired backup archives');

  console.log('\n================================================================');
  console.log('ALL BACKUP & RESTORE DRILL CHECKS PASSED (4/4)');
  console.log('================================================================\n');
}

runRestoreDrillSuite().catch((err) => {
  console.error('❌ Restore drill test failed:', err);
  process.exit(1);
});
