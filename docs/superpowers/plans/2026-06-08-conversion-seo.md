# Conversion & SEO Local — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Augmenter les appels téléphoniques via des signaux d'urgence et de confiance, puis améliorer le référencement local par des pages communes et des FAQ structurées.

**Architecture:** Composants React autonomes intégrés dans le Layout existant pour la conversion. Pages dynamiques via React Router pour le SEO communes. Composant FAQ partagé pour les trois pages nuisibles.

**Tech Stack:** React 18, TypeScript, React Router 7, Framer Motion, Tailwind CSS, react-helmet-async, lucide-react

---

## File Map

| Fichier | Action |
|---|---|
| `src/data/content.ts` | Modifier — ajouter `URGENCE` |
| `src/components/UrgencyBanner.tsx` | Créer |
| `src/components/FloatingCallButton.tsx` | Créer |
| `src/components/FaqSection.tsx` | Créer |
| `src/components/Layout.tsx` | Modifier — intégrer UrgencyBanner + FloatingCallButton |
| `src/pages/HomePage.tsx` | Modifier — ajouter section "Pourquoi nous" |
| `src/pages/GuepesPage.tsx` | Modifier — ajouter FaqSection |
| `src/pages/FrelonsPage.tsx` | Modifier — ajouter FaqSection |
| `src/pages/FourmisPage.tsx` | Modifier — ajouter FaqSection |
| `src/pages/CommunePage.tsx` | Créer |
| `src/pages/InterventionsPage.tsx` | Modifier — badges → liens vers pages communes |
| `src/App.tsx` | Modifier — ajouter route `/interventions/:slug` |

> Note: La navbar a déjà un bouton d'appel desktop (`hidden md:flex`). Aucune modification nécessaire.

---

## Task 1 : Données urgence dans content.ts

**Files:**
- Modify: `src/data/content.ts`

- [ ] **Step 1 : Ajouter la constante URGENCE**

Dans `src/data/content.ts`, ajouter après la constante `STATS` :

```ts
export const URGENCE = {
  active: true,
  message: "Saison des frelons asiatiques en cours — Intervention sous 24h",
} as const
```

- [ ] **Step 2 : Vérifier la compilation TypeScript**

```bash
npx tsc --noEmit
```

Expected: aucune erreur

- [ ] **Step 3 : Commit**

```bash
git add src/data/content.ts
git commit -m "feat: add URGENCE seasonal flag to content"
```

---

## Task 2 : Composant UrgencyBanner

**Files:**
- Create: `src/components/UrgencyBanner.tsx`

- [ ] **Step 1 : Créer le composant**

```tsx
import { Phone } from 'lucide-react'
import { CONTACT, URGENCE } from '../data/content'

export default function UrgencyBanner() {
  if (!URGENCE.active) return null

  return (
    <div className="bg-wasp-yellow px-4 py-2">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <p className="font-poppins text-xs font-semibold text-wasp-black md:text-sm">
          {URGENCE.message}
        </p>
        <a
          href={CONTACT.telephoneHref}
          className="flex shrink-0 items-center gap-1.5 font-rajdhani font-bold text-wasp-black text-sm hover:underline"
        >
          <Phone className="h-3.5 w-3.5" />
          {CONTACT.telephone}
        </a>
      </div>
    </div>
  )
}
```

- [ ] **Step 2 : Vérifier la compilation TypeScript**

```bash
npx tsc --noEmit
```

Expected: aucune erreur

- [ ] **Step 3 : Commit**

```bash
git add src/components/UrgencyBanner.tsx
git commit -m "feat: add UrgencyBanner seasonal component"
```

---

## Task 3 : Composant FloatingCallButton

**Files:**
- Create: `src/components/FloatingCallButton.tsx`

- [ ] **Step 1 : Créer le composant**

```tsx
import { Phone } from 'lucide-react'
import { CONTACT } from '../data/content'

export default function FloatingCallButton() {
  return (
    <a
      href={CONTACT.telephoneHref}
      className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full bg-wasp-yellow px-5 py-3 font-rajdhani text-base font-bold text-wasp-black shadow-lg transition-opacity hover:opacity-90 md:hidden"
      aria-label="Appeler maintenant"
    >
      <Phone className="h-5 w-5" />
      Appeler
    </a>
  )
}
```

