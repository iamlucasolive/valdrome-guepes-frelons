# Migration SSG + refonte SEO — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Passer le site d'une SPA à un rendu statique pré-généré (une page HTML complète par route, y compris les 60+ pages communes) et corriger les défauts SEO (canonical, Open Graph, JSON-LD, sitemap complet, thin content, mentions légales).

**Architecture :** `vite-react-ssg` pré-rend chaque route au build en lisant un tableau `routes` exporté depuis `App.tsx` ; la route dynamique `interventions/:slug` fournit `getStaticPaths()` à partir des données communes. Un composant `Seo` centralise `<head>` (title, description, canonical, OG, Twitter, JSON-LD) via le `<Head>` de la lib. Trois scripts Node (`sharp`) génèrent au build les images OG, les variantes WebP et le `sitemap.xml`. Le `dist/` se déploie tel quel sur le VPS nginx existant.

**Tech Stack :** Vite 8, React 19, react-router-dom 7, vite-react-ssg, react-helmet-async (via la lib), sharp, TypeScript 6, Tailwind 3.

**Spec :** `docs/superpowers/specs/2026-08-27-ssg-seo-migration-design.md`

## Global Constraints

- Domaine canonique : `https://frelons-guepes-destruction.fr` (verbatim, sans slash final sauf pour la home `/`).
- Email entreprise : `contact@frelons-guepes-destruction.fr` (remplace l'ancien `@valdrome-guepes-frelons.fr`).
- Nom entreprise (`SITE_NAME`) : `Val Drôme Guêpes Frelons`.
- Couleurs : `wasp-yellow #FFD600`, `wasp-black #1A1A1A`, `wasp-dark #2A2A2A`.
- Certibiocide : `0315595`. SIRET : `752 535 377 00028`. Responsable : `Maxime CHAMPELEY`, `27 Chemin de Sauvionne, 26400 SAOU`.
- Téléphone : `06 25 11 54 44` / `tel:+33625115444`.
- Hébergeur (mentions légales) : `Hostinger International Ltd., 61 Lordou Vironos Street, 6023 Larnaca, Chypre`.
- Pas de framework de test dans le projet — la vérification se fait par build + inspection du HTML généré + `npm run lint` + `npm run preview`. Chaque tâche se termine par un commit.
- Suivre les conventions existantes : composants fonctionnels, `export default` pour les pages/composants, imports `lucide-react`, classes Tailwind, textes en français avec entités (`&apos;`, `&mdash;`) là où le code existant le fait.
- Messages de commit en français, préfixe `feat:` / `fix:` / `chore:` / `refactor:` / `docs:`, terminés par la ligne :
  `Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>`

---

## Structure des fichiers

**Créés :**
- `src/data/site.ts` — constantes site (URL, nom, geo, horaires, image OG par défaut).
- `src/lib/jsonLd.ts` — builders schema.org (`localBusiness`, `service`, `breadcrumb`, `faqPage`).
- `src/components/Seo.tsx` — `<head>` centralisé.
- `src/components/Breadcrumb.tsx` — fil d'Ariane visible.
- `src/pages/LegalPage.tsx` — mentions légales.
- `src/components/NotFound.tsx` — écran 404 (extrait de `CommunePage`).
- `scripts/gen-og.mjs` — génère `public/og/*.png` + `public/apple-touch-icon.png`.
- `scripts/gen-webp.mjs` — génère les `.webp` à côté des photos/images.
- `scripts/gen-sitemap.mjs` — génère `public/sitemap.xml`.
- `public/manifest.json` — manifeste PWA.

**Modifiés :**
- `src/main.tsx` — entrée `ViteReactSSG`.
- `src/App.tsx` — export `routes` + `getStaticPaths`.
- `vite.config.ts` — `ssgOptions`.
- `package.json` — dépendance `vite-react-ssg` + scripts `dev`/`build`.
- `index.html` — meta statiques de fallback.
- `src/data/content.ts` — fix email.
- `src/data/communes.ts` — `COMMUNES` typé et enrichi.
- `src/pages/HomePage.tsx`, `GuepesPage.tsx`, `FrelonsPage.tsx`, `FourmisPage.tsx`, `InterventionsPage.tsx`, `ContactPage.tsx`, `CommunePage.tsx` — `<Helmet>` → `<Seo>`, ajout JSON-LD, breadcrumbs.
- `src/components/HeroSection.tsx`, `src/components/PhotoCarousel.tsx` — dimensions d'image + WebP + lazy.
- `src/components/Footer.tsx` — lien mentions légales.
- `src/components/FaqSection.tsx` — utilise `faqPage()` de `lib/jsonLd`.

---

## Task 1: Données site + fix email + helpers JSON-LD

**Files:**
- Create: `src/data/site.ts`
- Create: `src/lib/jsonLd.ts`
- Modify: `src/data/content.ts:9`

**Interfaces:**
- Consumes: `CONTACT` from `src/data/content.ts`, `COMMUNES_PRINCIPALES` from `src/data/content.ts`.
- Produces:
  - `src/data/site.ts` exports:
    - `SITE_URL: string` = `'https://frelons-guepes-destruction.fr'`
    - `SITE_NAME: string` = `'Val Drôme Guêpes Frelons'`
    - `DEFAULT_OG_IMAGE: string` = `'/og/default.png'`
    - `GEO: { lat: number; lng: number; region: string; placename: string }`
    - `OPENING_HOURS: { days: string[]; opens: string; closes: string }[]`
    - `absoluteUrl(path: string): string` — préfixe `SITE_URL`, garantit un seul slash de jointure.
  - `src/lib/jsonLd.ts` exports:
    - `localBusiness(opts?: { areaServed?: string }): object`
    - `service(name: string, description: string, path: string): object`
    - `breadcrumb(items: { name: string; path: string }[]): object`
    - `faqPage(items: { question: string; answer: string }[]): object`

- [ ] **Step 1: Créer `src/data/site.ts`**

```ts
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
```

- [ ] **Step 2: Corriger l'email dans `src/data/content.ts`**

Remplacer la ligne 9 :

```ts
  email: 'contact@frelons-guepes-destruction.fr',
```

- [ ] **Step 3: Créer `src/lib/jsonLd.ts`**

```ts
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
```

- [ ] **Step 4: Vérifier la compilation TypeScript**

Run: `npx tsc -b`
Expected: PASS (aucune erreur ; `content.ts` et `site.ts` compilent, `jsonLd.ts` résout ses imports).

- [ ] **Step 5: Commit**

```bash
git add src/data/site.ts src/lib/jsonLd.ts src/data/content.ts
git commit -m "$(printf 'feat: donnees site + builders JSON-LD + fix email canonique\n\nCo-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>')"
```

---

## Task 2: Composant `Seo` + composant `Breadcrumb`

**Files:**
- Create: `src/components/Seo.tsx`
- Create: `src/components/Breadcrumb.tsx`

**Interfaces:**
- Consumes: `SITE_URL`, `SITE_NAME`, `DEFAULT_OG_IMAGE`, `absoluteUrl` from `src/data/site.ts`; `Head` from `vite-react-ssg` (dépendance ajoutée en Task 6 — voir note).
- Produces:
  - `Seo` (default export) — props `{ title: string; description: string; path: string; image?: string; jsonLd?: object[]; noindex?: boolean }`
  - `Breadcrumb` (default export) — props `{ items: { name: string; path: string }[] }`

> **Note d'ordre :** cette tâche crée les composants mais ne les câble pas encore dans les pages. Elle importe `Head` depuis `vite-react-ssg`. Si `vite-react-ssg` n'est pas encore installé (Task 6), installer d'abord la dépendance seule :
> `npm install vite-react-ssg` — puis revenir à cette tâche. L'ordre recommandé est Task 6 avant Task 2 si l'exécuteur préfère ; les deux sont indépendantes fonctionnellement. **Décision : faire Task 6 en premier.** (Voir ordre d'exécution en fin de plan.)

- [ ] **Step 1: Créer `src/components/Seo.tsx`**

```tsx
import { Head } from 'vite-react-ssg'
import { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE, absoluteUrl } from '../data/site'

interface SeoProps {
  title: string
  description: string
  path: string
  image?: string
  jsonLd?: object[]
  noindex?: boolean
}

export default function Seo({ title, description, path, image, jsonLd = [], noindex = false }: SeoProps) {
  const canonical = absoluteUrl(path)
  const ogImage = absoluteUrl(image ?? DEFAULT_OG_IMAGE)

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      {noindex && <meta name="robots" content="noindex, follow" />}

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="fr_FR" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {jsonLd.map((obj, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(obj)}
        </script>
      ))}
    </Head>
  )
}
```

> Si `<script>` enfant de `<Head>` ne fonctionne pas avec la version installée de `vite-react-ssg` (Helmet accepte normalement `<script type="application/ld+json">{string}</script>`), fallback : rendre les scripts hors `<Head>` via un `<script dangerouslySetInnerHTML>` — mais tester d'abord la voie Helmet, elle est supportée.

- [ ] **Step 2: Créer `src/components/Breadcrumb.tsx`**

```tsx
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

interface BreadcrumbProps {
  items: { name: string; path: string }[]
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Fil d'Ariane" className="mx-auto max-w-7xl px-4 py-3">
      <ol className="flex flex-wrap items-center gap-1 font-poppins text-xs text-wasp-gray">
        {items.map((item, i) => {
          const isLast = i === items.length - 1
          return (
            <li key={item.path} className="flex items-center gap-1">
              {i > 0 && <ChevronRight className="h-3 w-3 shrink-0" aria-hidden="true" />}
              {isLast ? (
                <span aria-current="page" className="font-semibold text-wasp-black">
                  {item.name}
                </span>
              ) : (
                <Link to={item.path} className="hover:text-wasp-yellow transition-colors">
                  {item.name}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
```

- [ ] **Step 3: Vérifier la compilation**

Run: `npx tsc -b`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add src/components/Seo.tsx src/components/Breadcrumb.tsx
git commit -m "$(printf 'feat: composants Seo (head centralise) et Breadcrumb\n\nCo-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>')"
```

---

## Task 3: Refonte des données communes (typage + enrichissement)

**Files:**
- Modify: `src/data/communes.ts` (réécriture complète)
- Modify: `src/data/content.ts:25-28` (garder `COMMUNES_PRINCIPALES` mais s'assurer qu'il reste `string[]` et cohérent)

**Interfaces:**
- Consumes: rien.
- Produces:
  - `src/data/communes.ts` exports:
    - `interface Commune { nom: string; secteur: string; cp: string; limitrophes: string[]; distanceMin: number }`
    - `COMMUNES: Commune[]` — liste dédoublonnée (~55–60 entrées uniques)
    - `COMMUNES_PRINCIPALES: string[]` — inchangé (noms présents dans `COMMUNES`)

- [ ] **Step 1: Réécrire `src/data/communes.ts`**

Dédoublonner la liste actuelle (`Grâne`/`Grane`, `Puy Saint-Martin`/`Puy-Saint-Martin`, `Saou` en double). Assigner à chaque commune un `secteur` (`'Crestois'`, `'Vallée de la Drôme'`, `'Pays de Dieulefit'`, `'Val de Drôme'`, `'Diois'`, `'Baronnies'`, `'Tricastin'`, `'Plaine de Valence'`, `'Enclave des Papes'` selon la géographie réelle), 3–4 `limitrophes` **choisies parmi les noms de la liste**, et un `distanceMin` (temps route approx. depuis Saou : 0 pour Saou, ~10–15 pour le Crestois proche, ~25–35 pour Montélimar/Nyons, ~40–50 pour Die/Valréas/Buis-les-Baronnies).

```ts
export interface Commune {
  nom: string
  secteur: string
  cp: string
  limitrophes: string[]
  distanceMin: number
}

export const COMMUNES: Commune[] = [
  { nom: 'Saou', secteur: 'Vallée de la Drôme', cp: '26400', limitrophes: ['Soyans', 'Francillon-sur-Roubion', 'Bourdeaux', 'Aouste-sur-Sye'], distanceMin: 0 },
  { nom: 'Crest', secteur: 'Crestois', cp: '26400', limitrophes: ['Aouste-sur-Sye', 'Saillans', 'Grâne', 'Eurre'], distanceMin: 12 },
  { nom: 'Aouste-sur-Sye', secteur: 'Crestois', cp: '26400', limitrophes: ['Crest', 'Saou', 'Mirabel-et-Blacons', 'Piégros-la-Clastre'], distanceMin: 12 },
  { nom: 'Mirabel-et-Blacons', secteur: 'Crestois', cp: '26400', limitrophes: ['Aouste-sur-Sye', 'Saillans', 'Crest'], distanceMin: 15 },
  { nom: 'Eurre', secteur: 'Crestois', cp: '26400', limitrophes: ['Crest', 'Allex', 'Grâne', 'Montoison'], distanceMin: 15 },
  { nom: 'Upie', secteur: 'Plaine de Valence', cp: '26120', limitrophes: ['Montoison', 'Montmeyran', 'Ourches', 'Chabeuil'], distanceMin: 22 },
  { nom: 'Montoison', secteur: 'Plaine de Valence', cp: '26800', limitrophes: ['Eurre', 'Allex', 'Upie', 'Montmeyran'], distanceMin: 20 },
  { nom: 'La Baume-Cornillane', secteur: 'Plaine de Valence', cp: '26120', limitrophes: ['Montmeyran', 'Montéléger', 'Beaumont-lès-Valence'], distanceMin: 25 },
  { nom: 'Montvendre', secteur: 'Plaine de Valence', cp: '26120', limitrophes: ['Chabeuil', 'Montéléger', 'Upie'], distanceMin: 25 },
  { nom: 'Montmeyran', secteur: 'Plaine de Valence', cp: '26120', limitrophes: ['Montoison', 'Upie', 'La Baume-Cornillane', 'Montéléger'], distanceMin: 22 },
  { nom: 'Montéléger', secteur: 'Plaine de Valence', cp: '26760', limitrophes: ['Montmeyran', 'Montvendre', 'La Baume-Cornillane'], distanceMin: 27 },
  { nom: 'Chabeuil', secteur: 'Plaine de Valence', cp: '26120', limitrophes: ['Montvendre', 'Upie', 'Malissard'], distanceMin: 27 },
  { nom: 'Livron-sur-Drôme', secteur: 'Val de Drôme', cp: '26250', limitrophes: ['Loriol-sur-Drôme', 'Allex', 'Grâne'], distanceMin: 20 },
  { nom: 'Loriol-sur-Drôme', secteur: 'Val de Drôme', cp: '26270', limitrophes: ['Livron-sur-Drôme', 'Saulce-sur-Rhône', 'Cliousclat'], distanceMin: 22 },
  { nom: 'Allex', secteur: 'Val de Drôme', cp: '26400', limitrophes: ['Eurre', 'Montoison', 'Livron-sur-Drôme', 'Grâne'], distanceMin: 17 },
  { nom: 'Grâne', secteur: 'Val de Drôme', cp: '26400', limitrophes: ['Crest', 'Allex', 'Eurre', 'La Roche-sur-Grâne'], distanceMin: 15 },
  { nom: 'Saulce-sur-Rhône', secteur: 'Val de Drôme', cp: '26270', limitrophes: ['Loriol-sur-Drôme', 'Les Tourettes', 'Mirmande'], distanceMin: 25 },
  { nom: 'Les Tourettes', secteur: 'Val de Drôme', cp: '26740', limitrophes: ['Saulce-sur-Rhône', 'Sauzet', 'La Coucourde'], distanceMin: 28 },
  { nom: 'Sauzet', secteur: 'Val de Drôme', cp: '26740', limitrophes: ['Les Tourettes', 'Montélimar', 'Savasse'], distanceMin: 30 },
  { nom: 'La Bâtie-Rolland', secteur: 'Pays de Dieulefit', cp: '26160', limitrophes: ['Espeluche', 'La Bégude-de-Mazenc', 'Portes-en-Valdaine'], distanceMin: 28 },
  { nom: 'Espeluche', secteur: 'Pays de Dieulefit', cp: '26780', limitrophes: ['La Bâtie-Rolland', 'Montélimar', 'Malataverne'], distanceMin: 30 },
  { nom: 'Portes-en-Valdaine', secteur: 'Pays de Dieulefit', cp: '26160', limitrophes: ['La Bâtie-Rolland', 'La Bégude-de-Mazenc', 'Montboucher-sur-Jabron'], distanceMin: 30 },
  { nom: 'La Bégude-de-Mazenc', secteur: 'Pays de Dieulefit', cp: '26160', limitrophes: ['La Bâtie-Rolland', 'Portes-en-Valdaine', 'Charols', 'Sallettes'], distanceMin: 25 },
  { nom: 'Sallettes', secteur: 'Pays de Dieulefit', cp: '26160', limitrophes: ['La Bégude-de-Mazenc', 'Charols', 'Dieulefit'], distanceMin: 25 },
  { nom: 'Saint-Gervais-sur-Roubion', secteur: 'Pays de Dieulefit', cp: '26160', limitrophes: ['Bonlieu-sur-Roubion', 'La Bégude-de-Mazenc', 'Charols'], distanceMin: 25 },
  { nom: 'Bonlieu-sur-Roubion', secteur: 'Pays de Dieulefit', cp: '26160', limitrophes: ['Saint-Gervais-sur-Roubion', 'Cléon-d\'Andran', 'Charols'], distanceMin: 25 },
  { nom: 'Charols', secteur: 'Pays de Dieulefit', cp: '26450', limitrophes: ['La Bégude-de-Mazenc', 'Sallettes', 'Cléon-d\'Andran', 'Pont-de-Barret'], distanceMin: 23 },
  { nom: 'Cléon-d\'Andran', secteur: 'Pays de Dieulefit', cp: '26450', limitrophes: ['Charols', 'Bonlieu-sur-Roubion', 'La Laupie', 'Marsanne'], distanceMin: 22 },
  { nom: 'Marsanne', secteur: 'Val de Drôme', cp: '26740', limitrophes: ['La Laupie', 'Cléon-d\'Andran', 'Sauzet', 'Condillac'], distanceMin: 25 },
  { nom: 'Puy-Saint-Martin', secteur: 'Pays de Dieulefit', cp: '26450', limitrophes: ['Charols', 'Pont-de-Barret', 'La Répara-Auriples'], distanceMin: 20 },
  { nom: 'La Répara-Auriples', secteur: 'Crestois', cp: '26400', limitrophes: ['Puy-Saint-Martin', 'Autichamp', 'Soyans'], distanceMin: 15 },
  { nom: 'Pont-de-Barret', secteur: 'Pays de Dieulefit', cp: '26160', limitrophes: ['Charols', 'Puy-Saint-Martin', 'Poët-Célard', 'Manas'], distanceMin: 18 },
  { nom: 'Poët-Célard', secteur: 'Pays de Dieulefit', cp: '26460', limitrophes: ['Bourdeaux', 'Pont-de-Barret', 'Crupies'], distanceMin: 15 },
  { nom: 'Bourdeaux', secteur: 'Pays de Dieulefit', cp: '26460', limitrophes: ['Saou', 'Poët-Célard', 'Bouvières', 'Truinas'], distanceMin: 12 },
  { nom: 'Truinas', secteur: 'Pays de Dieulefit', cp: '26460', limitrophes: ['Bourdeaux', 'Le Poët-Laval', 'Comps'], distanceMin: 18 },
  { nom: 'Comps', secteur: 'Pays de Dieulefit', cp: '26220', limitrophes: ['Truinas', 'Bézaudun-sur-Bîne', 'Bourdeaux'], distanceMin: 20 },
  { nom: 'Bouvières', secteur: 'Pays de Dieulefit', cp: '26460', limitrophes: ['Bourdeaux', 'Bézaudun-sur-Bîne', 'Pradelle'], distanceMin: 22 },
  { nom: 'Le Poët-Laval', secteur: 'Pays de Dieulefit', cp: '26160', limitrophes: ['Dieulefit', 'Truinas', 'Montjoux'], distanceMin: 22 },
  { nom: 'Montjoux', secteur: 'Pays de Dieulefit', cp: '26220', limitrophes: ['Le Poët-Laval', 'Dieulefit', 'La Roche-Saint-Secret-Béconne'], distanceMin: 25 },
  { nom: 'La Roche-Saint-Secret-Béconne', secteur: 'Pays de Dieulefit', cp: '26770', limitrophes: ['Montjoux', 'Taulignan', 'Salles-sous-Bois'], distanceMin: 28 },
  { nom: 'Taulignan', secteur: 'Pays de Dieulefit', cp: '26770', limitrophes: ['La Roche-Saint-Secret-Béconne', 'Montbrison-sur-Lez', 'Grignan'], distanceMin: 32 },
  { nom: 'Dieulefit', secteur: 'Pays de Dieulefit', cp: '26220', limitrophes: ['Le Poët-Laval', 'Montjoux', 'Comps', 'Vesc'], distanceMin: 22 },
  { nom: 'Valréas', secteur: 'Enclave des Papes', cp: '84600', limitrophes: ['Grillon', 'Visan', 'Taulignan'], distanceMin: 42 },
  { nom: 'Grignan', secteur: 'Pays de Dieulefit', cp: '26230', limitrophes: ['Taulignan', 'Chamaret', 'Montségur-sur-Lauzon'], distanceMin: 35 },
  { nom: 'Nyons', secteur: 'Baronnies', cp: '26110', limitrophes: ['Aubres', 'Mirabel-aux-Baronnies', 'Venterol'], distanceMin: 40 },
  { nom: 'La Roche-sur-Grâne', secteur: 'Val de Drôme', cp: '26400', limitrophes: ['Grâne', 'Autichamp', 'Roynac'], distanceMin: 18 },
  { nom: 'Autichamp', secteur: 'Crestois', cp: '26400', limitrophes: ['La Roche-sur-Grâne', 'Chabrillan', 'La Répara-Auriples'], distanceMin: 15 },
  { nom: 'Chabrillan', secteur: 'Crestois', cp: '26400', limitrophes: ['Crest', 'Grâne', 'Autichamp', 'Roynac'], distanceMin: 15 },
  { nom: 'Condillac', secteur: 'Val de Drôme', cp: '26740', limitrophes: ['Marsanne', 'La Coucourde', 'Savasse'], distanceMin: 28 },
  { nom: 'La Laupie', secteur: 'Val de Drôme', cp: '26740', limitrophes: ['Marsanne', 'Cléon-d\'Andran', 'Bonlieu-sur-Roubion'], distanceMin: 22 },
  { nom: 'Montclar-sur-Gervanne', secteur: 'Crestois', cp: '26400', limitrophes: ['Beaufort-sur-Gervanne', 'Gigors-et-Lozeron', 'Suze'], distanceMin: 22 },
  { nom: 'Beaufort-sur-Gervanne', secteur: 'Crestois', cp: '26400', limitrophes: ['Montclar-sur-Gervanne', 'Plan-de-Baix', 'Suze'], distanceMin: 25 },
  { nom: 'Plan-de-Baix', secteur: 'Crestois', cp: '26400', limitrophes: ['Beaufort-sur-Gervanne', 'Omblèze', 'Gigors-et-Lozeron'], distanceMin: 30 },
  { nom: 'Omblèze', secteur: 'Crestois', cp: '26400', limitrophes: ['Plan-de-Baix', 'Léoncel', 'Bouvante'], distanceMin: 40 },
  { nom: 'La Chaudière', secteur: 'Diois', cp: '26340', limitrophes: ['Bourdeaux', 'Pradelle', 'Saint-Nazaire-le-Désert'], distanceMin: 30 },
  { nom: 'Saillans', secteur: 'Diois', cp: '26340', limitrophes: ['Mirabel-et-Blacons', 'Vercheny', 'Espenel'], distanceMin: 25 },
  { nom: 'Die', secteur: 'Diois', cp: '26150', limitrophes: ['Aouste', 'Chamaloc', 'Ponet-et-Saint-Auban'], distanceMin: 45 },
  { nom: 'Bourg-lès-Valence', secteur: 'Plaine de Valence', cp: '26500', limitrophes: ['Valence', 'Saint-Marcel-lès-Valence', 'Châteauneuf-sur-Isère'], distanceMin: 35 },
  { nom: 'Valence', secteur: 'Plaine de Valence', cp: '26000', limitrophes: ['Bourg-lès-Valence', 'Portes-lès-Valence', 'Malissard'], distanceMin: 32 },
  { nom: 'Montélimar', secteur: 'Val de Drôme', cp: '26200', limitrophes: ['Sauzet', 'Espeluche', 'Savasse', 'Montboucher-sur-Jabron'], distanceMin: 32 },
  { nom: 'Rémuzat', secteur: 'Baronnies', cp: '26510', limitrophes: ['Saint-May', 'Cornillac', 'Verclause'], distanceMin: 55 },
  { nom: 'Buis-les-Baronnies', secteur: 'Baronnies', cp: '26170', limitrophes: ['Mollans-sur-Ouvèze', 'La Roche-sur-le-Buis', 'Bénivay-Ollon'], distanceMin: 55 },
]

export const COMMUNES_PRINCIPALES: string[] = [
  'Crest', 'Nyons', 'Valréas', 'Loriol-sur-Drôme', 'Livron-sur-Drôme',
  'Montélimar', 'Dieulefit', 'Saillans', 'Die', 'Marsanne',
]
```

> L'exécuteur peut ajuster secteurs/limitrophes/distances si une erreur géographique manifeste est repérée, mais **chaque nom cité dans `limitrophes` DOIT exister comme `nom` dans `COMMUNES`** (vérifié en Step 3). Corriger toute limitrophe absente en la remplaçant par une commune voisine présente dans la liste.

- [ ] **Step 2: Mettre à jour `src/data/content.ts`**

Remplacer `COMMUNES_PRINCIPALES` (lignes 25-28) pour refléter les noms complets utilisés dans `communes.ts` (`Loriol-sur-Drôme`, `Livron-sur-Drôme`) OU supprimer la duplication et ré-exporter depuis `communes.ts` :

```ts
// dans content.ts, remplacer le bloc COMMUNES_PRINCIPALES par :
export { COMMUNES_PRINCIPALES } from './communes'
```

Vérifier que `HomePage.tsx` (import ligne 9) et `jsonLd.ts` continuent de résoudre `COMMUNES_PRINCIPALES` depuis `content.ts` — l'export ré-exporté le permet.

- [ ] **Step 3: Écrire un script de validation d'intégrité et l'exécuter**

Créer un fichier temporaire `scripts/check-communes.mjs` :

```js
import { COMMUNES } from '../src/data/communes.ts'

const noms = new Set(COMMUNES.map((c) => c.nom))
let errors = 0

// unicité
const seen = new Set()
for (const c of COMMUNES) {
  if (seen.has(c.nom)) { console.error(`Doublon: ${c.nom}`); errors++ }
  seen.add(c.nom)
}

// limitrophes existent
for (const c of COMMUNES) {
  for (const l of c.limitrophes) {
    if (!noms.has(l)) { console.error(`${c.nom}: limitrophe inconnue "${l}"`); errors++ }
  }
}

// champs remplis
for (const c of COMMUNES) {
  if (!c.secteur || !c.cp || c.limitrophes.length < 3) {
    console.error(`${c.nom}: champ manquant ou < 3 limitrophes`); errors++
  }
}

console.log(errors === 0 ? `OK — ${COMMUNES.length} communes` : `${errors} erreur(s)`)
process.exit(errors === 0 ? 0 : 1)
```

Run: `node --experimental-strip-types scripts/check-communes.mjs` (Node 22+ supporte `--experimental-strip-types` ; si indisponible, `npx tsx scripts/check-communes.mjs`)
Expected: `OK — N communes`, exit 0. Corriger toute erreur signalée dans `communes.ts` puis relancer.

- [ ] **Step 4: Supprimer le script de validation temporaire**

```bash
rm scripts/check-communes.mjs
```

- [ ] **Step 5: Vérifier la compilation**

Run: `npx tsc -b`
Expected: PASS. Note : `CommunePage.tsx` va casser (`toSlug(c)` → `c` est maintenant un objet). C'est corrigé en Task 8 ; pour cette tâche, `tsc` PEUT signaler cette erreur — c'est attendu. Documenter : « erreur `toSlug(Commune)` dans CommunePage attendue, corrigée Task 8 ».

Alternative pour garder le build vert : appliquer le patch minimal de `CommunePage.tsx` maintenant (`COMMUNES.find((c) => toSlug(c.nom) === slug)`, `areaServed: commune.nom`, `{commune}` → `{commune.nom}` partout). **Recommandé** pour ne pas laisser le repo cassé entre deux commits.

- [ ] **Step 6: Commit**

```bash
git add src/data/communes.ts src/data/content.ts src/pages/CommunePage.tsx
git commit -m "$(printf 'feat: communes typees et enrichies (secteur, limitrophes, distance)\n\nCo-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>')"
```

---

## Task 4: Scripts de génération d'assets (OG, WebP, apple-touch-icon)

**Files:**
- Create: `scripts/gen-og.mjs`
- Create: `scripts/gen-webp.mjs`
- Create: `public/manifest.json`

**Interfaces:**
- Consumes: `sharp` (déjà en devDependencies), `public/images/logo-144.png`, `public/photos/*.jpg`, `public/images/destruction-guepes-frelons-drome.png`.
- Produces (au runtime des scripts) : `public/og/default.png`, `public/og/guepes.png`, `public/og/frelons.png`, `public/og/fourmis.png` (1200×630), `public/apple-touch-icon.png` (180×180), `public/photos/*.webp`, `public/images/*.webp`.

- [ ] **Step 1: Créer `scripts/gen-og.mjs`**

```js
import sharp from 'sharp'
import { mkdir } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = join(root, 'public', 'og')
await mkdir(outDir, { recursive: true })

const W = 1200
const H = 630
const BG = '#1A1A1A'
const YELLOW = '#FFD600'
const logo = join(root, 'public', 'images', 'logo-144.png')

const PAGES = [
  { file: 'default.png', title: 'Destruction de Guêpes & Frelons', sub: 'dans la Drôme' },
  { file: 'guepes.png', title: 'Destruction de nids de Guêpes', sub: 'Drôme — Certibiocide' },
  { file: 'frelons.png', title: 'Destruction de nids de Frelons', sub: 'européens & asiatiques — Drôme' },
  { file: 'fourmis.png', title: 'Destruction de Fourmilières', sub: 'Drôme — traitement raisonné' },
]

const logoBuf = await sharp(logo).resize(180, 180, { fit: 'contain', background: BG }).png().toBuffer()

for (const p of PAGES) {
  const svg = `
    <svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${W}" height="${H}" fill="${BG}"/>
      <rect x="0" y="0" width="${W}" height="10" fill="${YELLOW}"/>
      <rect x="0" y="${H - 10}" width="${W}" height="10" fill="${YELLOW}"/>
      <text x="90" y="330" font-family="Arial, sans-serif" font-size="66" font-weight="900" fill="#FFFFFF">${escapeXml(p.title)}</text>
      <text x="90" y="410" font-family="Arial, sans-serif" font-size="40" font-weight="700" fill="${YELLOW}">${escapeXml(p.sub)}</text>
      <text x="90" y="540" font-family="Arial, sans-serif" font-size="30" fill="#CCCCCC">Val Drôme Guêpes Frelons — 06 25 11 54 44</text>
    </svg>`
  await sharp(Buffer.from(svg))
    .composite([{ input: logoBuf, top: 60, left: W - 240 }])
    .png()
    .toFile(join(outDir, p.file))
  console.log('og:', p.file)
}

// apple-touch-icon
await sharp(logo)
  .resize(160, 160, { fit: 'contain', background: BG })
  .extend({ top: 10, bottom: 10, left: 10, right: 10, background: BG })
  .png()
  .toFile(join(root, 'public', 'apple-touch-icon.png'))
console.log('apple-touch-icon.png')

function escapeXml(s) {
  return s.replace(/[<>&'"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[c]))
}
```

- [ ] **Step 2: Exécuter et vérifier**

Run: `node scripts/gen-og.mjs`
Expected: crée `public/og/default.png`, `guepes.png`, `frelons.png`, `fourmis.png`, `public/apple-touch-icon.png`. Vérifier : `node -e "require('sharp')('public/og/default.png').metadata().then(m=>console.log(m.width,m.height))"` → `1200 630`.

- [ ] **Step 3: Créer `scripts/gen-webp.mjs`**

```js
import sharp from 'sharp'
import { readdir } from 'node:fs/promises'
import { join, dirname, extname, basename } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const DIRS = [join(root, 'public', 'photos'), join(root, 'public', 'images')]
const SKIP = /^(logo-|apple-touch-icon)/

for (const dir of DIRS) {
  let files
  try { files = await readdir(dir) } catch { continue }
  for (const f of files) {
    const ext = extname(f).toLowerCase()
    if (!['.jpg', '.jpeg', '.png'].includes(ext)) continue
    if (SKIP.test(f)) continue
    const out = join(dir, basename(f, ext) + '.webp')
    await sharp(join(dir, f)).webp({ quality: 78 }).toFile(out)
    console.log('webp:', out.replace(root, ''))
  }
}
```

- [ ] **Step 4: Exécuter et vérifier**

Run: `node scripts/gen-webp.mjs`
Expected: un `.webp` à côté de chaque `public/photos/*.jpg` et de `public/images/destruction-guepes-frelons-drome.png` (pas pour `logo-*`).

- [ ] **Step 5: Créer `public/manifest.json`**

```json
{
  "name": "Val Drôme Guêpes Frelons",
  "short_name": "Val Drôme G&F",
  "description": "Destruction de nids de guêpes, frelons et fourmis dans la Drôme.",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#1A1A1A",
  "theme_color": "#FFD600",
  "icons": [
    { "src": "/images/logo-48.png", "sizes": "48x48", "type": "image/png" },
    { "src": "/images/logo-96.png", "sizes": "96x96", "type": "image/png" },
    { "src": "/images/logo-144.png", "sizes": "144x144", "type": "image/png" }
  ]
}
```

- [ ] **Step 6: Décider du suivi Git des assets générés**

Les assets générés (`public/og/*`, `public/apple-touch-icon.png`, `public/**/*.webp`) sont **commités** (pas de `.gitignore`) : ils sont régénérés au build CI mais les committer permet le `preview` local et évite un `dist/` incomplet si un script échoue. Ajouter au commit.

- [ ] **Step 7: Commit**

```bash
git add scripts/gen-og.mjs scripts/gen-webp.mjs public/manifest.json public/og public/apple-touch-icon.png public/photos public/images
git commit -m "$(printf 'feat: scripts generation OG/WebP/apple-touch-icon + manifest PWA\n\nCo-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>')"
```

---

## Task 5: Script de génération du sitemap

**Files:**
- Create: `scripts/gen-sitemap.mjs`
- Modify: `public/sitemap.xml` (sera écrasé par le script — le committer régénéré)

**Interfaces:**
- Consumes: `COMMUNES` from `src/data/communes.ts`, `toSlug` from `src/utils/communeSlug.ts`.
- Produces: `public/sitemap.xml` avec toutes les URLs.

- [ ] **Step 1: Créer `scripts/gen-sitemap.mjs`**

```js
import { writeFile } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

// import du TS via strip-types (Node 22+) ou tsx en fallback
const { COMMUNES } = await import('../src/data/communes.ts')
const { toSlug } = await import('../src/utils/communeSlug.ts')

const SITE = 'https://frelons-guepes-destruction.fr'
const lastmod = new Date().toISOString().slice(0, 10)

const fixed = [
  { path: '/', priority: '1.0', changefreq: 'monthly' },
  { path: '/guepes', priority: '0.8', changefreq: 'monthly' },
  { path: '/frelons', priority: '0.8', changefreq: 'monthly' },
  { path: '/fourmis', priority: '0.8', changefreq: 'monthly' },
  { path: '/interventions', priority: '0.7', changefreq: 'monthly' },
  { path: '/contact', priority: '0.6', changefreq: 'monthly' },
  { path: '/mentions-legales', priority: '0.3', changefreq: 'yearly' },
]

const communes = COMMUNES.map((c) => ({
  path: `/interventions/${toSlug(c.nom)}`,
  priority: '0.6',
  changefreq: 'monthly',
}))

const urls = [...fixed, ...communes]
  .map(
    (u) =>
      `  <url><loc>${SITE}${u.path}</loc><lastmod>${lastmod}</lastmod><changefreq>${u.changefreq}</changefreq><priority>${u.priority}</priority></url>`,
  )
  .join('\n')

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`

await writeFile(join(root, 'public', 'sitemap.xml'), xml, 'utf8')
console.log(`sitemap.xml — ${urls.split('\n').length} URLs`)
```

> Si `await import('../src/data/communes.ts')` échoue (Node sans strip-types), exécuter le script via `npx tsx scripts/gen-sitemap.mjs`. Le script `build` utilisera la même commande — voir Task 6.

- [ ] **Step 2: Exécuter et vérifier**

Run: `npx tsx scripts/gen-sitemap.mjs` (ou `node scripts/gen-sitemap.mjs` si strip-types dispo)
Expected: `public/sitemap.xml` régénéré, contient `<loc>https://frelons-guepes-destruction.fr/interventions/crest</loc>` et une ligne par commune + les 7 fixes. Compter les `<url>` = `7 + COMMUNES.length`.

- [ ] **Step 3: Vérifier `robots.txt` (aucune modif attendue)**

Lire `public/robots.txt` — doit déjà contenir `Sitemap: https://frelons-guepes-destruction.fr/sitemap.xml` et `Allow: /`. Ne rien changer.

- [ ] **Step 4: Commit**

```bash
git add scripts/gen-sitemap.mjs public/sitemap.xml
git commit -m "$(printf 'feat: sitemap complet genere au build (60+ communes)\n\nCo-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>')"
```

---

## Task 6: Migration vers vite-react-ssg (build & entrée)

**Files:**
- Modify: `package.json` (dépendance + scripts)
- Modify: `src/main.tsx` (réécriture)
- Modify: `src/App.tsx` (réécriture — export `routes`)
- Modify: `vite.config.ts` (`ssgOptions`)
- Modify: `index.html` (script d'entrée + meta fallback)

**Interfaces:**
- Consumes: toutes les pages (`HomePage`, `GuepesPage`, `FrelonsPage`, `FourmisPage`, `InterventionsPage`, `ContactPage`, `CommunePage`), `LegalPage` (créé Task 7 — voir note), `Layout`, `COMMUNES` + `toSlug`.
- Produces:
  - `src/App.tsx` exports : `routes: RouteRecord[]` (named export, plus de `default`).
  - `src/main.tsx` exports : `createRoot` (from `ViteReactSSG`).

> **Note d'ordre :** `LegalPage` (Task 7) est référencée dans `routes`. Faire Task 7 avant Task 6, OU ajouter la route `mentions-legales` en Task 7 et laisser Task 6 sans elle. **Décision : Task 7 avant Task 6.** (Voir ordre d'exécution.)

- [ ] **Step 1: Installer la dépendance**

Run: `npm install vite-react-ssg`
Expected: ajoutée à `dependencies` dans `package.json`.

- [ ] **Step 2: Réécrire `src/App.tsx`**

```tsx
import type { RouteRecord } from 'vite-react-ssg'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import GuepesPage from './pages/GuepesPage'
import FrelonsPage from './pages/FrelonsPage'
import FourmisPage from './pages/FourmisPage'
import InterventionsPage from './pages/InterventionsPage'
import ContactPage from './pages/ContactPage'
import CommunePage from './pages/CommunePage'
import LegalPage from './pages/LegalPage'
import { COMMUNES } from './data/communes'
import { toSlug } from './utils/communeSlug'

export const routes: RouteRecord[] = [
  {
    path: '/',
    element: <Layout />,
    entry: 'src/components/Layout.tsx',
    children: [
      { index: true, element: <HomePage />, entry: 'src/pages/HomePage.tsx' },
      { path: 'guepes', element: <GuepesPage />, entry: 'src/pages/GuepesPage.tsx' },
      { path: 'frelons', element: <FrelonsPage />, entry: 'src/pages/FrelonsPage.tsx' },
      { path: 'fourmis', element: <FourmisPage />, entry: 'src/pages/FourmisPage.tsx' },
      { path: 'interventions', element: <InterventionsPage />, entry: 'src/pages/InterventionsPage.tsx' },
      {
        path: 'interventions/:slug',
        element: <CommunePage />,
        entry: 'src/pages/CommunePage.tsx',
        getStaticPaths: () => COMMUNES.map((c) => `interventions/${toSlug(c.nom)}`),
      },
      { path: 'contact', element: <ContactPage />, entry: 'src/pages/ContactPage.tsx' },
      { path: 'mentions-legales', element: <LegalPage />, entry: 'src/pages/LegalPage.tsx' },
    ],
  },
]
```

- [ ] **Step 3: Réécrire `src/main.tsx`**

```tsx
import { ViteReactSSG } from 'vite-react-ssg'
import { routes } from './App'
import './index.css'

export const createRoot = ViteReactSSG({ routes })
```

> `HelmetProvider` n'est plus nécessaire : `vite-react-ssg` fournit son propre contexte `<Head>`. Retirer l'import `react-helmet-async` de `main.tsx`.

- [ ] **Step 4: Mettre à jour `vite.config.ts`**

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  ssgOptions: {
    dirStyle: 'nested',
    formatting: 'minify',
    concurrency: 10,
  },
})
```

> Si TypeScript se plaint que `ssgOptions` n'existe pas sur `UserConfig`, ajouter en tête : `/// <reference types="vite-react-ssg" />` ou caster `defineConfig({...} as any)` — préférer la triple-slash reference.

