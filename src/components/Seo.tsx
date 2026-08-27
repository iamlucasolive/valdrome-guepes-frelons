import { Head } from 'vite-react-ssg'
import { SITE_NAME, DEFAULT_OG_IMAGE, absoluteUrl } from '../data/site'

interface SeoProps {
  title: string
  description: string
  path: string
  image?: string
  jsonLd?: object[]
  noindex?: boolean
}

export default function Seo({ title, description, path, image, jsonLd = [], noindex = false }: SeoProps) {
  const canonical = absoluteUrl(path)
  const ogImage = absoluteUrl(image ?? DEFAULT_OG_IMAGE)

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      {!noindex && <link rel="canonical" href={canonical} />}
      {noindex && <meta name="robots" content="noindex, follow" />}

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="fr_FR" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {!noindex && <meta property="og:url" content={canonical} />}
      <meta property="og:image" content={ogImage} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {jsonLd.map((obj, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(obj)}
        </script>
      ))}
    </Head>
  )
}
