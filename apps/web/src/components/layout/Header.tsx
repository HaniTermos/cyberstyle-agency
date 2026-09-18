'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { LogoMotion } from '../motion/Motion';

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(65);
  const headerRef = useRef<HTMLElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Scroll background watcher
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update dynamic header height to prevent any gaps or overlaps
  useEffect(() => {
    const updateHeight = () => {
      if (headerRef.current) {
        setHeaderHeight(headerRef.current.offsetHeight);
      }
    };
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, [scrolled, mobileMenuOpen]);

  // Close menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Lock body scroll and handle Escape key when mobile menu is active
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setMobileMenuOpen(false);
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = 'unset';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = 'unset';
    }
    return undefined;
  }, [mobileMenuOpen]);

  const navLinks = [
    { label: 'Services', href: '/services' },
    { label: 'Work', href: '/work' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'About', href: '/about' },
    { label: 'Insights', href: '/blog' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <>
      <header
        ref={headerRef}
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
          mobileMenuOpen
            ? 'bg-[#07080B] border-b border-white/10 py-3.5 shadow-lg'
            : scrolled
            ? 'bg-black/85 backdrop-blur-md border-b border-white/10 py-3.5 shadow-lg'
            : 'bg-transparent border-b border-white/5 py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          {/* Brand Logo & Wordmark */}
          <Link href="/" className="flex items-center group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00F0FF] rounded-lg">
            <LogoMotion />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-neutral-300">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname?.startsWith(link.href));
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`transition-colors py-1 relative group/link focus:outline-none focus-visible:text-white ${
                    isActive ? 'text-[#00F0FF] font-semibold' : 'text-neutral-300 hover:text-white'
                  }`}
                >
                  <span>{link.label}</span>
                  {/* Subtle animated underline sweep */}
                  <span
                    className={`absolute -bottom-1 left-0 right-0 h-[2px] bg-[#00F0FF] rounded-full transition-transform duration-200 origin-left ${
                      isActive ? 'scale-x-100' : 'scale-x-0 group-hover/link:scale-x-100'
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Action Button */}
          <div className="hidden lg:flex items-center gap-4">
            <Link href="/start-project">
              <Button variant="primary" size="sm" icon={<ArrowUpRight className="w-4 h-4" />}>
                Request a Project Call
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-neutral-400 hover:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00F0FF]"
            aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Portalled Mobile Menu Overlay & Drawer (completely unconstrained by parent header or page stacking contexts) */}
      {mounted && mobileMenuOpen && createPortal(
        <div
          className="fixed inset-x-0 z-[99] border-t border-white/10 px-5 sm:px-6 py-6 sm:py-8 flex flex-col justify-between overflow-y-auto overscroll-contain shadow-2xl"
          style={{
            top: `${headerHeight}px`,
            height: `calc(100dvh - ${headerHeight}px)`,
            backgroundColor: '#07080B',
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation"
        >
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname?.startsWith(link.href));
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-xl sm:text-2xl font-display font-bold transition-colors py-3 border-b border-white/10 flex items-center justify-between ${
                    isActive ? 'text-[#00F0FF]' : 'text-white hover:text-[#00F0FF]'
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && <span className="w-2 h-2 rounded-full bg-[#00F0FF] shadow-[0_0_8px_rgba(0,240,255,0.8)]" />}
                </Link>
              );
            })}
          </nav>

          <div className="pt-6 border-t border-white/10 flex flex-col gap-3 shrink-0">
            <Link href="/start-project" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="electric" size="lg" className="w-full justify-center">
                Request a Project Call
              </Button>
            </Link>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}