- [ ] **Step 5: Mettre à jour `index.html`**

```html
<!doctype html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/x-icon" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Destruction de Guêpes & Frelons dans la Drôme</title>
    <meta
      name="description"
      content="Destruction de nids de guêpes, frelons et frelons asiatiques dans la Drôme. Professionnel certifié Certibiocide. Intervention rapide sous 24h sur 60+ communes."
    />
    <link rel="canonical" href="https://frelons-guepes-destruction.fr/" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Val Drôme Guêpes Frelons" />
    <meta property="og:locale" content="fr_FR" />
    <meta property="og:title" content="Destruction de Guêpes & Frelons dans la Drôme" />
    <meta
      property="og:description"
      content="Professionnel certifié Certibiocide. Intervention rapide sous 24h dans la Drôme."
    />
    <meta property="og:url" content="https://frelons-guepes-destruction.fr/" />
    <meta property="og:image" content="https://frelons-guepes-destruction.fr/og/default.png" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="theme-color" content="#FFD600" />
    <meta name="geo.region" content="FR-26" />
    <meta name="geo.placename" content="Saou" />
    <link rel="manifest" href="/manifest.json" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 6: Mettre à jour les scripts `package.json`**

```json
  "scripts": {
    "dev": "vite-react-ssg dev",
    "build": "node scripts/gen-og.mjs && npx tsx scripts/gen-webp.mjs && npx tsx scripts/gen-sitemap.mjs && tsc -b && vite-react-ssg build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
```

> `gen-webp.mjs` n'importe pas de `.ts` → `node` suffit ; mais harmoniser avec `npx tsx` évite les surprises de version Node en CI. Si `tsx` n'est pas voulu comme dépendance de build, l'ajouter : `npm install -D tsx`. **Décision : ajouter `tsx` en devDependency** (Step 7).

- [ ] **Step 7: Ajouter `tsx` en devDependency**

Run: `npm install -D tsx`

- [ ] **Step 8: Build**

Run: `npm run build`
Expected: build réussi. `dist/` contient : `index.html`, `guepes/index.html`, `frelons/index.html`, `fourmis/index.html`, `interventions/index.html`, `contact/index.html`, `mentions-legales/index.html`, et `interventions/<slug>/index.html` pour chaque commune.

Vérifier le nombre de pages communes :
```bash
ls dist/interventions | grep -v 'index.html' | wc -l
```
Expected: = `COMMUNES.length`.

- [ ] **Step 9: Vérifier le contenu pré-rendu (sans JS)**

```bash
grep -o '<h1[^>]*>[^<]*' dist/guepes/index.html
grep -c 'application/ld+json' dist/guepes/index.html
grep -o 'rel="canonical" href="[^"]*"' dist/guepes/index.html
```
Expected : le `<h1>` « Destruction de nids de Guêpes » apparaît, au moins 1 script JSON-LD, canonical = `https://frelons-guepes-destruction.fr/guepes`.

> À ce stade les pages n'ont pas encore `<Seo>` (Tasks 8-9). Le `<h1>` doit quand même être pré-rendu (c'est le test qui compte ici). Le canonical peut encore venir du fallback `index.html` — c'est OK, il sera corrigé aux Tasks 8-9.

