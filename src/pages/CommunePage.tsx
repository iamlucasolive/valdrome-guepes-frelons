import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Phone } from 'lucide-react'
import { COMMUNES } from '../data/communes'
import { CONTACT } from '../data/content'
import { toSlug } from '../utils/communeSlug'

export default function CommunePage() {
  const { slug } = useParams<{ slug: string }>()

  const commune = COMMUNES.find((c) => toSlug(c.nom) === slug)

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
    areaServed: commune.nom,
  }

  return (
    <>
      <Helmet>
        <title>Destruction guêpes et frelons à {commune.nom} — Val Drôme Guêpes Frelons</title>
        <meta
          name="description"
          content={`Intervention rapide pour destruction de nids de guêpes, frelons et fourmis à ${commune.nom} et alentours. Certibiocide N°${CONTACT.certibiocide}. Appelez le ${CONTACT.telephone}.`}
        />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <section className="bg-wasp-black py-20">
        <div className="mx-auto max-w-7xl px-4">
          <p className="mb-3 font-poppins text-xs font-bold uppercase tracking-[3px] text-wasp-yellow">
            Intervention rapide · {commune.nom}
          </p>
          <h1 className="mb-4 font-rajdhani text-4xl font-black leading-tight text-white md:text-5xl">
            Destruction de guêpes et frelons à{' '}
            <span className="text-wasp-yellow">{commune.nom}</span>
          </h1>
          <p className="mb-8 max-w-xl font-poppins text-base text-white/60">
            Val Drôme Guêpes Frelons intervient à {commune.nom} et dans les communes environnantes pour
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
            Nos services à {commune.nom}
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
