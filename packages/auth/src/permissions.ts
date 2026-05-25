export type UserRole = 'SUPER_ADMIN' | 'ORG_ADMIN' | 'INSTRUCTOR' | 'STUDENT'

export type Permission =
  | 'booking.create'
  | 'booking.cancel_own'
  | 'booking.cancel_any'
  | 'booking.checkin'
  | 'class.create'
  | 'class.update'
  | 'class.delete'
  | 'schedule.create'
  | 'schedule.update'
  | 'schedule.delete'
  | 'membership.create'
  | 'membership.update'
  | 'membership.assign'
  | 'student.list'
  | 'student.view'
  | 'student.update'
  | 'community.post'
  | 'community.moderate'
  | 'retreat.create'
  | 'retreat.update'
  | 'retreat.book'
  | 'org.settings'
  | 'platform.manage_orgs'
  | 'platform.manage_themes'
  | 'platform.manage_plans'
  | 'platform.billing'

const permissionMap: Record<UserRole, Permission[]> = {
  SUPER_ADMIN: [
    'platform.manage_orgs',
    'platform.manage_themes',
    'platform.manage_plans',
    'platform.billing',
  ],
  ORG_ADMIN: [
    'booking.create',
    'booking.cancel_own',
    'booking.cancel_any',
    'booking.checkin',
    'class.create',
    'class.update',
    'class.delete',
    'schedule.create',
    'schedule.update',
    'schedule.delete',
    'membership.create',
    'membership.update',
    'membership.assign',
    'student.list',
    'student.view',
    'student.update',
    'community.post',
    'community.moderate',
    'retreat.create',
    'retreat.update',
    'retreat.book',
    'org.settings',
  ],
  INSTRUCTOR: [
    'booking.create',
    'booking.cancel_own',
    'booking.checkin',
    'student.list',
    'student.view',
    'community.post',
    'retreat.book',
  ],
  STUDENT: [
    'booking.create',
    'booking.cancel_own',
    'community.post',
    'retreat.book',
  ],
}

export function hasPermission(role: UserRole, permission: Permission): boolean {
  return permissionMap[role].includes(permission)
}

export function requirePermission(role: UserRole, permission: Permission): void {
  if (!hasPermission(role, permission)) {
    throw new Error(`Rol ${role} no tiene permiso para: ${permission}`)
  }
}
