import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { Phone as PhoneIcon, Mail, MapPin } from 'lucide-react'
import HeroSection from '../components/HeroSection'
import WaspStripeDivider from '../components/WaspStripeDivider'
import { CONTACT } from '../data/content'

export default function ContactPage() {

  return (
    <>
      <Helmet>
        <title>Contact — Val Drôme Guêpes Frelons</title>
        <meta
          name="description"
          content="Contactez Val Drôme Guêpes Frelons pour la destruction de nids de guêpes, frelons ou fourmis dans la Drôme. Téléphone : 06 25 11 54 44."
        />
      </Helmet>

      <HeroSection
        title="Nous"
        titleHighlight="contacter"
        subtitle="Une question ? Un nid à détruire ? Contactez-nous rapidement."
        showCta={false}
      />

      <section className="py-16">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-6 font-rajdhani text-3xl font-black text-wasp-black">
              Nous contacter
            </h2>
            <p className="mb-8 font-poppins text-sm leading-relaxed text-wasp-gray">
              Pour une intervention rapide, appelez directement — c&apos;est le moyen le plus sûr
              d&apos;obtenir une réponse immédiate. Pour une demande non urgente, envoyez-nous
              un email et nous vous répondrons sous 24h.
            </p>
            <div className="space-y-4">
              <a
                href={CONTACT.telephoneHref}
                aria-label="Appeler Val Drôme Guêpes Frelons"
                className="flex w-full items-center justify-center gap-3 rounded-xl bg-wasp-yellow py-4 font-rajdhani text-xl font-bold text-wasp-black transition-opacity hover:opacity-90"
              >
                <PhoneIcon className="h-6 w-6" />
                Appeler maintenant — {CONTACT.telephone}
              </a>
              <a
                href={`mailto:${CONTACT.email}`}
                aria-label={`Envoyer un email à ${CONTACT.email}`}
                className="flex w-full items-center justify-center gap-3 rounded-xl border-2 border-wasp-black py-4 font-rajdhani text-lg font-bold text-wasp-black transition-colors hover:bg-wasp-black hover:text-wasp-yellow"
              >
                <Mail className="h-5 w-5" />
                Envoyer un email
              </a>
            </div>
            <p className="mt-4 font-poppins text-xs text-wasp-gray">
              Disponible en saison (avril–novembre), du lundi au samedi, 8h–19h.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-6 font-rajdhani text-3xl font-black text-wasp-black">
              Coordonnées
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3 rounded-xl bg-wasp-light p-4">
                <PhoneIcon className="mt-0.5 h-5 w-5 shrink-0 text-wasp-yellow" />
                <div>
                  <p className="font-poppins text-xs font-semibold uppercase tracking-wide text-wasp-gray">
                    Téléphone
                  </p>
                  <a
                    href={CONTACT.telephoneHref}
                    className="font-rajdhani text-xl font-bold text-wasp-black hover:text-wasp-yellow transition-colors"
                  >
                    {CONTACT.telephone}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-xl bg-wasp-light p-4">
                <Mail className="mt-0.5 h-5 w-5 shrink-0 text-wasp-yellow" />
                <div>
                  <p className="font-poppins text-xs font-semibold uppercase tracking-wide text-wasp-gray">
                    Email
                  </p>
                  <a
                    href={`mailto:${CONTACT.email}`}
                    className="font-poppins text-sm text-wasp-black hover:text-wasp-yellow transition-colors"
                  >
                    {CONTACT.email}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-xl bg-wasp-light p-4">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-wasp-yellow" />
                <div>
                  <p className="font-poppins text-xs font-semibold uppercase tracking-wide text-wasp-gray">
                    Adresse
                  </p>
                  <p className="font-poppins text-sm text-wasp-black">
                    {CONTACT.responsable}<br />
                    {CONTACT.adresse}<br />
                    {CONTACT.codePostal} {CONTACT.ville}
                  </p>
                </div>
              </div>
              <div className="rounded-xl border-2 border-wasp-yellow p-4">
                <p className="font-poppins text-xs font-semibold uppercase tracking-wide text-wasp-gray">
                  Certification
                </p>
                <p className="font-rajdhani text-lg font-bold text-wasp-black">
                  Certibiocide N°{CONTACT.certibiocide}
                </p>
                <p className="font-poppins text-xs text-wasp-gray">
                  SIRET : {CONTACT.siret}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <WaspStripeDivider />
    </>
  )
}
