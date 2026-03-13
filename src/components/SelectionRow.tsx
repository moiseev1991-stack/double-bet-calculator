'use client';

import { Trash2 } from 'lucide-react';
import { OddsFormat } from '@/lib/oddsConverter';
import { Outcome, Selection } from '@/lib/betCalculator';

const PLACE_TERMS_OPTIONS = ['1/2', '1/3', '1/4', '1/5', '1/6', '1/7', '1/8'];

const OUTCOME_OPTIONS: { value: Outcome; label: string; color: string }[] = [
  { value: 'win', label: 'Win', color: 'text-emerald-700' },
  { value: 'place', label: 'Place', color: 'text-blue-700' },
  { value: 'lose', label: 'Lose', color: 'text-red-600' },
  { value: 'void', label: 'Void', color: 'text-slate-500' },
  { value: 'non-runner', label: 'Non-Runner', color: 'text-slate-500' },
];

const OUTCOME_OPTIONS_NO_EW: { value: Outcome; label: string; color: string }[] = [
  { value: 'win', label: 'Win', color: 'text-emerald-700' },
  { value: 'lose', label: 'Lose', color: 'text-red-600' },
  { value: 'void', label: 'Void', color: 'text-slate-500' },
  { value: 'non-runner', label: 'Non-Runner', color: 'text-slate-500' },
];

const OUTCOME_COLOR: Record<Outcome, string> = {
  win: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  place: 'border-blue-200 bg-blue-50 text-blue-700',
  lose: 'border-red-200 bg-red-50 text-red-600',
  void: 'border-slate-200 bg-slate-50 text-slate-500',
  'non-runner': 'border-slate-200 bg-slate-50 text-slate-500',
};

interface SelectionRowProps {
  index: number;
  selection: Selection;
  oddsFormat: OddsFormat;
  eachWay: boolean;
  rule4Enabled: boolean;
  deadHeatEnabled: boolean;
  canDelete: boolean;
  onChange: (id: string, field: keyof Selection, value: string | number) => void;
  onDelete: (id: string) => void;
}

export default function SelectionRow({
  index,
  selection,
  oddsFormat,
  eachWay,
  rule4Enabled,
  deadHeatEnabled,
  canDelete,
  onChange,
  onDelete,
}: SelectionRowProps) {
  const outcomeOptions = eachWay ? OUTCOME_OPTIONS : OUTCOME_OPTIONS_NO_EW;
  const oddsPlaceholder =
    oddsFormat === 'fraction'
      ? '2/1'
      : oddsFormat === 'decimal'
      ? '3.00'
      : '+200';

  const rowBg = index % 2 === 0 ? 'bg-white' : 'bg-slate-50/40';

  return (
    <tr className={`${rowBg} hover:bg-blue-50/30 transition-colors`}>
      {/* # */}
      <td className="py-3 pl-4 pr-2">
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-500 text-xs font-bold">
          {index + 1}
        </span>
      </td>

      {/* Odds */}
      <td className="py-3 px-2">
        <input
          type="text"
          value={selection.oddsValue}
          onChange={(e) => onChange(selection.id, 'oddsValue', e.target.value)}
          placeholder={oddsPlaceholder}
          className="w-full min-w-[72px] px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white transition-all placeholder:text-slate-300"
        />
      </td>

      {/* Place Terms (Each Way only) */}
      {eachWay && (
        <td className="py-3 px-2">
          <select
            value={selection.placeTerms}
            onChange={(e) => onChange(selection.id, 'placeTerms', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white cursor-pointer"
          >
            {PLACE_TERMS_OPTIONS.map((pt) => (
              <option key={pt} value={pt}>{pt}</option>
            ))}
          </select>
        </td>
      )}

      {/* Outcome */}
      <td className="py-3 px-2">
        <select
          value={selection.outcome}
          onChange={(e) => onChange(selection.id, 'outcome', e.target.value as Outcome)}
          className={`w-full min-w-[120px] px-3 py-2 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer font-medium transition-colors ${OUTCOME_COLOR[selection.outcome]}`}
        >
          {outcomeOptions.map((o) => (
            <option key={o.value} value={o.value} className="text-slate-700 bg-white font-normal">
              {o.label}
            </option>
          ))}
        </select>
      </td>

      {/* Rule 4 % */}
      {rule4Enabled && (
        <td className="py-3 px-2">
          <div className="flex items-center gap-1">
            <input
              type="number"
              min={0}
              max={75}
              value={selection.rule4Pct || ''}
              onChange={(e) => onChange(selection.id, 'rule4Pct', parseFloat(e.target.value) || 0)}
              placeholder="0"
              className="w-16 px-2 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
            />
            <span className="text-xs text-slate-400 font-medium">%</span>
          </div>
        </td>
      )}

      {/* Dead Heat divisor */}
      {deadHeatEnabled && (
        <td className="py-3 px-2">
          <input
            type="number"
            min={1}
            max={20}
            value={selection.deadHeatDivisor || ''}
            onChange={(e) => onChange(selection.id, 'deadHeatDivisor', parseInt(e.target.value) || 1)}
            placeholder="1"
            className="w-14 px-2 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
          />
        </td>
      )}

      {/* Delete */}
      <td className="py-3 pl-2 pr-3">
        {canDelete ? (
          <button
            type="button"
            onClick={() => onDelete(selection.id)}
            className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
            title="Remove selection"
          >
            <Trash2 size={14} />
          </button>
        ) : (
          <div className="w-7" />
        )}
      </td>
    </tr>
  );
}
