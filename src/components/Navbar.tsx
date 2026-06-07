import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Phone } from 'lucide-react'
import { CONTACT } from '../data/content'

const NAV_LINKS = [
  { label: 'Accueil', to: '/' },
  { label: 'Guêpes', to: '/guepes' },
  { label: 'Frelons', to: '/frelons' },
  { label: 'Fourmis', to: '/fourmis' },
  { label: 'Interventions', to: '/interventions' },
  { label: 'Contact', to: '/contact' },
] as const

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  return (
    <header className="sticky top-0 z-40 bg-wasp-black shadow-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img
            src="/images/destruction-guepes-frelons-drome.jpg"
            alt="Val Drôme Guêpes Frelons"
            className="h-10 w-10 rounded-md object-cover"
          />
          <div>
            <p className="font-rajdhani text-sm font-bold leading-none text-wasp-yellow">
              VAL DRÔME
            </p>
            <p className="text-xs leading-none text-white/60">Guêpes & Frelons</p>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              className={`rounded px-3 py-1.5 font-poppins text-sm transition-colors ${
                pathname === to
                  ? 'text-wasp-yellow font-semibold'
                  : 'text-white/80 hover:text-wasp-yellow'
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* CTA téléphone desktop */}
        <a
          href={CONTACT.telephoneHref}
          className="hidden items-center gap-2 rounded-md bg-wasp-yellow px-4 py-2 font-rajdhani font-bold text-wasp-black transition-opacity hover:opacity-90 md:flex"
        >
          <Phone className="h-4 w-4" />
          <span>{CONTACT.telephone}</span>
        </a>

        {/* Hamburger mobile */}
        <button
          className="rounded p-2 text-white md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden bg-wasp-dark md:hidden"
          >
            <nav className="flex flex-col px-4 pb-4 pt-2">
              {NAV_LINKS.map(({ label, to }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setOpen(false)}
                  className={`border-b border-white/10 py-3 font-poppins text-base transition-colors ${
                    pathname === to
                      ? 'text-wasp-yellow font-semibold'
                      : 'text-white/80'
                  }`}
                >
                  {label}
                </Link>
              ))}
              <a
                href={CONTACT.telephoneHref}
                className="mt-4 flex items-center justify-center gap-2 rounded-md bg-wasp-yellow py-3 font-rajdhani font-bold text-wasp-black"
              >
                <Phone className="h-4 w-4" />
                {CONTACT.telephone}
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
