import React, { useEffect, useState } from 'react'
import { FaStar, FaMapMarkerAlt, FaClock, FaHeart } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import API from '../../services/api'

const priceFilter = (tour, range) => {
  if (range === "all") return true
  if (range === "under2m") return tour.price < 2000000
  if (range === "2m-5m") return tour.price >= 2000000 && tour.price <= 5000000
  if (range === "over5m") return tour.price > 5000000
  return true
}

export const TourList = ({ filters = {} }) => {
  const [tours, setTours] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await API.get("/tours")
        setTours(res.data)
      } catch {
        setTours([])
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  const filtered = tours.filter((t) => {
    const matchKeyword = filters.keyword
      ? t.title.toLowerCase().includes(filters.keyword.toLowerCase())
      : true
    const matchLocation = filters.location
      ? t.location.toLowerCase().includes(filters.location.toLowerCase())
      : true
    const matchPrice = priceFilter(t, filters.priceRange || "all")
    return matchKeyword && matchLocation && matchPrice
  })

  if (loading) return (
    <div className="text-center py-16 text-gray-400">Đang tải tour...</div>
  )

  return (
    <section id="tour-list" className="max-w-6xl mx-auto px-6 py-12">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Tour nổi bật</h2>
      <p className="text-gray-500 mb-8">Những hành trình được yêu thích nhất</p>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">Không tìm thấy tour phù hợp</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((tour) => (
            <div
              key={tour._id}
              onClick={() => navigate(`/tours/${tour._id}`)}
              className="bg-white rounded-2xl shadow hover:shadow-lg transition-all duration-200 overflow-hidden cursor-pointer group"
            >
              {/* Ảnh */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={tour.images?.[0] || `https://picsum.photos/seed/${tour._id}/400/250`}
                  alt={tour.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3 bg-white/90 rounded-full p-1.5 text-red-400 hover:text-red-500">
                  <FaHeart className="text-sm" />
                </div>
                {tour.availableSlots <= 5 && (
                  <span className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    Sắp hết chỗ
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-1 line-clamp-1">{tour.title}</h3>

                <div className="flex items-center gap-1 text-gray-500 text-sm mb-2">
                  <FaMapMarkerAlt className="text-blue-400 shrink-0" />
                  <span>{tour.location}</span>
                </div>

                <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                  <div className="flex items-center gap-1">
                    <FaClock className="text-blue-400" />
                    <span>{tour.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FaStar className="text-yellow-400" />
                    <span>{tour.rating || "Mới"}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-blue-600 font-bold text-lg">
                      {tour.price.toLocaleString("vi-VN")}đ
                    </span>
                    <span className="text-gray-400 text-xs"> /người</span>
                  </div>
                  <button className="bg-blue-50 hover:bg-blue-500 hover:text-white text-blue-500 text-xs font-medium px-3 py-1.5 rounded-lg transition">
                    Đặt ngay
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}