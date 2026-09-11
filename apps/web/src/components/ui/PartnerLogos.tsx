import React from 'react';

export function PartnerLogos({ className = '' }: { className?: string }) {
  return (
    <div className={`w-full py-8 px-6 bg-black ${className}`}>
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center sm:justify-between gap-8 sm:gap-12 opacity-70 hover:opacity-100 transition-opacity duration-300">
        {/* GitHub */}
        <div className="flex items-center gap-2.5 text-neutral-300 hover:text-white transition-colors">
          <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
            />
          </svg>
          <span className="font-display font-bold text-base tracking-tight text-white">GitHub</span>
        </div>

        {/* HelloSign */}
        <div className="flex items-center gap-2 text-neutral-300 hover:text-white transition-colors">
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M4 4h16v3H4V4zm3 5h13v3H7V9zm-3 5h16v3H4v-3zm3 5h10v3H7v-3z" />
          </svg>
          <span className="font-display font-bold text-sm tracking-wider uppercase text-white">HELLOSIGN</span>
        </div>

        {/* Monzo */}
        <div className="flex items-center gap-2.5 text-neutral-300 hover:text-white transition-colors">
          <svg className="w-6 h-5 fill-current" viewBox="0 0 26 20">
            <path d="M0 20L6.5 0h4.3l4.5 13.5L19.8 0h4.3L30.6 20h-4.6l-3.9-12.8L17.5 20h-3.8L9.1 7.2 5.2 20H0z" />
          </svg>
          <span className="font-display font-bold text-base tracking-tight lowercase text-white">monzo</span>
        </div>

        {/* Maze */}
        <div className="flex items-center gap-2 text-neutral-300 hover:text-white transition-colors">
          <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
            <path d="M12 4a8 8 0 00-7.2 4.5l3.2 1.6A4.5 4.5 0 1112 16.5a4.5 4.5 0 01-3.6-1.8l-3.2 1.6A8 8 0 1012 4z" />
          </svg>
          <span className="font-display font-bold text-base tracking-tight lowercase text-white">maze</span>
        </div>

        {/* Notion */}
        <div className="flex items-center gap-2.5 text-neutral-300 hover:text-white transition-colors">
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l11.415-.746c.466 0 .793-.14.793-.56 0-.607-.466-.793-1.026-.84L5.346 2.062c-.653-.047-.886.14-.886.42 0 .187.14.373 0 1.726zm.933 3.684v11.834c0 .886.42 1.259 1.306 1.306l12.487.7c.886 0 1.26-.42 1.26-1.306V7.472c0-.886-.42-1.26-1.307-1.306L6.652 5.466c-.886 0-1.26.42-1.26 1.306v1.12zm10.772.84c.14.373.14.7.14 1.213v6.342c0 .793-.42 1.073-1.073 1.073-.42 0-.746-.233-.933-.653l-4.15-6.53v6.344c0 .746-.373.98-1.026.98-.606 0-.886-.28-.886-.933V9.11c0-.7.373-.98 1.026-.98.513 0 .793.233 1.026.653l4.057 6.438V9.11c0-.7.373-.98 1.026-.98.606 0 .84.28.84.933z" />
          </svg>
          <span className="font-display font-bold text-base tracking-tight text-white">Notion</span>
        </div>

        {/* Mailchimp */}
        <div className="flex items-center gap-2.5 text-neutral-300 hover:text-white transition-colors">
          <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14.93c-1.63.15-3.05-.72-3.66-2.07l1.37-.68c.38.86 1.25 1.39 2.29 1.3 1.25-.11 2.05-.9 2.05-1.98 0-.9-.55-1.5-1.85-1.85l-1.15-.31c-1.85-.5-2.75-1.5-2.75-2.95 0-1.7 1.35-3 3.3-3.15 1.4-.1 2.6.5 3.2 1.6l-1.3.7c-.4-.7-.95-1.1-1.9-1.05-.95.05-1.65.65-1.65 1.55 0 .8.55 1.35 1.6 1.65l1.15.3c2.15.55 3.05 1.65 3.05 3.2 0 1.9-1.5 3.35-3.7 3.69z" />
          </svg>
          <span className="font-display font-bold text-base tracking-tight text-white">mailchimp</span>
        </div>
      </div>
    </div>
  );
}
