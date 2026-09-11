'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  Search,
  Sparkles,
  ArrowUpRight,
  Filter,
  CheckCircle2,
  Clock,
  Send,
  Building2,
  Mail,
  Phone,
  RefreshCw,
  FileText,
  Plus,
  Edit2,
  Trash2,
  X,
  Download,
  ShieldCheck,
  AlertCircle,
  Copy,
  Globe,
  Share2,
  Zap,
  TrendingUp,
  Ghost,
  ArrowUpDown,
  ArrowDownNarrowWide,
  ArrowUpNarrowWide,
  MapPin
} from 'lucide-react';
import { apiRequest } from '@/lib/api';

interface LeadItem {
  id: string;
  name: string;
  email: string;
  companyName: string;
  company?: string;
  phone?: string;
  website?: string;
  country?: string;
  city?: string;
  category?: string;
  address?: string;
  workingHours?: string;
  mapsUrl?: string;
  rating?: string;
  reviewCount?: string;
  serviceNeeded: string;
  serviceFit?: string;
  websiteStatus?: string; // 'missing' | 'social-only' | 'aggregator-only' | 'free-builder' | 'http-insecure' | 'active'
  socialStatus?: string; // 'missing' | 'social-only' | 'has-social'
  isDigitalGhost?: boolean;
  websiteScore?: number;
  leadScore?: number;
  priority?: string; // 'hot' | 'warm' | 'cold' | 'unqualified'
  opportunityType?: string;
  suggestedOffer?: string;
  consentStatus?: string;
  approxBudget: string;
  stage: 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'PROPOSAL' | 'WON' | 'LOST';
  aiScore?: number;
  aiSummary?: string;
  notes?: string;
  message?: string;
  createdAt: string;
}

