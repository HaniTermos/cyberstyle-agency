import { Router, Response, NextFunction } from 'express';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.middleware';
import { standardLimiter } from '../middleware/rateLimiter';
import { MessagingService } from '../services/messaging.service';
import { ThreadStatus, ThreadContextType, MessageType } from '@prisma/client';
import { z } from 'zod';
import fs from 'fs';

const router = Router();

// All messaging endpoints require authentication and rate limiting
router.use(requireAuth);
router.use(standardLimiter);

/**
 * 1. List Threads
 * GET /api/v1/messaging/threads
 */
router.get('/threads', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { organizationId, contextType, contextId, status, limit, cursor } = req.query;

    const result = await MessagingService.listThreads(req.user, {
      organizationId: organizationId ? String(organizationId) : undefined,
      contextType: contextType ? (String(contextType) as ThreadContextType) : undefined,
      contextId: contextId ? String(contextId) : undefined,
      status: status ? (String(status) as ThreadStatus) : undefined,
      limit: limit ? Number(limit) : undefined,
      cursor: cursor ? String(cursor) : undefined,
    });

    res.status(200).json({
      status: 'success',
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
});

/**
 * 2. Create Thread
 * POST /api/v1/messaging/threads
 */
const CreateThreadSchema = z.object({
  organizationId: z.string().optional(),
  title: z.string().min(1).max(150).optional(),
  contextType: z.enum(['LEAD', 'PROJECT', 'INVOICE', 'GENERAL']).optional(),
  contextId: z.string().optional(),
  participantUserIds: z.array(z.string()).optional(),
  initialMessage: z.string().optional(),
  isInternal: z.boolean().optional(),
});

router.post('/threads', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const data = CreateThreadSchema.parse(req.body);

    const thread = await MessagingService.createThread(
      req.user,
      {
        organizationId: data.organizationId,
        title: data.title,
        contextType: data.contextType as ThreadContextType,
        contextId: data.contextId,
        participantUserIds: data.participantUserIds,
        initialMessage: data.initialMessage,
        isInternal: data.isInternal,
      },
      req
    );

    res.status(201).json({
      status: 'success',
      data: { thread },
    });
  } catch (error: any) {
    next(error);
  }
});

/**
 * 3. Export Thread
 * GET /api/v1/messaging/threads/:threadId/export
 */
