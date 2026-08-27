import { motion } from 'framer-motion'
import { Utensils, Zap, Leaf, Phone as PhoneIcon } from 'lucide-react'
import HeroSection from '../components/HeroSection'
import WaspStripeDivider from '../components/WaspStripeDivider'
import FaqSection from '../components/FaqSection'
import type { FaqItem } from '../components/FaqSection'
import Seo from '../components/Seo'
import Breadcrumb from '../components/Breadcrumb'
import { service, breadcrumb } from '../lib/jsonLd'
import { CONTACT } from '../data/content'

interface DangerCardProps { icon: React.ReactNode; title: string; text: string; delay: number }

function DangerCard({ icon, title, text, delay }: DangerCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.4 }}
      className="rounded-xl border-t-4 border-wasp-yellow bg-white p-6 shadow-sm"
    >
      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-lg bg-wasp-yellow/10">
        {icon}
      </div>
      <h3 className="mb-2 font-rajdhani text-xl font-bold text-wasp-black">{title}</h3>
      <p className="font-poppins text-sm leading-relaxed text-wasp-gray">{text}</p>
    </motion.div>
  )
}

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

export default function FourmisPage() {
  return (
    <>
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

      <Breadcrumb items={[{ name: 'Accueil', path: '/' }, { name: 'Fourmis', path: '/fourmis' }]} />

      <HeroSection
        title="Destruction de"
        titleHighlight="Fourmilières"
        subtitle="Éradication professionnelle des colonies de fourmis dans la Drôme avec biocides homologués."
        showCta
      />

      <section className="bg-wasp-light py-16">
        <div className="mx-auto max-w-7xl px-4">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10 text-center font-rajdhani text-3xl font-black text-wasp-black"
          >
            Les dangers des fourmis
          </motion.h2>
          <div className="grid gap-6 md:grid-cols-3">
            <DangerCard
              icon={<Utensils className="h-6 w-6 text-wasp-yellow" />}
              title="Conservation alimentaire"
              text="Les fourmis causent des problèmes de conservation des aliments dans les bâtiments professionnels ou particuliers, contaminant les denrées stockées."
              delay={0}
            />
            <DangerCard
              icon={<Zap className="h-6 w-6 text-wasp-yellow" />}
              title="Risques électriques"
              text="Capables de provoquer des accidents électriques pouvant déboucher sur des incendies en s'infiltrant dans les boîtiers et câbles électriques."
              delay={0.1}
            />
            <DangerCard
              icon={<Leaf className="h-6 w-6 text-wasp-yellow" />}
              title="Impact agricole"
              text="Une colonie au sein de cultures peut disséminer des pucerons qu'elles élèvent, causant des dégâts significatifs sur les plantations."
              delay={0.2}
            />
          </div>
        </div>
      </section>

      <WaspStripeDivider />

      <section className="bg-wasp-black py-16">
        <div className="mx-auto max-w-xl px-4 text-center">
          <h2 className="mb-4 font-rajdhani text-3xl font-black text-white">
            Une infestation de fourmis ?
          </h2>
          <p className="mb-8 font-poppins text-base text-white/60">
            Contactez {CONTACT.responsable} pour une intervention rapide et efficace
            sur toute la zone Sud Drôme.
          </p>
          <a
            href={CONTACT.telephoneHref}
            className="inline-flex items-center gap-2 rounded-md bg-wasp-yellow px-8 py-4 font-rajdhani text-lg font-bold text-wasp-black transition-opacity hover:opacity-90"
          >
            <PhoneIcon className="h-5 w-5" />
            {CONTACT.telephone}
          </a>
        </div>
      </section>

      <WaspStripeDivider />
      <FaqSection items={FAQ_FOURMIS} jsonLdId="faq-fourmis" />
    </>
  )
}
