'use client';

import { useState, useCallback, useMemo } from 'react';
import { RotateCcw, Info } from 'lucide-react';
import { OddsFormat } from '@/lib/oddsConverter';
import { Selection, Outcome, BetConfig, BetResult, calculateBet } from '@/lib/betCalculator';
import { BetTypeConfig, BET_TYPE_MAP } from '@/lib/betTypes';
import OddsFormatSelector from './OddsFormatSelector';
import EachWayToggle from './EachWayToggle';
import OptionsPanel from './OptionsPanel';
import SelectionsTable from './SelectionsTable';
import StakePanel from './StakePanel';
import ResultsDisplay from './ResultsDisplay';
import BetBreakdown from './BetBreakdown';
import CalculatorContent from './CalculatorContent';
import BookmakersBlock from './BookmakersBlock';

let idCounter = 10;
function newId() {
  return String(++idCounter);
}

function defaultSelection(id: string): Selection {
  return {
    id,
    oddsValue: '',
    placeTerms: '1/5',
    outcome: 'win',
    rule4Pct: 0,
    deadHeatDivisor: 1,
  };
}

function makeSelections(count: number): Selection[] {
  return Array.from({ length: count }, (_, i) => defaultSelection(String(i + 1)));
}

interface CalculatorProps {
  slug: string;
}