- [ ] **Step 10: Vérifier `npm run preview`**

Run: `npm run preview` puis ouvrir `http://localhost:4173/` et `http://localhost:4173/interventions/crest`
Expected : les pages s'affichent, navigation client OK, **aucun warning "hydration mismatch"** dans la console navigateur. Animations framer-motion fonctionnelles.

> Si hydration mismatch sur `Footer` (`new Date().getFullYear()`) : figer l'année via une constante calculée une fois au module scope — mais normalement identique build/client. Noter et traiter si observé.

- [ ] **Step 11: Lint**

Run: `npm run lint`
Expected: 0 erreur. Corriger tout import inutilisé (`RouterProvider`, `createBrowserRouter`, `HelmetProvider` retirés).

- [ ] **Step 12: Commit**

```bash
git add package.json package-lock.json src/main.tsx src/App.tsx vite.config.ts index.html
git commit -m "$(printf 'feat: migration SSG avec vite-react-ssg (pre-rendu de toutes les routes)\n\nCo-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>')"
```

---

## Task 7: Page mentions légales + composant NotFound

**Files:**
- Create: `src/pages/LegalPage.tsx`
- Create: `src/components/NotFound.tsx`
- Modify: `src/components/Footer.tsx` (lien mentions légales)
- Modify: `src/data/content.ts` (ajouter au tableau `LIENS_UTILES` OU ajouter une ligne dédiée dans le Footer — voir step)

