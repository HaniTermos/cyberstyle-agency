import { prisma } from '../config/db';
import { logAudit } from '../utils/auditLogger';
import { safeAddEmailJob } from '../queues/email.queue';
import { UserRole, ThreadStatus, ThreadContextType, MessageType } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export interface AuthenticatedUserContext {
  id: string;
  role: UserRole;
  email: string;
  name?: string | null;
  clientProfile?: {
    organizationId: string;
  } | null;
}

export interface ListThreadsFilters {
  organizationId?: string;
  contextType?: ThreadContextType;
  contextId?: string;
  status?: ThreadStatus;
  limit?: number;
  cursor?: string;
}

export interface CreateThreadInput {
  organizationId?: string;
  title?: string;
  contextType?: ThreadContextType;
  contextId?: string;
  participantUserIds?: string[];
  initialMessage?: string;
  isInternal?: boolean;
}

export interface SendMessageInput {
  content: string;
  messageType?: MessageType;
  fileId?: string | null;
  isInternal?: boolean;
}

// In-Memory Rate Limiting Tracker
const messageRateLimitMap = new Map<string, number[]>();
const fileUploadRateLimitMap = new Map<string, number[]>();

export class MessagingService {
  private static storageDir = path.resolve(process.cwd(), 'storage/files');

  /**
   * Rate limiting enforcement
   */
  static checkRateLimit(userId: string, type: 'MESSAGE' | 'FILE') {
    const now = Date.now();
    const windowMs = 60 * 1000; // 1 minute
    const maxRequests = type === 'MESSAGE' ? 60 : 10;
    const tracker = type === 'MESSAGE' ? messageRateLimitMap : fileUploadRateLimitMap;

    let timestamps = tracker.get(userId) || [];
    timestamps = timestamps.filter((ts) => now - ts < windowMs);

    if (timestamps.length >= maxRequests) {
      const oldest = timestamps[0] || now;
      const retryAfterSeconds = Math.ceil((windowMs - (now - oldest)) / 1000);
      throw {
        status: 429,
        message: `Rate limit exceeded. Maximum ${maxRequests} ${type.toLowerCase()} requests per minute.`,
        retryAfter: retryAfterSeconds,
      };
    }

    timestamps.push(now);
    tracker.set(userId, timestamps);
  }

  /**
   * Ensure directory exists
   */
  private static ensureStorageDirectory(organizationId: string): string {
    const orgDir = path.join(this.storageDir, organizationId);
    if (!fs.existsSync(orgDir)) {
      fs.mkdirSync(orgDir, { recursive: true });
    }
    return orgDir;
  }

  /**
   * Helper: Resolve organization ID for user
   */
  private static async resolveUserOrgId(user: AuthenticatedUserContext): Promise<string | null> {
    if (user.clientProfile?.organizationId) {
      return user.clientProfile.organizationId;
    }
    if (user.role === UserRole.CLIENT) {
      const profile = await prisma.clientProfile.findUnique({
        where: { userId: user.id },
      });
      return profile?.organizationId || null;
    }
    return null;
  }

  /**
   * Helper: Assert user has access to thread
   */
  static async assertThreadAccess(user: AuthenticatedUserContext, threadId: string) {
    const thread = await prisma.messageThread.findUnique({
      where: { id: threadId },
      include: {
        organization: true,
        participants: true,
      },
    });

    if (!thread) {
      throw new Error('Thread not found');
    }

    const isAdmin = user.role === UserRole.SUPER_ADMIN || user.role === UserRole.ADMIN;
    if (isAdmin) {
      return thread;
    }

    // Client verification: Org boundary + Participant verification
    const userOrgId = await this.resolveUserOrgId(user);
    if (!userOrgId || userOrgId !== thread.organizationId) {
      throw new Error('Access denied: Unauthorized organization boundary');
    }

    const isParticipant = thread.participants.some((p) => p.userId === user.id);
    if (!isParticipant) {
      // Auto-join if same org client
      await prisma.messageParticipant.create({
        data: {
          threadId,
          userId: user.id,
          role: 'CLIENT',
        },
      });
    }

    return thread;
  }

