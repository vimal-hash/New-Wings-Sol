// SEO structured data (schema.org). Consumed by the JsonLD component.
// Note: the task mentioned importing PRODUCTS too, but none of the three
// schemas reference product data, so importing it would be an unused import
// under TypeScript-strict / eslint. We import only what's actually used.
import { CONTACT, FAQS } from '@/lib/data';

export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'New Wings Solutions',
  url: 'https://newwingssolutions.com',
  logo: 'https://newwingssolutions.com/icon-512.png',
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+91-9444546390',
    contactType: 'sales',
    areaServed: 'IN',
    availableLanguage: ['English', 'Tamil', 'Hindi'],
  },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Chennai',
    addressRegion: 'Tamil Nadu',
    addressCountry: 'IN',
  },
} satisfies Record<string, unknown>;

export const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'New Wings Solutions',
  description:
    'Cinema equipment dealer and theatre renovation company in Chennai',
  telephone: '+91-9444546390',
  email: CONTACT.email,
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Chennai',
    addressRegion: 'Tamil Nadu',
    addressCountry: 'IN',
  },
  priceRange: '₹₹₹',
  openingHours: 'Mo-Sa 09:00-18:00',
} satisfies Record<string, unknown>;

export const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map((faq) => ({
    '@type': 'Question',
    name: faq.q,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.a,
    },
  })),
} satisfies Record<string, unknown>;