- [ ] **Step 2 : Vérifier la compilation TypeScript**

```bash
npx tsc --noEmit
```

Expected: aucune erreur

- [ ] **Step 3 : Commit**

```bash
git add src/components/FloatingCallButton.tsx
git commit -m "feat: add FloatingCallButton for mobile"
```

---

## Task 4 : Intégrer UrgencyBanner et FloatingCallButton dans Layout

**Files:**
- Modify: `src/components/Layout.tsx`

- [ ] **Step 1 : Mettre à jour Layout.tsx**

Remplacer le contenu entier de `src/components/Layout.tsx` :

```tsx
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import CtaBanner from './CtaBanner'
import UrgencyBanner from './UrgencyBanner'
import FloatingCallButton from './FloatingCallButton'

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <UrgencyBanner />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CtaBanner />
      <FloatingCallButton />
      <div className="h-16 md:hidden" />
    </div>
  )
}
```

- [ ] **Step 2 : Démarrer le serveur de dev et vérifier visuellement**

```bash
npm run dev
```

Vérifier : bandeau jaune visible en haut de page, bouton flottant visible sur mobile (DevTools responsive), disparaît sur desktop.

- [ ] **Step 3 : Commit**

```bash
git add src/components/Layout.tsx
git commit -m "feat: integrate UrgencyBanner and FloatingCallButton in Layout"
```

---

## Task 5 : Section "Pourquoi nous" sur HomePage

**Files:**
- Modify: `src/pages/HomePage.tsx`

- [ ] **Step 1 : Ajouter les imports nécessaires**

En haut de `src/pages/HomePage.tsx`, les imports `lucide-react` existent déjà. Ajouter `Award, Clock, ThumbsUp` si pas présents. La ligne d'import devient :

```tsx
import { Bug, Zap, Shield, ChevronRight, Award, Clock, ThumbsUp } from 'lucide-react'
```

- [ ] **Step 2 : Ajouter les données des garanties**

Après la constante `SERVICES` (ligne ~76), ajouter :

```tsx
const GARANTIES = [
  {
    icon: <Award className="h-6 w-6 text-wasp-yellow" />,
    title: 'Certibiocide certifié',
    detail: `N°${CONTACT.certibiocide} — habilitation officielle`,
  },
  {
    icon: <Clock className="h-6 w-6 text-wasp-yellow" />,
    title: 'Intervention sous 24h',
    detail: 'Réactivité maximale en saison',
  },
  {
    icon: <Bug className="h-6 w-6 text-wasp-yellow" />,
    title: '+400 nids traités',
    detail: 'Expérience terrain éprouvée',
  },
  {
    icon: <ThumbsUp className="h-6 w-6 text-wasp-yellow" />,
    title: 'Produits homologués',
    detail: 'Biocides raisonnés, respectueux de l\'environnement',
  },
] as const
```

- [ ] **Step 3 : Insérer la section dans le JSX**

Dans le JSX de `HomePage`, entre `</section>` (fin de la section Services) et `<WaspStripeDivider />` qui précède la section "Professionnel habilité", insérer :

```tsx
<WaspStripeDivider />

<section className="py-16">
  <div className="mx-auto max-w-7xl px-4">
    <motion.h2
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mb-10 text-center font-rajdhani text-3xl font-black text-wasp-black md:text-4xl"
    >
      Pourquoi nous choisir ?
    </motion.h2>
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {GARANTIES.map(({ icon, title, detail }, i) => (
        <motion.div
          key={title}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1, duration: 0.4 }}
          className="flex flex-col items-center rounded-xl bg-wasp-light p-6 text-center"
        >
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-wasp-yellow/10">
            {icon}
          </div>
          <h3 className="mb-1 font-rajdhani text-lg font-bold text-wasp-black">{title}</h3>
          <p className="font-poppins text-xs text-wasp-gray">{detail}</p>
        </motion.div>
      ))}
    </div>
  </div>
</section>
```

- [ ] **Step 4 : Ajouter l'import de CONTACT si absent**

Vérifier que `CONTACT` est bien importé depuis `'../data/content'` — il l'est déjà à la ligne 8.

