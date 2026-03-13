'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Menu, X } from 'lucide-react';
import { BET_TYPES, SIDEBAR_GROUPS } from '@/lib/betTypes';
import clsx from 'clsx';

const betTypeMap = Object.fromEntries(BET_TYPES.map((b) => [b.slug, b]));

function getHref(slug: string): string {
  return slug === 'double' ? '/' : `/${slug}`;
}

function isActive(slug: string, pathname: string): boolean {
  if (slug === 'double') return pathname === '/';
  return pathname === `/${slug}`;
}

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const content = (
    <nav className="flex flex-col h-full">
      {/* Calculator links */}
      <div className="flex-1 overflow-y-auto py-3 space-y-5 px-3">
        {SIDEBAR_GROUPS.map((group) => (
          <div key={group.label}>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest px-2 mb-1.5">
              {group.label}
            </p>
            <ul className="space-y-0.5">
              {group.slugs.map((slug) => {
                const bt = betTypeMap[slug];
                if (!bt) return null;
                const active = isActive(slug, pathname);
                return (
                  <li key={slug}>
                    <Link
                      href={getHref(slug)}
                      onClick={() => setMobileOpen(false)}
                      className={clsx(
                        'flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all group',
                        active
                          ? 'bg-blue-600 text-white font-semibold'
                          : 'text-slate-300 hover:bg-white/10 hover:text-white'
                      )}
                    >
                      <span className="truncate">{bt.shortName}</span>
                      <ChevronRight
                        size={14}
                        className={clsx(
                          'shrink-0 transition-transform',
                          active ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'
                        )}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom disclaimer */}
      <div className="px-4 py-3 border-t border-white/10">
        <p className="text-xs text-slate-500 leading-relaxed">
          18+ · Gamble Responsibly ·{' '}
          <a
            href="https://www.begambleaware.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-slate-300 underline"
          >
            BeGambleAware
          </a>
        </p>
      </div>
    </nav>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-56 xl:w-60 shrink-0 bg-[#0d1b2e] flex-col sticky top-0 h-screen overflow-hidden">
        {content}
      </aside>

      {/* Mobile hamburger button */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed bottom-20 right-4 z-40 w-12 h-12 bg-blue-600 rounded-full shadow-lg flex items-center justify-center text-white hover:bg-blue-700 transition-colors"
        aria-label="Open calculator menu"
      >
        <Menu size={20} />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-64 bg-[#0d1b2e] flex flex-col shadow-2xl">
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="absolute top-3 right-3 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            >
              <X size={18} />
            </button>
            {content}
          </div>
        </div>
      )}
    </>
  );
}
