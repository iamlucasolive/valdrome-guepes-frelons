import { Helmet } from 'react-helmet-async'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Phone as PhoneIcon, Mail, MapPin } from 'lucide-react'
import HeroSection from '../components/HeroSection'
import WaspStripeDivider from '../components/WaspStripeDivider'
import { CONTACT } from '../data/content'

interface FormState { nom: string; email: string; message: string }

export default function ContactPage() {
  const [form, setForm] = useState<FormState>({ nom: '', email: '', message: '' })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
  }

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
              Envoyer un message
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block font-poppins text-sm font-semibold text-wasp-black">
                  Nom
                </label>
                <input
                  type="text"
                  name="nom"
                  value={form.nom}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 font-poppins text-sm outline-none transition focus:border-wasp-yellow focus:ring-2 focus:ring-wasp-yellow/20"
                  placeholder="Votre nom"
                />
              </div>
              <div>
                <label className="mb-1 block font-poppins text-sm font-semibold text-wasp-black">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 font-poppins text-sm outline-none transition focus:border-wasp-yellow focus:ring-2 focus:ring-wasp-yellow/20"
                  placeholder="votre@email.fr"
                />
              </div>
              <div>
                <label className="mb-1 block font-poppins text-sm font-semibold text-wasp-black">
                  Message
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 font-poppins text-sm outline-none transition focus:border-wasp-yellow focus:ring-2 focus:ring-wasp-yellow/20"
                  placeholder="Décrivez votre situation..."
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-lg bg-wasp-yellow py-3 font-rajdhani text-base font-bold text-wasp-black transition-opacity hover:opacity-90"
              >
                Envoyer le message
              </button>
              <p className="font-poppins text-xs text-wasp-gray">
                * Formulaire à brancher — pour une réponse immédiate, appelez directement.
              </p>
            </form>
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
