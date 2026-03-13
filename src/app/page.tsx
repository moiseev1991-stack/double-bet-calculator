import type { Metadata } from 'next';
import Calculator from '@/components/Calculator';
import JsonLd from '@/components/JsonLd';
import { DOUBLE_CONFIG } from '@/lib/betTypes';

export const metadata: Metadata = {
  title: 'Double Bet Calculator | Free UK Betting Calculator',
  description:
    'Calculate double bet returns instantly. Supports fractional, decimal and American odds, each-way doubles, Rule 4 deductions and dead heat. Free UK betting calculator.',
  keywords: [
    'double bet calculator',
    'each way double calculator',
    'double bet returns UK',
    'how to calculate a double bet',
    'fractional odds double bet',
    'horse racing double bet',
  ],
  alternates: {
    canonical: 'https://betcalc.uk',
  },
  openGraph: {
    title: 'Double Bet Calculator | Free UK Betting Calculator',
    description:
      'Free online double bet calculator. Enter your odds and stake to calculate returns instantly.',
    url: 'https://betcalc.uk',
    locale: 'en_GB',
    type: 'website',
  },
};

export default function Home() {
  return (
    <>
      <JsonLd betType={DOUBLE_CONFIG} isHome />
      <Calculator slug="double" />
    </>
  );
}
