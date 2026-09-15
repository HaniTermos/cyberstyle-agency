'use client';

import React, { useEffect, useState, useRef } from 'react';
import {
  FileText,
  UploadCloud,
  Check,
  Copy,
  Plus,
  Trash2,
  Download,
  Folder,
  ShieldCheck,
  ShieldAlert,
  Clock,
  RefreshCw,
  X,
  AlertCircle,
  FileCode,
  FileArchive,
  Image as ImageIcon,
} from 'lucide-react';
import { apiRequest } from '@/lib/api';

interface FileVersion {
  id: string;
  versionNumber: number;
  checksum: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  scanState: 'PENDING_SCAN' | 'CLEAN' | 'FLAGGED' | 'REJECTED';
  createdAt: string;
}

interface FileAsset {
  id: string;
  filename: string;
  folder: string;
  visibility: 'CLIENT_VISIBLE' | 'INTERNAL_ONLY';
  isQuarantined: boolean;
  currentVersion: number;
  mimeType: string;
  sizeBytes: number;
  createdAt: string;
  organization?: { id: string; name: string };
  project?: { id: string; name: string };
  uploader?: { id: string; name: string; email: string };
  versions?: FileVersion[];
}

const FOLDERS = [
  { id: 'ALL', label: 'All Folders' },
  { id: 'PROJECT_PLAN', label: 'Project Plan' },
  { id: 'DESIGN_REVIEW', label: 'Design Review' },
  { id: 'CONTENT_BRAND', label: 'Content & Brand' },
  { id: 'PREVIEWS', label: 'Previews' },
  { id: 'INVOICES_AGREEMENTS', label: 'Invoices & Agreements' },
  { id: 'LAUNCH_HANDOVER', label: 'Launch & Handover' },
  { id: 'ARCHIVE', label: 'Archive' },
];

