# Migration SSG + refonte SEO — Val Drôme Guêpes Frelons

**Date :** 2026-08-27
**Type :** architectural
**Statut :** validé, prêt pour plan d'implémentation

## Contexte

Le site est une SPA Vite 8 / React 19 / react-router-dom v7. `index.html` ne sert
qu'un `<div id="root">` vide : tout le HTML (titres, texte, meta via
`react-helmet-async`, JSON-LD) est injecté côté client. Conséquences SEO :

- HTML source vide de contenu → crawlers non-JS (Bing, réseaux sociaux) ne voient rien.
- `<meta>` par page absentes du source → partage social sans titre/description.
- JSON-LD `LocalBusiness` / `FAQPage` rendus client → prise en compte fragile.

Autres défauts constatés : aucun `<link rel="canonical">`, sitemap incomplet
(6 URLs sur ~67), incohérence de domaine (email sur `valdrome-guepes-frelons.fr`
alors que le référencement est sur `frelons-guepes-destruction.fr`), 60+ pages
communes en quasi-duplication (doorway pages), JSON-LD `LocalBusiness` incomplet,
pas d'Open Graph, pas de mentions légales, images sans dimensions ni WebP.

Déploiement actuel : GitHub Actions (`.github/workflows/deploy.yml`) →
`npm run build` → SCP de `dist/*` vers `/var/www/valdrome-guepes-frelons/frontend`
sur un VPS Hostinger → `nginx reload`.

## Décisions

| Sujet | Décision |
|---|---|
| Outil de rendu statique | `vite-react-ssg` (reste sur la stack, pré-rend un `.html` par route) |
| Domaine canonique | `https://frelons-guepes-destruction.fr` (référencement acquis) |
| Email | corrigé en `contact@frelons-guepes-destruction.fr` |
| Pages communes | niveau A : différenciation automatique (secteur, communes limitrophes liées, délai depuis Saou, FAQ locale) ; structure prête pour du contenu rédigé (niveau B) plus tard |
| Images OG | placeholders générés au build (fond noir + logo + titre), à remplacer plus tard |
| Hébergeur (mentions légales) | Hostinger International Ltd., 61 Lordou Vironos Street, 6023 Larnaca, Chypre |

### Hors périmètre (chantier ultérieur)

- Contenu éditorial rédigé par commune (niveau B).
- GA4 / Google Search Console / Bing Webmaster (nécessite identifiants).
- Lazy-loading des routes (`React.lazy`), optimisation du bundle `framer-motion`.
- Politique de confidentialité détaillée (RGPD) — les mentions légales de base suffisent
  tant qu'il n'y a ni formulaire ni analytics.

## Architecture

### 1. Build & rendu — `vite-react-ssg`

- **Dépendance** : `+ vite-react-ssg`. `react-router-dom` v7 conservé (compatible).
- **`src/main.tsx`** : remplacé par le point d'entrée `vite-react-ssg` :
  ```ts
  import { ViteReactSSG } from 'vite-react-ssg'
  import { routes } from './App'
  import './index.css'

  export const createRoot = ViteReactSSG(
    { routes },
    ({ router, routes, isClient }) => {
      // HelmetProvider est monté via le wrapper racine des routes (voir App.tsx)
    },
  )
  ```
- **`src/App.tsx`** : n'exporte plus un composant `<RouterProvider>` mais un tableau
  `routes` au format `vite-react-ssg` (data-router de react-router v7). Les objets
  route sont inchangés (`element`, `children`). Le layout racine `<Layout>` reste
  le parent ; `HelmetProvider` enveloppe `<Layout>` (déplacé de `main.tsx`).
  ```ts
  export const routes: RouteRecord[] = [
    {
      path: '/',
      element: <HelmetProvider><Layout /></HelmetProvider>,
      children: [
        { index: true, element: <HomePage />, entry: 'src/pages/HomePage.tsx' },
        { path: 'guepes', element: <GuepesPage /> },
        { path: 'frelons', element: <FrelonsPage /> },
        { path: 'fourmis', element: <FourmisPage /> },
        { path: 'interventions', element: <InterventionsPage /> },
        {
          path: 'interventions/:slug',
          element: <CommunePage />,
          getStaticPaths: () => COMMUNES.map((c) => `/interventions/${toSlug(c.nom)}`),
        },
        { path: 'contact', element: <ContactPage /> },
        { path: 'mentions-legales', element: <LegalPage /> },
      ],
    },
  ]
  ```
  (API `entry` / `getStaticPaths` : à confirmer contre la doc `vite-react-ssg` de la
  version installée au moment du plan — le principe reste : une fonction fournit la
  liste des chemins dynamiques à pré-rendre.)
