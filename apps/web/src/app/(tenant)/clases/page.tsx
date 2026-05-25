import type { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@yogara/database'
import { resolveTenant } from '@/lib/tenant'
import { renderBlock } from '@/lib/render-custom-html'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Clases',
  description: 'Descubre todas las disciplinas que ofrecemos',
}

export default async function ClasesPage() {
  const org = await resolveTenant()

  const classTypes = await prisma.classType.findMany({
    where: { organizationId: org.id, isActive: true },
    orderBy: { sortOrder: 'asc' },
  })

  const levelLabels: Record<string, string> = {
    ALL: 'Todos los niveles',
    BEGINNER: 'Principiante',
    INTERMEDIATE: 'Intermedio',
    ADVANCED: 'Avanzado',
  }

  const classesHeader = org.customTheme?.classesHeader

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {classesHeader ? (
        <div dangerouslySetInnerHTML={{ __html: renderBlock(classesHeader, org) }} />
      ) : (
        <>
          <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-stone-900 mb-2">
            Nuestras Clases
          </h1>
          <p className="text-stone-600 mb-8">Descubre todas las disciplinas que ofrecemos</p>
        </>
      )}

      {classTypes.length === 0 ? (
        <p className="text-stone-500 text-center py-12">Próximamente publicaremos nuestras clases.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classTypes.map((clase) => (
            <Link
              key={clase.id}
              href={`/clases/${clase.slug}`}
              className="group bg-white rounded-2xl border border-stone-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="h-48 bg-stone-100 flex items-center justify-center">
                <div
                  className="w-16 h-16 rounded-full opacity-30"
                  style={{ backgroundColor: clase.color ?? '#8B7355' }}
                />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: clase.color ?? '#8B7355' }}
                  />
                  <h3 className="font-semibold text-stone-900 group-hover:text-stone-700 transition-colors">
                    {clase.name}
                  </h3>
                </div>
                {clase.description && (
                  <p className="text-sm text-stone-600 mb-3 line-clamp-2">{clase.description}</p>
                )}
                <div className="flex items-center gap-3 text-xs text-stone-500">
                  <span>{clase.durationMinutes} min</span>
                  <span>·</span>
                  <span>{levelLabels[clase.level] ?? clase.level}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
