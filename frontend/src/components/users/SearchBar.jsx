import { useState, useEffect } from 'react'
import { FaSearch, FaMapMarkerAlt, FaChevronDown } from 'react-icons/fa'
import API from '../../services/api'

export const SearchBar = ({ onSearch }) => {
  const [keyword, setKeyword] = useState("")
  const [location, setLocation] = useState("")
  const [priceRange, setPriceRange] = useState("all")
  const [locations, setLocations] = useState([])

  useEffect(() => {
    API.get("/tours/locations").then(r => setLocations(r.data)).catch(() => {})
  }, [])

  const handleSearch = () => onSearch({ keyword, location, priceRange })

  return (
    <div className="bg-white rounded-2xl shadow-lg p-5 mx-auto max-w-4xl -mt-8 relative z-10">
      <div className="flex flex-col md:flex-row gap-3">
        {/* Tìm tên */}
        <div className="flex items-center border rounded-xl px-4 py-2 flex-1 gap-2">
          <FaSearch className="text-gray-400 shrink-0" />
          <input type="text" placeholder="Tên tour..." className="outline-none text-sm w-full"
            value={keyword} onChange={e => setKeyword(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSearch()} />
        </div>

        {/* Lọc tỉnh thành */}
        <div className="relative flex items-center border rounded-xl px-4 py-2 flex-1 gap-2">
          <FaMapMarkerAlt className="text-gray-400 shrink-0" />
          <select className="outline-none text-sm w-full bg-transparent appearance-none cursor-pointer"
            value={location} onChange={e => { setLocation(e.target.value); onSearch({ keyword, location: e.target.value, priceRange }) }}>
            <option value="">Tất cả tỉnh thành</option>
            {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
          </select>
          <FaChevronDown className="text-gray-400 text-xs shrink-0" />
        </div>

        {/* Khoảng giá */}
        <div className="relative flex items-center border rounded-xl px-4 py-2 gap-2">
          <select className="outline-none text-sm bg-transparent appearance-none cursor-pointer pr-4"
            value={priceRange} onChange={e => setPriceRange(e.target.value)}>
            <option value="all">Tất cả mức giá</option>
            <option value="under2m">Dưới 2 triệu</option>
            <option value="2m-5m">2 - 5 triệu</option>
            <option value="over5m">Trên 5 triệu</option>
          </select>
          <FaChevronDown className="text-gray-400 text-xs shrink-0" />
        </div>

        <button onClick={handleSearch}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-xl text-sm font-medium transition">
          Tìm kiếm
        </button>
      </div>
    </div>
  )
}