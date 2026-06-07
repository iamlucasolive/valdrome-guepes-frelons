import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Phone } from 'lucide-react'
import { CONTACT } from '../data/content'

interface HeroSectionProps {
  title: string
  titleHighlight?: string
  subtitle: string
  showCta?: boolean
  imageSrc?: string
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
  imageSrc,
}: HeroSectionProps) {
  return (
    <section className="overflow-hidden bg-wasp-black py-20 md:py-28">
      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 md:grid-cols-2">
        {/* Contenu textuel */}
        <div>
          {/* Bande décorative */}
          <div className="mb-6 flex h-2 w-32 overflow-hidden rounded-full">
            {[...Array(8)].map((_, i) => (
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
            className="mb-8 max-w-xl font-poppins text-base text-white/80"
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

        {/* Image terrain desktop */}
        {imageSrc && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="hidden overflow-hidden rounded-2xl md:block"
          >
            <img
              src={imageSrc}
              alt="Professionnel certifié pour la destruction de nids de guêpes et frelons dans la Drôme"
              fetchPriority="high"
              className="h-80 w-full object-cover lg:h-96"
            />
          </motion.div>
        )}
      </div>

    </section>
  )
}
