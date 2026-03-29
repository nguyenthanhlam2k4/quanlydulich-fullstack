import React, { useEffect, useState } from 'react'
import { FaMapMarkedAlt, FaUsers, FaStar, FaRoute } from 'react-icons/fa'
import API from '../../services/api'

const statItems = [
  { icon: <FaRoute className="text-3xl text-blue-500" />, label: "Tour hấp dẫn", key: "tours" },
  { icon: <FaUsers className="text-3xl text-green-500" />, label: "Khách hàng", key: "users" },
  { icon: <FaStar className="text-3xl text-yellow-400" />, label: "Đánh giá 5 sao", key: "reviews" },
  { icon: <FaMapMarkedAlt className="text-3xl text-red-400" />, label: "Điểm đến", key: "locations" },
]

export const Stats = () => {
  const [stats, setStats] = useState({ tours: 0, users: 0, reviews: 0, locations: 0 })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [toursRes, usersRes, reviewsRes] = await Promise.all([
          API.get("/tours"),
          API.get("/users"),
          API.get("/reviews/all"),
        ])
        const tours = toursRes.data
        const locations = [...new Set(tours.map(t => t.location))].length
        setStats({
          tours: tours.length,
          users: usersRes.data.length,
          reviews: reviewsRes.data.filter(r => r.rating === 5).length,
          locations,
        })
      } catch {
        setStats({ tours: 12, users: 340, reviews: 128, locations: 8 })
      }
    }
    fetchStats()
  }, [])

  return (
    <div className="bg-blue-600 py-12 px-6">
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
        {statItems.map((item) => (
          <div key={item.key} className="flex flex-col items-center text-white text-center">
            <div className="bg-white/20 rounded-full p-4 mb-3">{item.icon}</div>
            <span className="text-3xl font-bold">{stats[item.key].toLocaleString()}+</span>
            <span className="text-blue-100 text-sm mt-1">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}