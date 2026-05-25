/**
 * Safely access nested values from org.settings using a dot-notation path.
 * Returns the fallback if any segment is undefined or the final value is falsy.
 */
export function getSetting<T = unknown>(
  settings: Record<string, unknown> | undefined | null,
  path: string,
  fallback: T
): T {
  if (!settings) return fallback
  const keys = path.split('.')
  let value: unknown = settings
  for (const key of keys) {
    if (value === null || value === undefined || typeof value !== 'object') {
      return fallback
    }
    value = (value as Record<string, unknown>)[key]
  }
  return (value as T) || fallback
}
