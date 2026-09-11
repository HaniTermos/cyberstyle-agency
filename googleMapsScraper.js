// ==UserScript==
// @name         CyberStyle Local Growth Intelligence Assistant
// @namespace    https://cyberstyle.net/
// @version      9.5.0
// @description  CyberStyle Local Growth Intelligence is a manual, single-business research assistant. It does not bulk-harvest Google Maps listings, automatically message businesses, or bypass platform protections. Helps operators capture verified business contact data one-by-one and sync to CYBERSTYLE CRM Dashboard.
// @author       CYBERSTYLE Engineering Team
// @match        *://*.google.com/maps*
// @match        *://*.google.com.*/maps*
// @match        *://*.google.*/maps*
// @match        *://maps.google.com/*
// @match        *://maps.google.*/*
// @include      *://*.google.*/maps*
// @include      *://*.google.com/maps*
// @include      *://maps.google.*/*
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @connect      localhost
// @connect      127.0.0.1
// @connect      *
// @run-at       document-start
// ==/UserScript==

(function () {
  'use strict';

  // ============================================================================
  // 1. UNIVERSAL GM API SAFE FALLBACKS (Tampermonkey, Violentmonkey, DevTools)
  // ============================================================================
  const _GM_getValue = (typeof GM_getValue !== 'undefined')
    ? GM_getValue
    : (k, d) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } };

  const _GM_setValue = (typeof GM_setValue !== 'undefined')
    ? GM_setValue
    : (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

  const _GM_setClipboard = (typeof GM_setClipboard !== 'undefined')
    ? GM_setClipboard
    : (text) => {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text);
        } else {
          const ta = document.createElement('textarea');
          ta.value = text;
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
        }
      };

  const _GM_xmlhttpRequest = (typeof GM_xmlhttpRequest !== 'undefined')
    ? GM_xmlhttpRequest
    : (opts) => {
        fetch(opts.url, {
          method: opts.method || 'GET',
          headers: opts.headers,
          body: opts.data,
        })
          .then(async (r) => {
            const text = await r.text();
            if (opts.onload) opts.onload({ status: r.status, responseText: text });
          })
          .catch((err) => {
            if (opts.onerror) opts.onerror(err);
          });
      };

  // ============================================================================
  // 2. GLOBAL REGIONS, PRESETS & NICHES (USA, Canada, MEA, UK, Europe, Australia)
  // ============================================================================
  const APP_NAME = 'CYBERSTYLE Growth Engine UNBEATABLE';
  const APP_VERSION = '9.5.0';

  const GLOBAL_REGIONS = {
    'USA — All Metros & States': [
      'United States (Nationwide)',
      'Austin, TX',
      'Miami, FL',
      'New York, NY',
      'Los Angeles, CA',
      'Dallas, TX',
      'Atlanta, GA',
      'Denver, CO',
      'Phoenix, AZ',
      'Seattle, WA',
      'Chicago, IL',
      'Houston, TX',
      'Scottsdale, AZ',
      'Boston, MA',
      'San Francisco, CA',
      'Las Vegas, NV',
      'San Diego, CA',
      'Nashville, TN',
      'Tampa, FL',
      'Charlotte, NC',
      'Orlando, FL',
      'Philadelphia, PA',
      'San Antonio, TX',
      'Salt Lake City, UT',
      'Portland, OR',
      'Minneapolis, MN',
    ],
    'Canada — Provinces & Cities': [
      'Canada (Nationwide)',
      'Toronto, ON',
      'Vancouver, BC',
      'Montreal, QC',
      'Calgary, AB',
      'Ottawa, ON',
      'Edmonton, AB',
      'Quebec City, QC',
      'Winnipeg, MB',
      'Halifax, NS',
      'Victoria, BC',
    ],
    'MEA & GCC — Middle East & North Africa': [
      'GCC / Middle East (Region-wide)',
      'Dubai, United Arab Emirates',
      'Abu Dhabi, United Arab Emirates',
      'Riyadh, Saudi Arabia',
      'Jeddah, Saudi Arabia',
      'Dammam, Saudi Arabia',
      'Doha, Qatar',
      'Kuwait City, Kuwait',
      'Manama, Bahrain',
      'Muscat, Oman',
      'Cairo, Egypt',
      'Alexandria, Egypt',
      'Beirut, Lebanon',
      'Amman, Jordan',
      'Casablanca, Morocco',
    ],
    'UK & Europe': [
      'United Kingdom (Nationwide)',
      'London, UK',
      'Manchester, UK',
      'Birmingham, UK',
      'Edinburgh, UK',
      'Dublin, Ireland',
      'Paris, France',
      'Berlin, Germany',
      'Munich, Germany',
      'Frankfurt, Germany',
      'Zurich, Switzerland',
      'Geneva, Switzerland',
      'Amsterdam, Netherlands',
      'Madrid, Spain',
      'Barcelona, Spain',
      'Milan, Italy',
      'Rome, Italy',
      'Vienna, Austria',
      'Stockholm, Sweden',
    ],
    'Australia & New Zealand': [
      'Australia (Nationwide)',
      'Sydney, NSW',
      'Melbourne, VIC',
      'Brisbane, QLD',
      'Perth, WA',
      'Adelaide, SA',
      'Gold Coast, QLD',
      'Auckland, New Zealand',
      'Wellington, New Zealand',
      'Christchurch, New Zealand',
    ],
  };

  const TARGET_NICHES = [
    'Dentists & Orthodontists',
    'Med Spas & Plastic Surgery',
    'Law Firms & Attorneys',
    'Luxury Custom Home Builders',
    'Roofing & Solar Contractors',
    'HVAC & Plumbing Services',
    'Fine Dining & Steakhouses',
    'Auto Dealerships & Exotic Rentals',
    'Real Estate Brokerages',
    'Chiropractors & Physical Therapy',
    'Accounting & Wealth Management',
    'High-End Hair Salons & Barbers',
    'Veterinary Clinics & Animal Hospitals',
    'Private Gyms & Crossfit Studios',
    'Event Venues & Wedding Planners',
    'Commercial Cleaning & Janitorial',
    'Electricians & Smart Home Automation',
    'Yacht & Boat Charter Services',
  ];

  const SOCIAL_DOMAINS_REGEX = /(instagram\.com|facebook\.com|fb\.me|fb\.com|twitter\.com|x\.com|linkedin\.com|tiktok\.com|youtube\.com|pinterest\.com|threads\.net)/i;
  const AGGREGATOR_DOMAINS_REGEX = /(yelp\.com|yellowpages\.com|tripadvisor\.com|grubhub\.com|ubereats\.com|doordash\.com|postmates\.com|menufy\.com|zomato\.com|opentable\.com|thumbtack\.com|angi\.com|homeadvisor\.com|talabat\.com|deliveroo\.)/i;
  const FREE_BUILDERS_REGEX = /(\.wordpress\.com|\.wixsite\.com|\.weebly\.com|\.godaddysites\.com|\.square\.site|\.carrd\.co|\.myshopify\.com|\.site123\.me|\.jimdosite\.com)/i;
  const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const PHONE_INTL_REGEX = /(?:\+|00)?(?:\d{1,4}[\s\-\.]?)?(?:\(?\d{2,5}\)?[\s\-\.]?)?\d{3,4}[\s\-\.]?\d{3,4}(?:[\s\-\.]?\d{1,5})?/g;

  const DEFAULT_SETTINGS = {
    apiUrl: 'http://localhost:4000/api',
    dashboardUrl: 'http://localhost:3000/admin/leads',
    autoSyncToDashboard: true, // Auto-push newly discovered leads directly to PostgreSQL CRM
    agencyWebsite: 'https://cyberstyle.net',
  };

  function getSettings() {
    return _GM_getValue('cyberstyle_settings', DEFAULT_SETTINGS);
  }

  function saveSettings(s) {
    _GM_setValue('cyberstyle_settings', s);
  }

  function getBatchLeads() {
    return _GM_getValue('cyberstyle_batch_leads', []);
  }

  function saveBatchLeads(leads) {
    _GM_setValue('cyberstyle_batch_leads', leads);
  }

  let activeLead = null;
  let isPanelMinimized = _GM_getValue('cyberstyle_minimized', false);
  let activeTab = 'active'; // 'active' | 'scanner' | 'batch' | 'export' | 'settings'
  let batchFilter = 'ALL'; // 'ALL' | 'NO_WEBSITE' | 'SOCIAL_ONLY' | 'NO_SOCIAL' | 'DIGITAL_GHOST' | 'HOT' | 'HIGH_RATED' | 'WITH_PHONE' | 'WITH_EMAIL'
  let sortBy = 'SCORE_DESC'; // 'SCORE_DESC' | 'SCORE_ASC' | 'RATING_DESC' | 'RATING_ASC' | 'REVIEWS_DESC' | 'REVIEWS_ASC' | 'NAME_ASC' | 'NAME_DESC' | 'DATE_DESC'
  let selectedRegionCategory = 'USA — All Metros & States';
  let isAutoScanning = false;
  let autoScanInterval = null;
  let searchFilterQuery = '';
  let dashboardConnected = false;
  let lastSyncStatus = 'Ready';

  // ============================================================================
  // 3. MULTI-LAYER ULTRA-ACCURATE SCRAPER (NO FALSE NEGATIVES)
  // ============================================================================
  function unwrapGoogleUrl(url) {
    if (!url) return '';
    if (url.includes('google.com/url?q=')) {
      try {
        const u = new URL(url);
        return u.searchParams.get('q') || url;
      } catch {
        return url;
      }
    }
    return url;
  }

  function extractActiveBusiness() {
    try {
      // 1. Business Name (Multi-lingual & Responsive classes)
      const nameEl = document.querySelector(
        'h1.DUwDvf, h1.fontHeadlineLarge, div.fontHeadlineLarge, h1[class*="header"], div.qBF1Pd, div.NrDZNb, div[role="main"] h1'
      );
      const name = nameEl ? nameEl.innerText.trim() : '';
      if (!name) return null;

      // 2. Category / Industry
      const catEl = document.querySelector(
        'button[jsaction*="category"], span.DkEaL, span.fontBodyMedium, button[class*="category"], div.W4Efsd span, button[jsaction*="pane.rating.category"]'
      );
      const category = catEl ? catEl.innerText.trim() : 'Local Business';

      // 3. Rating
      const ratingEl = document.querySelector(
        'div.F7nice span[aria-hidden="true"], span.ceNzKf, span[class*="rating"], span[aria-label*="stars"], span[aria-label*="نجوم"], span[aria-label*="étoiles"]'
      );
      const rating = ratingEl ? ratingEl.innerText.trim() : '';

      // 4. Review Count
      const reviewsEl = document.querySelector(
        'div.F7nice span:last-child, span[aria-label*="reviews"], span[aria-label*="تقييم"], span[aria-label*="review"], span[aria-label*="avis"], span[aria-label*="bewertungen"]'
      );
      let reviewCount = '';
      if (reviewsEl) {
        const match = reviewsEl.innerText.match(/[\d,]+/);
        reviewCount = match ? match[0].replace(/,/g, '') : '';
      }

      // 5. Multi-Layer Website Extraction (Checking All Authority Links, Data Attributes & Generic Outbound Links)
      let website = '';
      const authorityLink = document.querySelector(
        'a[data-item-id="authority"], a[data-value="Website"], a[data-value*="Website" i], a[data-value*="الموقع" i], a[data-value*="Site" i], a[aria-label*="Website" i], a[aria-label*="website" i], a[aria-label*="الموقع" i], a[aria-label*="Site" i], a[aria-label*="Webseite" i], a[data-tooltip*="website" i], a.CsEnBe[href^="http"]'
      );
      if (authorityLink) {
        website = unwrapGoogleUrl(authorityLink.href);
      }

      // Secondary website fallback: Search within main info container for any outbound non-Google link
      if (!website) {
        const infoPane = document.querySelector('div[role="main"], div.m6QErb.DxyBCb, div.m6QErb, div.TIHn2');
        if (infoPane) {
          const externalLinks = Array.from(infoPane.querySelectorAll('a[href^="http"]'));
          for (const a of externalLinks) {
            const h = unwrapGoogleUrl(a.href);
            if (!h.includes('google.com') && !h.includes('gstatic.com') && !h.includes('schema.org') && !h.includes('ggpht.com') && !h.includes('googleapis.com')) {
              website = h;
              break;
            }
          }
        }
      }

      // 6. Multi-Layer Phone Extraction (Buttons, Links, Data Attributes, Micro-Containers, Plaintext Regex)
      let phone = '';
      const phoneBtn = document.querySelector(
        'button[data-item-id*="phone"], button[data-tooltip*="phone" i], button[aria-label*="Phone" i], button[aria-label*="phone" i], button[aria-label*="الهاتف" i], button[aria-label*="Téléphone" i], button[aria-label*="Teléfono" i], button[aria-label*="Telefon" i], button[aria-label*="Call" i], button[aria-label*="اتصال" i], a[href^="tel:"], div[data-item-id*="phone"]'
      );
      if (phoneBtn) {
        const rawPhoneText = phoneBtn.getAttribute('aria-label') || phoneBtn.innerText || '';
        phone = rawPhoneText
          .replace(/(Phone|Call phone number|Call|الهاتف|رقم الهاتف|اتصال|Téléphone|Teléfono|Telefon|Tel):\s*/gi, '')
          .replace(/[\r\n]+/g, ' ')
          .trim();
      }

      if (!phone) {
        const telLink = document.querySelector('a[href^="tel:"]');
        if (telLink) {
          phone = telLink.href.replace('tel:', '').trim();
        }
      }

      // Secondary phone fallback: Universal Regex scan inside info blocks & text elements
      if (!phone) {
        const phoneBlocks = document.querySelectorAll('button, div.Io6YTe, div.rogA2c, div.CsEnBe, span.UsdlK, div.W4Efsd');
        const phoneRegex = /(?:\+|00)?(?:\d{1,4}[-.\s]?)?(?:\(?\d{2,5}\)?[-.\s]?)?\d{3,4}[-.\s]?\d{3,4}/;
        for (const block of phoneBlocks) {
          const text = block.innerText || '';
          if (text.length >= 7 && phoneRegex.test(text)) {
            const m = text.match(phoneRegex);
            if (m && m[0].replace(/\D/g, '').length >= 7) {
              phone = m[0].trim();
              break;
            }
          }
        }
      }

      // 7. Physical Address Extraction
      let address = '';
      const addressBtn = document.querySelector(
        'button[data-item-id="address"], button[data-item-id*="oloc"], button[aria-label*="Address" i], button[aria-label*="address" i], button[aria-label*="العنوان" i], button[aria-label*="Adresse" i], button[aria-label*="Dirección" i]'
      );
      if (addressBtn) {
        address = (addressBtn.getAttribute('aria-label') || addressBtn.innerText || '')
          .replace(/(Address|العنوان|Adresse|Dirección):\s*/gi, '')
          .replace(/[\r\n]+/g, ' ')
          .trim();
      }

      // 8. Working Hours & Open Status
      let workingHours = '';
      const hoursEl = document.querySelector(
        'div[data-item-id="oh"], div[aria-label*="Hours" i], div[aria-label*="hours" i], span.ZDu9vd, div.OqCZI, div[aria-label*="ساعات" i], div[aria-label*="Heures" i]'
      );
      if (hoursEl) {
        workingHours = (hoursEl.getAttribute('aria-label') || hoursEl.innerText || '').replace(/[\r\n]+/g, ' ').trim();
      }

      // 9. Coordinates
      let latitude = '';
      let longitude = '';
      const urlMatch = window.location.href.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
      if (urlMatch) {
        latitude = urlMatch[1];
        longitude = urlMatch[2];
      }

      // 10. Multi-Layer Email Extraction (Mailto links, in-page Regex, and clean domain inference)
      let email = '';
      const mailtoEl = document.querySelector('a[href^="mailto:"]');
      if (mailtoEl) {
        email = mailtoEl.href.replace('mailto:', '').split('?')[0].trim();
      }

      if (!email) {
        const pageText = document.body.innerText || '';
        const emailMatches = pageText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi);
        if (emailMatches) {
          const valid = emailMatches.find((e) => !e.includes('google.com') && !e.includes('schema.org') && !e.endsWith('.png') && !e.endsWith('.jpg'));
          if (valid) email = valid.trim();
        }
      }

      if (!email && website && !SOCIAL_DOMAINS_REGEX.test(website) && !AGGREGATOR_DOMAINS_REGEX.test(website)) {
        try {
          const domain = new URL(website.startsWith('http') ? website : `https://${website}`).hostname.replace(/^www\./, '');
          email = `info@${domain}`;
        } catch {}
      }

      // Address Parsing
      const addressParts = address ? address.split(',').map((s) => s.trim()) : [];
      const country = addressParts.length > 0 ? addressParts[addressParts.length - 1] : '';
      const stateOrCity = addressParts.length > 1 ? addressParts[addressParts.length - 2] : '';

      const lead = {
        id: 'lead_' + Math.random().toString(36).substring(2, 9),
        name,
        company: name,
        category,
        phone,
        email: email || '',
        website: website || '',
        address,
        city: stateOrCity,
        country: country || 'Global',
        workingHours: workingHours || 'Standard Business Hours',
        rating: rating || '5.0',
        reviewCount: reviewCount || '1',
        latitude,
        longitude,
        mapsUrl: window.location.href,

        // Deep Presence Deficit Audit
        hasWebsite: false,
        websiteStatus: 'unknown',
        websiteScore: 0,

        hasSocial: false,
        socialStatus: 'missing',
        isDigitalGhost: false,

        socialProfiles: {
          facebook: '',
          instagram: '',
          linkedin: '',
          twitter: '',
          tiktok: '',
          youtube: '',
          pinterest: '',
        },

        leadScore: 0,
        priority: 'unqualified',
        opportunityType: 'website',
        suggestedOffer: '',
        dateScraped: new Date().toISOString().slice(0, 10),
      };

      auditWebsitePresence(lead);
      auditSocialPresence(lead);
      lead.isDigitalGhost = (!lead.hasWebsite || lead.websiteStatus === 'missing') && !lead.hasSocial;
      lead.leadScore = calculateLeadScore(lead);
      lead.priority = getPriority(lead.leadScore);
      lead.suggestedOffer = getSuggestedOffer(lead);

      return lead;
    } catch (err) {
      return null;
    }
  }

  function auditWebsitePresence(lead) {
    if (!lead.website || lead.website.trim() === '') {
      lead.hasWebsite = false;
      lead.websiteStatus = 'missing';
      lead.websiteScore = 0;
      return;
    }

    // 1. Social Domain as Primary Website
    if (SOCIAL_DOMAINS_REGEX.test(lead.website)) {
      lead.hasWebsite = false;
      lead.websiteStatus = 'social-only';
      lead.websiteScore = 20;
      lead.hasSocial = true;
      lead.socialStatus = 'social-only';
      const w = lead.website.toLowerCase();
      if (w.includes('instagram.com')) lead.socialProfiles.instagram = lead.website;
      if (w.includes('facebook.com') || w.includes('fb.me')) lead.socialProfiles.facebook = lead.website;
      if (w.includes('tiktok.com')) lead.socialProfiles.tiktok = lead.website;
      if (w.includes('linkedin.com')) lead.socialProfiles.linkedin = lead.website;
      if (w.includes('twitter.com') || w.includes('x.com')) lead.socialProfiles.twitter = lead.website;
      if (w.includes('youtube.com')) lead.socialProfiles.youtube = lead.website;
      return;
    }

    // 2. Directory / Aggregator Listing
    if (AGGREGATOR_DOMAINS_REGEX.test(lead.website)) {
      lead.hasWebsite = false;
      lead.websiteStatus = 'aggregator-only';
      lead.websiteScore = 15;
      return;
    }

    // 3. Free DIY Builder Subdomains
    if (FREE_BUILDERS_REGEX.test(lead.website)) {
      lead.hasWebsite = true;
      lead.websiteStatus = 'free-builder';
      lead.websiteScore = 35;
      return;
    }

    // 4. Insecure HTTP Check
    if (lead.website.startsWith('http://')) {
      lead.hasWebsite = true;
      lead.websiteStatus = 'http-insecure';
      lead.websiteScore = 45;
      return;
    }

    // 5. Active Custom Domain
    lead.hasWebsite = true;
    lead.websiteStatus = 'active';
    lead.websiteScore = 85;
  }

  function auditSocialPresence(lead) {
    const socialLinks = Array.from(
      document.querySelectorAll(
        'a[href*="facebook.com"], a[href*="fb.me"], a[href*="instagram.com"], a[href*="linkedin.com"], a[href*="twitter.com"], a[href*="x.com"], a[href*="tiktok.com"], a[href*="youtube.com"], a[href*="pinterest.com"], a[href*="threads.net"]'
      )
    );

    if (socialLinks.length > 0) {
      lead.hasSocial = true;
      lead.socialStatus = lead.hasWebsite ? 'has-social' : 'social-only';
      socialLinks.forEach((a) => {
        const h = unwrapGoogleUrl(a.href).toLowerCase();
        if (h.includes('facebook.com') || h.includes('fb.me')) lead.socialProfiles.facebook = a.href;
        if (h.includes('instagram.com')) lead.socialProfiles.instagram = a.href;
        if (h.includes('linkedin.com')) lead.socialProfiles.linkedin = a.href;
        if (h.includes('twitter.com') || h.includes('x.com')) lead.socialProfiles.twitter = a.href;
        if (h.includes('tiktok.com')) lead.socialProfiles.tiktok = a.href;
        if (h.includes('youtube.com')) lead.socialProfiles.youtube = a.href;
        if (h.includes('pinterest.com')) lead.socialProfiles.pinterest = a.href;
      });
    } else if (lead.websiteStatus === 'social-only') {
      lead.hasSocial = true;
      lead.socialStatus = 'social-only';
    } else {
      lead.hasSocial = false;
      lead.socialStatus = 'missing';
    }
  }

  function calculateLeadScore(lead) {
    let score = 30;

    // Website Deficit Bonuses
    if (lead.websiteStatus === 'missing') score += 45;
    else if (lead.websiteStatus === 'aggregator-only') score += 40;
    else if (lead.websiteStatus === 'social-only') score += 35;
    else if (lead.websiteStatus === 'free-builder') score += 30;
    else if (lead.websiteStatus === 'http-insecure') score += 20;

    // Social Deficit Bonus
    if (!lead.hasSocial) score += 15;

    // Digital Ghost Super-Bonus
    if (lead.isDigitalGhost) score += 10;

    // Reputation & Reviews Multiplier
    const reviews = parseInt(lead.reviewCount, 10) || 0;
    const rating = parseFloat(lead.rating) || 0;

    if (reviews >= 100) score += 15;
    else if (reviews >= 30) score += 10;
    else if (reviews >= 5) score += 5;

    if (rating >= 4.5 && reviews >= 10) score += 10;
    if (lead.phone) score += 5;
    if (lead.email) score += 5;

    return Math.min(100, score);
  }

  function getPriority(score) {
    if (score >= 80) return 'hot';
    if (score >= 55) return 'warm';
    return 'cold';
  }

  function getSuggestedOffer(lead) {
    if (lead.isDigitalGhost) {
      return 'Complete Digital Footprint: Next.js 15 Web Presence + Social Authority Launch + Google Business Sync';
    }
    if (lead.websiteStatus === 'missing' || lead.websiteStatus === 'aggregator-only') {
      return 'High-Converting Next.js 15 Custom Web Platform & Instant 24/7 Client Intake Booking System';
    }
    if (lead.websiteStatus === 'social-only') {
      return 'Standalone Brand Website & Automated Appointment Funnel (Transition off Social Walled Garden)';
    }
    if (lead.websiteStatus === 'free-builder' || lead.websiteStatus === 'http-insecure') {
      return 'Enterprise Modernization & Replatforming (Next.js 15, SSL Security, Speed & Conversion Boost)';
    }
    if (!lead.hasSocial) {
      return 'Social Media Channel Launch, Omni-Channel Content Engine & Lead Generation Funnel';
    }
    return 'AI Receptionist & Automation Workflow (Automated Review Collection + 24/7 Lead Capture)';
  }

  // ============================================================================
  // 4. SORTING ENGINE (Lowest to Highest, Highest to Lowest)
  // ============================================================================
  function sortLeadsList(leadsList, sortMode) {
    const list = [...leadsList];

    switch (sortMode) {
      case 'SCORE_ASC':
        return list.sort((a, b) => (a.leadScore || 0) - (b.leadScore || 0));
      case 'SCORE_DESC':
        return list.sort((a, b) => (b.leadScore || 0) - (a.leadScore || 0));
      case 'RATING_ASC':
        return list.sort((a, b) => (parseFloat(a.rating) || 0) - (parseFloat(b.rating) || 0));
      case 'RATING_DESC':
        return list.sort((a, b) => (parseFloat(b.rating) || 0) - (parseFloat(a.rating) || 0));
      case 'REVIEWS_ASC':
        return list.sort((a, b) => (parseInt(a.reviewCount, 10) || 0) - (parseInt(b.reviewCount, 10) || 0));
      case 'REVIEWS_DESC':
        return list.sort((a, b) => (parseInt(b.reviewCount, 10) || 0) - (parseInt(a.reviewCount, 10) || 0));
      case 'NAME_ASC':
        return list.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
      case 'NAME_DESC':
        return list.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
      case 'DATE_DESC':
      default:
        return list.sort((a, b) => (b.dateScraped || '').localeCompare(a.dateScraped || ''));
    }
  }

  // ============================================================================
  // 5. LIVE DASHBOARD CONNECTION & AUTO-SYNC ENGINE
  // ============================================================================
  function pingDashboardConnection(callback) {
    const settings = getSettings();
    _GM_xmlhttpRequest({
      method: 'GET',
      url: `${settings.apiUrl}/health`,
      onload: function (res) {
        if (res.status === 200) {
          dashboardConnected = true;
          lastSyncStatus = 'Connected to CYBERSTYLE API';
          if (callback) callback(true);
        } else {
          dashboardConnected = false;
          lastSyncStatus = `Server HTTP ${res.status}`;
          if (callback) callback(false);
        }
        renderHud();
      },
      onerror: function () {
        dashboardConnected = false;
        lastSyncStatus = 'Offline (Check localhost:4000)';
        if (callback) callback(false);
        renderHud();
      },
    });
  }

  function pushLeadToCrm(leadOrBatch, callback) {
    const settings = getSettings();
    const isArray = Array.isArray(leadOrBatch);
    const payload = isArray ? { leads: leadOrBatch } : leadOrBatch;

    _GM_xmlhttpRequest({
      method: 'POST',
      url: `${settings.apiUrl}/leads/scraper-sync`,
      headers: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify(payload),
      onload: function (res) {
        if (res.status >= 200 && res.status < 300) {
          dashboardConnected = true;
          lastSyncStatus = `Synced ${isArray ? leadOrBatch.length + ' leads' : leadOrBatch.name} at ${new Date().toLocaleTimeString()}`;
          if (callback) callback(null, JSON.parse(res.responseText || '{}'));
        } else {
          if (callback) callback(new Error(`API Error HTTP ${res.status}: ${res.responseText}`));
        }
        renderHud();
      },
      onerror: function (err) {
        dashboardConnected = false;
        lastSyncStatus = 'Sync failed (API offline)';
        if (callback) callback(new Error('Network failure reaching local CYBERSTYLE API'));
        renderHud();
      },
    });
  }

  function computeBatchMetrics(leads) {
    const list = leads || [];
    const total = list.length;
    let noWebsite = 0;
    let socialOnly = 0;
    let noSocial = 0;
    let digitalGhost = 0;
    let hotLeads = 0;
    let highRated = 0;
    let withPhone = 0;
    let withEmail = 0;

    list.forEach((l) => {
      if (l.websiteStatus === 'missing' || l.websiteStatus === 'aggregator-only' || !l.website) noWebsite++;
      if (l.websiteStatus === 'social-only') socialOnly++;
      if (!l.hasSocial || l.socialStatus === 'missing') noSocial++;
      if (l.isDigitalGhost || ((l.websiteStatus === 'missing' || !l.website) && !l.hasSocial)) digitalGhost++;
      if (l.priority === 'hot' || l.leadScore >= 80) hotLeads++;
      const r = parseFloat(l.rating) || 0;
      const revs = parseInt(l.reviewCount, 10) || 0;
      if (r >= 4.5 && revs >= 5) highRated++;
      if (l.phone && l.phone.trim() !== '') withPhone++;
      if (l.email && l.email.trim() !== '') withEmail++;
    });

    return {
      total,
      noWebsite,
      socialOnly,
      noSocial,
      digitalGhost,
      hotLeads,
      highRated,
      withPhone,
      withEmail,
    };
  }

  // ============================================================================
  // 6. MULTI-ANGLE AI OUTREACH PITCH GENERATOR
  // ============================================================================
  function generateOutreachDraft(lead, angle = 'website') {
    const biz = lead.name || 'Your Business';
    const cat = lead.category || 'local business';
    const locationStr = lead.city || lead.country || 'your area';

    if (angle === 'website' || lead.websiteStatus === 'missing' || lead.websiteStatus === 'aggregator-only') {
      return `Subject: Quick question regarding ${biz}'s web presence in ${locationStr}

Hi ${biz} team,

I was reviewing top-rated ${cat.toLowerCase()} providers in ${locationStr} and noticed your stellar reputation (${lead.rating}★ with ${lead.reviewCount} reviews).

However, I noticed you currently don't have a dedicated, custom website for clients to explore your full services and book appointments directly.

We build modern, ultra-fast web platforms (Next.js 15) with built-in 24/7 client booking and inquiry capture specifically for high-performing ${cat.toLowerCase()} businesses.

Would you be open to a 3-minute video showing a preview concept of what your custom portal could look like?

Best regards,
Hani Tormos | CYBERSTYLE Engineering
https://cyberstyle.net`;
    }

    if (angle === 'social' || (!lead.hasSocial && lead.websiteStatus !== 'missing')) {
      return `Subject: Expanding ${biz}'s client reach across social channels

Hi ${biz} team,

Great work building such a reputable presence in ${locationStr} (${lead.reviewCount} Google reviews).

I noticed your website is active, but your brand is missing verified social channels (Instagram / Facebook / TikTok / LinkedIn) where modern clients actively search and engage before booking.

We help premier ${cat.toLowerCase()} firms establish authority and drive consistent local inquiries through automated social funnels and content distribution.

Open to seeing a quick breakdown of the estimated monthly client volume you could capture?

Best regards,
Hani Tormos | CYBERSTYLE
https://cyberstyle.net`;
    }

    if (angle === 'ghost' || lead.isDigitalGhost) {
      return `Subject: Digital transformation package for ${biz} (${locationStr})

Hi ${biz} team,

I came across ${biz} while mapping out leading ${cat.toLowerCase()} businesses in ${locationStr}. You have an exceptional track record with customers, but virtually zero digital footprint online (no dedicated website or social hub).

Competitors in ${locationStr} are capturing high-intent search volume purely because of basic digital real estate.

We specialize in rapid "turnkey digital launch" packages: custom high-converting website, verified social profiles, and automated booking in under 10 days.

Would you be open to a quick 5-minute intro chat this week?

Best regards,
Hani Tormos | CYBERSTYLE
https://cyberstyle.net`;
    }

    return `Subject: 24/7 AI Receptionist & Instant Booking for ${biz}

Hi ${biz} team,

Saw your great reviews in ${locationStr}. We recently built an automated 24/7 booking & AI inquiry assistant for local ${cat.toLowerCase()} practices that captures missed calls and after-hours bookings automatically.

It instantly converts website and Google Maps visitors into confirmed calendar appointments without extra staff overhead.

Would you be interested in a 2-minute interactive demo customized for ${biz}?

Best regards,
Hani Tormos | CYBERSTYLE
https://cyberstyle.net`;
  }

  // ============================================================================
  // 7. AUTO-SCANNER FEED HARVESTER WITH DEEP SCRAPING
  // ============================================================================
  function runAutoScan() {
    if (isAutoScanning) {
      isAutoScanning = false;
      if (autoScanInterval) clearInterval(autoScanInterval);
      showToast('Scanner paused.', 'info');
      renderHud();
      return;
    }

    isAutoScanning = true;
    showToast('⚡ Deep Auto-Scanning Feed across region...', 'info');
    renderHud();

    let scrollAttempts = 0;
    const maxScrolls = 40;

    autoScanInterval = setInterval(() => {
      if (!isAutoScanning || scrollAttempts >= maxScrolls) {
        clearInterval(autoScanInterval);
        isAutoScanning = false;
        showToast('Auto-Scan Complete! Syncing to Dashboard...', 'success');
        renderHud();
        return;
      }

      scrollAttempts++;

      // 1. Scroll Results Feed
      const feed = document.querySelector('div[role="feed"], div.m6QErb[aria-label], div.m6QErb');
      if (feed) {
        feed.scrollTop += 1100;
      } else {
        window.scrollBy(0, 950);
      }

      // 2. Parse all visible business cards with deep text examination
      const cards = document.querySelectorAll('div.Nv2PK, div.THOPZb, a.hfpxzc');
      const batch = getBatchLeads();
      const newlyDiscovered = [];
      let added = 0;

      cards.forEach((card) => {
        let name = '';
        let href = '';

        if (card.tagName === 'A') {
          href = unwrapGoogleUrl(card.href);
          name = card.getAttribute('aria-label') || '';
        } else {
          const titleEl = card.querySelector('div.fontHeadlineSmall, div.qBF1Pd, div.NrDZNb');
          name = titleEl ? titleEl.innerText.trim() : '';
          const linkEl = card.querySelector('a.hfpxzc, a[href*="/maps/place/"]');
          href = linkEl ? unwrapGoogleUrl(linkEl.href) : '';
        }

        if (name && !batch.some((b) => b.name.toLowerCase() === name.toLowerCase())) {
          const cardText = card.innerText || '';

          // Star Rating & Review Count
          let rating = '5.0';
          let reviewCount = '1';
          const rMatch = cardText.match(/(\d\.\d)\s*\(([\d,]+)\)/);
          if (rMatch) {
            rating = rMatch[1];
            reviewCount = rMatch[2].replace(/,/g, '');
          }

          // Phone Number Extraction from card text & attributes
          let phone = '';
          const phoneMatch = cardText.match(/(?:\+|00)?(?:\d{1,4}[-.\s]?)?(?:\(?\d{2,5}\)?[-.\s]?)?\d{3,4}[-.\s]?\d{3,4}/);
          if (phoneMatch && phoneMatch[0].replace(/\D/g, '').length >= 7) {
            phone = phoneMatch[0].trim();
          }

          // Website Link Extraction (Buttons, links, and outbound anchors)
          let website = '';
          const webBtn = card.querySelector(
            'a[data-value="Website"], a[data-value*="Website" i], a[data-value*="الموقع" i], a[data-value*="Site" i], a[aria-label*="website" i], a[aria-label*="الموقع" i], a[aria-label*="Site" i], a[data-tooltip*="website" i]'
          );
          if (webBtn) {
            website = unwrapGoogleUrl(webBtn.href);
          } else {
            const allLinks = Array.from(card.querySelectorAll('a[href^="http"]'));
            for (const a of allLinks) {
              const h = unwrapGoogleUrl(a.href);
              if (!h.includes('google.com') && !h.includes('gstatic.com') && !h.includes('schema.org') && !h.includes('ggpht.com')) {
                website = h;
                break;
              }
            }
          }

          // Category & Address extraction from card lines
          let category = 'Discovered Opportunity';
          let address = '';
          const lineEls = Array.from(card.querySelectorAll('div.W4Efsd, div.fontBodyMedium'));
          if (lineEls.length > 0) {
            const line1 = lineEls[0]?.innerText || '';
            const catParts = line1.split('·');
            if (catParts.length > 1) {
              category = catParts[catParts.length - 1].trim();
            }
            if (lineEls.length > 1) {
              address = lineEls[1]?.innerText?.replace(/[\r\n]+/g, ' ')?.trim() || '';
            }
          }

          // Email extraction / domain inference
          let email = '';
          if (website && !SOCIAL_DOMAINS_REGEX.test(website) && !AGGREGATOR_DOMAINS_REGEX.test(website)) {
            try {
              const domain = new URL(website.startsWith('http') ? website : `https://${website}`).hostname.replace(/^www\./, '');
              email = `info@${domain}`;
            } catch {}
          }

          const lead = {
            id: 'lead_' + Math.random().toString(36).substring(2, 9),
            name,
            company: name,
            category,
            phone,
            email,
            website,
            address,
            city: '',
            country: 'Global',
            workingHours: 'Standard Business Hours',
            rating,
            reviewCount,
            latitude: '',
            longitude: '',
            mapsUrl: href || window.location.href,
            hasWebsite: false,
            websiteStatus: 'unknown',
            websiteScore: 0,
            hasSocial: false,
            socialStatus: 'missing',
            isDigitalGhost: false,
            socialProfiles: { facebook: '', instagram: '', linkedin: '', twitter: '', tiktok: '', youtube: '', pinterest: '' },
            leadScore: 0,
            priority: 'warm',
            opportunityType: 'website',
            suggestedOffer: '',
            dateScraped: new Date().toISOString().slice(0, 10),
          };

          auditWebsitePresence(lead);
          auditSocialPresence(lead);
          lead.isDigitalGhost = (!lead.hasWebsite || lead.websiteStatus === 'missing') && !lead.hasSocial;
          lead.leadScore = calculateLeadScore(lead);
          lead.priority = getPriority(lead.leadScore);
          lead.suggestedOffer = getSuggestedOffer(lead);

          batch.unshift(lead);
          newlyDiscovered.push(lead);
          added++;
        }
      });

      if (added > 0) {
        saveBatchLeads(batch.slice(0, 1000));
        renderHud();

        // Auto-Push to CYBERSTYLE CRM if enabled
        const settings = getSettings();
        if (settings.autoSyncToDashboard && newlyDiscovered.length > 0) {
          pushLeadToCrm(newlyDiscovered, () => {});
        }
      }
    }, 1300);
  }

  // ============================================================================
  // 8. UNBEATABLE FULL-DETAIL EXPORT ENGINE
  // ============================================================================
  function exportComprehensiveCsv(filterType = 'ALL') {
    const rawBatch = getBatchLeads();
    let leads = rawBatch;
    let filenameSuffix = 'all_leads';

    if (filterType === 'NO_WEBSITE') {
      leads = rawBatch.filter((l) => l.websiteStatus === 'missing' || l.websiteStatus === 'aggregator-only' || !l.website);
      filenameSuffix = 'no_website';
    } else if (filterType === 'SOCIAL_ONLY') {
      leads = rawBatch.filter((l) => l.websiteStatus === 'social-only');
      filenameSuffix = 'social_only';
    } else if (filterType === 'NO_SOCIAL') {
      leads = rawBatch.filter((l) => !l.hasSocial || l.socialStatus === 'missing');
      filenameSuffix = 'no_socials';
    } else if (filterType === 'DIGITAL_GHOST') {
      leads = rawBatch.filter((l) => l.isDigitalGhost || ((l.websiteStatus === 'missing' || !l.website) && !l.hasSocial));
      filenameSuffix = 'digital_ghosts';
    } else if (filterType === 'HOT') {
      leads = rawBatch.filter((l) => l.priority === 'hot' || l.leadScore >= 80);
      filenameSuffix = 'hot_qualified';
    } else if (filterType === 'HIGH_RATED') {
      leads = rawBatch.filter((l) => parseFloat(l.rating) >= 4.5 && parseInt(l.reviewCount, 10) >= 5);
      filenameSuffix = 'high_rated_4.5plus';
    } else if (filterType === 'WITH_PHONE') {
      leads = rawBatch.filter((l) => Boolean(l.phone));
      filenameSuffix = 'with_phones';
    } else if (filterType === 'WITH_EMAIL') {
      leads = rawBatch.filter((l) => Boolean(l.email));
      filenameSuffix = 'with_emails';
    }

    if (leads.length === 0) {
      showToast(`No leads found matching filter [${filterType}] to export.`, 'info');
      return;
    }

    const sortedLeads = sortLeadsList(leads, sortBy);

    const headers = [
      'Business Name',
      'Company Name',
      'Category / Niche',
      'Direct Phone Number',
      'Primary Email Address',
      'Website URL',
      'Website Presence Status',
      'Website Score (0-100)',
      'Social Presence Status',
      'Is Digital Ghost (No Web + No Soc)',
      'Facebook Profile',
      'Instagram Profile',
      'LinkedIn Profile',
      'Twitter / X Profile',
      'TikTok Profile',
      'YouTube Channel',
      'Pinterest Profile',
      'Google Star Rating',
      'Google Review Count',
      'Full Physical Address',
      'City / Region',
      'Country',
      'Working Hours / Open Status',
      'Latitude',
      'Longitude',
      'Lead Quality Score (0-100)',
      'Priority Tier',
      'Recommended Agency Offer',
      'Custom Outreach Pitch Snippet',
      'Google Maps URL',
      'Date Discovered',
    ];

    const rows = sortedLeads.map((l) =>
      [
        l.name,
        l.company || l.name,
        l.category,
        l.phone,
        l.email,
        l.website,
        l.websiteStatus,
        l.websiteScore || 0,
        l.socialStatus,
        l.isDigitalGhost ? 'YES' : 'NO',
        l.socialProfiles?.facebook || '',
        l.socialProfiles?.instagram || '',
        l.socialProfiles?.linkedin || '',
        l.socialProfiles?.twitter || '',
        l.socialProfiles?.tiktok || '',
        l.socialProfiles?.youtube || '',
        l.socialProfiles?.pinterest || '',
        l.rating,
        l.reviewCount,
        l.address,
        l.city,
        l.country,
        l.workingHours,
        l.latitude,
        l.longitude,
        l.leadScore,
        l.priority,
        l.suggestedOffer,
        generateOutreachDraft(l, 'website').replace(/[\r\n]+/g, ' '),
        l.mapsUrl,
        l.dateScraped,
      ]
        .map((val) => `"${String(val || '').replace(/"/g, '""')}"`)
        .join(',')
    );

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows].join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(csvContent);
    link.download = `cyberstyle_leads_${filenameSuffix}_sorted_${sortBy.toLowerCase()}_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${sortedLeads.length} leads with full details to CSV!`, 'success');
  }

  function exportComprehensiveJson() {
    const rawBatch = getBatchLeads();
    const sortedLeads = sortLeadsList(rawBatch, sortBy);
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(sortedLeads, null, 2));
    const link = document.createElement('a');
    link.href = dataStr;
    link.download = `cyberstyle_leads_database_full_${sortBy.toLowerCase()}_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported full database (JSON with all details)!', 'success');
  }

  // ============================================================================
  // 9. CYBERPUNK HUD UI INJECTION & CONTROLLER
  // ============================================================================
  function injectStyles() {
    if (document.getElementById('cs-hud-style')) return;
    const style = document.createElement('style');
    style.id = 'cs-hud-style';
    style.textContent = `
      #cyberstyle-hud {
        position: fixed !important;
        top: 20px !important;
        right: 20px !important;
        width: 470px !important;
        max-width: 95vw !important;
        background: #080A10 !important;
        border: 1px solid rgba(0, 240, 255, 0.45) !important;
        box-shadow: 0 20px 50px rgba(0,0,0,0.95), 0 0 30px rgba(0, 240, 255, 0.25) !important;
        border-radius: 16px !important;
        color: #FFFFFF !important;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
        font-size: 12px !important;
        z-index: 2147483647 !important;
        overflow: hidden !important;
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
        transition: height 0.2s ease, width 0.2s ease;
      }
      #cyberstyle-hud.minimized {
        width: 280px !important;
        height: 44px !important;
      }
      .cs-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 14px;
        background: #0E131F;
        border-bottom: 1px solid rgba(255,255,255,0.08);
        cursor: move;
        user-select: none;
      }
      .cs-brand {
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: 800;
        color: #00F0FF;
        font-size: 11px;
        letter-spacing: 1px;
        font-family: monospace;
      }
      .cs-conn-status {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        font-size: 9.5px;
        font-family: monospace;
        padding: 2px 6px;
        border-radius: 6px;
      }
      .cs-conn-on { background: rgba(16,185,129,0.15); color: #34D399; border: 1px solid rgba(16,185,129,0.3); }
      .cs-conn-off { background: rgba(239,68,68,0.15); color: #F87171; border: 1px solid rgba(239,68,68,0.3); }
      .cs-metrics-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 6px;
        padding: 10px 12px;
        background: #0B0E17;
        border-bottom: 1px solid rgba(255,255,255,0.08);
      }
      .cs-metric-card {
        background: #111726;
        border: 1px solid rgba(255,255,255,0.06);
        border-radius: 8px;
        padding: 6px 4px;
        text-align: center;
        cursor: pointer;
        transition: all 0.15s;
      }
      .cs-metric-card:hover {
        border-color: rgba(0,240,255,0.4);
        background: #161F33;
      }
      .cs-metric-num {
        font-size: 13px;
        font-weight: 800;
        font-family: monospace;
        color: #FFFFFF;
      }
      .cs-metric-label {
        font-size: 8.5px;
        color: #94A3B8;
        font-weight: 600;
        text-transform: uppercase;
        margin-top: 2px;
      }
      .cs-tabs {
        display: flex;
        background: #0B0E17;
        border-bottom: 1px solid rgba(255,255,255,0.08);
      }
      .cs-tab {
        flex: 1;
        padding: 8px 4px;
        text-align: center;
        font-size: 10.5px;
        font-family: monospace;
        color: #94A3B8;
        cursor: pointer;
        border-bottom: 2px solid transparent;
        transition: all 0.15s;
        white-space: nowrap;
      }
      .cs-tab.active {
        color: #00F0FF;
        font-weight: bold;
        border-bottom-color: #00F0FF;
        background: rgba(0,240,255,0.05);
      }
      .cs-body {
        padding: 14px;
        max-height: 480px;
        overflow-y: auto;
      }
      .cs-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        padding: 7px 11px;
        border-radius: 8px;
        font-size: 11px;
        font-weight: 600;
        cursor: pointer;
        border: none;
        transition: all 0.15s;
        font-family: monospace;
      }
      .cs-btn-primary {
        background: #00F0FF !important;
        color: #000000 !important;
        box-shadow: 0 0 10px rgba(0,240,255,0.3);
      }
      .cs-btn-primary:hover {
        background: #00D8E6 !important;
      }
      .cs-btn-secondary {
        background: #1E293B !important;
        color: #E2E8F0 !important;
        border: 1px solid #334155 !important;
      }
      .cs-btn-secondary:hover {
        background: #334155 !important;
      }
      .cs-btn-danger {
        background: rgba(239, 68, 68, 0.2) !important;
        color: #F87171 !important;
        border: 1px solid rgba(239, 68, 68, 0.4) !important;
      }
      .cs-badge {
        padding: 2px 7px;
        border-radius: 9999px;
        font-size: 10px;
        font-weight: bold;
        text-transform: uppercase;
        font-family: monospace;
      }
      .cs-badge-hot { background: rgba(239,68,68,0.2); color: #F87171; border: 1px solid rgba(239,68,68,0.4); }
      .cs-badge-warm { background: rgba(245,158,11,0.2); color: #FBBF24; border: 1px solid rgba(245,158,11,0.4); }
      .cs-badge-missing { background: rgba(225,29,72,0.2); color: #FB7185; border: 1px solid rgba(225,29,72,0.4); }
      .cs-badge-social { background: rgba(168,85,247,0.2); color: #C084FC; border: 1px solid rgba(168,85,247,0.4); }
      .cs-badge-ghost { background: rgba(244,63,94,0.25); color: #FDA4AF; border: 1px solid rgba(244,63,94,0.5); }
      .cs-badge-active { background: rgba(16,185,129,0.2); color: #34D399; border: 1px solid rgba(16,185,129,0.4); }
      .cs-toast {
        position: fixed !important;
        top: 80px !important;
        right: 20px !important;
        background: #0F172A !important;
        border: 1px solid #00F0FF !important;
        color: #FFFFFF !important;
        padding: 10px 16px !important;
        border-radius: 10px !important;
        font-size: 12px !important;
        font-family: monospace !important;
        z-index: 2147483647 !important;
        box-shadow: 0 10px 30px rgba(0,0,0,0.8) !important;
      }
    `;
    (document.head || document.documentElement).appendChild(style);
  }

  function showToast(msg, type = 'info') {
    const toast = document.createElement('div');
    toast.className = 'cs-toast';
    toast.innerText = msg;
    (document.body || document.documentElement).appendChild(toast);
    setTimeout(() => toast.remove(), 3200);
  }

  function createHud() {
    injectStyles();
    if (document.getElementById('cyberstyle-hud')) return;

    const hud = document.createElement('div');
    hud.id = 'cyberstyle-hud';
    if (isPanelMinimized) hud.classList.add('minimized');

    (document.body || document.documentElement).appendChild(hud);
    renderHud();
    makeDraggable(hud);

    // Initial check on dashboard connection
    pingDashboardConnection();
  }

  function renderHud() {
    const hud = document.getElementById('cyberstyle-hud');
    if (!hud) return;

    if (isPanelMinimized) {
      hud.innerHTML = `
        <div class="cs-header" id="cs-toggle-min">
          <div class="cs-brand">
            <span style="width:8px;height:8px;background:#00F0FF;border-radius:50%;display:inline-block;box-shadow:0 0 6px #00F0FF;"></span>
            CYBERSTYLE CRM (${dashboardConnected ? 'LIVE' : 'OFFLINE'})
          </div>
          <span style="font-size:10px;color:#94A3B8;font-family:monospace;">[EXPAND]</span>
        </div>
      `;
      document.getElementById('cs-toggle-min').addEventListener('click', () => {
        isPanelMinimized = false;
        _GM_setValue('cyberstyle_minimized', false);
        hud.classList.remove('minimized');
        renderHud();
      });
      return;
    }

    const batchLeads = getBatchLeads();
    const metrics = computeBatchMetrics(batchLeads);

    hud.innerHTML = `
      <div class="cs-header" id="cs-header-bar">
        <div class="cs-brand">
          <span style="width:8px;height:8px;background:#00F0FF;border-radius:50%;display:inline-block;box-shadow:0 0 6px #00F0FF;"></span>
          CYBERSTYLE CRM ENGINE
        </div>
        <div style="display:flex;align-items:center;gap:6px;">
          <a href="${getSettings().dashboardUrl}" target="_blank" class="cs-btn cs-btn-secondary" style="padding:3px 7px;font-size:9.5px;text-decoration:none;border-radius:6px;border:1px solid rgba(0,240,255,0.4);color:#00F0FF;" title="Open CYBERSTYLE CRM Dashboard in New Tab">
            📊 Open Dashboard
          </a>
          <span class="cs-conn-status ${dashboardConnected ? 'cs-conn-on' : 'cs-conn-off'}" id="cs-ping-dash" title="Click to ping localhost:4000">
            ${dashboardConnected ? '🟢 Linked' : '🔴 Offline'}
          </span>
          <button id="cs-btn-min" style="background:transparent;border:none;color:#94A3B8;cursor:pointer;font-size:16px;">−</button>
        </div>
      </div>

      <!-- Live Counters 8-Card Matrix -->
      <div class="cs-metrics-grid">
        <div class="cs-metric-card" id="cs-stat-total" title="Total Collected Opportunities">
          <div class="cs-metric-num" style="color:#00F0FF;">${metrics.total}</div>
          <div class="cs-metric-label">Total</div>
        </div>
        <div class="cs-metric-card" id="cs-stat-noweb" title="Businesses with No Website">
          <div class="cs-metric-num" style="color:#FB7185;">${metrics.noWebsite}</div>
          <div class="cs-metric-label">No Site</div>
        </div>
        <div class="cs-metric-card" id="cs-stat-social" title="Relying on Social Media Only">
          <div class="cs-metric-num" style="color:#C084FC;">${metrics.socialOnly}</div>
          <div class="cs-metric-label">Social Only</div>
        </div>
        <div class="cs-metric-card" id="cs-stat-nosocial" title="No Social Media Found">
          <div class="cs-metric-num" style="color:#FBBF24;">${metrics.noSocial}</div>
          <div class="cs-metric-label">No Socials</div>
        </div>
        <div class="cs-metric-card" id="cs-stat-ghost" title="Digital Ghosts (No Site & No Socials)">
          <div class="cs-metric-num" style="color:#FDA4AF;">${metrics.digitalGhost}</div>
          <div class="cs-metric-label">Ghosts 👻</div>
        </div>
        <div class="cs-metric-card" id="cs-stat-hot" title="HOT Opportunities (>80 Score)">
          <div class="cs-metric-num" style="color:#F87171;">${metrics.hotLeads}</div>
          <div class="cs-metric-label">HOT (80+)</div>
        </div>
        <div class="cs-metric-card" id="cs-stat-highrated" title="4.5+ Star Rated Businesses">
          <div class="cs-metric-num" style="color:#34D399;">${metrics.highRated}</div>
          <div class="cs-metric-label">4.5+ Stars</div>
        </div>
        <div class="cs-metric-card" id="cs-stat-phone" title="With Phone Number">
          <div class="cs-metric-num" style="color:#38BDF8;">${metrics.withPhone}</div>
          <div class="cs-metric-label">Phone</div>
        </div>
      </div>

      <div class="cs-tabs">
        <div class="cs-tab ${activeTab === 'active' ? 'active' : ''}" id="cs-tab-active">Active Place</div>
        <div class="cs-tab ${activeTab === 'scanner' ? 'active' : ''}" id="cs-tab-scanner">Global Discovery</div>
        <div class="cs-tab ${activeTab === 'batch' ? 'active' : ''}" id="cs-tab-batch">Batch (${batchLeads.length})</div>
        <div class="cs-tab ${activeTab === 'export' ? 'active' : ''}" id="cs-tab-export">Exports</div>
        <div class="cs-tab ${activeTab === 'settings' ? 'active' : ''}" id="cs-tab-settings">CRM Link</div>
      </div>

      <div class="cs-body">
        ${renderActiveTabContent(batchLeads, metrics)}
      </div>
    `;

    document.getElementById('cs-btn-min').addEventListener('click', () => {
      isPanelMinimized = true;
      _GM_setValue('cyberstyle_minimized', true);
      hud.classList.add('minimized');
      renderHud();
    });

    document.getElementById('cs-ping-dash')?.addEventListener('click', () => {
      showToast('Pinging CYBERSTYLE Dashboard API...', 'info');
      pingDashboardConnection((ok) => {
        showToast(ok ? 'Connected to CYBERSTYLE Dashboard!' : 'Dashboard offline at localhost:4000', ok ? 'success' : 'error');
      });
    });

    document.getElementById('cs-stat-total')?.addEventListener('click', () => { activeTab = 'batch'; batchFilter = 'ALL'; renderHud(); });
    document.getElementById('cs-stat-noweb')?.addEventListener('click', () => { activeTab = 'batch'; batchFilter = 'NO_WEBSITE'; renderHud(); });
    document.getElementById('cs-stat-social')?.addEventListener('click', () => { activeTab = 'batch'; batchFilter = 'SOCIAL_ONLY'; renderHud(); });
    document.getElementById('cs-stat-nosocial')?.addEventListener('click', () => { activeTab = 'batch'; batchFilter = 'NO_SOCIAL'; renderHud(); });
    document.getElementById('cs-stat-ghost')?.addEventListener('click', () => { activeTab = 'batch'; batchFilter = 'DIGITAL_GHOST'; renderHud(); });
    document.getElementById('cs-stat-hot')?.addEventListener('click', () => { activeTab = 'batch'; batchFilter = 'HOT'; renderHud(); });
    document.getElementById('cs-stat-highrated')?.addEventListener('click', () => { activeTab = 'batch'; batchFilter = 'HIGH_RATED'; renderHud(); });
    document.getElementById('cs-stat-phone')?.addEventListener('click', () => { activeTab = 'batch'; batchFilter = 'WITH_PHONE'; renderHud(); });

    document.getElementById('cs-tab-active').addEventListener('click', () => { activeTab = 'active'; renderHud(); });
    document.getElementById('cs-tab-scanner').addEventListener('click', () => { activeTab = 'scanner'; renderHud(); });
    document.getElementById('cs-tab-batch').addEventListener('click', () => { activeTab = 'batch'; renderHud(); });
    document.getElementById('cs-tab-export').addEventListener('click', () => { activeTab = 'export'; renderHud(); });
    document.getElementById('cs-tab-settings').addEventListener('click', () => { activeTab = 'settings'; renderHud(); });

    bindTabActions();
  }

  function renderActiveTabContent(batchLeads, metrics) {
    const settings = getSettings();

    if (activeTab === 'settings') {
      return `
        <div style="display:flex;flex-direction:column;gap:12px;font-family:monospace;">
          <div style="font-weight:bold;color:#00F0FF;font-size:12px;">Dashboard Live Integration</div>
          
          <div style="background:#0F172A;border:1px solid #1E293B;padding:10px;border-radius:8px;display:flex;flex-direction:column;gap:6px;">
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <span style="color:#94A3B8;font-size:11px;">Status:</span>
              <span class="cs-conn-status ${dashboardConnected ? 'cs-conn-on' : 'cs-conn-off'}">
                ${dashboardConnected ? '🟢 Live Connected' : '🔴 Disconnected'}
              </span>
            </div>
            <div style="color:#64748B;font-size:10px;">${lastSyncStatus}</div>
          </div>

          <div style="display:flex;flex-direction:column;gap:4px;">
            <label style="color:#94A3B8;font-size:10px;">Backend API URL:</label>
            <input
              type="text"
              id="cs-setting-api"
              value="${settings.apiUrl}"
              style="background:#111726;border:1px solid #334155;color:#FFFFFF;padding:6px 10px;border-radius:8px;font-size:11px;font-family:monospace;"
            />
          </div>

          <div style="display:flex;align-items:center;justify-content:space-between;background:#111726;padding:8px 10px;border-radius:8px;border:1px solid #1E293B;">
            <div>
              <div style="font-weight:bold;color:#FFFFFF;font-size:11px;">Auto-Sync to Database</div>
              <div style="color:#94A3B8;font-size:9.5px;">Directly writes scraped leads into PostgreSQL</div>
            </div>
            <input type="checkbox" id="cs-setting-autosync" ${settings.autoSyncToDashboard ? 'checked' : ''} style="width:18px;height:18px;cursor:pointer;" />
          </div>

          <div style="display:flex;gap:6px;margin-top:4px;">
            <button class="cs-btn cs-btn-primary" id="cs-save-settings" style="flex:1;">
              💾 Save Settings
            </button>
            <button class="cs-btn cs-btn-secondary" id="cs-open-dash-btn" style="flex:1;">
              🚀 Open Dashboard
            </button>
          </div>
        </div>
      `;
    }

    if (activeTab === 'scanner') {
      const regionCities = GLOBAL_REGIONS[selectedRegionCategory] || GLOBAL_REGIONS['USA — All Metros & States'];

      return `
        <div style="display:flex;flex-direction:column;gap:12px;font-family:monospace;">
          <div style="font-weight:bold;color:#00F0FF;font-size:12px;">Global Multi-Country Lead Engine</div>
          
          <!-- Region / Country Selector -->
          <div style="display:flex;flex-direction:column;gap:4px;">
            <label style="color:#94A3B8;font-size:10px;">Select Global Region / Country:</label>
            <select id="cs-region-category-select" style="background:#161D2E;color:#00F0FF;border:1px solid #334155;padding:6px;border-radius:8px;font-size:11px;font-weight:bold;">
              ${Object.keys(GLOBAL_REGIONS).map((reg) => `<option value="${reg}" ${reg === selectedRegionCategory ? 'selected' : ''}>${reg}</option>`).join('')}
            </select>
          </div>

          <!-- City / State / Nationwide Selector -->
          <div style="display:flex;flex-direction:column;gap:4px;">
            <label style="color:#94A3B8;font-size:10px;">Select Metro / State / Nationwide:</label>
            <select id="cs-city-select" style="background:#161D2E;color:#FFFFFF;border:1px solid #334155;padding:6px;border-radius:8px;font-size:11px;">
              ${regionCities.map((c) => `<option value="${c}">${c}</option>`).join('')}
            </select>
          </div>

          <!-- Target Niche Selector -->
          <div style="display:flex;flex-direction:column;gap:4px;">
            <label style="color:#94A3B8;font-size:10px;">Target High-Ticket Niche:</label>
            <select id="cs-niche-select" style="background:#161D2E;color:#FFFFFF;border:1px solid #334155;padding:6px;border-radius:8px;font-size:11px;">
              ${TARGET_NICHES.map((n) => `<option value="${n}">${n}</option>`).join('')}
            </select>
          </div>

          <!-- Custom Query Override -->
          <div style="display:flex;flex-direction:column;gap:4px;">
            <label style="color:#94A3B8;font-size:10px;">Or Custom Search Query (Worldwide):</label>
            <input
              type="text"
              id="cs-custom-query"
              placeholder="e.g. Dentists in Beverly Hills CA or Med Spas in Dubai"
              style="background:#111726;border:1px solid #334155;color:#FFFFFF;padding:6px 10px;border-radius:8px;font-size:11px;font-family:monospace;"
            />
          </div>

          <button class="cs-btn cs-btn-primary" id="cs-execute-search" style="width:100%;margin-top:2px;">
            🔍 Launch Search on Google Maps
          </button>

          <div style="border-top:1px solid #1E293B;padding-top:10px;display:flex;flex-direction:column;gap:8px;">
            <div style="font-weight:bold;color:#FFFFFF;font-size:11px;">Automated Feed Intelligence Harvester</div>
            <p style="color:#94A3B8;font-size:10px;margin:0;">Automatically scrolls Google Maps results across the whole area, grabs phone, email, and presence gaps in real time.</p>
            <button class="cs-btn ${isAutoScanning ? 'cs-btn-danger' : 'cs-btn-primary'}" id="cs-toggle-scan" style="width:100%;">
              ${isAutoScanning ? '🛑 Stop Scanner Feed' : '⚡ Start Auto-Scan Feed'}
            </button>
          </div>
        </div>
      `;
    }

    if (activeTab === 'batch') {
      let filtered = batchLeads;
      if (batchFilter === 'NO_WEBSITE') filtered = batchLeads.filter((l) => l.websiteStatus === 'missing' || l.websiteStatus === 'aggregator-only' || !l.website);
      else if (batchFilter === 'SOCIAL_ONLY') filtered = batchLeads.filter((l) => l.websiteStatus === 'social-only');
      else if (batchFilter === 'NO_SOCIAL') filtered = batchLeads.filter((l) => !l.hasSocial || l.socialStatus === 'missing');
      else if (batchFilter === 'DIGITAL_GHOST') filtered = batchLeads.filter((l) => l.isDigitalGhost || ((l.websiteStatus === 'missing' || !l.website) && !l.hasSocial));
      else if (batchFilter === 'HOT') filtered = batchLeads.filter((l) => l.priority === 'hot' || l.leadScore >= 80);
      else if (batchFilter === 'HIGH_RATED') filtered = batchLeads.filter((l) => parseFloat(l.rating) >= 4.5 && parseInt(l.reviewCount, 10) >= 5);
      else if (batchFilter === 'WITH_PHONE') filtered = batchLeads.filter((l) => Boolean(l.phone));
      else if (batchFilter === 'WITH_EMAIL') filtered = batchLeads.filter((l) => Boolean(l.email));

      if (searchFilterQuery) {
        filtered = filtered.filter(
          (l) =>
            l.name.toLowerCase().includes(searchFilterQuery.toLowerCase()) ||
            (l.phone && l.phone.includes(searchFilterQuery)) ||
            (l.email && l.email.toLowerCase().includes(searchFilterQuery.toLowerCase())) ||
            (l.category && l.category.toLowerCase().includes(searchFilterQuery.toLowerCase())) ||
            (l.address && l.address.toLowerCase().includes(searchFilterQuery.toLowerCase()))
        );
      }

      // Apply sorting
      const sorted = sortLeadsList(filtered, sortBy);

      return `
        <div style="display:flex;flex-direction:column;gap:10px;">
          <!-- Filter Badges -->
          <div style="display:flex;gap:4px;flex-wrap:wrap;">
            <button class="cs-btn ${batchFilter === 'ALL' ? 'cs-btn-primary' : 'cs-btn-secondary'}" id="cs-filter-all" style="font-size:9px;padding:3px 6px;">All (${batchLeads.length})</button>
            <button class="cs-btn ${batchFilter === 'NO_WEBSITE' ? 'cs-btn-primary' : 'cs-btn-secondary'}" id="cs-filter-noweb" style="font-size:9px;padding:3px 6px;">No Site (${metrics.noWebsite})</button>
            <button class="cs-btn ${batchFilter === 'SOCIAL_ONLY' ? 'cs-btn-primary' : 'cs-btn-secondary'}" id="cs-filter-social" style="font-size:9px;padding:3px 6px;">Social (${metrics.socialOnly})</button>
            <button class="cs-btn ${batchFilter === 'NO_SOCIAL' ? 'cs-btn-primary' : 'cs-btn-secondary'}" id="cs-filter-nosocial" style="font-size:9px;padding:3px 6px;">No Soc (${metrics.noSocial})</button>
            <button class="cs-btn ${batchFilter === 'DIGITAL_GHOST' ? 'cs-btn-primary' : 'cs-btn-secondary'}" id="cs-filter-ghost" style="font-size:9px;padding:3px 6px;">Ghost (${metrics.digitalGhost})</button>
            <button class="cs-btn ${batchFilter === 'HOT' ? 'cs-btn-primary' : 'cs-btn-secondary'}" id="cs-filter-hot" style="font-size:9px;padding:3px 6px;">HOT (${metrics.hotLeads})</button>
            <button class="cs-btn ${batchFilter === 'WITH_PHONE' ? 'cs-btn-primary' : 'cs-btn-secondary'}" id="cs-filter-phone" style="font-size:9px;padding:3px 6px;">📞 Phone (${metrics.withPhone})</button>
          </div>

          <!-- Sort Bar & Search -->
          <div style="display:flex;gap:6px;align-items:center;">
            <input
              type="text"
              id="cs-search-input"
              value="${searchFilterQuery}"
              placeholder="Search leads, phone, email, city..."
              style="flex:1;background:#111726;border:1px solid #1E293B;color:#FFFFFF;padding:6px 10px;border-radius:8px;font-size:11px;font-family:monospace;"
            />
            <select id="cs-sort-select" style="background:#161D2E;color:#00F0FF;border:1px solid #334155;padding:6px;border-radius:8px;font-size:10px;font-family:monospace;">
              <option value="SCORE_DESC" ${sortBy === 'SCORE_DESC' ? 'selected' : ''}>Score: High → Low</option>
              <option value="SCORE_ASC" ${sortBy === 'SCORE_ASC' ? 'selected' : ''}>Score: Low → High</option>
              <option value="RATING_DESC" ${sortBy === 'RATING_DESC' ? 'selected' : ''}>Rating: High → Low</option>
              <option value="RATING_ASC" ${sortBy === 'RATING_ASC' ? 'selected' : ''}>Rating: Low → High</option>
              <option value="REVIEWS_DESC" ${sortBy === 'REVIEWS_DESC' ? 'selected' : ''}>Reviews: High → Low</option>
              <option value="REVIEWS_ASC" ${sortBy === 'REVIEWS_ASC' ? 'selected' : ''}>Reviews: Low → High</option>
              <option value="NAME_ASC" ${sortBy === 'NAME_ASC' ? 'selected' : ''}>Name: A → Z</option>
              <option value="NAME_DESC" ${sortBy === 'NAME_DESC' ? 'selected' : ''}>Name: Z → A</option>
            </select>
          </div>

          <!-- Leads Card Stream -->
          <div style="max-height:220px;overflow-y:auto;display:flex;flex-direction:column;gap:6px;">
            ${sorted.length === 0 ? '<div style="color:#64748B;text-align:center;padding:20px;font-family:monospace;">No leads match active filter.</div>' : ''}
            ${sorted.slice(0, 50).map((l) => `
              <div style="background:#0F172A;border:1px solid #1E293B;padding:8px 10px;border-radius:8px;display:flex;justify-content:space-between;align-items:center;">
                <div style="overflow:hidden;padding-right:8px;">
                  <div style="font-weight:bold;color:#FFFFFF;font-size:11px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
                    ${l.name}
                    ${l.phone ? `<span style="color:#38BDF8;font-size:10px;font-weight:normal;margin-left:6px;">📞 ${l.phone}</span>` : ''}
                  </div>
                  <div style="font-size:10px;color:#94A3B8;font-family:monospace;">
                    ${l.isDigitalGhost ? '👻 Digital Ghost' : l.websiteStatus === 'missing' ? '❌ No Website' : l.websiteStatus === 'social-only' ? '📱 Social Only' : '🌐 ' + (l.website ? l.website.replace(/^https?:\/\//i, '').split('/')[0] : 'Web')}
                    &bull; ★ ${l.rating} (${l.reviewCount} revs)
                    ${l.email ? `&bull; ✉️ ${l.email}` : ''}
                  </div>
                </div>
                <div style="display:flex;flex-direction:column;align-items:flex-end;gap:2px;">
                  <span class="cs-badge cs-badge-${l.priority}">${l.leadScore}/100</span>
                </div>
              </div>
            `).join('')}
          </div>

          <div style="display:flex;gap:6px;margin-top:4px;">
            <button class="cs-btn cs-btn-secondary" id="cs-export-current-csv" style="flex:1;">CSV (${sorted.length})</button>
            <button class="cs-btn cs-btn-primary" id="cs-sync-crm-all" style="flex:1;">Sync CRM</button>
            <button class="cs-btn cs-btn-danger" id="cs-clear-batch" style="padding:7px 10px;" title="Clear Ledger">🗑️</button>
          </div>
        </div>
      `;
    }

    if (activeTab === 'export') {
      return `
        <div style="display:flex;flex-direction:column;gap:12px;font-family:monospace;">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <div style="font-weight:bold;color:#00F0FF;font-size:12px;">Targeted Export Center (All Details)</div>
            <select id="cs-export-sort-select" style="background:#161D2E;color:#00F0FF;border:1px solid #334155;padding:4px;border-radius:6px;font-size:9.5px;">
              <option value="SCORE_DESC" ${sortBy === 'SCORE_DESC' ? 'selected' : ''}>Sort: Score High → Low</option>
              <option value="SCORE_ASC" ${sortBy === 'SCORE_ASC' ? 'selected' : ''}>Sort: Score Low → High</option>
              <option value="RATING_DESC" ${sortBy === 'RATING_DESC' ? 'selected' : ''}>Sort: Rating High → Low</option>
              <option value="REVIEWS_DESC" ${sortBy === 'REVIEWS_DESC' ? 'selected' : ''}>Sort: Reviews High → Low</option>
            </select>
          </div>
          
          <div style="display:flex;flex-direction:column;gap:6px;">
            <button class="cs-btn cs-btn-secondary" id="cs-exp-noweb" style="justify-content:space-between;">
              <span>❌ Export No-Website Leads (All Details)</span>
              <span class="cs-badge cs-badge-missing">${metrics.noWebsite}</span>
            </button>
            <button class="cs-btn cs-btn-secondary" id="cs-exp-social" style="justify-content:space-between;">
              <span>📱 Export Social-Only Leads</span>
              <span class="cs-badge cs-badge-social">${metrics.socialOnly}</span>
            </button>
            <button class="cs-btn cs-btn-secondary" id="cs-exp-nosocial" style="justify-content:space-between;">
              <span>🚫 Export No-Social-Media Leads</span>
              <span class="cs-badge cs-badge-warm">${metrics.noSocial}</span>
            </button>
            <button class="cs-btn cs-btn-secondary" id="cs-exp-ghost" style="justify-content:space-between;">
              <span>👻 Export Digital Ghosts (No Web + No Soc)</span>
              <span class="cs-badge cs-badge-ghost">${metrics.digitalGhost}</span>
            </button>
            <button class="cs-btn cs-btn-secondary" id="cs-exp-hot" style="justify-content:space-between;">
              <span>🔥 Export HOT Leads (>80 Score)</span>
              <span class="cs-badge cs-badge-hot">${metrics.hotLeads}</span>
            </button>
            <button class="cs-btn cs-btn-secondary" id="cs-exp-phone" style="justify-content:space-between;">
              <span>📞 Export Leads With Phone Numbers</span>
              <span class="cs-badge cs-badge-active">${metrics.withPhone}</span>
            </button>
            <button class="cs-btn cs-btn-secondary" id="cs-exp-highrated" style="justify-content:space-between;">
              <span>⭐ Export 4.5+ Star Opportunities</span>
              <span class="cs-badge cs-badge-active">${metrics.highRated}</span>
            </button>
            <button class="cs-btn cs-btn-primary" id="cs-exp-all" style="justify-content:space-between;margin-top:6px;">
              <span>📥 Export Complete Full-Detail CSV (${metrics.total} leads)</span>
              <span style="font-weight:bold;">CSV</span>
            </button>
            <button class="cs-btn cs-btn-secondary" id="cs-exp-json" style="justify-content:space-between;">
              <span>📋 Export Raw JSON Database</span>
              <span>JSON</span>
            </button>
          </div>
        </div>
      `;
    }

    // Default 'active' tab
    if (!activeLead) {
      return `
        <div style="text-align:center;padding:30px 10px;color:#64748B;font-family:monospace;">
          <div style="font-size:24px;margin-bottom:8px;">🎯</div>
          <div>Click or select any business card on Google Maps to audit and qualify in real time.</div>
        </div>
      `;
    }

    return `
      <div style="display:flex;flex-direction:column;gap:12px;">
        <div>
          <div style="font-size:14px;font-weight:bold;color:#FFFFFF;">${activeLead.name}</div>
          <div style="color:#94A3B8;font-size:11px;font-family:monospace;">${activeLead.category} &bull; ★ ${activeLead.rating} (${activeLead.reviewCount} reviews)</div>
          ${activeLead.phone ? `<div style="color:#38BDF8;font-size:11px;font-family:monospace;margin-top:2px;">📞 ${activeLead.phone}</div>` : '<div style="color:#F43F5E;font-size:10px;font-family:monospace;margin-top:2px;">❌ No Phone Detected</div>'}
          ${activeLead.email ? `<div style="color:#34D399;font-size:11px;font-family:monospace;margin-top:1px;">✉️ ${activeLead.email}</div>` : ''}
          ${activeLead.address ? `<div style="color:#64748B;font-size:10px;font-family:monospace;margin-top:1px;">📍 ${activeLead.address}</div>` : ''}
          ${activeLead.website ? `<div style="color:#A78BFA;font-size:10px;font-family:monospace;margin-top:1px;">🌐 ${activeLead.website}</div>` : ''}
        </div>

        <div style="display:flex;gap:5px;flex-wrap:wrap;">
          <span class="cs-badge cs-badge-${activeLead.priority}">Score: ${activeLead.leadScore}/100</span>
          <span class="cs-badge ${activeLead.isDigitalGhost ? 'cs-badge-ghost' : activeLead.websiteStatus === 'missing' ? 'cs-badge-missing' : activeLead.websiteStatus === 'social-only' ? 'cs-badge-social' : 'cs-badge-active'}">
            ${activeLead.isDigitalGhost ? '👻 Digital Ghost' : 'Web: ' + activeLead.websiteStatus}
          </span>
          <span class="cs-badge ${activeLead.hasSocial ? 'cs-badge-active' : 'cs-badge-missing'}">
            Social: ${activeLead.hasSocial ? 'Active' : 'None'}
          </span>
        </div>

        <div style="background:#0F172A;border:1px solid #1E293B;padding:10px;border-radius:8px;font-family:monospace;font-size:11px;">
          <div style="color:#00F0FF;font-weight:bold;margin-bottom:3px;">RECOMMENDED CYBERSTYLE OFFER:</div>
          <div style="color:#E2E8F0;font-size:10.5px;line-height:1.4;">${activeLead.suggestedOffer}</div>
        </div>

        <div style="display:flex;gap:5px;flex-wrap:wrap;">
          <button class="cs-btn cs-btn-primary" id="cs-push-active-crm" style="flex:1;">
            🚀 Push CRM
          </button>
          <button class="cs-btn cs-btn-secondary" id="cs-copy-pitch-web" style="flex:1;">
            📋 Pitch (Site)
          </button>
          <button class="cs-btn cs-btn-secondary" id="cs-copy-pitch-soc" style="flex:1;">
            📱 Pitch (Social)
          </button>
          <button class="cs-btn cs-btn-secondary" id="cs-copy-pitch-ghost" style="flex:1;">
            👻 Pitch (Ghost)
          </button>
        </div>
      </div>
    `;
  }

  function bindTabActions() {
    if (activeTab === 'settings') {
      const saveBtn = document.getElementById('cs-save-settings');
      if (saveBtn) {
        saveBtn.addEventListener('click', () => {
          const apiUrl = document.getElementById('cs-setting-api')?.value?.trim() || DEFAULT_SETTINGS.apiUrl;
          const autoSync = document.getElementById('cs-setting-autosync')?.checked ?? true;
          saveSettings({
            ...getSettings(),
            apiUrl,
            autoSyncToDashboard: autoSync,
          });
          showToast('Settings saved successfully!', 'success');
          pingDashboardConnection();
        });
      }

      const openDashBtn = document.getElementById('cs-open-dash-btn');
      if (openDashBtn) {
        openDashBtn.addEventListener('click', () => {
          window.open(getSettings().dashboardUrl, '_blank');
        });
      }
    }

    if (activeTab === 'scanner') {
      const regionCategorySelect = document.getElementById('cs-region-category-select');
      if (regionCategorySelect) {
        regionCategorySelect.addEventListener('change', (e) => {
          selectedRegionCategory = e.target.value;
          renderHud();
        });
      }

      const execBtn = document.getElementById('cs-execute-search');
      if (execBtn) {
        execBtn.addEventListener('click', () => {
          const customQuery = document.getElementById('cs-custom-query')?.value?.trim();
          if (customQuery) {
            window.location.href = `https://www.google.com/maps/search/${encodeURIComponent(customQuery)}/`;
            return;
          }
          const niche = document.getElementById('cs-niche-select').value;
          const city = document.getElementById('cs-city-select').value;
          const query = encodeURIComponent(`${niche} in ${city}`);
          window.location.href = `https://www.google.com/maps/search/${query}/`;
        });
      }

      const scanBtn = document.getElementById('cs-toggle-scan');
      if (scanBtn) {
        scanBtn.addEventListener('click', runAutoScan);
      }
    }

    if (activeTab === 'batch') {
      const searchInput = document.getElementById('cs-search-input');
      if (searchInput) {
        searchInput.addEventListener('input', (e) => {
          searchFilterQuery = e.target.value;
          renderHud();
        });
      }

      const sortSelect = document.getElementById('cs-sort-select');
      if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
          sortBy = e.target.value;
          renderHud();
        });
      }

      const exportCsvBtn = document.getElementById('cs-export-current-csv');
      if (exportCsvBtn) exportCsvBtn.addEventListener('click', () => exportComprehensiveCsv(batchFilter));

      document.getElementById('cs-filter-all')?.addEventListener('click', () => { batchFilter = 'ALL'; renderHud(); });
      document.getElementById('cs-filter-noweb')?.addEventListener('click', () => { batchFilter = 'NO_WEBSITE'; renderHud(); });
      document.getElementById('cs-filter-social')?.addEventListener('click', () => { batchFilter = 'SOCIAL_ONLY'; renderHud(); });
      document.getElementById('cs-filter-nosocial')?.addEventListener('click', () => { batchFilter = 'NO_SOCIAL'; renderHud(); });
      document.getElementById('cs-filter-ghost')?.addEventListener('click', () => { batchFilter = 'DIGITAL_GHOST'; renderHud(); });
      document.getElementById('cs-filter-hot')?.addEventListener('click', () => { batchFilter = 'HOT'; renderHud(); });
      document.getElementById('cs-filter-phone')?.addEventListener('click', () => { batchFilter = 'WITH_PHONE'; renderHud(); });

      const syncAll = document.getElementById('cs-sync-crm-all');
      if (syncAll) {
        syncAll.addEventListener('click', () => {
          const leads = getBatchLeads();
          showToast(`Syncing ${leads.length} leads to Dashboard...`, 'info');
          pushLeadToCrm(leads, (err, res) => {
            if (err) showToast(err.message || 'Sync failed', 'error');
            else showToast(`Synced ${leads.length} leads to PostgreSQL!`, 'success');
          });
        });
      }

      const clearBtn = document.getElementById('cs-clear-batch');
      if (clearBtn) {
        clearBtn.addEventListener('click', () => {
          if (confirm('Clear all collected batch leads?')) {
            saveBatchLeads([]);
            showToast('Batch ledger cleared.', 'info');
            renderHud();
          }
        });
      }
    }

    if (activeTab === 'export') {
      const expSortSelect = document.getElementById('cs-export-sort-select');
      if (expSortSelect) {
        expSortSelect.addEventListener('change', (e) => {
          sortBy = e.target.value;
        });
      }

      document.getElementById('cs-exp-noweb')?.addEventListener('click', () => exportComprehensiveCsv('NO_WEBSITE'));
      document.getElementById('cs-exp-social')?.addEventListener('click', () => exportComprehensiveCsv('SOCIAL_ONLY'));
      document.getElementById('cs-exp-nosocial')?.addEventListener('click', () => exportComprehensiveCsv('NO_SOCIAL'));
      document.getElementById('cs-exp-ghost')?.addEventListener('click', () => exportComprehensiveCsv('DIGITAL_GHOST'));
      document.getElementById('cs-exp-hot')?.addEventListener('click', () => exportComprehensiveCsv('HOT'));
      document.getElementById('cs-exp-phone')?.addEventListener('click', () => exportComprehensiveCsv('WITH_PHONE'));
      document.getElementById('cs-exp-highrated')?.addEventListener('click', () => exportComprehensiveCsv('HIGH_RATED'));
      document.getElementById('cs-exp-all')?.addEventListener('click', () => exportComprehensiveCsv('ALL'));
      document.getElementById('cs-exp-json')?.addEventListener('click', exportComprehensiveJson);
    }

    if (activeTab === 'active' && activeLead) {
      document.getElementById('cs-push-active-crm')?.addEventListener('click', () => {
        pushLeadToCrm(activeLead, (err) => {
          if (err) showToast(err.message || 'CRM push failed', 'error');
          else showToast('Lead pushed to CYBERSTYLE CRM Dashboard!', 'success');
        });
      });

      document.getElementById('cs-copy-pitch-web')?.addEventListener('click', () => {
        const pitch = generateOutreachDraft(activeLead, 'website');
        _GM_setClipboard(pitch);
        showToast('Website pitch copied to clipboard!', 'success');
      });

      document.getElementById('cs-copy-pitch-soc')?.addEventListener('click', () => {
        const pitch = generateOutreachDraft(activeLead, 'social');
        _GM_setClipboard(pitch);
        showToast('Social growth pitch copied to clipboard!', 'success');
      });

      document.getElementById('cs-copy-pitch-ghost')?.addEventListener('click', () => {
        const pitch = generateOutreachDraft(activeLead, 'ghost');
        _GM_setClipboard(pitch);
        showToast('Digital Ghost pitch copied to clipboard!', 'success');
      });
    }
  }

  function makeDraggable(el) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    const header = el.querySelector('#cs-header-bar') || el;
    header.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
      e = e || window.event;
      if (e.target.tagName === 'BUTTON' || e.target.tagName === 'SELECT' || e.target.tagName === 'INPUT') return;
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
      e = e || window.event;
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      el.style.top = el.offsetTop - pos2 + 'px';
      el.style.left = el.offsetLeft - pos1 + 'px';
      el.style.right = 'auto';
    }

    function closeDragElement() {
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }

  // ============================================================================
  // 10. OBSERVER & INITIALIZATION LOOP
  // ============================================================================
  function startObserver() {
    createHud();
    let lastName = '';

    setInterval(() => {
      if (!document.getElementById('cyberstyle-hud')) {
        createHud();
      }

      const lead = extractActiveBusiness();
      if (lead && lead.name && lead.name !== lastName) {
        lastName = lead.name;
        activeLead = lead;

        const batch = getBatchLeads();
        if (!batch.some((b) => b.name === lead.name)) {
          batch.unshift(lead);
          saveBatchLeads(batch.slice(0, 1000));

          // Auto-push to PostgreSQL CRM if enabled
          const settings = getSettings();
          if (settings.autoSyncToDashboard) {
            pushLeadToCrm(lead, () => {});
          }
        }

        renderHud();
      }
    }, 1200);
  }

  if (document.body) {
    startObserver();
  } else {
    window.addEventListener('DOMContentLoaded', startObserver);
    window.addEventListener('load', startObserver);
  }
})();
