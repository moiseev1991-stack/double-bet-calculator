import { BetTypeConfig } from '@/lib/betTypes';

const BASE_URL = 'https://double-bet-calculator.uk';

interface JsonLdProps {
  betType: BetTypeConfig;
  isHome?: boolean;
}

export default function JsonLd({ betType, isHome = false }: JsonLdProps) {
  const pageUrl = isHome ? BASE_URL : `${BASE_URL}/${betType.slug}`;

  const webPage = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: betType.name,
    description: betType.description,
    url: pageUrl,
    inLanguage: 'en-GB',
    publisher: {
      '@type': 'Organization',
      name: 'BetCalc UK',
      url: BASE_URL,
    },
  };

  const breadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: BASE_URL,
      },
      ...(isHome
        ? []
        : [
            {
              '@type': 'ListItem',
              position: 2,
              name: betType.name,
              item: pageUrl,
            },
          ]),
    ],
  };

  const faqPage = betType.faqs.length > 0
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: betType.faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.a,
          },
        })),
      }
    : null;

  const softwareApp = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: betType.name,
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'GBP',
    },
    description: betType.description,
    url: pageUrl,
  };

  const schemas = [webPage, breadcrumbs, softwareApp, ...(faqPage ? [faqPage] : [])];

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
