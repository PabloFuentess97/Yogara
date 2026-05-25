import { prisma } from '@yogara/database'

export const dynamic = 'force-dynamic'

export default async function SuperAdminDashboard() {
  const [totalOrgs, activeOrgs, totalUsers, totalBookings] = await Promise.all([
    prisma.organization.count(),
    prisma.organization.count({ where: { isActive: true } }),
    prisma.user.count(),
    prisma.booking.count({ where: { status: 'CONFIRMED' } }),
  ])

  const recentOrgs = await prisma.organization.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
    include: {
      _count: { select: { members: true } },
    },
  })

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Platform Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KpiCard label="Organizaciones" value={totalOrgs} />
        <KpiCard label="Orgs activas" value={activeOrgs} />
        <KpiCard label="Usuarios totales" value={totalUsers} />
        <KpiCard label="Reservas totales" value={totalBookings} />
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Organizaciones recientes</h2>
        <div className="space-y-3">
          {recentOrgs.map((org) => (
            <div
              key={org.id}
              className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
            >
              <div>
                <p className="font-medium text-gray-900">{org.name}</p>
                <p className="text-sm text-gray-500">{org.slug}.yogara.app</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-700">{org._count.members} miembros</p>
                <p className="text-xs text-gray-400">
                  {org.subscriptionStatus}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function KpiCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
    </div>
  )
}