**Interfaces:**
- Consumes: `Seo` (Task 2), `CONTACT` from `content.ts`, `SITE_NAME`.
- Produces:
  - `LegalPage` (default export) — composant page.
  - `NotFound` (default export) — props `{ title?: string; message?: string }`.

- [ ] **Step 1: Créer `src/components/NotFound.tsx`**

Extrait du bloc « Commune non trouvée » de `CommunePage.tsx`, généralisé :

```tsx
import { Link } from 'react-router-dom'
import Seo from './Seo'

interface NotFoundProps {
  title?: string
  message?: string
}

export default function NotFound({
  title = 'Page introuvable',
  message = "La page que vous cherchez n'existe pas ou a été déplacée.",
}: NotFoundProps) {
  return (
    <>
      <Seo
        title={`${title} — Val Drôme Guêpes Frelons`}
        description={message}
        path="/404"
        noindex
      />
      <div className="py-32 text-center font-poppins text-wasp-gray">
        <p className="mb-4 text-lg">{message}</p>
        <Link to="/" className="text-wasp-yellow underline">
          Retour à l&apos;accueil
        </Link>
      </div>
    </>
  )
}
```

- [ ] **Step 2: Créer `src/pages/LegalPage.tsx`**

```tsx
import Seo from '../components/Seo'
import Breadcrumb from '../components/Breadcrumb'
import { CONTACT } from '../data/content'
import { SITE_NAME } from '../data/site'

export default function LegalPage() {
  return (
    <>
      <Seo
        title={`Mentions légales — ${SITE_NAME}`}
        description="Mentions légales du site Val Drôme Guêpes Frelons : éditeur, hébergeur, propriété intellectuelle."
        path="/mentions-legales"
        jsonLd={[]}
      />
      <Breadcrumb items={[{ name: 'Accueil', path: '/' }, { name: 'Mentions légales', path: '/mentions-legales' }]} />

      <section className="mx-auto max-w-3xl px-4 py-12 font-poppins text-sm leading-relaxed text-wasp-gray">
        <h1 className="mb-8 font-rajdhani text-3xl font-black text-wasp-black">Mentions légales</h1>

        <h2 className="mb-2 mt-6 font-rajdhani text-xl font-bold text-wasp-black">Éditeur du site</h2>
        <p>
          {CONTACT.responsable} — {CONTACT.nom}
          <br />
          {CONTACT.adresse}, {CONTACT.codePostal} {CONTACT.ville}
          <br />
          SIRET : {CONTACT.siret}
          <br />
          Certibiocide N°{CONTACT.certibiocide}
          <br />
          Téléphone : {CONTACT.telephone} — Email : {CONTACT.email}
        </p>

        <h2 className="mb-2 mt-6 font-rajdhani text-xl font-bold text-wasp-black">Directeur de la publication</h2>
        <p>{CONTACT.responsable}</p>

        <h2 className="mb-2 mt-6 font-rajdhani text-xl font-bold text-wasp-black">Hébergeur</h2>
        <p>
          Hostinger International Ltd.
          <br />
          61 Lordou Vironos Street, 6023 Larnaca, Chypre
        </p>

        <h2 className="mb-2 mt-6 font-rajdhani text-xl font-bold text-wasp-black">Propriété intellectuelle</h2>
        <p>
          L&apos;ensemble des contenus (textes, images, logo) présents sur ce site est la propriété de{' '}
          {CONTACT.nom}, sauf mention contraire. Toute reproduction sans autorisation est interdite.
        </p>

        <h2 className="mb-2 mt-6 font-rajdhani text-xl font-bold text-wasp-black">Données personnelles</h2>
        <p>
          Ce site ne collecte aucune donnée personnelle : il ne comporte ni formulaire de contact, ni
          cookie de mesure d&apos;audience. Les échanges se font par téléphone ou par email à
          l&apos;initiative du visiteur.
        </p>
      </section>
    </>
  )
}
```

