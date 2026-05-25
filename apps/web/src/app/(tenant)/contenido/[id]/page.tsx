import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@yogara/database'
import { resolveTenant } from '@/lib/tenant'
import { optionalStudent } from '@/lib/student-auth'
import { incrementViewAction } from '../actions'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const org = await resolveTenant()
  const content = await prisma.onlineContent.findFirst({
    where: { id, organizationId: org.id, isPublished: true },
  })
  if (!content) return { title: 'No encontrado' }
  return { title: `${content.title} | ${org.name}` }
}

export default async function ContenidoDetailPage({ params }: Props) {
  const { id } = await params
  const org = await resolveTenant()

  const content = await prisma.onlineContent.findFirst({
    where: { id, organizationId: org.id, isPublished: true },
    include: { instructor: { include: { user: true } } },
  })

  if (!content) notFound()

  const student = await optionalStudent()
  let hasMembership = false
  if (student) {
    const activeMembership = await prisma.userMembership.findFirst({
      where: { memberId: student.memberId, status: 'ACTIVE' },
    })
    hasMembership = !!activeMembership
  }

  if (content.requiresMembership && !hasMembership) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <h1 className="text-2xl font-bold text-stone-900 mb-4">Contenido exclusivo</h1>
        <p className="text-stone-600 mb-6">
          Este contenido requiere una membresía activa. Suscríbete para acceder a toda nuestra biblioteca.
        </p>
        <Link href="/membresias" className="inline-block px-6 py-3 rounded-lg bg-stone-900 text-white font-medium hover:bg-stone-800">
          Ver membresías
        </Link>
      </div>
    )
  }

  await incrementViewAction(content.id)

  const videoId = extractVideoId(content.videoUrl)

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="aspect-video bg-black rounded-xl overflow-hidden mb-6">
        {videoId.type === 'youtube' ? (
          <iframe
            src={`https://www.youtube.com/embed/${videoId.id}`}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : videoId.type === 'vimeo' ? (
          <iframe
            src={`https://player.vimeo.com/video/${videoId.id}`}
            className="w-full h-full"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <iframe src={content.videoUrl} className="w-full h-full" allowFullScreen />
        )}
      </div>

      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">{content.title}</h1>
          <div className="flex items-center gap-3 mt-2 text-sm text-stone-500">
            <span>{content.instructor.user.name}</span>
            <span>·</span>
            <span>{content.category}</span>
            <span>·</span>
            <span>{content.durationMinutes} min</span>
            <span>·</span>
            <span>{levelLabel(content.level)}</span>
          </div>
        </div>
        <div className="text-sm text-stone-400">{content.viewsCount} visualizaciones</div>
      </div>

      {content.description && (
        <p className="text-stone-600 leading-relaxed">{content.description}</p>
      )}
    </div>
  )
}

function extractVideoId(url: string): { type: 'youtube' | 'vimeo' | 'other'; id: string } {
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/)
  if (ytMatch) return { type: 'youtube', id: ytMatch[1]! }

  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/)
  if (vimeoMatch) return { type: 'vimeo', id: vimeoMatch[1]! }

  return { type: 'other', id: '' }
}

function levelLabel(level: string): string {
  const labels: Record<string, string> = {
    ALL: 'Todos',
    BEGINNER: 'Principiante',
    INTERMEDIATE: 'Intermedio',
    ADVANCED: 'Avanzado',
  }
  return labels[level] ?? level
}
