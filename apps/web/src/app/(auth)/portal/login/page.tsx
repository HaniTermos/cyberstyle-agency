'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Building2,
  Lock,
  Mail,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  Eye,
  EyeOff,
  Sparkles,
} from 'lucide-react';
import Silk from '@/components/backgrounds/Silk';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { apiRequest } from '@/lib/api';

export default function PortalLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [twoFactorStep, setTwoFactorStep] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [tempToken, setTempToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (twoFactorStep) {
        // Submit 2FA code to backend
        const verifyRes = await apiRequest<{ token: string; user: any }>('/auth/2fa/verify', {
          method: 'POST',
          body: JSON.stringify({ tempToken, code: twoFactorCode }),
        });

        if (verifyRes.success && verifyRes.data?.token) {
          setSuccess(true);
          const { token, user } = verifyRes.data;
          if (typeof window !== 'undefined') {
            localStorage.setItem('cyberstyle_portal_token', token);
            document.cookie = `cyberstyle_session=${token}; path=/; max-age=604800; SameSite=Lax`;
            sessionStorage.setItem(
              'cyberstyle_portal_session',
              JSON.stringify({
                user: user || { email, role: 'CLIENT' },
                token,
                authenticatedAt: new Date().toISOString(),
              })
            );
          }
          setTimeout(() => {
            router.push('/portal/dashboard');
          }, 600);
          return;
        } else {
          setError(verifyRes.error || 'Invalid 2FA security code.');
          setLoading(false);
          return;
        }
      }

      // 1. Authenticate with backend API
      const res = await apiRequest<{ token?: string; user?: any; requires2FA?: boolean; tempToken?: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      if (res.success && res.data) {
        if (res.data.requires2FA && res.data.tempToken) {
          setTempToken(res.data.tempToken);
          setTwoFactorStep(true);
          setLoading(false);
          return;
        }

        const token = res.data.token;
        const user = res.data.user;

        if (token) {
          setSuccess(true);
          if (typeof window !== 'undefined') {
            localStorage.setItem('cyberstyle_portal_token', token);
            document.cookie = `cyberstyle_session=${token}; path=/; max-age=604800; SameSite=Lax`;
            sessionStorage.setItem(
              'cyberstyle_portal_session',
              JSON.stringify({
                user: user || { email, role: 'CLIENT' },
                token,
                authenticatedAt: new Date().toISOString(),
              })
            );
          }

          setTimeout(() => {
            router.push('/portal/dashboard');
          }, 600);
          return;
        }
      }

      // If backend returned an error message
      setError(res.error || 'Invalid client credentials. Please verify your email and password.');
    } catch (err: any) {
      setError(err.message || 'Login communication failure with CYBERSTYLE Core API.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 bg-[#040609] overflow-hidden font-sans">
      <Silk />

      <div className="relative z-10 w-full max-w-md">
        <Card className="p-8 backdrop-blur-xl bg-[#07090E]/90 border-zinc-800 shadow-[0_0_50px_rgba(0,0,0,0.8)] rounded-2xl">
          {/* Header */}
          <div className="text-center space-y-2 mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              CLIENT WORKSPACE ACCESS
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white font-mono">
              CYBERSTYLE<span className="text-emerald-400">_PORTAL</span>
            </h1>
            <p className="text-xs text-zinc-400">
              Sign in to view active sprints, sign-offs, and staging builds
            </p>
          </div>

          {/* Quick Verified Client Credentials Banner */}
          <div className="mb-6 p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-xs font-mono text-zinc-400 space-y-1">
            <div className="text-emerald-400 font-semibold flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5" /> Database Client Account:
            </div>
            <div className="text-zinc-300">Email: client@apexcapital.com</div>
            <div className="text-zinc-300">Password: Client123456!</div>
          </div>

          {error && (
            <div className="mb-6 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-6 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Authentication verified. Redirecting to workspace...</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {!twoFactorStep ? (
              <>
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-zinc-400 uppercase">Work Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="client@acme.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-zinc-900/60 border border-zinc-800 rounded-xl text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-400 transition-colors font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-zinc-400 uppercase">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-10 py-2.5 bg-zinc-900/60 border border-zinc-800 rounded-xl text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-400 transition-colors font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-3">
                <div className="text-center py-2">
                  <KeyRound className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                  <h3 className="text-sm font-bold text-white">Enter 2FA Security Token</h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    Enter the 6-digit code from your authenticator app (Demo: any 6 digits)
                  </p>
                </div>

                <input
                  type="text"
                  maxLength={6}
                  autoFocus
                  required
                  value={twoFactorCode}
                  onChange={(e) => setTwoFactorCode(e.target.value)}
                  placeholder="000000"
                  className="w-full text-center tracking-[0.5em] py-3 bg-zinc-900/80 border border-zinc-800 rounded-xl text-lg text-emerald-400 font-mono focus:outline-none focus:border-emerald-400"
                />
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs py-2.5 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>{twoFactorStep ? 'Verify Security Token' : 'Proceed to Security Check'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-zinc-800/80 text-center space-y-2">
            <Link href="/admin/login" className="text-xs font-mono text-zinc-500 hover:text-zinc-300 block">
              Switch to Admin Console →
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
