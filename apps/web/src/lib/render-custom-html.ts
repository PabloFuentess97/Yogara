export function renderCustomHtml(html: string, org: {
  name: string
  description: string | null
  email: string
  phone: string | null
  address: string | null
  city: string | null
  logoUrl: string | null
  settings: any
}): string {
  const logoUrl = (org.settings as any)?.brand?.logoUrl || org.logoUrl || ''

  const replacements: Record<string, string> = {
    '{{nombre}}': org.name,
    '{{descripcion}}': org.description ?? '',
    '{{email}}': org.email,
    '{{telefono}}': org.phone ?? '',
    '{{direccion}}': org.address ?? '',
    '{{ciudad}}': org.city ?? '',
    '{{logo}}': logoUrl,
    '{{enlace_clases}}': '/clases',
    '{{enlace_horarios}}': '/horarios',
    '{{enlace_reservas}}': '/reservas',
    '{{enlace_login}}': '/login',
    '{{enlace_registro}}': '/registro',
  }

  let result = html
  for (const [key, value] of Object.entries(replacements)) {
    result = result.replaceAll(key, value)
  }
  return result
}
