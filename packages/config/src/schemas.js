"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripeWebhookHeadersSchema = exports.SendAdHocEmailSchema = exports.ContactSubmissionSchema = exports.StartProjectRequestSchema = exports.MagicLinkRequestSchema = exports.LoginRequestSchema = exports.RegisterRequestSchema = exports.passwordSchema = void 0;
var zod_1 = require("zod");
// Password Policy: Min 10 chars, 1 uppercase, 1 lowercase, 1 number, 1 special character
exports.passwordSchema = zod_1.z
    .string()
    .min(10, 'Password must be at least 10 characters long')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');
// 1. Auth Schemas
exports.RegisterRequestSchema = zod_1.z.object({
    email: zod_1.z.string().email('Valid email is required'),
    password: exports.passwordSchema,
    name: zod_1.z.string().min(2, 'Name must be at least 2 characters'),
    companyName: zod_1.z.string().min(2, 'Company name is required'),
});
exports.LoginRequestSchema = zod_1.z.object({
    email: zod_1.z.string().email('Valid email is required'),
    password: zod_1.z.string().min(1, 'Password is required'),
});
exports.MagicLinkRequestSchema = zod_1.z.object({
    email: zod_1.z.string().email('Valid email is required'),
});
// 2. Public Leads & Contact Submissions
exports.StartProjectRequestSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, 'Name is required'),
    company: zod_1.z.string().optional(),
    email: zod_1.z.string().email('Valid email is required'),
    phone: zod_1.z.string().optional(),
    website: zod_1.z.string().url('Must be a valid URL').optional().or(zod_1.z.literal('')),
    country: zod_1.z.string().default('USA'),
    serviceNeeded: zod_1.z.enum(['premium-web', 'ai-automation', 'custom-saas', 'other']),
    approxBudget: zod_1.z.string().min(1, 'Budget selection is required'),
    desiredTimeline: zod_1.z.string().optional(),
    projectGoals: zod_1.z.string().min(10, 'Please provide more details on your goals'),
    currentChallenges: zod_1.z.string().optional(),
    message: zod_1.z.string().min(10, 'Message is required'),
    consent: zod_1.z.boolean().refine(function (v) { return v === true; }, {
        message: 'You must accept the privacy policy to submit',
    }),
    // Tracking
    utmSource: zod_1.z.string().optional(),
    utmMedium: zod_1.z.string().optional(),
    utmCampaign: zod_1.z.string().optional(),
    referrer: zod_1.z.string().optional(),
});
exports.ContactSubmissionSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, 'Name is required'),
    email: zod_1.z.string().email('Valid email is required'),
    subject: zod_1.z.string().optional(),
    message: zod_1.z.string().min(10, 'Message must be at least 10 characters'),
});
// 3. Admin Ad-hoc Email Request
exports.SendAdHocEmailSchema = zod_1.z.object({
    recipient: zod_1.z.string().email('Valid recipient email required'),
    subject: zod_1.z.string().min(3, 'Subject is required'),
    bodyHtml: zod_1.z.string().min(5, 'Email content is required'),
    senderAddress: zod_1.z.enum(['hello@cyberstyle.net', 'billing@cyberstyle.net', 'support@cyberstyle.net']),
    attachmentKeys: zod_1.z.array(zod_1.z.string()).optional(),
});
// 4. Stripe Webhook Payload Schema
exports.StripeWebhookHeadersSchema = zod_1.z.object({
    'stripe-signature': zod_1.z.string().min(1, 'Stripe signature header is required'),
});
