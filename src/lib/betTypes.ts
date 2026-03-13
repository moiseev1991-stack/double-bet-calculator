export type BetCategory = 'basic' | 'system' | 'large';

export interface BetFaq {
  q: string;
  a: string;
}

export interface BetTypeConfig {
  slug: string;
  name: string;
  shortName: string;
  category: BetCategory;
  /** null = variable (Accumulator) */
  fixedSelections: number | null;
  minSelections: number;
  /**
   * Which combination sizes to generate from the n selections.
   * 'accumulator' = always use [numSelections] — one full fold bet.
   */
  betSizes: number[] | 'accumulator';
  description: string;
  howItWorks: string;
  accentColor: string;
  totalBets: (n: number) => number;
  faqs: BetFaq[];
  tips: string[];
}

function C(n: number, k: number): number {
  if (k > n) return 0;
  if (k === 0 || k === n) return 1;
  let result = 1;
  for (let i = 0; i < k; i++) {
    result = (result * (n - i)) / (i + 1);
  }
  return Math.round(result);
}

export const BET_TYPES: BetTypeConfig[] = [
  {
    slug: 'single',
    name: 'Single Bet Calculator',
    shortName: 'Single',
    category: 'basic',
    fixedSelections: 1,
    minSelections: 1,
    betSizes: [1],
    accentColor: 'from-slate-600 to-slate-500',
    totalBets: () => 1,
    description:
      'A single bet is the most straightforward wager — one selection, one bet. If it wins, you receive a return based on the odds; if it loses, your stake is gone.',
    howItWorks:
      'Return = Stake × Decimal Odds. A £10 bet at 3/1 (4.0 decimal) returns £40 (£30 profit).',
    tips: [
      'Singles are the easiest bets to understand — your return depends purely on the odds of that one selection.',
      'Use fractional odds (e.g. 5/1) by entering them as "5/1", or switch to decimal for quicker mental maths.',
    ],
    faqs: [
      {
        q: 'How do I calculate single bet returns?',
        a: 'Multiply your stake by the decimal odds. For example, £10 at 4/1 (5.0 decimal) = £50 total return (£40 profit).',
      },
      {
        q: 'What is the difference between fractional and decimal odds?',
        a: 'Fractional odds (e.g. 2/1) show profit relative to stake. Decimal odds (e.g. 3.0) show total return per £1 staked, including your stake back.',
      },
      {
        q: 'Can I place an each-way single?',
        a: 'Yes. An each-way single is two bets: one on the win and one on the place. Your total stake doubles and you can receive a return even if your selection finishes in a place position.',
      },
    ],
  },
  {
    slug: 'double',
    name: 'Double Bet Calculator',
    shortName: 'Double',
    category: 'basic',
    fixedSelections: 2,
    minSelections: 2,
    betSizes: [2],
    accentColor: 'from-blue-700 to-blue-500',
    totalBets: () => 1,
    description:
      'A double bet combines two selections into one bet. Both must win for you to receive a return. The odds are multiplied, creating much larger potential returns than two singles.',
    howItWorks:
      'Return = Stake × Odds₁ × Odds₂. A £10 bet on 2/1 and 8/11 → £10 × 3.0 × 1.727 = £51.82.',
    tips: [
      'A double gives far better returns than two singles, but both selections must win — one loser means the whole bet loses.',
      'Each-way doubles are a popular option in horse racing; you can still collect on the place double even if one selection misses a win.',
    ],
    faqs: [
      {
        q: 'How does a double bet work?',
        a: 'Your stake is placed on both selections as a combined bet. The return from the first selection is automatically staked on the second, multiplying the overall odds.',
      },
      {
        q: 'What happens if one selection is a non-runner?',
        a: 'If one selection is declared a non-runner, your double collapses to a single on the remaining selection and your stake is adjusted accordingly.',
      },
      {
        q: 'Are doubles good value compared to singles?',
        a: 'Doubles offer much higher potential returns but more risk. If you have two strong fancies, a double maximises profit while still being straightforward to understand.',
      },
    ],
  },
  {
    slug: 'treble',
    name: 'Treble Bet Calculator',
    shortName: 'Treble',
    category: 'basic',
    fixedSelections: 3,
    minSelections: 3,
    betSizes: [3],
    accentColor: 'from-violet-700 to-violet-500',
    totalBets: () => 1,
    description:
      'A treble combines three selections. All three must win for a return. The potential reward is high, but so is the risk — one loser ends the bet.',
    howItWorks:
      'Return = Stake × Odds₁ × Odds₂ × Odds₃. Great for boosting returns on three confident selections.',
    tips: [
      'A Saturday treble on three football matches is one of the most popular weekend bets in the UK.',
      'Combining three short-priced favourites in a treble can yield attractive returns without the risk of longer-odds singles.',
    ],
    faqs: [
      {
        q: 'How is a treble calculated?',
        a: 'Convert all three selections to decimal odds and multiply them together with your stake. For example, £5 on 2/1, 3/1 and Evens: £5 × 3.0 × 4.0 × 2.0 = £120 return.',
      },
      {
        q: 'What is the difference between a treble and a Trixie?',
        a: 'A treble is one bet (all three must win). A Trixie is four bets (three doubles and the treble), so you can still profit with only two winners.',
      },
      {
        q: 'Can I do a treble each way?',
        a: 'Yes. An each-way treble is two bets — a win treble and a place treble. Your total stake is doubled.',
      },
    ],
  },
  {
    slug: 'accumulator',
    name: 'Accumulator Bet Calculator',
    shortName: 'Accumulator',
    category: 'basic',
    fixedSelections: null,
    minSelections: 4,
    betSizes: 'accumulator',
    accentColor: 'from-emerald-700 to-emerald-500',
    totalBets: () => 1,
    description:
      'An accumulator (acca) combines 4 or more selections into a single bet. All must win. Returns are potentially enormous, but one loser loses everything.',
    howItWorks:
      'Return = Stake × Odds₁ × Odds₂ × … × OddsN. Each winning leg rolls the full return into the next.',
    tips: [
      'Football accas are hugely popular on weekends — a 5-fold acca on five home favourites can return 20x or more your stake.',
      'Consider "acca insurance" promotions from bookmakers that refund your stake as a free bet if one leg lets you down.',
    ],
    faqs: [
      {
        q: 'How many selections can I include in an accumulator?',
        a: 'Technically as many as you like, but most bookmakers cap accumulators at around 20 selections. Our calculator supports up to 20 via the Add Row button.',
      },
      {
        q: 'What happens if a match in my acca is postponed?',
        a: 'Postponed or void selections are generally removed from the accumulator, collapsing it to fewer legs. The odds reduce accordingly.',
      },
      {
        q: 'What is the difference between a 4-fold and a 4-team accumulator?',
        a: 'They are the same thing. A 4-fold accumulator means four selections all combined in one bet.',
      },
    ],
  },
  {
    slug: 'trixie',
    name: 'Trixie Bet Calculator',
    shortName: 'Trixie',
    category: 'system',
    fixedSelections: 3,
    minSelections: 3,
    betSizes: [2, 3],
    accentColor: 'from-pink-700 to-pink-500',
    totalBets: (n) => C(n, 2) + C(n, 3),
    description:
      'A Trixie is 4 bets from 3 selections: 3 doubles and 1 treble. You need at least 2 winners to get a return, making it safer than a straight treble.',
    howItWorks:
      '3 doubles (AB, AC, BC) + 1 treble (ABC) = 4 bets total. You can still profit if only 2 of 3 selections win.',
    tips: [
      'A Trixie offers better risk coverage than a straight treble — two winners still generates a return from the covering doubles.',
      'At 4 bets, the Trixie stake commitment is modest, making it ideal for horse racing where a non-runner is always possible.',
    ],
    faqs: [
      {
        q: 'How many bets is a Trixie?',
        a: 'A Trixie is 4 bets: 3 doubles (AB, AC, BC) and 1 treble (ABC). A £1 Trixie therefore costs £4.',
      },
      {
        q: 'Do I need all three selections to win a Trixie?',
        a: 'No — you only need 2 of the 3 selections to win to get a return, via the covering doubles. All three winning maximises your return through the treble.',
      },
      {
        q: 'What is the difference between a Trixie and a Patent?',
        a: 'A Patent adds 3 singles to the Trixie, making 7 bets total. This means any single winner returns something, but the Patent costs more to place.',
      },
    ],
  },
  {
    slug: 'patent',
    name: 'Patent Bet Calculator',
    shortName: 'Patent',
    category: 'system',
    fixedSelections: 3,
    minSelections: 3,
    betSizes: [1, 2, 3],
    accentColor: 'from-amber-700 to-amber-500',
    totalBets: (n) => C(n, 1) + C(n, 2) + C(n, 3),
    description:
      'A Patent is 7 bets from 3 selections: 3 singles, 3 doubles, and 1 treble. Even a single winner produces a return, making it the safest 3-selection system bet.',
    howItWorks:
      '3 singles + 3 doubles + 1 treble = 7 bets. Any single winner returns something thanks to the included singles.',
    tips: [
      'The Patent is the safest 3-selection system bet because the three included singles mean even one winner gives you something back.',
      'Bookmakers sometimes offer bonus payouts on Patents when all three selections win — always check the terms before placing.',
    ],
    faqs: [
      {
        q: 'How much does a £1 Patent cost?',
        a: 'A £1 Patent costs £7 (7 bets of £1 each). An each-way Patent doubles this to £14.',
      },
      {
        q: 'Can I win from a Patent with one winner?',
        a: 'Yes. The three singles ensure that even if only one selection wins, you receive a return — though it will likely be less than your total stake.',
      },
      {
        q: 'Is a Patent the same as a Heinz for 3 selections?',
        a: 'No. A Patent covers all bet types for 3 selections (singles, doubles, treble). A Heinz is for 6 selections. The Patent is unique to 3-selection bets.',
      },
    ],
  },
  {
    slug: 'yankee',
    name: 'Yankee Bet Calculator',
    shortName: 'Yankee',
    category: 'system',
    fixedSelections: 4,
    minSelections: 4,
    betSizes: [2, 3, 4],
    accentColor: 'from-red-700 to-red-500',
    totalBets: (n) => C(n, 2) + C(n, 3) + C(n, 4),
    description:
      'A Yankee is 11 bets from 4 selections: 6 doubles, 4 trebles, and 1 four-fold. You need at least 2 winners to get any return.',
    howItWorks:
      '6 doubles + 4 trebles + 1 four-fold = 11 bets total. Popular for horse racing with 4 selections.',
    tips: [
      'A Yankee is a go-to bet for Saturday horse racing — covering 4 meetings means you have plenty of combinations in play.',
      'Two winners in a Yankee will return something via the doubles; three or four winners can deliver substantial profits.',
    ],
    faqs: [
      {
        q: 'How many bets is a Yankee?',
        a: 'A Yankee is 11 bets: 6 doubles, 4 trebles, and 1 four-fold accumulator. A £1 Yankee costs £11.',
      },
      {
        q: 'What is the minimum number of winners to get a return from a Yankee?',
        a: 'You need at least 2 winners to collect on a Yankee (via the doubles). More winners mean exponentially higher returns.',
      },
      {
        q: 'What is the difference between a Yankee and a Lucky 15?',
        a: 'A Lucky 15 adds 4 singles to the Yankee, making 15 bets total. This means any single winner returns something in a Lucky 15, whereas a Yankee requires 2 winners.',
      },
    ],
  },
  {
    slug: 'lucky-15',
    name: 'Lucky 15 Bet Calculator',
    shortName: 'Lucky 15',
    category: 'system',
    fixedSelections: 4,
    minSelections: 4,
    betSizes: [1, 2, 3, 4],
    accentColor: 'from-orange-700 to-orange-500',
    totalBets: (n) => C(n, 1) + C(n, 2) + C(n, 3) + C(n, 4),
    description:
      'A Lucky 15 is 15 bets from 4 selections: 4 singles, 6 doubles, 4 trebles, and 1 four-fold. Even one winner returns something. A popular choice with bookmakers offering bonuses.',
    howItWorks:
      '4 singles + 6 doubles + 4 trebles + 1 four-fold = 15 bets. One winner guarantees a return via the singles.',
    tips: [
      'Many UK bookmakers offer a bonus on Lucky 15s when all 4 selections win — check for enhanced odds before placing.',
      'If only 1 selection wins in a Lucky 15, the single ensures a return, though it is likely to be less than the total stake.',
    ],
    faqs: [
      {
        q: 'What is a Lucky 15 bet?',
        a: 'A Lucky 15 covers all possible combinations from 4 selections: 4 singles, 6 doubles, 4 trebles, and 1 four-fold — 15 bets in total.',
      },
      {
        q: 'Why is it called Lucky 15?',
        a: 'The name comes from the total number of bets (15) and the "Lucky" prefix used by UK bookmakers for system bets that include singles.',
      },
      {
        q: 'Do bookmakers offer bonuses on Lucky 15s?',
        a: 'Yes, many UK bookmakers offer enhanced returns if all 4 selections win, or a consolation bonus if only 1 wins. Always check current promotions.',
      },
    ],
  },
  {
    slug: 'canadian',
    name: 'Canadian Bet Calculator',
    shortName: 'Canadian',
    category: 'system',
    fixedSelections: 5,
    minSelections: 5,
    betSizes: [2, 3, 4, 5],
    accentColor: 'from-cyan-700 to-cyan-500',
    totalBets: (n) => C(n, 2) + C(n, 3) + C(n, 4) + C(n, 5),
    description:
      'A Canadian (Super Yankee) is 26 bets from 5 selections: 10 doubles, 10 trebles, 5 four-folds, and 1 five-fold. At least 2 winners needed for a return.',
    howItWorks:
      '10 doubles + 10 trebles + 5 four-folds + 1 five-fold = 26 bets. High number of bets but strong coverage of your 5 selections.',
    tips: [
      'A Canadian is also called a Super Yankee — think of it as a Yankee with an extra selection added to every combination.',
      'With 26 bets, the Canadian requires a reasonable stake commitment, but 2 winners guarantees a return via the doubles.',
    ],
    faqs: [
      {
        q: 'How many bets is a Canadian?',
        a: 'A Canadian is 26 bets: 10 doubles, 10 trebles, 5 four-folds, and 1 five-fold. A £1 Canadian costs £26.',
      },
      {
        q: 'Why is it called a Canadian?',
        a: 'The exact origin is unclear, but the name is widely used in UK betting shops alongside its alternative name "Super Yankee".',
      },
      {
        q: 'Is a Canadian the same as a Super Yankee?',
        a: 'Yes — Canadian and Super Yankee are two names for exactly the same bet: 26 bets from 5 selections.',
      },
    ],
  },
  {
    slug: 'lucky-31',
    name: 'Lucky 31 Bet Calculator',
    shortName: 'Lucky 31',
    category: 'system',
    fixedSelections: 5,
    minSelections: 5,
    betSizes: [1, 2, 3, 4, 5],
    accentColor: 'from-teal-700 to-teal-500',
    totalBets: (n) => C(n, 1) + C(n, 2) + C(n, 3) + C(n, 4) + C(n, 5),
    description:
      'A Lucky 31 is 31 bets from 5 selections: 5 singles, 10 doubles, 10 trebles, 5 four-folds, and 1 five-fold. Any single winner produces a return.',
    howItWorks:
      '5 singles + 10 doubles + 10 trebles + 5 four-folds + 1 five-fold = 31 bets. The singles ensure any winner gives a return.',
    tips: [
      'A Lucky 31 is a Canadian with 5 singles added — the singles provide a safety net so even one winner gives a return.',
      'Look for bookmakers offering Lucky 31 bonuses — some pay out extra when all 5 selections win.',
    ],
    faqs: [
      {
        q: 'How many bets is a Lucky 31?',
        a: 'A Lucky 31 is 31 bets: 5 singles, 10 doubles, 10 trebles, 5 four-folds, and 1 five-fold. A £1 Lucky 31 costs £31.',
      },
      {
        q: 'How does a Lucky 31 differ from a Canadian?',
        a: 'A Lucky 31 is a Canadian plus 5 singles — the singles ensure any single winner still pays out something.',
      },
      {
        q: 'Do bookmakers offer Lucky 31 bonuses?',
        a: 'Many UK bookmakers offer enhanced returns when all 5 selections win. Check individual bookmaker promotions before placing.',
      },
    ],
  },
  {
    slug: 'heinz',
    name: 'Heinz Bet Calculator',
    shortName: 'Heinz',
    category: 'large',
    fixedSelections: 6,
    minSelections: 6,
    betSizes: [2, 3, 4, 5, 6],
    accentColor: 'from-indigo-700 to-indigo-500',
    totalBets: (n) =>
      C(n, 2) + C(n, 3) + C(n, 4) + C(n, 5) + C(n, 6),
    description:
      'A Heinz is 57 bets from 6 selections (named after the famous 57 varieties): 15 doubles, 20 trebles, 15 four-folds, 6 five-folds, and 1 six-fold.',
    howItWorks:
      '15 doubles + 20 trebles + 15 four-folds + 6 five-folds + 1 six-fold = 57 bets. Excellent coverage of 6 selections.',
    tips: [
      'A Heinz is named after the Heinz "57 Varieties" brand — a fun fact to share at the betting shop!',
      'With 57 bets, even a £0.10 Heinz costs £5.70 — keep your unit stake small to manage risk on large system bets.',
    ],
    faqs: [
      {
        q: 'Why is it called a Heinz bet?',
        a: 'A Heinz has 57 bets, referencing the famous Heinz "57 Varieties" marketing slogan. The name is widely recognised in UK betting shops.',
      },
      {
        q: 'How many winners do I need in a Heinz?',
        a: 'You need at least 2 winners to collect from a Heinz (via the doubles). More winners multiply returns significantly through the larger combinations.',
      },
      {
        q: 'What is the difference between a Heinz and a Lucky 63?',
        a: 'A Lucky 63 adds 6 singles to the Heinz, totalling 63 bets. The singles mean even one winner returns something in a Lucky 63.',
      },
    ],
  },
  {
    slug: 'lucky-63',
    name: 'Lucky 63 Bet Calculator',
    shortName: 'Lucky 63',
    category: 'large',
    fixedSelections: 6,
    minSelections: 6,
    betSizes: [1, 2, 3, 4, 5, 6],
    accentColor: 'from-fuchsia-700 to-fuchsia-500',
    totalBets: (n) =>
      C(n, 1) + C(n, 2) + C(n, 3) + C(n, 4) + C(n, 5) + C(n, 6),
    description:
      'A Lucky 63 is 63 bets from 6 selections: 6 singles, 15 doubles, 20 trebles, 15 four-folds, 6 five-folds, and 1 six-fold. Any winner produces a return via the singles.',
    howItWorks:
      '6 singles + 15 doubles + 20 trebles + 15 four-folds + 6 five-folds + 1 six-fold = 63 bets.',
    tips: [
      'A Lucky 63 is one of the most popular large system bets in the UK — the singles provide excellent risk coverage across 6 selections.',
      'Many bookmakers offer bonuses for Lucky 63s when all 6 selections win — the all-winners bonus can be substantial.',
    ],
    faqs: [
      {
        q: 'How many bets is a Lucky 63?',
        a: 'A Lucky 63 covers all combinations from 6 selections: 6 singles, 15 doubles, 20 trebles, 15 four-folds, 6 five-folds, and 1 six-fold = 63 bets.',
      },
      {
        q: 'How does a Lucky 63 compare to a Heinz?',
        a: 'A Lucky 63 is a Heinz with 6 singles added. The singles mean even one winner gives a return, making it more forgiving than a straight Heinz.',
      },
      {
        q: 'Is a Lucky 63 worth it?',
        a: 'For bettors with 6 confident selections, a Lucky 63 offers maximum coverage. The key is keeping unit stakes low to manage the 63-bet cost.',
      },
    ],
  },
  {
    slug: 'super-heinz',
    name: 'Super Heinz Bet Calculator',
    shortName: 'Super Heinz',
    category: 'large',
    fixedSelections: 7,
    minSelections: 7,
    betSizes: [2, 3, 4, 5, 6, 7],
    accentColor: 'from-rose-700 to-rose-500',
    totalBets: (n) =>
      C(n, 2) +
      C(n, 3) +
      C(n, 4) +
      C(n, 5) +
      C(n, 6) +
      C(n, 7),
    description:
      'A Super Heinz is 120 bets from 7 selections: 21 doubles, 35 trebles, 35 four-folds, 21 five-folds, 7 six-folds, and 1 seven-fold.',
    howItWorks:
      '21 doubles + 35 trebles + 35 four-folds + 21 five-folds + 7 six-folds + 1 seven-fold = 120 bets.',
    tips: [
      'At 120 bets, a Super Heinz is best placed at very small unit stakes — even £0.10 per bet costs £12 total.',
      'If all 7 selections win, the returns from a Super Heinz can be truly life-changing at short prices.',
    ],
    faqs: [
      {
        q: 'How many bets is a Super Heinz?',
        a: 'A Super Heinz is 120 bets from 7 selections: 21 doubles, 35 trebles, 35 four-folds, 21 five-folds, 7 six-folds, and 1 seven-fold.',
      },
      {
        q: 'Do I need all 7 to win a Super Heinz?',
        a: 'No — you need at least 2 winners to receive a return (from the doubles). However, the more winners, the greater the exponential returns.',
      },
      {
        q: 'Is a Super Heinz the same as a Heinz with more selections?',
        a: 'A Super Heinz covers 7 selections versus 6 for a Heinz, and excludes singles. It is a step up in both coverage and cost.',
      },
    ],
  },
  {
    slug: 'goliath',
    name: 'Goliath Bet Calculator',
    shortName: 'Goliath',
    category: 'large',
    fixedSelections: 8,
    minSelections: 8,
    betSizes: [2, 3, 4, 5, 6, 7, 8],
    accentColor: 'from-purple-700 to-purple-500',
    totalBets: (n) =>
      C(n, 2) +
      C(n, 3) +
      C(n, 4) +
      C(n, 5) +
      C(n, 6) +
      C(n, 7) +
      C(n, 8),
    description:
      'A Goliath is 247 bets from 8 selections — the largest named system bet. It covers every possible combination from doubles upward across 8 selections.',
    howItWorks:
      '28 doubles + 56 trebles + 70 four-folds + 56 five-folds + 28 six-folds + 8 seven-folds + 1 eight-fold = 247 bets.',
    tips: [
      'A Goliath at £0.10 per bet still costs £24.70 — always use the calculator to confirm your total outlay before placing.',
      'With 247 combinations, the Goliath offers the widest possible coverage, but requires 2 winners minimum for any return.',
    ],
    faqs: [
      {
        q: 'How many bets is a Goliath?',
        a: 'A Goliath is 247 bets from 8 selections, covering every combination from doubles to the 8-fold accumulator.',
      },
      {
        q: 'Why is it called a Goliath?',
        a: 'The name reflects the enormous size of the bet — 247 combinations from 8 selections, the largest standard named system bet.',
      },
      {
        q: 'How much does a £1 Goliath cost?',
        a: 'A £1 Goliath costs £247. Most bettors use much smaller unit stakes — e.g. £0.10 per bet = £24.70 total.',
      },
    ],
  },
];

export const BET_TYPE_MAP: Record<string, BetTypeConfig> = Object.fromEntries(
  BET_TYPES.map((b) => [b.slug, b])
);

export const DOUBLE_CONFIG = BET_TYPE_MAP['double'];

export const SIDEBAR_GROUPS: { label: string; slugs: string[] }[] = [
  {
    label: 'Basic Bets',
    slugs: ['double', 'single', 'treble', 'accumulator'],
  },
  {
    label: 'System Bets',
    slugs: ['trixie', 'patent', 'yankee', 'lucky-15', 'canadian', 'lucky-31'],
  },
  {
    label: 'Large Bets',
    slugs: ['heinz', 'lucky-63', 'super-heinz', 'goliath'],
  },
];

export function getBetSizeLabel(size: number): string {
  const labels: Record<number, string> = {
    1: 'Singles',
    2: 'Doubles',
    3: 'Trebles',
    4: 'Four-Folds',
    5: 'Five-Folds',
    6: 'Six-Folds',
    7: 'Seven-Folds',
    8: 'Eight-Folds',
  };
  return labels[size] ?? `${size}-Folds`;
}
