import { useEffect, useState } from 'react'
import { FaStar, FaMapMarkerAlt, FaClock, FaHeart, FaUsers, FaFire, FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import API from '../../services/api'

export const TourList = ({ filters = {} }) => {
  const [tours, setTours] = useState([])
  const [loading, setLoading] = useState(true)
  const [favorites, setFavorites] = useState([])
  const [sortBy, setSortBy] = useState("newest")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const navigate = useNavigate()
  const { user } = useAuth()

  const LIMIT = 6

  useEffect(() => {
    setPage(1) // reset về trang 1 khi filter thay đổi
  }, [filters])

  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      try {
        const params = {
          keyword: filters.keyword || "",
          location: filters.location || "",
          priceRange: filters.priceRange || "all",
          page,
          limit: LIMIT,
        }
        const res = await API.get("/tours", { params })
        let data = res.data.tours || []

        // Sort phía client
        if (sortBy === "price-asc") data = [...data].sort((a, b) => a.price - b.price)
        else if (sortBy === "price-desc") data = [...data].sort((a, b) => b.price - a.price)
        else if (sortBy === "rating") data = [...data].sort((a, b) => (b.rating || 0) - (a.rating || 0))

        setTours(data)
        setTotalPages(res.data.totalPages || 1)
        setTotal(res.data.total || 0)
      } catch {
        setTours([])
      } finally { setLoading(false) }
    }
    fetch()
  }, [filters, page, sortBy])

  useEffect(() => {
    if (user) API.get("/favorites").then(r => setFavorites(r.data.map(f => f.tourId?._id))).catch(() => {})
  }, [user])

  const handleFavorite = async (e, tourId) => {
    e.stopPropagation()
    if (!user) { navigate("/login"); return }
    const res = await API.post("/favorites", { tourId })
    if (res.data.isFavorite) setFavorites([...favorites, tourId])
    else setFavorites(favorites.filter(id => id !== tourId))
  }

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
  const showPages = pages.filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)

  if (loading) return (
    <div className="text-center py-16">
      <div className="inline-block w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <section id="tour-list" className="max-w-6xl mx-auto px-6 py-14">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-1">Tất cả Tours</h2>
          <p className="text-gray-500 text-sm">{total} tour phù hợp</p>
        </div>
        <select className="border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
          value={sortBy} onChange={e => { setSortBy(e.target.value); setPage(1) }}>
          <option value="newest">Mới nhất</option>
          <option value="price-asc">Giá thấp → cao</option>
          <option value="price-desc">Giá cao → thấp</option>
          <option value="rating">Đánh giá cao nhất</option>
        </select>
      </div>

      {tours.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg mb-2">Không tìm thấy tour phù hợp</p>
          <p className="text-sm">Thử thay đổi bộ lọc tìm kiếm</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {tours.map((tour, idx) => {
              const isFav = favorites.includes(tour._id)
              const isHot = idx < 3 && page === 1
              return (
                <div key={tour._id} onClick={() => navigate(`/tours/${tour._id}`)}
                  className="bg-white rounded-2xl shadow hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer group hover:-translate-y-1">
                  <div className="relative h-52 overflow-hidden">
                    <img src={tour.images?.[0] || `https://picsum.photos/seed/${tour._id}/400/300`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute top-3 left-3 flex gap-2">
                      {isHot && <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1 font-medium"><FaFire className="text-xs" /> Hot</span>}
                      {tour.availableSlots <= 5 && tour.availableSlots > 0 && <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">Sắp hết</span>}
                      {tour.availableSlots === 0 && <span className="bg-gray-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">Hết chỗ</span>}
                    </div>
                    <button onClick={e => handleFavorite(e, tour._id)}
                      className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center shadow transition-all
                        ${isFav ? "bg-red-500 text-white" : "bg-white text-gray-400 hover:text-red-400"}`}>
                      <FaHeart className="text-sm" />
                    </button>
                    <div className="absolute bottom-3 left-3 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                      {tour.price?.toLocaleString("vi-VN")}đ/người
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="font-bold text-gray-800 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">{tour.title}</h3>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500 mb-3">
                      <span className="flex items-center gap-1">
                        <FaMapMarkerAlt className="text-blue-400" />
                        {tour.locations?.join(" · ") || tour.location}
                      </span>
                      <span className="flex items-center gap-1"><FaClock className="text-blue-400" />{tour.duration}</span>
                      <span className="flex items-center gap-1"><FaUsers className="text-blue-400" />{tour.availableSlots} chỗ</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        {[1,2,3,4,5].map(s => <FaStar key={s} className={`text-xs ${s <= Math.round(tour.rating || 0) ? "text-yellow-400" : "text-gray-200"}`} />)}
                        <span className="text-xs text-gray-400 ml-1">({tour.rating || "Mới"})</span>
                      </div>
                      <button onClick={e => { e.stopPropagation(); navigate(`/tours/${tour._id}`) }}
                        className="bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-600 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all duration-200">
                        Đặt ngay
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Phân trang */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:bg-blue-50 hover:border-blue-300 disabled:opacity-30 disabled:cursor-not-allowed transition">
                <FaChevronLeft className="text-xs" />
              </button>

              {showPages.map((p, i) => {
                const prev = showPages[i - 1]
                return (
                  <span key={p} className="flex items-center gap-2">
                    {prev && p - prev > 1 && <span className="text-gray-400 text-sm">...</span>}
                    <button onClick={() => setPage(p)}
                      className={`w-9 h-9 rounded-xl text-sm font-medium transition
                        ${page === p ? "bg-blue-600 text-white shadow-md" : "border border-gray-200 text-gray-600 hover:bg-blue-50 hover:border-blue-300"}`}>
                      {p}
                    </button>
                  </span>
                )
              })}

              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:bg-blue-50 hover:border-blue-300 disabled:opacity-30 disabled:cursor-not-allowed transition">
                <FaChevronRight className="text-xs" />
              </button>
            </div>
          )}
        </>
      )}
    </section>
  )
}