export default function Calculator({ slug }: CalculatorProps) {
  const betType: BetTypeConfig = BET_TYPE_MAP[slug] ?? BET_TYPE_MAP['double'];
  const initialCount = betType.fixedSelections ?? betType.minSelections;

  const [oddsFormat, setOddsFormat] = useState<OddsFormat>('fraction');
  const [eachWay, setEachWay] = useState(false);
  const [rule4Enabled, setRule4Enabled] = useState(false);
  const [deadHeatEnabled, setDeadHeatEnabled] = useState(false);
  const [stake, setStake] = useState('');
  const [stakeMode, setStakeMode] = useState<'total' | 'per-bet'>('per-bet');
  const [selections, setSelections] = useState<Selection[]>(() =>
    makeSelections(initialCount)
  );

  const isFixed = betType.fixedSelections !== null;
  const isAccumulator = betType.betSizes === 'accumulator';

  const handleSelectionChange = useCallback(
    (id: string, field: keyof Selection, value: string | number) => {
      setSelections((prev) =>
        prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
      );
    },
    []
  );

  const handleAddRow = useCallback(() => {
    setSelections((prev) => [...prev, defaultSelection(newId())]);
  }, []);

  const handleDeleteRow = useCallback((id: string) => {
    setSelections((prev) => {
      if (prev.length <= betType.minSelections) return prev;
      return prev.filter((s) => s.id !== id);
    });
  }, [betType.minSelections]);

  const handleReset = useCallback(() => {
    setOddsFormat('fraction');
    setEachWay(false);
    setRule4Enabled(false);
    setDeadHeatEnabled(false);
    setStake('');
    setStakeMode('per-bet');
    setSelections(makeSelections(initialCount));
  }, [initialCount]);

  // Resolve actual bet sizes based on type
  const resolvedBetSizes: number[] | 'accumulator' = useMemo(() => {
    if (betType.betSizes === 'accumulator') return 'accumulator';
    return betType.betSizes;
  }, [betType.betSizes]);

  const config: BetConfig = useMemo(
    () => ({
      oddsFormat,
      eachWay,
      rule4Enabled,
      deadHeatEnabled,
      stakeMode,
      stake: parseFloat(stake) || 0,
      selections,
      betSizes: resolvedBetSizes,
    }),
    [oddsFormat, eachWay, rule4Enabled, deadHeatEnabled, stakeMode, stake, selections, resolvedBetSizes]
  );

  const result: BetResult = useMemo(() => calculateBet(config), [config]);

  // Number of bets label
  const n = selections.length;
  const totalBets = result.isValid ? result.betBreakdown.reduce((s, r) => s + r.totalBets, 0) : betType.totalBets(n) * (eachWay ? 2 : 1);

  return (
    <>
    <div className="max-w-5xl mx-auto px-3 sm:px-4 py-4 lg:py-8">
      {/* ── Page Header ── */}
      <div className={`rounded-2xl bg-gradient-to-r ${betType.accentColor} p-4 md:p-5 mb-5 md:mb-6 text-white shadow-lg`}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold leading-tight mb-1">
              {betType.name}
            </h1>
            <p className="text-white/80 text-sm max-w-xl leading-relaxed">
              {betType.description}
            </p>
          </div>
          <div className="shrink-0 hidden sm:flex flex-col items-end gap-1">
            <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide">
              {totalBets} {totalBets === 1 ? 'Bet' : 'Bets'}
            </span>
            {eachWay && (
              <span className="bg-white/20 text-white text-[10px] px-2 py-1 rounded-full uppercase tracking-wide">
                Each Way
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-5">
        {/* ── Left / Main ── */}
        <div className="flex-1 min-w-0 space-y-4">

          {/* Section: Format & Each Way */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
            <div className="flex flex-col sm:flex-row sm:items-start gap-5">
              <OddsFormatSelector value={oddsFormat} onChange={setOddsFormat} />
              <div className="sm:border-l sm:border-slate-100 sm:pl-5">
                <EachWayToggle value={eachWay} onChange={setEachWay} />
              </div>
              <div className="sm:border-l sm:border-slate-100 sm:pl-5">
                <OptionsPanel
                  deadHeatEnabled={deadHeatEnabled}
                  rule4Enabled={rule4Enabled}
                  onDeadHeatChange={setDeadHeatEnabled}
                  onRule4Change={setRule4Enabled}
                />
              </div>
            </div>
          </div>

          {/* Section: Selections */}
          <SelectionsTable
            selections={selections}
            oddsFormat={oddsFormat}
            eachWay={eachWay}
            rule4Enabled={rule4Enabled}
            deadHeatEnabled={deadHeatEnabled}
            canAddRow={!isFixed || isAccumulator}
            minRows={betType.minSelections}
            onAdd={handleAddRow}
            onDelete={handleDeleteRow}
            onChange={handleSelectionChange}
          />

          {/* Section: Stake */}
          <StakePanel
            stake={stake}
            stakeMode={stakeMode}
            onStakeChange={setStake}
            onStakeModeChange={setStakeMode}
            totalBets={totalBets}
          />

          {/* Section: Results */}
          <ResultsDisplay result={result} />

          {/* How it works — inline callout */}
          <div className="flex gap-3 p-4 bg-blue-50 border border-blue-100 rounded-xl text-sm text-blue-800">
            <Info size={16} className="shrink-0 mt-0.5 text-blue-400" />
            <p className="leading-relaxed">{betType.howItWorks}</p>
          </div>

          {/* Reset */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-xl border border-slate-200 hover:border-red-200 transition-all"
            >
              <RotateCcw size={13} />
              Reset Calculator
            </button>
          </div>
        </div>

        {/* ── Right / Sidebar ── */}
        <div className="w-full xl:w-72 shrink-0 space-y-4">
          <BetBreakdown result={result} eachWay={eachWay} />
          <QuickInfo betType={betType} />
        </div>
      </div>
    </div>
    <CalculatorContent betType={betType} />
    <BookmakersBlock />
  </>
  );
}

// ── Quick info sidebar card ───────────────────────────────────────────────────

function QuickInfo({ betType }: { betType: BetTypeConfig }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
      <h3 className="text-sm font-bold text-slate-800">About {betType.shortName} Bets</h3>
      <p className="text-sm text-slate-600 leading-relaxed">{betType.description}</p>

      {betType.fixedSelections !== null && (
        <div className="grid grid-cols-2 gap-2">
          <StatBox label="Selections" value={String(betType.fixedSelections)} />
          <StatBox label="Total Bets" value={String(betType.totalBets(betType.fixedSelections))} />
        </div>
      )}

      <div className="pt-2 border-t border-slate-100">
        <p className="text-xs text-slate-500 leading-relaxed">
          <strong className="text-slate-600">How it works:</strong>{' '}
          {betType.howItWorks}
        </p>
      </div>

      <div className="pt-2 border-t border-slate-100">
        <p className="text-xs text-slate-400">
          Results are estimates only. Please gamble responsibly.{' '}
          <a href="https://www.begambleaware.org" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
            BeGambleAware.org
          </a>
        </p>
      </div>
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-slate-50 rounded-lg p-3 text-center">
      <p className="text-lg font-bold text-slate-800">{value}</p>
      <p className="text-xs text-slate-500 mt-0.5">{label}</p>
    </div>
  );
}