- **`vite.config.ts`** : ajout du champ `ssgOptions` (`{ formatting: 'minify', dirStyle: 'nested' }`
  → un `dist/<route>/index.html` par page). Plugin `@vitejs/plugin-react` conservé.
- **`index.html`** : garde `<div id="root">` ; `vite-react-ssg` y injecte le HTML
  pré-rendu et le `<head>` collecté par Helmet. On y ajoute les meta statiques de
  fallback (voir §3).
- **`package.json`** script `build` :
  `node scripts/gen-og.mjs && node scripts/gen-webp.mjs && node scripts/gen-sitemap.mjs && tsc -b && vite-react-ssg build`
- **Nginx (action manuelle VPS, hors dépôt)** : la config doit servir les fichiers
  pré-rendus, pas un fallback SPA. Snippet à appliquer :
  ```nginx
  location / {
      try_files $uri $uri/ $uri/index.html =404;
  }
  ```
  (Remplace tout `try_files $uri /index.html;` existant.) Documenté ici ;
  l'agent n'a pas accès au serveur.

### 2. Composant SEO centralisé

- **`src/data/site.ts`** (nouveau) :
  ```ts
  export const SITE_URL = 'https://frelons-guepes-destruction.fr'
  export const SITE_NAME = 'Val Drôme Guêpes Frelons'
  export const DEFAULT_OG_IMAGE = '/og/default.png'
  export const GEO = { lat: 44.665, lng: 5.153, region: 'FR-26', placename: 'Saou' } // Saou (26400) — à affiner
  export const OPENING_HOURS = [
    { days: ['Mo','Tu','We','Th','Fr','Sa'], opens: '08:00', closes: '19:00' },
  ] // saison avril–novembre
  ```
- **`src/components/Seo.tsx`** (nouveau) — remplace tous les blocs `<Helmet>` des pages :
  ```tsx
  interface SeoProps {
    title: string
    description: string
    path: string            // ex. '/guepes' → canonical = SITE_URL + path
    image?: string          // défaut DEFAULT_OG_IMAGE
    jsonLd?: object[]        // objets schema.org
    noindex?: boolean
  }
  ```
  Rend via Helmet : `<title>`, `<meta name="description">`,
  `<link rel="canonical" href={SITE_URL+path}>`, `og:type=website`,
  `og:site_name`, `og:locale=fr_FR`, `og:title`, `og:description`, `og:url`,
  `og:image` (absolutisée), `twitter:card=summary_large_image`,
  `twitter:title/description/image`, `<meta name="robots" content="noindex">` si
  `noindex`, et un `<script type="application/ld+json">` par entrée `jsonLd`.
- **`src/data/content.ts`** : `email: 'contact@frelons-guepes-destruction.fr'`.

### 3. JSON-LD & fil d'Ariane

- **`src/lib/jsonLd.ts`** (nouveau) :
  - `localBusiness(opts?: { areaServed?: string })` →
    `@type: ['LocalBusiness', 'PestControl']`, `@id: SITE_URL + '/#business'`,
    `url`, `name`, `image: SITE_URL + '/images/logo-144.png'`, `telephone`, `email`,
    `address` (PostalAddress complet), `geo` (`GeoCoordinates` depuis `GEO`),
    `openingHoursSpecification` (depuis `OPENING_HOURS`),
    `areaServed` : tableau `{ '@type': 'City', name }` sur `COMMUNES_PRINCIPALES`
    (ou la commune passée en `opts.areaServed`), `priceRange: '€€'`.
  - `service(name, description, path)` → `@type: 'Service'`, `serviceType: name`,
    `provider: { '@id': SITE_URL + '/#business' }`, `areaServed: 'Drôme (26)'`,
    `url: SITE_URL + path`.
  - `breadcrumb(items: {name, path}[])` → `BreadcrumbList` avec `itemListElement`.
  - `faqPage(items: FaqItem[])` → `FAQPage` (déplacé depuis `FaqSection.tsx`,
    qui importe désormais ce helper et passe le résultat au `Seo` de la page hôte
    OU garde son `<script>` inline — voir note ci-dessous).
- **`src/components/Breadcrumb.tsx`** (nouveau) : fil d'Ariane visible
  (`Accueil › Interventions › Crest`), rendu sur pages communes et services.
  Le JSON-LD `BreadcrumbList` correspondant est produit par `breadcrumb()` et
  passé au `<Seo jsonLd={[...]}>` de la page (le composant visuel ne rend pas le script).
