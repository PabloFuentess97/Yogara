import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Planes de suscripción
  const starterPlan = await prisma.subscriptionPlan.upsert({
    where: { slug: 'starter' },
    update: {},
    create: {
      name: 'Starter',
      slug: 'starter',
      description: 'Perfecto para centros pequeños que están empezando',
      priceMonthly: 29,
      priceYearly: 290,
      maxStudents: 50,
      maxInstructors: 3,
      maxClasses: 10,
      features: { comunidad: false, retiros: false, online: false },
      sortOrder: 1,
    },
  })

  const proPlan = await prisma.subscriptionPlan.upsert({
    where: { slug: 'pro' },
    update: {},
    create: {
      name: 'Pro',
      slug: 'pro',
      description: 'Para centros en crecimiento con todas las funcionalidades',
      priceMonthly: 59,
      priceYearly: 590,
      maxStudents: 200,
      maxInstructors: 10,
      maxClasses: 30,
      features: { comunidad: true, retiros: true, online: true },
      sortOrder: 2,
    },
  })

  const enterprisePlan = await prisma.subscriptionPlan.upsert({
    where: { slug: 'enterprise' },
    update: {},
    create: {
      name: 'Enterprise',
      slug: 'enterprise',
      description: 'Sin límites. Para centros grandes y multi-sede',
      priceMonthly: 99,
      priceYearly: 990,
      maxStudents: 9999,
      maxInstructors: 9999,
      maxClasses: 9999,
      features: { comunidad: true, retiros: true, online: true, multiSede: true },
      sortOrder: 3,
    },
  })

  // Super Admin
  const superAdmin = await prisma.user.upsert({
    where: { email: 'admin@yogara.app' },
    update: {},
    create: {
      email: 'admin@yogara.app',
      name: 'Pablo Admin',
      isPlatformAdmin: true,
      passwordHash: await hash('admin123', 12),
      emailVerified: new Date(),
    },
  })

  // Organización de prueba
  const org = await prisma.organization.upsert({
    where: { slug: 'union-alkimia' },
    update: {},
    create: {
      name: 'Unión Alkimia',
      slug: 'union-alkimia',
      email: 'info@unionalkimia.com',
      phone: '+34 666 123 456',
      address: 'Calle Yoga 42, Local 3',
      city: 'Madrid',
      country: 'ES',
      timezone: 'Europe/Madrid',
      currency: 'EUR',
      themeId: 'zen-minimal',
      description: 'Centro de yoga y bienestar en el corazón de Madrid. Clases de Hatha, Vinyasa, meditación y más.',
      subscriptionPlanId: proPlan.id,
      subscriptionStatus: 'ACTIVE',
      settings: {
        socialMedia: {
          instagram: '@unionalkimia',
          facebook: 'unionalkimia',
        },
        heroTitle: 'Encuentra tu equilibrio interior',
        heroSubtitle: 'Yoga, meditación y bienestar en el corazón de Madrid',
      },
    },
  })

  // Org Admin
  const orgAdminUser = await prisma.user.upsert({
    where: { email: 'maria@unionalkimia.com' },
    update: {},
    create: {
      email: 'maria@unionalkimia.com',
      name: 'María García',
      passwordHash: await hash('admin123', 12),
      emailVerified: new Date(),
    },
  })

  await prisma.organizationMember.upsert({
    where: { organizationId_userId: { organizationId: org.id, userId: orgAdminUser.id } },
    update: {},
    create: {
      organizationId: org.id,
      userId: orgAdminUser.id,
      role: 'ORG_ADMIN',
    },
  })

  // Instructor
  const instructorUser = await prisma.user.upsert({
    where: { email: 'carlos@unionalkimia.com' },
    update: {},
    create: {
      email: 'carlos@unionalkimia.com',
      name: 'Carlos López',
      passwordHash: await hash('instructor123', 12),
      emailVerified: new Date(),
    },
  })

  const instructor = await prisma.organizationMember.upsert({
    where: { organizationId_userId: { organizationId: org.id, userId: instructorUser.id } },
    update: {},
    create: {
      organizationId: org.id,
      userId: instructorUser.id,
      role: 'INSTRUCTOR',
    },
  })

  // Sala
  const sala = await prisma.room.upsert({
    where: { id: '00000000-0000-0000-0000-000000000001' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000001',
      organizationId: org.id,
      name: 'Sala Shiva',
      capacity: 15,
      description: 'Sala principal con luz natural y suelo de madera',
    },
  })

  // Tipos de clase
  const hatha = await prisma.classType.upsert({
    where: { organizationId_slug: { organizationId: org.id, slug: 'hatha-yoga' } },
    update: {},
    create: {
      organizationId: org.id,
      name: 'Hatha Yoga',
      slug: 'hatha-yoga',
      description: 'Clase de yoga tradicional enfocada en posturas y respiración. Ritmo pausado, ideal para todos los niveles.',
      durationMinutes: 75,
      color: '#8B7355',
      level: 'ALL',
      sortOrder: 1,
    },
  })

  const vinyasa = await prisma.classType.upsert({
    where: { organizationId_slug: { organizationId: org.id, slug: 'vinyasa-flow' } },
    update: {},
    create: {
      organizationId: org.id,
      name: 'Vinyasa Flow',
      slug: 'vinyasa-flow',
      description: 'Yoga dinámico que sincroniza movimiento con respiración. Secuencias fluidas y energéticas.',
      durationMinutes: 60,
      color: '#C4956A',
      level: 'INTERMEDIATE',
      sortOrder: 2,
    },
  })

  const meditacion = await prisma.classType.upsert({
    where: { organizationId_slug: { organizationId: org.id, slug: 'meditacion' } },
    update: {},
    create: {
      organizationId: org.id,
      name: 'Meditación',
      slug: 'meditacion',
      description: 'Sesión guiada de meditación mindfulness. Aprende técnicas para calmar la mente y reducir el estrés.',
      durationMinutes: 30,
      color: '#6B7280',
      level: 'ALL',
      sortOrder: 3,
    },
  })

  // Horarios
  const schedules = [
    { classTypeId: hatha.id, dayOfWeek: 0, startTime: '09:00', endTime: '10:15' },
    { classTypeId: vinyasa.id, dayOfWeek: 0, startTime: '18:00', endTime: '19:00' },
    { classTypeId: meditacion.id, dayOfWeek: 1, startTime: '08:00', endTime: '08:30' },
    { classTypeId: hatha.id, dayOfWeek: 2, startTime: '09:00', endTime: '10:15' },
    { classTypeId: vinyasa.id, dayOfWeek: 2, startTime: '18:00', endTime: '19:00' },
    { classTypeId: hatha.id, dayOfWeek: 4, startTime: '09:00', endTime: '10:15' },
    { classTypeId: meditacion.id, dayOfWeek: 4, startTime: '19:30', endTime: '20:00' },
  ]

  for (const schedule of schedules) {
    await prisma.schedule.create({
      data: {
        organizationId: org.id,
        classTypeId: schedule.classTypeId,
        instructorId: instructor.id,
        roomId: sala.id,
        dayOfWeek: schedule.dayOfWeek,
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        capacity: 15,
        validFrom: new Date('2026-01-01'),
      },
    })
  }

  // Alumnos de prueba
  const studentNames = [
    { name: 'Laura Martínez', email: 'laura@email.com' },
    { name: 'Pedro Sánchez', email: 'pedro@email.com' },
    { name: 'Ana Rodríguez', email: 'ana@email.com' },
    { name: 'Jorge Fernández', email: 'jorge@email.com' },
    { name: 'Sofía López', email: 'sofia@email.com' },
  ]

  for (const student of studentNames) {
    const user = await prisma.user.upsert({
      where: { email: student.email },
      update: {},
      create: {
        email: student.email,
        name: student.name,
        passwordHash: await hash('student123', 12),
        emailVerified: new Date(),
      },
    })

    await prisma.organizationMember.upsert({
      where: { organizationId_userId: { organizationId: org.id, userId: user.id } },
      update: {},
      create: {
        organizationId: org.id,
        userId: user.id,
        role: 'STUDENT',
      },
    })
  }

  // Membresías
  await prisma.membership.createMany({
    data: [
      {
        organizationId: org.id,
        name: 'Mensual Ilimitado',
        description: 'Acceso ilimitado a todas las clases durante un mes',
        type: 'UNLIMITED',
        price: 65,
        durationDays: 30,
        sortOrder: 1,
      },
      {
        organizationId: org.id,
        name: 'Bono 10 Clases',
        description: '10 clases para usar cuando quieras, sin caducidad',
        type: 'CLASS_PACK',
        price: 80,
        classLimit: 10,
        sortOrder: 2,
      },
      {
        organizationId: org.id,
        name: 'Clase Suelta',
        description: 'Una clase individual',
        type: 'DROP_IN',
        price: 12,
        durationDays: 1,
        classLimit: 1,
        sortOrder: 3,
      },
      {
        organizationId: org.id,
        name: 'Clase de Prueba',
        description: 'Tu primera clase es gratis',
        type: 'FREE_TRIAL',
        price: 0,
        durationDays: 7,
        classLimit: 1,
        sortOrder: 4,
      },
    ],
    skipDuplicates: true,
  })

  console.log('✅ Seed completed successfully!')
  console.log(`   - 3 planes de suscripción`)
  console.log(`   - 1 organización (Unión Alkimia)`)
  console.log(`   - 1 super admin (admin@yogara.app / admin123)`)
  console.log(`   - 1 org admin (maria@unionalkimia.com / admin123)`)
  console.log(`   - 1 instructor (carlos@unionalkimia.com / instructor123)`)
  console.log(`   - 5 alumnos de prueba (password: student123)`)
  console.log(`   - 3 tipos de clase`)
  console.log(`   - 1 sala`)
  console.log(`   - 7 horarios`)
  console.log(`   - 4 membresías`)
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
