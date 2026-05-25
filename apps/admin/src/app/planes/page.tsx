import { prisma } from '@yogara/database'

export const dynamic = 'force-dynamic'

export default async function PlanesPage() {
  const plans = await prisma.subscriptionPlan.findMany({
    orderBy: { sortOrder: 'asc' },
    include: {
      _count: { select: { organizations: true } },
    },
  })

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Planes de Suscripción</h1>

      {plans.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <p className="text-gray-500">No hay planes configurados.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((plan) => (
            <div key={plan.id} className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 text-lg mb-2">{plan.name}</h3>
              {plan.description && (
                <p className="text-sm text-gray-600 mb-4">{plan.description}</p>
              )}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Mensual</span>
                  <span className="font-medium text-gray-900">{Number(plan.priceMonthly)}€/mes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Anual</span>
                  <span className="font-medium text-gray-900">{Number(plan.priceYearly)}€/año</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Max alumnos</span>
                  <span className="text-gray-900">{plan.maxStudents}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Max instructores</span>
                  <span className="text-gray-900">{plan.maxInstructors}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Max clases</span>
                  <span className="text-gray-900">{plan.maxClasses}</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100 text-sm text-gray-600">
                {plan._count.organizations} organizaciones suscritas
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
