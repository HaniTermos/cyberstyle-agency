import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { prisma } from '../config/db';
import { env } from '../config/env';
import { ScanState, FileFolder, FileVisibility, UserRole } from '@prisma/client';
import { logAudit } from '../utils/auditLogger';

// ==============================================================================
// FILE SECURITY CONSTANTS & CONFIGURATION
// ==============================================================================

export const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50 MB
export const SIGNED_URL_TTL_SECONDS = 300; // 5 minutes

// Blocked executable and dangerous script extensions
export const BLOCKED_EXTENSIONS = new Set([
  '.exe', '.bat', '.cmd', '.sh', '.bash', '.ps1', '.vbs', '.vbe',
  '.js', '.jse', '.wsf', '.wsh', '.msc', '.msi', '.msp', '.scr',
  '.hta', '.cpl', '.jar', '.reg', '.dll', '.sys', '.drv', '.com',
  '.pif', '.php', '.phtml', '.py', '.rb', '.pl', '.cgi', '.asp', '.aspx',
]);

// Magic byte signatures for verified MIME types
const MAGIC_SIGNATURES: { mime: string; bytes: number[] }[] = [
  { mime: 'image/jpeg', bytes: [0xFF, 0xD8, 0xFF] },
  { mime: 'image/png', bytes: [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A] },
  { mime: 'image/gif', bytes: [0x47, 0x49, 0x46, 0x38] },
  { mime: 'image/webp', bytes: [0x52, 0x49, 0x46, 0x46] }, // RIFF header
  { mime: 'application/pdf', bytes: [0x25, 0x50, 0x44, 0x46] }, // %PDF
  { mime: 'application/zip', bytes: [0x50, 0x4B, 0x03, 0x04] }, // PK..
  { mime: 'application/x-zip-compressed', bytes: [0x50, 0x4B, 0x03, 0x04] },
];

export const VALID_FOLDERS: FileFolder[] = [
  FileFolder.PROJECT_PLAN,
  FileFolder.DESIGN_REVIEW,
  FileFolder.CONTENT_BRAND,
  FileFolder.PREVIEWS,
  FileFolder.INVOICES_AGREEMENTS,
  FileFolder.LAUNCH_HANDOVER,
  FileFolder.ARCHIVE,
];

// Disallowed client directory terms (protect secrets, exports, repos)
const DISALLOWED_CLIENT_PATH_KEYWORDS = [
  'backup', 'secret', 'production_export', 'database_dump', 'credentials', '.env', '.git',
];

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
  detectedMime?: string;
  sanitizedFilename: string;
}

export interface UploadFileInput {
  organizationId: string;
  projectId?: string;
  uploaderId: string;
  filename: string;
  buffer: Buffer;
  folder?: FileFolder;
  visibility?: FileVisibility;
  existingAssetId?: string; // If creating a new version of existing asset
}

export class FileSecurityService {
  private static baseStorageDir = path.resolve(process.cwd(), 'uploads');
  private static quarantineDir = path.resolve(process.cwd(), 'uploads', 'quarantine');
  private static cleanDir = path.resolve(process.cwd(), 'uploads', 'clean');
  private static rejectedDir = path.resolve(process.cwd(), 'uploads', 'rejected');
  private static secretKey = env.SESSION_SECRET;

  /**
   * Ensure directories exist on startup
   */
  static async initStorage() {
    await fs.mkdir(this.quarantineDir, { recursive: true });
    await fs.mkdir(this.cleanDir, { recursive: true });
    await fs.mkdir(this.rejectedDir, { recursive: true });
  }

