/**
 * Generate PWA PNG icons from the SVG source.
 * Run: node scripts/generate-icons.mjs
 * Requires: sharp (npm i -D sharp)
 */
import sharp from 'sharp'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const svgPath = resolve(__dirname, '../apps/web/public/icons/icon.svg')
const outputDir = resolve(__dirname, '../apps/web/public/icons')

const svg = readFileSync(svgPath)

const sizes = [192, 512]

for (const size of sizes) {
  await sharp(svg)
    .resize(size, size)
    .png()
    .toFile(resolve(outputDir, `icon-${size}.png`))
  console.log(`Generated icon-${size}.png`)
}

console.log('Done!')
