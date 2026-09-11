import nodemailer from 'nodemailer';
import { prisma } from '../config/db';

export interface EmailDispatchOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
  inReplyTo?: string;
  relatedType?: 'LEAD' | 'CLIENT' | 'PROJECT' | 'INVOICE' | 'GENERAL';
  relatedId?: string;
  threadId?: string;
}

export interface EmailLogEntry {
  id: string;
  to: string;
  subject: string;
  status: 'SENT' | 'FAILED' | 'MOCKED';
  sentAt: string;
  provider: string;
  messageId?: string;
  error?: string;
}

export const AGENCY_EMAIL_TEMPLATES = [
  {
    id: 'outreach-lead-gen',
    category: 'Cold Outreach',
    name: 'High-Impact Web & AI Performance Teardown',
    subject: 'Quick question regarding {{company}} web performance & conversion speed',
    body: `<p>Hi {{name}},</p>
<p>I noticed {{company}} has a strong market footprint, but your prospective buyers might be experiencing slight response bottlenecks during inquiry submission.</p>
<p>At <strong>CYBERSTYLE</strong>, we engineer sub-second Next.js 15 platforms paired with automated 24/7 AI lead qualification pipelines that route verified inquiries in under 30 seconds.</p>
<p>Would you be open to reviewing a 3-minute video breakdown of how we recently helped an enterprise client achieve <strong>+340% qualified inquiry growth</strong>?</p>
<p>Best regards,<br>
<strong>CYBERSTYLE Engineering Command</strong><br>
<a href="https://cyberstyle.agency">cyberstyle.agency</a></p>`,
  },
  {
    id: 'follow-up-day3',
    category: 'Follow-Up',
    name: 'Day 3 Value-Add Architecture Teardown',
    subject: 'Follow-up: Architecture ideas for {{company}}',
    body: `<p>Hi {{name}},</p>
<p>Following up on my previous note. We put together a complimentary 3-point technical audit for {{company}} covering:</p>
<ol>
  <li>Core Web Vitals & mobile latency optimization.</li>
  <li>Automated AI quote scoring to filter high-intent prospects.</li>
  <li>Self-hosted client portal architecture to eliminate SaaS vendor lock-in.</li>
</ol>
<p>Do you have 10 minutes this Thursday for a quick technical demonstration?</p>
<p>Best,<br><strong>CYBERSTYLE Lead Architect</strong></p>`,
  },
  {
    id: 'proposal-delivery',
    category: 'Sales',
    name: 'Interactive Deliverable Proposal Ready',
    subject: 'CYBERSTYLE Project Scope & Architecture Proposal for {{company}}',
    body: `<p>Dear {{name}},</p>
<p>Your tailored project proposal and deliverable milestone architecture are now ready for review.</p>
<p>You can review the scope, technical stack specifications, escrow payment schedule, and security guarantees via your secure portal link below:</p>
<p><a href="{{proposalUrl}}" style="display:inline-block;background:#00F0FF;color:#000;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:bold;">Review Interactive Proposal</a></p>
<p>Looking forward to engineering this platform together.</p>
<p>Best regards,<br><strong>CYBERSTYLE Executive Team</strong></p>`,
  },
  {
    id: 'invoice-notice',
    category: 'Finance',
    name: 'Milestone Deliverable Invoice & Stripe Link',
    subject: 'Invoice {{invoiceNumber}} for {{projectName}} Deliverables',
    body: `<p>Hello {{name}},</p>
<p>Milestone deliverables for <strong>{{projectName}}</strong> have been completed and verified.</p>
<p>Attached is your invoice <strong>{{invoiceNumber}}</strong> for <strong>{{amount}}</strong>. You may settle securely via Stripe hosted checkout:</p>
<p><a href="{{paymentUrl}}" style="display:inline-block;background:#00FF85;color:#000;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:bold;">Settle Invoice via Stripe</a></p>
<p>Thank you for your partnership.</p>
<p>Warm regards,<br><strong>CYBERSTYLE Finance Operations</strong></p>`,
  },
  {
    id: 'report-delivery',
    category: 'Client Success',
    name: 'Monthly SEO & AI Performance Report',
    subject: 'Monthly Executive Telemetry & Growth Report: {{company}}',
    body: `<p>Hi {{name}},</p>
<p>Your monthly system telemetry, Google Search Console keyword rank captures, and AI inquiry volume report is ready.</p>
<p>Highlights this cycle:</p>
<ul>
  <li>Core Web Vitals Performance: <strong>98/100</strong></li>
  <li>Organic Search Growth: <strong>+24.8%</strong></li>
  <li>Average AI Routing Response: <strong>22 seconds</strong></li>
</ul>
<p>Access your full PDF audit report inside the client vault.</p>
<p>Best,<br><strong>CYBERSTYLE Systems Team</strong></p>`,
  },
];

