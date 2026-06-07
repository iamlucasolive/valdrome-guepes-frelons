import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import { Bug, Zap, Shield, ChevronRight, Award, Clock, ThumbsUp } from 'lucide-react'
import HeroSection from '../components/HeroSection'
import WaspStripeDivider from '../components/WaspStripeDivider'
import { STATS, CONTACT, COMMUNES_PRINCIPALES } from '../data/content'
import { COMMUNES } from '../data/communes'

function useCountUp(target: number, duration: number, start: boolean) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!start) return
    let startTime: number | null = null
    let rafId: number
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      setCount(Math.floor(progress * target))
      if (progress < 1) rafId = requestAnimationFrame(step)
    }
    rafId = requestAnimationFrame(step)
    return () => cancelAnimationFrame(rafId)
  }, [start, target, duration])
  return count
}

interface StatItemProps { valeur: string; label: string; inView: boolean }

function StatItem({ valeur, label, inView }: StatItemProps) {
  // Extraire la partie numérique et le suffixe ("+", "h", "+")
  const match = valeur.match(/^([+]?)(\d+)(.*)$/)
  const prefix = match?.[1] ?? ''
  const numeric = match ? parseInt(match[2], 10) : 0
  const suffix = match?.[3] ?? ''
  const count = useCountUp(numeric, 1200, inView)

  return (
    <div className="text-center">
      <p className="font-rajdhani text-3xl font-black text-wasp-black md:text-4xl">
        {prefix}{count}{suffix}
      </p>
      <p className="font-poppins text-sm font-medium text-wasp-black/70">{label}</p>
    </div>
  )
}

interface ServiceCardProps {
  icon: React.ReactNode
  title: string
  description: string
  to: string
  delay: number
}

function ServiceCard({ icon, title, description, to, delay }: ServiceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ y: -4, boxShadow: '0 8px 30px rgba(0,0,0,0.1)' }}
      className="rounded-xl bg-white p-6 shadow-sm border-t-4 border-wasp-yellow"
    >
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-wasp-yellow/10">
        {icon}
      </div>
      <h3 className="mb-2 font-rajdhani text-xl font-bold text-wasp-black">{title}</h3>
      <p className="mb-4 font-poppins text-sm text-wasp-gray">{description}</p>
      <Link
        to={to}
        className="inline-flex items-center gap-1 font-poppins text-sm font-semibold text-wasp-black hover:text-wasp-yellow transition-colors"
      >
        En savoir plus <ChevronRight className="h-4 w-4" />
      </Link>
    </motion.div>
  )
}

const SERVICES = [
  {
    icon: <Bug className="h-6 w-6 text-wasp-yellow" />,
    title: 'Destruction de Guêpes',
    description: 'Extermination définitive des nids de guêpes dans des conditions de sécurité maximales.',
    to: '/guepes',
  },
  {
    icon: <Zap className="h-6 w-6 text-wasp-yellow" />,
    title: 'Destruction de Frelons',
    description: 'Frelon européen et frelon asiatique — intervention rapide et traitement raisonné.',
    to: '/frelons',
  },
  {
    icon: <Shield className="h-6 w-6 text-wasp-yellow" />,
    title: 'Destruction de Fourmis',
    description: "Éradication des fourmilières avec biocides homologués respectueux de l'environnement.",
    to: '/fourmis',
  },
] as const

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
    detail: "Biocides raisonnés, respectueux de l'environnement",
  },
] as const

