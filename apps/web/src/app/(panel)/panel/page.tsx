import Link from 'next/link'
import { requirePanelAuth } from '@/lib/panel-auth'

export const dynamic = 'force-dynamic'

export default async function PanelPage() {
  const { org } = await requirePanelAuth()
  const domain = process.env.NEXT_PUBLIC_APP_DOMAIN ?? 'yogara.app'

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-stone-900">{org.name}</h1>
        <p className="text-stone-600 mt-1">
          <a
            href={`https://${org.slug}.${domain}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-stone-500 hover:text-stone-700"
          >
            {org.slug}.{domain}
          </a>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Salas" value={org.rooms.length} />
        <StatCard label="Miembros" value={org._count.members} />
        <StatCard label="Sesiones" value={org._count.classSessions} />
        <StatCard
          label="Plan"
          value={org.subscriptionPlan?.name ?? 'Sin plan'}
          isText
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <QuickLink
          href="/panel/salas"
          title="Salas"
          description="Gestiona los espacios de tu centro"
        />
        <QuickLink
          href="/panel/apariencia"
          title="Apariencia"
          description="Cambia el tema visual de tu sitio web"
        />
        <QuickLink
          href="/panel/dominio"
          title="Dominio"
          description="Configura tu subdominio o dominio personalizado"
        />
        <QuickLink
          href="/panel/facturacion"
          title="Facturación"
          description="Gestiona tu plan y método de pago"
        />
      </div>
    </div>
  )
}

function StatCard({ label, value, isText }: { label: string; value: string | number; isText?: boolean }) {
  return (
    <div className="bg-white rounded-xl border border-stone-200 p-5">
      <p className="text-sm text-stone-500">{label}</p>
      <p className={`mt-1 font-bold text-stone-900 ${isText ? 'text-lg' : 'text-2xl'}`}>
        {value}
      </p>
    </div>
  )
}

function QuickLink({ href, title, description }: { href: string; title: string; description: string }) {
  return (
    <Link
      href={href}
      className="bg-white rounded-xl border border-stone-200 p-5 hover:border-stone-400 transition-colors group"
    >
      <h3 className="font-semibold text-stone-900 group-hover:text-stone-700">{title}</h3>
      <p className="text-sm text-stone-500 mt-1">{description}</p>
    </Link>
  )
}
