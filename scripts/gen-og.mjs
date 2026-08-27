import sharp from 'sharp'
import { mkdir } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = join(root, 'public', 'og')
await mkdir(outDir, { recursive: true })

const W = 1200
const H = 630
const BG = '#1A1A1A'
const YELLOW = '#FFD600'
const logo = join(root, 'public', 'images', 'logo-144.png')

const PAGES = [
  { file: 'default.png', title: 'Destruction de Guêpes & Frelons', sub: 'dans la Drôme' },
  { file: 'guepes.png', title: 'Destruction de nids de Guêpes', sub: 'Drôme — Certibiocide' },
  { file: 'frelons.png', title: 'Destruction de nids de Frelons', sub: 'européens & asiatiques — Drôme' },
  { file: 'fourmis.png', title: 'Destruction de Fourmilières', sub: 'Drôme — traitement raisonné' },
]

const logoBuf = await sharp(logo).resize(180, 180, { fit: 'contain', background: BG }).png().toBuffer()

for (const p of PAGES) {
  const svg = `
    <svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${W}" height="${H}" fill="${BG}"/>
      <rect x="0" y="0" width="${W}" height="10" fill="${YELLOW}"/>
      <rect x="0" y="${H - 10}" width="${W}" height="10" fill="${YELLOW}"/>
      <text x="90" y="330" font-family="Arial, sans-serif" font-size="66" font-weight="900" fill="#FFFFFF">${escapeXml(p.title)}</text>
      <text x="90" y="410" font-family="Arial, sans-serif" font-size="40" font-weight="700" fill="${YELLOW}">${escapeXml(p.sub)}</text>
      <text x="90" y="540" font-family="Arial, sans-serif" font-size="30" fill="#CCCCCC">Val Drôme Guêpes Frelons — 06 25 11 54 44</text>
    </svg>`
  await sharp(Buffer.from(svg))
    .composite([{ input: logoBuf, top: 60, left: W - 240 }])
    .png()
    .toFile(join(outDir, p.file))
  console.log('og:', p.file)
}

// apple-touch-icon
await sharp(logo)
  .resize(160, 160, { fit: 'contain', background: BG })
  .extend({ top: 10, bottom: 10, left: 10, right: 10, background: BG })
  .png()
  .toFile(join(root, 'public', 'apple-touch-icon.png'))
console.log('apple-touch-icon.png')

function escapeXml(s) {
  return s.replace(/[<>&'"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[c]))
}
