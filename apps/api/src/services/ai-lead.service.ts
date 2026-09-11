import { GoogleGenAI } from '@google/genai';

export interface LeadDataInput {
  id?: string;
  name: string;
  company?: string | null;
  email: string;
  phone?: string | null;
  website?: string | null;
  serviceNeeded: string;
  approxBudget?: string | null;
  desiredTimeline?: string | null;
  projectGoals?: string | null;
  currentChallenges?: string | null;
  message?: string | null;
}

export interface LeadScoreResult {
  fitScore: number; // 0-100
  intentTier: 'HOT' | 'WARM' | 'COLD';
  reasoning: string;
  budgetAssessment: string;
  techStackSuggestions: string[];
  riskFactors: string[];
  recommendedAction: string;
}

export interface ProposalSOWResult {
  title: string;
  executiveSummary: string;
  scopeOfWork: string;
  deliverableMilestones: Array<{
    milestoneIndex: number;
    title: string;
    description: string;
    estimatedWeeks: number;
    cost: number;
  }>;
  estimatedWeeks: number;
  totalEstimate: number;
  recommendedRetainer: string;
  aiScore?: number;
  aiFitSummary?: string;
  aiRiskFactors?: string[];
}

export interface LoomScriptResult {
  targetName: string;
  targetCompany: string;
  totalDurationSeconds: number;
  sections: Array<{
    timestamp: string;
    sectionName: string;
    speakerScript: string;
    onScreenCue: string;
  }>;
  callToAction: string;
}

export interface LocalLeadInput {
  businessName: string;
  category?: string | null;
  website?: string | null;
  websiteStatus?: string | null; // "missing" | "social-only" | "broken" | "outdated" | "active"
  websiteScore?: number | null;
  rating?: string | null;
  reviewCount?: string | null;
  city?: string | null;
  address?: string | null;
  phone?: string | null;
  mapsUrl?: string | null;
}

export interface LocalLeadQualificationResult {
  score: number; // 0-100
  priority: 'hot' | 'warm' | 'cold' | 'unqualified';
  service: string;
  reason: string;
  recommended_offer: string;
  personalization_points: string[];
  draft_message: string;
}

export class AILeadService {
  private static getClient(): GoogleGenAI | null {
    // 1. Feature Flag check
    if (process.env.AI_LEAD_SCORING_ENABLED === 'false') {
      return null;
    }

    // 2. Server-Side Secure API Key Check
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return null;
    return new GoogleGenAI({ apiKey });
  }

  /**
   * Data Minimization: Sanitize inputs to only what is strictly necessary
   */
  private static sanitizeLeadInput(lead: LeadDataInput) {
    return {
      name: String(lead.name || 'Valued Prospect').slice(0, 100),
      company: lead.company ? String(lead.company).slice(0, 100) : null,
      serviceNeeded: String(lead.serviceNeeded || 'Web & AI Modernization').slice(0, 150),
      approxBudget: lead.approxBudget ? String(lead.approxBudget).slice(0, 50) : null,
      desiredTimeline: lead.desiredTimeline ? String(lead.desiredTimeline).slice(0, 50) : null,
      projectGoals: lead.projectGoals ? String(lead.projectGoals).slice(0, 500) : null,
      currentChallenges: lead.currentChallenges ? String(lead.currentChallenges).slice(0, 500) : null,
      message: lead.message ? String(lead.message).slice(0, 1000) : null,
    };
  }

