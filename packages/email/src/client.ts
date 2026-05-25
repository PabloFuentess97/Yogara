import { Resend } from 'resend'

let _client: Resend | null = null

function getEmailClient(): Resend {
  if (!_client) {
    _client = new Resend(process.env.RESEND_API_KEY)
  }
  return _client
}

interface SendEmailParams {
  to: string
  subject: string
  html: string
  from?: string
}

export async function sendEmail({ to, subject, html, from }: SendEmailParams) {
  const result = await getEmailClient().emails.send({
    from: from ?? 'Yogara <noreply@yogara.app>',
    to,
    subject,
    html,
  })
  return result
}
