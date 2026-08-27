import { writeFile } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

// import du TS via strip-types (Node 22+) ou tsx en fallback
const { COMMUNES } = await import('../src/data/communes.ts')
const { toSlug } = await import('../src/utils/communeSlug.ts')

const SITE = 'https://frelons-guepes-destruction.fr'
const lastmod = new Date().toISOString().slice(0, 10)

const fixed = [
  { path: '/', priority: '1.0', changefreq: 'monthly' },
  { path: '/guepes', priority: '0.8', changefreq: 'monthly' },
  { path: '/frelons', priority: '0.8', changefreq: 'monthly' },
  { path: '/fourmis', priority: '0.8', changefreq: 'monthly' },
  { path: '/interventions', priority: '0.7', changefreq: 'monthly' },
  { path: '/contact', priority: '0.6', changefreq: 'monthly' },
  { path: '/mentions-legales', priority: '0.3', changefreq: 'yearly' },
]

const communes = COMMUNES.map((c) => ({
  path: `/interventions/${toSlug(c.nom)}`,
  priority: '0.6',
  changefreq: 'monthly',
}))

const urls = [...fixed, ...communes]
  .map(
    (u) =>
      `  <url><loc>${SITE}${u.path}</loc><lastmod>${lastmod}</lastmod><changefreq>${u.changefreq}</changefreq><priority>${u.priority}</priority></url>`,
  )
  .join('\n')

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`

await writeFile(join(root, 'public', 'sitemap.xml'), xml, 'utf8')
console.log(`sitemap.xml — ${urls.split('\n').length} URLs`)
