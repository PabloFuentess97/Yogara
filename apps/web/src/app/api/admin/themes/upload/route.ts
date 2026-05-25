import { NextRequest, NextResponse } from 'next/server'
import JSZip from 'jszip'
import { prisma } from '@yogara/database'
import { auth } from '@/lib/auth'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

const SECTION_FILES = [
  'navbar',
  'hero',
  'about',
  'clases',
  'profesores',
  'precios',
  'testimonios',
  'contacto',
  'footer',
  'classes-header',
  'head',
] as const

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (!user?.isPlatformAdmin) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }

  const formData = await request.formData()
  const file = formData.get('theme') as File | null
  if (!file) {
    return NextResponse.json({ error: 'No se envió ningún archivo' }, { status: 400 })
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer())
    const zip = await JSZip.loadAsync(buffer)

    // Find theme.json (may be at root or inside a folder)
    let rootPrefix = ''
    const entries = Object.keys(zip.files)
    const themeJsonEntry = entries.find(
      (e) => e.endsWith('theme.json') && !e.includes('__MACOSX'),
    )

    if (!themeJsonEntry) {
      return NextResponse.json(
        { error: 'El ZIP debe contener un archivo theme.json' },
        { status: 400 },
      )
    }

    if (themeJsonEntry.includes('/')) {
      rootPrefix = themeJsonEntry.substring(0, themeJsonEntry.lastIndexOf('/') + 1)
    }

    // Parse theme.json
    const themeJsonContent = await zip.files[themeJsonEntry].async('string')
    const themeConfig = JSON.parse(themeJsonContent) as {
      name: string
      slug?: string
      description?: string
      colors?: Record<string, string>
      fonts?: Record<string, string>
    }

    if (!themeConfig.name) {
      return NextResponse.json(
        { error: 'theme.json debe contener un campo "name"' },
        { status: 400 },
      )
    }

    const slug =
      themeConfig.slug ??
      themeConfig.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')

    // Extract section HTML files
    const sections: Record<string, string> = {}
    for (const section of SECTION_FILES) {
      const fileName = `${rootPrefix}${section}.html`
      if (zip.files[fileName]) {
        sections[section] = await zip.files[fileName].async('string')
      }
    }

    // Extract assets to themes-data directory (served via API route)
    const assetsDir = path.join(process.cwd(), 'themes-data', slug)
    await mkdir(assetsDir, { recursive: true })

    const assetsList: { name: string; path: string; size: number }[] = []
    const assetPrefix = `${rootPrefix}assets/`

    for (const [filePath, zipEntry] of Object.entries(zip.files)) {
      if (
        filePath.startsWith(assetPrefix) &&
        !zipEntry.dir &&
        !filePath.includes('__MACOSX')
      ) {
        const relativeName = filePath.replace(assetPrefix, '')
        const data = await zipEntry.async('nodebuffer')
        const destPath = path.join(assetsDir, relativeName)

        // Create subdirectories if needed
        await mkdir(path.dirname(destPath), { recursive: true })
        await writeFile(destPath, data)

        assetsList.push({
          name: relativeName,
          path: `/api/admin/themes/assets/${slug}/${relativeName}`,
          size: data.length,
        })
      }
    }

    // Replace {{asset:filename}} in section HTML with actual paths
    for (const key of Object.keys(sections)) {
      sections[key] = sections[key].replace(
        /\{\{asset:([^}]+)\}\}/g,
        (_match, assetName: string) => `/api/admin/themes/assets/${slug}/${assetName}`,
      )
    }

    // Upsert theme in database
    const theme = await prisma.customTheme.upsert({
      where: { slug },
      create: {
        name: themeConfig.name,
        slug,
        description: themeConfig.description ?? null,
        config: themeConfig as any,
        navbar: sections['navbar'] ?? null,
        hero: sections['hero'] ?? null,
        about: sections['about'] ?? null,
        clases: sections['clases'] ?? null,
        profesores: sections['profesores'] ?? null,
        precios: sections['precios'] ?? null,
        testimonios: sections['testimonios'] ?? null,
        contacto: sections['contacto'] ?? null,
        footer: sections['footer'] ?? null,
        classesHeader: sections['classes-header'] ?? null,
        headHtml: sections['head'] ?? null,
        assets: assetsList,
      },
      update: {
        name: themeConfig.name,
        description: themeConfig.description ?? null,
        config: themeConfig as any,
        navbar: sections['navbar'] ?? null,
        hero: sections['hero'] ?? null,
        about: sections['about'] ?? null,
        clases: sections['clases'] ?? null,
        profesores: sections['profesores'] ?? null,
        precios: sections['precios'] ?? null,
        testimonios: sections['testimonios'] ?? null,
        contacto: sections['contacto'] ?? null,
        footer: sections['footer'] ?? null,
        classesHeader: sections['classes-header'] ?? null,
        headHtml: sections['head'] ?? null,
        assets: assetsList,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json({
      success: true,
      theme: {
        id: theme.id,
        name: theme.name,
        slug: theme.slug,
        sections: Object.keys(sections),
        assetsCount: assetsList.length,
      },
    })
  } catch (err: any) {
    console.error('Theme upload error:', err)
    return NextResponse.json(
      { error: `Error al procesar el tema: ${err.message}` },
      { status: 500 },
    )
  }
}
