import { z } from 'zod';

// Password Policy: Min 10 chars, 1 uppercase, 1 lowercase, 1 number, 1 special character
export const passwordSchema = z
  .string()
  .min(10, 'Password must be at least 10 characters long')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

// 1. Auth Schemas
export const RegisterRequestSchema = z.object({
  email: z.string().email('Valid email is required'),
  password: passwordSchema,
  name: z.string().min(2, 'Name must be at least 2 characters'),
  companyName: z.string().min(2, 'Company name is required'),
});

export const LoginRequestSchema = z.object({
  email: z.string().email('Valid email is required'),
  password: z.string().min(1, 'Password is required'),
});

export const MagicLinkRequestSchema = z.object({
  email: z.string().email('Valid email is required'),
});

// 2. Public Leads & Contact Submissions
export const StartProjectRequestSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  company: z.string().optional(),
  email: z.string().email('Valid email is required'),
  phone: z.string().optional(),
  website: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  country: z.string().default('USA'),
  serviceNeeded: z.enum(['premium-web', 'ai-automation', 'custom-saas', 'other']),
  approxBudget: z.string().min(1, 'Budget selection is required'),
  desiredTimeline: z.string().optional(),
  projectGoals: z.string().min(10, 'Please provide more details on your goals'),
  currentChallenges: z.string().optional(),
  message: z.string().min(10, 'Message is required'),
  consent: z.boolean().refine((v) => v === true, {
    message: 'You must accept the privacy policy to submit',
  }),
  // Tracking
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
  referrer: z.string().optional(),
});

export const ContactSubmissionSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  subject: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

// 3. Admin Ad-hoc Email Request
export const SendAdHocEmailSchema = z.object({
  recipient: z.string().email('Valid recipient email required'),
  subject: z.string().min(3, 'Subject is required'),
  bodyHtml: z.string().min(5, 'Email content is required'),
  senderAddress: z.enum(['hello@cyberstyle.net', 'billing@cyberstyle.net', 'support@cyberstyle.net']),
  attachmentKeys: z.array(z.string()).optional(),
});

// 4. Stripe Webhook Payload Schema
export const StripeWebhookHeadersSchema = z.object({
  'stripe-signature': z.string().min(1, 'Stripe signature header is required'),
});
