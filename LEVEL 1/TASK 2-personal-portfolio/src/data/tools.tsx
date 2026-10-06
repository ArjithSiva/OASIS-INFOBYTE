import {
  SiReact,
  SiTypescript,
  SiJavascript,
  SiPython,
  SiOpenjdk,
  SiHtml5,
  SiCss,
  SiNodedotjs,
  SiExpress,
  SiFlask,
  SiTailwindcss,
  SiBootstrap,
  SiMysql,
  SiSqlalchemy,
  SiMongodb,
  SiFirebase,
  SiDocker,
  SiGit,
  SiGithub,
  SiLinux,
  SiGnubash,
  SiArduino,
  SiEspressif,
  SiVite,
  SiC,
  SiClaude,
  SiRender,
  SiPostgresql,
  SiOllama,
  SiGooglegemini,
  SiPerplexity,
  SiFedora,
  SiVercel,
} from 'react-icons/si'
import type { LogoItem } from '../components/logos/LogoLoop'

const ICON_BASE = `${import.meta.env.BASE_URL}icons/`

// Duplication with the Skill Tree (languages) is intentional — Arjith uses
// the same language both as a language and as part of a framework/tool
// stack, and there's no reason to hide that here.
//
// A few of these (VS Code, Bolt.new, Antigravity, ChatGPT, Microsoft,
// Google) have no entry in Simple Icons/react-icons — Simple Icons
// deliberately excludes Microsoft's and Google's own marks, and the rest
// are too new or too niche to be in the set. Those use real official/
// brand-kit SVGs (sourced from gilbarbara/logos, CC0) saved locally under
// public/icons/ instead. React Bits' own site icon (its favicon) is used
// the same way. Every image-based logo renders as a currentColor mask
// (LogoLoop's `src` items), not its original brand colors — same flat tint
// as every icon-font logo here, just with the real shape.
export const gearLogos: LogoItem[] = [
  { node: <SiReact />, title: 'React', href: 'https://react.dev' },
  { node: <SiTypescript />, title: 'TypeScript', href: 'https://www.typescriptlang.org' },
  { node: <SiJavascript />, title: 'JavaScript', href: 'https://developer.mozilla.org/docs/Web/JavaScript' },
  { node: <SiPython />, title: 'Python', href: 'https://www.python.org' },
  { node: <SiOpenjdk />, title: 'Java', href: 'https://openjdk.org' },
  { node: <SiHtml5 />, title: 'HTML5', href: 'https://developer.mozilla.org/docs/Web/HTML' },
  { node: <SiCss />, title: 'CSS3', href: 'https://developer.mozilla.org/docs/Web/CSS' },
  { node: <SiNodedotjs />, title: 'Node.js', href: 'https://nodejs.org' },
  { node: <SiExpress />, title: 'Express', href: 'https://expressjs.com' },
  { node: <SiFlask />, title: 'Flask', href: 'https://flask.palletsprojects.com' },
  { node: <SiTailwindcss />, title: 'Tailwind CSS', href: 'https://tailwindcss.com' },
  { node: <SiBootstrap />, title: 'Bootstrap', href: 'https://getbootstrap.com' },
  { node: <SiMysql />, title: 'MySQL', href: 'https://www.mysql.com' },
  { node: <SiSqlalchemy />, title: 'SQLAlchemy', href: 'https://www.sqlalchemy.org' },
  { node: <SiMongodb />, title: 'MongoDB', href: 'https://www.mongodb.com' },
  { node: <SiFirebase />, title: 'Firebase', href: 'https://firebase.google.com' },
  { node: <SiDocker />, title: 'Docker', href: 'https://www.docker.com' },
  { node: <SiGit />, title: 'Git', href: 'https://git-scm.com' },
  { node: <SiGithub />, title: 'GitHub', href: 'https://github.com' },
  { node: <SiLinux />, title: 'Linux', href: 'https://www.kernel.org' },
  { node: <SiGnubash />, title: 'Bash', href: 'https://www.gnu.org/software/bash/' },
  { node: <SiArduino />, title: 'Arduino', href: 'https://www.arduino.cc' },
  { node: <SiEspressif />, title: 'ESP32 / Espressif', href: 'https://www.espressif.com' },
  { node: <SiC />, title: 'Embedded C', href: 'https://en.cppreference.com/w/c' },
  { node: <SiVite />, title: 'Vite', href: 'https://vite.dev' },
  { node: <SiClaude />, title: 'Claude', href: 'https://claude.com' },
  { node: <SiRender />, title: 'Render', href: 'https://render.com' },

  // VS Code — no Simple Icons entry (Microsoft mark)
  { src: `${ICON_BASE}vscode.svg`, alt: 'VS Code', title: 'VS Code', href: 'https://code.visualstudio.com' },
  // Bolt.new is built by StackBlitz — using StackBlitz's own bolt mark
  { src: `${ICON_BASE}stackblitz.svg`, alt: 'Bolt.new', title: 'Bolt.new', href: 'https://bolt.new' },
  // React Bits' own site icon (their favicon), not their full wordmark
  { src: `${ICON_BASE}reactbits.png`, alt: 'React Bits', title: 'React Bits', href: 'https://reactbits.dev' },
  // The real Google "G" mark (not the thin outline glyph react-icons has)
  { src: `${ICON_BASE}google.svg`, alt: 'Google', title: 'Google', href: 'https://www.google.com' },

  // New additions
  { src: `${ICON_BASE}antigravity.svg`, alt: 'Antigravity', title: 'Antigravity', href: 'https://antigravity.google' },
  { node: <SiPostgresql />, title: 'PostgreSQL', href: 'https://www.postgresql.org' },
  { node: <SiOllama />, title: 'Ollama', href: 'https://ollama.com' },
  { node: <SiGooglegemini />, title: 'Gemini', href: 'https://gemini.google.com' },
  { src: `${ICON_BASE}openai.svg`, alt: 'ChatGPT', title: 'ChatGPT', href: 'https://chatgpt.com' },
  { node: <SiPerplexity />, title: 'Perplexity', href: 'https://www.perplexity.ai' },
  // One Microsoft entry (covers Windows + Office) pointing at microsoft.com
  { src: `${ICON_BASE}microsoft.svg`, alt: 'Microsoft', title: 'Microsoft', href: 'https://www.microsoft.com' },
  { node: <SiFedora />, title: 'Fedora', href: 'https://fedoraproject.org' },
  { node: <SiVercel />, title: 'Vercel', href: 'https://vercel.com' },
]