- [ ] **Step 5 : Vérifier visuellement**

```bash
npm run dev
```

Vérifier : section "Pourquoi nous choisir ?" affichée entre Services et "Professionnel habilité", 4 cartes en grille.

- [ ] **Step 6 : Commit**

```bash
git add src/pages/HomePage.tsx
git commit -m "feat: add 'Pourquoi nous' trust section on HomePage"
```

---

## Task 6 : Composant FaqSection

**Files:**
- Create: `src/components/FaqSection.tsx`

- [ ] **Step 1 : Créer le composant accordéon**

```tsx
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

export interface FaqItem {
  question: string
  answer: string
}

interface FaqSectionProps {
  items: FaqItem[]
  jsonLdId?: string
}

export default function FaqSection({ items, jsonLdId = 'faq' }: FaqSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    })),
  }

  return (
    <section className="bg-wasp-light py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        id={jsonLdId}
      />
      <div className="mx-auto max-w-3xl px-4">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8 text-center font-rajdhani text-3xl font-black text-wasp-black"
        >
          Questions fréquentes
        </motion.h2>
        <div className="space-y-2">
          {items.map(({ question, answer }, i) => (
            <div key={i} className="overflow-hidden rounded-xl bg-white shadow-sm">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="flex w-full items-center justify-between px-5 py-4 text-left"
                aria-expanded={openIndex === i}
              >
                <span className="font-poppins text-sm font-semibold text-wasp-black">
                  {question}
                </span>
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-wasp-yellow transition-transform ${
                    openIndex === i ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <AnimatePresence initial={false}>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <p className="border-t border-gray-100 px-5 py-4 font-poppins text-sm leading-relaxed text-wasp-gray">
                      {answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2 : Vérifier la compilation TypeScript**

```bash
npx tsc --noEmit
```

Expected: aucune erreur

- [ ] **Step 3 : Commit**

```bash
git add src/components/FaqSection.tsx
git commit -m "feat: add FaqSection accordion with schema.org FAQPage markup"
```

---

## Task 7 : FAQ sur GuepesPage

**Files:**
- Modify: `src/pages/GuepesPage.tsx`

- [ ] **Step 1 : Ajouter l'import de FaqSection**

En haut de `src/pages/GuepesPage.tsx`, ajouter :

```tsx
import FaqSection, { FaqItem } from '../components/FaqSection'
```

- [ ] **Step 2 : Ajouter les données FAQ**

Avant le `export default function GuepesPage()`, ajouter :

```tsx
const FAQ_GUEPES: FaqItem[] = [
  {
    question: "Quel est le prix d'une destruction de nid de guêpes ?",
    answer: "Le tarif dépend de l'accessibilité et de la taille du nid. Contactez-nous pour un devis gratuit par téléphone.",
  },
  {
    question: "Faut-il détruire le nid ou seulement traiter les guêpes ?",
    answer: "L'idéal est de détruire le nid après traitement pour éviter toute réinfestation. Le professionnel évalue la situation sur place.",
  },
  {
    question: "Est-ce dangereux d'intervenir soi-même sur un nid de guêpes ?",
    answer: "Oui. Les guêpes deviennent très agressives lorsqu'elles se sentent menacées. Une attaque en masse peut être grave, voire mortelle pour les personnes allergiques.",
  },
  {
    question: "Combien de temps dure une intervention ?",
    answer: "Une intervention standard dure entre 20 et 45 minutes selon la localisation du nid et son accessibilité.",
  },
  {
    question: "Le traitement est-il sans danger pour mes enfants et animaux ?",
    answer: "Les biocides utilisés sont homologués et appliqués de manière raisonnée. Il est conseillé de laisser la zone ventilée quelques heures après l'intervention.",
  },
]
```

- [ ] **Step 3 : Ajouter FaqSection avant la fermeture du fragment**

Dans le JSX de `GuepesPage`, avant le `</>` final, ajouter :

```tsx
<WaspStripeDivider />
<FaqSection items={FAQ_GUEPES} jsonLdId="faq-guepes" />
```

- [ ] **Step 4 : Vérifier visuellement**

```bash
npm run dev
```

Naviguer vers `/guepes`. La section FAQ doit apparaître en bas de page avec accordéon fonctionnel.

- [ ] **Step 5 : Commit**

```bash
git add src/pages/GuepesPage.tsx
git commit -m "feat: add FAQ section with schema markup to GuepesPage"
```

---

## Task 8 : FAQ sur FrelonsPage

**Files:**
- Modify: `src/pages/FrelonsPage.tsx`

- [ ] **Step 1 : Lire le fichier pour connaître sa structure**

Lire `src/pages/FrelonsPage.tsx` pour identifier la fin du JSX.

- [ ] **Step 2 : Ajouter l'import de FaqSection**

En haut de `src/pages/FrelonsPage.tsx`, ajouter :

```tsx
import FaqSection, { FaqItem } from '../components/FaqSection'
```

- [ ] **Step 3 : Ajouter les données FAQ**

Avant le `export default function FrelonsPage()`, ajouter :

```tsx
const FAQ_FRELONS: FaqItem[] = [
  {
    question: "Comment reconnaître un frelon asiatique ?",
    answer: "Le frelon asiatique (Vespa velutina) est plus petit que l'européen. Il a un abdomen majoritairement noir avec une bande orange sur le 4ème segment, et des pattes jaunes à l'extrémité.",
  },
  {
    question: "Le frelon asiatique est-il plus dangereux que l'européen ?",
    answer: "Pas davantage pour l'humain en termes de venin, mais il est une menace majeure pour les abeilles et la biodiversité. En revanche, il peut attaquer en masse si le nid est menacé.",
  },
  {
    question: "Qui contacter pour un nid de frelons asiatiques ?",
    answer: "Contactez un professionnel certifié Certibiocide comme Val Drôme Guêpes Frelons. Ne tentez jamais d'intervenir vous-même sur un nid de frelons.",
  },
  {
    question: "La destruction d'un nid de frelons asiatiques est-elle obligatoire ?",
    answer: "Elle n'est pas légalement obligatoire pour les particuliers, mais fortement recommandée pour protéger les populations d'abeilles et éviter tout accident.",
  },
  {
    question: "Quel est le délai d'intervention ?",
    answer: "Nous intervenons sous 24h maximum en saison (avril à octobre). Appelez-nous directement pour une prise en charge rapide.",
  },
]
```

- [ ] **Step 4 : Ajouter FaqSection avant la fermeture du fragment**

Dans le JSX de `FrelonsPage`, avant le `</>` final, ajouter :

```tsx
<WaspStripeDivider />
<FaqSection items={FAQ_FRELONS} jsonLdId="faq-frelons" />
```

- [ ] **Step 5 : Commit**

```bash
git add src/pages/FrelonsPage.tsx
git commit -m "feat: add FAQ section with schema markup to FrelonsPage"
```

---

## Task 9 : FAQ sur FourmisPage

**Files:**
- Modify: `src/pages/FourmisPage.tsx`

- [ ] **Step 1 : Lire le fichier pour connaître sa structure**

Lire `src/pages/FourmisPage.tsx` pour identifier la fin du JSX.

- [ ] **Step 2 : Ajouter l'import de FaqSection**

En haut de `src/pages/FourmisPage.tsx`, ajouter :

```tsx
import FaqSection, { FaqItem } from '../components/FaqSection'
```

- [ ] **Step 3 : Ajouter les données FAQ**

Avant le `export default function FourmisPage()`, ajouter :

```tsx
const FAQ_FOURMIS: FaqItem[] = [
  {
    question: "Quels produits utilisez-vous contre les fourmis ?",
    answer: "Nous utilisons exclusivement des biocides homologués, adaptés à chaque espèce et appliqués de manière raisonnée pour limiter l'impact environnemental.",
  },
  {
    question: "Combien de temps dure le traitement anti-fourmis ?",
    answer: "L'intervention dure généralement entre 30 et 60 minutes. Les effets du traitement se font sentir dans les 24 à 72 heures.",
  },
  {
    question: "Les fourmis peuvent-elles revenir après traitement ?",
    answer: "Un traitement professionnel cible la reine et la colonie. Sans reine, la fourmilière disparaît. Le risque de retour est faible mais dépend de l'environnement.",
  },
  {
    question: "Intervenez-vous en intérieur ?",
    answer: "Oui, nous intervenons aussi bien en extérieur qu'en intérieur. Les produits utilisés sont adaptés aux espaces habitables.",
  },
  {
    question: "Le traitement est-il sans danger pour les animaux domestiques ?",
    answer: "Oui, à condition de respecter les consignes post-traitement (ventilation de la pièce, ne pas laisser les animaux sur les zones traitées pendant quelques heures).",
  },
]
```

- [ ] **Step 4 : Ajouter FaqSection avant la fermeture du fragment**

Dans le JSX de `FourmisPage`, avant le `</>` final, ajouter :

```tsx
<WaspStripeDivider />
<FaqSection items={FAQ_FOURMIS} jsonLdId="faq-fourmis" />
```

- [ ] **Step 5 : Commit**

```bash
git add src/pages/FourmisPage.tsx
git commit -m "feat: add FAQ section with schema markup to FourmisPage"
```

---

## Task 10 : Utilitaire de slug commune

**Files:**
- Create: `src/utils/communeSlug.ts`

- [ ] **Step 1 : Créer l'utilitaire**

```ts
export function toSlug(commune: string): string {
  return commune
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}
```

- [ ] **Step 2 : Vérifier la compilation TypeScript**

```bash
npx tsc --noEmit
```

Expected: aucune erreur

- [ ] **Step 3 : Commit**

```bash
git add src/utils/communeSlug.ts
git commit -m "feat: add communeSlug utility for SEO URL generation"
```

---

## Task 11 : Page commune dynamique

**Files:**
- Create: `src/pages/CommunePage.tsx`

- [ ] **Step 1 : Créer la page**

```tsx
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Phone } from 'lucide-react'
import { COMMUNES } from '../data/communes'
import { CONTACT } from '../data/content'
import { toSlug } from '../utils/communeSlug'

