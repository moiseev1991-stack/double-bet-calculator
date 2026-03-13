'use client';

import { PlusCircle } from 'lucide-react';
import { OddsFormat } from '@/lib/oddsConverter';
import { Selection } from '@/lib/betCalculator';
import SelectionRow from './SelectionRow';

interface SelectionsTableProps {
  selections: Selection[];
  oddsFormat: OddsFormat;
  eachWay: boolean;
  rule4Enabled: boolean;
  deadHeatEnabled: boolean;
  canAddRow: boolean;
  minRows: number;
  onAdd: () => void;
  onDelete: (id: string) => void;
  onChange: (id: string, field: keyof Selection, value: string | number) => void;
}

export default function SelectionsTable({
  selections,
  oddsFormat,
  eachWay,
  rule4Enabled,
  deadHeatEnabled,
  canAddRow,
  minRows,
  onAdd,
  onDelete,
  onChange,
}: SelectionsTableProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-slate-700">Selections</span>
          <span
            className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-slate-100 text-slate-400 text-[10px] cursor-help font-bold"
            title="Enter odds and outcome for each selection"
          >
            ?
          </span>
        </div>
        <span className="text-xs text-slate-400">{selections.length} selection{selections.length !== 1 ? 's' : ''}</span>
      </div>

      <div className="overflow-x-auto min-w-0">
        <table className="w-full min-w-[420px]">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-100">
              <th className="text-left py-2.5 pl-4 pr-2 text-xs font-semibold text-slate-400 uppercase tracking-wide w-8">#</th>
              <th className="text-left py-2.5 px-2 text-xs font-semibold text-slate-400 uppercase tracking-wide">Odds</th>
              {eachWay && (
                <th className="text-left py-2.5 px-2 text-xs font-semibold text-slate-400 uppercase tracking-wide">Place</th>
              )}
              <th className="text-left py-2.5 px-2 text-xs font-semibold text-slate-400 uppercase tracking-wide">Outcome</th>
              {rule4Enabled && (
                <th className="text-left py-2.5 px-2 text-xs font-semibold text-slate-400 uppercase tracking-wide">Rule 4</th>
              )}
              {deadHeatEnabled && (
                <th className="text-left py-2.5 px-2 text-xs font-semibold text-slate-400 uppercase tracking-wide">DH ÷</th>
              )}
              <th className="w-10" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {selections.map((sel, idx) => (
              <SelectionRow
                key={sel.id}
                index={idx}
                selection={sel}
                oddsFormat={oddsFormat}
                eachWay={eachWay}
                rule4Enabled={rule4Enabled}
                deadHeatEnabled={deadHeatEnabled}
                canDelete={selections.length > minRows}
                onChange={onChange}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>

      {canAddRow && (
        <div className="px-3 py-2.5 border-t border-slate-100">
          <button
            type="button"
            onClick={onAdd}
            className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all"
          >
            <PlusCircle size={15} />
            Add Row
          </button>
        </div>
      )}
    </div>
  );
}
