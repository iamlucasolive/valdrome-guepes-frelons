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
    return (
      <NotFound
        title="Commune non trouvée"
        message="Cette commune ne fait pas partie de notre zone d'intervention listée."
      />
    )
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
