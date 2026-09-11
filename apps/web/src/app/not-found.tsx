import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Home, ArrowUpRight } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import Silk from '@/components/backgrounds/Silk';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-between">
      <Header />

      <main className="relative py-36 px-6 flex items-center justify-center text-center overflow-hidden">
        <Silk className="opacity-50" speed={0.6} />

        <div className="relative z-10 max-w-2xl mx-auto space-y-8">
          <div className="text-xs font-mono uppercase tracking-widest text-[#00F0FF]">
            HTTP 404 // ROUTE NOT FOUND
          </div>

          <h1 className="font-display font-extrabold text-5xl sm:text-7xl text-white tracking-tight leading-none">
            Lost in Cyberspace.
          </h1>

          <p className="text-base sm:text-lg text-neutral-300 leading-relaxed max-w-md mx-auto">
            The page or asset you are looking for has been relocated, archived, or does not exist in our systems.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link href="/">
              <Button variant="electric" size="lg" icon={<Home className="w-4 h-4" />}>
                Return to Homepage
              </Button>
            </Link>
            <Link href="/services">
              <Button variant="outline" size="lg" icon={<ArrowUpRight className="w-4 h-4" />}>
                Explore Services
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
