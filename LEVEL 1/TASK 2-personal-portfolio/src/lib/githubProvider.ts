import { GITHUB_USERNAME } from '../data/github'
import type { GithubData, GithubProfile, GithubRepo } from '../types/github'
import { isStale, readCache, writeCache } from './cache'

// GitHub's public REST API (no auth) is used deliberately, not a stopgap:
// this is a static Vite/GitHub Pages site (see vite.config.ts) with no
// server, so there's nowhere to keep a token secret — embedding one in the
// client bundle would just publish it. Unauthenticated requests are capped
// at 60/hour per visitor IP, which is fine for a personal portfolio; the
// cache below keeps normal browsing well under that.
//
// Note: this deliberately does NOT use GitHub's "pinned repositories"
// feature — that only exists via the GraphQL API, which requires an
// authenticated token. Starred repos cover the "favourites" use case
// through the plain public REST API instead, with no token needed.

const CACHE_KEY = 'portfolio:github:v2'
const CACHE_TTL_MS = 1000 * 60 * 15 // 15 minutes

interface RawGithubUser {
  login: string
  html_url: string
  public_repos: number
  followers: number
  created_at: string
}

interface RawGithubRepo {
  id: number
  name: string
  description: string | null
  html_url: string
  homepage: string | null
  created_at: string
  updated_at: string
  pushed_at: string
  language: string | null
  stargazers_count: number
  forks_count: number
  private: boolean
  fork: boolean
  archived: boolean
  topics?: string[]
}

function mapProfile(raw: RawGithubUser): GithubProfile {
  return {
    login: raw.login,
    htmlUrl: raw.html_url,
    publicRepos: raw.public_repos,
    followers: raw.followers,
    createdAt: raw.created_at,
  }
}

function mapRepo(raw: RawGithubRepo): GithubRepo {
  return {
    id: raw.id,
    name: raw.name,
    description: raw.description,
    url: raw.html_url,
    homepageUrl: raw.homepage && raw.homepage.trim() ? raw.homepage.trim() : null,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
    pushedAt: raw.pushed_at,
    language: raw.language,
    stars: raw.stargazers_count,
    forks: raw.forks_count,
    isPrivate: raw.private,
    isFork: raw.fork,
    isArchived: raw.archived,
    topics: raw.topics ?? [],
  }
}

async function fetchLive(): Promise<GithubData> {
  const [profileRes, reposRes, starredRes] = await Promise.all([
    fetch(`https://api.github.com/users/${GITHUB_USERNAME}`),
    fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&type=owner&sort=pushed`),
    fetch(`https://api.github.com/users/${GITHUB_USERNAME}/starred?per_page=100`),
  ])

  if (!profileRes.ok || !reposRes.ok || !starredRes.ok) {
    throw new Error('GitHub API request failed')
  }

  const [profileJson, reposJson, starredJson] = await Promise.all([profileRes.json(), reposRes.json(), starredRes.json()])

  if (!Array.isArray(reposJson) || !Array.isArray(starredJson)) {
    throw new Error('Unexpected GitHub repos response shape')
  }

  return {
    profile: mapProfile(profileJson as RawGithubUser),
    repos: (reposJson as RawGithubRepo[]).map(mapRepo),
    starred: (starredJson as RawGithubRepo[]).map(mapRepo),
  }
}

export interface GithubFetchResult {
  data: GithubData | null
  lastSynced: number | null
  fromCache: boolean
  error: boolean
}

export async function fetchGithubData(): Promise<GithubFetchResult> {
  const cached = readCache<GithubData>(CACHE_KEY)

  if (cached && !isStale(cached.timestamp, CACHE_TTL_MS)) {
    return { data: cached.data, lastSynced: cached.timestamp, fromCache: true, error: false }
  }

  try {
    const data = await fetchLive()
    writeCache(CACHE_KEY, data)
    return { data, lastSynced: Date.now(), fromCache: false, error: false }
  } catch {
    // Live fetch failed (rate limit, offline, GitHub down). Serve stale
    // cached data if we have it rather than breaking the section.
    if (cached) {
      return { data: cached.data, lastSynced: cached.timestamp, fromCache: true, error: false }
    }
    return { data: null, lastSynced: null, fromCache: false, error: true }
  }
}
