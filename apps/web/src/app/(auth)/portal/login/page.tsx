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
  HelpCircle,
  X
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

  // Forgot / Reset Password state
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetStep, setResetStep] = useState<'REQUEST' | 'SUBMIT'>('REQUEST');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetMessage, setResetMessage] = useState<string | null>(null);
  const [resetError, setResetError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (twoFactorStep) {
        // Submit 2FA code to backend
        const verifyRes = await apiRequest<{ token: string; user: any }>('/auth/2fa/verify', {
          method: 'POST',
          body: JSON.stringify({ email, tempToken, code: twoFactorCode }),
        });

        if (verifyRes.success && verifyRes.data?.token) {
          setSuccess(true);
          const { token, user } = verifyRes.data;
          if (typeof window !== 'undefined') {
            localStorage.setItem('cyberstyle_portal_token', token);
            document.cookie = `cyberstyle_portal_token=${token}; path=/; max-age=604800; SameSite=Lax`;
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
          }, 500);
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
            document.cookie = `cyberstyle_portal_token=${token}; path=/; max-age=604800; SameSite=Lax`;
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
          }, 500);
        } else {
          setError('Authentication token missing from response.');
        }
      } else {
        setError(res.error || 'Invalid credentials. Please verify your email and password.');
      }
    } catch {
      setError('An unexpected error occurred. Check connectivity and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim()) return;
    setResetLoading(true);
    setResetError(null);
    setResetMessage(null);

    const res = await apiRequest('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email: resetEmail }),
    });

    setResetLoading(false);
    if (res.success) {
      setResetMessage('Verification code dispatched to your work email. Please enter it below.');
      setResetStep('SUBMIT');
    } else {
      setResetError(res.error || 'Failed to dispatch password reset code.');
    }
  };

  const handleSubmitReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetCode.trim() || !newPassword.trim()) return;
    setResetLoading(true);
    setResetError(null);
    setResetMessage(null);

    const res = await apiRequest('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({
        email: resetEmail,
        code: resetCode,
        newPassword,
      }),
    });

    setResetLoading(false);
    if (res.success) {
      setResetMessage('Password updated successfully! You may now log in.');
      setTimeout(() => {
        setShowResetModal(false);
        setPassword('');
        setResetStep('REQUEST');
      }, 1500);
    } else {
      setResetError(res.error || 'Invalid verification code or requirements not met.');
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 bg-[#080A10] text-zinc-100 overflow-hidden font-sans">
      {/* Dynamic Background */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <Silk speed={3} sparkCount={15} />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <Card className="p-8 border-zinc-800/80 bg-[#0C0E17]/90 backdrop-blur-xl rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.8),0_0_25px_rgba(0,240,255,0.08)]">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mb-4 shadow-[0_0_20px_rgba(0,240,255,0.2)]">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="text-[11px] font-mono tracking-widest uppercase px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                CLIENT ENCLAVE
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">CYBERSTYLE Portal</h1>
            <p className="text-xs text-zinc-400 mt-1">
              Secure client workspace for builds, invoices, and direct comms
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-6 p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Authentication verified. Launching workspace...</span>
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
                      placeholder="client@company.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-zinc-900/60 border border-zinc-800 rounded-xl text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-cyan-400 transition-colors font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-mono text-zinc-400 uppercase">Password</label>
                    <button
                      type="button"
                      onClick={() => {
                        setResetEmail(email);
                        setShowResetModal(true);
                      }}
                      className="text-[11px] font-mono text-cyan-400/90 hover:text-cyan-300 transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-10 py-2.5 bg-zinc-900/60 border border-zinc-800 rounded-xl text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-cyan-400 transition-colors font-mono"
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
                  <KeyRound className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                  <h3 className="text-sm font-bold text-white">Enter 2FA Security Token</h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    Enter the 6-digit code from your authenticator app
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
                  className="w-full text-center tracking-[0.5em] py-3 bg-zinc-900/80 border border-zinc-800 rounded-xl text-lg text-cyan-400 font-mono focus:outline-none focus:border-cyan-400"
                />
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs py-2.5 rounded-xl shadow-[0_0_20px_rgba(0,240,255,0.3)] transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>{twoFactorStep ? 'Verify Security Token' : 'Proceed to Client Enclave'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 pt-5 border-t border-zinc-800/80 text-center">
            <p className="text-[11px] font-mono text-zinc-500">
              Need access? Inquire with your CYBERSTYLE Account Lead or email{' '}
              <a href="mailto:contact@cyberstyle.net" className="text-cyan-400 hover:underline">
                contact@cyberstyle.net
              </a>
            </p>
          </div>
        </Card>
      </div>

      {/* Password Reset Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md p-6 rounded-2xl bg-[#0C0E17] border border-cyan-500/30 shadow-[0_0_40px_rgba(0,240,255,0.15)] relative">
            <button
              onClick={() => setShowResetModal(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-4">
              <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                SECURITY RECOVERY
              </span>
              <h3 className="text-lg font-bold text-white mt-1">Reset Portal Password</h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                {resetStep === 'REQUEST'
                  ? 'Enter your work email to receive a 6-digit verification code.'
                  : 'Enter the code dispatched to your inbox along with your new password.'}
              </p>
            </div>

            {resetError && (
              <div className="mb-4 p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{resetError}</span>
              </div>
            )}

            {resetMessage && (
              <div className="mb-4 p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{resetMessage}</span>
              </div>
            )}

            {resetStep === 'REQUEST' ? (
              <form onSubmit={handleRequestReset} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-zinc-400">WORK EMAIL</label>
                  <input
                    type="email"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="client@company.com"
                    className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={resetLoading}
                  className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs py-2 rounded-xl"
                >
                  {resetLoading ? 'Dispatching...' : 'Send Verification Code'}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleSubmitReset} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-zinc-400">6-DIGIT CODE</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={resetCode}
                    onChange={(e) => setResetCode(e.target.value)}
                    placeholder="123456"
                    className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-center tracking-[0.4em] text-cyan-400 font-mono focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-mono text-zinc-400">NEW PASSWORD (MIN 8 CHARS)</label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setResetStep('REQUEST')}
                    className="flex-1 px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 text-xs font-mono"
                  >
                    Back
                  </button>
                  <Button
                    type="submit"
                    disabled={resetLoading}
                    className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs py-2 rounded-xl"
                  >
                    {resetLoading ? 'Updating...' : 'Set New Password'}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
