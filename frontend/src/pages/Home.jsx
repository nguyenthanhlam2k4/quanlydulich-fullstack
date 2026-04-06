import React, { useState, useEffect } from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css'

import { Header } from '../components/users/Header'
import { Banner } from '../components/users/Banner'
import { SearchBar } from '../components/users/SearchBar'
import { HotTours } from '../components/users/HotTours'
import { Destinations } from '../components/users/Destinations'
import { WhyUs } from '../components/users/WhyUs'
import { TourList } from '../components/users/TourList'
import { CTABanner } from '../components/users/CTABanner'
import { Reviews } from '../components/users/Reviews'
import { Footer } from '../components/users/Footer'

const Home = () => {
  const [filters, setFilters] = useState({})

  useEffect(() => {
    AOS.init({ duration: 700, once: true, easing: "ease-out-cubic", offset: 60 })
  }, [])

  return (
    <div>
      <Header transparent />
      <Banner />
      <div className="max-w-6xl mx-auto px-6">
        <SearchBar onSearch={setFilters} />
      </div>
      <HotTours />
      <Destinations />
      <WhyUs />
      <TourList filters={filters} />
      <CTABanner />
      <Reviews />
      <Footer />
    </div>
  )
}

export default Home