'use client';

import { useState } from 'react';
import { ExternalLink, Shield } from 'lucide-react';

interface Bookmaker {
  name: string;
  domain: string;
  tagline: string;
  offer: string;
  accentColor: string;
  textColor: string;
  url: string;
}

const BOOKMAKERS: Bookmaker[] = [
  {
    name: 'Bet365',
    domain: 'bet365.com',
    tagline: 'World\'s favourite online sports betting',
    offer: 'Bet £10 & Get £50 in Free Bets',
    accentColor: '#00A650',
    textColor: '#fff',
    url: 'https://www.bet365.com',
  },
  {
    name: 'William Hill',
    domain: 'williamhill.com',
    tagline: 'Trusted since 1934 — Britain\'s best loved bookmaker',
    offer: 'Bet £10, Get £30 in Free Bets',
    accentColor: '#003366',
    textColor: '#fff',
    url: 'https://www.williamhill.com',
  },
  {
    name: 'Ladbrokes',
    domain: 'ladbrokes.com',
    tagline: 'Over 130 years of sporting passion',
    offer: 'Bet £5, Get £20 Free Bet',
    accentColor: '#D9000D',
    textColor: '#fff',
    url: 'https://www.ladbrokes.com',
  },
  {
    name: 'Paddy Power',
    domain: 'paddypower.com',
    tagline: 'We hear you — the fun, irreverent bookmaker',
    offer: 'Bet £20, Get £40 Free Bets',
    accentColor: '#004833',
    textColor: '#fff',
    url: 'https://www.paddypower.com',
  },
  {
    name: 'Betfair',
    domain: 'betfair.com',
    tagline: 'The world\'s largest betting exchange',
    offer: 'Bet £10, Get £30 in Free Bets',
    accentColor: '#003F72',
    textColor: '#fff',
    url: 'https://www.betfair.com',
  },
];

function BookmakerCard({ bm }: { bm: Bookmaker }) {
  const [imgError, setImgError] = useState(false);
  const logoUrl = `https://logo.clearbit.com/${bm.domain}`;
  const initial = bm.name.charAt(0);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col transition-shadow hover:shadow-md">
      {/* Coloured top bar */}
      <div className="h-1.5 w-full" style={{ backgroundColor: bm.accentColor }} />

      <div className="p-4 flex flex-col flex-1">
        {/* Logo + name */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-100 bg-slate-50 flex items-center justify-center shrink-0">
            {!imgError ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logoUrl}
                alt={`${bm.name} logo`}
                width={40}
                height={40}
                className="w-full h-full object-contain"
                onError={() => setImgError(true)}
              />
            ) : (
              <span
                className="text-lg font-bold text-white flex items-center justify-center w-full h-full"
                style={{ backgroundColor: bm.accentColor }}
              >
                {initial}
              </span>
            )}
          </div>
          <div>
            <p className="font-bold text-slate-800 text-sm leading-tight">{bm.name}</p>
            <p className="text-xs text-slate-400 leading-tight mt-0.5 line-clamp-1">{bm.tagline}</p>
          </div>
        </div>

        {/* Offer */}
        <div
          className="rounded-lg px-3 py-2 mb-3"
          style={{ backgroundColor: `${bm.accentColor}15` }}
        >
          <p className="text-xs font-bold leading-snug" style={{ color: bm.accentColor }}>
            {bm.offer}
          </p>
        </div>

        {/* CTA */}
        <a
          href={bm.url}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="mt-auto flex items-center justify-center gap-1.5 w-full py-2 rounded-xl text-xs font-bold text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: bm.accentColor }}
        >
          Visit {bm.name}
          <ExternalLink size={11} />
        </a>
      </div>
    </div>
  );
}

export default function BookmakersBlock() {
  return (
    <section className="max-w-5xl mx-auto px-4 pb-6">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-800">Popular UK Bookmakers</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Compare offers from leading UK-licensed bookmakers.
          </p>
        </div>

        {/* Cards grid */}
        <div className="p-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {BOOKMAKERS.map((bm) => (
            <BookmakerCard key={bm.name} bm={bm} />
          ))}
        </div>

        {/* Disclaimer */}
        <div className="px-5 py-3 border-t border-slate-100 flex items-start gap-2">
          <Shield size={13} className="text-slate-400 shrink-0 mt-0.5" />
          <p className="text-[11px] text-slate-400 leading-relaxed">
            <strong className="text-slate-500">Sponsored.</strong> T&amp;Cs apply. New customers only. 18+ only.
            Offers subject to change. Please gamble responsibly —{' '}
            <a
              href="https://www.begambleaware.org"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-slate-600 transition-colors"
            >
              BeGambleAware.org
            </a>
            {' · '}
            <a
              href="https://www.gamblingtherapy.org"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-slate-600 transition-colors"
            >
              GamblingTherapy.org
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
