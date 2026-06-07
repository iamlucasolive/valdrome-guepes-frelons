import { Phone } from 'lucide-react'
import { CONTACT } from '../data/content'

export default function FloatingCallButton() {
  return (
    <a
      href={CONTACT.telephoneHref}
      className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full bg-wasp-yellow px-5 py-3 font-rajdhani text-base font-bold text-wasp-black shadow-lg transition-opacity hover:opacity-90 md:hidden"
      aria-label="Appeler maintenant"
    >
      <Phone className="h-5 w-5" />
      Appeler
    </a>
  )
}