- **`FaqSection.tsx`** : garde son rendu accordéon. Le JSON-LD `FAQPage` : soit
  reste inline dans la section (statut actuel, désormais pré-rendu donc OK), soit
  remonte à la page via une prop. Décision au plan : **le laisser inline** est le
  moindre changement et fonctionne maintenant que la page est pré-rendue.

**Répartition par page :**

| Page | `jsonLd` |
|---|---|
| Home | `[localBusiness()]` |
| Guêpes | `[service('Destruction de nids de guêpes', …, '/guepes'), breadcrumb([Accueil, Guêpes])]` |
| Frelons | `[service('Destruction de nids de frelons', …, '/frelons'), breadcrumb(…)]` |
| Fourmis | `[service('Destruction de fourmilières', …, '/fourmis'), breadcrumb(…)]` |
| Interventions | `[breadcrumb([Accueil, Interventions])]` |
| Commune `:slug` | `[localBusiness({ areaServed: commune.nom }), breadcrumb([Accueil, Interventions, commune.nom])]` |
| Contact | `[localBusiness()]` |
| Mentions légales | `[]`, `noindex` non (indexable, priorité basse) |

### 4. Pages communes enrichies (niveau A)

- **`src/data/communes.ts`** : `COMMUNES: string[]` → `COMMUNES: Commune[]` :
  ```ts
  interface Commune {
    nom: string
    secteur: string          // 'Crestois' | 'Pays de Dieulefit' | 'Val de Drôme' | 'Baronnies' | 'Tricastin' | 'Vallée de la Drôme' | …
    cp: string
    limitrophes: string[]     // 3–4 noms présents dans COMMUNES
    distanceMin: number       // temps route approx. depuis Saou (par secteur)
  }
  ```
  ~60 lignes remplies à la main. `COMMUNES_PRINCIPALES` : filtre sur `.nom`.
  Dédoublonner la liste actuelle (`Grâne`/`Grane`, `Puy Saint-Martin`/`Puy-Saint-Martin`,
  `Saou`/`Saou`) au passage.
