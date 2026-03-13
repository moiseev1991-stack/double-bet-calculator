'use client';

import { BetResult } from '@/lib/betCalculator';

interface BetBreakdownProps {
  result: BetResult | null;
  eachWay: boolean;
}

export default function BetBreakdown({ result, eachWay }: BetBreakdownProps) {
  const rows = result?.isValid ? result.betBreakdown : [];

  const totalRow =
    rows.length > 0
      ? {
          totalBets: rows.reduce((s, r) => s + r.totalBets, 0),
          betsWon: rows.reduce((s, r) => s + r.betsWon, 0),
          betsPlaced: rows.reduce((s, r) => s + r.betsPlaced, 0),
          betsLost: rows.reduce((s, r) => s + r.betsLost, 0),
        }
      : null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-100">
        <h3 className="text-sm font-bold text-slate-700">Bet Breakdown</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-100">
              <th className="text-left py-2.5 px-3 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Type</th>
              <th className="text-center py-2.5 px-2 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Total</th>
              <th className="text-center py-2.5 px-2 text-[10px] font-semibold text-emerald-500 uppercase tracking-widest">Won</th>
              {eachWay && (
                <th className="text-center py-2.5 px-2 text-[10px] font-semibold text-blue-500 uppercase tracking-widest">Placed</th>
              )}
              <th className="text-center py-2.5 px-2 text-[10px] font-semibold text-red-400 uppercase tracking-widest">Lost</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={eachWay ? 5 : 4} className="py-5 px-3 text-xs text-slate-400 text-center">
                  Enter odds &amp; stake to see breakdown
                </td>
              </tr>
            ) : (
              <>
                {rows.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-2.5 px-3 text-slate-700 font-medium">{row.betType}</td>
                    <td className="py-2.5 px-2 text-slate-500 text-center">{row.totalBets}</td>
                    <td className="py-2.5 px-2 text-emerald-600 font-semibold text-center">{row.betsWon}</td>
                    {eachWay && (
                      <td className="py-2.5 px-2 text-blue-600 font-semibold text-center">{row.betsPlaced}</td>
                    )}
                    <td className="py-2.5 px-2 text-red-500 font-semibold text-center">{row.betsLost}</td>
                  </tr>
                ))}
                {totalRow && rows.length > 1 && (
                  <tr className="bg-slate-50 border-t border-slate-200">
                    <td className="py-2.5 px-3 font-bold text-blue-700 text-xs uppercase tracking-wide">Total</td>
                    <td className="py-2.5 px-2 font-bold text-slate-700 text-center">{totalRow.totalBets}</td>
                    <td className="py-2.5 px-2 font-bold text-emerald-700 text-center">{totalRow.betsWon}</td>
                    {eachWay && (
                      <td className="py-2.5 px-2 font-bold text-blue-700 text-center">{totalRow.betsPlaced}</td>
                    )}
                    <td className="py-2.5 px-2 font-bold text-red-600 text-center">{totalRow.betsLost}</td>
                  </tr>
                )}
              </>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
