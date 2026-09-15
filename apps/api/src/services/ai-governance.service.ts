import { prisma } from '../config/db';
import { AiFeatureType } from '@prisma/client';

// ==============================================================================
// AI GOVERNANCE CONSTANTS & INTERFACES
// ==============================================================================

export const AI_DRAFT_DISCLAIMER =
  'AI-generated draft: Requires human review, verification, and explicit confirmation before execution or client communication.';

export interface GovernedAiResponse<T> {
  data: T;
  meta: {
    isAiGenerated: true;
    status: 'DRAFT';
    requiresHumanApproval: true;
    disclaimer: string;
    model: string;
    feature: AiFeatureType;
    tokensUsed: number;
    latencyMs: number;
    timestamp: string;
  };
}

export class AiGovernanceService {
  /**
   * 1. Redact PII and Sensitive Secrets before sending to LLM
   */
  static redactPiiAndSecrets(input: string): string {
    if (!input) return '';

    let text = input;

    // Redact Credit Cards (13-16 digits with optional dashes/spaces)
    text = text.replace(/\b(?:\d[ -]*?){13,16}\b/g, '[REDACTED_CREDIT_CARD]');

    // Redact US SSN
    text = text.replace(/\b\d{3}[-]?\d{2}[-]?\d{4}\b/g, '[REDACTED_SSN]');

    // Redact API Keys / Tokens (sk_live, sk_test, Bearer, tokens, private keys)
    text = text.replace(/\b(sk_(?:live|test)_[a-zA-Z0-9]{16,})\b/g, '[REDACTED_API_KEY]');
    text = text.replace(/\b(ghp_[a-zA-Z0-9]{20,})\b/g, '[REDACTED_GITHUB_TOKEN]');
    text = text.replace(/\b(Bearer\s+[a-zA-Z0-9._\-]{20,})\b/gi, 'Bearer [REDACTED_TOKEN]');
    text = text.replace(/-----BEGIN [A-Z ]+ PRIVATE KEY-----[\s\S]*?-----END [A-Z ]+ PRIVATE KEY-----/g, '[REDACTED_PRIVATE_KEY]');

    // Redact Password declarations in JSON or config snippets
    text = text.replace(/(["']?password["']?\s*[:=]\s*["'])[^"']+["']/gi, '$1[REDACTED_PASSWORD]"');
    text = text.replace(/(["']?secret["']?\s*[:=]\s*["'])[^"']+["']/gi, '$1[REDACTED_SECRET]"');

    return text;
  }

  /**
   * 2. Defend against Prompt Injection
   */
  static sanitizeUntrustedInput(userInput: string): string {
    if (!userInput) return '';

    let clean = userInput.trim();

    // Neutralize common jailbreak instructions
    const injectionPatterns = [
      /ignore (all )?(previous|prior) (instructions|prompts|rules)/gi,
      /you are no longer an ai/gi,
      /you are now DAN/gi,
      /system:\s*you are/gi,
      /override (system|security) (settings|protocols)/gi,
      /print (all )?(system|internal) (prompts|instructions|secrets)/gi,
    ];

    for (const pattern of injectionPatterns) {
      clean = clean.replace(pattern, '[FILTERED_UNTRUSTED_DIRECTIVE]');
    }

    // Encapsulate in unexecutable content boundaries
    return `<<<START_UNTRUSTED_CONTENT_DATA_ONLY>>>\n${clean}\n<<<END_UNTRUSTED_CONTENT_DATA_ONLY>>>`;
  }

  /**
   * 3. Tenant Boundary Verification for RAG & Retrieval
   */
  static assertTenantScoping(requestedOrgId: string, authorizedOrgId?: string, isPlatformStaff = false) {
    if (isPlatformStaff) return; // Staff/Admin can view across authorized contexts

    if (!authorizedOrgId || authorizedOrgId !== requestedOrgId) {
      throw new Error(
        `AI Retrieval Security Violation: Cross-tenant data retrieval is forbidden. ` +
        `Requested organization does not match authenticated tenant scope.`
      );
    }
  }

  /**
   * 4. Token Budgeting & Rate Limiting Enforcement
   */
  static async checkBudgetAndRateLimit(organizationId?: string): Promise<void> {
    if (!organizationId) return; // Unscoped admin queries bypass tenant caps

    const policy = await prisma.aiBudgetPolicy.findUnique({
      where: { organizationId },
    });

    if (!policy || !policy.isEnforced) return;

    // Check Monthly Token Budget
    if (policy.tokensUsedMonth >= policy.monthlyTokenBudget) {
      throw new Error(
        `AI Monthly Token Budget Exceeded (${policy.tokensUsedMonth} / ${policy.monthlyTokenBudget} tokens). ` +
        `Contact administrator to adjust tenant quota.`
      );
    }

    // Check Minute Rate Limits
    const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
    const recentCalls = await prisma.aiUsageLog.count({
      where: {
        organizationId,
        createdAt: { gte: oneMinuteAgo },
      },
    });

    if (recentCalls >= policy.rateLimitPerMinute) {
      throw new Error(
        `AI Rate Limit Exceeded (${recentCalls} requests in last minute). ` +
        `Tenant limit is ${policy.rateLimitPerMinute} req/min. Please throttle requests.`
      );
    }
  }

  /**
   * 5. Record Usage Log & Deduct Token Budget
   */
  static async logAiUsage(input: {
    organizationId?: string;
    userId?: string;
    feature: AiFeatureType;
    model: string;
    promptTokens: number;
    completionTokens: number;
    latencyMs?: number;
    status?: 'SUCCESS' | 'RATE_LIMITED' | 'ERROR';
    metadata?: any;
  }) {
    const totalTokens = input.promptTokens + input.completionTokens;

    await prisma.aiUsageLog.create({
      data: {
        organizationId: input.organizationId || null,
        userId: input.userId || null,
        feature: input.feature,
        model: input.model,
        promptTokens: input.promptTokens,
        completionTokens: input.completionTokens,
        totalTokens,
        latencyMs: input.latencyMs || null,
        status: input.status || 'SUCCESS',
        metadata: input.metadata || null,
      },
    });

    // Update tenant monthly usage
    if (input.organizationId && totalTokens > 0) {
      await prisma.aiBudgetPolicy.upsert({
        where: { organizationId: input.organizationId },
        create: {
          organizationId: input.organizationId,
          tokensUsedMonth: totalTokens,
        },
        update: {
          tokensUsedMonth: { increment: totalTokens },
        },
      });
    }
  }

  /**
   * 6. Human Confirmation Gate Enforcement
   */
  static assertHumanConfirmation(
    action: 'CRM_STATE_CHANGE' | 'SEND_MESSAGE' | 'MODIFY_INVOICE' | 'PUBLISH_CONTENT' | 'MODIFY_PERMISSIONS',
    confirmedByUserId?: string,
    confirmationFlag?: boolean
  ) {
    if (!confirmationFlag || !confirmedByUserId) {
      throw new Error(
        `AI Safety Gate: Action "${action}" requires explicit human confirmation. ` +
        `Autonomous execution is prohibited.`
      );
    }
  }

  /**
   * 7. Wrap Standard Draft Output
   */
  static wrapDraftResponse<T>(
    data: T,
    options: {
      feature: AiFeatureType;
      model?: string;
      tokensUsed?: number;
      latencyMs?: number;
    }
  ): GovernedAiResponse<T> {
    return {
      data,
      meta: {
        isAiGenerated: true,
        status: 'DRAFT',
        requiresHumanApproval: true,
        disclaimer: AI_DRAFT_DISCLAIMER,
        model: options.model || 'gemini-1.5-pro',
        feature: options.feature,
        tokensUsed: options.tokensUsed || 0,
        latencyMs: options.latencyMs || 0,
        timestamp: new Date().toISOString(),
      },
    };
  }
}
