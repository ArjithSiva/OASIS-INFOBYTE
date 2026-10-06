import { ThemeProvider } from './hooks/useTheme'
import { AudioProvider } from './hooks/useAmbientAudio'
import { Background } from './components/background/Background'
import { ThemeTransition } from './components/background/ThemeTransition'
import { CustomCursor } from './components/cursor/CustomCursor'
import { Sidebar } from './components/navigation/Sidebar'
import { MobileNav } from './components/navigation/MobileNav'
import { Hero } from './sections/Hero'
import { Profile } from './sections/Profile'
import { Skills } from './sections/Skills'
import { Gear } from './sections/Gear'
import { Projects } from './sections/Projects'
import { Progress } from './sections/Progress'
import { ShadowArmy } from './sections/ShadowArmy'
import { HunterNetwork } from './sections/HunterNetwork'
import { Resume } from './sections/Resume'
import { Contact } from './sections/Contact'

// The ambient-audio widget used to float bottom-right (AudioPlayer.tsx,
// now unused); the mute button + WakeSlider live in Sidebar/MobileNav
// instead, both sharing state through AudioProvider below.
function Portfolio() {
  return (
    <>
      <Background />
      <ThemeTransition />
      <CustomCursor />
      <Sidebar />
      <MobileNav />

      <main className="lg:pl-64 pt-16 lg:pt-0">
        <Hero />
        <Profile />
        <Skills />
        <Gear />
        <Projects />
        <Progress />
        <ShadowArmy />
        <Resume />
        <HunterNetwork />
        <Contact />
      </main>
    </>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AudioProvider>
        <Portfolio />
      </AudioProvider>
    </ThemeProvider>
  )
}
