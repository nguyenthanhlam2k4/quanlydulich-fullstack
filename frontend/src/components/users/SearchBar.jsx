import React, { useState } from 'react'
import { FaSearch, FaMapMarkerAlt } from 'react-icons/fa'

export const SearchBar = ({ onSearch }) => {
  const [keyword, setKeyword] = useState("")
  const [location, setLocation] = useState("")
  const [priceRange, setPriceRange] = useState("all")

  const handleSearch = () => {
    onSearch({ keyword, location, priceRange })
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-5 mx-auto max-w-4xl -mt-8 relative z-10">
      <div className="flex flex-col md:flex-row gap-3">
        {/* Tìm kiếm tên */}
        <div className="flex items-center border rounded-xl px-4 py-2 flex-1 gap-2">
          <FaSearch className="text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="Tên tour..."
            className="outline-none text-sm w-full"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>

        {/* Địa điểm */}
        <div className="flex items-center border rounded-xl px-4 py-2 flex-1 gap-2">
          <FaMapMarkerAlt className="text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="Địa điểm..."
            className="outline-none text-sm w-full"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>

        {/* Khoảng giá */}
        <select
          className="border rounded-xl px-4 py-2 text-sm outline-none text-gray-600"
          value={priceRange}
          onChange={(e) => setPriceRange(e.target.value)}
        >
          <option value="all">Tất cả mức giá</option>
          <option value="under2m">Dưới 2 triệu</option>
          <option value="2m-5m">2 - 5 triệu</option>
          <option value="over5m">Trên 5 triệu</option>
        </select>

        <button
          onClick={handleSearch}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-xl text-sm font-medium transition"
        >
          Tìm kiếm
        </button>
      </div>
    </div>
  )
}