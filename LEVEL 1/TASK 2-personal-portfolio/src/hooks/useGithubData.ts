import { useEffect, useState } from 'react'
import { fetchGithubData } from '../lib/githubProvider'
import type { DataStatus, GithubProfile, GithubRepo } from '../types/github'

interface GithubDataState {
  status: DataStatus
  profile: GithubProfile | null
  /** Every public repo under the account — feeds Shadow Army. */
  repos: GithubRepo[]
  /** Repos starred via the GitHub account — feeds Progress Log. */
  starred: GithubRepo[]
  lastSynced: number | null
  fromCache: boolean
}

export function useGithubData(): GithubDataState {
  const [state, setState] = useState<GithubDataState>({
    status: 'loading',
    profile: null,
    repos: [],
    starred: [],
    lastSynced: null,
    fromCache: false,
  })

  useEffect(() => {
    let cancelled = false

    fetchGithubData().then((result) => {
      if (cancelled) return

      if (result.error || !result.data) {
        setState((prev) => ({ ...prev, status: 'error' }))
        return
      }

      setState({
        status: 'ready',
        profile: result.data.profile,
        repos: result.data.repos,
        starred: result.data.starred,
        lastSynced: result.lastSynced,
        fromCache: result.fromCache,
      })
    })

    return () => {
      cancelled = true
    }
  }, [])

  return state
}
