import { NextRequest, NextResponse } from 'next/server'
import { readFile, stat } from 'fs/promises'
import path from 'path'

const THEMES_DIR = path.join(process.cwd(), 'themes-data')

const MIME_TYPES: Record<string, string> = {
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.ico': 'image/x-icon',
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const segments = (await params).path
  if (!segments || segments.length < 2) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  // Prevent path traversal
  const sanitized = segments.map((s) => s.replace(/\.\./g, ''))
  const filePath = path.join(THEMES_DIR, ...sanitized)

  if (!filePath.startsWith(THEMES_DIR)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    await stat(filePath)
    const data = await readFile(filePath)
    const ext = path.extname(filePath).toLowerCase()
    const contentType = MIME_TYPES[ext] ?? 'application/octet-stream'

    return new NextResponse(data, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
}
