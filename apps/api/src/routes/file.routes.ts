import { Router, Request, Response, NextFunction } from 'express';
import { FileSecurityService } from '../services/file-security.service';
import { standardLimiter } from '../middleware/rateLimiter';
import fs from 'fs';

const router = Router();

/**
 * @route   GET /api/files/download/:token
 * @desc    Authorized, expiring signed download endpoint for files
 */
router.get('/download/:token', standardLimiter, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.params;

    if (!token) {
      res.status(400).json({ status: 'error', code: 'TOKEN_REQUIRED', message: 'Signed token is required.' });
      return;
    }

    // 1. Verify token HMAC signature and expiration
    const verification = FileSecurityService.verifySignedDownloadToken(token);
    if (!verification.isValid || !verification.fileAssetId) {
      res.status(403).json({
        status: 'error',
        code: 'INVALID_OR_EXPIRED_SIGNATURE',
        message: verification.error || 'Signed download URL is invalid or has expired.',
      });
      return;
    }

    // 2. Resolve file path and version
    const resolved = await FileSecurityService.resolveFileForDownload(
      verification.fileAssetId,
      verification.versionId
    );

    // 3. Log download action
    await FileSecurityService.logFileAccess({
      fileAssetId: resolved.fileAsset.id,
      fileVersionId: resolved.version.id,
      action: 'DOWNLOAD',
      req,
    });

    // 4. Stream file with proper headers
    res.setHeader('Content-Type', resolved.mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${resolved.filename}"`);
    res.setHeader('Content-Length', resolved.sizeBytes);
    res.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate');

    const stream = fs.createReadStream(resolved.filePath);
    stream.pipe(res);
  } catch (error: any) {
    if (error.message?.includes('Access denied') || error.message?.includes('quarantined')) {
      res.status(403).json({ status: 'error', code: 'FORBIDDEN', message: error.message });
      return;
    }
    if (error.message?.includes('not found')) {
      res.status(404).json({ status: 'error', code: 'NOT_FOUND', message: error.message });
      return;
    }
    next(error);
  }
});

export default router;