  /**
   * 1. List Threads
   */
  static async listThreads(user: AuthenticatedUserContext, filters: ListThreadsFilters = {}) {
    const isAdmin = user.role === UserRole.SUPER_ADMIN || user.role === UserRole.ADMIN;
    let organizationId = filters.organizationId;

    if (!isAdmin) {
      const userOrgId = await this.resolveUserOrgId(user);
      if (!userOrgId) {
        throw new Error('Client user is not attached to an organization');
      }
      organizationId = userOrgId;
    }

    const limit = Math.min(filters.limit || 20, 100);

    const where: any = {
      ...(organizationId ? { organizationId } : {}),
      ...(filters.contextType ? { contextType: filters.contextType } : {}),
      ...(filters.contextId ? { contextId: filters.contextId } : {}),
      ...(filters.status ? { status: filters.status } : {}),
    };

    if (!isAdmin) {
      where.participants = {
        some: { userId: user.id },
      };
    }

    const threads = await prisma.messageThread.findMany({
      where,
      include: {
        organization: { select: { id: true, name: true } },
        participants: {
          include: {
            user: { select: { id: true, name: true, email: true, role: true, avatarUrl: true } },
          },
        },
        messages: {
          where: isAdmin ? {} : { isInternal: false },
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: {
            sender: { select: { id: true, name: true, email: true } },
          },
        },
      },
      orderBy: { lastMessageAt: 'desc' },
      take: limit + 1,
      ...(filters.cursor ? { cursor: { id: filters.cursor }, skip: 1 } : {}),
    });

    const hasMore = threads.length > limit;
    const resultThreads = hasMore ? threads.slice(0, limit) : threads;
    const nextCursor = resultThreads.length > 0 ? (resultThreads[resultThreads.length - 1]?.id ?? null) : null;

    return {
      threads: resultThreads.map((t) => {
        const lastMsg = t.messages[0];
        const participant = t.participants.find((p) => p.userId === user.id);
        const unread =
          lastMsg && participant?.lastReadAt
            ? new Date(lastMsg.createdAt) > new Date(participant.lastReadAt)
            : false;

        return {
          id: t.id,
          organizationId: t.organizationId,
          organizationName: t.organization.name,
          title: t.title || 'Direct Channel',
          contextType: t.contextType,
          contextId: t.contextId,
          status: t.status,
          lastMessageAt: t.lastMessageAt,
          unread,
          lastMessage: lastMsg
            ? {
                id: lastMsg.id,
                content: lastMsg.deletedAt ? 'This message was deleted by an admin' : lastMsg.content,
                senderName: lastMsg.sender.name || lastMsg.sender.email,
                createdAt: lastMsg.createdAt,
                isInternal: lastMsg.isInternal,
              }
            : null,
          participants: t.participants.map((p) => ({
            id: p.user.id,
            name: p.user.name || p.user.email,
            email: p.user.email,
            role: p.user.role,
            avatarUrl: p.user.avatarUrl,
          })),
        };
      }),
      hasMore,
      nextCursor,
    };
  }

