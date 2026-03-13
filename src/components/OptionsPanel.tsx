'use client';

interface OptionsPanelProps {
  deadHeatEnabled: boolean;
  rule4Enabled: boolean;
  onDeadHeatChange: (val: boolean) => void;
  onRule4Change: (val: boolean) => void;
}

function Checkbox({
  checked,
  onChange,
  label,
  tooltip,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  tooltip: string;
}) {
  return (
    <label className="flex items-center gap-2 cursor-pointer group">
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all shrink-0 ${
          checked
            ? 'border-blue-600 bg-blue-600'
            : 'border-slate-300 bg-white group-hover:border-blue-400'
        }`}
      >
        {checked && (
          <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 12 12" fill="none">
            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>
      <span
        onClick={() => onChange(!checked)}
        className="text-xs font-semibold text-slate-600 select-none group-hover:text-slate-800 transition-colors"
      >
        {label}
      </span>
      <span
        className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-slate-100 text-slate-400 text-[10px] font-bold cursor-help"
        title={tooltip}
      >
        ?
      </span>
    </label>
  );
}

export default function OptionsPanel({
  deadHeatEnabled,
  rule4Enabled,
  onDeadHeatChange,
  onRule4Change,
}: OptionsPanelProps) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2.5">
        <span className="text-sm font-semibold text-slate-700">Options</span>
      </div>
      <div className="flex flex-col gap-2.5">
        <Checkbox
          checked={deadHeatEnabled}
          onChange={onDeadHeatChange}
          label="Dead Heat"
          tooltip="When two or more runners tie, the return is divided among tied runners"
        />
        <Checkbox
          checked={rule4Enabled}
          onChange={onRule4Change}
          label="Rule 4"
          tooltip="Rule 4 deductions apply when a horse is withdrawn after you place your bet"
        />
      </div>
    </div>
  );
}