export default function HomePage() {
  const statsRef = useRef<HTMLDivElement>(null)
  const statsInView = useInView(statsRef, { once: true })

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: CONTACT.nom,
    description: 'Destruction professionnelle de nids de guêpes, frelons et fourmis dans la Drôme.',
    telephone: CONTACT.telephone,
    email: CONTACT.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: CONTACT.adresse,
      postalCode: CONTACT.codePostal,
      addressLocality: CONTACT.ville,
      addressCountry: 'FR',
    },
    areaServed: COMMUNES.join(', '),
  }

  return (
    <>
      <Helmet>
        <title>Destruction de Guêpes & Frelons dans la Drôme — Val Drôme Guêpes Frelons</title>
        <meta
          name="description"
          content="Val Drôme Guêpes Frelons : professionnel certifié de la destruction de nids de guêpes, frelons et frelons asiatiques dans la Drôme. Certibiocide N°0315595. Intervention rapide sur 60+ communes."
        />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <HeroSection
        title="Destruction de"
        titleHighlight="Guêpes & Frelons"
        subtitle="Spécialisé en destruction des nids dans la vallée de la Drôme. Biocides homologués, intervention rapide."
        showCta
        imageSrc="/images/destruction-guepes-frelons-drome.jpg"
      />

      <div ref={statsRef} className="bg-wasp-yellow py-8">
        <div className="mx-auto grid max-w-7xl grid-cols-3 divide-x divide-wasp-black/20 px-4">
          {STATS.map(({ valeur, label }) => (
            <StatItem key={label} valeur={valeur} label={label} inView={statsInView} />
          ))}
        </div>
      </div>

      <WaspStripeDivider />

      <section className="bg-wasp-light py-16">
        <div className="mx-auto max-w-7xl px-4">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10 text-center font-rajdhani text-3xl font-black text-wasp-black md:text-4xl"
          >
            Nos services
          </motion.h2>
          <div className="grid gap-6 md:grid-cols-3">
            {SERVICES.map(({ icon, title, description, to }, i) => (
              <ServiceCard
                key={title}
                icon={icon}
                title={title}
                description={description}
                to={to}
                delay={i * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

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

      <section className="py-16">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="mb-4 font-rajdhani text-3xl font-black text-wasp-black md:text-4xl">
              Professionnel habilité —{' '}
              <span className="text-wasp-yellow">Val Drôme Guêpes Frelons</span>
            </h2>
            <p className="mb-6 font-poppins text-base leading-relaxed text-wasp-gray">
              Faites appel à un professionnel habilité à l&apos;extermination des Frelons asiatiques,
              Guêpes et Frelons, pour une destruction définitive de leurs nids dans des conditions
              de sécurité maximales. Spécialisé en destruction des nids de Guêpes, Frelons &amp;
              Frelons asiatiques dans la Drôme, VAL DROME GUEPES FRELONS intervient rapidement
              pour exterminer tous nids de Frelons ou Guêpes à l&apos;aide de produits Biocides
              homologués traitement raisonné.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-wasp-yellow px-3 py-1 font-poppins text-xs font-bold text-wasp-black">
                Certibiocide N°{CONTACT.certibiocide}
              </span>
              <span className="rounded-full bg-wasp-black px-3 py-1 font-poppins text-xs font-bold text-wasp-yellow">
                Biocides homologués
              </span>
              <span className="rounded-full bg-wasp-black px-3 py-1 font-poppins text-xs font-bold text-wasp-yellow">
                Traitement raisonné
              </span>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="overflow-hidden rounded-xl"
          >
            <img
              src="/images/destruction-guepes-frelons-drome.jpg"
              alt="Destruction professionnelle de nids de guêpes et frelons dans la Drôme"
              className="h-72 w-full object-cover md:h-96"
            />
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
            className="mb-8 text-center font-rajdhani text-3xl font-black text-wasp-yellow md:text-4xl"
          >
            Zone d&apos;intervention — Sud Drôme
          </motion.h2>
          <div className="mb-8 flex flex-wrap justify-center gap-2">
            {COMMUNES_PRINCIPALES.map((commune) => (
              <span
                key={commune}
                className="rounded-full bg-wasp-dark px-3 py-1 font-poppins text-sm text-white/80"
              >
                {commune}
              </span>
            ))}
          </div>
          <div className="text-center">
            <Link
              to="/interventions"
              className="inline-flex items-center gap-2 rounded-md border border-wasp-yellow px-6 py-3 font-rajdhani font-bold text-wasp-yellow transition-colors hover:bg-wasp-yellow hover:text-wasp-black"
            >
              Voir les {COMMUNES.length}+ communes →
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
