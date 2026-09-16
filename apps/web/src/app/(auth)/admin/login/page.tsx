'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Shield,
  Lock,
  Mail,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  QrCode,
} from 'lucide-react';
import Silk from '@/components/backgrounds/Silk';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function AdminLoginPage() {
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
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
      const res = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const json = await res.json().catch(() => ({}));

      if (res.ok && json.requires2FA) {
        setTempToken(json.tempToken);
        setTwoFactorStep(true);
        setLoading(false);
        return;
      }

      if (res.ok && json.status === 'success' && json.data) {
        setSuccess(true);
        const token = json.data.token;
        if (typeof window !== 'undefined') {
          if (token) {
            localStorage.setItem('cyberstyle_admin_token', token);
            document.cookie = `cyberstyle_session=${token}; path=/; max-age=604800; SameSite=Lax`;
            document.cookie = `auth_token=${token}; path=/; max-age=604800; SameSite=Lax`;
          }
          sessionStorage.setItem(
            'cyberstyle_admin_session',
            JSON.stringify({
              token,
              email: json.data.user?.email || email,
              name: json.data.user?.name || 'Administrator',
              role: json.data.user?.role || 'SUPER_ADMIN',
              loginTime: new Date().toISOString(),
            })
          );
        }
        setTimeout(() => {
          router.push('/admin/dashboard');
        }, 600);
        return;
      }

      setError(json.message || 'Invalid administrative email or password.');
      setLoading(false);
    } catch (err: any) {
      setError(err.message || 'Unable to connect to authentication gateway.');
      setLoading(false);
    }
  };

  const handleVerify2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
      const res = await fetch(`${apiUrl}/auth/2fa/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: email.trim(), tempToken, code: twoFactorCode.trim() }),
      });

      const json = await res.json().catch(() => ({}));

      if (res.ok && json.status === 'success') {
        setSuccess(true);
        if (typeof window !== 'undefined') {
          const token = json.data?.token;
          if (token) {
            localStorage.setItem('cyberstyle_admin_token', token);
            document.cookie = `cyberstyle_session=${token}; path=/; max-age=604800; SameSite=Lax`;
            document.cookie = `auth_token=${token}; path=/; max-age=604800; SameSite=Lax`;
          }
          sessionStorage.setItem(
            'cyberstyle_admin_session',
            JSON.stringify({
              email,
              name: json.data?.user?.name || 'Administrator',
              role: json.data?.user?.role || 'SUPER_ADMIN',
              twoFactorVerified: true,
            })
          );
        }
        setTimeout(() => {
          router.push('/admin/dashboard');
        }, 600);
      } else {
        setError(json.message || 'Invalid two-factor authentication code.');
        setLoading(false);
      }
    } catch {
      setError('Verification connection error.');
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto px-6 py-12 space-y-6">
      <Silk className="opacity-25" speed={0.4} />

      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-[#00F0FF]">
          <Shield className="w-3.5 h-3.5" />
          <span>CYBERSTYLE Operations</span>
        </div>
        <h1 className="font-display font-black text-2xl text-white tracking-tight">
          Administrator Login
        </h1>
        <p className="text-xs text-neutral-400">
          Enter your authorized administrator credentials to manage agency operations.
        </p>
      </div>

      <Card variant="dark" className="p-8 border-white/10 space-y-6">
        {error && (
          <div data-testid="auth-error" role="alert" className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <span>Credentials authenticated. Initializing dashboard...</span>
          </div>
        )}

        {!twoFactorStep ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-mono text-neutral-400">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@yourdomain.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#00F0FF] transition-colors"
                />
                <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-mono text-neutral-400">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#00F0FF] transition-colors font-mono"
                />
                <Lock className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="electric"
              size="lg"
              disabled={loading || success}
              className="w-full justify-center mt-2"
            >
              {loading ? (
                'Verifying Credentials...'
              ) : (
                <>
                  Sign In to Dashboard <ArrowRight className="w-4 h-4 ml-1.5" />
                </>
              )}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerify2FA} className="space-y-4">
            <div className="space-y-2 text-center">
              <div className="w-12 h-12 rounded-xl bg-[#00F0FF]/10 text-[#00F0FF] flex items-center justify-center mx-auto">
                <QrCode className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-lg text-white">Two-Factor Authentication</h3>
              <p className="text-xs text-neutral-400">
                Enter the 6-digit code from your authenticator app or an 8-character recovery key.
              </p>
            </div>

            <div className="space-y-1.5">
              <input
                type="text"
                required
                maxLength={8}
                value={twoFactorCode}
                onChange={(e) => setTwoFactorCode(e.target.value)}
                placeholder="000000"
                className="w-full text-center tracking-[0.4em] font-mono text-xl py-3 rounded-xl bg-white/5 border border-white/20 text-[#00F0FF] focus:outline-none focus:border-[#00F0FF]"
              />
            </div>

            <Button
              type="submit"
              variant="electric"
              size="lg"
              disabled={loading || success}
              className="w-full justify-center"
            >
              {loading ? 'Validating Token...' : 'Confirm & Authenticate'}
            </Button>

            <button
              type="button"
              onClick={() => setTwoFactorStep(false)}
              className="w-full text-center text-xs font-mono text-neutral-400 hover:text-white pt-2"
            >
              &larr; Back to Email / Password
            </button>
          </form>
        )}
      </Card>

      <div className="text-center text-xs text-neutral-500 font-mono">
        <Link href="/" className="hover:text-neutral-300 transition-colors">
          &larr; Return to Public Website
        </Link>
      </div>
    </div>
  );
}