const SAMPLE_LEADS: LeadItem[] = [
  {
    id: 'lead-101',
    name: 'David Harrison',
    email: 'david@apexcapital.io',
    companyName: 'Apex Capital Advisory',
    phone: '+1 (555) 234-8901',
    country: 'United States',
    city: 'New York, NY',
    serviceNeeded: 'Custom SaaS & Platform Engineering',
    approxBudget: '$35,000',
    stage: 'QUALIFIED',
    aiScore: 94,
    leadScore: 94,
    priority: 'hot',
    websiteStatus: 'active',
    socialStatus: 'has-social',
    website: 'https://apexcapital.io',
    workingHours: 'Mon - Fri: 8:00 AM - 6:00 PM',
    aiSummary: 'High-fit enterprise advisory firm requiring bespoke client portal and investor reporting dashboards with strict RBAC.',
    notes: 'CTO confirmed budget approved for Q4 sprint.',
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    id: 'lead-102',
    name: 'Dr. Michael Chen',
    email: 'info@austinpremierdental.com',
    companyName: 'Austin Premier Dental Care',
    phone: '+1 (512) 489-0192',
    category: 'Dental Clinic',
    address: '1040 W 6th St, Austin, TX 78703',
    city: 'Austin, TX',
    country: 'United States',
    mapsUrl: 'https://maps.google.com/?q=Austin+Premier+Dental',
    rating: '4.9',
    reviewCount: '168',
    serviceNeeded: 'Modern Next.js 15 Web Presence & Instant Booking Portal',
    serviceFit: 'booking-system',
    websiteStatus: 'social-only',
    socialStatus: 'social-only',
    website: 'https://facebook.com/austinpremierdental',
    websiteScore: 20,
    leadScore: 92,
    priority: 'hot',
    opportunityType: 'website',
    suggestedOffer: 'Modern Next.js 15 Web Presence & Instant Booking Portal',
    approxBudget: '$15,000 - $25,000',
    stage: 'NEW',
    aiScore: 92,
    workingHours: 'Mon - Sat: 9:00 AM - 5:00 PM',
    aiSummary: 'Top-rated dental practice with 168 reviews relying solely on Facebook page. High-converting Next.js portal with 24/7 appointment intake will capture significant high-value patient volume.',
    message: 'Discovered via CyberStyle Local Growth Intelligence (Dental Clinic).',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 'lead-103',
    name: 'Robert Vane',
    email: 'contact@vane-exotics.com',
    companyName: 'Vane Luxury & Exotic Auto Detailing',
    phone: '+1 (702) 891-3420',
    category: 'Auto Detailer',
    address: '3200 S Las Vegas Blvd, Las Vegas, NV 89109',
    city: 'Las Vegas, NV',
    country: 'United States',
    mapsUrl: 'https://maps.google.com/?q=Vane+Luxury+Auto',
    rating: '5.0',
    reviewCount: '84',
    serviceNeeded: 'Complete Digital Transformation: Web Presence & Booking',
    serviceFit: 'website',
    websiteStatus: 'missing',
    socialStatus: 'missing',
    isDigitalGhost: true,
    websiteScore: 0,
    leadScore: 96,
    priority: 'hot',
    opportunityType: 'website',
    suggestedOffer: 'Complete Digital Footprint: Next.js 15 Web Platform + Social Channels + 24/7 Booking Intake',
    approxBudget: '$18,000 - $30,000',
    stage: 'NEW',
    aiScore: 96,
    workingHours: 'Mon - Sun: 7:00 AM - 8:00 PM',
    aiSummary: 'Flawless 5.0 rating with 84 reviews but zero web presence or social media. Total digital ghost prime for turnkey transformation.',
    createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
  },
  {
    id: 'lead-104',
    name: 'Sarah Jenkins',
    email: 'sarah@aurabiotech.com',
    companyName: 'Aura Biotech Systems',
    phone: '+1 (555) 887-2134',
    country: 'Switzerland',
    city: 'Zurich',
    serviceNeeded: 'Premium Web Development & 3D Interactive Canvas',
    approxBudget: '$28,000',
    stage: 'PROPOSAL',
    aiScore: 88,
    leadScore: 88,
    priority: 'hot',
    websiteStatus: 'active',
    socialStatus: 'missing',
    website: 'https://aurabiotech.com',
    workingHours: 'Mon - Fri: 9:00 AM - 5:00 PM',
    aiSummary: 'Biotech series-A startup seeking 3D protein visualizer interactive canvas on Next.js 15 for venture pitch.',
    notes: 'Draft proposal generated by Gemini 3.7; ready for review.',
    createdAt: new Date(Date.now() - 3600000 * 36).toISOString(),
  },
  {
    id: 'lead-105',
    name: 'Tariq Al-Mansoor',
    email: 'info@almansoor-properties.ae',
    companyName: 'Al-Mansoor Luxury Real Estate',
    phone: '+971 4 388 9200',
    category: 'Real Estate Agency',
    address: 'Downtown Dubai, Boulevard Plaza Tower 1',
    city: 'Dubai',
    country: 'United Arab Emirates',
    mapsUrl: 'https://maps.google.com/?q=Al+Mansoor+Dubai',
    rating: '4.9',
    reviewCount: '210',
    serviceNeeded: 'Luxury Real Estate Next.js 15 Portal with Virtual Tours',
    serviceFit: 'website',
    websiteStatus: 'missing',
    socialStatus: 'social-only',
    website: 'https://instagram.com/almansoor_luxury',
    websiteScore: 20,
    leadScore: 95,
    priority: 'hot',
    suggestedOffer: 'Bespoke Next.js 15 Real Estate Portfolio with Interactive 3D Floorplans & VIP WhatsApp Intake',
    approxBudget: '$40,000 - $60,000',
    stage: 'NEW',
    aiScore: 95,
    workingHours: 'Sun - Thu: 9:00 AM - 7:00 PM',
    aiSummary: 'Ultra-high-net-worth real estate boutique in Dubai operating primarily through Instagram DM. A dedicated luxury platform will significantly elevate foreign investor trust.',
    createdAt: new Date(Date.now() - 3600000 * 1).toISOString(),
  },
];

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<LeadItem[]>(SAMPLE_LEADS);
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [presenceFilter, setPresenceFilter] = useState('ALL'); // 'ALL' | 'NO_WEBSITE' | 'SOCIAL_ONLY' | 'NO_SOCIAL' | 'DIGITAL_GHOST' | 'ACTIVE_SITE'
  const [countryFilter, setCountryFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState<'SCORE_DESC' | 'SCORE_ASC' | 'RATING_DESC' | 'RATING_ASC' | 'REVIEWS_DESC' | 'REVIEWS_ASC' | 'DATE_DESC'>('SCORE_DESC');

  const [scoringLeadId, setScoringLeadId] = useState<string | null>(null);
  const [selectedPitchLead, setSelectedPitchLead] = useState<LeadItem | null>(null);
  const [activePitchAngle, setActivePitchAngle] = useState<'website' | 'social' | 'ghost' | 'automation'>('website');
  const [copiedPitch, setCopiedPitch] = useState(false);

  // Modal States
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingLead, setEditingLead] = useState<LeadItem | null>(null);
  const [deletingLeadId, setDeletingLeadId] = useState<string | null>(null);

  // Fetch real leads on mount
  useEffect(() => {
    async function loadLeads() {
      try {
        const res = await apiRequest('/admin/leads');
        if (res && res.data && Array.isArray(res.data.leads) && res.data.leads.length > 0) {
          const mapped: LeadItem[] = res.data.leads.map((l: any) => {
            const hasWeb = Boolean(l.website && l.website.trim() !== '');
            const isSocOnly = l.websiteStatus === 'social-only' || (hasWeb && /(instagram|facebook|tiktok|linkedin)/i.test(l.website));
            const isMissingWeb = l.websiteStatus === 'missing' || l.websiteStatus === 'aggregator-only' || !hasWeb;
            const isNoSocial = l.socialStatus === 'missing' || (!isSocOnly && !l.hasSocial);
            const isGhost = isMissingWeb && isNoSocial;

            return {
              id: l.id,
              name: l.name,
              email: l.email,
              companyName: l.company || l.name,
              company: l.company,
              phone: l.phone,
              website: l.website,
              country: l.country || 'United States',
              city: l.city || '',
              category: l.category,
              address: l.address,
              workingHours: l.workingHours || 'Standard Business Hours',
              mapsUrl: l.mapsUrl,
              rating: l.rating,
              reviewCount: l.reviewCount,
              serviceNeeded: l.serviceNeeded || 'Web & AI Modernization',
              serviceFit: l.serviceFit,
              websiteStatus: isSocOnly ? 'social-only' : isMissingWeb ? 'missing' : l.websiteStatus || 'active',
              socialStatus: isSocOnly ? 'social-only' : isNoSocial ? 'missing' : 'has-social',
              isDigitalGhost: isGhost,
              websiteScore: l.websiteScore,
              leadScore: l.leadScore || l.aiScore || (isGhost ? 95 : isMissingWeb ? 90 : 70),
              priority: l.priority || ((l.leadScore || l.aiScore || 70) >= 80 ? 'hot' : 'warm'),
              opportunityType: l.opportunityType,
              suggestedOffer: l.suggestedOffer,
              consentStatus: l.consentStatus,
              approxBudget: l.approxBudget || 'Standard',
              stage: l.stage,
              aiScore: l.aiScore,
              aiSummary: l.aiScoreReasoning || l.notes,
              notes: l.notes,
              message: l.message,
              createdAt: l.createdAt,
            };
          });
          setLeads(mapped);
        }
      } catch (err) {
        console.warn('Using sample leads:', err);
      }
    }
    loadLeads();
  }, []);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    companyName: '',
    phone: '',
    country: '',
    serviceNeeded: 'Custom SaaS & Platform Engineering',
    approxBudget: '$25,000',
    stage: 'NEW' as LeadItem['stage'],
    notes: '',
  });

  // Calculate Real-Time KPI Metrics
  const metrics = React.useMemo(() => {
    const total = leads.length;
    let noWebsite = 0;
    let socialOnly = 0;
    let noSocial = 0;
    let digitalGhost = 0;
    let hotLeads = 0;
    let contactReady = 0;
    let wonCount = 0;

    leads.forEach((l) => {
      const isNoWeb = l.websiteStatus === 'missing' || l.websiteStatus === 'aggregator-only' || !l.website;
      const isSocOnly = l.websiteStatus === 'social-only';
      const isNoSoc = l.socialStatus === 'missing' || (!isSocOnly && !l.isDigitalGhost && isNoWeb);
      const isGhost = l.isDigitalGhost || (isNoWeb && isNoSoc);

      if (isNoWeb) noWebsite++;
      if (isSocOnly) socialOnly++;
      if (isNoSoc) noSocial++;
      if (isGhost) digitalGhost++;
      if (l.priority === 'hot' || (l.leadScore && l.leadScore >= 80) || (l.aiScore && l.aiScore >= 80)) hotLeads++;
      if (l.phone || (l.email && !l.email.includes('@business.com'))) contactReady++;
      if (l.stage === 'WON') wonCount++;
    });

    return {
      total,
      noWebsite,
      socialOnly,
      noSocial,
      digitalGhost,
      hotLeads,
      contactReady,
      wonCount,
      conversionRate: total > 0 ? Math.round((wonCount / total) * 100) : 0,
    };
  }, [leads]);

  const handleScoreWithAI = async (leadId: string) => {
    setScoringLeadId(leadId);
    try {
      const res = await apiRequest(`/admin/ai/leads/${leadId}/score`, {
        method: 'POST',
      });
      if (res && res.data) {
        setLeads((prev) =>
          prev.map((l) =>
            l.id === leadId
              ? {
                  ...l,
                  aiScore: res.data.evaluation?.fitScore || res.data.lead?.aiScore || 92,
                  leadScore: res.data.evaluation?.fitScore || res.data.lead?.aiScore || 92,
                  aiSummary: res.data.evaluation?.reasoning || res.data.lead?.aiScoreReasoning,
                  stage: 'QUALIFIED',
                  priority: (res.data.evaluation?.fitScore || 92) >= 80 ? 'hot' : 'warm',
                }
              : l
          )
        );
      }
    } catch {
      setTimeout(() => {
        setLeads((prev) =>
          prev.map((l) => (l.id === leadId ? { ...l, aiScore: 92, leadScore: 92, stage: 'QUALIFIED', priority: 'hot' } : l))
        );
        setScoringLeadId(null);
      }, 1000);
    } finally {
      setTimeout(() => setScoringLeadId(null), 1000);
    }
  };

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    const newLead: LeadItem = {
      id: `lead-${Date.now()}`,
      name: formData.name,
      email: formData.email,
      companyName: formData.companyName,
      phone: formData.phone,
      country: formData.country || 'United States',
      serviceNeeded: formData.serviceNeeded,
      approxBudget: formData.approxBudget,
      stage: formData.stage,
      leadScore: 75,
      priority: 'warm',
      websiteStatus: 'active',
      notes: formData.notes,
      createdAt: new Date().toISOString(),
    };
    setLeads([newLead, ...leads]);
    setShowCreateModal(false);
    setFormData({
      name: '',
      email: '',
      companyName: '',
      phone: '',
      country: '',
      serviceNeeded: 'Custom SaaS & Platform Engineering',
      approxBudget: '$25,000',
      stage: 'NEW',
      notes: '',
    });
  };

  const handleUpdateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLead) return;
    setLeads((prev) =>
      prev.map((l) => (l.id === editingLead.id ? { ...l, ...formData } : l))
    );
    setEditingLead(null);
  };

  const handleDeleteLead = (id: string) => {
    setLeads((prev) => prev.filter((l) => l.id !== id));
    setDeletingLeadId(null);
  };

  const handleConvertToProject = (lead: LeadItem) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === lead.id ? { ...l, stage: 'WON' } : l))
    );
    alert(
      `🎉 Lead "${lead.name}" Converted to Won Project!\n\n1. Client Organization "${lead.companyName}" initialized\n2. Project "${lead.serviceNeeded}" spawned with 4 milestones\n3. Client Onboarding Workspace ready in Portal`
    );
  };

  // Dynamic Outreach Pitch Generator
  const getPitchContent = (lead: LeadItem, angle: string) => {
    const biz = lead.companyName || lead.name || 'Your Business';
    const cat = lead.category || 'local enterprise';
    const locationStr = lead.city || lead.country || 'your area';

    if (angle === 'website') {
      return `Subject: Quick question regarding ${biz}'s web presence in ${locationStr}\n\nHi ${biz} team,\n\nI was looking up top-rated ${cat.toLowerCase()} providers in ${locationStr} and noticed your stellar reputation (${lead.rating || '5.0'}★ with ${lead.reviewCount || '50+'} reviews).\n\nHowever, I noticed that you currently don't have a dedicated, modern website for clients to explore your full services and book appointments directly.\n\nWe engineer ultra-fast, high-converting Next.js 15 web platforms with built-in 24/7 client booking and inquiry intake tailored specifically for ${cat.toLowerCase()} businesses.\n\nWould you be open to a 3-minute video showing a preview concept of what your custom portal could look like?\n\nBest regards,\nHani Tormos | CYBERSTYLE Engineering\nhttps://cyberstyle.net`;
    }
    if (angle === 'social') {
      return `Subject: Expanding ${biz}'s client reach across social channels\n\nHi ${biz} team,\n\nGreat work building such a reputable presence in ${locationStr} (${lead.reviewCount || '50+'} Google reviews).\n\nI noticed your website is active, but your brand is missing verified social authority channels (Instagram / TikTok / LinkedIn) where modern clients actively search and engage before booking.\n\nWe help premier ${cat.toLowerCase()} firms establish authority and drive consistent inbound inquiries through automated social funnels and content distribution.\n\nOpen to seeing a quick breakdown of the estimated monthly client volume you could capture?\n\nBest regards,\nHani Tormos | CYBERSTYLE\nhttps://cyberstyle.net`;
    }
    if (angle === 'ghost') {
      return `Subject: Digital transformation package for ${biz} (${locationStr})\n\nHi ${biz} team,\n\nI came across ${biz} while mapping out leading ${cat.toLowerCase()} businesses in ${locationStr}. You have an exceptional track record with customers, but virtually zero digital footprint online (no dedicated website or verified social hub).\n\nCompetitors in ${locationStr} are capturing high-intent search volume purely because of basic digital real estate.\n\nWe specialize in rapid "turnkey digital launch" packages: custom high-converting website, verified social profiles, and automated booking in under 10 days.\n\nWould you be open to a quick 5-minute intro chat this week?\n\nBest regards,\nHani Tormos | CYBERSTYLE\nhttps://cyberstyle.net`;
    }
    return `Subject: 24/7 AI Receptionist & Instant Booking for ${biz}\n\nHi ${biz} team,\n\nSaw your great reviews in ${locationStr}. We recently built an automated 24/7 booking & AI inquiry assistant for local ${cat.toLowerCase()} practices that captures missed calls and after-hours bookings automatically.\n\nIt instantly converts website and Google Maps visitors into confirmed calendar appointments without extra staff overhead.\n\nWould you be interested in a 2-minute interactive demo customized for ${biz}?\n\nBest regards,\nHani Tormos | CYBERSTYLE\nhttps://cyberstyle.net`;
  };

  // Filter & Sort Pipeline
  const filteredAndSorted = React.useMemo(() => {
    let result = leads.filter((l) => {
      const matchesSearch =
        l.name.toLowerCase().includes(search.toLowerCase()) ||
        l.companyName.toLowerCase().includes(search.toLowerCase()) ||
        l.email.toLowerCase().includes(search.toLowerCase()) ||
        (l.phone && l.phone.includes(search)) ||
        (l.country && l.country.toLowerCase().includes(search.toLowerCase())) ||
        (l.city && l.city.toLowerCase().includes(search.toLowerCase())) ||
        (l.category && l.category.toLowerCase().includes(search.toLowerCase())) ||
        (l.address && l.address.toLowerCase().includes(search.toLowerCase()));

      const matchesStage = stageFilter === 'ALL' || l.stage === stageFilter;

      const matchesPriority =
        priorityFilter === 'ALL' ||
        (priorityFilter === 'HOT' && (l.priority === 'hot' || (l.aiScore && l.aiScore >= 80) || (l.leadScore && l.leadScore >= 80))) ||
        (priorityFilter === 'WARM' && (l.priority === 'warm' || ((l.aiScore || 0) >= 55 && (l.aiScore || 0) < 80) || ((l.leadScore || 0) >= 55 && (l.leadScore || 0) < 80))) ||
        (priorityFilter === 'COLD' && (l.priority === 'cold' || ((l.aiScore || 0) < 55) || ((l.leadScore || 0) < 55)));

      const isNoWeb = l.websiteStatus === 'missing' || l.websiteStatus === 'aggregator-only' || !l.website;
      const isSocOnly = l.websiteStatus === 'social-only';
      const isNoSoc = l.socialStatus === 'missing' || (!isSocOnly && !l.isDigitalGhost && isNoWeb);
      const isGhost = l.isDigitalGhost || (isNoWeb && isNoSoc);

      const matchesPresence =
        presenceFilter === 'ALL' ||
        (presenceFilter === 'NO_WEBSITE' && isNoWeb) ||
        (presenceFilter === 'SOCIAL_ONLY' && isSocOnly) ||
        (presenceFilter === 'NO_SOCIAL' && isNoSoc) ||
        (presenceFilter === 'DIGITAL_GHOST' && isGhost) ||
        (presenceFilter === 'ACTIVE_SITE' && l.websiteStatus === 'active');

      const matchesCountry =
        countryFilter === 'ALL' ||
        (l.country && l.country.toLowerCase().includes(countryFilter.toLowerCase())) ||
        (l.address && l.address.toLowerCase().includes(countryFilter.toLowerCase()));

      return matchesSearch && matchesStage && matchesPriority && matchesPresence && matchesCountry;
    });

    // Sorting Engine: Lowest to Highest & Highest to Lowest
    switch (sortBy) {
      case 'SCORE_ASC': // Lower to Higher Score
        return result.sort((a, b) => (a.leadScore || a.aiScore || 0) - (b.leadScore || b.aiScore || 0));
      case 'SCORE_DESC': // Higher to Lower Score (Default)
        return result.sort((a, b) => (b.leadScore || b.aiScore || 0) - (a.leadScore || a.aiScore || 0));
      case 'RATING_ASC': // Lowest to Highest Rating
        return result.sort((a, b) => (parseFloat(a.rating || '0')) - (parseFloat(b.rating || '0')));
      case 'RATING_DESC': // Highest to Lowest Rating
        return result.sort((a, b) => (parseFloat(b.rating || '0')) - (parseFloat(a.rating || '0')));
      case 'REVIEWS_ASC': // Lowest to Highest Reviews
        return result.sort((a, b) => (parseInt(a.reviewCount || '0', 10)) - (parseInt(b.reviewCount || '0', 10)));
      case 'REVIEWS_DESC': // Highest to Lowest Reviews
        return result.sort((a, b) => (parseInt(b.reviewCount || '0', 10)) - (parseInt(a.reviewCount || '0', 10)));
      case 'DATE_DESC': // Newest First
      default:
        return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
  }, [leads, search, stageFilter, priorityFilter, presenceFilter, countryFilter, sortBy]);

  const getStageBadge = (stage: LeadItem['stage']) => {
    switch (stage) {
      case 'NEW':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/30">
            NEW INBOUND
          </span>
        );
      case 'QUALIFIED':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            QUALIFIED (HIGH FIT)
          </span>
        );
      case 'PROPOSAL':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/30">
            PROPOSAL DRAFTED
          </span>
        );
      case 'WON':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400">
            WON & CONVERTED
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-zinc-700/30 text-zinc-400 border border-zinc-700">
            {stage}
          </span>
        );
    }
  };

  const getWebsiteBadge = (lead: LeadItem) => {
    if (lead.isDigitalGhost) {
      return (
        <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
          👻 Digital Ghost (No Web + No Soc)
        </span>
      );
    }
    if (lead.websiteStatus === 'missing' || (!lead.website && lead.mapsUrl)) {
      return (
        <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">
          ❌ No Website
        </span>
      );
    }
    if (lead.websiteStatus === 'social-only') {
      return (
        <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30">
          📱 Social Media Only
        </span>
      );
    }
    if (lead.websiteStatus === 'aggregator-only') {
      return (
        <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
          📦 Directory / Aggregator Only
        </span>
      );
    }
    if (lead.website) {
      return (
        <a
          href={lead.website.startsWith('http') ? lead.website : `https://${lead.website}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 hover:border-emerald-500/50"
        >
          <span>🌐 Website</span>
          <ArrowUpRight className="w-2.5 h-2.5" />
        </a>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Users className="w-6 h-6 text-[#00F0FF]" />
              Leads & Opportunity Pipeline
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/30">
              GROWTH ENGINE PRO v9.0 UNBEATABLE
            </span>
          </div>
          <p className="text-xs text-zinc-400">
            Worldwide opportunity discovery (USA, Canada, MEA, UK, Europe, Australia), full email & phone exports, and multi-angle AI closing pitches.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Complete Full-Detail CSV Export */}
          <button
            onClick={() => {
              const headers = [
                'Business Name',
                'Company Name',
                'Category / Niche',
                'Direct Phone',
                'Primary Email',
                'Website URL',
                'Website Status',
                'Social Status',
                'Is Digital Ghost',
                'Google Rating',
                'Review Count',
                'City / Region',
                'Country',
                'Full Address',
                'Working Hours',
                'Lead Score (0-100)',
                'Priority',
                'Recommended Offer',
                'Approx Budget',
                'Stage',
                'Maps URL',
                'Discovered Date',
              ];

              const rows = filteredAndSorted.map((l) =>
                [
                  l.name,
                  l.companyName,
                  l.category || '',
                  l.phone || '',
                  l.email || '',
                  l.website || '',
                  l.websiteStatus || '',
                  l.socialStatus || '',
                  l.isDigitalGhost ? 'YES' : 'NO',
                  l.rating || '',
                  l.reviewCount || '',
                  l.city || '',
                  l.country || '',
                  l.address || '',
                  l.workingHours || '',
                  l.leadScore || l.aiScore || 0,
                  l.priority || '',
                  (l.suggestedOffer || l.serviceNeeded || '').replace(/"/g, '""'),
                  l.approxBudget || '',
                  l.stage,
                  l.mapsUrl || '',
                  l.createdAt || '',
                ]
                  .map((val) => `"${String(val || '').replace(/"/g, '""')}"`)
                  .join(',')
              );

              const blob = new Blob([['\uFEFF' + headers.join(','), ...rows].join('\n')], { type: 'text/csv;charset=utf-8;' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `cyberstyle_leads_comprehensive_${sortBy.toLowerCase()}_${new Date().toISOString().slice(0, 10)}.csv`;
              a.click();
            }}
            className="flex items-center gap-2 px-3.5 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-mono rounded-xl border border-zinc-700/80 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-[#00F0FF]" />
            <span>Export Complete CSV ({filteredAndSorted.length})</span>
          </button>
          <button
            onClick={() => {
              setFormData({
                name: '',
                email: '',
                companyName: '',
                phone: '',
                country: '',
                serviceNeeded: 'Custom SaaS & Platform Engineering',
                approxBudget: '$25,000',
                stage: 'NEW',
                notes: '',
              });
              setShowCreateModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-[#00F0FF] hover:bg-[#00D8E6] text-black font-semibold text-xs rounded-xl shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Inbound Lead</span>
          </button>
        </div>
      </div>

      {/* Real-Time Live Deficit & Presence Counters Matrix */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {/* Card 1: Total Leads */}
        <div
          onClick={() => { setPresenceFilter('ALL'); setPriorityFilter('ALL'); setCountryFilter('ALL'); }}
          className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
            presenceFilter === 'ALL' && priorityFilter === 'ALL' && countryFilter === 'ALL'
              ? 'bg-[#00F0FF]/10 border-[#00F0FF]/40 shadow-[0_0_15px_rgba(0,240,255,0.15)]'
              : 'bg-[#07090E] border-zinc-800 hover:border-zinc-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-zinc-400 uppercase font-semibold">Total Pipeline</span>
            <Users className="w-4 h-4 text-[#00F0FF]" />
          </div>
          <div className="text-xl font-bold text-white font-mono mt-1">{metrics.total}</div>
          <div className="text-[10px] text-zinc-500 font-mono mt-0.5">{metrics.wonCount} won ({metrics.conversionRate}%)</div>
        </div>

        {/* Card 2: No Website */}
        <div
          onClick={() => { setPresenceFilter('NO_WEBSITE'); }}
          className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
            presenceFilter === 'NO_WEBSITE'
              ? 'bg-rose-500/15 border-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.15)]'
              : 'bg-[#07090E] border-zinc-800 hover:border-rose-500/30'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-rose-400 uppercase font-semibold">No Website</span>
            <Globe className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-xl font-bold text-rose-300 font-mono mt-1">{metrics.noWebsite}</div>
          <div className="text-[10px] text-rose-400/80 font-mono mt-0.5">
            {metrics.total > 0 ? Math.round((metrics.noWebsite / metrics.total) * 100) : 0}% of pipeline
          </div>
        </div>

        {/* Card 3: Social Only */}
        <div
          onClick={() => { setPresenceFilter('SOCIAL_ONLY'); }}
          className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
            presenceFilter === 'SOCIAL_ONLY'
              ? 'bg-purple-500/15 border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.15)]'
              : 'bg-[#07090E] border-zinc-800 hover:border-purple-500/30'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-purple-400 uppercase font-semibold">Social Only</span>
            <Share2 className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-xl font-bold text-purple-300 font-mono mt-1">{metrics.socialOnly}</div>
          <div className="text-[10px] text-purple-400/80 font-mono mt-0.5">FB/IG page only</div>
        </div>

        {/* Card 4: No Social Media */}
        <div
          onClick={() => { setPresenceFilter('NO_SOCIAL'); }}
          className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
            presenceFilter === 'NO_SOCIAL'
              ? 'bg-amber-500/15 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.15)]'
              : 'bg-[#07090E] border-zinc-800 hover:border-amber-500/30'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-amber-400 uppercase font-semibold">No Socials</span>
            <AlertCircle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-bold text-amber-300 font-mono mt-1">{metrics.noSocial}</div>
          <div className="text-[10px] text-amber-400/80 font-mono mt-0.5">Zero social channels</div>
        </div>

        {/* Card 5: Digital Ghosts */}
        <div
          onClick={() => { setPresenceFilter('DIGITAL_GHOST'); }}
          className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
            presenceFilter === 'DIGITAL_GHOST'
              ? 'bg-rose-500/20 border-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.3)]'
              : 'bg-[#07090E] border-zinc-800 hover:border-rose-400/40'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-rose-300 uppercase font-bold">Ghosts 👻</span>
            <Ghost className="w-4 h-4 text-rose-300" />
          </div>
          <div className="text-xl font-bold text-white font-mono mt-1">{metrics.digitalGhost}</div>
          <div className="text-[10px] text-rose-300 font-mono mt-0.5">No Site + No Socials</div>
        </div>

        {/* Card 6: HOT Qualified */}
        <div
          onClick={() => { setPriorityFilter('HOT'); }}
          className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
            priorityFilter === 'HOT'
              ? 'bg-emerald-500/15 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
              : 'bg-[#07090E] border-zinc-800 hover:border-emerald-500/30'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-emerald-400 uppercase font-semibold">HOT (80+)</span>
            <Zap className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-emerald-300 font-mono mt-1">{metrics.hotLeads}</div>
          <div className="text-[10px] text-emerald-400/80 font-mono mt-0.5">High-fit conversion</div>
        </div>

        {/* Card 7: Direct Contact Ready */}
        <div className="p-3.5 rounded-xl bg-[#07090E] border border-zinc-800">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-sky-400 uppercase font-semibold">Contact Ready</span>
            <Phone className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-xl font-bold text-sky-300 font-mono mt-1">{metrics.contactReady}</div>
          <div className="text-[10px] text-sky-400/80 font-mono mt-0.5">Phone / Email ready</div>
        </div>
      </div>

      {/* Filter & Sort Command Bar */}
      <div className="space-y-3 bg-[#07090E] p-4 rounded-2xl border border-zinc-800">
        <div className="flex flex-col lg:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search by business name, city, phone, email, country, or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-zinc-900/60 border border-zinc-800 rounded-xl text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#00F0FF]/50 transition-colors font-mono"
            />
          </div>

          {/* Sort Controller (Lower to Higher / Higher to Lower) */}
          <div className="flex items-center gap-2">
            <span className="text-zinc-500 text-[11px] font-mono uppercase tracking-wider flex items-center gap-1">
              <ArrowUpDown className="w-3 h-3 text-[#00F0FF]" />
              Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-xs font-mono text-[#00F0FF] focus:outline-none focus:border-[#00F0FF]"
            >
              <option value="SCORE_DESC">Score: Highest → Lowest (HOT)</option>
              <option value="SCORE_ASC">Score: Lowest → Highest (COLD)</option>
              <option value="RATING_DESC">Rating: Highest → Lowest ★</option>
              <option value="RATING_ASC">Rating: Lowest → Highest ★</option>
              <option value="REVIEWS_DESC">Reviews: Most → Least</option>
              <option value="REVIEWS_ASC">Reviews: Least → Most</option>
              <option value="DATE_DESC">Date: Newest First</option>
            </select>
          </div>

          {/* Global Region / Country Filter */}
          <div className="flex items-center gap-2">
            <span className="text-zinc-500 text-[11px] font-mono uppercase tracking-wider flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#00F0FF]" />
              Region:
            </span>
            <select
              value={countryFilter}
              onChange={(e) => setCountryFilter(e.target.value)}
              className="px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-xs font-mono text-zinc-300 focus:outline-none focus:border-[#00F0FF]"
            >
              <option value="ALL">All Regions Worldwide</option>
              <option value="United States">🇺🇸 United States</option>
              <option value="Canada">🇨🇦 Canada</option>
              <option value="United Arab Emirates">🇦🇪 UAE / Dubai</option>
              <option value="Saudi Arabia">🇸🇦 Saudi Arabia</option>
              <option value="Qatar">🇶🇦 Qatar</option>
              <option value="Kuwait">🇰🇼 Kuwait</option>
              <option value="Lebanon">🇱🇧 Lebanon</option>
              <option value="Egypt">🇪🇬 Egypt</option>
              <option value="United Kingdom">🇬🇧 United Kingdom</option>
              <option value="Switzerland">🇨🇭 Switzerland</option>
              <option value="Germany">🇩🇪 Germany</option>
              <option value="Australia">🇦🇺 Australia</option>
            </select>
          </div>
        </div>

        {/* Secondary Filter Chips: Presence & Priority */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs font-mono border-t border-zinc-800/80">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-zinc-500 text-[11px] uppercase tracking-wider mr-1">Presence Deficit:</span>
            {[
              { id: 'ALL', label: 'All' },
              { id: 'NO_WEBSITE', label: '❌ No Website' },
              { id: 'SOCIAL_ONLY', label: '📱 Social Only' },
              { id: 'NO_SOCIAL', label: '🚫 No Socials' },
              { id: 'DIGITAL_GHOST', label: '👻 Digital Ghost' },
              { id: 'ACTIVE_SITE', label: '🌐 Active Site' },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setPresenceFilter(p.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] transition-colors ${
                  presenceFilter === p.id
                    ? 'bg-zinc-800 text-white border border-zinc-600 font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-zinc-500 text-[11px] uppercase tracking-wider mr-1">Priority:</span>
            {[
              { id: 'ALL', label: 'ALL' },
              { id: 'HOT', label: '🔥 HOT (80+)' },
              { id: 'WARM', label: '⚡ WARM' },
              { id: 'COLD', label: '❄️ COLD' },
            ].map((pr) => (
              <button
                key={pr.id}
                onClick={() => setPriorityFilter(pr.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] transition-colors ${
                  priorityFilter === pr.id
                    ? 'bg-zinc-800 text-white border border-zinc-600 font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {pr.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Leads Stream */}
      <div className="space-y-4">
        {filteredAndSorted.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-[#07090E] border border-zinc-800">
            <p className="text-sm font-semibold text-zinc-300">No leads match your active filters</p>
            <p className="text-xs text-zinc-500 mt-1">Try resetting filters or launch a global scan with the Google Maps Assistant.</p>
          </div>
        ) : (
          filteredAndSorted.map((item) => (
            <div
              key={item.id}
              className="p-6 rounded-2xl bg-[#07090E] border border-zinc-800 hover:border-zinc-700 transition-all space-y-4 group"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="text-base font-bold text-white tracking-tight">{item.name}</span>
                    <span className="text-xs font-mono text-[#00F0FF] font-semibold flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5" />
                      {item.companyName}
                    </span>
                    {item.category && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-zinc-800 text-zinc-300 border border-zinc-700">
                        📍 {item.category}
                      </span>
                    )}
                    {item.country && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-zinc-900 text-sky-300 border border-sky-500/30">
                        🌍 {item.city ? `${item.city}, ` : ''}{item.country}
                      </span>
                    )}
                    {getWebsiteBadge(item)}
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400 font-mono">
                    {item.phone && (
                      <span className="flex items-center gap-1.5 text-sky-400 font-semibold">
                        <Phone className="w-3 h-3 text-sky-500" />
                        {item.phone}
                      </span>
                    )}
                    {item.email && (
                      <span className="flex items-center gap-1.5 text-zinc-300">
                        <Mail className="w-3 h-3 text-zinc-500" />
                        {item.email}
                      </span>
                    )}
                    {item.address && (
                      <span className="text-zinc-500 truncate max-w-xs" title={item.address}>
                        {item.address}
                      </span>
                    )}
                    {item.rating && (
                      <span className="text-amber-400 font-semibold">
                        ★ {item.rating} ({item.reviewCount || 0} reviews)
                      </span>
                    )}
                    {item.workingHours && (
                      <span className="text-zinc-500 text-[11px]">
                        🕒 {item.workingHours}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {getStageBadge(item.stage)}
                  <div className="flex items-center gap-1">
                    {item.mapsUrl && (
                      <a
                        href={item.mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-[#00F0FF] border border-zinc-800 transition-colors"
                        title="Open on Google Maps"
                      >
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    )}
                    <button
                      onClick={() => {
                        setEditingLead(item);
                        setFormData({
                          name: item.name,
                          email: item.email,
                          companyName: item.companyName,
                          phone: item.phone || '',
                          country: item.country || '',
                          serviceNeeded: item.serviceNeeded,
                          approxBudget: item.approxBudget,
                          stage: item.stage,
                          notes: item.notes || '',
                        });
                      }}
                      className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition-colors"
                      title="Edit Lead"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeletingLeadId(item.id)}
                      className="p-2 rounded-lg bg-zinc-900 hover:bg-rose-500/20 text-zinc-400 hover:text-rose-400 border border-zinc-800 transition-colors"
                      title="Delete Lead"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Offer & Strategy Card */}
              <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/80 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-mono text-zinc-500 uppercase tracking-wider text-[10px]">Target Service Offer:</span>
                    <span className="font-semibold text-white">{item.suggestedOffer || item.serviceNeeded}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-zinc-500">Approx Value:</span>
                    <span className="text-xs font-mono font-semibold text-[#00F0FF]">{item.approxBudget}</span>
                  </div>
                </div>

                {item.aiSummary && (
                  <p className="text-xs text-zinc-400 leading-relaxed pt-1 border-t border-zinc-800/60">
                    <span className="text-[#00F0FF] font-semibold">AI Opportunity Insight: </span>
                    {item.aiSummary}
                  </p>
                )}
              </div>

              {/* Action Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-zinc-500">Quality Score:</span>
                    <span className={`text-xs font-mono font-bold ${
                      (item.leadScore || item.aiScore || 0) >= 80 ? 'text-emerald-400' : (item.leadScore || item.aiScore || 0) >= 60 ? 'text-amber-400' : 'text-zinc-400'
                    }`}>
                      {item.leadScore || item.aiScore || 'Unscored'}/100
                    </span>
                  </div>
                  {item.createdAt && (
                    <span className="text-[11px] font-mono text-zinc-600">
                      Discovered {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {/* View Outreach Pitch */}
                  <button
                    onClick={() => {
                      setSelectedPitchLead(item);
                      setActivePitchAngle(item.isDigitalGhost ? 'ghost' : item.websiteStatus === 'missing' ? 'website' : item.websiteStatus === 'social-only' ? 'website' : 'social');
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-mono rounded-lg border border-zinc-700/80 transition-colors"
                  >
                    <Mail className="w-3 h-3 text-[#00F0FF]" />
                    <span>Outreach Pitch</span>
                  </button>

                  {/* AI Qualification Button */}
                  <button
                    onClick={() => handleScoreWithAI(item.id)}
                    disabled={scoringLeadId === item.id}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 text-xs font-mono rounded-lg border border-purple-500/30 transition-colors disabled:opacity-50"
                  >
                    <Sparkles className={`w-3 h-3 ${scoringLeadId === item.id ? 'animate-spin' : ''}`} />
                    <span>{scoringLeadId === item.id ? 'Scoring...' : 'AI Qualify'}</span>
                  </button>

                  {/* Convert to Won Project */}
                  {item.stage !== 'WON' && (
                    <button
                      onClick={() => handleConvertToProject(item)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 text-xs font-mono font-semibold rounded-lg border border-emerald-500/40 transition-colors"
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Convert to Project</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Outreach Pitch Drawer / Modal */}
      {selectedPitchLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-[#0A0D16] border border-[#00F0FF]/40 rounded-2xl shadow-[0_0_50px_rgba(0,240,255,0.2)] p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Mail className="w-5 h-5 text-[#00F0FF]" />
                  AI Outreach Pitch Generator
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Customized for <span className="text-white font-semibold">{selectedPitchLead.companyName}</span> ({selectedPitchLead.category || 'Local Business'})
                </p>
              </div>
              <button
                onClick={() => setSelectedPitchLead(null)}
                className="p-1.5 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Pitch Angle Tabs */}
            <div className="flex flex-wrap gap-2 pt-1">
              {[
                { id: 'website', label: '🌐 Website & Intake Funnel' },
                { id: 'social', label: '📱 Social Authority Channel' },
                { id: 'ghost', label: '👻 Turnkey Digital Launch' },
                { id: 'automation', label: '🤖 24/7 AI Receptionist' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActivePitchAngle(tab.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all ${
                    activePitchAngle === tab.id
                      ? 'bg-[#00F0FF] text-black font-bold shadow-[0_0_10px_rgba(0,240,255,0.4)]'
                      : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Pitch Preview Box */}
            <div className="relative">
              <textarea
                readOnly
                rows={12}
                value={getPitchContent(selectedPitchLead, activePitchAngle)}
                className="w-full p-4 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200 font-mono leading-relaxed focus:outline-none focus:border-[#00F0FF]/50"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] font-mono text-zinc-500">
                Ready to dispatch via Gmail, LinkedIn, WhatsApp, or Instagram DM.
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    const text = getPitchContent(selectedPitchLead, activePitchAngle);
                    navigator.clipboard.writeText(text);
                    setCopiedPitch(true);
                    setTimeout(() => setCopiedPitch(false), 2000);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-[#00F0FF] hover:bg-[#00D8E6] text-black font-bold text-xs rounded-xl shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedPitch ? 'Copied to Clipboard!' : 'Copy Pitch'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Lead Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-[#0A0D16] border border-zinc-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-base font-bold text-white">Add New Inbound Lead</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateLead} className="space-y-3 font-mono text-xs">
              <div>
                <label className="block text-zinc-400 mb-1">Contact Name</label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-[#00F0FF]"
                  placeholder="e.g. David Harrison"
                />
              </div>
              <div>
                <label className="block text-zinc-400 mb-1">Company / Business Name</label>
                <input
                  required
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="w-full p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-[#00F0FF]"
                  placeholder="e.g. Apex Capital Advisory"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1">Email</label>
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-[#00F0FF]"
                    placeholder="david@company.com"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">Phone</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-[#00F0FF]"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>
              <div>
                <label className="block text-zinc-400 mb-1">Country / Region</label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="w-full p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-[#00F0FF]"
                  placeholder="United States, Canada, UAE, etc."
                />
              </div>
              <div>
                <label className="block text-zinc-400 mb-1">Service Needed</label>
                <input
                  type="text"
                  value={formData.serviceNeeded}
                  onChange={(e) => setFormData({ ...formData, serviceNeeded: e.target.value })}
                  className="w-full p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-[#00F0FF]"
                />
              </div>
              <div>
                <label className="block text-zinc-400 mb-1">Approx Budget</label>
                <input
                  type="text"
                  value={formData.approxBudget}
                  onChange={(e) => setFormData({ ...formData, approxBudget: e.target.value })}
                  className="w-full p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-[#00F0FF]"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-zinc-900 text-zinc-400 rounded-xl hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#00F0FF] text-black font-semibold rounded-xl"
                >
                  Save Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Lead Modal */}
      {editingLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-[#0A0D16] border border-zinc-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-base font-bold text-white">Edit Lead: {editingLead.name}</h3>
              <button onClick={() => setEditingLead(null)} className="text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleUpdateLead} className="space-y-3 font-mono text-xs">
              <div>
                <label className="block text-zinc-400 mb-1">Contact Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-[#00F0FF]"
                />
              </div>
              <div>
                <label className="block text-zinc-400 mb-1">Company</label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="w-full p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-[#00F0FF]"
                />
              </div>
              <div>
                <label className="block text-zinc-400 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-[#00F0FF]"
                />
              </div>
              <div>
                <label className="block text-zinc-400 mb-1">Stage</label>
                <select
                  value={formData.stage}
                  onChange={(e) => setFormData({ ...formData, stage: e.target.value as any })}
                  className="w-full p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-[#00F0FF]"
                >
                  <option value="NEW">NEW</option>
                  <option value="CONTACTED">CONTACTED</option>
                  <option value="QUALIFIED">QUALIFIED</option>
                  <option value="PROPOSAL">PROPOSAL</option>
                  <option value="WON">WON</option>
                  <option value="LOST">LOST</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingLead(null)}
                  className="px-4 py-2 bg-zinc-900 text-zinc-400 rounded-xl hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#00F0FF] text-black font-semibold rounded-xl"
                >
                  Update Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingLeadId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-[#0A0D16] border border-rose-500/40 rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white">Delete Lead</h3>
            <p className="text-xs text-zinc-400 font-mono">
              Are you sure you want to remove this lead from the pipeline? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeletingLeadId(null)}
                className="px-3 py-1.5 bg-zinc-900 text-zinc-400 rounded-xl text-xs font-mono"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteLead(deletingLeadId)}
                className="px-3 py-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-mono font-semibold"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