  /**
   * 2. Create Thread
   */
  static async createThread(user: AuthenticatedUserContext, input: CreateThreadInput, req?: any) {
    const isAdmin = user.role === UserRole.SUPER_ADMIN || user.role === UserRole.ADMIN;
    let organizationId = input.organizationId;

    if (!isAdmin) {
      organizationId = (await this.resolveUserOrgId(user)) || undefined;
      if (!organizationId) {
        throw new Error('Client organization not found');
      }
    } else if (!organizationId) {
      throw new Error('organizationId is required for admin thread creation');
    }

    // Determine participant user IDs
    const participantIds = new Set<string>();
    participantIds.add(user.id);

    if (Array.isArray(input.participantUserIds)) {
      input.participantUserIds.forEach((id) => participantIds.add(id));
    }

    if (!isAdmin) {
      const admins = await prisma.user.findMany({
        where: { role: { in: [UserRole.SUPER_ADMIN, UserRole.ADMIN] } },
        take: 3,
      });
      admins.forEach((a) => participantIds.add(a.id));
    } else {
      const clientMembers = await prisma.clientProfile.findMany({
        where: { organizationId },
        select: { userId: true },
      });
      clientMembers.forEach((m) => participantIds.add(m.userId));
    }

    const thread = await prisma.messageThread.create({
      data: {
        organizationId,
        title: input.title || (input.contextType ? `${input.contextType} Discussion` : 'Project Channel'),
        contextType: input.contextType || ThreadContextType.GENERAL,
        contextId: input.contextId || null,
        status: ThreadStatus.OPEN,
        lastMessageAt: new Date(),
        lastMessageById: user.id,
        participants: {
          create: Array.from(participantIds).map((userId) => ({
            userId,
            role: userId === user.id ? (isAdmin ? 'ADMIN' : 'CLIENT') : 'CLIENT',
            lastReadAt: userId === user.id ? new Date() : null,
          })),
        },
      },
      include: {
        organization: true,
        participants: {
          include: {
            user: { select: { id: true, name: true, email: true, role: true } },
          },
        },
      },
    });

    // Create initial message if provided
    if (input.initialMessage && input.initialMessage.trim()) {
      await this.sendMessage(user, thread.id, {
        content: input.initialMessage,
        messageType: MessageType.TEXT,
        isInternal: isAdmin && input.isInternal === true,
      });
    }

    // Trigger In-App Notification and Email for participants
    const participantUsers = await prisma.user.findMany({
      where: { id: { in: Array.from(participantIds).filter((id) => id !== user.id) } },
      select: { id: true, email: true, name: true, role: true },
    });

    for (const pUser of participantUsers) {
      const isRecipientAdmin = pUser.role === UserRole.ADMIN || pUser.role === UserRole.SUPER_ADMIN;
      
      // In-App Notification
      await prisma.notification.create({
        data: {
          userId: pUser.id,
          title: `New Discussion: ${thread.title}`,
          message: `A new channel was initiated by ${user.name || user.email}.`,
          type: 'MESSAGE',
          linkUrl: isRecipientAdmin ? `/admin/messages?threadId=${thread.id}` : `/portal/messages?threadId=${thread.id}`,
        },
      }).catch(() => {});

      // Email Notification (respect internal vs client boundary)
      if (!input.isInternal || isRecipientAdmin) {
        safeAddEmailJob('thread-created-notification', {
          to: pUser.email,
          subject: `New discussion in ${thread.title} – CYBERSTYLE`,
          template: 'thread_created',
          variables: {
            threadTitle: thread.title,
            creatorName: user.name || user.email,
            excerpt: input.initialMessage ? input.initialMessage.slice(0, 160) : 'A new discussion channel has been opened.',
            deepLink: isRecipientAdmin
              ? `http://localhost:3000/admin/messages?threadId=${thread.id}`
              : `http://localhost:3000/portal/messages?threadId=${thread.id}`,
          },
        }).catch(() => {});
      }
    }

    await logAudit({
      userId: user.id,
      action: 'THREAD_CREATED',
      entityType: 'MessageThread',
      entityId: thread.id,
      changes: {
        organizationId,
        title: thread.title,
        contextType: thread.contextType,
        contextId: thread.contextId,
      },
      req,
    });

    return thread;
  }

