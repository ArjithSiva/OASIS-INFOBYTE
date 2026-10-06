import { SectionHeading } from '../components/ui/SectionHeading'
import RepoDriftWall from '../components/army/RepoDriftWall'
import { useGithubData } from '../hooks/useGithubData'

export function ShadowArmy() {
  const github = useGithubData()

  return (
    <section id="shadow-army" className="relative py-28 md:py-36">
      <div className="max-w-5xl mx-auto px-6">
        <SectionHeading index="07" eyebrow="Shadow Army" title="Summoned Projects" />
        <p className="mt-6 text-ink-muted max-w-xl">
          Every public repository under my account, drifting in formation — click any tile to open it on GitHub.
        </p>
      </div>

      <div className="mt-14 px-6">
        {github.status === 'error' ? (
          <p className="text-ink-muted text-sm py-8 text-center">
            GitHub repositories couldn't be loaded right now.
          </p>
        ) : github.status === 'loading' ? (
          <p className="text-ink-muted text-sm py-8 text-center">Summoning…</p>
        ) : (
          <div style={{ height: 620 }} className="max-w-6xl mx-auto">
            <RepoDriftWall repos={github.repos} />
          </div>
        )}
      </div>
    </section>
  )
}
