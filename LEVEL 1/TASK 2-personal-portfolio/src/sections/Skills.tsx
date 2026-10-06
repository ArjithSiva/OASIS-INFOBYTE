import { useState } from 'react'
import { SectionHeading } from '../components/ui/SectionHeading'
import MagicBento from '../components/bento/MagicBento'
import { languageCards, type Skill } from '../data/languages'
import { useTheme } from '../hooks/useTheme'
import { accentRgb } from '../lib/color'

interface Selected {
  key: string
  cardLabel: string
  skill: Skill
}

function SkillChipList({
  cardId,
  cardLabel,
  skills,
  selectedKey,
  onSelect,
}: {
  cardId: string
  cardLabel: string
  skills: Skill[]
  selectedKey: string | null
  onSelect: (selected: Selected | null) => void
}) {
  return (
    <ul className="skill-chip-list" role="list">
      {skills.map((skill) => {
        const key = `${cardId}:${skill.name}`
        const isActive = selectedKey === key
        return (
          <li key={skill.name}>
            <button
              type="button"
              className="skill-chip"
              aria-pressed={isActive}
              onClick={(e) => {
                e.stopPropagation()
                onSelect(isActive ? null : { key, cardLabel, skill })
              }}
            >
              {skill.name}
            </button>
          </li>
        )
      })}
    </ul>
  )
}

export function Skills() {
  const { mode } = useTheme()
  const [selected, setSelected] = useState<Selected | null>(null)

  const cards = languageCards.map((card) => ({
    id: card.id,
    label: card.label,
    title: card.title,
    wide: card.wide,
    content: (
      <SkillChipList
        cardId={card.id}
        cardLabel={card.title}
        skills={card.skills}
        selectedKey={selected?.key ?? null}
        onSelect={setSelected}
      />
    ),
  }))

  return (
    <section id="skills" className="relative px-6 py-28 md:py-36">
      <div className="max-w-5xl mx-auto">
        <SectionHeading index="03" eyebrow="Skill Tree" title="Awakened Skills" />
        <p className="mt-6 text-ink-muted max-w-xl">
          The languages I read, write, and think in — from scripting the backend to firmware on a
          microcontroller. Tap a skill for details.
        </p>
        <div className="mt-14">
          <MagicBento cards={cards} glowColor={accentRgb(mode)} enableTilt clickEffect enableMagnetism />
        </div>

        <div className="skill-detail-panel mt-8" aria-live="polite">
          {selected ? (
            <>
              <p className="skill-detail-panel__eyebrow">{selected.cardLabel}</p>
              <h4 className="skill-detail-panel__title">{selected.skill.name}</h4>
              <p className="skill-detail-panel__desc">{selected.skill.description}</p>
            </>
          ) : (
            <p className="skill-detail-panel__placeholder">Select any skill above to see details.</p>
          )}
        </div>
      </div>
    </section>
  )
}