  /**
   * Evaluates inbound lead and generates structured intelligence score
   */
  static async scoreLead(lead: LeadDataInput): Promise<LeadScoreResult> {
    const client = this.getClient();
    const cleanLead = this.sanitizeLeadInput(lead);

    if (client) {
      try {
        const prompt = `
You are an expert sales engineer and executive director at CYBERSTYLE LLC, a high-performance software agency building Next.js, AI systems, and enterprise cloud applications.
Analyze this inbound client lead and return a structured JSON evaluation.

LEAD DETAILS (Sanitized):
- Name: ${cleanLead.name}
- Company: ${cleanLead.company || 'N/A'}
- Service Needed: ${cleanLead.serviceNeeded}
- Approximate Budget: ${cleanLead.approxBudget || 'Undisclosed'}
- Desired Timeline: ${cleanLead.desiredTimeline || 'Flexible'}
- Project Goals: ${cleanLead.projectGoals || 'None provided'}
- Current Challenges: ${cleanLead.currentChallenges || 'None provided'}
- Inbound Message: ${cleanLead.message || 'None provided'}

CRITERIA:
1. fitScore: Integer 0 to 100 based on budget realism, scope clarity, and agency technical alignment.
2. intentTier: "HOT" (budget > $20k, clear urgent goals), "WARM" (moderate budget, good fit), or "COLD" (unrealistic budget, spam, or poor fit).
3. reasoning: 2-3 sentences explaining the rating.
4. budgetAssessment: Analysis of whether the budget matches market rates for the scope.
5. techStackSuggestions: Array of recommended technologies (e.g. Next.js 15, PostgreSQL, Redis, Gemini Flash, Docker, Stripe).
6. riskFactors: Array of 1-3 potential project or delivery risks.
7. recommendedAction: Concrete next step for the sales director.

Output ONLY valid JSON adhering to this schema.`;

        const response = await client.models.generateContent({
          model: 'gemini-3.7-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });

        if (response.text) {
          const parsed = JSON.parse(response.text);
          return {
            fitScore: Math.min(100, Math.max(0, Number(parsed.fitScore) || 85)),
            intentTier: ['HOT', 'WARM', 'COLD'].includes(parsed.intentTier) ? parsed.intentTier : 'WARM',
            reasoning: parsed.reasoning || 'Lead shows strong alignment with CYBERSTYLE engineering capabilities.',
            budgetAssessment: parsed.budgetAssessment || 'Budget is appropriate for multi-sprint architecture.',
            techStackSuggestions: Array.isArray(parsed.techStackSuggestions) ? parsed.techStackSuggestions : ['Next.js', 'PostgreSQL', 'TailwindCSS'],
            riskFactors: Array.isArray(parsed.riskFactors) ? parsed.riskFactors : ['Scope clarification required during discovery.'],
            recommendedAction: parsed.recommendedAction || 'Schedule a 20-minute discovery call and prepare proposal draft.',
          };
        }
      } catch (err: any) {
        console.warn('⚠️ Gemini API scoring note (falling back to deterministic evaluation):', err.message);
      }
    }

    // Heuristic Fallback Engine (when offline or API key missing)
    let score = 75;
    let tier: 'HOT' | 'WARM' | 'COLD' = 'WARM';

    const budgetStr = (cleanLead.approxBudget || '').toLowerCase();
    if (budgetStr.includes('50,000') || budgetStr.includes('100,000') || budgetStr.includes('enterprise')) {
      score = 94;
      tier = 'HOT';
    } else if (budgetStr.includes('5,000') || budgetStr.includes('1,000')) {
      score = 55;
      tier = 'COLD';
    } else {
      score = 82;
      tier = 'WARM';
    }

    return {
      fitScore: score,
      intentTier: tier,
      reasoning: `Lead from ${cleanLead.company || cleanLead.name} represents a high-potential opportunity requiring ${cleanLead.serviceNeeded}.`,
      budgetAssessment: `Stated budget (${cleanLead.approxBudget || 'Standard'}) is compatible with CYBERSTYLE milestone-based sprint delivery.`,
      techStackSuggestions: ['Next.js App Router', 'TypeScript', 'PostgreSQL & Prisma', 'BullMQ & Redis', 'Tailwind CSS', 'Stripe Billing'],
      riskFactors: ['Discovery session recommended to finalize non-functional SLA requirements.'],
      recommendedAction: 'Prepare tailored Scope-of-Work proposal and schedule video walkthrough.',
    };
  }

  /**
   * Generates a Scope-of-Work (SOW) proposal based on lead requirements
   */
  static async generateProposalSOW(lead: LeadDataInput): Promise<ProposalSOWResult> {
    const client = this.getClient();
    const cleanLead = this.sanitizeLeadInput(lead);

    if (client) {
      try {
        const prompt = `
You are the Chief Solutions Architect at CYBERSTYLE LLC.
Draft a comprehensive, highly professional, structured Scope-of-Work (SOW) Proposal for this prospect.

PROSPECT DETAILS:
- Client Name: ${cleanLead.name}
- Company: ${cleanLead.company || 'Confidential'}
- Service Requested: ${cleanLead.serviceNeeded}
- Approximate Budget: ${cleanLead.approxBudget || '$25,000 - $50,000'}
- Desired Timeline: ${cleanLead.desiredTimeline || '4-8 Weeks'}
- Goals: ${cleanLead.projectGoals || 'Modern high-converting web platform'}
- Challenges: ${cleanLead.currentChallenges || 'Legacy tech limitations'}

JSON STRUCTURE REQUIRED:
{
  "title": "Title of the proposal",
  "executiveSummary": "Concise 3-4 sentence value proposition and high-level architectural vision.",
  "scopeOfWork": "Detailed markdown breakdown covering Architecture, Frontend, Backend, Integrations, and Quality Assurance.",
  "deliverableMilestones": [
    {
      "milestoneIndex": 1,
      "title": "Milestone name",
      "description": "Deliverable summary",
      "estimatedWeeks": 2,
      "cost": 6000
    }
  ],
  "estimatedWeeks": 6,
  "totalEstimate": 24000,
  "recommendedRetainer": "Website Maintenance Retainer ($500/mo) OR AI Automation Management Retainer ($1,500/mo)"
}
Output ONLY valid JSON.`;

        const response = await client.models.generateContent({
          model: 'gemini-3.7-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });

        if (response.text) {
          const parsed = JSON.parse(response.text);
          return {
            title: parsed.title || `Engineering SOW: ${cleanLead.serviceNeeded} for ${cleanLead.company || cleanLead.name}`,
            executiveSummary: parsed.executiveSummary || 'CYBERSTYLE proposes a custom modern build ensuring high throughput, scalable infrastructure, and premier visual design.',
            scopeOfWork: parsed.scopeOfWork || '### Architecture & Core Deliverables\n- Modular multi-tenant system\n- Edge-cached API integration\n- Zero-trust security & automated tests',
            deliverableMilestones: Array.isArray(parsed.deliverableMilestones) && parsed.deliverableMilestones.length > 0
              ? parsed.deliverableMilestones
              : this.getDefaultMilestones(cleanLead),
            estimatedWeeks: Number(parsed.estimatedWeeks) || 6,
            totalEstimate: Number(parsed.totalEstimate) || 24000,
            recommendedRetainer: parsed.recommendedRetainer || 'AI Automation Management Retainer ($1,500/mo)',
          };
        }
      } catch (err: any) {
        console.warn('⚠️ Gemini API SOW note (falling back to deterministic SOW):', err.message);
      }
    }

    // Fallback Proposal SOW Generator
    const milestones = this.getDefaultMilestones(cleanLead);
    const totalEstimate = milestones.reduce((sum, m) => sum + m.cost, 0);

    return {
      title: `Technical Scope of Work: ${cleanLead.serviceNeeded} for ${cleanLead.company || cleanLead.name}`,
      executiveSummary: `CYBERSTYLE LLC proposes an accelerated engineering roadmap to architect, build, and deploy a bespoke ${cleanLead.serviceNeeded} platform tailored to the operational demands of ${cleanLead.company || cleanLead.name}. Our milestone-based delivery guarantees verified progress, complete IP ownership, and zero technical debt.`,
      scopeOfWork: `### Phase 1: Architectural Foundation & Discovery
- High-fidelity system design & database modeling
- Zero-trust authentication enclave & role-based access control
- Cloud infrastructure provisioning on hardened containerized stacks

### Phase 2: Core Engineering & Integration
- High-performance UI built with Next.js App Router and responsive layouts
- Realtime API integration with PostgreSQL persistence and Redis caching
- Automated CI/CD deployment pipeline with automated unit & end-to-end tests

### Phase 3: Launch, QA & SLA Onboarding
- Comprehensive load testing & Core Web Vitals optimization
- Stripe payment settlement & billing lifecycle integration
- Transition into dedicated monthly retainer maintenance`,
      deliverableMilestones: milestones,
      estimatedWeeks: 6,
      totalEstimate,
      recommendedRetainer: cleanLead.serviceNeeded.toLowerCase().includes('ai')
        ? 'AI Automation Management Retainer ($1,500/mo)'
        : 'Website Maintenance Retainer ($500/mo)',
    };
  }

  /**
   * Generates a 2-minute personalized video pitch script for Loom
   */
  static async generateLoomScript(lead: LeadDataInput, proposal?: ProposalSOWResult): Promise<LoomScriptResult> {
    const client = this.getClient();
    const cleanLead = this.sanitizeLeadInput(lead);
    const company = cleanLead.company || cleanLead.name;

    if (client) {
      try {
        const prompt = `
You are the Managing Partner at CYBERSTYLE LLC recording a personalized, high-converting 2-minute Loom video pitch for prospect ${cleanLead.name} at ${company}.
Write an authentic, punchy, confident, non-salesy pitch script broken down with on-screen camera cues and timestamped sections.

PROSPECT DETAILS:
- Prospect: ${cleanLead.name} at ${company}
- Service: ${cleanLead.serviceNeeded}
- Project Goals: ${cleanLead.projectGoals || 'Modernize platform and scale inbound operations'}
- Proposed Scope: ${proposal?.title || 'Custom Engineering Build'}

JSON STRUCTURE REQUIRED:
{
  "targetName": "${cleanLead.name}",
  "targetCompany": "${company}",
  "totalDurationSeconds": 120,
  "sections": [
    {
      "timestamp": "0:00 - 0:20",
      "sectionName": "The Hook & Context",
      "speakerScript": "Hey ${cleanLead.name}, reviewed your inquiry for ${company}...",
      "onScreenCue": "Camera full-screen, smiling, holding your custom architecture diagram."
    },
    {
      "timestamp": "0:20 - 0:50",
      "sectionName": "Diagnosing the Core Problem",
      "speakerScript": "...",
      "onScreenCue": "Screen share: Prospect's current website / wireframe."
    },
    {
      "timestamp": "0:50 - 1:35",
      "sectionName": "The CYBERSTYLE Solution & Architecture",
      "speakerScript": "...",
      "onScreenCue": "Screen share: CYBERSTYLE Interactive prototype or architecture diagram."
    },
    {
      "timestamp": "1:35 - 2:00",
      "sectionName": "Clear Call to Action",
      "speakerScript": "...",
      "onScreenCue": "Camera full-screen, pointing to scheduling link in proposal."
    }
  ],
  "callToAction": "Click the link below to book our 20-minute discovery workshop."
}
Output ONLY valid JSON.`;

        const response = await client.models.generateContent({
          model: 'gemini-3.7-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });

        if (response.text) {
          const parsed = JSON.parse(response.text);
          return {
            targetName: parsed.targetName || cleanLead.name,
            targetCompany: parsed.targetCompany || company,
            totalDurationSeconds: Number(parsed.totalDurationSeconds) || 120,
            sections: Array.isArray(parsed.sections) && parsed.sections.length > 0 ? parsed.sections : this.getDefaultLoomSections(cleanLead, company),
            callToAction: parsed.callToAction || 'Schedule a 20-minute live architectural review call.',
          };
        }
      } catch (err: any) {
        console.warn('⚠️ Gemini API Loom note (falling back to deterministic script):', err.message);
      }
    }

    // Fallback Loom Script
    return {
      targetName: cleanLead.name,
      targetCompany: company,
      totalDurationSeconds: 120,
      sections: this.getDefaultLoomSections(cleanLead, company),
      callToAction: 'Click the calendar link below to lock in a 20-minute architectural deep dive with our engineering lead.',
    };
  }

  // --- PRIVATE HELPERS ---

  private static getDefaultMilestones(lead: { name: string; serviceNeeded: string }) {
    return [
      {
        milestoneIndex: 1,
        title: 'Sprint 1: System Architecture & Technical Discovery',
        description: 'Hardened database schema, auth enclave, API specifications, and Figma interactive wireframes.',
        estimatedWeeks: 2,
        cost: 6500,
      },
      {
        milestoneIndex: 2,
        title: 'Sprint 2: Core Application & Integration Engine',
        description: `Full implementation of ${lead.serviceNeeded} with responsive UI and authenticated backend API.`,
        estimatedWeeks: 3,
        cost: 11000,
      },
      {
        milestoneIndex: 3,
        title: 'Sprint 3: Quality Assurance, Security Audit & Deployment',
        description: 'End-to-end automated testing, Core Web Vitals optimization, and production cloud launch.',
        estimatedWeeks: 1,
        cost: 6500,
      },
    ];
  }

  private static getDefaultLoomSections(lead: { name: string; projectGoals?: string | null; serviceNeeded: string }, company: string) {
    return [
      {
        timestamp: '0:00 - 0:20',
        sectionName: 'The Hook & Personalized Context',
        speakerScript: `Hey ${lead.name}! I personally reviewed your inquiry for ${company} regarding ${lead.serviceNeeded}. Rather than sending a generic PDF proposal, I wanted to record a quick 2-minute walkthrough of how we would architect this from day one.`,
        onScreenCue: 'Camera on speaker with CYBERSTYLE brand backdrop, engaging directly with client name.',
      },
      {
        timestamp: '0:20 - 0:50',
        sectionName: 'Diagnosing the Technical Bottlenecks',
        speakerScript: `Looking at your goals around ${lead.projectGoals || 'scaling your digital operations'}, the primary challenge most teams face is technical debt and unoptimized pipelines. Our approach eliminates friction by leveraging a unified Next.js App Router and PostgreSQL architecture.`,
        onScreenCue: 'Switch to screen share: Show prospect current site or Figma blueprint highlighting areas of improvement.',
      },
      {
        timestamp: '0:50 - 1:35',
        sectionName: 'The Proposed Sprint Roadmap',
        speakerScript: `We have mapped this out across three rapid milestones: Sprint 1 covers architecture and interactive design; Sprint 2 delivers the full functional core; and Sprint 3 handles automated testing and production cloud launch. Everything is backed by milestone escrow and transparent deliverables.`,
        onScreenCue: 'Screen share: CYBERSTYLE Interactive Milestone & Sprint Schedule matrix.',
      },
      {
        timestamp: '1:35 - 2:00',
        sectionName: 'Clear Next Step / Call to Action',
        speakerScript: `I've attached our itemized Scope of Work and milestone breakdown below. If this vision aligns with what you want to achieve at ${company}, click the link to pick a 20-minute slot on our calendar this week. Talk soon!`,
        onScreenCue: 'Switch back to camera on speaker with calendar link callout highlighted on screen.',
      },
    ];
  }

  /**
   * Qualifies a local business lead researched on Google Maps
   */
  static async qualifyLocalLead(input: LocalLeadInput): Promise<LocalLeadQualificationResult> {
    const client = this.getClient();
    const company = input.businessName.trim() || 'Local Business';
    const category = input.category || 'Local Enterprise';
    const website = input.website || 'None';
    const websiteStatus = input.websiteStatus || (input.website ? 'active' : 'missing');
    const websiteScore = input.websiteScore !== undefined && input.websiteScore !== null ? Number(input.websiteScore) : (input.website ? 50 : 0);
    const rating = input.rating || 'N/A';
    const reviewCount = input.reviewCount || '0';
    const city = input.city || input.address || 'Regional Market';

    if (client) {
      try {
        const prompt = `
You are the Executive Growth & Sales Engineering Director at CYBERSTYLE LLC, a high-end digital agency specializing in modern Next.js 15 web applications, AI automations, custom client portals, 3D interactive canvases, and enterprise engineering.

Analyze this local business prospect discovered during market research on Google Maps:

PROSPECT INFORMATION:
- Business Name: ${company}
- Category / Industry: ${category}
- Website: ${website}
- Website Status: ${websiteStatus} (e.g. missing, social-only, outdated, active)
- Website Audit Score: ${websiteScore}/100
- Google Rating: ${rating} (${reviewCount} reviews)
- Location: ${city}

CYBERSTYLE SERVICES CATALOG:
1. "website" -> Modern Next.js high-converting responsive website with sub-second load times & SEO.
2. "ecommerce" -> Custom headless commerce platform or integrated Stripe store.
3. "ai-automation" -> AI customer service chatbot, lead routing, and workflow automations.
4. "booking-system" -> Automated scheduling, customer intake, and SMS/Email reminders.
5. "3d-configurator" -> Interactive WebGL/Three.js product visualizer or interactive canvas.
6. "maintenance" -> Retainer for uptime monitoring, security updates, and performance optimization.

TASK:
1. score: Integer 0 to 100 based on agency sales opportunity (e.g., missing site with high review count = high score 85-95; broken/outdated site = 75-90; already modern site = 30-50).
2. priority: "hot" (score >= 80), "warm" (60-79), "cold" (40-59), or "unqualified" (< 40).
3. service: Select exactly one best-fit service key from catalog: "website", "ecommerce", "ai-automation", "booking-system", "3d-configurator", or "maintenance".
4. reason: 2-3 concise sentences explaining the business opportunity and why they would benefit from CYBERSTYLE.
5. recommended_offer: A crisp, professional offer headline (e.g. "Modern Next.js 15 Web Presence & Instant Booking Portal").
6. personalization_points: Array of 2-3 specific observations about their business, reviews, or digital gaps.
7. draft_message: A polite, personalized, non-pushy email/message draft from CyberStyle LLC introducing practical ideas for improving their online presence and conversion. Keep it conversational and concise.

JSON SCHEMA REQUIRED:
{
  "score": number,
  "priority": "hot" | "warm" | "cold" | "unqualified",
  "service": string,
  "reason": string,
  "recommended_offer": string,
  "personalization_points": string[],
  "draft_message": string
}

Output ONLY valid JSON.`;

        const response = await client.models.generateContent({
          model: 'gemini-3.7-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });

        if (response.text) {
          const parsed = JSON.parse(response.text);
          const score = Math.min(100, Math.max(0, Number(parsed.score) || 75));
          let priority: 'hot' | 'warm' | 'cold' | 'unqualified' = 'warm';
          if (score >= 80) priority = 'hot';
          else if (score >= 60) priority = 'warm';
          else if (score >= 40) priority = 'cold';
          else priority = 'unqualified';

          return {
            score,
            priority: ['hot', 'warm', 'cold', 'unqualified'].includes(parsed.priority) ? parsed.priority : priority,
            service: parsed.service || 'website',
            reason: parsed.reason || `${company} presents a solid opportunity for digital transformation.`,
            recommended_offer: parsed.recommended_offer || 'Custom High-Performance Next.js Web Presence',
            personalization_points: Array.isArray(parsed.personalization_points) && parsed.personalization_points.length > 0
              ? parsed.personalization_points
              : [`Discovered ${category} business in ${city}`, `Current digital rating: ${rating} stars across ${reviewCount} reviews`],
            draft_message: parsed.draft_message || this.getDefaultLocalOutreachDraft(company, category, parsed.recommended_offer || 'a modern web platform'),
          };
        }
      } catch (err: any) {
        console.warn('⚠️ Gemini API Local Lead note (falling back to deterministic qualification):', err.message);
      }
    }

    // Heuristic Fallback Qualification
    let score = 50;
    let priority: 'hot' | 'warm' | 'cold' | 'unqualified' = 'warm';
    let service = 'website';
    let offer = 'Custom High-Performance Next.js Web Presence';

    if (websiteStatus === 'missing' || !input.website) {
      score = 90;
      priority = 'hot';
      service = 'website';
      offer = 'Modern Next.js Web Architecture & Google Local SEO System';
    } else if (websiteStatus === 'social-only') {
      score = 85;
      priority = 'hot';
      service = 'website';
      offer = 'Dedicated Brand Domain & High-Converting Client Portal';
    } else if (websiteScore < 50 || websiteStatus === 'outdated') {
      score = 78;
      priority = 'warm';
      service = 'website';
      offer = 'Full Web Platform Redesign with Sub-Second Core Web Vitals';
    } else if (category.toLowerCase().includes('restaurant') || category.toLowerCase().includes('clinic') || category.toLowerCase().includes('dentist') || category.toLowerCase().includes('salon')) {
      score = 75;
      priority = 'warm';
      service = 'booking-system';
      offer = 'Automated 24/7 Online Booking & Client Intake Flow';
    } else {
      score = 65;
      priority = 'warm';
      service = 'ai-automation';
      offer = 'AI Customer Assistant & Lead Qualification System';
    }

    return {
      score,
      priority,
      service,
      reason: `${company} is an established ${category} in ${city} with ${rating}★ reputation (${reviewCount} reviews). Enhancing their digital presence with ${offer} will capture untapped local customer demand.`,
      recommended_offer: offer,
      personalization_points: [
        `Reputable ${category} in ${city} with ${reviewCount} customer reviews`,
        websiteStatus === 'missing' ? 'Currently lacks a dedicated modern web domain' : `Digital evaluation score: ${websiteScore}/100`,
      ],
      draft_message: this.getDefaultLocalOutreachDraft(company, category, offer),
    };
  }

  private static getDefaultLocalOutreachDraft(company: string, category: string, opportunityOffer: string): string {
    return `Hello ${company} team,

I came across ${company} while researching top ${category} businesses in your area. Your strong reputation (${category}) really stood out.

I noticed an opportunity where a modern digital upgrade—specifically ${opportunityOffer}—could help streamline your customer intake and capture more local inquiries directly.

I’m with CyberStyle LLC. We build high-performance web applications, AI automations, and custom software for ambitious businesses.

Would you be open to receiving 2 or 3 quick, practical ideas we put together for your online presence? No pitch or obligations—just useful insights.

Best regards,
CyberStyle Growth Team
https://cyberstyle.dev`;
  }
}

