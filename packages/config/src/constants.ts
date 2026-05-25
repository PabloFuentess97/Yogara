export const PLATFORM_NAME = 'Yogara'
export const PLATFORM_DOMAIN = 'yogara.app'

export const DEFAULT_TIMEZONE = 'Europe/Madrid'
export const DEFAULT_CURRENCY = 'EUR'
export const DEFAULT_COUNTRY = 'ES'

export const SESSION_MAX_AGE = 30 * 24 * 60 * 60 // 30 days in seconds

export const PAGINATION_DEFAULT_LIMIT = 20
export const PAGINATION_MAX_LIMIT = 100

export const RATE_LIMIT = {
  GENERAL: { requests: 100, window: 60 }, // 100 req/min
  AUTH: { requests: 10, window: 60 }, // 10 req/min
} as const

export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ORG_ADMIN: 'ORG_ADMIN',
  INSTRUCTOR: 'INSTRUCTOR',
  STUDENT: 'STUDENT',
} as const

export const BOOKING_RULES = {
  MIN_CANCEL_HOURS: 2, // horas mínimas antes de la clase para cancelar
  MAX_WAITLIST_SIZE: 5,
} as const

export const MEMBERSHIP_RULES = {
  EXPIRY_WARNING_DAYS: 7, // días antes de expiración para notificar
  GRACE_PERIOD_DAYS: 3, // días de gracia después de expiración
} as const
