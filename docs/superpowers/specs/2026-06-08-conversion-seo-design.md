---
name: conversion-seo-phase2
description: Améliorations conversion (appels) et SEO local (pages communes) pour Val Drôme Guêpes Frelons
metadata:
  type: project
---

# Phase 2 — Conversion & SEO local

## Contexte

Site de reconstruction après disparition du prestataire original. Le trafic provient principalement de la fiche Google My Business. L'objectif est d'abord de maximiser les appels téléphoniques, puis d'améliorer le référencement local.

Peu d'avis Google disponibles — les signaux de confiance reposent sur la certification Certibiocide, les stats (+400 nids, 24h, 60+ communes) et les garanties métier.

---

## Priorité 1 — Conversion (appels téléphoniques)

### 1. Barre d'urgence saisonnière

**Composant :** `src/components/UrgencyBanner.tsx`

Bandeau fin au-dessus de la `<Navbar>`, dans le `<Layout>`. Rendu conditionnel sur `URGENCE_ACTIVE`.

**Données dans `content.ts` :**
```ts
export const URGENCE = {
  active: true,
  message: "Saison des frelons asiatiques en cours — Intervention sous 24h",
} as const
```

**UI :** fond `wasp-yellow`, texte `wasp-black`, numéro cliquable à droite. Un seul booléen à passer à `false` pour désactiver hors saison.

---

### 2. Bouton d'appel flottant mobile

**Composant :** `src/components/FloatingCallButton.tsx`

Bouton fixe `fixed bottom-4 right-4 z-50 md:hidden`. Icône téléphone + label "Appeler". Lien `href={CONTACT.telephoneHref}`. Ombre portée pour visibilité sur fond clair ou sombre.

Intégré dans `<Layout>` au même niveau que `<UrgencyBanner>`.

---

### 3. Numéro dans la navbar desktop

**Fichier modifié :** `src/components/Navbar.tsx`

Ajout d'un lien `href={CONTACT.telephoneHref}` côté droit de la navbar, visible uniquement `hidden md:flex`. Format : icône Phone + numéro formaté. Style cohérent avec la charte (fond `wasp-black`, texte `wasp-yellow`).

---

### 4. Section "Pourquoi nous" sur la HomePage

**Emplacement :** entre la section Services et la section Zone d'intervention dans `src/pages/HomePage.tsx`

4 garanties en grille 2×2 (mobile) ou 4 colonnes (desktop) :
- Certibiocide N°0315595
- Intervention sous 24h
- +400 nids traités
- Produits biocides homologués

Chaque item : icône `lucide-react` + titre court + phrase de réassurance. Fond `wasp-light`, pas de carte — style léger pour ne pas alourdir la page.

---

## Priorité 2 — SEO local

### 5. Pages communes dynamiques

**Route :** `/interventions/:slug`

**Fichier :** `src/pages/CommunePage.tsx`

Chaque commune de `communes.ts` obtient une page dédiée avec :
- `<title>` : "Destruction guêpes et frelons à [Commune] — Val Drôme Guêpes Frelons"
- `<meta description>` : "Intervention rapide pour destruction de nids de guêpes, frelons et fourmis à [Commune] et alentours. Certibiocide N°0315595. Appelez le 06 25 11 54 44."
- H1 localisé
- Texte court (~3 phrases) mentionnant la commune
- CTA appel + lien contact
- `schema.org/LocalBusiness` avec `areaServed` = commune

**Slug :** généré depuis le nom de commune en lowercase, accents supprimés, espaces → tirets. Ex: `Crest` → `crest`, `Die` → `die`.

**Lien interne :** la page `/interventions` transforme chaque badge commune en `<Link to={/interventions/${slug}}>` pour que Google crawle toutes les pages.

**Ces pages ne sont pas dans la navigation principale** (pas de lien dans Navbar ou Footer).

---

### 6. FAQ structurée sur les pages nuisibles

**Pages modifiées :** `GuepesPage.tsx`, `FrelonsPage.tsx`, `FourmisPage.tsx`

**Composant partagé :** `src/components/FaqSection.tsx`

Accordéon avec 4-5 questions par page. Balisage `schema.org/FAQPage` via JSON-LD dans `<Helmet>`.

**Questions Guêpes :**
1. Quel est le prix d'une destruction de nid de guêpes ?
2. Faut-il détruire le nid ou juste traiter ?
3. Est-ce dangereux d'intervenir soi-même ?
4. Combien de temps dure une intervention ?
5. Le traitement est-il sans danger pour les enfants et animaux ?

**Questions Frelons :**
1. Comment reconnaître un frelon asiatique ?
2. Le frelon asiatique est-il plus dangereux que l'européen ?
3. Qui contacter pour un nid de frelons asiatiques ?
4. La destruction est-elle obligatoire ?
5. Quel est le délai d'intervention ?

**Questions Fourmis :**
1. Quels produits utilisez-vous contre les fourmis ?
2. Combien de temps dure le traitement ?
3. Les fourmis peuvent-elles revenir après traitement ?
4. Intervenez-vous en intérieur ?
5. Le traitement est-il sans danger pour les animaux domestiques ?

---

## Architecture — résumé des fichiers

| Fichier | Action |
|---|---|
| `src/data/content.ts` | Ajouter `URGENCE` |
| `src/components/UrgencyBanner.tsx` | Créer |
| `src/components/FloatingCallButton.tsx` | Créer |
| `src/components/FaqSection.tsx` | Créer |
| `src/components/Navbar.tsx` | Ajouter numéro desktop |
| `src/components/Layout.tsx` | Intégrer UrgencyBanner + FloatingCallButton |
| `src/pages/HomePage.tsx` | Ajouter section "Pourquoi nous" |
| `src/pages/CommunePage.tsx` | Créer |
| `src/pages/GuepesPage.tsx` | Ajouter FaqSection |
| `src/pages/FrelonsPage.tsx` | Ajouter FaqSection |
| `src/pages/FourmisPage.tsx` | Ajouter FaqSection |
| `src/pages/InterventionsPage.tsx` | Transformer badges en liens |
| `src/App.tsx` | Ajouter route `/interventions/:slug` |

---

## Ordre d'implémentation

1. `content.ts` — ajout `URGENCE`
2. `UrgencyBanner` + intégration Layout
3. `FloatingCallButton` + intégration Layout
4. Navbar — numéro desktop
5. HomePage — section "Pourquoi nous"
6. `FaqSection` + intégration Guêpes/Frelons/Fourmis
7. `CommunePage` + route + liens depuis InterventionsPage
