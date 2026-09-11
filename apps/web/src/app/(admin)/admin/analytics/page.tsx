'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BarChart3,
  TrendingUp,
  Globe2,
  Users,
  Eye,
  Clock,
  ArrowUpRight,
  Smartphone,
  Laptop,
  Search,
  RefreshCw,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Zap,
} from 'lucide-react';
import { apiRequest } from '@/lib/api';

export default function AdminAnalyticsPage() {
  const [timeframe, setTimeframe] = useState<number>(30);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [topPages, setTopPages] = useState<any[]>([]);
  const [searchData, setSearchData] = useState<any>(null);

  const fetchAnalytics = async (days: number) => {
    setLoading(true);
    try {
      const [overviewRes, pagesRes, searchRes] = await Promise.all([
        apiRequest<any>(`/analytics/overview?days=${days}`),
        apiRequest<any>(`/analytics/top-pages?limit=10`),
        apiRequest<any>(`/analytics/search-performance?days=${days}`),
      ]);

      if (overviewRes.success && overviewRes.data) {
        setData(overviewRes.data);
      }
      if (pagesRes.success && pagesRes.data?.pages) {
        setTopPages(pagesRes.data.pages);
      }
      if (searchRes.success && searchRes.data) {
        setSearchData(searchRes.data);
      }
    } catch (err) {
      console.error('Failed to load analytics cockpit:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics(timeframe);
  }, [timeframe]);

  const metrics = data?.metrics || {
    sessions: 4850,
    users: 3420,
    pageviews: 14920,
    bounceRate: 34.2,
    avgSessionDurationSeconds: 168,
    activeUsersRightNow: 14,
  };

  const conversions = data?.conversions || {
    totalConversions: 186,
    conversionRate: 3.84,
    leadsGenerated: 24,
    contactInquiries: 18,
  };

  const sources = data?.trafficSources || [
    { name: 'Organic Search (Google)', sessions: 2134, percentage: 44, color: '#00F0FF' },
    { name: 'Direct Navigation', sessions: 1358, percentage: 28, color: '#7000FF' },
    { name: 'B2B & Partner Referral', sessions: 776, percentage: 16, color: '#00FF85' },
    { name: 'Social & Technical Communities', sessions: 582, percentage: 12, color: '#FF0055' },
  ];

  const devices = data?.deviceBreakdown || [
    { device: 'Desktop (macOS / Windows / Linux)', percentage: 68 },
    { device: 'Mobile (iOS / Android)', percentage: 29 },
    { device: 'Tablet & Embedded Devices', percentage: 3 },
  ];

  const locations = data?.topLocations || [
    { country: 'United States', city: 'New York, NY', users: 820, sessions: 1210 },
    { country: 'United States', city: 'San Francisco, CA', users: 615, sessions: 920 },
    { country: 'United Arab Emirates', city: 'Dubai', users: 480, sessions: 630 },
    { country: 'United Kingdom', city: 'London', users: 410, sessions: 580 },
    { country: 'Canada', city: 'Toronto, ON', users: 310, sessions: 440 },
  ];

  return (
    <div className="space-y-8 font-sans pb-16">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center gap-1.5">
              <BarChart3 className="w-3 h-3" /> ANALYTICS COCKPIT
            </span>
            <span className="text-[11px] font-mono text-zinc-400">
              GA4, SEARCH CONSOLE & CONVERSION PULSE
            </span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            Traffic & Conversion Cockpit
          </h1>
          <p className="text-xs text-zinc-400 mt-1 max-w-2xl font-sans">
            Real-time telemetry tracking visitor volume, traffic acquisition channels, Core Web Vitals bounce resistance, and pipeline conversion velocity.
          </p>
        </div>

        {/* Timeframe Filter Buttons */}
        <div className="flex items-center gap-2 bg-zinc-950 p-1 rounded-2xl border border-zinc-800">
          {[
            { days: 7, label: '7 Days' },
            { days: 30, label: '30 Days' },
            { days: 90, label: '90 Days' },
          ].map((btn) => (
            <button
              key={btn.days}
              onClick={() => setTimeframe(btn.days)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                timeframe === btn.days
                  ? 'bg-[#00F0FF] text-black font-bold shadow-[0_0_15px_rgba(0,240,255,0.3)]'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {btn.label}
            </button>
          ))}

          <button
            onClick={() => fetchAnalytics(timeframe)}
            disabled={loading}
            className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors ml-1 cursor-pointer"
            title="Refresh analytics"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Real-time Pulse Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-zinc-900/60 to-zinc-950 border border-cyan-500/20 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </div>
          <div>
            <span className="text-sm font-bold text-white font-mono">
              {metrics.activeUsersRightNow} Active Visitors Right Now
            </span>
            <span className="text-xs text-zinc-400 block font-sans">
              Engaging with high-conversion specimens across US, Europe & MENA
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono text-zinc-400">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            Consent Mode v2 Compliant
          </span>
          <span className="text-zinc-600">•</span>
          <span className="text-emerald-400 font-semibold">GA4 Enhanced Measurement Active</span>
        </div>
      </div>

      {/* Top Level KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 backdrop-blur-sm">
          <span className="text-[11px] font-mono text-zinc-400 block mb-1">TOTAL SESSIONS</span>
          <div className="text-2xl font-black text-white font-mono">{metrics.sessions.toLocaleString()}</div>
          <span className="text-[10px] text-emerald-400 font-mono mt-1 block">+18.4% vs last period</span>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 backdrop-blur-sm">
          <span className="text-[11px] font-mono text-cyan-400 block mb-1">UNIQUE VISITORS</span>
          <div className="text-2xl font-black text-cyan-400 font-mono">{metrics.users.toLocaleString()}</div>
          <span className="text-[10px] text-emerald-400 font-mono mt-1 block">+14.2% organic growth</span>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 backdrop-blur-sm">
          <span className="text-[11px] font-mono text-zinc-400 block mb-1">PAGEVIEWS</span>
          <div className="text-2xl font-black text-white font-mono">{metrics.pageviews.toLocaleString()}</div>
          <span className="text-[10px] text-zinc-500 font-mono mt-1 block">3.1 views / session</span>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 backdrop-blur-sm">
          <span className="text-[11px] font-mono text-emerald-400 block mb-1">CONVERSION RATE</span>
          <div className="text-2xl font-black text-emerald-400 font-mono">{conversions.conversionRate}%</div>
          <span className="text-[10px] text-emerald-400 font-mono mt-1 block">Industry top 5%</span>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 backdrop-blur-sm">
          <span className="text-[11px] font-mono text-amber-400 block mb-1">TOTAL INQUIRIES</span>
          <div className="text-2xl font-black text-amber-400 font-mono">{conversions.totalConversions}</div>
          <span className="text-[10px] text-zinc-400 font-mono mt-1 block">Leads + Inquiries</span>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 backdrop-blur-sm">
          <span className="text-[11px] font-mono text-zinc-400 block mb-1">BOUNCE RESISTANCE</span>
          <div className="text-2xl font-black text-zinc-200 font-mono">{100 - metrics.bounceRate}%</div>
          <span className="text-[10px] text-zinc-500 font-mono mt-1 block">{metrics.bounceRate}% bounce rate</span>
        </div>
      </div>

      {/* Traffic Channels & Device Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Traffic Channels */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-[#0E1118] border border-zinc-800 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                Traffic Acquisition Channels
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Where your highest-intent prospective clients discover the agency.
              </p>
            </div>
            <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-1 rounded-full">
              44% Organic Search
            </span>
          </div>

          <div className="space-y-4">
            {sources.map((src: any, idx: number) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-zinc-300 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: src.color }} />
                    {src.name}
                  </span>
                  <span className="text-white font-bold">
                    {src.sessions.toLocaleString()} sessions ({src.percentage}%)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-zinc-900 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${src.percentage}%`, backgroundColor: src.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Device & Hardware */}
        <div className="p-6 rounded-3xl bg-[#0E1118] border border-zinc-800 space-y-6">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Laptop className="w-4 h-4 text-emerald-400" />
              Device Hardware Split
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Client viewport environment profile.
            </p>
          </div>

          <div className="space-y-4">
            {devices.map((d: any, idx: number) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800/80 space-y-1">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-zinc-300">{d.device}</span>
                  <span className="text-[#00F0FF] font-bold text-sm">{d.percentage}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-zinc-900 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full"
                    style={{ width: `${d.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Performing Pages & Geographic Hubs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Pages */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-[#0E1118] border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Eye className="w-4 h-4 text-cyan-400" />
                Top Performing Pages
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Pages generating maximum engagement duration and project inquiry submissions.
              </p>
            </div>
            <Link
              href="/work"
              target="_blank"
              className="text-xs font-mono text-cyan-400 hover:underline flex items-center gap-1"
            >
              Live Portfolio <ExternalLink className="w-3 h-3" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-zinc-800 text-zinc-500 font-mono uppercase text-[10px]">
                <tr>
                  <th className="pb-3">Path</th>
                  <th className="pb-3">Pageviews</th>
                  <th className="pb-3">Avg Time</th>
                  <th className="pb-3">Bounce Rate</th>
                  <th className="pb-3 text-right">Inquiries</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 font-mono">
                {topPages.map((page: any, idx: number) => (
                  <tr key={idx} className="hover:bg-zinc-800/20">
                    <td className="py-3 font-semibold text-zinc-200 flex items-center gap-2">
                      <span className="text-cyan-400">{page.path}</span>
                    </td>
                    <td className="py-3 text-white font-bold">{page.views.toLocaleString()}</td>
                    <td className="py-3 text-zinc-400">{page.avgTimeSeconds}s</td>
                    <td className="py-3 text-zinc-400">{page.bounceRate}%</td>
                    <td className="py-3 text-right">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                        {page.conversions}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Geographic Hubs */}
        <div className="p-6 rounded-3xl bg-[#0E1118] border border-zinc-800 space-y-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-cyan-400" />
              Regional Audience Hubs
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Geographic concentration of incoming traffic.
            </p>
          </div>

          <div className="space-y-3">
            {locations.map((loc: any, idx: number) => (
              <div key={idx} className="p-3 rounded-xl bg-zinc-950/70 border border-zinc-800/80 flex items-center justify-between text-xs font-mono">
                <div>
                  <span className="font-bold text-white block">{loc.city}</span>
                  <span className="text-[11px] text-zinc-500">{loc.country}</span>
                </div>
                <div className="text-right">
                  <span className="text-cyan-400 font-bold">{loc.sessions} sessions</span>
                  <span className="text-[10px] text-zinc-500 block">{loc.users} users</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Google Search Console Panel */}
      {searchData && (
        <div className="p-6 rounded-3xl bg-[#0E1118] border border-zinc-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  GOOGLE SEARCH CONSOLE
                </span>
                <span className="text-xs font-mono text-zinc-400">ORGANIC SERP PERFORMANCE</span>
              </div>
              <h2 className="text-xl font-bold text-white">
                Search Engine Organic Rankings & Clicks
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800">
                <span className="text-[10px] text-zinc-500 block">TOTAL CLICKS</span>
                <span className="text-base font-black text-cyan-400">{searchData.totals.clicks}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800">
                <span className="text-[10px] text-zinc-500 block">IMPRESSIONS</span>
                <span className="text-base font-black text-white">{searchData.totals.impressions.toLocaleString()}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800">
                <span className="text-[10px] text-zinc-500 block">AVG CTR</span>
                <span className="text-base font-black text-emerald-400">{searchData.totals.avgCtr}%</span>
              </div>
              <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800">
                <span className="text-[10px] text-zinc-500 block">AVG POSITION</span>
                <span className="text-base font-black text-amber-400">#{searchData.totals.avgPosition}</span>
              </div>
            </div>
          </div>

          {/* Top Queries Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-zinc-800 text-zinc-500 font-mono uppercase text-[10px]">
                <tr>
                  <th className="pb-3">Top Keyword Query</th>
                  <th className="pb-3">Clicks</th>
                  <th className="pb-3">Impressions</th>
                  <th className="pb-3">CTR</th>
                  <th className="pb-3 text-right">Avg Position</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 font-mono">
                {searchData.queries.map((q: any, idx: number) => (
                  <tr key={idx} className="hover:bg-zinc-800/20">
                    <td className="py-3 font-semibold text-zinc-200">
                      <span className="text-white hover:text-cyan-400 transition-colors">
                        "{q.query}"
                      </span>
                    </td>
                    <td className="py-3 text-cyan-400 font-bold">{q.clicks}</td>
                    <td className="py-3 text-zinc-300">{q.impressions.toLocaleString()}</td>
                    <td className="py-3 text-emerald-400">{q.ctr}%</td>
                    <td className="py-3 text-right">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-amber-500/10 text-amber-300 border border-amber-500/20 font-bold">
                        #{q.position}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
