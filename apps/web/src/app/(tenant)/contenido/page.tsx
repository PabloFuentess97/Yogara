import type { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@yogara/database'
import { resolveTenant } from '@/lib/tenant'
import { optionalStudent } from '@/lib/student-auth'

export async function generateMetadata(): Promise<Metadata> {
  const org = await resolveTenant()
  return { title: `Contenido On Demand | ${org.name}` }
}

export default async function ContenidoPage() {
  const org = await resolveTenant()
  const student = await optionalStudent()

  let hasMembership = false
  if (student) {
    const activeMembership = await prisma.userMembership.findFirst({
      where: { memberId: student.memberId, status: 'ACTIVE' },
    })
    hasMembership = !!activeMembership
  }

  const contents = await prisma.onlineContent.findMany({
    where: {
      organizationId: org.id,
      isPublished: true,
      ...(hasMembership ? {} : { requiresMembership: false }),
    },
    orderBy: { createdAt: 'desc' },
    include: { instructor: { include: { user: true } } },
  })

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-stone-900 mb-2">Contenido On Demand</h1>
      <p className="text-stone-600 mb-8">
        Practica cuando quieras con nuestra biblioteca de clases grabadas.
      </p>

      {contents.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-stone-500">
            {student && !hasMembership
              ? 'Necesitas una membresía activa para acceder al contenido exclusivo.'
              : 'No hay contenido disponible por el momento.'}
          </p>
          {!hasMembership && (
            <Link href="/membresias" className="inline-block mt-4 px-6 py-2 rounded-lg bg-stone-900 text-white text-sm font-medium hover:bg-stone-800">
              Ver membresías
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contents.map((content) => (
            <Link
              key={content.id}
              href={`/contenido/${content.id}`}
              className="group bg-white rounded-xl border border-stone-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="aspect-video bg-stone-100 relative">
                {content.thumbnailUrl ? (
                  <img src={content.thumbnailUrl} alt={content.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-stone-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                )}
                <div className="absolute top-2 right-2 flex gap-1">
                  {!content.requiresMembership && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-500 text-white">
                      Gratis
                    </span>
                  )}
                </div>
                {content.durationMinutes > 0 && (
                  <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/70 text-white text-xs">
                    {content.durationMinutes} min
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-medium text-stone-900 group-hover:text-stone-700 transition-colors line-clamp-2">
                  {content.title}
                </h3>
                <div className="flex items-center gap-2 mt-2 text-xs text-stone-500">
                  <span>{content.instructor.user.name}</span>
                  <span>·</span>
                  <span>{content.category}</span>
                  <span>·</span>
                  <span>{levelLabel(content.level)}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
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