  /**
   * 1. Quarantine & Security Validation
   */
  static validateUpload(filename: string, buffer: Buffer): FileValidationResult {
    // 1. Check size
    if (buffer.length === 0) {
      return { isValid: false, error: 'File is empty (0 bytes).', sanitizedFilename: filename };
    }
    if (buffer.length > MAX_FILE_SIZE_BYTES) {
      return { isValid: false, error: `File exceeds maximum allowed size of 50 MB.`, sanitizedFilename: filename };
    }

    // 2. Sanitize filename and check extension
    const baseName = path.basename(filename).replace(/[^a-zA-Z0-9._-]/g, '_');
    const ext = path.extname(baseName).toLowerCase();

    if (!ext || BLOCKED_EXTENSIONS.has(ext)) {
      return { isValid: false, error: `Disallowed file type: "${ext}". Executables and scripts are rejected.`, sanitizedFilename: baseName };
    }

    // 3. Inspect magic bytes for binary formats
    let detectedMime: string | undefined;
    for (const sig of MAGIC_SIGNATURES) {
      if (buffer.length >= sig.bytes.length) {
        let match = true;
        for (let i = 0; i < sig.bytes.length; i++) {
          if (buffer[i] !== sig.bytes[i]) {
            match = false;
            break;
          }
        }
        if (match) {
          detectedMime = sig.mime;
          break;
        }
      }
    }

    // 4. SVG and text security checks (XSS & XXE)
    if (ext === '.svg') {
      const content = buffer.toString('utf-8');
      if (/<script|javascript:|xlink:href="javascript:|<!ENTITY|SYSTEM/i.test(content)) {
        return { isValid: false, error: 'Malicious payload detected in SVG file (potential XSS/XXE).', sanitizedFilename: baseName };
      }
      detectedMime = 'image/svg+xml';
    }

    // 5. Basic Zip-Bomb Protection
    if (ext === '.zip' || detectedMime === 'application/zip') {
      // Check for excessively compressed streams or zip bomb heuristics
      // If compressed size is tiny but declares massive uncompressed header
      if (buffer.length > 1000) {
        // Quick inspection of local file headers
        let uncompressedTotal = 0;
        let fileCount = 0;
        let offset = 0;

        while (offset < buffer.length - 30) {
          if (buffer.readUInt32LE(offset) === 0x04034b50) { // Local file header
            const uncompressedSize = buffer.readUInt32LE(offset + 22);
            uncompressedTotal += uncompressedSize;
            fileCount++;
            if (fileCount > 2000) {
              return { isValid: false, error: 'Archive contains too many entries (zip-bomb defense).', sanitizedFilename: baseName };
            }
            if (uncompressedTotal > 200 * 1024 * 1024) { // Max 200 MB uncompressed
              return { isValid: false, error: 'Archive uncompressed size exceeds maximum allowance (zip-bomb defense).', sanitizedFilename: baseName };
            }
          }
          offset += 4;
        }
      }
    }

    // Fallback MIME if valid
    if (!detectedMime) {
      if (ext === '.txt' || ext === '.md' || ext === '.csv') {
        detectedMime = 'text/plain';
      } else if (ext === '.json') {
        detectedMime = 'application/json';
      } else {
        detectedMime = 'application/octet-stream';
      }
    }

    return {
      isValid: true,
      detectedMime,
      sanitizedFilename: baseName,
    };
  }

  /**
   * 2. Quarantine File & Record Version
   */
  static async quarantineUpload(input: UploadFileInput, req?: any) {
    await this.initStorage();

    // Validate folder taxonomy
    const folder = input.folder && VALID_FOLDERS.includes(input.folder)
      ? input.folder
      : FileFolder.PROJECT_PLAN;

    // Validate against disallowed client folder keywords
    for (const kw of DISALLOWED_CLIENT_PATH_KEYWORDS) {
      if (input.filename.toLowerCase().includes(kw)) {
        throw new Error(`Filename contains protected keyword "${kw}". Sensitive production assets cannot be stored in client folders.`);
      }
    }

    // Run security validation
    const validation = this.validateUpload(input.filename, input.buffer);
    if (!validation.isValid) {
      throw new Error(`Upload rejected: ${validation.error}`);
    }

    // Compute SHA-256 checksum
    const checksum = crypto.createHash('sha256').update(input.buffer).digest('hex');
    const sanitizedName = path.basename(validation.sanitizedFilename).replace(/[^a-zA-Z0-9._-]/g, '_');
    const storageKey = `quarantine_${Date.now()}_${checksum.slice(0, 12)}_${sanitizedName}`;
    const quarantinePath = path.resolve(this.quarantineDir, storageKey);
    if (!quarantinePath.startsWith(path.resolve(this.quarantineDir))) {
      throw new Error('Path traversal detected');
    }

    // Save to quarantine directory
    await fs.writeFile(quarantinePath, input.buffer);

    // Database transaction: create or update FileAsset and create FileVersion
    const result = await prisma.$transaction(async (tx) => {
      let fileAsset;

      if (input.existingAssetId) {
        fileAsset = await tx.fileAsset.findUnique({
          where: { id: input.existingAssetId },
          include: { versions: { orderBy: { versionNumber: 'desc' }, take: 1 } },
        });

        if (!fileAsset) {
          throw new Error('Existing file asset not found for versioning.');
        }

        const nextVersion = fileAsset.currentVersion + 1;

        fileAsset = await tx.fileAsset.update({
          where: { id: input.existingAssetId },
          data: {
            currentVersion: nextVersion,
            filename: validation.sanitizedFilename,
            mimeType: validation.detectedMime || 'application/octet-stream',
            sizeBytes: input.buffer.length,
            storageKey,
            isQuarantined: true,
          },
        });

        const version = await tx.fileVersion.create({
          data: {
            fileAssetId: fileAsset.id,
            versionNumber: nextVersion,
            checksum,
            storageKey,
            filename: validation.sanitizedFilename,
            mimeType: validation.detectedMime || 'application/octet-stream',
            sizeBytes: input.buffer.length,
            scanState: ScanState.PENDING_SCAN,
            uploaderId: input.uploaderId,
          },
        });

        return { fileAsset, version };
      } else {
        fileAsset = await tx.fileAsset.create({
          data: {
            organizationId: input.organizationId,
            projectId: input.projectId || null,
            uploaderId: input.uploaderId,
            filename: validation.sanitizedFilename,
            folder,
            visibility: input.visibility || FileVisibility.CLIENT_VISIBLE,
            isQuarantined: true,
            currentVersion: 1,
            mimeType: validation.detectedMime || 'application/octet-stream',
            sizeBytes: input.buffer.length,
            storageKey,
          },
        });

        const version = await tx.fileVersion.create({
          data: {
            fileAssetId: fileAsset.id,
            versionNumber: 1,
            checksum,
            storageKey,
            filename: validation.sanitizedFilename,
            mimeType: validation.detectedMime || 'application/octet-stream',
            sizeBytes: input.buffer.length,
            scanState: ScanState.PENDING_SCAN,
            uploaderId: input.uploaderId,
          },
        });

        return { fileAsset, version };
      }
    });

    // Log File Access Audit
    await this.logFileAccess({
      fileAssetId: result.fileAsset.id,
      fileVersionId: result.version.id,
      userId: input.uploaderId,
      action: 'UPLOAD',
      req,
    });

    await logAudit({
      userId: input.uploaderId,
      organizationId: input.organizationId,
      action: 'FILE_UPLOAD_QUARANTINED',
      entityType: 'FileAsset',
      entityId: result.fileAsset.id,
      changes: {
        filename: validation.sanitizedFilename,
        version: result.version.versionNumber,
        checksum,
        folder,
        scanState: ScanState.PENDING_SCAN,
      },
      req,
    });

    // Trigger async malware scan
    this.runMalwareScanAsync(result.version.id, quarantinePath, input.buffer);

    return result;
  }

