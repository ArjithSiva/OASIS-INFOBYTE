// Shapes returned by the GitHub data layer (src/lib/githubProvider.ts).
// UI components only ever see these — never the raw GitHub REST payload.

export interface GithubRepo {
  id: number
  name: string
  description: string | null
  url: string
  homepageUrl: string | null
  createdAt: string
  updatedAt: string
  pushedAt: string
  language: string | null
  stars: number
  forks: number
  isPrivate: boolean
  isFork: boolean
  isArchived: boolean
  topics: string[]
}

export interface GithubProfile {
  login: string
  htmlUrl: string
  publicRepos: number
  followers: number
  createdAt: string
}

export interface GithubData {
  profile: GithubProfile
  /** Every public repo under the account — used by Shadow Army. */
  repos: GithubRepo[]
  /** Repos this account has starred (via the GitHub API) — used by Progress Log. */
  starred: GithubRepo[]
}

export type DataStatus = 'loading' | 'ready' | 'error'
