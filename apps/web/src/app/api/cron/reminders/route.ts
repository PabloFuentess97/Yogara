import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@yogara/database'
import { sendEmail, classReminderTemplate } from '@yogara/email'

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(0, 0, 0, 0)

  const dayAfter = new Date(tomorrow)
  dayAfter.setDate(dayAfter.getDate() + 1)

  const bookings = await prisma.booking.findMany({
    where: {
      status: 'CONFIRMED',
      classSession: {
        date: { gte: tomorrow, lt: dayAfter },
        status: 'SCHEDULED',
      },
    },
    include: {
      classSession: {
        include: {
          classType: true,
          instructor: { include: { user: true } },
          organization: true,
        },
      },
      member: {
        include: { user: true },
      },
    },
  })

  let sent = 0

  for (const booking of bookings) {
    const user = booking.member.user
    if (!user.email) continue

    const session = booking.classSession
    const template = classReminderTemplate({
      userName: user.name ?? 'Alumno',
      className: session.classType.name,
      date: session.date.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      time: `${session.startTime} - ${session.endTime}`,
      instructor: session.instructor?.user.name ?? 'Sin asignar',
      orgName: session.organization.name,
    })

    await sendEmail({ to: user.email, ...template }).catch(() => {})
    sent++
  }

  return NextResponse.json({ sent, total: bookings.length })
}
