import { CONTACT, COMMUNES_PRINCIPALES } from '../data/content'
import { SITE_URL, SITE_NAME, GEO, OPENING_HOURS, absoluteUrl } from '../data/site'

const BUSINESS_ID = `${SITE_URL}/#business`

export function localBusiness(opts: { areaServed?: string } = {}) {
  return {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'PestControl'],
    '@id': BUSINESS_ID,
    name: SITE_NAME,
    url: SITE_URL,
    image: absoluteUrl('/images/logo-144.png'),
    telephone: CONTACT.telephone,
    email: CONTACT.email,
    priceRange: '€€',
    address: {
      '@type': 'PostalAddress',
      streetAddress: CONTACT.adresse,
      postalCode: CONTACT.codePostal,
      addressLocality: CONTACT.ville,
      addressRegion: 'Drôme',
      addressCountry: 'FR',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: GEO.lat,
      longitude: GEO.lng,
    },
    openingHoursSpecification: OPENING_HOURS.map((h) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: h.days,
      opens: h.opens,
      closes: h.closes,
    })),
    areaServed: opts.areaServed
      ? [{ '@type': 'City', name: opts.areaServed }]
      : COMMUNES_PRINCIPALES.map((name) => ({ '@type': 'City', name })),
  }
}

export function service(name: string, description: string, path: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: name,
    name,
    description,
    url: absoluteUrl(path),
    areaServed: 'Drôme (26)',
    provider: { '@id': BUSINESS_ID },
  }
}

export function breadcrumb(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
}

export function faqPage(items: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    })),
  }
}
