import { Header } from '../components/users/Header'
import { AboutHero } from '../components/users/AboutHero'
import { AboutMission } from '../components/users/AboutMission'
import { AboutValues } from '../components/users/AboutValues'
import { AboutTeam } from '../components/users/AboutTeam'
import { AboutCTA } from '../components/users/AboutCTA'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <AboutHero />
      <AboutMission />
      <AboutValues />
      <AboutTeam />
      <AboutCTA />
    </div>
  )
}