import { requirePanelAuth } from '@/lib/panel-auth'
import { SubdomainSection } from './subdomain-section'
import { CustomDomainSection } from './custom-domain-section'

export const dynamic = 'force-dynamic'

export default async function DominioPage() {
  const { org } = await requirePanelAuth()

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-stone-900">Dominio</h1>
        <p className="text-stone-600 mt-1">
          Configura cómo acceden tus alumnos a tu sitio web.
        </p>
      </div>

      <div className="space-y-6">
        <SubdomainSection slug={org.slug} />
        <CustomDomainSection domains={org.customDomains} />
      </div>
    </div>
  )
}
