import Link from 'next/link'
import { prisma } from '@yogara/database'

interface Organization {
  id: string
  name: string
  description: string | null
  email: string
  phone: string | null
  address: string | null
  city: string | null
}

export async function TenantHome({ org }: { org: Organization }) {
  const [classTypes, memberships, instructors] = await Promise.all([
    prisma.classType.findMany({
      where: { organizationId: org.id, isActive: true },
      orderBy: { sortOrder: 'asc' },
      take: 6,
    }),
    prisma.membership.findMany({
      where: { organizationId: org.id, isActive: true },
      orderBy: { sortOrder: 'asc' },
      take: 3,
    }),
    prisma.organizationMember.findMany({
      where: { organizationId: org.id, role: 'INSTRUCTOR', status: 'ACTIVE' },
      include: { user: true },
    }),
  ])

  return (
    <div>
      {/* Hero */}
      <section className="relative py-24 md:py-32 px-6 bg-stone-50">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-[family-name:var(--font-heading)] text-4xl md:text-5xl lg:text-6xl font-bold text-stone-900 leading-tight">
            {org.name}
          </h1>
          {org.description && (
            <p className="mt-4 text-lg text-stone-600 max-w-2xl mx-auto">{org.description}</p>
          )}
          <div className="mt-8 flex items-center justify-center gap-4">
            <Link
              href="/horarios"
              className="px-6 py-3 rounded-full bg-stone-900 text-white font-medium hover:bg-stone-800 transition-colors"
            >
              Ver horarios
            </Link>
            <Link
              href="/clases"
              className="px-6 py-3 rounded-full border border-stone-300 text-stone-700 font-medium hover:bg-stone-100 transition-colors"
            >
              Nuestras clases
            </Link>
          </div>
        </div>
      </section>

      {/* Clases */}
      {classTypes.length > 0 && (
        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-stone-900 text-center mb-3">
              Nuestras Clases
            </h2>
            <p className="text-stone-600 text-center mb-10 max-w-lg mx-auto">
              Diferentes disciplinas adaptadas a todos los niveles
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {classTypes.map((ct) => (
                <Link
                  key={ct.id}
                  href={`/clases/${ct.slug}`}
                  className="group p-6 rounded-2xl border border-stone-200 hover:shadow-md transition-shadow bg-white"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: ct.color ?? '#8B7355' }}
                    />
                    <h3 className="font-semibold text-stone-900 group-hover:text-stone-700">
                      {ct.name}
                    </h3>
                  </div>
                  {ct.description && (
                    <p className="text-sm text-stone-600 line-clamp-2">{ct.description}</p>
                  )}
                  <p className="text-xs text-stone-500 mt-3">{ct.durationMinutes} min</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Profesores */}
      {instructors.length > 0 && (
        <section className="py-20 px-6 bg-stone-50/50">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-stone-900 text-center mb-10">
              Nuestro Equipo
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {instructors.map((i) => (
                <div key={i.id} className="text-center">
                  <div className="w-20 h-20 rounded-full bg-stone-200 mx-auto mb-3 flex items-center justify-center text-stone-600 font-medium">
                    {i.user.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>
                  <p className="font-medium text-stone-900 text-sm">{i.user.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Precios */}
      {memberships.length > 0 && (
        <section className="py-20 px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-stone-900 text-center mb-3">
              Planes
            </h2>
            <p className="text-stone-600 text-center mb-10">
              Elige el plan que mejor se adapte a tu práctica
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {memberships.map((plan, index) => (
                <div
                  key={plan.id}
                  className={`rounded-2xl border p-6 bg-white ${
                    index === 0 ? 'border-stone-900 shadow-lg' : 'border-stone-200'
                  }`}
                >
                  <h3 className="font-semibold text-stone-900 mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    {Number(plan.price) === 0 ? (
                      <span className="text-2xl font-bold text-stone-900">Gratis</span>
                    ) : (
                      <span className="text-2xl font-bold text-stone-900">
                        {Number(plan.price)}€
                      </span>
                    )}
                  </div>
                  <Link
                    href="/registro"
                    className="block w-full py-2 rounded-lg bg-stone-900 text-white text-sm font-medium text-center hover:bg-stone-800 transition-colors"
                  >
                    Empezar
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contacto */}
      <section className="py-20 px-6 bg-stone-50">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-stone-900 mb-4">
            Contacto
          </h2>
          <div className="space-y-2 text-stone-600">
            {org.address && <p>{org.address}</p>}
            {org.city && <p>{org.city}</p>}
            {org.phone && <p>{org.phone}</p>}
            <p>{org.email}</p>
          </div>
        </div>
      </section>
    </div>
  )
}