- [ ] **Step 3: Ajouter le lien dans le Footer**

Dans `src/components/Footer.tsx`, ajouter sous la barre copyright (après la ligne 71, avant `</footer>`) :

```tsx
      <div className="bg-wasp-black px-4 py-2 text-center">
        <Link to="/mentions-legales" className="font-poppins text-xs text-white/50 hover:text-wasp-yellow transition-colors">
          Mentions légales
        </Link>
      </div>
```

`Link` est déjà importé dans `Footer.tsx` (ligne 1).

- [ ] **Step 4: Vérifier compilation + lint**

Run: `npx tsc -b && npm run lint`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/pages/LegalPage.tsx src/components/NotFound.tsx src/components/Footer.tsx
git commit -m "$(printf 'feat: page mentions legales + composant NotFound + lien footer\n\nCo-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>')"
```

---

## Task 8: Câbler `Seo` dans CommunePage + enrichir le contenu

**Files:**
- Modify: `src/pages/CommunePage.tsx` (réécriture)

**Interfaces:**
- Consumes: `Seo`, `Breadcrumb`, `NotFound`, `FaqSection` (+ type `FaqItem`), `localBusiness` + `breadcrumb` from `lib/jsonLd`, `COMMUNES` + type `Commune`, `toSlug`, `CONTACT`.
- Produces: page enrichie ; aucun export nouveau.

- [ ] **Step 1: Réécrire `src/pages/CommunePage.tsx`**

```tsx
import { useParams, Link } from 'react-router-dom'
import { Phone } from 'lucide-react'
import Seo from '../components/Seo'
import Breadcrumb from '../components/Breadcrumb'
import NotFound from '../components/NotFound'
import FaqSection from '../components/FaqSection'
import type { FaqItem } from '../components/FaqSection'
import { COMMUNES } from '../data/communes'
import { CONTACT } from '../data/content'
import { toSlug } from '../utils/communeSlug'
import { localBusiness, breadcrumb } from '../lib/jsonLd'

