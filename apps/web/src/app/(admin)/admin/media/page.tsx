'use client';

import React from 'react';
import { Image as ImageIcon, UploadCloud, Copy, FileText, Check } from 'lucide-react';

export default function AdminMediaPage() {
  const [copiedIdx, setCopiedIdx] = React.useState<number | null>(null);

  const handleCopy = (url: string, idx: number) => {
    navigator.clipboard.writeText(url);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              STORAGE
            </span>
            <span className="text-[11px] font-mono text-zinc-500">DIGITAL ASSET VAULT</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Media & File Assets</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { name: 'cyberstyle_logo_master.svg', size: '48 KB', type: 'SVG', url: 'https://cyberstyle.net/assets/logo.svg' },
          { name: 'fintech_case_hero.webp', size: '380 KB', type: 'WEBP', url: 'https://cyberstyle.net/assets/fintech_case_hero.webp' },
          { name: 'cyberstyle_brand_guidelines.pdf', size: '4.2 MB', type: 'PDF', url: 'https://cyberstyle.net/assets/guidelines.pdf' },
          { name: 'architecture_diagram.png', size: '1.2 MB', type: 'PNG', url: 'https://cyberstyle.net/assets/architecture.png' },
        ].map((media, idx) => (
          <div key={idx} className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 flex flex-col justify-between space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-zinc-800 flex items-center justify-center text-cyan-400 font-mono text-xs">
                {media.type}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-zinc-200 truncate">{media.name}</p>
                <p className="text-[10px] text-zinc-500 font-mono">{media.size}</p>
              </div>
            </div>
            <button
              onClick={() => handleCopy(media.url, idx)}
              className="w-full py-1.5 px-2.5 rounded-lg bg-zinc-950 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white text-[11px] font-mono flex items-center justify-center gap-1.5 transition-colors"
            >
              {copiedIdx === idx ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedIdx === idx ? 'URL Copied' : 'Copy CDN URL'}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