export default function AdminMediaPage() {
  const [assets, setAssets] = useState<FileAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFolder, setSelectedFolder] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Upload modal state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadFolder, setUploadFolder] = useState('PROJECT_PLAN');
  const [uploadVisibility, setUploadVisibility] = useState<'CLIENT_VISIBLE' | 'INTERNAL_ONLY'>('CLIENT_VISIBLE');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Signed URL download state
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCopyUrl = (asset: FileAsset) => {
    const path = asset.filename.match(/\.(jpg|jpeg|png|webp|svg|gif)$/i)
      ? `/images/${asset.filename}`
      : (asset as any).url || `/uploads/clean/${(asset as any).storageKey || asset.filename}`;
    navigator.clipboard.writeText(path);
    setCopiedId(asset.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const fetchMedia = async () => {
    setLoading(true);
    const query = new URLSearchParams();
    if (selectedFolder !== 'ALL') query.set('folder', selectedFolder);
    if (searchQuery.trim()) query.set('search', searchQuery.trim());

    const res = await apiRequest<FileAsset[]>(`/admin/media?${query.toString()}`);
    if (res.success && res.data) {
      setAssets(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMedia();
  }, [selectedFolder, searchQuery]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const ext = '.' + file.name.split('.').pop()?.toLowerCase();
      const blocked = ['.exe', '.bat', '.cmd', '.sh', '.ps1', '.vbs', '.js', '.msi', '.dll'];
      
      if (blocked.includes(ext)) {
        setUploadError(`Executable/script files (${ext}) are prohibited by file security policy.`);
        setUploadFile(null);
        return;
      }

      setUploadFile(file);
      setUploadError(null);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) return;

    setUploading(true);
    setUploadError(null);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(uploadFile);
      reader.onload = async () => {
        const base64Data = reader.result as string;

        const res = await apiRequest('/admin/media/upload', {
          method: 'POST',
          body: JSON.stringify({
            filename: uploadFile.name,
            base64Data,
            folder: uploadFolder,
            visibility: uploadVisibility,
          }),
        });

        setUploading(false);

        if (res.success) {
          setShowUploadModal(false);
          setUploadFile(null);
          fetchMedia();
        } else {
          setUploadError(res.error || 'Upload failed during security validation.');
        }
      };
      reader.onerror = () => {
        setUploading(false);
        setUploadError('Failed to read file buffer.');
      };
    } catch (err: any) {
      setUploading(false);
      setUploadError(err.message || 'Upload error');
    }
  };

  const handleDownloadSigned = async (assetId: string) => {
    setDownloadingId(assetId);
    try {
      const res = await apiRequest<{ signedUrl: string; filename: string }>(`/admin/media/${assetId}/signed-url`, {
        method: 'POST',
      });

      if (res.success && res.data) {
        window.open(res.data.signedUrl, '_blank');
      } else {
        alert(res.error || 'Failed to generate expiring signed download link.');
      }
    } finally {
      setDownloadingId(null);
    }
  };

  const handleDelete = async (assetId: string) => {
    if (!confirm('Are you sure you want to delete this file asset? This action will be recorded in the audit log.')) return;

    const res = await apiRequest(`/admin/media/${assetId}`, {
      method: 'DELETE',
    });

    if (res.success) {
      fetchMedia();
    } else {
      alert(res.error || 'Failed to delete file.');
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getScanBadge = (state?: string) => {
    switch (state) {
      case 'CLEAN':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <ShieldCheck className="w-3.5 h-3.5" /> Clean
          </span>
        );
      case 'REJECTED':
      case 'FLAGGED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20">
            <ShieldAlert className="w-3.5 h-3.5" /> Blocked
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Clock className="w-3.5 h-3.5" /> Scanning...
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 font-sans text-zinc-100 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <FileText className="w-6 h-6 text-cyan-400" />
            Media & File Storage Enclave
          </h1>
          <p className="text-xs text-zinc-400 mt-1 max-w-3xl leading-relaxed">
            Private-by-default versioned asset repository. All uploads undergo quarantine inspection, magic byte verification, heuristic virus scanning, and expiring HMAC signed delivery.
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs transition-all shadow-[0_0_15px_rgba(0,240,255,0.2)] flex items-center gap-2 self-start md:self-auto"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Upload File (Quarantined)</span>
        </button>
      </div>

      {/* Security Architecture Disclosure */}
      <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <div className="text-xs text-zinc-400 space-y-1">
          <p className="text-zinc-200 font-semibold">Zero Direct Object Storage Exposure</p>
          <p>
            Files cannot be accessed via predictable public URLs. Downloads require single-use expiring signed tokens (300s TTL). Unscanned or flagged files are strictly barred from client view.
          </p>
        </div>
      </div>

      {/* Folder Navigation & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {FOLDERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setSelectedFolder(f.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedFolder === f.id
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                  : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-zinc-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search by filename..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-cyan-500 w-64"
          />
          <button
            onClick={() => fetchMedia()}
            className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Files Grid / Table */}
      {loading ? (
        <div className="p-12 text-center text-zinc-500 text-sm">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-cyan-400" />
          Loading secure media repository...
        </div>
      ) : assets.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/30">
          <Folder className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-zinc-300">No file assets found</h3>
          <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
            Upload project documentation, brand materials, or deliverables to the quarantined repository.
          </p>
        </div>
      ) : (
        <div className="border border-zinc-800 rounded-2xl overflow-hidden bg-zinc-950">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-900/70 text-zinc-400 border-b border-zinc-800 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3.5 px-4">Filename & Version</th>
                <th className="py-3.5 px-4">Taxonomy</th>
                <th className="py-3.5 px-4">Security Status</th>
                <th className="py-3.5 px-4">Size</th>
                <th className="py-3.5 px-4">SHA-256 Checksum</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {assets.map((asset) => {
                const latestVersion = asset.versions?.[0];
                return (
                  <tr key={asset.id} className="hover:bg-zinc-900/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
                          {asset.mimeType.startsWith('image/') ? (
                            <ImageIcon className="w-4 h-4 text-cyan-400" />
                          ) : asset.mimeType.includes('zip') ? (
                            <FileArchive className="w-4 h-4 text-amber-400" />
                          ) : (
                            <FileCode className="w-4 h-4 text-zinc-400" />
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-zinc-200 flex items-center gap-2">
                            <span>{asset.filename}</span>
                            <span className="px-1.5 py-0.2 rounded text-[10px] bg-zinc-800 text-zinc-400 font-mono">
                              v{asset.currentVersion}
                            </span>
                          </div>
                          <div className="text-[11px] text-zinc-500">
                            Uploaded by {asset.uploader?.name || asset.uploader?.email || 'System'} • {new Date(asset.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[11px] bg-zinc-900 border border-zinc-800 text-zinc-300 font-mono">
                        {asset.folder}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      {getScanBadge(latestVersion?.scanState)}
                    </td>

                    <td className="py-3 px-4 text-zinc-400 font-mono">
                      {formatBytes(asset.sizeBytes)}
                    </td>

                    <td className="py-3 px-4 text-zinc-500 font-mono text-[11px]">
                      {latestVersion?.checksum ? `${latestVersion.checksum.slice(0, 16)}...` : 'N/A'}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleCopyUrl(asset)}
                          className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 text-xs flex items-center gap-1.5 font-medium transition-colors"
                          title="Copy file path to clipboard to link to case studies or web pages"
                        >
                          {copiedId === asset.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-zinc-400" />
                              <span>Copy Path</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => handleDownloadSigned(asset.id)}
                          disabled={downloadingId === asset.id}
                          className="px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs flex items-center gap-1.5 font-medium transition-colors"
                          title="Generate single-use expiring download link"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Signed Link</span>
                        </button>

                        <button
                          onClick={() => handleDelete(asset.id)}
                          className="p-1.5 rounded-lg bg-zinc-900 hover:bg-red-500/10 text-zinc-400 hover:text-red-400 border border-zinc-800 transition-colors"
                          title="Delete File"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-cyan-400" />
                Upload File to Security Quarantine
              </h3>
              <button
                onClick={() => { setShowUploadModal(false); setUploadFile(null); setUploadError(null); }}
                className="text-zinc-500 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs">
              {uploadError && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{uploadError}</span>
                </div>
              )}

              {/* File Dropzone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-zinc-800 hover:border-cyan-500/50 rounded-xl p-6 text-center cursor-pointer transition-colors bg-zinc-900/30"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <UploadCloud className="w-8 h-8 text-zinc-500 mx-auto mb-2" />
                {uploadFile ? (
                  <div>
                    <p className="font-semibold text-cyan-400">{uploadFile.name}</p>
                    <p className="text-zinc-500 text-[11px] mt-0.5">{formatBytes(uploadFile.size)}</p>
                  </div>
                ) : (
                  <div>
                    <p className="font-medium text-zinc-300">Click to choose a file for quarantine upload</p>
                    <p className="text-zinc-500 text-[11px] mt-1">PNG, JPG, WebP, PDF, ZIP, SVG up to 50 MB (Executables rejected)</p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-400 mb-1">Folder Taxonomy</label>
                  <select
                    value={uploadFolder}
                    onChange={(e) => setUploadFolder(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200 focus:outline-none focus:border-cyan-500"
                  >
                    {FOLDERS.filter(f => f.id !== 'ALL').map((f) => (
                      <option key={f.id} value={f.id}>{f.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1">Visibility Scope</label>
                  <select
                    value={uploadVisibility}
                    onChange={(e) => setUploadVisibility(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="CLIENT_VISIBLE">Client Visible (Post-Scan)</option>
                    <option value="INTERNAL_ONLY">Internal Staff Only</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!uploadFile || uploading}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold disabled:opacity-50 flex items-center gap-2"
                >
                  {uploading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Quarantining...</span>
                    </>
                  ) : (
                    <span>Submit to Quarantine</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
