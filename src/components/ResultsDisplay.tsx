'use client';

import { BetResult } from '@/lib/betCalculator';

function fmt(val: number): string {
  return val.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

interface ResultsDisplayProps {
  result: BetResult | null;
}

export default function ResultsDisplay({ result }: ResultsDisplayProps) {
  const stake = result?.isValid ? result.totalStake : null;
  const ret = result?.isValid ? result.totalReturn : null;
  const profit = result?.isValid ? result.profit : null;
  const hasResult = stake !== null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="grid grid-cols-3 divide-x divide-slate-100">
        {/* Total Stake */}
      <div className="px-3 sm:px-4 py-4 sm:py-5 text-center">
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-2">Total Stake</p>
        <p className={`text-xl sm:text-2xl font-extrabold transition-colors ${hasResult ? 'text-slate-800' : 'text-slate-200'}`}>
          {hasResult ? `£${fmt(stake!)}` : '£0'}
        </p>
      </div>

      {/* Return */}
      <div className="px-3 sm:px-4 py-4 sm:py-5 text-center">
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-2">Return</p>
        <p className={`text-xl sm:text-2xl font-extrabold transition-colors ${hasResult ? 'text-blue-600' : 'text-slate-200'}`}>
          {hasResult ? `£${fmt(ret!)}` : '£0.00'}
        </p>
      </div>

      {/* Profit */}
      <div className="px-3 sm:px-4 py-4 sm:py-5 text-center">
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-2">Profit</p>
        <p
          className={`text-xl sm:text-2xl font-extrabold transition-colors ${
              profit === null
                ? 'text-slate-200'
                : profit >= 0
                ? 'text-emerald-600'
                : 'text-red-500'
            }`}
          >
            {profit !== null ? `${profit >= 0 ? '+' : ''}£${fmt(profit)}` : '£0.00'}
          </p>
        </div>
      </div>

      {/* Thin progress bar to indicate result */}
      {hasResult && (
        <div className="h-1 w-full bg-slate-100">
          <div
            className={`h-full transition-all duration-500 ${profit! >= 0 ? 'bg-emerald-500' : 'bg-red-400'}`}
            style={{ width: `${Math.min(100, (ret! / (stake! * 5)) * 100)}%` }}
          />
        </div>
      )}
    </div>
  );
}
