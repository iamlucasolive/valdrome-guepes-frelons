export const SITE_URL = 'https://frelons-guepes-destruction.fr'
export const SITE_NAME = 'Val Drôme Guêpes Frelons'
export const DEFAULT_OG_IMAGE = '/og/default.png'

// Saou (26400) — coordonnées approximatives de la commune, à affiner si besoin
export const GEO = {
  lat: 44.6655,
  lng: 5.1533,
  region: 'FR-26',
  placename: 'Saou',
}

// Saison avril–novembre, du lundi au samedi
export const OPENING_HOURS = [
  { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], opens: '08:00', closes: '19:00' },
]

export function absoluteUrl(path: string): string {
  if (/^https?:\/\//.test(path)) return path
  return `${SITE_URL}/${path.replace(/^\/+/, '')}`
}
