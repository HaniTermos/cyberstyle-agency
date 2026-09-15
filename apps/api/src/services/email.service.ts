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
    const gmailPass = (process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASS)?.replace(/\s+/g, '');
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
            participants: ['marcus.vance@apexfintech.com', 'info@cyberstyle.net'],
            lastMessageAt: new Date(),
          },
        });

        await prisma.emailMessage.createMany({
          data: [
            {
              threadId: thread1.id,
              from: 'info@cyberstyle.net',
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
              to: 'info@cyberstyle.net',
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
            participants: ['sarah.lin@nexuslogistics.com', 'info@cyberstyle.net'],
            lastMessageAt: new Date(Date.now() - 86400000),
          },
        });

        await prisma.emailMessage.create({
          data: {
            threadId: thread2.id,
            from: 'sarah.lin@nexuslogistics.com',
            to: 'info@cyberstyle.net',
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
   * Generates an executive CYBERSTYLE branded HTML email wrapper
   */
  public static wrapExecutiveEmailTemplate(options: {
    subject: string;
    preheader?: string;
    contentHtml: string;
    ctaText?: string;
    ctaUrl?: string;
  }): string {
    const { subject, preheader = '', contentHtml, ctaText, ctaUrl } = options;
    const year = new Date().getFullYear();
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #080A10; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #E2E8F0;">
  <!-- CYBERSTYLE-EXECUTIVE-TEMPLATE -->
  <div style="display: none; max-height: 0px; overflow: hidden; opacity: 0;">${preheader || subject}</div>
  
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #080A10; min-height: 100vh; padding: 40px 16px;">
    <tr>
      <td align="center">
        <!-- Main Container -->
        <table role="presentation" width="100%" style="max-width: 640px; background-color: #0C0E17; border: 1px solid rgba(0, 240, 255, 0.25); border-radius: 16px; overflow: hidden; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.8), 0 0 25px rgba(0, 240, 255, 0.08);">
          
          <!-- Top Neon Accent -->
          <tr>
            <td style="height: 4px; background: linear-gradient(90deg, #00F0FF 0%, #7000FF 50%, #00F0FF 100%);"></td>
          </tr>

          <!-- Header -->
          <tr>
            <td style="padding: 28px 36px 20px 36px; border-bottom: 1px solid rgba(255, 255, 255, 0.08);">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td>
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td style="width: 34px; height: 34px; background-color: rgba(0, 240, 255, 0.12); border: 1px solid #00F0FF; border-radius: 8px; text-align: center; vertical-align: middle;">
                          <span style="color: #00F0FF; font-weight: 900; font-size: 15px; font-family: monospace;">CS</span>
                        </td>
                        <td style="padding-left: 10px; vertical-align: middle;">
                          <span style="font-family: monospace; font-size: 17px; font-weight: 800; letter-spacing: 2px; color: #FFFFFF;">CYBERSTYLE</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td align="right">
                    <span style="display: inline-block; font-family: monospace; font-size: 10px; text-transform: uppercase; letter-spacing: 1.5px; color: #00F0FF; background-color: rgba(0, 240, 255, 0.1); border: 1px solid rgba(0, 240, 255, 0.3); padding: 4px 10px; border-radius: 20px;">
                      VERIFIED DISPATCH
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 36px 36px 28px 36px; color: #CBD5E1; font-size: 15px; line-height: 1.75;">
              <h1 style="margin: 0 0 20px 0; font-size: 20px; font-weight: 700; color: #FFFFFF; letter-spacing: -0.3px;">
                ${subject}
              </h1>
              
              <div style="color: #CBD5E1; font-size: 15px; line-height: 1.75;">
                ${contentHtml}
              </div>

              ${ctaText && ctaUrl ? `
              <div style="margin: 32px 0 16px 0;">
                <a href="${ctaUrl}" style="display: inline-block; background-color: #00F0FF; color: #000000; font-weight: 700; font-size: 14px; text-decoration: none; padding: 13px 26px; border-radius: 8px; box-shadow: 0 0 20px rgba(0, 240, 255, 0.4); text-align: center;">
                  ${ctaText} &rarr;
                </a>
              </div>
              ` : ''}
            </td>
          </tr>

          <!-- Executive Signature -->
          <tr>
            <td style="padding: 24px 36px 28px 36px; background-color: #090B12; border-top: 1px solid rgba(255, 255, 255, 0.06);">
              <div style="border-left: 2px solid #00F0FF; padding-left: 14px; margin-bottom: 20px;">
                <div style="font-weight: 800; color: #FFFFFF; font-size: 13px; letter-spacing: 0.5px;">CYBERSTYLE ARCHITECTURE & CLOUD OS</div>
                <div style="font-size: 12px; color: #94A3B8; margin-top: 2px;">Next-Gen Web Platforms &bull; AI Agent Systems &bull; Enterprise SaaS</div>
                <div style="margin-top: 8px; font-size: 11px; color: #64748B; font-family: monospace;">
                  <span>🌐 <a href="https://cyberstyle.net" style="color: #00F0FF; text-decoration: none;">cyberstyle.net</a></span>
                  <span style="margin: 0 6px; color: #334155;">&bull;</span>
                  <span>✉️ <a href="mailto:info@cyberstyle.net" style="color: #94A3B8; text-decoration: none;">info@cyberstyle.net</a></span>
                  <span style="margin: 0 6px; color: #334155;">&bull;</span>
                  <span>📞 +1 (800) CYBER-STYLE</span>
                </div>
              </div>

              <!-- Confidentiality Notice -->
              <div style="font-size: 10px; color: #475569; line-height: 1.5; font-family: monospace; border-top: 1px solid rgba(255, 255, 255, 0.05); padding-top: 14px;">
                CONFIDENTIALITY NOTICE: This transmission is intended strictly for the named recipient and contains proprietary agency materials. Unauthorized interception, copying, or dissemination is strictly prohibited. &copy; ${year} CYBERSTYLE LLC.
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
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
    const fromAddress = options.from || process.env.EMAIL_FROM || '"CYBERSTYLE Command" <info@cyberstyle.net>';
    const transportMode = this.getTransportMode();
    const transporter = this.getTransporter();

    try {
      let sentMessageId = `msg_${Date.now()}`;

      // Auto-wrap outbound HTML in executive CYBERSTYLE template if not already wrapped
      let finalHtml = options.html;
      if (!finalHtml.includes('CYBERSTYLE-EXECUTIVE-TEMPLATE')) {
        finalHtml = this.wrapExecutiveEmailTemplate({
          subject: options.subject,
          contentHtml: options.html,
        });
      }

      // In SMTP or Gmail mode:
      const info = await transporter.sendMail({
        from: fromAddress,
        to: options.to,
        subject: options.subject,
        html: finalHtml,
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
