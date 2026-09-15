'use client';

import React from 'react';
import { motion, useReducedMotion, Variants } from 'framer-motion';

// Refined, calm studio easing (cubic-bezier(0.22, 1, 0.36, 1))
export const STUDIO_EASE = [0.22, 1, 0.36, 1] as const;

interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  distance?: number;
  duration?: number;
  className?: string;
  viewportMargin?: string;
}

export function Reveal({
  children,
  delay = 0,
  direction = 'up',
  distance = 24,
  duration = 0.65,
  className = '',
  viewportMargin = '0px 0px -100px 0px',
}: RevealProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  const offset = {
    up: { y: distance, x: 0 },
    down: { y: -distance, x: 0 },
    left: { x: distance, y: 0 },
    right: { x: -distance, y: 0 },
    none: { x: 0, y: 0 },
  }[direction];

  return (
    <motion.div
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.18, margin: viewportMargin }}
      transition={{
        duration,
        delay,
        ease: STUDIO_EASE,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface StaggerContainerProps {
  children: React.ReactNode;
  staggerDelay?: number;
  delayChildren?: number;
  className?: string;
}

export function StaggerContainer({
  children,
  staggerDelay = 0.09,
  delayChildren = 0.05,
  className = '',
}: StaggerContainerProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className = '',
  distance = 20,
}: {
  children: React.ReactNode;
  className?: string;
  distance?: number;
}) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: distance },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: STUDIO_EASE,
      },
    },
  };

  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  );
}

export function LogoMotion({ className = '' }: { className?: string }) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return (
      <div className={`flex items-center gap-2.5 ${className}`}>
        <span className="w-2.5 h-2.5 rounded-full bg-[#00F0FF]" />
        <span className="font-display font-bold tracking-wider text-lg uppercase text-white">
          CYBERSTYLE
        </span>
      </div>
    );
  }

  return (
    <motion.div
      className={`flex items-center gap-2.5 group cursor-pointer ${className}`}
      whileHover={{ y: -1.5 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      {/* Icon scales/fades in first */}
      <motion.span
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45, ease: STUDIO_EASE }}
        className="w-2.5 h-2.5 rounded-sm bg-[#00F0FF] shadow-[0_0_10px_rgba(0,240,255,0.7)] group-hover:shadow-[0_0_16px_rgba(0,240,255,0.9)] transition-shadow duration-300"
      />

      {/* Wordmark with subtle upward motion and letter-spacing settle */}
      <motion.span
        initial={{ opacity: 0, y: 8, letterSpacing: '0.14em' }}
        animate={{ opacity: 1, y: 0, letterSpacing: '0.08em' }}
        transition={{
          duration: 0.65,
          delay: 0.12,
          ease: STUDIO_EASE,
        }}
        className="font-display font-bold text-lg uppercase text-white tracking-wider group-hover:text-[#00F0FF] transition-colors duration-300"
      >
        CYBERSTYLE
      </motion.span>
    </motion.div>
  );
}