- **`src/utils/communeSlug.ts`** : inchangé, appelé sur `c.nom`.
- **`src/pages/CommunePage.tsx`** : `COMMUNES.find(c => toSlug(c.nom) === slug)`.
  Contenu généré, ~180–250 mots distincts par page :
  - `<Seo>` : title `Destruction guêpes et frelons à {nom} ({secteur}) — {SITE_NAME}`,
    description incluant secteur + CP.
  - `<Breadcrumb>` visible.
  - H1 : `Destruction de guêpes et frelons à {nom}`.
  - Intro : secteur, CP, rattachement géographique.
  - Bloc « Intervention à {nom} et communes voisines » : phrase citant
    `limitrophes` avec `<Link to={/interventions/${toSlug(l)}}>` (maillage interne).
  - Bloc délai : « Depuis notre base de Saou, un technicien rejoint {nom} en
    environ {distanceMin} minutes. »
  - Services : liens réels vers `/guepes`, `/frelons` (× frelon asiatique), `/fourmis`
    (remplace les `<span>` pills).
  - FAQ locale courte (2 questions génériques réutilisées + 1 mentionnant le secteur),
    via `FaqSection`.
  - Route 404 : commune introuvable → rend le composant `NotFound` avec
    `<Seo noindex>` (le statut HTTP 404 réel dépend de nginx `=404` sur fichier absent ;
    les slugs non générés n'existent pas dans `dist/` donc renvoient 404 nativement).

### 5. Sitemap, robots

- **`scripts/gen-sitemap.mjs`** (nouveau, Node ESM, lancé avant le build) :
  - importe `COMMUNES` (via un import dynamique du `.ts` compilé ou un parse simple —
    au plan : le plus robuste est de faire de `communes.ts` un module importable par
    Node, sans dépendance React ; c'est déjà le cas).
  - URLs : `/`, `/guepes`, `/frelons`, `/fourmis`, `/interventions`, `/contact`,
    `/mentions-legales`, + `/interventions/{slug}` pour chaque commune.
  - `<lastmod>` = date ISO du build. `<priority>` : `1.0` home, `0.8` services,
    `0.7` interventions, `0.6` communes + contact, `0.3` mentions légales.
    `<changefreq>` : `monthly` fixe, `yearly` mentions légales.
  - écrit `public/sitemap.xml` (écrasé à chaque build).
- **`public/robots.txt`** : inchangé (déjà correct, pointe le bon domaine et le sitemap).

### 6. Assets & index.html

- **`scripts/gen-og.mjs`** (sharp) : génère `public/og/default.png`, `guepes.png`,
  `frelons.png`, `fourmis.png` (1200×630, fond `#1A1A1A`, logo `logo-144.png`
  centré, titre en Rajdhani blanc + accent jaune `#FFD600`). Placeholders — à
  remplacer par de vrais visuels plus tard. Idempotent (skip si présent + à jour ?
  → au plan : régénère toujours, coût négligeable).
- **`scripts/gen-webp.mjs`** (sharp) : pour chaque `public/photos/*.{jpg,png}` et
  `public/images/*.png` (hors `og/`, hors `logo-*`), produit un `.webp` à côté.
- **`public/manifest.json`** (nouveau) : `name: "Val Drôme Guêpes Frelons"`,
  `short_name: "Val Drôme G&F"`, `start_url: "/"`, `display: "standalone"`,
  `theme_color: "#FFD600"`, `background_color: "#1A1A1A"`, `icons` pointant
  `logo-48/96/144.png` (48, 96, 144).
- **`public/apple-touch-icon.png`** (nouveau, 180×180) : généré depuis `logo-144.png`
  par `gen-og.mjs` (ou un pas dédié), fond `#1A1A1A`.
- **`index.html`** `<head>` — ajouts statiques (fallback avant hydratation / pour
  crawlers non-JS sur la home) :
  ```html
  <meta name="description" content="Destruction de nids de guêpes, frelons et frelons asiatiques dans la Drôme. Professionnel certifié Certibiocide. Intervention rapide sous 24h sur 60+ communes." />
  <link rel="canonical" href="https://frelons-guepes-destruction.fr/" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Val Drôme Guêpes Frelons" />
  <meta property="og:locale" content="fr_FR" />
  <meta property="og:title" content="Destruction de Guêpes & Frelons dans la Drôme" />
  <meta property="og:description" content="Professionnel certifié Certibiocide. Intervention rapide sous 24h dans la Drôme." />
  <meta property="og:url" content="https://frelons-guepes-destruction.fr/" />
  <meta property="og:image" content="https://frelons-guepes-destruction.fr/og/default.png" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="theme-color" content="#FFD600" />
  <meta name="geo.region" content="FR-26" />
  <meta name="geo.placename" content="Saou" />
  <link rel="manifest" href="/manifest.json" />
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
  ```
  (Sur les routes pré-rendues, Helmet via `<Seo>` surcharge title/description/canonical/OG
  au build ; `vite-react-ssg` gère la dédup du `<head>`.)

### 7. Images du site (composants)

- **`HeroSection.tsx`** : `<img>` → `<picture>` avec `<source srcSet=".webp" type="image/webp">`,
  `width`/`height` explicites (ratio de `destruction-guepes-frelons-drome.png`),
  `fetchPriority="high"` conservé. Envisager d'afficher l'image aussi en mobile
  (actuellement `hidden md:block`) — **décision : la garder desktop-only** pour ne
  pas alourdir le LCP mobile ; hors périmètre de retravailler le layout hero.
- **`PhotoCarousel.tsx`** : `motion.img` → ajout `loading="lazy"`, `width`/`height`,
  et `<picture>`/`.webp` (ou `onError` fallback). `alt` déjà correct.

### 8. Mentions légales

- **`src/pages/LegalPage.tsx`** (nouveau) + route `/mentions-legales` + lien Footer
  (ajout dans `LIENS_UTILES` ou une ligne dédiée sous la barre copyright).
- Contenu : éditeur (Maxime CHAMPELEY, 27 Chemin de Sauvionne, 26400 SAOU),
  SIRET `752 535 377 00028`, Certibiocide N°`0315595`, directeur de la publication
  (Maxime CHAMPELEY), hébergeur (Hostinger International Ltd., 61 Lordou Vironos
  Street, 6023 Larnaca, Chypre), propriété intellectuelle, absence de collecte de
  données personnelles (pas de formulaire ni de cookie/analytics à ce jour),
  contact `contact@frelons-guepes-destruction.fr`.
- `<Seo>` : indexable, priorité basse.

## Découpage en unités

| Unité | Rôle | Dépend de |
|---|---|---|
| `data/site.ts` | constantes site (URL, geo, horaires) | — |
| `data/communes.ts` (refonte) | données communes enrichies + typées | — |
| `data/content.ts` (fix email) | coordonnées entreprise | — |
| `lib/jsonLd.ts` | builders schema.org | `data/site`, `data/content`, `data/communes` |
| `components/Seo.tsx` | `<head>` centralisé (title/meta/canonical/OG/JSON-LD) | `react-helmet-async`, `data/site` |
| `components/Breadcrumb.tsx` | fil d'Ariane visible | `react-router-dom` |
| `App.tsx` (refonte) | export `routes` + `getStaticPaths` | pages, `data/communes` |
| `main.tsx` (refonte) | entrée `ViteReactSSG` | `App` |
| pages `*.tsx` | remplacent `<Helmet>` par `<Seo>`, ajoutent JSON-LD | `Seo`, `Breadcrumb`, `lib/jsonLd` |
| `pages/CommunePage.tsx` (refonte) | contenu enrichi par commune | `data/communes`, `Seo`, `Breadcrumb`, `FaqSection` |
| `pages/LegalPage.tsx` (nouveau) | mentions légales | `Seo`, `data/content` |
| `scripts/gen-sitemap.mjs` | sitemap au build | `data/communes` |
| `scripts/gen-og.mjs` | images OG + apple-touch-icon | `sharp`, `public/images/logo-144.png` |
| `scripts/gen-webp.mjs` | variantes WebP | `sharp`, `public/photos`, `public/images` |
| `vite.config.ts` (edit) | `ssgOptions` | `vite-react-ssg` |
| `package.json` (edit) | scripts build + dép `vite-react-ssg` | — |
| `index.html` (edit) | meta statiques fallback | assets `/og`, `/manifest.json` |

## Tests & vérification

Le projet n'a pas de framework de test. Vérification :

1. **Build** : `npm run build` réussit. `dist/` contient :
   - `index.html`, `guepes/index.html`, `frelons/index.html`, `fourmis/index.html`,
     `interventions/index.html`, `contact/index.html`, `mentions-legales/index.html`
   - `interventions/<slug>/index.html` pour **chaque** commune (compter =
     `COMMUNES.length` après dédup).
   - `sitemap.xml` listant toutes ces URLs.
   - `og/default.png` + 3 autres, `manifest.json`, `apple-touch-icon.png`,
     `.webp` à côté de chaque photo.
2. **Contenu dans le HTML source** (sans JS) : `grep` dans
   `dist/guepes/index.html` → présence du `<h1>`, de la `<meta name="description">`,
   du `<link rel="canonical">`, du `<script type="application/ld+json">` avec le
   bon `@type`. Idem pour une page commune (`dist/interventions/crest/index.html`) :
   nom de la commune, communes limitrophes, canonical propre.
3. **Unicité** : les descriptions et titres diffèrent entre 3 pages communes
   échantillonnées ; le corps de texte diffère (secteur, limitrophes, distance).
4. **Validation** : passer `dist/index.html` et une page commune au
   [validateur Schema.org](https://validator.schema.org/) et au
   [Rich Results Test](https://search.google.com/test/rich-results) — 0 erreur.
5. **`npm run preview`** : navigation client OK (hydratation sans warning React
   « hydration mismatch » en console), animations framer-motion fonctionnelles,
   liens internes des pages communes actifs.
6. **`npm run lint`** : 0 erreur.
7. **Liens** : vérifier qu'aucune `limitrophe` ne pointe vers un slug inexistant
   (test simple dans `gen-sitemap.mjs` ou un script de check : chaque
   `commune.limitrophes[i]` existe dans `COMMUNES`).
8. **Regression visuelle manuelle** : la home, une page service et une page commune
   s'affichent comme avant (hors ajouts : breadcrumb, contenu commune).

## Risques

- **API `vite-react-ssg`** : les noms exacts (`getStaticPaths`, `ssgOptions`,
  signature de `ViteReactSSG`) doivent être vérifiés contre la version installée
  au moment du plan. Le principe (entrée dédiée + fonction listant les chemins
  dynamiques) est stable.
- **Hydration mismatch** : `new Date().getFullYear()` dans `Footer.tsx` (ligne 69) —
  identique build/client sauf passage de minuit ; acceptable, ou figer via
  constante au build. `useCountUp` part de `0` des deux côtés → OK.
- **framer-motion `whileInView` / `useInView`** : s'exécutent après hydratation ;
  le contenu des `motion.*` est bien pré-rendu (enfants présents dans le HTML),
  seul l'état animé initial (opacity 0) peut provoquer un flash — acceptable,
  comportement déjà présent.
- **Nginx** : si la config VPS garde un fallback SPA `try_files $uri /index.html`,
  les nouvelles routes fichiers fonctionneront quand même (le fichier existe) mais
  un 404 sur slug inconnu renverrait la home au lieu d'un 404 — d'où le snippet
  `=404` à appliquer manuellement.
- **`sharp`** en CI : déjà dans `devDependencies`, `npm ci` sur `ubuntu-latest`
  (Node 22) le construit sans souci.
