import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import ThemeChoice from '../components/home/ThemeChoice'
import Features from '../components/home/Features'
import FinalCta from '../components/home/FinalCta'
import Hero from '../components/home/Hero'
import TryRound from '../components/home/TryRound'
import HowItWorks from '../components/home/HowItWorks'
import Levels from '../components/home/Levels'

/** Página inicial pública: explica o projeto, seção por seção. */
export default function HomePage() {
  const { hash } = useLocation()

  // Links como "/#como-funciona" navegam sem recarregar; rolamos até a âncora manualmente.
  useEffect(() => {
    if (!hash) return
    document.getElementById(hash.slice(1))?.scrollIntoView()
  }, [hash])

  return (
    <>
      <Hero />
      <HowItWorks />
      <TryRound />
      <Features />
      <ThemeChoice />
      <Levels />
      <FinalCta />
    </>
  )
}