export default function CommunePage() {
  const { slug } = useParams<{ slug: string }>()
  const commune = COMMUNES.find((c) => toSlug(c.nom) === slug)

  if (!commune) {
    return <NotFound title="Commune non trouvée" message="Cette commune ne fait pas partie de notre zone d'intervention listée." />
  }

  const { nom, secteur, cp, limitrophes, distanceMin } = commune

  const faq: FaqItem[] = [
    {
      question: `Intervenez-vous rapidement à ${nom} ?`,
      answer: `Oui. Depuis notre base de Saou, un technicien rejoint ${nom} en environ ${distanceMin} minutes. En saison, nous intervenons sous 24h maximum.`,
    },
    {
      question: `Quels nuisibles traitez-vous à ${nom} ?`,
      answer: `Nids de guêpes, frelons européens, frelons asiatiques (Vespa velutina) et fourmilières, avec des biocides homologués appliqués de manière raisonnée.`,
    },
    {
      question: `Faut-il se déplacer ou vous appelez-vous ?`,
      answer: `Un simple appel au ${CONTACT.telephone} suffit. Nous évaluons la situation par téléphone puis planifions l'intervention sur ${nom} ou une commune voisine (${limitrophes.slice(0, 2).join(', ')}…).`,
    },
  ]

  const title = `Destruction guêpes et frelons à ${nom} (${secteur}) — ${CONTACT.nom}`
  const description = `Intervention rapide pour la destruction de nids de guêpes, frelons et fourmis à ${nom} (${cp}), secteur ${secteur}. Certibiocide N°${CONTACT.certibiocide}. Appelez le ${CONTACT.telephone}.`

  return (
    <>
      <Seo
        title={title}
        description={description}
        path={`/interventions/${toSlug(nom)}`}
        jsonLd={[
          localBusiness({ areaServed: nom }),
          breadcrumb([
            { name: 'Accueil', path: '/' },
            { name: 'Interventions', path: '/interventions' },
            { name: nom, path: `/interventions/${toSlug(nom)}` },
          ]),
        ]}
      />

      <Breadcrumb
        items={[
          { name: 'Accueil', path: '/' },
          { name: 'Interventions', path: '/interventions' },
          { name: nom, path: `/interventions/${toSlug(nom)}` },
        ]}
      />

      <section className="bg-wasp-black py-16">
        <div className="mx-auto max-w-7xl px-4">
          <p className="mb-3 font-poppins text-xs font-bold uppercase tracking-[3px] text-wasp-yellow">
            Intervention rapide · {secteur}
          </p>
          <h1 className="mb-4 font-rajdhani text-4xl font-black leading-tight text-white md:text-5xl">
            Destruction de guêpes et frelons à <span className="text-wasp-yellow">{nom}</span>
          </h1>
          <p className="mb-8 max-w-2xl font-poppins text-base text-white/70">
            {CONTACT.nom} intervient à {nom} ({cp}) et dans tout le secteur {secteur} pour la
            destruction professionnelle de nids de guêpes, frelons européens, frelons asiatiques et
            fourmilières. Biocides homologués, Certibiocide N°{CONTACT.certibiocide}.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href={CONTACT.telephoneHref}
              className="flex items-center gap-2 rounded-md bg-wasp-yellow px-6 py-3 font-rajdhani text-base font-bold text-wasp-black transition-opacity hover:opacity-90"
            >
              <Phone className="h-4 w-4" />
              Appeler maintenant
            </a>
            <Link
              to="/contact"
              className="flex items-center gap-2 rounded-md border border-wasp-yellow px-6 py-3 font-rajdhani text-base font-bold text-wasp-yellow transition-colors hover:bg-wasp-yellow hover:text-wasp-black"
            >
              Devis gratuit →
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="mb-4 font-rajdhani text-2xl font-black text-wasp-black">
            Délai d&apos;intervention à {nom}
          </h2>
          <p className="mb-8 font-poppins text-sm leading-relaxed text-wasp-gray">
            Depuis notre base de Saou (26400), nos techniciens rejoignent {nom} en environ{' '}
            <strong className="text-wasp-black">{distanceMin} minutes</strong>. Nous couvrons aussi les
            communes voisines :{' '}
            {limitrophes.map((l, i) => {
              const known = COMMUNES.some((c) => c.nom === l)
              return (
                <span key={l}>
                  {known ? (
                    <Link to={`/interventions/${toSlug(l)}`} className="text-wasp-yellow hover:underline">
                      {l}
                    </Link>
                  ) : (
                    l
                  )}
                  {i < limitrophes.length - 1 ? ', ' : '.'}
                </span>
              )
            })}
          </p>

          <h2 className="mb-4 font-rajdhani text-2xl font-black text-wasp-black">Nos services à {nom}</h2>
          <div className="flex flex-wrap gap-3">
            <Link to="/guepes" className="rounded-full bg-wasp-yellow/10 px-4 py-2 font-poppins text-sm font-semibold text-wasp-black hover:bg-wasp-yellow transition-colors">
              Destruction de guêpes
            </Link>
            <Link to="/frelons" className="rounded-full bg-wasp-yellow/10 px-4 py-2 font-poppins text-sm font-semibold text-wasp-black hover:bg-wasp-yellow transition-colors">
              Destruction de frelons
            </Link>
            <Link to="/frelons" className="rounded-full bg-wasp-yellow/10 px-4 py-2 font-poppins text-sm font-semibold text-wasp-black hover:bg-wasp-yellow transition-colors">
              Frelons asiatiques
            </Link>
            <Link to="/fourmis" className="rounded-full bg-wasp-yellow/10 px-4 py-2 font-poppins text-sm font-semibold text-wasp-black hover:bg-wasp-yellow transition-colors">
              Destruction de fourmis
            </Link>
          </div>
          <p className="mt-6 font-poppins text-sm text-wasp-gray">
            <Link to="/interventions" className="text-wasp-yellow hover:underline">
              ← Voir toutes nos zones d&apos;intervention
            </Link>
          </p>
        </div>
      </section>

      <FaqSection items={faq} jsonLdId={`faq-${toSlug(nom)}`} />
    </>
  )
}
```

- [ ] **Step 2: Build + vérifier une page commune**

Run: `npm run build`
Then:
```bash
grep -o 'rel="canonical" href="[^"]*"' dist/interventions/crest/index.html
grep -c 'Aouste-sur-Sye\|Saillans' dist/interventions/crest/index.html
grep -o '<title>[^<]*' dist/interventions/nyons/index.html
```
Expected : canonical = `.../interventions/crest` ; les communes limitrophes de Crest apparaissent dans le HTML ; le title de Nyons diffère de celui de Crest (secteur « Baronnies » vs « Crestois »).

- [ ] **Step 3: Vérifier l'unicité entre 3 pages**

```bash
for c in crest nyons montelimar; do grep -o '<meta name="description" content="[^"]*"' dist/interventions/$c/index.html; done
```
Expected : 3 descriptions distinctes (nom, CP, secteur différents).

- [ ] **Step 4: Lint**

Run: `npm run lint`
Expected: 0 erreur.

- [ ] **Step 5: Commit**

```bash
git add src/pages/CommunePage.tsx
git commit -m "$(printf 'feat: pages communes enrichies (secteur, delai, communes voisines liees, FAQ locale) + Seo\n\nCo-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>')"
```

---

## Task 9: Câbler `Seo` + JSON-LD + breadcrumbs dans les pages restantes

**Files:**
- Modify: `src/pages/HomePage.tsx`
- Modify: `src/pages/GuepesPage.tsx`
- Modify: `src/pages/FrelonsPage.tsx`
- Modify: `src/pages/FourmisPage.tsx`
- Modify: `src/pages/InterventionsPage.tsx`
- Modify: `src/pages/ContactPage.tsx`
- Modify: `src/components/FaqSection.tsx`

**Interfaces:**
- Consumes: `Seo`, `Breadcrumb`, `localBusiness` / `service` / `breadcrumb` / `faqPage` from `lib/jsonLd`.
- Produces: aucun export nouveau. `FaqSection` : le JSON-LD passe par `faqPage()` (même sortie qu'avant).

- [ ] **Step 1: `FaqSection.tsx` — utiliser `faqPage()`**

Remplacer le bloc `const jsonLd = {...}` (lignes 18-26) par :

```tsx
import { faqPage } from '../lib/jsonLd'
// ...
  const jsonLd = faqPage(items)
