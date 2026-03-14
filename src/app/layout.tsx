import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Sidebar from '@/components/Sidebar';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Double Bet Calculator | Free UK Betting Calculators',
  description:
    'Free UK betting calculators for doubles, trebles, accumulators, Trixie, Yankee, Heinz, Lucky 15 and more. Supports fractional, decimal and American odds.',
  keywords: [
    'double bet calculator',
    'each way double calculator',
    'bet calculator UK',
    'trixie bet calculator',
    'yankee bet calculator',
    'heinz bet calculator',
    'lucky 15 calculator',
    'accumulator calculator',
  ],
  authors: [{ name: 'BetCalc UK' }],
  openGraph: {
    title: 'Double Bet Calculator | Free UK Betting Calculators',
    description:
      'Free UK betting calculators. Supports all bet types including doubles, Trixie, Yankee, Heinz, Lucky 15, and more.',
    type: 'website',
    locale: 'en_GB',
  },
  robots: { index: true, follow: true },
  verification: {
    google: 'sl4J-ZOx2oiHPcNCpLjVT8bcwynwLAFavm_FvoAQGCQ',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={inter.variable}>
      <body className="antialiased bg-slate-100 min-h-screen flex flex-col">
        {/* ── Top bar ── */}
        <header className="bg-[#0d1b2e] border-b border-white/10 z-30 relative">
          <div className="flex items-center justify-between px-4 lg:px-6 h-12">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-blue-500 flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="4" y="2" width="16" height="20" rx="2" />
                  <path d="M9 7h6M9 12h6M9 17h4" />
                </svg>
              </div>
              <span className="text-white font-bold text-sm">BetCalc UK</span>
            </div>
            <div className="hidden lg:block" />
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span className="hidden sm:inline">🇬🇧 UK &amp; Ireland</span>
              <span className="text-slate-600">|</span>
              <a
                href="https://www.begambleaware.org"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-slate-300 transition-colors"
              >
                BeGambleAware
              </a>
              <span className="bg-amber-500 text-amber-900 font-bold px-2 py-0.5 rounded text-[10px] uppercase tracking-wide">
                18+
              </span>
            </div>
          </div>
        </header>

        {/* ── Body: sidebar + main ── */}
        <div className="flex flex-1 min-h-0">
          <Sidebar />
          <main className="flex-1 min-w-0 overflow-y-auto">
            {children}
          </main>
        </div>

        {/* ── Footer ── */}
        <footer className="bg-[#0d1b2e] text-slate-400 border-t border-white/10">
          <div className="max-w-5xl mx-auto px-4 py-6">
            <div className="flex flex-col sm:flex-row justify-between gap-4 text-xs">
              <div>
                <p className="font-semibold text-white mb-1">BetCalc UK</p>
                <p className="text-slate-500 max-w-sm leading-relaxed">
                  Free betting calculators for UK horse racing and sports. All results are estimates only. Past performance is not indicative of future results.
                </p>
              </div>
              <div className="space-y-1 text-slate-500">
                <p>© {new Date().getFullYear()} BetCalc UK. All rights reserved.</p>
                <p>
                  <a href="https://www.begambleaware.org" target="_blank" rel="noopener noreferrer" className="hover:text-slate-300 transition-colors">BeGambleAware.org</a>
                  {' · '}
                  <a href="https://www.gamblingcommission.gov.uk" target="_blank" rel="noopener noreferrer" className="hover:text-slate-300 transition-colors">UK Gambling Commission</a>
                  {' · '}
                  <a href="https://www.gamblingtherapy.org" target="_blank" rel="noopener noreferrer" className="hover:text-slate-300 transition-colors">Gambling Therapy</a>
                </p>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
