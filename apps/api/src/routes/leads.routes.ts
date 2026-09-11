import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../config/db';
import { emailQueue } from '../queues/email.queue';
import { leadSubmissionLimiter } from '../middleware/rateLimiter';
import { StartProjectRequestSchema, ContactSubmissionSchema } from '@cyberstyle/config/src/schemas';
import { LeadStage } from '@prisma/client';

const router = Router();

/**
 * @route   POST /api/leads
 * @desc    Public endpoint for Start a Project inquiries (with Honeypot & Audit Logging)
 * @access  Public (Rate Limited)
 */
router.post('/leads', leadSubmissionLimiter, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ipAddress = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'] || 'Unknown';

    // 1. Spam Honeypot Detection
    if (req.body.hp_website_check && req.body.hp_website_check.length > 0) {
      await prisma.auditLog.create({
        data: {
          action: 'SPAM_LEAD_REJECTED',
          entityType: 'Lead',
          ipAddress: typeof ipAddress === 'string' ? ipAddress : undefined,
          userAgent,
          changes: { reason: 'Honeypot field triggered', payload: req.body },
        },
      });
      res.status(200).json({ status: 'success', message: 'Inquiry received.' });
      return;
    }

    const validatedData = StartProjectRequestSchema.parse(req.body);

    // 2. Create Lead Record in PostgreSQL
    const lead = await prisma.lead.create({
      data: {
        name: validatedData.name,
        company: validatedData.company,
        email: validatedData.email,
        phone: validatedData.phone,
        website: validatedData.website,
        country: validatedData.country,
        serviceNeeded: validatedData.serviceNeeded,
        approxBudget: validatedData.approxBudget,
        desiredTimeline: validatedData.desiredTimeline,
        projectGoals: validatedData.projectGoals,
        currentChallenges: validatedData.currentChallenges,
        message: validatedData.message,
        stage: LeadStage.NEW,
        utmSource: validatedData.utmSource,
        utmMedium: validatedData.utmMedium,
        utmCampaign: validatedData.utmCampaign,
        referrer: validatedData.referrer,
        ipAddress: typeof ipAddress === 'string' ? ipAddress : undefined,
      },
    });

    // 3. Log Submission in AuditLog
    await prisma.auditLog.create({
      data: {
        action: 'LEAD_SUBMISSION_CREATED',
        entityType: 'Lead',
        entityId: lead.id,
        ipAddress: typeof ipAddress === 'string' ? ipAddress : undefined,
        userAgent,
        changes: { email: lead.email, serviceNeeded: lead.serviceNeeded, approxBudget: lead.approxBudget },
      },
    });

    // 4. Queue Email Job (Confirmation + Internal Notification)
    try {
      await emailQueue.add('new-lead-alert', {
        to: process.env.ADMIN_NOTIFICATION_EMAILS?.split(',') || ['admin@cyberstyle.net'],
        subject: `🔥 New Lead Received: ${lead.name} (${lead.company || 'Direct'}) - ${lead.serviceNeeded}`,
        template: 'new_lead_internal',
        variables: {
          leadId: lead.id,
          name: lead.name,
          email: lead.email,
          serviceNeeded: lead.serviceNeeded,
          budget: lead.approxBudget,
          goals: lead.projectGoals,
        },
      });
    } catch (queueErr) {
      console.warn('⚠️ Could not queue email job (Redis offline in dev):', queueErr);
    }

    res.status(201).json({
      status: 'success',
      message: 'Project inquiry received successfully.',
      data: { leadId: lead.id },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/contact
 * @desc    Public endpoint for general contact messages
 * @access  Public (Rate Limited)
 */
router.post('/contact', leadSubmissionLimiter, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ipAddress = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'] || 'Unknown';

    // Honeypot check
    if (req.body.hp_website_check && req.body.hp_website_check.length > 0) {
      res.status(200).json({ status: 'success', message: 'Message sent.' });
      return;
    }

    const validatedData = ContactSubmissionSchema.parse(req.body);

    const submission = await prisma.contactSubmission.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        subject: validatedData.subject,
        message: validatedData.message,
        ipAddress: typeof ipAddress === 'string' ? ipAddress : undefined,
      },
    });

    await prisma.auditLog.create({
      data: {
        action: 'CONTACT_SUBMISSION_CREATED',
        entityType: 'ContactSubmission',
        entityId: submission.id,
        ipAddress: typeof ipAddress === 'string' ? ipAddress : undefined,
        userAgent,
        changes: { email: submission.email, name: submission.name },
      },
    });

    res.status(201).json({
      status: 'success',
      message: 'Contact message received successfully.',
      data: { submissionId: submission.id },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/leads/scraper-sync
 * @desc    Check scraper-sync endpoint status in browser
 */
router.get('/leads/scraper-sync', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'online',
    service: 'CYBERSTYLE Google Maps Scraper Sync API',
    methodRequired: 'POST',
    documentation: 'Send POST requests with a lead JSON object or { leads: [...] } batch array to sync directly to PostgreSQL CRM.',
  });
});

