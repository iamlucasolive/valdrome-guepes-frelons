import sharp from 'sharp'
import { readdir } from 'node:fs/promises'
import { join, dirname, extname, basename } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const DIRS = [join(root, 'public', 'photos'), join(root, 'public', 'images')]
const SKIP = /^(logo-|apple-touch-icon)/

for (const dir of DIRS) {
  let files
  try { files = await readdir(dir) } catch { continue }
  for (const f of files) {
    const ext = extname(f).toLowerCase()
    if (!['.jpg', '.jpeg', '.png'].includes(ext)) continue
    if (SKIP.test(f)) continue
    const out = join(dir, basename(f, ext) + '.webp')
    await sharp(join(dir, f)).webp({ quality: 78 }).toFile(out)
    console.log('webp:', out.replace(root, ''))
  }
}
