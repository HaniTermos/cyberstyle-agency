/**
 * CYBERSTYLE LLC — Client Analytics & Conversion Event Tracker (GA4 / GTM)
 */

export type AnalyticsEvent =
  | 'page_view'
  | 'lead_form_submit'
  | 'contact_form_submit'
  | 'start_project_submit'
  | 'proposal_viewed'
  | 'invoice_paid'
  | 'demo_call_booked'
  | 'booking_click'
  | 'service_cta_click'
  | 'work_case_study_view'
  | 'invoice_checkout_started'
  | 'purchase_payment_success';

export function trackEvent(eventName: AnalyticsEvent | string, params: Record<string, any> = {}) {
  if (typeof window === 'undefined') return;

  // 1. Google Tag Manager (dataLayer)
  if ((window as any).dataLayer) {
    (window as any).dataLayer.push({
      event: eventName,
      ...params,
      timestamp: new Date().toISOString(),
    });
  }

  // 2. Direct GA4 gtag
  if ((window as any).gtag) {
    (window as any).gtag('event', eventName, params);
  }

  if (process.env.NODE_ENV === 'development') {
    console.log(`📊 [Analytics Event] ${eventName}:`, params);
  }
}

/**
 * High-conversion shortcut triggers for key agency workflows
 */
export const AnalyticsEvents = {
  contactFormSubmit: (data?: Record<string, any>) => trackEvent('contact_form_submit', data),
  startProjectSubmit: (data?: Record<string, any>) => trackEvent('start_project_submit', data),
  proposalViewed: (proposalId: string, clientName?: string) =>
    trackEvent('proposal_viewed', { proposalId, clientName }),
  invoicePaid: (invoiceId: string, amount: number) =>
    trackEvent('invoice_paid', { invoiceId, value: amount, currency: 'USD' }),
  demoCallBooked: (data?: Record<string, any>) => trackEvent('demo_call_booked', data),
};