  /**
   * 3. Get Thread Detail
   */
  static async getThreadDetail(user: AuthenticatedUserContext, threadId: string, limit = 50) {
    const thread = await this.assertThreadAccess(user, threadId);
    const isAdmin = user.role === UserRole.SUPER_ADMIN || user.role === UserRole.ADMIN;

    const messages = await prisma.message.findMany({
      where: {
        threadId,
        ...(isAdmin ? {} : { isInternal: false }),
      },
      include: {
        sender: {
          select: { id: true, name: true, email: true, role: true, avatarUrl: true },
        },
        file: true,
      },
      orderBy: { createdAt: 'asc' },
      take: limit,
    });

    // Automatically mark read for the viewer
    await this.markThreadRead(user, threadId);

    return {
      thread: {
        id: thread.id,
        organizationId: thread.organizationId,
        organizationName: thread.organization.name,
        title: thread.title,
        contextType: thread.contextType,
        contextId: thread.contextId,
        status: thread.status,
        lastMessageAt: thread.lastMessageAt,
        participants: thread.participants,
      },
      messages: messages.map((m) => ({
        id: m.id,
        threadId: m.threadId,
        senderId: m.senderId,
        senderName: m.sender.name || m.sender.email,
        senderRole: m.sender.role,
        avatarUrl: m.sender.avatarUrl,
        content: m.deletedAt ? 'This message was deleted by an admin' : m.content,
        messageType: m.messageType,
        fileId: m.fileId,
        file: m.file && !m.deletedAt
          ? {
              id: m.file.id,
              filename: m.file.filename,
              mimeType: m.file.mimeType,
              sizeBytes: m.file.sizeBytes,
            }
          : null,
        isInternal: m.isInternal,
        deletedAt: m.deletedAt,
        editedAt: m.editedAt,
        createdAt: m.createdAt,
      })),
    };
  }

  /**
   * 4. Poll Incremental Messages
   */
  static async pollMessages(user: AuthenticatedUserContext, threadId: string, sinceMessageId?: string, limit = 50) {
    await this.assertThreadAccess(user, threadId);
    const isAdmin = user.role === UserRole.SUPER_ADMIN || user.role === UserRole.ADMIN;

    let sinceDate: Date | undefined;
    if (sinceMessageId) {
      const referenceMsg = await prisma.message.findUnique({
        where: { id: sinceMessageId },
        select: { createdAt: true },
      });
      if (referenceMsg) {
        sinceDate = referenceMsg.createdAt;
      }
    }

    const messages = await prisma.message.findMany({
      where: {
        threadId,
        ...(sinceDate ? { createdAt: { gt: sinceDate } } : {}),
        ...(isAdmin ? {} : { isInternal: false }),
      },
      include: {
        sender: {
          select: { id: true, name: true, email: true, role: true, avatarUrl: true },
        },
        file: true,
      },
      orderBy: { createdAt: 'asc' },
      take: limit + 1,
    });

    const hasMore = messages.length > limit;
    const resultMessages = hasMore ? messages.slice(0, limit) : messages;
    const nextCursor = resultMessages.length > 0 ? (resultMessages[resultMessages.length - 1]?.id ?? null) : null;

    await this.markThreadRead(user, threadId);

    return {
      threadId,
      messages: resultMessages.map((m) => ({
        id: m.id,
        senderId: m.senderId,
        senderName: m.sender.name || m.sender.email,
        senderRole: m.sender.role,
        avatarUrl: m.sender.avatarUrl,
        content: m.deletedAt ? 'This message was deleted by an admin' : m.content,
        messageType: m.messageType,
        fileId: m.fileId,
        file: m.file && !m.deletedAt
          ? {
              id: m.file.id,
              filename: m.file.filename,
              mimeType: m.file.mimeType,
              sizeBytes: m.file.sizeBytes,
            }
          : null,
        isInternal: m.isInternal,
        deletedAt: m.deletedAt,
        editedAt: m.editedAt,
        createdAt: m.createdAt,
      })),
      hasMore,
      nextCursor,
    };
  }