  /**
   * 3. Malware Scanning Engine / Hook
   */
  static async runMalwareScanAsync(versionId: string, filePath: string, buffer: Buffer) {
    try {
      // Check EICAR standard antivirus test signature
      const content = buffer.toString('utf-8');
      const isEicar = content.includes('X5O!P%@AP[4\\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*');

      let newState: ScanState = ScanState.CLEAN;
      let scanReport: any = { scanner: 'Cyberstyle-Heuristic-V1', timestamp: new Date().toISOString() };

      if (isEicar) {
        newState = ScanState.REJECTED;
        scanReport.threat = 'EICAR-Test-Signature-Detected';
      }

      // Update version scan state
      const version = await prisma.fileVersion.findUnique({
        where: { id: versionId },
        include: { fileAsset: true },
      });

      if (!version) return;

      if (newState === ScanState.CLEAN) {
        const cleanKey = `clean_${path.basename(version.storageKey).replace(/^quarantine_/, '')}`;
        const cleanPath = path.resolve(this.cleanDir, cleanKey);
        if (!cleanPath.startsWith(path.resolve(this.cleanDir))) {
          throw new Error('Path traversal detected');
        }
        await fs.rename(filePath, cleanPath).catch(() => {});

        await prisma.fileVersion.update({
          where: { id: versionId },
          data: {
            scanState: ScanState.CLEAN,
            storageKey: cleanKey,
            scanReport,
          },
        });

        await prisma.fileAsset.update({
          where: { id: version.fileAssetId },
          data: {
            isQuarantined: false,
            storageKey: cleanKey,
          },
        });
      } else {
        const rejectedKey = `rejected_${path.basename(version.storageKey).replace(/^quarantine_/, '')}`;
        const rejectedPath = path.resolve(this.rejectedDir, rejectedKey);
        if (!rejectedPath.startsWith(path.resolve(this.rejectedDir))) {
          throw new Error('Path traversal detected');
        }
        await fs.rename(filePath, rejectedPath).catch(() => {});

        await prisma.fileVersion.update({
          where: { id: versionId },
          data: {
            scanState: ScanState.REJECTED,
            storageKey: rejectedKey,
            scanReport,
          },
        });

        await prisma.fileAsset.update({
          where: { id: version.fileAssetId },
          data: {
            isQuarantined: true,
            isDeleted: true,
            storageKey: rejectedKey,
          },
        });
      }

      await this.logFileAccess({
        fileAssetId: version.fileAssetId,
        fileVersionId: version.id,
        action: 'SCAN_STATE_CHANGE',
      });
    } catch (err) {
      console.error('[FileSecurityService] Scan error:', err);
    }
  }

