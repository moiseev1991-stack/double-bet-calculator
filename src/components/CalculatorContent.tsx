'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Lightbulb, BookOpen, HelpCircle } from 'lucide-react';
import { BetTypeConfig } from '@/lib/betTypes';

interface FaqItemProps {
  q: string;
  a: string;
  isOpen: boolean;
  onToggle: () => void;
}

function FaqItem({ q, a, isOpen, onToggle }: FaqItemProps) {
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3.5 text-left bg-white hover:bg-slate-50 transition-colors"
      >
        <span className="text-sm font-semibold text-slate-700 pr-4">{q}</span>
        {isOpen ? (
          <ChevronUp size={16} className="shrink-0 text-blue-500" />
        ) : (
          <ChevronDown size={16} className="shrink-0 text-slate-400" />
        )}
      </button>
      {isOpen && (
        <div className="px-4 pb-4 pt-1 bg-white border-t border-slate-100">
          <p className="text-sm text-slate-600 leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}

interface CalculatorContentProps {
  betType: BetTypeConfig;
}

export default function CalculatorContent({ betType }: CalculatorContentProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const howToSteps = [
    `Select your <strong>odds format</strong> (Fraction, Decimal, or American) and toggle <strong>Each Way</strong> if needed.`,
    `Enter the <strong>odds</strong> for each selection and set the <strong>outcome</strong> (Win, Lose, Place, etc.).`,
    `Enter your <strong>stake</strong> and choose whether it applies to the total or per individual bet — results update instantly.`,
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 pb-8 space-y-6">

      {/* How to use */}
      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex items-center gap-2.5 px-5 py-4 border-b border-slate-100">
          <BookOpen size={16} className="text-blue-500 shrink-0" />
          <h2 className="text-sm font-bold text-slate-700">
            How to Use the {betType.shortName} Bet Calculator
          </h2>
        </div>
        <div className="px-5 py-4">
          <ol className="space-y-3">
            {howToSteps.map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                <p
                  className="text-sm text-slate-600 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: step }}
                />
              </li>
            ))}
          </ol>

          {/* Worked example */}
          <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-xl">
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">
              Worked Example
            </p>
            <p className="text-sm text-blue-800 leading-relaxed">{betType.howItWorks}</p>
          </div>
        </div>
      </section>

      {/* Tips */}
      {betType.tips.length > 0 && (
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-4 border-b border-slate-100">
            <Lightbulb size={16} className="text-amber-500 shrink-0" />
            <h2 className="text-sm font-bold text-slate-700">
              Tips for {betType.shortName} Betting
            </h2>
          </div>
          <ul className="px-5 py-4 space-y-3">
            {betType.tips.map((tip, i) => (
              <li key={i} className="flex gap-3">
                <span className="shrink-0 w-5 h-5 rounded-full bg-amber-100 text-amber-600 text-xs font-bold flex items-center justify-center mt-0.5">
                  ✓
                </span>
                <p className="text-sm text-slate-600 leading-relaxed">{tip}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* FAQ */}
      {betType.faqs.length > 0 && (
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-4 border-b border-slate-100">
            <HelpCircle size={16} className="text-violet-500 shrink-0" />
            <h2 className="text-sm font-bold text-slate-700">
              Frequently Asked Questions — {betType.shortName} Bets
            </h2>
          </div>
          <div className="px-4 py-4 space-y-2">
            {betType.faqs.map((faq, i) => (
              <FaqItem
                key={i}
                q={faq.q}
                a={faq.a}
                isOpen={openFaq === i}
                onToggle={() => setOpenFaq(openFaq === i ? null : i)}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