  /**
   * 5. Send Message (Text, System, or File)
   */
  static async sendMessage(user: AuthenticatedUserContext, threadId: string, input: SendMessageInput, req?: any) {
    this.checkRateLimit(user.id, 'MESSAGE');
    const thread = await this.assertThreadAccess(user, threadId);
    const isAdmin = user.role === UserRole.SUPER_ADMIN || user.role === UserRole.ADMIN;

    if (thread.status === ThreadStatus.CLOSED && !isAdmin) {
      throw new Error('Cannot send messages to a closed conversation.');
    }

    const isInternal = isAdmin ? Boolean(input.isInternal) : false;

    const message = await prisma.$transaction(async (tx) => {
      const msg = await tx.message.create({
        data: {
          threadId,
          senderId: user.id,
          content: input.content,
          messageType: input.messageType || (input.fileId ? MessageType.FILE : MessageType.TEXT),
          fileId: input.fileId || null,
          isInternal,
        },
        include: {
          sender: {
            select: { id: true, name: true, email: true, role: true, avatarUrl: true },
          },
          file: true,
        },
      });

      await tx.messageThread.update({
        where: { id: threadId },
        data: {
          lastMessageAt: msg.createdAt,
          lastMessageById: user.id,
        },
      });

      await tx.messageParticipant.updateMany({
        where: { threadId, userId: user.id },
        data: { lastReadAt: msg.createdAt },
      });

      return msg;
    });

    // Notify other participants (In-App + Email)
    const participants = await prisma.messageParticipant.findMany({
      where: { threadId },
      include: {
        user: { select: { id: true, name: true, email: true, role: true } },
      },
    });

    for (const p of participants) {
      if (p.userId !== user.id) {
        const isRecipientAdmin = p.user.role === UserRole.ADMIN || p.user.role === UserRole.SUPER_ADMIN;

        // In-App Notification
        await prisma.notification.create({
          data: {
            userId: p.userId,
            title: `New Message in ${thread.title || 'Discussion'}`,
            message: `${user.name || user.email}: ${input.content.slice(0, 80)}`,
            type: 'MESSAGE',
            linkUrl: isRecipientAdmin ? `/admin/messages?threadId=${threadId}` : `/portal/messages?threadId=${threadId}`,
          },
        }).catch(() => {});

        // Email Notification: Never send internal notes to external client users
        if (!isInternal || isRecipientAdmin) {
          safeAddEmailJob('new-message-notification', {
            to: p.user.email,
            subject: `New message in ${thread.title || 'Discussion'} – CYBERSTYLE`,
            template: 'message_new',
            variables: {
              threadTitle: thread.title,
              senderName: user.name || user.email,
              excerpt: input.content.slice(0, 160),
              deepLink: isRecipientAdmin
                ? `http://localhost:3000/admin/messages?threadId=${threadId}`
                : `http://localhost:3000/portal/messages?threadId=${threadId}`,
            },
          }).catch(() => {});
        }
      }
    }

    if (isInternal || input.fileId || input.messageType === MessageType.SYSTEM) {
      await logAudit({
        userId: user.id,
        action: 'MESSAGE_SENT',
        entityType: 'Message',
        entityId: message.id,
        changes: {
          threadId,
          isInternal,
          fileId: input.fileId,
          messageType: message.messageType,
        },
        req,
      });
    }

    return {
      id: message.id,
      threadId: message.threadId,
      senderId: message.senderId,
      senderName: message.sender.name || message.sender.email,
      senderRole: message.sender.role,
      avatarUrl: message.sender.avatarUrl,
      content: message.content,
      messageType: message.messageType,
      fileId: message.fileId,
      file: message.file
        ? {
            id: message.file.id,
            filename: message.file.filename,
            mimeType: message.file.mimeType,
            sizeBytes: message.file.sizeBytes,
          }
        : null,
      isInternal: message.isInternal,
      createdAt: message.createdAt,
      editedAt: message.editedAt,
      deletedAt: message.deletedAt,
    };
  }

