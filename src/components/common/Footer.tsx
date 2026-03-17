import { footerConfig } from '@/config/Footer';
import { socialLinks } from '@/config/Hero';
import { resumeConfig } from '@/config/Resume';
import Link from 'next/link';
import React from 'react';

import Container from './Container';

export default function Footer() {
  return (
    <Container className="py-16">
      <footer className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.05] via-transparent to-white/[0.02] px-6 py-8 backdrop-blur-sm sm:px-8 sm:py-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.06),transparent_30%)]" />

        <div className="relative grid gap-10 md:grid-cols-[1.4fr_0.9fr_1fr]">
          <div className="space-y-4">
            <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.22em] text-zinc-400">
              {footerConfig.status}
            </div>
            <div className="space-y-3">
              <h2 className="max-w-md text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                {footerConfig.title}
              </h2>
              <p className="max-w-lg text-sm leading-7 text-zinc-400 sm:text-base">
                {footerConfig.description}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href="mailto:neprone.dev@gmail.com"
                className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:border-white/20 hover:bg-white/10"
              >
                neprone.dev@gmail.com
              </a>
              <a
                href={resumeConfig.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-zinc-300 transition hover:border-white/20 hover:bg-white/5 hover:text-white"
              >
                View Resume
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">
              Explore
            </p>
            <nav className="grid grid-cols-2 gap-3 text-sm">
              {footerConfig.navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-zinc-400 transition hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">
              Connect
            </p>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target={link.href.startsWith('mailto:') ? undefined : '_blank'}
                  rel={
                    link.href.startsWith('mailto:')
                      ? undefined
                      : 'noopener noreferrer'
                  }
                  aria-label={link.name}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-zinc-300 transition hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/10 hover:text-white"
                >
                  <span className="h-5 w-5">{link.icon}</span>
                </a>
              ))}
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4">
              <p className="text-sm text-zinc-400">
                Based in {footerConfig.location}
              </p>
              <p className="mt-1 text-sm font-medium text-white">
                Available for freelance, internships, and product work.
              </p>
            </div>
          </div>
        </div>

        <div className="relative mt-8 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            {footerConfig.text} <span className="font-semibold text-zinc-300">{footerConfig.developer}</span>
          </p>
          <p>
            &copy; {new Date().getFullYear()}. {footerConfig.copyright}
          </p>
        </div>
      </footer>
    </Container>
  );
}
