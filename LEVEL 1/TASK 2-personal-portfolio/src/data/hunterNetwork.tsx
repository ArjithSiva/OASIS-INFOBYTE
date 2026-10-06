import { Mail, Languages, Code2, Trophy, Award } from 'lucide-react'
import { GithubIcon, LinkedinIcon, YoutubeIcon, SpotifyIcon } from '../components/ui/BrandIcons'

export interface NetworkContact {
  platform: string
  hunterName: string
  href: string
  icon: React.ComponentType<{ size?: number; className?: string }>
}

export const hunterNetwork: NetworkContact[] = [
  { platform: 'GitHub', hunterName: 'Shadow Archive', href: 'https://github.com/ArjithSiva', icon: GithubIcon },
  { platform: 'LinkedIn', hunterName: 'Hunter Registry', href: 'https://www.linkedin.com/in/arjithsiva/', icon: LinkedinIcon },
  { platform: 'LeetCode', hunterName: "Monarch's Labyrinth", href: 'https://leetcode.com/u/ArjithSiva/', icon: Code2 },
  { platform: 'YouTube', hunterName: 'Hunter Broadcast', href: 'https://www.youtube.com/@ArjithSiva', icon: YoutubeIcon },
  {
    platform: 'Spotify',
    hunterName: "Monarch's Frequency",
    href: 'https://open.spotify.com/user/31qwce3yq4xbfucvts4cuqyozrni',
    icon: SpotifyIcon,
  },
  { platform: 'Duolingo', hunterName: 'Rune Decryption', href: 'https://www.duolingo.com/profile/A.ArjithSiva', icon: Languages },
  {
    platform: 'SkillRack',
    hunterName: 'Gate Assessment',
    href: 'https://www.skillrack.com/faces/resume.xhtml?id=495479&key=56fc4e6023d7aa095e12164d3a52ea7ff1646527',
    icon: Award,
  },
  { platform: 'HackerRank', hunterName: 'Hunter Rank Exam', href: 'https://www.hackerrank.com/profile/aarjith2006', icon: Trophy },
  { platform: 'Email', hunterName: 'System Ping', href: 'mailto:aarjith2006@gmail.com', icon: Mail },
]

// Trimmed set used by the desktop sidebar's icon row and the mobile menu's
// "Socials" list — SkillRack, Duolingo and HackerRank stay off both, but
// still show in the full Hunter Network section itself.
const SIDEBAR_HIDDEN_PLATFORMS = new Set(['SkillRack', 'Duolingo', 'HackerRank'])
export const hunterNetworkQuickLinks: NetworkContact[] = hunterNetwork.filter(
  (contact) => !SIDEBAR_HIDDEN_PLATFORMS.has(contact.platform),
)