  /**
   * 4. Generate Expiring Signed Download Token
   */
  static generateSignedDownloadToken(fileAssetId: string, versionId?: string, ttlSeconds = SIGNED_URL_TTL_SECONDS): string {
    const expiresAt = Math.floor(Date.now() / 1000) + ttlSeconds;
    const nonce = crypto.randomBytes(8).toString('hex');
    const payload = `${fileAssetId}:${versionId || 'latest'}:${expiresAt}:${nonce}`;
    const hmac = crypto.createHmac('sha256', this.secretKey).update(payload).digest('hex');
    
    // Format: payload_base64.signature
    const base64Payload = Buffer.from(payload).toString('base64url');
    return `${base64Payload}.${hmac}`;
  }

  /**
   * 5. Verify Signed Download Token
   */
  static verifySignedDownloadToken(token: string): { isValid: boolean; fileAssetId?: string; versionId?: string; error?: string } {
    try {
      const [base64Payload, signature] = token.split('.');
      if (!base64Payload || !signature) {
        return { isValid: false, error: 'Malformed signed download token.' };
      }

      const payload = Buffer.from(base64Payload, 'base64url').toString('utf-8');
      const expectedHmac = crypto.createHmac('sha256', this.secretKey).update(payload).digest('hex');

      if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedHmac))) {
        return { isValid: false, error: 'Invalid download signature.' };
      }

      const [fileAssetId, versionId, expiresAtStr] = payload.split(':');
      const expiresAt = parseInt(expiresAtStr ?? '0', 10);

      if (Math.floor(Date.now() / 1000) > expiresAt) {
        return { isValid: false, error: 'Signed download link has expired.' };
      }

      return {
        isValid: true,
        fileAssetId,
        versionId: versionId === 'latest' ? undefined : versionId,
      };
    } catch {
      return { isValid: false, error: 'Failed to verify signed download link.' };
    }
  }

  /**
   * 6. Download Authorized File
   */
  static async resolveFileForDownload(
    fileAssetId: string,
    versionId?: string,
    requestingUser?: { id: string; role: UserRole; organizationId?: string }
  ) {
    const fileAsset = await prisma.fileAsset.findUnique({
      where: { id: fileAssetId },
      include: {
        versions: { orderBy: { versionNumber: 'desc' } },
      },
    });

    if (!fileAsset || fileAsset.isDeleted) {
      throw new Error('File not found or has been deleted.');
    }

    // Role & Tenant Boundary Enforcement
    if (requestingUser) {
      const isStaffOrAdmin = ([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STAFF] as UserRole[]).includes(requestingUser.role);
      
      if (!isStaffOrAdmin) {
        // Client checks
        if (fileAsset.organizationId !== requestingUser.organizationId) {
          throw new Error('Access denied: File belongs to another organization.');
        }
        if (fileAsset.visibility === FileVisibility.INTERNAL_ONLY) {
          throw new Error('Access denied: File is internal staff only.');
        }
      }
    }

    const version = versionId
      ? fileAsset.versions.find((v) => v.id === versionId)
      : fileAsset.versions[0];

    if (!version) {
      throw new Error('Requested file version not found.');
    }

    // Client visibility protection: uncleaned or quarantined files cannot be downloaded by clients
    if (requestingUser && requestingUser.role === UserRole.CLIENT) {
      if (version.scanState !== ScanState.CLEAN) {
        throw new Error('File is currently undergoing security scanning or has been quarantined.');
      }
    }

    // Locate disk file
    let filePath = path.join(this.cleanDir, version.storageKey);
    let exists = await fs.stat(filePath).catch(() => null);

    if (!exists) {
      filePath = path.join(this.quarantineDir, version.storageKey);
      exists = await fs.stat(filePath).catch(() => null);
    }

    if (!exists) {
      filePath = path.join(this.baseStorageDir, version.storageKey);
      exists = await fs.stat(filePath).catch(() => null);
    }

    if (!exists) {
      throw new Error('Physical file could not be located in secure storage.');
    }

    return {
      fileAsset,
      version,
      filePath,
      filename: version.filename,
      mimeType: version.mimeType,
      sizeBytes: version.sizeBytes,
    };
  }

  /**
   * 7. Log File Access Event
   */
  static async logFileAccess(input: {
    fileAssetId: string;
    fileVersionId?: string;
    userId?: string;
    action: string;
    req?: any;
  }) {
    try {
      await prisma.fileAccessLog.create({
        data: {
          fileAssetId: input.fileAssetId,
          fileVersionId: input.fileVersionId || null,
          userId: input.userId || null,
          action: input.action,
          ipAddress: input.req?.ip || null,
          userAgent: input.req?.headers ? input.req.headers['user-agent'] : null,
        },
      });
    } catch (err) {
      console.error('[FileSecurityService] Error recording file access log:', err);
    }
  }
}
