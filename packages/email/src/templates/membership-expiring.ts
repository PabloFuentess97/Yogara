import { baseTemplate } from './base'

interface MembershipExpiringData {
  userName: string
  membershipName: string
  expiresAt: string
  daysLeft: number
  orgName: string
  renewUrl: string
}

export function membershipExpiringTemplate(data: MembershipExpiringData) {
  const content = `
    <h1 class="title">Tu membresía vence pronto</h1>
    <p class="text">Hola ${data.userName}, tu plan <strong>${data.membershipName}</strong> vence el ${data.expiresAt} (en ${data.daysLeft} días).</p>
    <p class="text">Renueva tu membresía para seguir disfrutando de todas las clases sin interrupción.</p>
    <p style="margin: 24px 0;">
      <a href="${data.renewUrl}" class="button">Renovar membresía</a>
    </p>
  `
  return {
    subject: `Tu membresía vence en ${data.daysLeft} días`,
    html: baseTemplate(content, data.orgName),
  }
}