  /**
   * 6. Soft Delete Message (Admin Only)
   */
  static async softDeleteMessage(user: AuthenticatedUserContext, threadId: string, messageId: string, req?: any) {
    const isAdmin = user.role === UserRole.SUPER_ADMIN || user.role === UserRole.ADMIN;
    if (!isAdmin) {
      throw new Error('Only administrators can delete messages.');
    }

    await this.assertThreadAccess(user, threadId);

    const message = await prisma.message.findFirst({
      where: { id: messageId, threadId },
    });

    if (!message) {
      throw new Error('Message not found');
    }

    const updated = await prisma.message.update({
      where: { id: messageId },
      data: {
        deletedAt: new Date(),
        deletedById: user.id,
      },
    });

    await logAudit({
      userId: user.id,
      action: 'MESSAGE_DELETED',
      entityType: 'Message',
      entityId: messageId,
      changes: { threadId, deletedAt: updated.deletedAt },
      req,
    });

    return updated;
  }

  /**
   * 7. Edit Message
   */
  static async editMessage(user: AuthenticatedUserContext, threadId: string, messageId: string, newContent: string, req?: any) {
    const isAdmin = user.role === UserRole.SUPER_ADMIN || user.role === UserRole.ADMIN;
    await this.assertThreadAccess(user, threadId);

    const message = await prisma.message.findFirst({
      where: { id: messageId, threadId },
    });

    if (!message) {
      throw new Error('Message not found');
    }

    if (!isAdmin && message.senderId !== user.id) {
      throw new Error('You can only edit your own messages.');
    }

    if (message.deletedAt) {
      throw new Error('Cannot edit a deleted message.');
    }

    const updated = await prisma.message.update({
      where: { id: messageId },
      data: {
        content: newContent,
        editedAt: new Date(),
      },
    });

    await logAudit({
      userId: user.id,
      action: 'MESSAGE_EDITED',
      entityType: 'Message',
      entityId: messageId,
      changes: { threadId, editedAt: updated.editedAt },
      req,
    });

    return updated;
  }

