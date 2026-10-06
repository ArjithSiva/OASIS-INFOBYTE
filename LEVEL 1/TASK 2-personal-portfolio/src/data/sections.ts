export interface SectionDef {
  id: string
  label: string
}

// Numbers shown in the nav (both the desktop LineSidebar and the mobile
// drawer) are positional — index + 1 — not stored here, so Guild lines up
// as "07" automatically without a hardcoded number of its own.
export const sections: SectionDef[] = [
  { id: 'awakening', label: 'Awakening' },
  { id: 'profile', label: 'Profile' },
  { id: 'skills', label: 'Skills' },
  { id: 'gear', label: 'Skill Runes' },
  { id: 'quests', label: 'Quests' },
  { id: 'progress', label: 'Progress' },
  { id: 'shadow-army', label: 'Projects' },
  { id: 'record', label: 'Record' },
  { id: 'hunter-network', label: 'Network' },
]

export const guildSection: SectionDef = { id: 'guild', label: 'Guild' }
