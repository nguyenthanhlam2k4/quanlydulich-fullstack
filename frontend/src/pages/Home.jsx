import React, { useState } from 'react'
import { Header } from '../components/users/Header'
import { Banner } from '../components/users/Banner'
import { Stats } from '../components/users/Stats'
import { SearchBar } from '../components/users/SearchBar'
import { TourList } from '../components/users/TourList'
import { Reviews } from '../components/users/Reviews'

const Home = () => {
  const [filters, setFilters] = useState({})

  return (
    <div>
      <Header transparent />
      <Banner />
      <div className="max-w-6xl mx-auto px-6">
        <SearchBar onSearch={setFilters} />
      </div>
      <TourList filters={filters} />
      <Reviews />
    </div>
  )
}

export default Home