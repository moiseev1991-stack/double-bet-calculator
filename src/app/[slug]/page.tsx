import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Calculator from '@/components/Calculator';
import JsonLd from '@/components/JsonLd';
import { BET_TYPE_MAP, BET_TYPES } from '@/lib/betTypes';

const BASE_URL = 'https://betcalc.uk';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return BET_TYPES.filter((b) => b.slug !== 'double').map((b) => ({
    slug: b.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const betType = BET_TYPE_MAP[slug];
  if (!betType) return {};

  return {
    title: `${betType.name} | Free UK Betting Calculator`,
    description: betType.description,
    keywords: [
      `${betType.shortName.toLowerCase()} bet calculator`,
      `${betType.shortName.toLowerCase()} bet calculator UK`,
      `how to calculate a ${betType.shortName.toLowerCase()} bet`,
      `${betType.shortName.toLowerCase()} bet returns`,
      'UK betting calculator',
      'horse racing bet calculator',
    ],
    alternates: {
      canonical: `${BASE_URL}/${slug}`,
    },
    openGraph: {
      title: `${betType.name} | Free UK Betting Calculator`,
      description: betType.description,
      url: `${BASE_URL}/${slug}`,
      locale: 'en_GB',
      type: 'website',
    },
  };
}

export default async function SlugPage({ params }: Props) {
  const { slug } = await params;
  const betType = BET_TYPE_MAP[slug];
  if (!betType) notFound();

  return (
    <>
      <JsonLd betType={betType} />
      <Calculator slug={slug} />
    </>
  );
}
