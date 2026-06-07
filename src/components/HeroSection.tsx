import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Phone } from 'lucide-react'
import { CONTACT } from '../data/content'
import WaspStripeDivider from './WaspStripeDivider'

interface HeroSectionProps {
  title: string
  titleHighlight?: string
  subtitle: string
  showCta?: boolean
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.5 },
  }),
}

export default function HeroSection({
  title,
  titleHighlight,
  subtitle,
  showCta = true,
}: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-wasp-black py-20 md:py-28">
      {/* Motif guêpe décoratif */}
      <div className="pointer-events-none absolute right-8 top-1/2 -translate-y-1/2 text-[8rem] opacity-5 select-none">
        🐝
      </div>

      <div className="relative mx-auto max-w-7xl px-4">
        {/* Bande décorative */}
        <div className="mb-6 flex h-1.5 w-24 overflow-hidden rounded-full">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={`flex-1 ${i % 2 === 0 ? 'bg-wasp-yellow' : 'bg-wasp-dark'}`}
            />
          ))}
        </div>

        <motion.p
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mb-3 font-poppins text-xs font-bold uppercase tracking-[3px] text-wasp-yellow"
        >
          Intervention rapide · Drôme
        </motion.p>

        <motion.h1
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mb-4 font-rajdhani text-4xl font-black leading-tight text-white md:text-5xl lg:text-6xl"
        >
          {title}{' '}
          {titleHighlight && (
            <span className="text-wasp-yellow">{titleHighlight}</span>
          )}
        </motion.h1>

        <motion.p
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mb-8 max-w-xl font-poppins text-base text-white/60"
        >
          {subtitle}
        </motion.p>

        {showCta && (
          <motion.div
            custom={3}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="flex flex-wrap gap-3"
          >
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
          </motion.div>
        )}
      </div>

      <div className="mt-12">
        <WaspStripeDivider />
      </div>
    </section>
  )
}
