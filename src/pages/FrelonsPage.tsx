import { motion } from 'framer-motion'
import { Phone as PhoneIcon } from 'lucide-react'
import HeroSection from '../components/HeroSection'
import WaspStripeDivider from '../components/WaspStripeDivider'
import FaqSection from '../components/FaqSection'
import type { FaqItem } from '../components/FaqSection'
import Seo from '../components/Seo'
import Breadcrumb from '../components/Breadcrumb'
import { service, breadcrumb } from '../lib/jsonLd'
import { CONTACT } from '../data/content'

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

export default function FrelonsPage() {
  return (
    <>
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

      <Breadcrumb items={[{ name: 'Accueil', path: '/' }, { name: 'Frelons', path: '/frelons' }]} />

      <HeroSection
        title="Destruction de nids de"
        titleHighlight="Frelons"
        subtitle="Éradication des nids de frelons européens et frelons asiatiques dans la Drôme."
        showCta
      />

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10 text-center font-rajdhani text-3xl font-black text-wasp-black"
          >
            Frelon européen vs Frelon asiatique
          </motion.h2>
          <div className="grid gap-6 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="rounded-xl border border-gray-200 p-6"
            >
              <div className="mb-3 inline-block rounded-full bg-amber-100 px-3 py-1 font-poppins text-xs font-bold text-amber-800">
                Frelon européen
              </div>
              <h3 className="mb-3 font-rajdhani text-2xl font-bold text-wasp-black">
                Vespa crabro
              </h3>
              <p className="font-poppins text-sm leading-relaxed text-wasp-gray">
                Le frelon européen est le plus grand frelon d&apos;Europe. Moins agressif que son
                homologue asiatique, il reste dangereux. Ses nids sont généralement construits
                dans des cavités (arbres creux, greniers, murs).
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="rounded-xl border-2 border-wasp-yellow p-6"
            >
              <div className="mb-3 inline-block rounded-full bg-wasp-yellow px-3 py-1 font-poppins text-xs font-bold text-wasp-black">
                Frelon asiatique — Plus dangereux
              </div>
              <h3 className="mb-3 font-rajdhani text-2xl font-bold text-wasp-black">
                Vespa velutina
              </h3>
              <p className="font-poppins text-sm leading-relaxed text-wasp-gray">
                Le frelon asiatique est une espèce invasive particulièrement agressive. Ses nids
                sont impressionnants et peuvent contenir plusieurs milliers d&apos;individus. Espèce
                classée nuisible — intervention d&apos;un professionnel habilité obligatoire.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <WaspStripeDivider />

      <section className="bg-wasp-black py-16">
        <div className="mx-auto max-w-xl px-4 text-center">
          <h2 className="mb-4 font-rajdhani text-3xl font-black text-white">
            Ne prenez aucun risque
          </h2>
          <p className="mb-8 font-poppins text-base text-white/60">
            Un nid de frelons près de votre habitation ? N&apos;intervenez pas vous-même.
            Contactez {CONTACT.responsable} pour une intervention rapide.
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
      <FaqSection items={FAQ_FRELONS} jsonLdId="faq-frelons" />
    </>
  )
}
