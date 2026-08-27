import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin } from 'lucide-react'
import { CONTACT, LIENS_UTILES } from '../data/content'

export default function Footer() {
  return (
    <footer>
      <div className="bg-wasp-black px-4 py-12">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-2">
          {/* Coordonnées */}
          <div>
            <h3 className="mb-4 font-rajdhani text-lg font-bold text-wasp-yellow">
              {CONTACT.nom}
            </h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-wasp-yellow" />
                <span>
                  {CONTACT.responsable} — {CONTACT.adresse},{' '}
                  {CONTACT.codePostal} {CONTACT.ville}
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-wasp-yellow" />
                <a
                  href={CONTACT.telephoneHref}
                  className="hover:text-wasp-yellow transition-colors"
                >
                  {CONTACT.telephone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-wasp-yellow" />
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="hover:text-wasp-yellow transition-colors"
                >
                  {CONTACT.email}
                </a>
              </li>
            </ul>
          </div>

          {/* Liens utiles */}
          <div>
            <h3 className="mb-4 font-rajdhani text-lg font-bold text-wasp-yellow">
              Liens utiles
            </h3>
            <ul className="grid grid-cols-2 gap-1 text-sm text-white/70">
              {LIENS_UTILES.map(({ label, to }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="hover:text-wasp-yellow transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright bar */}
      <div className="bg-wasp-yellow px-4 py-3 text-center">
        <p className="font-poppins text-sm font-semibold text-wasp-black">
          SIRET : {CONTACT.siret} &mdash; Certibiocide : {CONTACT.certibiocide}{' '}
          &mdash; &copy; {new Date().getFullYear()} {CONTACT.nom}
        </p>
      </div>

      <div className="bg-wasp-black px-4 py-2 text-center">
        <Link to="/mentions-legales" className="font-poppins text-xs text-white/50 hover:text-wasp-yellow transition-colors">
          Mentions légales
        </Link>
      </div>
    </footer>
  )
}
