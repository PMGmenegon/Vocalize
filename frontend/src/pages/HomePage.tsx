import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import AccentChoice from '../components/home/AccentChoice'
import Faq from '../components/home/Faq'
import Features from '../components/home/Features'
import FinalCta from '../components/home/FinalCta'
import Hero from '../components/home/Hero'
import HowItWorks from '../components/home/HowItWorks'
import Levels from '../components/home/Levels'
import SectionDivider from '../components/SectionDivider'

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
      <SectionDivider className="mt-8" />
      <HowItWorks />
      <SectionDivider />
      <Features />
      <SectionDivider />
      <AccentChoice />
      <SectionDivider />
      <Levels />
      <SectionDivider />
      <Faq />
      <FinalCta />
    </>
  )
}