  /**
   * 8. Export Thread
   */
  static async exportThread(user: AuthenticatedUserContext, threadId: string, req?: any) {
    const thread = await this.assertThreadAccess(user, threadId);
    const isAdmin = user.role === UserRole.SUPER_ADMIN || user.role === UserRole.ADMIN;

    const messages = await prisma.message.findMany({
      where: {
        threadId,
        ...(isAdmin ? {} : { isInternal: false }),
      },
      include: {
        sender: { select: { id: true, name: true, email: true, role: true } },
        file: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    await logAudit({
      userId: user.id,
      action: 'THREAD_EXPORTED',
      entityType: 'MessageThread',
      entityId: threadId,
      req,
    });

    return {
      exportTimestamp: new Date().toISOString(),
      exportedBy: { id: user.id, email: user.email, role: user.role },
      thread: {
        id: thread.id,
        title: thread.title,
        contextType: thread.contextType,
        contextId: thread.contextId,
        status: thread.status,
        organizationName: thread.organization.name,
        createdAt: thread.createdAt,
      },
      totalMessages: messages.length,
      messages: messages.map((m) => ({
        id: m.id,
        sender: m.sender.name || m.sender.email,
        role: m.sender.role,
        content: m.deletedAt ? 'This message was deleted by an admin' : m.content,
        messageType: m.messageType,
        file: m.file ? { filename: m.file.filename, sizeBytes: m.file.sizeBytes, mimeType: m.file.mimeType } : null,
        isInternal: m.isInternal,
        createdAt: m.createdAt,
        editedAt: m.editedAt,
        deletedAt: m.deletedAt,
      })),
    };
  }

  /**
   * 9. Mark Thread as Read
   */
  static async markThreadRead(user: AuthenticatedUserContext, threadId: string) {
    const updated = await prisma.messageParticipant.updateMany({
      where: { threadId, userId: user.id },
      data: { lastReadAt: new Date() },
    });
    return { success: true, updatedCount: updated.count };
  }

  /**
   * 10. Update Thread Status (Admin Only)
   */
  static async updateThreadStatus(user: AuthenticatedUserContext, threadId: string, status: ThreadStatus, req?: any) {
    const isAdmin = user.role === UserRole.SUPER_ADMIN || user.role === UserRole.ADMIN;
    if (!isAdmin) {
      throw new Error('Only administrators can change conversation status.');
    }

    const thread = await prisma.messageThread.update({
      where: { id: threadId },
      data: { status },
      include: { organization: true },
    });

    await logAudit({
      userId: user.id,
      action: 'THREAD_STATUS_CHANGED',
      entityType: 'MessageThread',
      entityId: threadId,
      changes: { status },
      req,
    });

    return thread;
  }

  /**
   * 11. Upload File Asset
   */
  static async uploadFileAsset(
    user: AuthenticatedUserContext,
    organizationId: string,
    file: { filename: string; mimeType: string; buffer: Buffer },
    req?: any
  ) {
    this.checkRateLimit(user.id, 'FILE');
    const isAdmin = user.role === UserRole.SUPER_ADMIN || user.role === UserRole.ADMIN;
    const userOrgId = await this.resolveUserOrgId(user);

    if (!isAdmin && userOrgId !== organizationId) {
      throw new Error('Access denied: Cannot upload files to a different organization.');
    }

    const orgDir = this.ensureStorageDirectory(organizationId);
    const hash = crypto.randomBytes(16).toString('hex');
    const safeExt = path.extname(file.filename) || '.bin';
    const storageKey = `${hash}${safeExt}`;
    const filePath = path.join(orgDir, storageKey);

    fs.writeFileSync(filePath, file.buffer);

    const fileAsset = await prisma.fileAsset.create({
      data: {
        organizationId,
        uploaderId: user.id,
        filename: file.filename,
        mimeType: file.mimeType,
        sizeBytes: file.buffer.length,
        storageKey: `${organizationId}/${storageKey}`,
        url: null,
      },
    });

    await logAudit({
      userId: user.id,
      action: 'FILE_UPLOADED',
      entityType: 'FileAsset',
      entityId: fileAsset.id,
      changes: {
        organizationId,
        filename: file.filename,
        sizeBytes: file.buffer.length,
      },
      req,
    });

    return fileAsset;
  }

  /**
   * 12. Get File Asset Stream
   */
  static async getFileAssetStream(user: AuthenticatedUserContext, fileId: string, req?: any) {
    const fileAsset = await prisma.fileAsset.findUnique({
      where: { id: fileId },
      include: {
        messages: {
          select: { threadId: true },
        },
      },
    });

    if (!fileAsset) {
      throw new Error('File not found');
    }

    const isAdmin = user.role === UserRole.SUPER_ADMIN || user.role === UserRole.ADMIN;
    const userOrgId = await this.resolveUserOrgId(user);

    if (!isAdmin) {
      if (userOrgId !== fileAsset.organizationId) {
        throw new Error('Access denied: Unauthorized organization file.');
      }

      const threadIds = fileAsset.messages.map((m) => m.threadId);
      const isParticipantInAny = await prisma.messageParticipant.findFirst({
        where: {
          userId: user.id,
          threadId: { in: threadIds },
        },
      });

      if (!isParticipantInAny && fileAsset.uploaderId !== user.id) {
        throw new Error('Access denied: You are not authorized to download this attachment.');
      }
    }

    const filePath = path.join(this.storageDir, fileAsset.storageKey);
    if (!fs.existsSync(filePath)) {
      throw new Error('File contents missing from storage volume');
    }

    await logAudit({
      userId: user.id,
      action: 'FILE_DOWNLOADED',
      entityType: 'FileAsset',
      entityId: fileId,
      changes: { filename: fileAsset.filename },
      req,
    });

    return {
      filePath,
      filename: fileAsset.filename,
      mimeType: fileAsset.mimeType,
      sizeBytes: fileAsset.sizeBytes,
    };
  }
}
