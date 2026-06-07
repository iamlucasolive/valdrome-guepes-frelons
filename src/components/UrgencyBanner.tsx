import { Phone } from 'lucide-react'
import { CONTACT, URGENCE } from '../data/content'

export default function UrgencyBanner() {
  if (!URGENCE.active) return null

  return (
    <div className="bg-wasp-yellow px-4 py-2">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <p className="font-poppins text-xs font-semibold text-wasp-black md:text-sm">
          {URGENCE.message}
        </p>
        <a
          href={CONTACT.telephoneHref}
          className="flex shrink-0 items-center gap-1.5 font-rajdhani font-bold text-wasp-black text-sm hover:underline"
        >
          <Phone className="h-3.5 w-3.5" />
          {CONTACT.telephone}
        </a>
      </div>
    </div>
  )
}
