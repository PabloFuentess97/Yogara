import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@yogara/database'
import { sendEmail, membershipExpiringTemplate } from '@yogara/email'

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const threeDaysFromNow = new Date()
  threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3)
  threeDaysFromNow.setHours(0, 0, 0, 0)

  const fourDaysFromNow = new Date(threeDaysFromNow)
  fourDaysFromNow.setDate(fourDaysFromNow.getDate() + 1)

  const expiringMemberships = await prisma.userMembership.findMany({
    where: {
      status: 'ACTIVE',
      expiresAt: { gte: threeDaysFromNow, lt: fourDaysFromNow },
    },
    include: {
      membership: true,
      member: {
        include: {
          user: true,
          organization: true,
        },
      },
    },
  })

  let sent = 0

  for (const um of expiringMemberships) {
    const user = um.member.user
    if (!user.email) continue

    const org = um.member.organization
    const slug = org.slug
    const renewUrl = `https://${slug}.yogara.app/membresias`

    const template = membershipExpiringTemplate({
      userName: user.name ?? 'Alumno',
      membershipName: um.membership.name,
      expiresAt: um.expiresAt!.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      daysLeft: 3,
      renewUrl,
      orgName: org.name,
    })

    await sendEmail({ to: user.email, ...template }).catch(() => {})
    sent++
  }

  return NextResponse.json({ sent, total: expiringMemberships.length })
}
