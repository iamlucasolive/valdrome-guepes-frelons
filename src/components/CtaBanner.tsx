import { Phone } from 'lucide-react'
import { CONTACT } from '../data/content'

export default function CtaBanner() {
  return (
    <a
      href={CONTACT.telephoneHref}
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-center gap-3 bg-wasp-yellow py-4 text-wasp-black font-rajdhani font-bold text-lg shadow-lg md:hidden"
    >
      <Phone className="h-5 w-5" />
      <span>{CONTACT.telephone}</span>
    </a>
  )
}