/**
 * @route   POST /api/leads/scraper-sync
 * @desc    Direct synchronization endpoint for Google Maps Tampermonkey Lead Scraper (Single or Batch)
 * @access  Public / API Key / Local Dev
 */
router.post('/leads/scraper-sync', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rawData = req.body;
    const leadsList = Array.isArray(rawData.leads) ? rawData.leads : (rawData.name || rawData.company ? [rawData] : []);

    if (leadsList.length === 0) {
      res.status(400).json({ status: 'error', message: 'No leads provided to sync.' });
      return;
    }

    const syncedResults = [];

    for (const item of leadsList) {
      const name = item.name || item.company || 'Unnamed Business';
      const email = item.email || `contact@${name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`;
      const phone = item.phone || null;
      const website = item.website || null;
      const category = item.category || 'Local Business';
      const address = item.address || null;
      const country = item.country || 'Global';
      const rating = item.rating || null;
      const reviewCount = item.reviewCount || null;
      const mapsUrl = item.mapsUrl || null;
      const websiteStatus = item.websiteStatus || 'unknown';
      const websiteScore = typeof item.websiteScore === 'number' ? item.websiteScore : null;
      const leadScore = typeof item.leadScore === 'number' ? item.leadScore : (item.score || 70);
      const priority = item.priority || (leadScore >= 80 ? 'hot' : 'warm');
      const suggestedOffer = item.suggestedOffer || item.serviceNeeded || 'Next.js 15 Web Platform & Intake Funnel';
      const notes = item.notes || `Discovered via Google Maps Scraper v9.0. Working Hours: ${item.workingHours || 'N/A'}`;

      // Find existing lead by name or mapsUrl or email
      const existing = await prisma.lead.findFirst({
        where: {
          OR: [
            ...(mapsUrl ? [{ mapsUrl }] : []),
            ...(email ? [{ email }] : []),
            { name: { equals: name, mode: 'insensitive' } },
          ],
        },
      });

      if (existing) {
        const updated = await prisma.lead.update({
          where: { id: existing.id },
          data: {
            phone: phone || existing.phone,
            website: website || existing.website,
            address: address || existing.address,
            country: country !== 'Global' ? country : existing.country,
            rating: rating || existing.rating,
            reviewCount: reviewCount || existing.reviewCount,
            websiteStatus: websiteStatus !== 'unknown' ? websiteStatus : existing.websiteStatus,
            websiteScore: websiteScore !== null ? websiteScore : existing.websiteScore,
            leadScore: Math.max(leadScore, existing.leadScore),
            priority: leadScore >= 80 ? 'hot' : existing.priority,
            suggestedOffer: suggestedOffer || existing.suggestedOffer,
            notes: `${existing.notes || ''}\n[Sync Updated ${new Date().toLocaleDateString()}]`,
          },
        });
        syncedResults.push({ id: updated.id, name: updated.name, action: 'updated' });
      } else {
        const created = await prisma.lead.create({
          data: {
            name,
            company: item.company || name,
            email,
            phone,
            website,
            category,
            address,
            country,
            mapsUrl,
            rating,
            reviewCount,
            serviceNeeded: suggestedOffer,
            serviceFit: item.serviceFit || 'website',
            websiteStatus,
            websiteScore,
            leadScore,
            priority,
            opportunityType: item.opportunityType || 'website',
            suggestedOffer,
            approxBudget: item.approxBudget || '$15,000 - $35,000',
            stage: LeadStage.NEW,
            notes,
            message: `Scraped from Google Maps. Web: ${websiteStatus}, Ghost: ${item.isDigitalGhost ? 'YES' : 'NO'}.`,
          },
        });
        syncedResults.push({ id: created.id, name: created.name, action: 'created' });
      }
    }

    res.status(200).json({
      status: 'success',
      message: `Successfully synchronized ${syncedResults.length} leads with CYBERSTYLE database.`,
      data: {
        syncedCount: syncedResults.length,
        results: syncedResults,
      },
    });
  } catch (error) {
    next(error);
  }
});


export default router;
