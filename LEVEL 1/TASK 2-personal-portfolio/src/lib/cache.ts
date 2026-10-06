// Minimal localStorage cache with a TTL, used by the GitHub and Duolingo
// providers so we don't refetch external data on every render/visit.
//
// This is a Vite SPA deployed to GitHub Pages (see vite.config.ts) — there's
// no server to do this caching for us, so it happens in the browser instead.
// Deliberately dependency-free.

interface CacheEnvelope<T> {
  data: T
  timestamp: number
}

export function readCache<T>(key: string): CacheEnvelope<T> | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return null
    const parsed = JSON.parse(raw) as CacheEnvelope<T>
    if (typeof parsed?.timestamp !== 'number') return null
    return parsed
  } catch {
    // Corrupt entry or localStorage unavailable (private browsing, quota,
    // disabled storage) — treat as a cache miss rather than throwing.
    return null
  }
}

export function writeCache<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return
  try {
    const envelope: CacheEnvelope<T> = { data, timestamp: Date.now() }
    window.localStorage.setItem(key, JSON.stringify(envelope))
  } catch {
    // Non-critical — the site works fine without a persisted cache.
  }
}

export function isStale(timestamp: number, ttlMs: number): boolean {
  return Date.now() - timestamp > ttlMs
}
