import Seo from '../components/Seo'
import Breadcrumb from '../components/Breadcrumb'
import { CONTACT } from '../data/content'
import { SITE_NAME } from '../data/site'

export default function LegalPage() {
  return (
    <>
      <Seo
        title={`Mentions légales — ${SITE_NAME}`}
        description="Mentions légales du site Val Drôme Guêpes Frelons : éditeur, hébergeur, propriété intellectuelle."
        path="/mentions-legales"
        jsonLd={[]}
      />
      <Breadcrumb items={[{ name: 'Accueil', path: '/' }, { name: 'Mentions légales', path: '/mentions-legales' }]} />

      <section className="mx-auto max-w-3xl px-4 py-12 font-poppins text-sm leading-relaxed text-wasp-gray">
        <h1 className="mb-8 font-rajdhani text-3xl font-black text-wasp-black">Mentions légales</h1>

        <h2 className="mb-2 mt-6 font-rajdhani text-xl font-bold text-wasp-black">Éditeur du site</h2>
        <p>
          {CONTACT.responsable} — {CONTACT.nom}
          <br />
          {CONTACT.adresse}, {CONTACT.codePostal} {CONTACT.ville}
          <br />
          SIRET : {CONTACT.siret}
          <br />
          Certibiocide N°{CONTACT.certibiocide}
          <br />
          Téléphone : {CONTACT.telephone} — Email : {CONTACT.email}
        </p>

        <h2 className="mb-2 mt-6 font-rajdhani text-xl font-bold text-wasp-black">Directeur de la publication</h2>
        <p>{CONTACT.responsable}</p>

        <h2 className="mb-2 mt-6 font-rajdhani text-xl font-bold text-wasp-black">Hébergeur</h2>
        <p>
          Hostinger International Ltd.
          <br />
          61 Lordou Vironos Street, 6023 Larnaca, Chypre
        </p>

        <h2 className="mb-2 mt-6 font-rajdhani text-xl font-bold text-wasp-black">Propriété intellectuelle</h2>
        <p>
          L&apos;ensemble des contenus (textes, images, logo) présents sur ce site est la propriété de{' '}
          {CONTACT.nom}, sauf mention contraire. Toute reproduction sans autorisation est interdite.
        </p>

        <h2 className="mb-2 mt-6 font-rajdhani text-xl font-bold text-wasp-black">Données personnelles</h2>
        <p>
          Ce site ne collecte aucune donnée personnelle : il ne comporte ni formulaire de contact, ni
          cookie de mesure d&apos;audience. Les échanges se font par téléphone ou par email à
          l&apos;initiative du visiteur.
        </p>
      </section>
    </>
  )
}
