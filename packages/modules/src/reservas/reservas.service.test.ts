import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@yogara/database', () => ({
  prisma: {
    classSession: {
      findFirst: vi.fn(),
      update: vi.fn(),
    },
    booking: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      findMany: vi.fn(),
    },
  },
}))

import { prisma } from '@yogara/database'
import { reservasService } from './reservas.service'

const mockPrisma = vi.mocked(prisma)

describe('reservasService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('crear', () => {
    it('should return error when session not found', async () => {
      mockPrisma.classSession.findFirst.mockResolvedValue(null)

      const result = await reservasService.crear(
        { classSessionId: 'session-1' },
        'member-1',
        'org-1',
      )

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error).toBe('Sesión de clase no encontrada')
      }
    })

    it('should return error when session is not scheduled', async () => {
      mockPrisma.classSession.findFirst.mockResolvedValue({
        id: 'session-1',
        organizationId: 'org-1',
        status: 'CANCELLED',
        capacity: 20,
        bookedCount: 0,
      } as never)

      const result = await reservasService.crear(
        { classSessionId: 'session-1' },
        'member-1',
        'org-1',
      )

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error).toBe('La clase no está disponible para reservas')
      }
    })

    it('should return error when already booked', async () => {
      mockPrisma.classSession.findFirst.mockResolvedValue({
        id: 'session-1',
        organizationId: 'org-1',
        status: 'SCHEDULED',
        capacity: 20,
        bookedCount: 5,
      } as never)

      mockPrisma.booking.findUnique.mockResolvedValue({
        id: 'booking-1',
        status: 'CONFIRMED',
      } as never)

      const result = await reservasService.crear(
        { classSessionId: 'session-1' },
        'member-1',
        'org-1',
      )

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error).toBe('Ya tienes una reserva para esta clase')
      }
    })

    it('should create a confirmed booking when spots are available', async () => {
      mockPrisma.classSession.findFirst.mockResolvedValue({
        id: 'session-1',
        organizationId: 'org-1',
        status: 'SCHEDULED',
        capacity: 20,
        bookedCount: 5,
      } as never)

      mockPrisma.booking.findUnique.mockResolvedValue(null)

      mockPrisma.booking.create.mockResolvedValue({
        id: 'new-booking-1',
        status: 'CONFIRMED',
      } as never)

      const result = await reservasService.crear(
        { classSessionId: 'session-1' },
        'member-1',
        'org-1',
      )

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.id).toBe('new-booking-1')
      }
      expect(mockPrisma.booking.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          status: 'CONFIRMED',
          waitlistPosition: null,
        }),
      })
      expect(mockPrisma.classSession.update).toHaveBeenCalledWith({
        where: { id: 'session-1' },
        data: { bookedCount: { increment: 1 } },
      })
    })

    it('should create a waitlisted booking when class is full', async () => {
      mockPrisma.classSession.findFirst.mockResolvedValue({
        id: 'session-1',
        organizationId: 'org-1',
        status: 'SCHEDULED',
        capacity: 10,
        bookedCount: 10,
      } as never)

      mockPrisma.booking.findUnique.mockResolvedValue(null)

      mockPrisma.booking.findFirst.mockResolvedValue({
        waitlistPosition: 2,
      } as never)

      mockPrisma.booking.create.mockResolvedValue({
        id: 'waitlisted-1',
        status: 'WAITLISTED',
      } as never)

      const result = await reservasService.crear(
        { classSessionId: 'session-1' },
        'member-1',
        'org-1',
      )

      expect(result.success).toBe(true)
      expect(mockPrisma.booking.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          status: 'WAITLISTED',
          waitlistPosition: 3,
        }),
      })
      expect(mockPrisma.classSession.update).not.toHaveBeenCalled()
    })
  })

  describe('cancelar', () => {
    it('should return error when booking not found', async () => {
      mockPrisma.booking.findFirst.mockResolvedValue(null)

      const result = await reservasService.cancelar(
        { bookingId: 'booking-1' },
        'member-1',
        'org-1',
      )

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error).toBe('Reserva no encontrada')
      }
    })

    it('should cancel and decrement when booking was confirmed', async () => {
      mockPrisma.booking.findFirst.mockResolvedValue({
        id: 'booking-1',
        status: 'CONFIRMED',
        classSessionId: 'session-1',
      } as never)

      const result = await reservasService.cancelar(
        { bookingId: 'booking-1' },
        'member-1',
        'org-1',
      )

      expect(result.success).toBe(true)
      expect(mockPrisma.booking.update).toHaveBeenCalledWith({
        where: { id: 'booking-1' },
        data: { status: 'CANCELLED', cancelledAt: expect.any(Date) },
      })
      expect(mockPrisma.classSession.update).toHaveBeenCalledWith({
        where: { id: 'session-1' },
        data: { bookedCount: { decrement: 1 } },
      })
    })
  })
})
