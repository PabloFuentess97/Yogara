import { Worker, Job } from 'bullmq'
import { redisConnection } from '../client'
import {
  sendEmail,
  bookingConfirmedTemplate,
  bookingCancelledTemplate,
  welcomeTemplate,
  classReminderTemplate,
  membershipExpiringTemplate,
} from '@yogara/email'

export interface EmailJobData {
  type: string
  data: Record<string, string>
}

function buildEmail(job: EmailJobData): { to: string; subject: string; html: string } {
  const { type, data } = job

  switch (type) {
    case 'booking-confirmed': {
      const { to, userName, className, date, time, instructor, room, orgName } = data
      const template = bookingConfirmedTemplate({
        userName,
        className,
        date,
        time,
        instructor,
        room,
        orgName,
      })
      return { to, ...template }
    }

    case 'booking-cancelled': {
      const { to, userName, className, date, time, orgName } = data
      const template = bookingCancelledTemplate({
        userName,
        className,
        date,
        time,
        orgName,
      })
      return { to, ...template }
    }

    case 'welcome': {
      const { to, userName, orgName, loginUrl } = data
      const template = welcomeTemplate({
        userName,
        orgName,
        loginUrl,
      })
      return { to, ...template }
    }

    case 'class-reminder': {
      const { to, userName, className, date, time, instructor, orgName } = data
      const template = classReminderTemplate({
        userName,
        className,
        date,
        time,
        instructor,
        orgName,
      })
      return { to, ...template }
    }

    case 'membership-expiring': {
      const { to, userName, membershipName, expiryDate, renewUrl, orgName } = data
      const template = membershipExpiringTemplate({
        userName,
        membershipName,
        expiresAt: expiryDate,
        daysLeft: calculateDaysLeft(expiryDate),
        orgName,
        renewUrl,
      })
      return { to, ...template }
    }

    default:
      throw new Error(`Unknown email job type: ${type}`)
  }
}

function calculateDaysLeft(expiryDate: string): number {
  const now = new Date()
  const expiry = new Date(expiryDate)
  const diff = expiry.getTime() - now.getTime()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

export const emailWorker = new Worker<EmailJobData>(
  'yogara:emails',
  async (job: Job<EmailJobData>) => {
    const { to, subject, html } = buildEmail(job.data)

    const result = await sendEmail({ to, subject, html })
    return result
  },
  {
    connection: redisConnection,
    concurrency: 5,
  },
)

emailWorker.on('completed', (job) => {
  console.log(`[email-worker] Job ${job.id} completed (${job.data.type} -> ${job.data.data.to})`)
})

emailWorker.on('failed', (job, err) => {
  console.error(
    `[email-worker] Job ${job?.id} failed (${job?.data.type} -> ${job?.data.data.to}):`,
    err.message,
  )
})

emailWorker.on('error', (err) => {
  console.error('[email-worker] Worker error:', err.message)
})
