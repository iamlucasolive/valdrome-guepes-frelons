import { Link } from 'react-router-dom'
import Seo from './Seo'

interface NotFoundProps {
  title?: string
  message?: string
}

export default function NotFound({
  title = 'Page introuvable',
  message = "La page que vous cherchez n'existe pas ou a été déplacée.",
}: NotFoundProps) {
  return (
    <>
      <Seo
        title={`${title} — Val Drôme Guêpes Frelons`}
        description={message}
        path="/404"
        noindex
      />
      <div className="py-32 text-center font-poppins text-wasp-gray">
        <p className="mb-4 text-lg">{message}</p>
        <Link to="/" className="text-wasp-yellow underline">
          Retour à l&apos;accueil
        </Link>
      </div>
    </>
  )
}