router.get('/threads/:threadId/export', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const threadId = req.params.threadId as string;
    const exportData = await MessagingService.exportThread(req.user, threadId, req);

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="thread_export_${threadId}.json"`);
    res.status(200).json({
      status: 'success',
      data: exportData,
    });
  } catch (error: any) {
    next(error);
  }
});

/**
 * 4. Get Thread Detail
 * GET /api/v1/messaging/threads/:threadId
 */
router.get('/threads/:threadId', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const threadId = req.params.threadId as string;
    const { limit } = req.query;

    const detail = await MessagingService.getThreadDetail(
      req.user,
      threadId,
      limit ? Number(limit) : 50
    );

    res.status(200).json({
      status: 'success',
      data: detail,
    });
  } catch (error: any) {
    next(error);
  }
});

/**
 * 5. Poll Incremental Messages
 * GET /api/v1/messaging/threads/:threadId/poll?since=<lastMessageId>&limit=50
 */
router.get('/threads/:threadId/poll', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const threadId = req.params.threadId as string;
    const { since, limit } = req.query;

    const pollResult = await MessagingService.pollMessages(
      req.user,
      threadId,
      since ? String(since) : undefined,
      limit ? Number(limit) : 50
    );

    res.status(200).json({
      status: 'success',
      data: pollResult,
    });
  } catch (error: any) {
    next(error);
  }
});

/**
 * 6. Send Message
 * POST /api/v1/messaging/threads/:threadId/messages
 */
const SendMessageSchema = z.object({
  content: z.string().min(1),
  messageType: z.enum(['TEXT', 'SYSTEM', 'FILE']).default('TEXT'),
  fileId: z.string().nullable().optional(),
  isInternal: z.boolean().default(false),
});

router.post('/threads/:threadId/messages', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const threadId = req.params.threadId as string;
    const data = SendMessageSchema.parse(req.body);

    const message = await MessagingService.sendMessage(
      req.user,
      threadId,
      {
        content: data.content,
        messageType: data.messageType as MessageType,
        fileId: data.fileId,
        isInternal: data.isInternal,
      },
      req
    );

    res.status(201).json({
      status: 'success',
      data: { message },
    });
  } catch (error: any) {
    if (error && error.status === 429) {
      res.setHeader('Retry-After', String(error.retryAfter || 60));
      res.status(429).json({
        status: 'error',
        message: error.message,
        retryAfter: error.retryAfter,
      });
      return;
    }
    next(error);
  }
});

/**
 * 7. Edit Message
 * PATCH /api/v1/messaging/threads/:threadId/messages/:messageId
 */
const EditMessageSchema = z.object({
  content: z.string().min(1),
});

router.patch('/threads/:threadId/messages/:messageId', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const threadId = req.params.threadId as string;
    const messageId = req.params.messageId as string;
    const { content } = EditMessageSchema.parse(req.body);

    const updated = await MessagingService.editMessage(req.user, threadId, messageId, content, req);

    res.status(200).json({
      status: 'success',
      data: { message: updated },
    });
  } catch (error: any) {
    next(error);
  }
});

/**
 * 8. Soft Delete Message (Admin Only)
 * DELETE /api/v1/messaging/threads/:threadId/messages/:messageId
 */
router.delete('/threads/:threadId/messages/:messageId', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const threadId = req.params.threadId as string;
    const messageId = req.params.messageId as string;

    const deleted = await MessagingService.softDeleteMessage(req.user, threadId, messageId, req);

    res.status(200).json({
      status: 'success',
      message: 'Message soft-deleted by admin.',
      data: { message: deleted },
    });
  } catch (error: any) {
    next(error);
  }
});

/**
 * 9. Mark Thread Read
 * POST /api/v1/messaging/threads/:threadId/read
 */
router.post('/threads/:threadId/read', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const threadId = req.params.threadId as string;
    const result = await MessagingService.markThreadRead(req.user, threadId);

    res.status(200).json({
      status: 'success',
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
});

/**
 * 10. Close / Reopen Thread (Admin Only)
 * PATCH /api/v1/messaging/threads/:threadId
 */
const UpdateThreadStatusSchema = z.object({
  status: z.enum(['OPEN', 'CLOSED']),
});

router.patch('/threads/:threadId', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const threadId = req.params.threadId as string;
    const { status } = UpdateThreadStatusSchema.parse(req.body);

    const thread = await MessagingService.updateThreadStatus(
      req.user,
      threadId,
      status as ThreadStatus,
      req
    );

    res.status(200).json({
      status: 'success',
      message: `Thread status updated to ${status}`,
      data: { thread },
    });
  } catch (error: any) {
    next(error);
  }
});

/**
 * 11. Upload File
 * POST /api/v1/messaging/files
 */
const FileUploadSchema = z.object({
  organizationId: z.string().optional(),
  filename: z.string().min(1),
  mimeType: z.string().default('application/octet-stream'),
  dataBase64: z.string().min(1),
});

router.post('/files', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const parsed = FileUploadSchema.parse(req.body);
    const orgId = parsed.organizationId || req.user.clientProfile?.organizationId;

    if (!orgId) {
      res.status(400).json({ status: 'error', message: 'organizationId is required for file upload' });
      return;
    }

    const buffer = Buffer.from(parsed.dataBase64, 'base64');
    if (buffer.length > 25 * 1024 * 1024) {
      res.status(400).json({ status: 'error', message: 'File exceeds maximum 25MB size limit' });
      return;
    }

    const fileAsset = await MessagingService.uploadFileAsset(
      req.user,
      orgId,
      {
        filename: parsed.filename,
        mimeType: parsed.mimeType,
        buffer,
      },
      req
    );

    res.status(201).json({
      status: 'success',
      data: {
        fileAsset: {
          id: fileAsset.id,
          filename: fileAsset.filename,
          mimeType: fileAsset.mimeType,
          sizeBytes: fileAsset.sizeBytes,
          downloadUrl: `/api/v1/messaging/files/${fileAsset.id}`,
        },
      },
    });
  } catch (error: any) {
    if (error && error.status === 429) {
      res.setHeader('Retry-After', String(error.retryAfter || 60));
      res.status(429).json({
        status: 'error',
        message: error.message,
        retryAfter: error.retryAfter,
      });
      return;
    }
    next(error);
  }
});

/**
 * 12. Download File
 * GET /api/v1/messaging/files/:fileId
 */
router.get('/files/:fileId', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const fileId = req.params.fileId as string;

    const fileMeta = await MessagingService.getFileAssetStream(req.user, fileId, req);

    res.setHeader('Content-Type', fileMeta.mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(fileMeta.filename)}"`);
    res.setHeader('Content-Length', fileMeta.sizeBytes);

    const stream = fs.createReadStream(fileMeta.filePath);
    stream.pipe(res);
  } catch (error: any) {
    next(error);
  }
});

export default router;
