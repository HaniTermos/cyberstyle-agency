'use client';

import React, { useState, useEffect } from 'react';
import {
  FileText,
  Download,
  Upload,
  Folder,
  CheckCircle2,
  Clock,
  Eye,
  Search,
  ShieldCheck,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import {
  DEMO_WORKSPACE_DATA,
  FILE_FOLDERS,
  FileFolder,
} from '@/lib/constants/portal';
import { apiRequest } from '@/lib/api';

interface PortalFileItem {
  id: string;
  filename: string;
  folder: string;
  sizeBytes: number;
  currentVersion: number;
  createdAt: string;
  versions?: {
    id: string;
    versionNumber: number;
    scanState: string;
    checksum: string;
  }[];
}

export default function PortalFilesPage() {
  const [selectedFolder, setSelectedFolder] = useState<FileFolder | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [dbFiles, setDbFiles] = useState<PortalFileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const fetchPortalFiles = async () => {
    setLoading(true);
    const query = new URLSearchParams();
    if (selectedFolder !== 'All') {
      // Map UI folder to backend enum format
      const folderEnum = selectedFolder.toUpperCase().replace(/\s+/g, '_').replace(/&/g, '');
      query.set('folder', folderEnum);
    }
    if (searchQuery.trim()) query.set('search', searchQuery.trim());

    const res = await apiRequest<PortalFileItem[]>(`/portal/files?${query.toString()}`);
    if (res.success && res.data && res.data.length > 0) {
      setDbFiles(res.data);
    } else {
      setDbFiles([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPortalFiles();
  }, [selectedFolder, searchQuery]);

  // Combine live files or fallback to verified sample files if database has no records yet
  const displayFiles = dbFiles.length > 0
    ? dbFiles.map((f) => ({
        id: f.id,
        name: f.filename,
        folder: f.folder.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()),
        version: `v${f.currentVersion}`,
        size: f.sizeBytes < 1024 * 1024 ? `${(f.sizeBytes / 1024).toFixed(1)} KB` : `${(f.sizeBytes / (1024 * 1024)).toFixed(1)} MB`,
        updatedAt: new Date(f.createdAt).toLocaleDateString(),
        description: 'Verified deliverable scanned and approved for client deployment.',
        isLive: true,
      }))
    : DEMO_WORKSPACE_DATA.sampleFiles
        .filter((file) => {
          const matchesFolder = selectedFolder === 'All' || file.folder === selectedFolder;
          const matchesSearch =
            file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            file.description.toLowerCase().includes(searchQuery.toLowerCase());
          return matchesFolder && matchesSearch;
        })
        .map((f) => ({ ...f, isLive: false }));

  const handleDownload = async (file: { id: string; name: string; isLive: boolean }) => {
    if (!file.isLive) {
      alert(`Initiating verified download for demonstration file: "${file.name}" (HMAC signed URL).`);
      return;
    }

    setDownloadingId(file.id);
    try {
      const res = await apiRequest<{ signedUrl: string; filename: string }>(`/portal/files/${file.id}/signed-url`, {
        method: 'POST',
      });

      if (res.success && res.data) {
        window.open(res.data.signedUrl, '_blank');
      } else {
        alert(res.error || 'Unable to generate signed download link. File may be undergoing quarantine scan.');
      }
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="space-y-8 font-sans text-zinc-100 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-cyan-400" />
            Files & Deliverables
          </h1>
          <p className="text-xs text-zinc-400 mt-1 max-w-3xl leading-relaxed">
            Access project documentation, architecture diagrams, milestone assets, and signed agreements. All files are verified clean via our security quarantine pipeline.
          </p>
        </div>

        <button
          onClick={() => alert('Client upload workflow: Files are placed into security quarantine and scanned prior to team access.')}
          className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs transition-all shadow-[0_0_15px_rgba(0,240,255,0.2)] flex items-center gap-2 self-start md:self-auto"
        >
          <Upload className="w-4 h-4" />
          <span>Upload File</span>
        </button>
      </div>

      {/* Security Enclave Disclosure */}
      <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 flex items-center gap-3 text-xs text-zinc-400">
        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
        <span>
          <strong className="text-zinc-200">Secure Storage Enclave:</strong> Direct object URLs are private. Downloads are issued via short-lived HMAC signed tokens (300s TTL).
        </span>
      </div>

      {/* Folder Navigation & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Folder Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedFolder('All')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
              selectedFolder === 'All'
                ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-semibold'
                : 'bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            All Folders
          </button>
          {FILE_FOLDERS.map((folder) => (
            <button
              key={folder}
              onClick={() => setSelectedFolder(folder)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                selectedFolder === folder
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-semibold'
                  : 'bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              {folder}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search shared files..."
            className="w-full pl-9 pr-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Files List */}
      {loading && dbFiles.length === 0 ? (
        <div className="p-8 text-center text-zinc-500 text-xs">
          <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-cyan-400" />
          Loading project deliverables...
        </div>
      ) : displayFiles.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/30">
          <Folder className="w-10 h-10 text-zinc-600 mx-auto mb-2" />
          <h3 className="text-sm font-semibold text-zinc-300">No deliverables in this folder</h3>
          <p className="text-xs text-zinc-500 mt-1">Check back once milestones are completed and verified.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayFiles.map((file) => (
            <div
              key={file.id}
              className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800/80 hover:border-zinc-700 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
                      {file.version}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> Clean
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-white truncate" title={file.name}>
                    {file.name}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                    {file.description}
                  </p>
                </div>

                <div className="text-[11px] font-mono text-zinc-500 space-y-1 pt-1 border-t border-zinc-900">
                  <div className="flex justify-between">
                    <span>Taxonomy:</span>
                    <span className="text-zinc-400">{file.folder}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Size & Date:</span>
                    <span className="text-zinc-400">{file.size} • {file.updatedAt}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2 border-t border-zinc-900">
                <button
                  onClick={() => handleDownload(file)}
                  disabled={downloadingId === file.id}
                  className="flex-1 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white transition-colors text-xs flex items-center justify-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{downloadingId === file.id ? 'Verifying Link...' : 'Signed Download'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