export default function CommunePage() {
  const { slug } = useParams<{ slug: string }>()

  const commune = COMMUNES.find((c) => toSlug(c) === slug)

  if (!commune) {
    return (
      <div className="py-32 text-center font-poppins text-wasp-gray">
        <p className="mb-4 text-lg">Commune non trouvée.</p>
        <Link to="/interventions" className="text-wasp-yellow underline">
          Voir toutes les zones d'intervention
        </Link>
      </div>
    )
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: CONTACT.nom,
    telephone: CONTACT.telephone,
    email: CONTACT.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: CONTACT.adresse,
      postalCode: CONTACT.codePostal,
      addressLocality: CONTACT.ville,
      addressCountry: 'FR',
    },
    areaServed: commune,
  }

  return (
    <>
      <Helmet>
        <title>Destruction guêpes et frelons à {commune} — Val Drôme Guêpes Frelons</title>
        <meta
          name="description"
          content={`Intervention rapide pour destruction de nids de guêpes, frelons et fourmis à ${commune} et alentours. Certibiocide N°${CONTACT.certibiocide}. Appelez le ${CONTACT.telephone}.`}
        />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <section className="bg-wasp-black py-20">
        <div className="mx-auto max-w-7xl px-4">
          <p className="mb-3 font-poppins text-xs font-bold uppercase tracking-[3px] text-wasp-yellow">
            Intervention rapide · {commune}
          </p>
          <h1 className="mb-4 font-rajdhani text-4xl font-black leading-tight text-white md:text-5xl">
            Destruction de guêpes et frelons à{' '}
            <span className="text-wasp-yellow">{commune}</span>
          </h1>
          <p className="mb-8 max-w-xl font-poppins text-base text-white/60">
            Val Drôme Guêpes Frelons intervient à {commune} et dans les communes environnantes pour
            la destruction professionnelle de nids de guêpes, frelons et fourmis. Biocides
            homologués, Certibiocide N°{CONTACT.certibiocide}.
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
            Nos services à {commune}
          </h2>
          <div className="flex flex-wrap gap-3">
            {['Destruction de guêpes', 'Destruction de frelons', 'Destruction de frelons asiatiques', 'Destruction de fourmis'].map((service) => (
              <span
                key={service}
                className="rounded-full bg-wasp-yellow/10 px-4 py-2 font-poppins text-sm font-semibold text-wasp-black"
              >
                {service}
              </span>
            ))}
          </div>
          <p className="mt-6 font-poppins text-sm text-wasp-gray">
            <Link to="/interventions" className="text-wasp-yellow hover:underline">
              ← Voir toutes nos zones d'intervention
            </Link>
          </p>
        </div>
      </section>
    </>
  )
}
```

- [ ] **Step 2 : Vérifier la compilation TypeScript**

```bash
npx tsc --noEmit
```

Expected: aucune erreur

- [ ] **Step 3 : Commit**

```bash
git add src/pages/CommunePage.tsx
git commit -m "feat: add dynamic CommunePage for local SEO"
```

---

## Task 12 : Route dans App.tsx

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1 : Ajouter l'import et la route**

Remplacer le contenu de `src/App.tsx` :

```tsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import GuepesPage from './pages/GuepesPage'
import FrelonsPage from './pages/FrelonsPage'
import FourmisPage from './pages/FourmisPage'
import InterventionsPage from './pages/InterventionsPage'
import ContactPage from './pages/ContactPage'
import CommunePage from './pages/CommunePage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'guepes', element: <GuepesPage /> },
      { path: 'frelons', element: <FrelonsPage /> },
      { path: 'fourmis', element: <FourmisPage /> },
      { path: 'interventions', element: <InterventionsPage /> },
      { path: 'interventions/:slug', element: <CommunePage /> },
      { path: 'contact', element: <ContactPage /> },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
