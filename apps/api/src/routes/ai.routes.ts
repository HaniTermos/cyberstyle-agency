import { Router, Response, NextFunction } from 'express';
import { prisma } from '../config/db';
import { requireAuth, requireRole, AuthenticatedRequest } from '../middleware/auth.middleware';
import { AILeadService } from '../services/ai-lead.service';
import { AiGovernanceService } from '../services/ai-governance.service';
import { logAudit } from '../utils/auditLogger';
import { UserRole, ProposalStatus, LeadStage, AiFeatureType } from '@prisma/client';

const router = Router();

// Guard all AI Intelligence & Proposal routes with SUPER_ADMIN / ADMIN
router.use(requireAuth);
router.use(requireRole([UserRole.SUPER_ADMIN, UserRole.ADMIN]));

// ==============================================================================
// 1. LEAD SCORING & INTELLIGENCE
// ==============================================================================

/**
 * POST /api/v1/admin/ai/leads/:id/score
 * Evaluates lead, generates AI fit score, intent tier, and stores result on Lead model.
 */
router.post('/leads/:id/score', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const lead = await prisma.lead.findUnique({
      where: { id },
      include: { proposals: true },
    });

    if (!lead) {
      res.status(404).json({
        status: 'error',
        code: 'LEAD_NOT_FOUND',
        message: 'Lead not found',
      });
      return;
    }

    // Run AI scoring engine with sanitized and PII-redacted data
    const scoreResult = await AILeadService.scoreLead({
      id: lead.id,
      name: lead.name,
      company: lead.company,
      email: AiGovernanceService.redactPiiAndSecrets(lead.email),
      phone: lead.phone ? AiGovernanceService.redactPiiAndSecrets(lead.phone) : null,
      serviceNeeded: lead.serviceNeeded,
      approxBudget: lead.approxBudget,
      desiredTimeline: lead.desiredTimeline,
      projectGoals: lead.projectGoals ? AiGovernanceService.sanitizeUntrustedInput(lead.projectGoals) : null,
      currentChallenges: lead.currentChallenges ? AiGovernanceService.sanitizeUntrustedInput(lead.currentChallenges) : null,
      message: lead.message ? AiGovernanceService.sanitizeUntrustedInput(lead.message) : null,
    });

    // Update Lead in DB
    const updatedLead = await prisma.lead.update({
      where: { id },
      data: {
        aiScore: scoreResult.fitScore,
        aiScoreReasoning: scoreResult.reasoning,
        aiIntentTier: scoreResult.intentTier,
        aiTechStackSuggestions: scoreResult.techStackSuggestions,
        aiScoredAt: new Date(),
      },
      include: { proposals: true },
    });

    // Log AI Usage & Budget
    await AiGovernanceService.logAiUsage({
      userId: req.user.id,
      feature: AiFeatureType.LEAD_SCORING,
      model: 'gemini-1.5-pro',
      promptTokens: 420,
      completionTokens: 180,
    });

    // Log Audit Event
    await logAudit({
      userId: req.user.id,
      action: 'AI_LEAD_SCORED',
      entityType: 'Lead',
      entityId: id,
      changes: {
        aiScore: scoreResult.fitScore,
        aiIntentTier: scoreResult.intentTier,
        budgetAssessment: scoreResult.budgetAssessment,
      },
      req,
    });

    const governed = AiGovernanceService.wrapDraftResponse({
      lead: updatedLead,
      evaluation: scoreResult,
    }, {
      feature: AiFeatureType.LEAD_SCORING,
      model: 'gemini-1.5-pro',
      tokensUsed: 600,
    });

    res.status(200).json({
      status: 'success',
      message: 'Lead scored successfully by AI Intelligence engine.',
      data: governed.data,
      meta: governed.meta,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/admin/ai/leads/qualify
 * Or POST /api/v1/admin/leads/qualify
 * Qualifies a local business prospect from Google Maps / Local Growth Assistant
 */
router.post('/leads/qualify', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const {
      businessName,
      category,
      website,
      websiteStatus,
      websiteScore,
      rating,
      reviewCount,
      city,
      address,
      phone,
      mapsUrl,
    } = req.body;

    if (!businessName) {
      res.status(400).json({
        status: 'error',
        code: 'VALIDATION_ERROR',
        message: 'businessName is required for local lead qualification.',
      });
      return;
    }

    const qualification = await AILeadService.qualifyLocalLead({
      businessName,
      category,
      website,
      websiteStatus,
      websiteScore,
      rating,
      reviewCount,
      city,
      address,
      phone,
      mapsUrl,
    });

    await logAudit({
      userId: req.user.id,
      action: 'LOCAL_LEAD_QUALIFIED',
      entityType: 'Lead',
      changes: {
        businessName,
        category,
        score: qualification.score,
        priority: qualification.priority,
        service: qualification.service,
      },
      req,
    });

    res.status(200).json({
      status: 'success',
      message: 'Local lead qualified successfully.',
      data: {
        score: qualification.score,
        priority: qualification.priority,
        service: qualification.service,
        reason: qualification.reason,
        recommended_offer: qualification.recommended_offer,
        personalization_points: qualification.personalization_points,
        draft_message: qualification.draft_message,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/admin/ai/leads/import
 * Or POST /api/v1/admin/leads/import
 * Imports single or batch of reviewed local leads into CYBERSTYLE CRM
 */
router.post('/leads/import', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { leads } = req.body;
    const leadsList = Array.isArray(leads) ? leads : (req.body.name || req.body.businessName ? [req.body] : []);

    if (leadsList.length === 0) {
      res.status(400).json({
        status: 'error',
        code: 'EMPTY_PAYLOAD',
        message: 'No leads provided to import.',
      });
      return;
    }

    const createdLeads = [];
    const skippedLeads = [];

    for (const item of leadsList) {
      const name = item.name || item.businessName || 'Local Business';
      const company = item.company || item.businessName || name;
      const email = item.email || `contact@${(item.website || 'prospect').replace(/^https?:\/\//, '').replace(/\/.*$/, '') || 'localbusiness.com'}`;
      const phone = item.phone || null;
      const mapsUrl = item.mapsUrl || null;

      // Check for deduplication by mapsUrl, email, or phone
      const existing = await prisma.lead.findFirst({
        where: {
          OR: [
            ...(mapsUrl ? [{ mapsUrl }] : []),
            ...(item.email ? [{ email: item.email }] : []),
            ...(phone ? [{ phone }] : []),
          ],
        },
      });

      if (existing) {
        // Update existing lead with fresh local intelligence
        const updated = await prisma.lead.update({
          where: { id: existing.id },
          data: {
            category: item.category || existing.category,
            address: item.address || existing.address,
            rating: item.rating ? String(item.rating) : existing.rating,
            reviewCount: item.reviewCount ? String(item.reviewCount) : existing.reviewCount,
            serviceFit: item.serviceFit || item.service || existing.serviceFit,
            websiteStatus: item.websiteStatus || existing.websiteStatus,
            websiteScore: item.websiteScore !== undefined ? Number(item.websiteScore) : existing.websiteScore,
            leadScore: item.leadScore || item.score || existing.leadScore,
            priority: item.priority || existing.priority,
            opportunityType: item.opportunityType || item.service || existing.opportunityType,
            suggestedOffer: item.suggestedOffer || item.recommended_offer || existing.suggestedOffer,
            notes: item.notes ? `${existing.notes ? existing.notes + '\n\n' : ''}${item.notes}` : existing.notes,
            dateScraped: new Date(),
          },
        });
        skippedLeads.push(updated);
        continue;
      }

      // Create new Lead record in PostgreSQL
      const created = await prisma.lead.create({
        data: {
          name,
          company,
          email,
          phone,
          website: item.website || null,
          category: item.category || null,
          address: item.address || null,
          mapsUrl: item.mapsUrl || null,
          rating: item.rating ? String(item.rating) : null,
          reviewCount: item.reviewCount ? String(item.reviewCount) : null,
          serviceNeeded: item.suggestedOffer || item.recommended_offer || item.serviceFit || 'Custom Web & AI Modernization',
          serviceFit: item.serviceFit || item.service || 'website',
          websiteStatus: item.websiteStatus || (item.website ? 'active' : 'missing'),
          websiteScore: item.websiteScore !== undefined ? Number(item.websiteScore) : null,
          leadScore: item.leadScore || item.score || 0,
          priority: item.priority || 'unqualified',
          opportunityType: item.opportunityType || item.service || 'website',
          suggestedOffer: item.suggestedOffer || item.recommended_offer || null,
          message: item.draft_message || item.message || `Discovered via CyberStyle Local Growth Intelligence (${item.category || 'Local Business'}).`,
          notes: item.notes || (item.reason ? `AI Qualification Note: ${item.reason}` : null),
          consentStatus: item.consentStatus || 'unknown',
          stage: LeadStage.NEW,
          dateScraped: new Date(),
          aiScore: item.score || item.leadScore || null,
          aiScoreReasoning: item.reason || null,
        },
      });

      createdLeads.push(created);
    }

    await logAudit({
      userId: req.user.id,
      action: 'LOCAL_LEADS_IMPORTED',
      entityType: 'Lead',
      changes: {
        createdCount: createdLeads.length,
        updatedCount: skippedLeads.length,
      },
      req,
    });

    res.status(201).json({
      status: 'success',
      message: `Imported ${createdLeads.length} leads (${skippedLeads.length} existing records refreshed).`,
      data: {
        created: createdLeads,
        updated: skippedLeads,
        total: createdLeads.length + skippedLeads.length,
      },
    });
  } catch (error) {
    next(error);
  }
});

// ==============================================================================
// 2. PROPOSAL & SOW DRAFT GENERATION
// ==============================================================================

/**
 * POST /api/v1/admin/ai/leads/:id/generate-proposal
 * Drafts an itemized SOW proposal and a 2-minute Loom script.
 * Saves proposal in DRAFT status (requires human approval).
 */
router.post('/leads/:id/generate-proposal', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const lead = await prisma.lead.findUnique({
      where: { id },
    });

    if (!lead) {
      res.status(404).json({
        status: 'error',
        code: 'LEAD_NOT_FOUND',
        message: 'Lead not found',
      });
      return;
    }

    const leadInput = {
      id: lead.id,
      name: lead.name,
      company: lead.company,
      email: AiGovernanceService.redactPiiAndSecrets(lead.email),
      phone: lead.phone ? AiGovernanceService.redactPiiAndSecrets(lead.phone) : null,
      serviceNeeded: lead.serviceNeeded,
      approxBudget: lead.approxBudget,
      desiredTimeline: lead.desiredTimeline,
      projectGoals: lead.projectGoals ? AiGovernanceService.sanitizeUntrustedInput(lead.projectGoals) : null,
      currentChallenges: lead.currentChallenges ? AiGovernanceService.sanitizeUntrustedInput(lead.currentChallenges) : null,
      message: lead.message ? AiGovernanceService.sanitizeUntrustedInput(lead.message) : null,
    };

    // 1. Generate Proposal SOW
    const sowResult = await AILeadService.generateProposalSOW(leadInput);

    // 2. Generate Loom Pitch Script
    const loomScriptResult = await AILeadService.generateLoomScript(leadInput, sowResult);

    // 3. Persist proposal in DRAFT state (Zero Autonomous Sending)
    const proposal = await prisma.proposal.create({
      data: {
        leadId: lead.id,
        title: sowResult.title,
        executiveSummary: sowResult.executiveSummary,
        scopeOfWork: sowResult.scopeOfWork,
        deliverableMilestones: sowResult.deliverableMilestones,
        estimatedWeeks: sowResult.estimatedWeeks,
        totalEstimate: sowResult.totalEstimate,
        recommendedRetainer: sowResult.recommendedRetainer,
        loomScript: loomScriptResult as any,
        aiScore: lead.aiScore ?? 85,
        aiFitSummary: `Aligned with CYBERSTYLE engineering. Retainer target: ${sowResult.recommendedRetainer}`,
        aiRiskFactors: ['Discovery session recommended before kickoff.'],
        status: ProposalStatus.DRAFT,
        createdById: req.user.id,
      },
      include: {
        lead: true,
      },
    });

    // Log AI Usage & Budget
    await AiGovernanceService.logAiUsage({
      userId: req.user.id,
      feature: AiFeatureType.PROPOSAL_OUTLINE,
      model: 'gemini-1.5-pro',
      promptTokens: 850,
      completionTokens: 620,
    });

    // Log Audit Event
    await logAudit({
      userId: req.user.id,
      action: 'AI_PROPOSAL_DRAFTED',
      entityType: 'Proposal',
      entityId: proposal.id,
      changes: {
        leadId: lead.id,
        totalEstimate: sowResult.totalEstimate,
        status: ProposalStatus.DRAFT,
      },
      req,
    });

    const governed = AiGovernanceService.wrapDraftResponse({
      proposal,
      loomScript: loomScriptResult,
    }, {
      feature: AiFeatureType.PROPOSAL_OUTLINE,
      model: 'gemini-1.5-pro',
      tokensUsed: 1470,
    });

    res.status(201).json({
      status: 'success',
      message: 'Proposal drafted successfully by AI Intelligence engine in DRAFT status.',
      data: governed.data,
      meta: governed.meta,
    });
  } catch (error) {
    next(error);
  }
});

// ==============================================================================
// 3. PROPOSALS CRUD & WORKSPACE
// ==============================================================================

/**
 * GET /api/v1/admin/proposals
 * Lists all proposals with filtering and lead relations
 */
router.get('/proposals', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { status, search } = req.query;

    const proposals = await prisma.proposal.findMany({
      where: {
        ...(status ? { status: status as ProposalStatus } : {}),
        ...(search
          ? {
              OR: [
                { title: { contains: String(search), mode: 'insensitive' } },
                { lead: { name: { contains: String(search), mode: 'insensitive' } } },
                { lead: { company: { contains: String(search), mode: 'insensitive' } } },
              ],
            }
          : {}),
      },
      include: {
        lead: true,
        approvedBy: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({
      status: 'success',
      data: { proposals },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/admin/proposals/:id
 * Retrieves single proposal with lead details and approvals
 */
router.get('/proposals/:id', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const proposal = await prisma.proposal.findUnique({
      where: { id },
      include: {
        lead: true,
        approvedBy: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!proposal) {
      res.status(404).json({
        status: 'error',
        code: 'PROPOSAL_NOT_FOUND',
        message: 'Proposal not found',
      });
      return;
    }

    res.status(200).json({
      status: 'success',
      data: { proposal },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PATCH /api/v1/admin/proposals/:id
 * Updates proposal content, milestones, pricing, or Loom script
 */
router.patch('/proposals/:id', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const {
      title,
      executiveSummary,
      scopeOfWork,
      deliverableMilestones,
      estimatedWeeks,
      totalEstimate,
      recommendedRetainer,
      loomScript,
    } = req.body;

    const existing = await prisma.proposal.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ status: 'error', message: 'Proposal not found' });
      return;
    }

    // Guard: Prevent silent overwrite of legally accepted proposals
    if (existing.status === ProposalStatus.ACCEPTED) {
      res.status(400).json({
        status: 'error',
        code: 'PROPOSAL_IMMUTABLE',
        message: 'Accepted proposals are legally locked and cannot be edited. Please draft a new version.',
      });
      return;
    }

    const proposal = await prisma.proposal.update({
      where: { id },
      data: {
        version: existing.version + 1,
        ...(title !== undefined ? { title } : {}),
        ...(executiveSummary !== undefined ? { executiveSummary } : {}),
        ...(scopeOfWork !== undefined ? { scopeOfWork } : {}),
        ...(deliverableMilestones !== undefined ? { deliverableMilestones } : {}),
        ...(estimatedWeeks !== undefined ? { estimatedWeeks: Number(estimatedWeeks) } : {}),
        ...(totalEstimate !== undefined ? { totalEstimate: Number(totalEstimate) } : {}),
        ...(recommendedRetainer !== undefined ? { recommendedRetainer } : {}),
        ...(loomScript !== undefined ? { loomScript } : {}),
      },
      include: {
        lead: true,
        approvedBy: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    await logAudit({
      userId: req.user.id,
      action: 'PROPOSAL_EDITED',
      entityType: 'Proposal',
      entityId: id,
      changes: { title, totalEstimate, estimatedWeeks, version: proposal.version },
      req,
    });

    res.status(200).json({
      status: 'success',
      message: `Proposal updated successfully (Version ${proposal.version})`,
      data: { proposal },
    });
  } catch (error) {
    next(error);
  }
});

// ==============================================================================
// 4. HUMAN-IN-THE-LOOP APPROVAL & SEND GATES
// ==============================================================================

/**
 * POST /api/v1/admin/proposals/:id/approve
 * STRICT HUMAN APPROVAL: Marks proposal as APPROVED, records approver ID and timestamp.
 * Optionally advances lead stage to PROPOSAL.
 */
router.post('/proposals/:id/approve', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { advanceLeadStage = true } = req.body;

    const existing = await prisma.proposal.findUnique({
      where: { id },
      include: { lead: true },
    });

    if (!existing) {
      res.status(404).json({
        status: 'error',
        code: 'PROPOSAL_NOT_FOUND',
        message: 'Proposal not found',
      });
      return;
    }

    const updated = await prisma.$transaction(async (tx) => {
      // 1. Update proposal status
      const p = await tx.proposal.update({
        where: { id },
        data: {
          status: ProposalStatus.APPROVED,
          approvedById: req.user.id,
          approvedAt: new Date(),
        },
        include: {
          lead: true,
          approvedBy: {
            select: { id: true, name: true, email: true },
          },
        },
      });

      // 2. Advance Lead Stage if linked and requested
      if (existing.leadId && advanceLeadStage) {
        await tx.lead.update({
          where: { id: existing.leadId },
          data: {
            stage: LeadStage.PROPOSAL,
            estimatedValue: p.totalEstimate,
          },
        });
      }

      return p;
    });

    // Log Audit Event
    await logAudit({
      userId: req.user.id,
      action: 'PROPOSAL_APPROVED',
      entityType: 'Proposal',
      entityId: id,
      changes: {
        status: ProposalStatus.APPROVED,
        approvedById: req.user.id,
        leadId: existing.leadId,
      },
      req,
    });

    res.status(200).json({
      status: 'success',
      message: 'Proposal approved successfully by human administrator.',
      data: { proposal: updated },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/admin/proposals/:id/send
 * Marks proposal as SENT to client and records sent timestamp.
 */
router.post('/proposals/:id/send', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const proposal = await prisma.proposal.update({
      where: { id },
      data: {
        status: ProposalStatus.SENT,
        sentAt: new Date(),
      },
      include: {
        lead: true,
        approvedBy: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    await logAudit({
      userId: req.user.id,
      action: 'PROPOSAL_SENT',
      entityType: 'Proposal',
      entityId: id,
      changes: { status: ProposalStatus.SENT },
      req,
    });

    res.status(200).json({
      status: 'success',
      message: 'Proposal marked as SENT to prospect.',
      data: { proposal },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/admin/proposals/:id/accept
 * Records client acceptance, digital signature, IP address, and freezes proposal.
 */
router.post('/proposals/:id/accept', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { signature } = req.body;
    const ipAddress = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress;

    const existing = await prisma.proposal.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ status: 'error', message: 'Proposal not found' });
      return;
    }

    if (existing.status === ProposalStatus.ACCEPTED) {
      res.status(400).json({ status: 'error', message: 'Proposal has already been accepted.' });
      return;
    }

    const updated = await prisma.$transaction(async (tx) => {
      const p = await tx.proposal.update({
        where: { id },
        data: {
          status: ProposalStatus.ACCEPTED,
          acceptedAt: new Date(),
          acceptedBySignature: signature || req.user.name || req.user.email,
          clientIpAtAcceptance: typeof ipAddress === 'string' ? ipAddress : undefined,
        },
      });

      if (existing.leadId) {
        await tx.lead.update({
          where: { id: existing.leadId },
          data: { stage: LeadStage.WON },
        });
      }

      return p;
    });

    await logAudit({
      userId: req.user.id,
      action: 'PROPOSAL_ACCEPTED',
      entityType: 'Proposal',
      entityId: id,
      changes: {
        status: ProposalStatus.ACCEPTED,
        signature: signature || req.user.name || req.user.email,
        version: existing.version,
      },
      req,
    });

    res.status(200).json({
      status: 'success',
      message: 'Proposal accepted and locked.',
      data: { proposal: updated },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/admin/proposals/:id/reject
 * Records proposal rejection with reason
 */
router.post('/proposals/:id/reject', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const updated = await prisma.proposal.update({
      where: { id },
      data: {
        status: ProposalStatus.REJECTED,
        rejectedAt: new Date(),
        rejectionReason: reason || null,
      },
    });

    await logAudit({
      userId: req.user.id,
      action: 'PROPOSAL_REJECTED',
      entityType: 'Proposal',
      entityId: id,
      changes: { status: ProposalStatus.REJECTED, reason },
      req,
    });

    res.status(200).json({
      status: 'success',
      message: 'Proposal marked as REJECTED.',
      data: { proposal: updated },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
