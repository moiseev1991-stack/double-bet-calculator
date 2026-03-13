export type OddsFormat = 'fraction' | 'decimal' | 'american';

export function fractionalToDecimal(numerator: number, denominator: number): number {
  if (denominator === 0) return 1;
  return numerator / denominator + 1;
}

export function decimalToFractional(decimal: number): { numerator: number; denominator: number } {
  if (decimal <= 1) return { numerator: 0, denominator: 1 };
  const fraction = decimal - 1;
  // Find GCD to simplify
  const precision = 1000;
  const num = Math.round(fraction * precision);
  const den = precision;
  const gcd = findGcd(num, den);
  return { numerator: num / gcd, denominator: den / gcd };
}

export function americanToDecimal(american: number): number {
  if (american > 0) {
    return american / 100 + 1;
  } else {
    return 100 / Math.abs(american) + 1;
  }
}

export function decimalToAmerican(decimal: number): number {
  if (decimal >= 2) {
    return Math.round((decimal - 1) * 100);
  } else {
    return Math.round(-100 / (decimal - 1));
  }
}

export function parseOddsToDecimal(
  value: string,
  format: OddsFormat
): number | null {
  if (!value || value.trim() === '') return null;

  if (format === 'decimal') {
    const d = parseFloat(value);
    if (isNaN(d) || d < 1) return null;
    return d;
  }

  if (format === 'american') {
    const a = parseInt(value, 10);
    if (isNaN(a) || a === 0) return null;
    return americanToDecimal(a);
  }

  if (format === 'fraction') {
    // Supports "2/1", "11/4", "evs" etc.
    const lower = value.toLowerCase().trim();
    if (lower === 'evs' || lower === 'evens') return 2;
    const parts = value.split('/');
    if (parts.length === 2) {
      const num = parseFloat(parts[0].trim());
      const den = parseFloat(parts[1].trim());
      if (isNaN(num) || isNaN(den) || den === 0) return null;
      return fractionalToDecimal(num, den);
    }
    // Just a number interpreted as decimal
    const d = parseFloat(value);
    if (isNaN(d)) return null;
    return d;
  }

  return null;
}

export function parsePlaceTerms(value: string): number {
  // e.g. "1/5" → 0.2, "1/4" → 0.25
  const parts = value.split('/');
  if (parts.length === 2) {
    const num = parseFloat(parts[0]);
    const den = parseFloat(parts[1]);
    if (!isNaN(num) && !isNaN(den) && den !== 0) return num / den;
  }
  return 0.2; // default 1/5
}

function findGcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a;
}

export function formatDecimalAsOdds(decimal: number, format: OddsFormat): string {
  if (format === 'decimal') return decimal.toFixed(2);
  if (format === 'american') return decimalToAmerican(decimal).toString();
  if (format === 'fraction') {
    const { numerator, denominator } = decimalToFractional(decimal);
    return `${numerator}/${denominator}`;
  }
  return decimal.toFixed(2);
}
