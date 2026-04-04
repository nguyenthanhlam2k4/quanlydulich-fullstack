import React, { useEffect, useState } from 'react'
import { Header } from '../components/users/Header'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import API from '../services/api'
import { FaHeart, FaMapMarkerAlt, FaClock, FaStar } from 'react-icons/fa'
import Swal from 'sweetalert2'

export default function FavoritesPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { navigate("/login"); return }
    API.get("/favorites")
      .then(res => setFavorites(res.data))
      .catch(() => setFavorites([]))
      .finally(() => setLoading(false))
  }, [user])

  const handleRemove = async (tourId) => {
    try {
      await API.post("/favorites", { tourId })
      setFavorites(favorites.filter(f => f.tourId?._id !== tourId))
      Swal.fire({ icon: "success", title: "Đã bỏ yêu thích", timer: 1200, showConfirmButton: false })
    } catch {}
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-5xl mx-auto px-6 pt-10 pb-16">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Tour yêu thích</h1>
        <p className="text-gray-500 text-sm mb-8">{favorites.length} tour đã lưu</p>

        {loading ? (
          <div className="text-center py-20 text-gray-400">Đang tải...</div>
        ) : favorites.length === 0 ? (
          <div className="text-center py-20">
            <FaHeart className="text-5xl mx-auto mb-4 text-gray-200" />
            <p className="text-gray-400 mb-4">Chưa có tour yêu thích nào</p>
            <button onClick={() => navigate("/")} className="bg-blue-500 text-white px-6 py-2 rounded-full text-sm hover:bg-blue-600 transition">
              Khám phá tour
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((fav) => {
              const tour = fav.tourId;
              if (!tour) return null;
              return (
                <div key={fav._id} className="bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden group">
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={tour.images?.[0] || `https://picsum.photos/seed/${tour._id}/400/250`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                      onClick={() => navigate(`/tours/${tour._id}`)}
                    />
                    <button
                      onClick={() => handleRemove(tour._id)}
                      className="absolute top-3 right-3 bg-white rounded-full p-1.5 text-red-500 hover:bg-red-50 transition shadow"
                    >
                      <FaHeart />
                    </button>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-2 line-clamp-1 cursor-pointer hover:text-blue-500"
                      onClick={() => navigate(`/tours/${tour._id}`)}>
                      {tour.title}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                      <span className="flex items-center gap-1"><FaMapMarkerAlt className="text-blue-400" />{tour.location}</span>
                      <span className="flex items-center gap-1"><FaClock className="text-blue-400" />{tour.duration}</span>
                      <span className="flex items-center gap-1"><FaStar className="text-yellow-400" />{tour.rating || "Mới"}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-blue-600 font-bold">{tour.price?.toLocaleString("vi-VN")}đ</span>
                      <button onClick={() => navigate(`/tours/${tour._id}`)}
                        className="text-xs bg-blue-50 hover:bg-blue-500 hover:text-white text-blue-500 px-3 py-1.5 rounded-lg transition">
                        Đặt ngay
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}