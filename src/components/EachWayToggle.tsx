'use client';

interface EachWayToggleProps {
  value: boolean;
  onChange: (val: boolean) => void;
}

export default function EachWayToggle({ value, onChange }: EachWayToggleProps) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2.5">
        <span className="text-sm font-semibold text-slate-700">Each Way</span>
        <span
          className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-slate-100 text-slate-400 text-[10px] font-bold cursor-help"
          title="Each Way doubles your stake — one bet on the win, one on the place"
        >
          ?
        </span>
      </div>
      <div className="flex rounded-xl overflow-hidden border border-slate-200 w-fit shadow-sm">
        <button
          type="button"
          onClick={() => onChange(true)}
          className={`px-4 py-1.5 text-xs font-semibold transition-all ${
            value
              ? 'bg-blue-600 text-white'
              : 'bg-white text-slate-500 hover:bg-slate-50'
          }`}
        >
          Yes
        </button>
        <button
          type="button"
          onClick={() => onChange(false)}
          className={`px-4 py-1.5 text-xs font-semibold transition-all border-l border-slate-200 ${
            !value
              ? 'bg-slate-800 text-white'
              : 'bg-white text-slate-500 hover:bg-slate-50'
          }`}
        >
          No
        </button>
      </div>
    </div>
  );
}
