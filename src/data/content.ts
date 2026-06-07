export const CONTACT = {
  nom: 'Val Drôme Guêpes Frelons',
  responsable: 'Maxime CHAMPELEY',
  adresse: '27 Chemin de Sauvionne',
  codePostal: '26400',
  ville: 'SAOU',
  telephone: '06 25 11 54 44',
  telephoneHref: 'tel:+33625115444',
  email: 'contact@valdrome-guepes-frelons.fr',
  siret: '752 535 377 00028',
  certibiocide: '0315595',
} as const

export const STATS = [
  { valeur: '+400', label: 'nids traités' },
  { valeur: '24h', label: 'délai max' },
  { valeur: '60+', label: 'communes' },
] as const

export const LIENS_UTILES = [
  { label: 'Frelons asiatiques', to: '/frelons' },
  { label: 'Nids de Guêpes', to: '/guepes' },
  { label: 'Nids de Frelons', to: '/frelons' },
  { label: 'Destruction Fourmis', to: '/fourmis' },
  { label: "Zones d'intervention", to: '/interventions' },
  { label: 'Contacter un professionnel', to: '/contact' },
] as const
