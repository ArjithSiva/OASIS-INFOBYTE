import { RepoCard } from './RepoCard'
import type { GithubRepo } from '../../types/github'

interface RepoGridProps {
  title: string
  repos: GithubRepo[]
  emptyMessage: string
}

export function RepoGrid({ title, repos, emptyMessage }: RepoGridProps) {
  return (
    <div>
      <h3 className="font-mono text-xs tracking-[0.22em] uppercase text-accent-3 pb-3 border-b border-line-strong">
        {title}
      </h3>

      {repos.length === 0 ? (
        <p className="mt-5 text-ink-faint text-sm">{emptyMessage}</p>
      ) : (
        <div className="mt-5 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {repos.map((repo, i) => (
            <RepoCard key={repo.id} repo={repo} number={i + 1} delay={i * 0.06} />
          ))}
        </div>
      )}
    </div>
  )
}