```

Le reste (le `<script dangerouslySetInnerHTML>`) est inchangé.

- [ ] **Step 2: `HomePage.tsx`**

Remplacer le bloc `<Helmet>...</Helmet>` (lignes 150-157) par :

```tsx
      <Seo
        title="Destruction de Guêpes & Frelons dans la Drôme — Val Drôme Guêpes Frelons"
        description="Val Drôme Guêpes Frelons : professionnel certifié de la destruction de nids de guêpes, frelons et frelons asiatiques dans la Drôme. Certibiocide N°0315595. Intervention rapide sur 60+ communes."
        path="/"
        jsonLd={[localBusiness()]}
      />
```

Retirer les imports `Helmet` et le bloc `const jsonLd = {...}` (lignes 131-146). Ajouter `import Seo from '../components/Seo'` et `import { localBusiness } from '../lib/jsonLd'`.

- [ ] **Step 3: `GuepesPage.tsx`**

Remplacer `<Helmet>` (lignes 56-62) par :

```tsx
      <Seo
        title="Destruction de nids de Guêpes dans la Drôme — Val Drôme Guêpes Frelons"
        description="Extermination définitive des nids de guêpes dans la Drôme. Professionnel certifié Certibiocide. Intervention rapide et sécurisée. Appelez le 06 25 11 54 44."
        path="/guepes"
        image="/og/guepes.png"
        jsonLd={[
          service('Destruction de nids de guêpes', 'Extermination définitive des nids de guêpes dans la Drôme, avec biocides homologués.', '/guepes'),
          breadcrumb([{ name: 'Accueil', path: '/' }, { name: 'Guêpes', path: '/guepes' }]),
        ]}
      />
```

Ajouter juste après (avant `<HeroSection>`) :
```tsx
      <Breadcrumb items={[{ name: 'Accueil', path: '/' }, { name: 'Guêpes', path: '/guepes' }]} />
```

Imports : retirer `Helmet`, ajouter `Seo`, `Breadcrumb`, `{ service, breadcrumb }`.

- [ ] **Step 4: `FrelonsPage.tsx`**

Même schéma :

```tsx
      <Seo
        title="Destruction de nids de Frelons dans la Drôme — Val Drôme Guêpes Frelons"
        description="Éradication des nids de frelons européens et frelons asiatiques dans la Drôme. Expert certifié Certibiocide. Intervention rapide — 06 25 11 54 44."
        path="/frelons"
        image="/og/frelons.png"
        jsonLd={[
          service('Destruction de nids de frelons', 'Éradication des nids de frelons européens et asiatiques dans la Drôme.', '/frelons'),
          breadcrumb([{ name: 'Accueil', path: '/' }, { name: 'Frelons', path: '/frelons' }]),
        ]}
      />
```
+ `<Breadcrumb items={[{ name: 'Accueil', path: '/' }, { name: 'Frelons', path: '/frelons' }]} />` avant `<HeroSection>`.

- [ ] **Step 5: `FourmisPage.tsx`**

```tsx
      <Seo
        title="Destruction de fourmilières dans la Drôme — Val Drôme Guêpes Frelons"
        description="Éradication professionnelle des fourmilières dans la Drôme. Biocides homologués, traitement raisonné. Appelez le 06 25 11 54 44."
        path="/fourmis"
        image="/og/fourmis.png"
        jsonLd={[
          service('Destruction de fourmilières', 'Éradication professionnelle des colonies de fourmis dans la Drôme.', '/fourmis'),
          breadcrumb([{ name: 'Accueil', path: '/' }, { name: 'Fourmis', path: '/fourmis' }]),
        ]}
      />
```
+ `<Breadcrumb items={[{ name: 'Accueil', path: '/' }, { name: 'Fourmis', path: '/fourmis' }]} />` avant `<HeroSection>`.

- [ ] **Step 6: `InterventionsPage.tsx`**

```tsx
      <Seo
        title="Zone d'intervention Guêpes Frelons — Sud Drôme — Val Drôme Guêpes Frelons"
        description={`Intervention rapide sur ${COMMUNES.length}+ communes de la moitié Sud de la Drôme. Destruction de guêpes, frelons et fourmis. Appelez le 06 25 11 54 44.`}
        path="/interventions"
        jsonLd={[breadcrumb([{ name: 'Accueil', path: '/' }, { name: 'Interventions', path: '/interventions' }])]}
      />
```
+ `<Breadcrumb items={[{ name: 'Accueil', path: '/' }, { name: 'Interventions', path: '/interventions' }]} />` avant `<HeroSection>`.

> `COMMUNES.length` : `COMMUNES` est maintenant `Commune[]`, `.length` fonctionne toujours. Les usages `COMMUNES.map((commune) => ...)` dans le corps de la page doivent devenir `COMMUNES.map((c) => ... c.nom ...)` et `toSlug(c.nom)`. Corriger les lignes 85-93 : `key={c.nom}`, `to={/interventions/${toSlug(c.nom)}}`, texte `{c.nom}`.

- [ ] **Step 7: `ContactPage.tsx`**

```tsx
      <Seo
        title="Contact — Val Drôme Guêpes Frelons"
        description="Contactez Val Drôme Guêpes Frelons pour la destruction de nids de guêpes, frelons ou fourmis dans la Drôme. Téléphone : 06 25 11 54 44."
        path="/contact"
        jsonLd={[localBusiness()]}
      />
```
Imports : retirer `Helmet`, ajouter `Seo`, `{ localBusiness }`.

- [ ] **Step 8: Build**

Run: `npm run build`
Expected: build OK.

- [ ] **Step 9: Vérifier canonical + JSON-LD par page**

```bash
for p in "" guepes frelons fourmis interventions contact mentions-legales; do
  f="dist/${p:-.}/index.html"; [ -z "$p" ] && f="dist/index.html"
  echo "=== $p ==="
  grep -o 'rel="canonical" href="[^"]*"' "$f"
  grep -o '"@type":"[^"]*"' "$f" | sort -u
done
```
Expected : chaque page a un canonical unique correct ; home + contact → `LocalBusiness`/`PestControl` ; guêpes/frelons/fourmis → `Service` + `BreadcrumbList` ; guêpes/frelons/fourmis → aussi `FAQPage` (via `FaqSection`).

- [ ] **Step 10: Vérifier l'absence de double `<title>` / double canonical**

```bash
grep -c '<title>' dist/guepes/index.html
grep -c 'rel="canonical"' dist/guepes/index.html
```
Expected : `1` et `1`. Si `2`, le fallback `index.html` n'est pas dédupliqué par `vite-react-ssg` → retirer le `<title>`/`<link canonical>`/OG de `index.html` en gardant seulement `<meta name="description">` minimal et les tags PWA/theme/geo (ceux que `<Seo>` ne rend pas). Documenter le choix retenu dans le commit.

- [ ] **Step 11: Preview + lint**

Run: `npm run preview` — vérifier home, une page service (breadcrumb visible), pas de warning hydration.
Run: `npm run lint` — 0 erreur (imports `Helmet` retirés partout).

- [ ] **Step 12: Commit**

```bash
git add src/pages/HomePage.tsx src/pages/GuepesPage.tsx src/pages/FrelonsPage.tsx src/pages/FourmisPage.tsx src/pages/InterventionsPage.tsx src/pages/ContactPage.tsx src/components/FaqSection.tsx
git commit -m "$(printf 'feat: Seo centralise + JSON-LD (LocalBusiness/Service/Breadcrumb) + fil dAriane sur toutes les pages\n\nCo-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>')"
```

---

## Task 10: Optimisation des images (dimensions, WebP, lazy)

**Files:**
- Modify: `src/components/HeroSection.tsx`
- Modify: `src/components/PhotoCarousel.tsx`

**Interfaces:**
- Consumes: les `.webp` générés en Task 4 (présents dans `public/`).
- Produces: aucun export nouveau.

- [ ] **Step 1: `HeroSection.tsx` — `<picture>` + dimensions**

Remplacer le bloc `<img src={imageSrc} ... />` (lignes 111-116) par :

```tsx
            <picture>
              <source srcSet={imageSrc.replace(/\.(png|jpe?g)$/i, '.webp')} type="image/webp" />
              <img
                src={imageSrc}
                alt="Professionnel certifié pour la destruction de nids de guêpes et frelons dans la Drôme"
                width={640}
                height={384}
                fetchPriority="high"
                className="h-80 w-full object-contain lg:h-96"
              />
            </picture>
```

> `width`/`height` = ratio d'affichage cible (`h-80` = 320px, `lg:h-96` = 384px ; largeur colonne ~640px). Valeurs indicatives pour réserver l'espace (anti-CLS) ; l'image reste `object-contain`.

- [ ] **Step 2: `PhotoCarousel.tsx` — lazy + dimensions + webp**

Sur le `motion.img` (lignes 65-80), ajouter `loading="lazy"`, `width={640}`, `height={384}`. Pour le WebP : envelopper dans `<picture>` complique l'animation `motion.img` ; approche plus simple — garder `motion.img` mais pointer `src` vers `.webp` avec fallback via `onError` :

```tsx
        <motion.img
          key={index}
          src={photos[index].src.replace(/\.(png|jpe?g)$/i, '.webp')}
          onError={(e) => {
            const img = e.currentTarget
            if (!img.src.endsWith(photos[index].src)) img.src = photos[index].src
          }}
          alt={photos[index].alt}
          loading="lazy"
          width={640}
          height={384}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.45, ease: 'easeInOut' }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
          className="absolute inset-0 h-full w-full cursor-grab object-cover active:cursor-grabbing"
        />
