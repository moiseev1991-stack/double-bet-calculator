import { parseOddsToDecimal, parsePlaceTerms, OddsFormat } from './oddsConverter';
import { getBetSizeLabel } from './betTypes';

export type Outcome = 'win' | 'lose' | 'place' | 'non-runner' | 'void';

export interface Selection {
  id: string;
  oddsValue: string;
  placeTerms: string;
  outcome: Outcome;
  rule4Pct: number;
  deadHeatDivisor: number;
}

export interface BetConfig {
  oddsFormat: OddsFormat;
  eachWay: boolean;
  rule4Enabled: boolean;
  deadHeatEnabled: boolean;
  stakeMode: 'total' | 'per-bet';
  stake: number;
  selections: Selection[];
  /** Which combination sizes to bet on. 'accumulator' = [numSelections]. */
  betSizes: number[] | 'accumulator';
}

export interface BetBreakdownRow {
  betType: string;
  totalBets: number;
  betsWon: number;
  betsPlaced: number;
  betsLost: number;
}

export interface BetResult {
  totalStake: number;
  totalReturn: number;
  profit: number;
  betBreakdown: BetBreakdownRow[];
  isValid: boolean;
  error?: string;
}

// ─── Combination generator ───────────────────────────────────────────────────

function getCombinations(n: number, size: number): number[][] {
  const result: number[][] = [];
  function backtrack(start: number, combo: number[]) {
    if (combo.length === size) {
      result.push([...combo]);
      return;
    }
    for (let i = start; i < n; i++) {
      combo.push(i);
      backtrack(i + 1, combo);
      combo.pop();
    }
  }
  backtrack(0, []);
  return result;
}

// ─── Per-leg return calculation ───────────────────────────────────────────────

/**
 * Process a single leg within an accumulator chain.
 * Returns the stake flowing out of this leg.
 */
function processLeg(
  stakeIn: number,
  decOdds: number,
  outcome: Outcome,
  rule4Pct: number,
  dhDivisor: number,
  isPlacePortion: boolean
): number {
  if (outcome === 'non-runner' || outcome === 'void') {
    return stakeIn; // leg collapses, stake passes through
  }
  if (outcome === 'lose') return 0;
  if (!isPlacePortion && outcome === 'place') return 0; // win part of EW only

  // Use place odds for the place portion of an EW bet
  const effectiveDec = isPlacePortion
    ? (decOdds - 1) * parsePlaceTerms('1/5') + 1 // placeholder; replaced by caller
    : decOdds;

  let gross = stakeIn * effectiveDec;
  // Apply Rule 4 to winnings only
  if (rule4Pct > 0) {
    const winnings = (gross - stakeIn) * (1 - rule4Pct / 100);
    gross = stakeIn + winnings;
  }
  // Apply Dead Heat
  if (dhDivisor > 1) {
    gross = gross / dhDivisor;
  }
  return gross;
}

/**
 * Chain all legs in a combination and return the total return for that combination.
 */
function chainCombination(
  unitStake: number,
  selIndices: number[],
  selections: Selection[],
  decOddsArr: number[],
  placeTermsArr: number[],
  rule4Enabled: boolean,
  deadHeatEnabled: boolean,
  isPlacePortion: boolean
): number {
  let running = unitStake;
  for (const idx of selIndices) {
    const sel = selections[idx];
    const outcome = sel.outcome;
    const rule4Pct = rule4Enabled ? sel.rule4Pct : 0;
    const dhDivisor = deadHeatEnabled ? sel.deadHeatDivisor : 1;

    if (outcome === 'non-runner' || outcome === 'void') continue;
    if (outcome === 'lose') return 0;
    if (!isPlacePortion && outcome === 'place') return 0;

    const baseOdds = decOddsArr[idx];
    const effectiveDec = isPlacePortion
      ? (baseOdds - 1) * placeTermsArr[idx] + 1
      : baseOdds;

    let gross = running * effectiveDec;
    if (rule4Pct > 0) {
      const winnings = (gross - running) * (1 - rule4Pct / 100);
      gross = running + winnings;
    }
    if (dhDivisor > 1) {
      gross = gross / dhDivisor;
    }
    running = gross;
  }
  return running;
}

