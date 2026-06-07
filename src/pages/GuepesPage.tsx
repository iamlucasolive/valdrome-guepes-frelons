import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { AlertTriangle, Eye, Phone as PhoneIcon } from 'lucide-react'
import HeroSection from '../components/HeroSection'
import WaspStripeDivider from '../components/WaspStripeDivider'
import { CONTACT } from '../data/content'

interface InfoCardProps { icon: React.ReactNode; title: string; text: string; delay: number }

function InfoCard({ icon, title, text, delay }: InfoCardProps) {
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

export default function GuepesPage() {
  return (
    <>
      <Helmet>
        <title>Destruction de nids de Guêpes dans la Drôme — Val Drôme Guêpes Frelons</title>
        <meta
          name="description"
          content="Extermination définitive des nids de guêpes dans la Drôme. Professionnel certifié Certibiocide. Intervention rapide et sécurisée. Appelez le 06 25 11 54 44."
        />
      </Helmet>

      <HeroSection
        title="Destruction de nids de"
        titleHighlight="Guêpes"
        subtitle="Extermination définitive des nids de guêpes dans la Drôme. Intervention rapide avec biocides homologués."
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
            Reconnaître une infestation de guêpes
          </motion.h2>
          <div className="grid gap-6 md:grid-cols-3">
            <InfoCard
              icon={<Eye className="h-6 w-6 text-wasp-yellow" />}
              title="Signes de présence"
              text="Des trajectoires répétées de guêpes entre la toiture et des points d'eau signalent généralement la présence d'un nid à proximité."
              delay={0}
            />
            <InfoCard
              icon={<AlertTriangle className="h-6 w-6 text-wasp-yellow" />}
              title="Danger des piqûres"
              text="Certaines personnes sont sensibles ou allergiques aux piqûres de guêpes. Une attaque en masse peut être dangereuse, voire mortelle pour les personnes allergiques."
              delay={0.1}
            />
            <InfoCard
              icon={<PhoneIcon className="h-6 w-6 text-wasp-yellow" />}
              title="Pourquoi appeler un pro"
              text="Les produits commerciaux ne sont pas toujours efficaces et peuvent aggraver la situation. Un professionnel certifié garantit une destruction définitive et sécurisée."
              delay={0.2}
            />
          </div>
        </div>
      </section>

      <WaspStripeDivider />

      <section className="bg-wasp-black py-16">
        <div className="mx-auto max-w-xl px-4 text-center">
          <h2 className="mb-4 font-rajdhani text-3xl font-black text-white">
            Vous avez détecté un nid de guêpes ?
          </h2>
          <p className="mb-8 font-poppins text-base text-white/60">
            N&apos;intervenez pas vous-même. Contactez {CONTACT.responsable} pour une destruction
            rapide et sécurisée.
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
    </>
  )
}