export class EmailService {
  private static logs: EmailLogEntry[] = [];
  private static transporter: nodemailer.Transporter | null = null;

  /**
   * Determine transport mode: Gmail API / OAuth vs SMTP vs Mock
   */
  public static getTransportMode(): 'gmail' | 'smtp' | 'mock' {
    if (process.env.GMAIL_CLIENT_ID && process.env.GMAIL_REFRESH_TOKEN) {
      return 'gmail';
    }
    if (process.env.GMAIL_USER || process.env.SMTP_USER) {
      return 'smtp';
    }
    return 'mock';
  }

  /**
   * Initializes or returns the cached transporter
   */
  public static getTransporter(): nodemailer.Transporter {
    if (this.transporter) return this.transporter;

    const gmailUser = process.env.GMAIL_USER || process.env.SMTP_USER;
    const gmailPass = process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASS;
    const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
    const smtpPort = Number(process.env.SMTP_PORT || 465);

    if (gmailUser && gmailPass) {
      this.transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: gmailUser,
          pass: gmailPass,
        },
      });
      console.log(`📧 [EmailService] Using live SMTP host [${smtpHost}] for [${gmailUser}]`);
    } else {
      // Logged Dev Transporter
      this.transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: 'dev.command@cyberstyle.net',
          pass: 'mock_password_cyberstyle',
        },
      });
      console.log(`ℹ️ [EmailService] Using logged development transporter (Simulated Live Mode)`);
    }

    return this.transporter;
  }

  /**
   * Seed initial mock threads for demonstration if database is empty
   */
  public static async seedDefaultThreadsIfEmpty() {
    try {
      const count = await prisma.emailThread.count();
      if (count === 0) {
        const thread1 = await prisma.emailThread.create({
          data: {
            subject: 'Re: Enterprise Next.js 15 Platform Scope & Security Architecture',
            snippet: 'Thanks for sending over the technical breakdown. Can you confirm if Argon2id auth is supported?',
            relatedType: 'LEAD',
            status: 'OPEN',
            participants: ['marcus.vance@apexfintech.com', 'contact@cyberstyle.net'],
            lastMessageAt: new Date(),
          },
        });

        await prisma.emailMessage.createMany({
          data: [
            {
              threadId: thread1.id,
              from: 'contact@cyberstyle.net',
              to: 'marcus.vance@apexfintech.com',
              subject: 'Enterprise Next.js 15 Platform Scope & Security Architecture',
              body: '<p>Hi Marcus,</p><p>Following up on our call, here is the architecture breakdown for your high-concurrency telemetry platform.</p><p>Best,<br>CYBERSTYLE Engineering</p>',
              snippet: 'Following up on our call, here is the architecture breakdown...',
              direction: 'outbound',
              status: 'SENT',
              transport: 'smtp',
              sentAt: new Date(Date.now() - 3600000 * 4),
            },
            {
              threadId: thread1.id,
              from: 'marcus.vance@apexfintech.com',
              to: 'contact@cyberstyle.net',
              subject: 'Re: Enterprise Next.js 15 Platform Scope & Security Architecture',
              body: '<p>Thanks for sending over the technical breakdown. Can you confirm if Argon2id password hashing and TOTP 2FA are included in the baseline milestone?</p><p>Marcus Vance<br>CTO, Apex Fintech</p>',
              snippet: 'Thanks for sending over the technical breakdown. Can you confirm if Argon2id...',
              direction: 'inbound',
              status: 'RECEIVED',
              transport: 'gmail',
              sentAt: new Date(Date.now() - 3600000 * 2),
            },
          ],
        });

        const thread2 = await prisma.emailThread.create({
          data: {
            subject: 'AI Quote Routing Pipeline — Production Feedback',
            snippet: 'The BullMQ worker is processing leads in under 20 seconds. Exceptional delivery!',
            relatedType: 'PROJECT',
            status: 'OPEN',
            participants: ['sarah.lin@nexuslogistics.com', 'contact@cyberstyle.net'],
            lastMessageAt: new Date(Date.now() - 86400000),
          },
        });

        await prisma.emailMessage.create({
          data: {
            threadId: thread2.id,
            from: 'sarah.lin@nexuslogistics.com',
            to: 'contact@cyberstyle.net',
            subject: 'AI Quote Routing Pipeline — Production Feedback',
            body: '<p>Team CYBERSTYLE,</p><p>The BullMQ worker is processing leads in under 20 seconds. Qualified inquiries are already up 40% week-over-week. Exceptional delivery!</p><p>Sarah Lin<br>VP Ops, Nexus Global</p>',
            snippet: 'The BullMQ worker is processing leads in under 20 seconds...',
            direction: 'inbound',
            status: 'RECEIVED',
            transport: 'gmail',
            sentAt: new Date(Date.now() - 86400000),
          },
        });
      }
    } catch (err) {
      console.error('⚠️ [seedDefaultThreadsIfEmpty] Notice:', err);
    }
  }

  /**
   * Sends an email with full threading and DB tracking
   */
  public static async sendMail(options: EmailDispatchOptions): Promise<{
    success: boolean;
    messageId?: string;
    threadId?: string;
    error?: string;
    transportUsed: string;
  }> {
    const logId = `eml_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const fromAddress = options.from || process.env.EMAIL_FROM || '"CYBERSTYLE Command" <contact@cyberstyle.net>';
    const transportMode = this.getTransportMode();
    const transporter = this.getTransporter();

    try {
      let sentMessageId = `msg_${Date.now()}`;

      // In SMTP or Gmail mode:
      const info = await transporter.sendMail({
        from: fromAddress,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text || options.html.replace(/<[^>]*>/g, ''),
        inReplyTo: options.inReplyTo,
      });

      sentMessageId = info.messageId || sentMessageId;

      // Ensure thread exists or create new
      let threadId = options.threadId;
      if (!threadId) {
        const thread = await prisma.emailThread.create({
          data: {
            subject: options.subject,
            snippet: options.html.replace(/<[^>]*>/g, '').substring(0, 160),
            participants: [options.to, fromAddress],
            relatedType: options.relatedType || 'GENERAL',
            relatedId: options.relatedId,
            lastMessageAt: new Date(),
          },
        });
        threadId = thread.id;
      } else {
        await prisma.emailThread.update({
          where: { id: threadId },
          data: {
            lastMessageAt: new Date(),
            snippet: options.html.replace(/<[^>]*>/g, '').substring(0, 160),
          },
        });
      }

      // Record message in thread
      await prisma.emailMessage.create({
        data: {
          threadId,
          gmailMessageId: sentMessageId,
          inReplyTo: options.inReplyTo,
          from: fromAddress,
          to: options.to,
          subject: options.subject,
          body: options.html,
          snippet: options.html.replace(/<[^>]*>/g, '').substring(0, 160),
          direction: 'outbound',
          status: 'SENT',
          transport: transportMode,
          sentAt: new Date(),
        },
      });

      // Save to memory log
      const logEntry: EmailLogEntry = {
        id: logId,
        to: options.to,
        subject: options.subject,
        status: 'SENT',
        sentAt: new Date().toISOString(),
        provider: transportMode,
        messageId: sentMessageId,
      };
      this.logs.unshift(logEntry);

      return {
        success: true,
        messageId: sentMessageId,
        threadId,
        transportUsed: transportMode,
      };
    } catch (err: any) {
      console.error('❌ [EmailService.sendMail] Dispatch error:', err);

      const logEntry: EmailLogEntry = {
        id: logId,
        to: options.to,
        subject: options.subject,
        status: 'FAILED',
        sentAt: new Date().toISOString(),
        provider: transportMode,
        error: err.message,
      };
      this.logs.unshift(logEntry);

      return {
        success: false,
        error: err.message,
        transportUsed: transportMode,
      };
    }
  }

  /**
   * Send test email
   */
  public static async sendTestEmail(toEmail: string, customMessage?: string) {
    const html = `
      <div style="font-family: sans-serif; background-color: #0c0d12; color: #ffffff; padding: 32px; border-radius: 12px;">
        <h1 style="color: #00F0FF; margin-bottom: 8px;">CYBERSTYLE Operational Dispatch</h1>
        <p style="color: #94a3b8; font-size: 14px;">System Health & Transporter Diagnostics</p>
        <hr style="border-color: #1e293b; margin: 24px 0;" />
        <p>This transmission verifies that your CYBERSTYLE Agency OS email dispatch engine is operational.</p>
        ${customMessage ? `<blockquote style="border-left: 3px solid #00F0FF; padding-left: 12px; margin: 16px 0; color: #cbd5e1;">${customMessage}</blockquote>` : ''}
        <p style="font-size: 12px; color: #64748b; margin-top: 32px;">Transport Mode: <strong>${this.getTransportMode().toUpperCase()}</strong> | Time: ${new Date().toISOString()}</p>
      </div>
    `;

    return this.sendMail({
      to: toEmail,
      subject: '🚀 CYBERSTYLE Operational Diagnostics Ping',
      html,
    });
  }

  /**
   * List all threads
   */
  public static async listThreads(status?: string) {
    await this.seedDefaultThreadsIfEmpty();

    const where: any = {};
    if (status && status !== 'ALL') {
      where.status = status;
    }

    return prisma.emailThread.findMany({
      where,
      include: {
        messages: {
          orderBy: { sentAt: 'asc' },
        },
      },
      orderBy: { lastMessageAt: 'desc' },
    });
  }

  /**
   * Get single thread by ID
   */
  public static async getThread(id: string) {
    return prisma.emailThread.findUnique({
      where: { id },
      include: {
        messages: {
          orderBy: { sentAt: 'asc' },
        },
      },
    });
  }

  /**
   * Reply inside a thread
   */
  public static async replyToThread(threadId: string, replyData: { to: string; subject?: string; body: string; from?: string }) {
    const thread = await prisma.emailThread.findUnique({
      where: { id: threadId },
      include: { messages: { orderBy: { sentAt: 'desc' }, take: 1 } },
    });

    if (!thread) {
      throw new Error('Thread not found');
    }

    const lastMessage = thread.messages[0];
    const subject = replyData.subject || (thread.subject.startsWith('Re:') ? thread.subject : `Re: ${thread.subject}`);

    return this.sendMail({
      to: replyData.to,
      subject,
      html: replyData.body,
      threadId,
      inReplyTo: lastMessage?.gmailMessageId || undefined,
      from: replyData.from,
    });
  }

  /**
   * Get in-memory logs
   */
  public static getLogs(): EmailLogEntry[] {
    return this.logs;
  }
}