// ─── Main calculation function ────────────────────────────────────────────────

export function calculateBet(config: BetConfig): BetResult {
  const {
    oddsFormat,
    eachWay,
    stake,
    stakeMode,
    selections,
    rule4Enabled,
    deadHeatEnabled,
    betSizes: betSizesInput,
  } = config;

  if (!stake || stake <= 0) {
    return { totalStake: 0, totalReturn: 0, profit: 0, betBreakdown: [], isValid: false };
  }

  const n = selections.length;
  if (n === 0) {
    return { totalStake: 0, totalReturn: 0, profit: 0, betBreakdown: [], isValid: false };
  }

  // Resolve bet sizes
  const betSizes: number[] =
    betSizesInput === 'accumulator' ? [n] : betSizesInput;

  // Parse all odds to decimal
  const decOddsArr: (number | null)[] = selections.map((s) =>
    parseOddsToDecimal(s.oddsValue, oddsFormat)
  );
  // Allow partial entry — treat null/invalid as 1.0 (no movement) for now
  const resolvedOdds: number[] = decOddsArr.map((o) => (o === null || o < 1 ? 1 : o));
  const hasAnyValidOdds = decOddsArr.some((o) => o !== null && o >= 1);

  if (!hasAnyValidOdds) {
    return { totalStake: 0, totalReturn: 0, profit: 0, betBreakdown: [], isValid: false };
  }

  const placeTermsArr: number[] = selections.map((s) =>
    parsePlaceTerms(s.placeTerms)
  );

  // Calculate total number of bets
  let totalBets = 0;
  for (const size of betSizes) {
    const numCombs = getCombinations(n, size).length;
    totalBets += numCombs * (eachWay ? 2 : 1);
  }
  if (totalBets === 0) {
    return { totalStake: 0, totalReturn: 0, profit: 0, betBreakdown: [], isValid: false };
  }

  const unitStake = stakeMode === 'total' ? stake / totalBets : stake;
  const totalStake = unitStake * totalBets;

  let totalReturn = 0;
  const betBreakdown: BetBreakdownRow[] = [];

  for (const size of betSizes) {
    const combs = getCombinations(n, size);
    let betsWon = 0;
    let betsPlaced = 0;
    let betsLost = 0;

    for (const combo of combs) {
      // WIN portion
      const winReturn = chainCombination(
        unitStake,
        combo,
        selections,
        resolvedOdds,
        placeTermsArr,
        rule4Enabled,
        deadHeatEnabled,
        false
      );
      totalReturn += winReturn;

      // PLACE portion (each-way)
      let placeReturn = 0;
      if (eachWay) {
        placeReturn = chainCombination(
          unitStake,
          combo,
          selections,
          resolvedOdds,
          placeTermsArr,
          rule4Enabled,
          deadHeatEnabled,
          true
        );
        totalReturn += placeReturn;
      }

      // Classify outcome
      const activeLegs = combo.filter(
        (i) =>
          selections[i].outcome !== 'non-runner' &&
          selections[i].outcome !== 'void'
      );
      const allWon = activeLegs.every((i) => selections[i].outcome === 'win');
      const anyLost = activeLegs.some((i) => selections[i].outcome === 'lose');
      const somePlace = activeLegs.some((i) => selections[i].outcome === 'place');

      if (eachWay) {
        // Win portion result
        if (anyLost) betsLost++;
        else if (allWon) betsWon++;
        else betsPlaced++;
        // Place portion result
        if (anyLost) betsLost++;
        else if (allWon || somePlace) betsWon++;
        else betsPlaced++;
      } else {
        if (anyLost) betsLost++;
        else if (allWon) betsWon++;
        else betsPlaced++;
      }
    }

    betBreakdown.push({
      betType: getBetSizeLabel(size),
      totalBets: combs.length * (eachWay ? 2 : 1),
      betsWon,
      betsPlaced,
      betsLost,
    });
  }

  const profit = totalReturn - totalStake;

  return {
    totalStake,
    totalReturn,
    profit,
    betBreakdown,
    isValid: true,
  };
}

// Re-export Selection so Calculator.tsx doesn't need to import from two places
export type { OddsFormat };
