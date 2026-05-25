export { redisConnection, emailQueue } from './client'
export { emailWorker } from './workers/email.worker'
export type { EmailJobData } from './workers/email.worker'

import { emailQueue } from './client'

/**
 * Convenience function to enqueue an email job.
 *
 * @param type - The email type (e.g. 'booking-confirmed', 'welcome')
 * @param data - The data payload for the email template
 */
export async function enqueueEmail(type: string, data: Record<string, string>) {
  const job = await emailQueue.add(type, { type, data })
  return job
}
