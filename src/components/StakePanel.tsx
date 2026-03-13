'use client';

interface StakePanelProps {
  stake: string;
  stakeMode: 'total' | 'per-bet';
  onStakeChange: (val: string) => void;
  onStakeModeChange: (mode: 'total' | 'per-bet') => void;
  totalBets: number;
}

export default function StakePanel({
  stake,
  stakeMode,
  onStakeChange,
  onStakeModeChange,
  totalBets,
}: StakePanelProps) {
  const stakeNum = parseFloat(stake) || 0;
  const actualTotal = stakeMode === 'per-bet' ? stakeNum * totalBets : stakeNum;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
      <div className="flex flex-col sm:flex-row gap-5">
        {/* Stake input */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <label className="text-sm font-semibold text-slate-700">Enter Stake</label>
            <span
              className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-slate-100 text-slate-400 text-[10px] font-bold cursor-help"
              title="Enter your stake in British pounds"
            >
              ?
            </span>
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-sm select-none">
              £
            </span>
            <input
              type="number"
              min={0}
              step={0.01}
              value={stake}
              onChange={(e) => onStakeChange(e.target.value)}
              placeholder="0.00"
              className="w-full pl-7 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-shadow"
            />
          </div>
          {stakeNum > 0 && (
            <p className="text-xs text-slate-400 mt-1.5">
              Total outlay:{' '}
              <span className="font-semibold text-slate-600">
                £{actualTotal.toFixed(2)}
              </span>{' '}
              across {totalBets} {totalBets === 1 ? 'bet' : 'bets'}
            </p>
          )}
        </div>

        {/* Stake mode toggle */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-semibold text-slate-700">Stake Options</span>
            <span
              className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-slate-100 text-slate-400 text-[10px] font-bold cursor-help"
              title="'Total stake' divides your amount across all bets. 'Stake per bet' multiplies by the number of bets."
            >
              ?
            </span>
          </div>
          <div className="flex rounded-xl overflow-hidden border border-slate-200">
            <button
              type="button"
              onClick={() => onStakeModeChange('total')}
              className={`px-4 py-2.5 text-sm font-medium transition-colors whitespace-nowrap ${
                stakeMode === 'total'
                  ? 'bg-slate-800 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              Total stake
            </button>
            <button
              type="button"
              onClick={() => onStakeModeChange('per-bet')}
              className={`px-4 py-2.5 text-sm font-medium transition-colors whitespace-nowrap border-l border-slate-200 ${
                stakeMode === 'per-bet'
                  ? 'bg-slate-800 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              Stake Per Bet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
