'use client';

import React, { useEffect, useState } from 'react';
import {
  Image as ImageIcon,
  UploadCloud,
  Copy,
  Check,
  Plus,
  Trash2,
  Edit2,
  ExternalLink,
  FileText,
  RefreshCw,
  X,
  AlertCircle
} from 'lucide-react';
import { apiRequest } from '@/lib/api';

interface MediaAsset {
  id: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  url: string;
  organization: string;
  uploader: string;
  createdAt: string;
}

export default function AdminMediaPage() {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingAsset, setEditingAsset] = useState<MediaAsset | null>(null);

  // Form State
  const [filename, setFilename] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [mimeType, setMimeType] = useState('image/webp');
  const [sizeBytes, setSizeBytes] = useState(250000);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMedia = async () => {
    setLoading(true);
    const res = await apiRequest<MediaAsset[]>('/admin/media');
    if (res.success && res.data) {
      setAssets(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleCopy = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAddMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!filename.trim()) return;

    setSaving(true);
    setError(null);

    const res = await apiRequest('/admin/media', {
      method: 'POST',
      body: JSON.stringify({
        filename: filename.trim(),
        url: fileUrl.trim() || undefined,
        mimeType,
        sizeBytes: Number(sizeBytes) || 102400,
      }),
    });

    setSaving(false);
    if (res.success) {
      setShowAddModal(false);
      setFilename('');
      setFileUrl('');
      fetchMedia();
    } else {
      setError(res.error || 'Failed to register media asset.');
    }
  };

  const handleUpdateMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAsset) return;

    setSaving(true);
    setError(null);

    const res = await apiRequest(`/admin/media/${editingAsset.id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        filename: filename.trim(),
        url: fileUrl.trim() || undefined,
      }),
    });

    setSaving(false);
    if (res.success) {
      setShowEditModal(false);
      setEditingAsset(null);
      fetchMedia();
    } else {
      setError(res.error || 'Failed to update media asset.');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete media asset "${name}"? This cannot be undone.`)) return;

    const res = await apiRequest(`/admin/media/${id}`, {
      method: 'DELETE',
    });

    if (res.success) {
      setAssets((prev) => prev.filter((a) => a.id !== id));
    } else {
      alert(res.error || 'Failed to delete asset.');
    }
  };

  const formatSize = (bytes: number) => {
    if (!bytes || bytes === 0) return '45 KB';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getBadgeType = (filename: string, mime: string) => {
    const ext = filename.split('.').pop()?.toUpperCase() || 'FILE';
    return ext.length <= 4 ? ext : mime.split('/')[1]?.toUpperCase() || 'DATA';
  };

  return (
    <div className="space-y-6 font-sans text-zinc-100">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              CDN & VAULT
            </span>
            <span className="text-[11px] font-mono text-zinc-500">DIGITAL ASSETS & SEO MEDIA</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Media & Asset Manager</h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Store, catalog, and control high-resolution agency media, brand assets, and client deliverables
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchMedia}
            disabled={loading}
            className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
            title="Refresh Vault"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => {
              setFilename('');
              setFileUrl('');
              setMimeType('image/webp');
              setSizeBytes(350000);
              setError(null);
              setShowAddModal(true);
            }}
            className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-semibold transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(0,240,255,0.25)]"
          >
            <Plus className="w-4 h-4" />
            <span>Add Asset</span>
          </button>
        </div>
      </div>

      {/* Grid of Assets */}
      {loading ? (
        <div className="p-12 text-center text-zinc-500 font-mono text-xs">
          Loading digital asset vault...
        </div>
      ) : assets.length === 0 ? (
        <div className="p-12 rounded-2xl border border-dashed border-zinc-800 bg-[#0C0E17] text-center space-y-3">
          <UploadCloud className="w-8 h-8 text-cyan-400 mx-auto" />
          <h3 className="text-sm font-bold text-white">Asset Vault is Ready</h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            Upload or register media assets to serve on public case studies, service workflows, and client vaults.
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-lg bg-cyan-500 text-black text-xs font-semibold"
          >
            Register First Asset
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {assets.map((asset) => {
            const badge = getBadgeType(asset.filename, asset.mimeType);
            const isImage = asset.mimeType.startsWith('image/');

            return (
              <div
                key={asset.id}
                className="p-4 rounded-2xl bg-[#0C0E17] border border-zinc-800/80 hover:border-cyan-500/40 transition-all flex flex-col justify-between space-y-4 shadow-[0_8px_20px_rgba(0,0,0,0.4)] group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                      {badge}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-500">
                      {formatSize(asset.sizeBytes)}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-cyan-400 shrink-0 group-hover:border-cyan-500/30 transition-colors">
                      {isImage ? <ImageIcon className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-zinc-100 truncate" title={asset.filename}>
                        {asset.filename}
                      </p>
                      <p className="text-[10px] text-zinc-500 font-mono truncate">
                        {asset.organization}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-zinc-800/80">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleCopy(asset.url, asset.id)}
                      className="flex-1 py-1.5 px-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-cyan-500/30 text-zinc-300 hover:text-white text-[11px] font-mono flex items-center justify-center gap-1.5 transition-colors"
                    >
                      {copiedId === asset.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Copy CDN URL</span>
                        </>
                      )}
                    </button>

                    <a
                      href={asset.url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-cyan-400 transition-colors"
                      title="Open Asset Link"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    <button
                      onClick={() => {
                        setEditingAsset(asset);
                        setFilename(asset.filename);
                        setFileUrl(asset.url);
                        setError(null);
                        setShowEditModal(true);
                      }}
                      className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
                      title="Edit Metadata"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleDelete(asset.id, asset.filename)}
                      className="p-1.5 rounded-lg bg-zinc-900 hover:bg-rose-950/40 border border-zinc-800 hover:border-rose-500/30 text-zinc-400 hover:text-rose-400 transition-colors"
                      title="Delete Asset"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Media Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0C0E17] border border-cyan-500/30 rounded-2xl p-6 space-y-4 shadow-[0_0_40px_rgba(0,240,255,0.15)] relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                VAULT INGESTION
              </span>
              <h2 className="text-base font-bold text-white mt-1">Register Media Asset</h2>
            </div>

            {error && (
              <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleAddMedia} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-400 mb-1 font-mono uppercase text-[10px]">Filename / Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. cyberstyle_platform_hero.webp"
                  value={filename}
                  onChange={(e) => setFilename(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-mono uppercase text-[10px]">Media Type</label>
                <select
                  value={mimeType}
                  onChange={(e) => setMimeType(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-500 font-mono"
                >
                  <option value="image/webp">WEBP Image (Recommended for SEO & Speed)</option>
                  <option value="image/svg+xml">SVG Vector Graphic</option>
                  <option value="image/png">PNG High-Res Graphic</option>
                  <option value="application/pdf">PDF Document / Whitepaper</option>
                  <option value="video/mp4">MP4 Video / Demo Reel</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-mono uppercase text-[10px]">Direct URL / CDN Path</label>
                <input
                  type="url"
                  placeholder="https://cyberstyle.net/assets/hero.webp"
                  value={fileUrl}
                  onChange={(e) => setFileUrl(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white font-mono text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 rounded-xl bg-cyan-500 text-black font-semibold hover:bg-cyan-400 text-xs shadow-[0_0_15px_rgba(0,240,255,0.3)]"
                >
                  {saving ? 'Registering...' : 'Save Asset'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Media Modal */}
      {showEditModal && editingAsset && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0C0E17] border border-cyan-500/30 rounded-2xl p-6 space-y-4 shadow-[0_0_40px_rgba(0,240,255,0.15)] relative">
            <button
              onClick={() => setShowEditModal(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                METADATA UPDATE
              </span>
              <h2 className="text-base font-bold text-white mt-1">Edit Asset Details</h2>
            </div>

            {error && (
              <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleUpdateMedia} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-400 mb-1 font-mono uppercase text-[10px]">Filename / Title</label>
                <input
                  type="text"
                  required
                  value={filename}
                  onChange={(e) => setFilename(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-mono uppercase text-[10px]">Direct URL / CDN Path</label>
                <input
                  type="text"
                  value={fileUrl}
                  onChange={(e) => setFileUrl(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white font-mono text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 rounded-xl bg-cyan-500 text-black font-semibold hover:bg-cyan-400 text-xs shadow-[0_0_15px_rgba(0,240,255,0.3)]"
                >
                  {saving ? 'Saving...' : 'Update Asset'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
