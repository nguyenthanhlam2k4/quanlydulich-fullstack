import React, { useEffect, useState } from 'react'
import { FaFire, FaMapMarkerAlt, FaClock, FaStar, FaArrowRight } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import API from '../../services/api'

export const HotTours = () => {
  const [tours, setTours] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    API.get("/tours").then(r => setTours(r.data.slice(0, 4))).catch(() => {})
  }, [])

  if (!tours.length) return null
  const [main, ...rest] = tours

  return (
    <section className="max-w-6xl mx-auto px-6 py-14">
      <div className="flex items-center justify-between mb-8" data-aos="fade-up">
        <div>
          <div className="flex items-center gap-2 text-red-500 font-semibold text-sm mb-1">
            <FaFire /> ĐANG HOT
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Tour được đặt nhiều nhất</h2>
        </div>
        <button
          onClick={() => document.getElementById("tour-list")?.scrollIntoView({ behavior: "smooth" })}
          className="flex items-center gap-2 text-blue-500 hover:text-blue-700 text-sm font-medium transition"
        >
          Xem tất cả <FaArrowRight className="text-xs" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Main featured */}
        {main && (
          <div data-aos="fade-right"
            onClick={() => navigate(`/tours/${main._id}`)}
            className="relative rounded-2xl overflow-hidden cursor-pointer group h-72 lg:h-auto"
          >
            <img
              src={main.images?.[0] || `https://picsum.photos/seed/${main._id}/700/500`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
              <span className="bg-red-500 text-xs px-2 py-0.5 rounded-full mb-2 inline-block">#1 Hot</span>
              <h3 className="text-xl font-bold mb-1 line-clamp-1">{main.title}</h3>
              <div className="flex items-center gap-3 text-sm text-gray-300 mb-2">
                <span className="flex items-center gap-1"><FaMapMarkerAlt className="text-blue-400" />{main.location}</span>
                <span className="flex items-center gap-1"><FaClock className="text-blue-400" />{main.duration}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-lg font-black text-blue-300">{main.price?.toLocaleString("vi-VN")}đ</span>
                <span className="flex items-center gap-1 text-yellow-400 text-sm"><FaStar />{main.rating || "Mới"}</span>
              </div>
            </div>
          </div>
        )}

        {/* Side list */}
        <div className="flex flex-col gap-4">
          {rest.map((tour, i) => (
            <div key={tour._id} data-aos="fade-left" data-aos-delay={i * 100}
              onClick={() => navigate(`/tours/${tour._id}`)}
              className="bg-white rounded-2xl shadow hover:shadow-md transition cursor-pointer flex overflow-hidden group"
            >
              <div className="w-28 h-24 shrink-0 overflow-hidden">
                <img
                  src={tour.images?.[0] || `https://picsum.photos/seed/${tour._id}/200/200`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="flex-1 p-3 flex justify-between items-center">
                <div>
                  <span className="text-xs text-red-500 font-semibold">#{i + 2} Hot</span>
                  <h4 className="font-semibold text-gray-800 text-sm line-clamp-1">{tour.title}</h4>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                    <span className="flex items-center gap-0.5"><FaMapMarkerAlt className="text-blue-400" />{tour.location}</span>
                    <span className="flex items-center gap-0.5"><FaClock className="text-blue-400" />{tour.duration}</span>
                  </div>
                </div>
                <div className="text-right shrink-0 ml-2">
                  <p className="text-blue-600 font-bold text-sm">{tour.price?.toLocaleString("vi-VN")}đ</p>
                  <p className="text-xs text-gray-400">/người</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}