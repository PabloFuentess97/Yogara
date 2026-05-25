import { Resend } from 'resend'

export const emailClient = new Resend(process.env.RESEND_API_KEY)

interface SendEmailParams {
  to: string
  subject: string
  html: string
  from?: string
}

export async function sendEmail({ to, subject, html, from }: SendEmailParams) {
  const result = await emailClient.emails.send({
    from: from ?? 'Yogara <noreply@yogara.app>',
    to,
    subject,
    html,
  })
  return result
}
