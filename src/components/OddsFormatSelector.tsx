'use client';

import { OddsFormat } from '@/lib/oddsConverter';

interface OddsFormatSelectorProps {
  value: OddsFormat;
  onChange: (format: OddsFormat) => void;
}

const formats: { value: OddsFormat; label: string; example: string }[] = [
  { value: 'fraction', label: 'Fraction', example: '2/1' },
  { value: 'decimal', label: 'Decimal', example: '3.00' },
  { value: 'american', label: 'American', example: '+200' },
];

export default function OddsFormatSelector({ value, onChange }: OddsFormatSelectorProps) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2.5">
        <span className="text-sm font-semibold text-slate-700">Odds Format</span>
        <span
          className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-slate-100 text-slate-400 text-[10px] font-bold cursor-help"
          title="Choose the odds format you want to use"
        >
          ?
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-1.5">
        {formats.map((fmt) => (
          <button
            key={fmt.value}
            type="button"
            onClick={() => onChange(fmt.value)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              value === fmt.value
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700'
            }`}
            title={`Example: ${fmt.example}`}
          >
            {fmt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