```

- [ ] **Step 2 : Tester la route manuellement**

```bash
npm run dev
```

Naviguer vers `http://localhost:5173/interventions/crest`. La page "Destruction de guêpes et frelons à Crest" doit s'afficher.

Naviguer vers `http://localhost:5173/interventions/commune-inexistante`. Le fallback "Commune non trouvée" doit s'afficher.

- [ ] **Step 3 : Commit**

```bash
git add src/App.tsx
git commit -m "feat: add /interventions/:slug route for commune pages"
```

---

## Task 13 : Liens depuis InterventionsPage vers pages communes

**Files:**
- Modify: `src/pages/InterventionsPage.tsx`

- [ ] **Step 1 : Ajouter les imports**

En haut de `src/pages/InterventionsPage.tsx`, ajouter :

```tsx
import { Link } from 'react-router-dom'
import { toSlug } from '../utils/communeSlug'
```

`Link` est déjà importé depuis react-router-dom si ce n'est pas le cas — vérifier.

- [ ] **Step 2 : Transformer les badges en liens**

Dans le JSX, remplacer le bloc `{COMMUNES.map((commune) => (` :

```tsx
{COMMUNES.map((commune) => (
  <Link
    key={commune}
    to={`/interventions/${toSlug(commune)}`}
    className="rounded-full bg-wasp-dark px-3 py-1 font-poppins text-sm text-white/80 transition-colors hover:bg-wasp-yellow hover:text-wasp-black"
  >
    {commune}
  </Link>
))}
```

- [ ] **Step 3 : Vérifier visuellement**

```bash
npm run dev
```

Naviguer vers `/interventions`. Cliquer sur une commune — ça doit rediriger vers `/interventions/[slug]`. Le style au hover doit passer en jaune.

- [ ] **Step 4 : Commit**

```bash
git add src/pages/InterventionsPage.tsx src/utils/communeSlug.ts
git commit -m "feat: link commune badges to individual SEO pages on InterventionsPage"
```

---

## Vérification finale

- [ ] `npx tsc --noEmit` — aucune erreur TypeScript
- [ ] `npm run build` — build de production sans erreur
- [ ] Vérifier sur mobile (DevTools) : bouton flottant visible, bannière urgence visible
- [ ] Vérifier `/interventions/crest` : page s'affiche avec titre localisé
- [ ] Vérifier `/guepes`, `/frelons`, `/fourmis` : FAQ accordéon fonctionnel
- [ ] Vérifier source HTML de `/interventions/crest` : JSON-LD LocalBusiness présent
- [ ] Vérifier source HTML de `/guepes` : JSON-LD FAQPage présent