```

- [ ] **Step 3: Build + vérifier**

Run: `npm run build`
Then:
```bash
grep -o 'type="image/webp"' dist/guepes/index.html
grep -o 'loading="lazy"' dist/index.html
```
Expected : la `<source webp>` du hero apparaît sur les pages service ; `loading="lazy"` présent sur la home (carousel). Vérifier dans `dist/` que les `.webp` référencés existent (`ls dist/photos/*.webp`, `ls dist/images/*.webp`).

- [ ] **Step 4: Preview — contrôle visuel**

Run: `npm run preview` — home : le carousel s'affiche (webp servi), le hero desktop affiche l'image. Pas de casse visuelle.

- [ ] **Step 5: Lint**

Run: `npm run lint`
Expected: 0 erreur.

- [ ] **Step 6: Commit**

```bash
git add src/components/HeroSection.tsx src/components/PhotoCarousel.tsx
git commit -m "$(printf 'perf: images en WebP, dimensions explicites (anti-CLS), lazy-loading carousel\n\nCo-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>')"
```

---

## Task 11: Vérification finale & documentation déploiement

**Files:**
- Create: `docs/deploiement-nginx.md`
- Modify: `.github/workflows/deploy.yml` (Node 22 — déjà OK ; vérifier que `npm run build` suffit)

**Interfaces:** aucune.

- [ ] **Step 1: Build complet propre**

```bash
rm -rf dist node_modules/.vite
npm run build
```
Expected : succès, aucune erreur TypeScript, tous les scripts de génération passent.

- [ ] **Step 2: Inventaire `dist/`**

```bash
find dist -name 'index.html' | sort
ls dist/interventions | grep -v index.html | wc -l   # = COMMUNES.length
test -f dist/sitemap.xml && echo "sitemap OK"
test -f dist/manifest.json && echo "manifest OK"
test -f dist/apple-touch-icon.png && echo "apple-touch-icon OK"
ls dist/og/
```
Expected : 7 pages fixes + N pages communes, sitemap/manifest/icons présents, 4 images OG.

- [ ] **Step 3: Validation Schema.org (manuelle)**

Ouvrir `https://validator.schema.org/`, coller le contenu de `dist/index.html` puis de `dist/interventions/crest/index.html`.
Expected : 0 erreur (warnings tolérés). Noter tout problème et le corriger dans `lib/jsonLd.ts`.

- [ ] **Step 4: Vérif liens internes communes (script jetable)**

```bash
node --input-type=module -e "
import { COMMUNES } from './src/data/communes.ts';
const noms = new Set(COMMUNES.map(c => c.nom));
let bad = 0;
for (const c of COMMUNES) for (const l of c.limitrophes) if (!noms.has(l)) { console.log(c.nom, '->', l); bad++; }
console.log(bad ? bad + ' liens morts' : 'liens OK');
" 2>/dev/null || npx tsx -e "/* même code */"
```
Expected : `liens OK`. (Doit déjà être le cas depuis Task 3 ; contrôle de non-régression.)

- [ ] **Step 5: Créer `docs/deploiement-nginx.md`**

```markdown
# Déploiement nginx — note post-migration SSG

Le site est désormais pré-rendu : `dist/` contient un fichier HTML par route
(`/guepes/index.html`, `/interventions/crest/index.html`, …) au lieu d'un seul
`index.html` de SPA.

## Config nginx requise sur le VPS

Le bloc `location /` doit servir les fichiers pré-rendus et renvoyer un vrai 404
pour les URL inconnues — PAS un fallback SPA vers `/index.html` :

```nginx
server {
    root /var/www/valdrome-guepes-frelons/frontend;
    index index.html;

    location / {
        try_files $uri $uri/ $uri/index.html =404;
    }

    # cache long pour les assets fingerprintés
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

Si la config actuelle contient `try_files $uri $uri/ /index.html;`, la remplacer
par la ligne ci-dessus, puis `nginx -t && systemctl reload nginx`.

## Redirections

Si l'ancien domaine `valdrome-guepes-frelons.fr` (ou tout autre) pointe encore
vers ce serveur, ajouter une redirection 301 permanente vers
`https://frelons-guepes-destruction.fr` pour consolider le référencement.

## Après déploiement

1. Vérifier `https://frelons-guepes-destruction.fr/sitemap.xml` (toutes les communes listées).
2. Soumettre le sitemap dans Google Search Console.
3. Tester le partage d'une URL sur Facebook/LinkedIn (aperçu OG).
4. Rich Results Test sur la home et une page commune.
```

- [ ] **Step 6: Vérifier le workflow CI**

Lire `.github/workflows/deploy.yml`. Confirmer : Node 22 (OK ligne 21), `npm ci` puis `npm run build` (OK). `sharp` + `tsx` s'installent via `npm ci` (déjà en devDependencies après Tasks 4/6). Aucune modification nécessaire — sauf si `npm ci` ne se fait pas avec `--include=dev` par défaut (il le fait). **Ne rien changer**, juste confirmer par lecture.

> Si un doute : ajouter `NODE_ENV: development` n'est PAS souhaitable (casse le build Vite). `npm ci` installe les devDependencies par défaut tant que `NODE_ENV !== production` dans l'environnement du runner — c'est le cas sur `ubuntu-latest` standard.

- [ ] **Step 7: Commit**

```bash
git add docs/deploiement-nginx.md
git commit -m "$(printf 'docs: note de deploiement nginx post-migration SSG\n\nCo-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>')"
```

- [ ] **Step 8: Récapitulatif à l'utilisateur**

Présenter :
- Ce qui est fait (SSG, Seo, JSON-LD, sitemap, pages communes enrichies, mentions légales, images).
- **Action manuelle requise de sa part** : mettre à jour la config nginx sur le VPS (`docs/deploiement-nginx.md`), puis après déploiement soumettre le sitemap à Search Console.
- Points à affiner plus tard : coordonnées GPS exactes dans `site.ts`, secteurs/distances des communes, vraies images OG, contenu éditorial par commune.

---

## Ordre d'exécution

Les tâches ont des dépendances croisées. Ordre recommandé :

1. **Task 1** — données site + JSON-LD + fix email (aucune dépendance)
2. **Task 3** — données communes (aucune dépendance ; applique le patch minimal de `CommunePage` pour garder le build vert)
3. **Task 4** — scripts assets (aucune dépendance)
4. **Task 5** — sitemap (dépend de Task 3)
5. **Task 6** — migration SSG (dépend de Task 1 pour rien de bloquant, mais Task 2 + Task 7 fournissent `Seo`/`LegalPage` référencés)
   → **faire Task 2 puis Task 7 avant Task 6**
6. **Task 2** — composants Seo/Breadcrumb (dépend de `vite-react-ssg` installé : `npm install vite-react-ssg` d'abord, sans le reste de Task 6)
7. **Task 7** — mentions légales + NotFound (dépend de Task 2)
8. **Task 6** — migration SSG complète (dépend de Tasks 2, 7)
9. **Task 8** — CommunePage enrichie (dépend de Tasks 2, 3, 6)
10. **Task 9** — Seo dans les autres pages (dépend de Tasks 2, 6)
11. **Task 10** — images (dépend de Tasks 4, 6)
12. **Task 11** — vérif finale + doc (dépend de tout)

Séquence linéaire finale : **1 → 3 → 4 → 5 → (npm i vite-react-ssg) → 2 → 7 → 6 → 8 → 9 → 10 → 11**

---

## Self-review

**Couverture du spec :**

| Section spec | Tâche(s) |
|---|---|
| §1 Build vite-react-ssg | Task 6 |
| §1 main.tsx / App.tsx / vite.config / index.html | Task 6 |
| §1 note nginx | Task 11 (doc) |
| §2 site.ts | Task 1 |
| §2 Seo.tsx | Task 2 |
| §2 fix email | Task 1 |
| §3 jsonLd.ts (localBusiness/service/breadcrumb/faqPage) | Task 1 |
| §3 Breadcrumb.tsx | Task 2 |
| §3 FaqSection utilise faqPage | Task 9 |
| §3 répartition JSON-LD par page | Tasks 8, 9 |
| §4 communes.ts enrichi | Task 3 |
| §4 CommunePage enrichie | Task 8 |
| §4 route 404 | Task 7 (NotFound) + Task 8 (usage) |
| §5 gen-sitemap.mjs | Task 5 |
| §5 robots.txt inchangé | Task 5 (vérif) |
| §6 gen-og.mjs | Task 4 |
| §6 gen-webp.mjs | Task 4 |
| §6 manifest.json | Task 4 |
| §6 apple-touch-icon | Task 4 |
| §6 index.html meta fallback | Task 6 |
| §7 HeroSection images | Task 10 |
| §7 PhotoCarousel images | Task 10 |
| §8 LegalPage + route + lien footer | Task 7 (+ route en Task 6) |
| Tests & vérification | Tasks 6, 8, 9, 11 |
| Risque nginx | Task 11 doc |
| Risque hydration mismatch | Tasks 6, 9 (steps preview) |

**Placeholder scan :** aucun « TBD/TODO ». Les valeurs géographiques des communes sont fournies en dur (ajustables mais non vides). Les dimensions d'images sont des valeurs concrètes avec justification.

**Cohérence des types :**
- `Commune` : `{ nom, secteur, cp, limitrophes, distanceMin }` — défini Task 3, utilisé Tasks 5, 8, 9, 11 de façon cohérente (`.nom` partout).
- `Seo` props : `{ title, description, path, image?, jsonLd?, noindex? }` — défini Task 2, appelé identiquement Tasks 7, 8, 9.
- `breadcrumb(items)` / items `{ name, path }` — défini Task 1, utilisé Tasks 7, 8, 9 avec la même forme.
- `routes` : named export depuis `App.tsx` (plus de `default`) — Task 6 ; `main.tsx` importe `{ routes }` — cohérent.
- `COMMUNES_PRINCIPALES` : reste `string[]`, ré-exporté depuis `communes.ts` via `content.ts` — Task 3 ; consommé par `jsonLd.ts` (Task 1) et `HomePage` — cohérent (l'import via `content.ts` continue de fonctionner).

**Gap identifié et corrigé :** le spec mentionne `HelmetProvider` conservé « dans le fichier racine de la lib » ; la vérification de l'API `vite-react-ssg` montre qu'elle fournit son propre `<Head>` — le plan retire `HelmetProvider` (Task 6 Step 3) et n'utilise plus `react-helmet-async` directement. `FaqSection` utilisait `<Helmet>` ? Non — il utilise déjà un `<script dangerouslySetInnerHTML>` inline, conservé tel quel (Task 9 Step 1 ne change que la construction de l'objet).
