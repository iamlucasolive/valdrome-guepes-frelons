import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Phone as PhoneIcon, CheckCircle } from 'lucide-react'
import HeroSection from '../components/HeroSection'
import WaspStripeDivider from '../components/WaspStripeDivider'
import Seo from '../components/Seo'
import Breadcrumb from '../components/Breadcrumb'
import { breadcrumb } from '../lib/jsonLd'
import { CONTACT } from '../data/content'
import { COMMUNES } from '../data/communes'
import { toSlug } from '../utils/communeSlug'

export default function InterventionsPage() {
  return (
    <>
      <Seo
        title="Zone d'intervention Guêpes Frelons — Sud Drôme — Val Drôme Guêpes Frelons"
        description={`Intervention rapide sur ${COMMUNES.length}+ communes de la moitié Sud de la Drôme. Destruction de guêpes, frelons et fourmis. Appelez le 06 25 11 54 44.`}
        path="/interventions"
        jsonLd={[breadcrumb([{ name: 'Accueil', path: '/' }, { name: 'Interventions', path: '/interventions' }])]}
      />

      <Breadcrumb items={[{ name: 'Accueil', path: '/' }, { name: 'Interventions', path: '/interventions' }]} />

      <HeroSection
        title="Zone d'intervention —"
        titleHighlight="Sud Drôme"
        subtitle={`Intervention rapide sur la moitié Sud du département de la Drôme — ${COMMUNES.length}+ communes.`}
        showCta
      />

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto max-w-2xl text-center"
          >
            <h2 className="mb-6 font-rajdhani text-3xl font-black text-wasp-black">
              Traitements raisonnés & certifiés
            </h2>
            <p className="mb-8 font-poppins text-base leading-relaxed text-wasp-gray">
              {CONTACT.responsable} est certifié pour l&apos;utilisation de produits de lutte contre
              les nuisibles que sont les Guêpes, Frelons, et Frelons asiatiques. Formation à
              l&apos;emploi de traitements biocides de manière raisonnée, respectueuse tant de
              l&apos;environnement que de la santé.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                'Certibiocide N°' + CONTACT.certibiocide,
                'Biocides homologués',
                'Traitement raisonné',
                "Respectueux de l'environnement",
              ].map((badge) => (
                <span
                  key={badge}
                  className="flex items-center gap-1 rounded-full bg-wasp-yellow px-3 py-1 font-poppins text-xs font-bold text-wasp-black"
                >
                  <CheckCircle className="h-3 w-3" />
                  {badge}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <WaspStripeDivider />

      <section className="bg-wasp-black py-16">
        <div className="mx-auto max-w-7xl px-4">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8 text-center font-rajdhani text-3xl font-black text-wasp-yellow"
          >
            Communes desservies
          </motion.h2>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-wrap justify-center gap-2"
          >
            {COMMUNES.map((commune) => (
              <Link
                key={commune.nom}
                to={`/interventions/${toSlug(commune.nom)}`}
                className="rounded-full bg-wasp-dark px-3 py-1 font-poppins text-sm text-white/80 transition-colors hover:bg-wasp-yellow hover:text-wasp-black"
              >
                {commune.nom}
              </Link>
            ))}
          </motion.div>
          <div className="mt-10 text-center">
            <a
              href={CONTACT.telephoneHref}
              className="inline-flex items-center gap-2 rounded-md bg-wasp-yellow px-8 py-4 font-rajdhani text-lg font-bold text-wasp-black transition-opacity hover:opacity-90"
            >
              <PhoneIcon className="h-5 w-5" />
              {CONTACT.telephone}
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
