import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FaMapMarkerAlt, FaClock, FaStar, FaUsers, FaHeart, FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { useAuth } from '../contexts/AuthContext'
import API from '../services/api'
import Swal from 'sweetalert2'
import { Header } from '../components/users/Header'

export default function TourDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, token } = useAuth()

  const [tour, setTour] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentImg, setCurrentImg] = useState(0)
  const [numberOfPeople, setNumberOfPeople] = useState(1)
  const [isFavorite, setIsFavorite] = useState(false)

  // Review form
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tourRes, reviewRes] = await Promise.all([
          API.get(`/tours/${id}`),
          API.get(`/reviews/tour/${id}`),
        ])
        setTour(tourRes.data)
        setReviews(reviewRes.data)
      } catch {
        Swal.fire({ icon: "error", title: "Không tìm thấy tour" })
        navigate("/")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  // ── Booking ────────────────────────────────────────
  const handleBooking = async () => {
    if (!user) {
      Swal.fire({
        icon: "warning", title: "Chưa đăng nhập",
        text: "Vui lòng đăng nhập để đặt tour",
        confirmButtonText: "Đăng nhập",
      }).then((r) => { if (r.isConfirmed) navigate("/login") })
      return
    }

    const result = await Swal.fire({
      title: "Xác nhận đặt tour",
      html: `<b>${tour.title}</b><br/>Số người: <b>${numberOfPeople}</b><br/>Tổng tiền: <b>${(tour.price * numberOfPeople).toLocaleString("vi-VN")}đ</b>`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Đặt ngay",
      cancelButtonText: "Hủy",
    })
    if (!result.isConfirmed) return

    try {
      await API.post("/bookings", { tourId: id, numberOfPeople })
      Swal.fire({ icon: "success", title: "Đặt tour thành công!", text: "Chúng tôi sẽ liên hệ xác nhận sớm nhất." })
      // Reload tour để cập nhật slot
      const res = await API.get(`/tours/${id}`)
      setTour(res.data)
    } catch (err) {
      Swal.fire({ icon: "error", title: "Lỗi", text: err.response?.data?.message || "Lỗi server" })
    }
  }

  // ── Favorite ───────────────────────────────────────
  const handleFavorite = async () => {
    if (!user) { navigate("/login"); return }
    try {
      const res = await API.post("/favorites", { tourId: id })
      setIsFavorite(res.data.isFavorite)
    } catch {}
  }

  // ── Review ─────────────────────────────────────────
  const handleReview = async (e) => {
    e.preventDefault()
    if (!user) { navigate("/login"); return }
    setSubmitting(true)
    try {
      const res = await API.post("/reviews", { tourId: id, rating, comment })
      setReviews([res.data, ...reviews])
      setComment("")
      setRating(5)
      Swal.fire({ icon: "success", title: "Đánh giá thành công!", timer: 1500, showConfirmButton: false })
    } catch (err) {
      Swal.fire({ icon: "error", title: "Lỗi", text: err.response?.data?.message || "Lỗi server" })
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteReview = async (reviewId) => {
    const result = await Swal.fire({
      title: "Xóa đánh giá?", icon: "warning",
      showCancelButton: true, confirmButtonColor: "#ef4444",
      confirmButtonText: "Xóa", cancelButtonText: "Hủy",
    })
    if (!result.isConfirmed) return
    try {
      await API.delete(`/reviews/${reviewId}`)
      setReviews(reviews.filter(r => r._id !== reviewId))
    } catch {}
  }

  if (loading) return <div className="flex items-center justify-center h-screen text-gray-400">Đang tải...</div>
  if (!tour) return null

  const images = tour.images?.length > 0 ? tour.images : [`https://picsum.photos/seed/${id}/800/500`]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Back button */}
      <div className="max-w-6xl mx-auto px-6 pt-5">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-blue-500 transition text-sm mb-4">
          <FaChevronLeft /> Quay lại
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-16 grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* ── LEFT: Ảnh + Info + Lịch trình + Reviews ── */}
        <div className="lg:col-span-2 space-y-6">

          {/* Ảnh slider */}
          <div className="relative rounded-2xl overflow-hidden h-80 bg-gray-200">
            <img src={images[currentImg]} alt={tour.title} className="w-full h-full object-cover" />
            {images.length > 1 && (
              <>
                <button onClick={() => setCurrentImg((currentImg - 1 + images.length) % images.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 transition">
                  <FaChevronLeft />
                </button>
                <button onClick={() => setCurrentImg((currentImg + 1) % images.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 transition">
                  <FaChevronRight />
                </button>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {images.map((_, i) => (
                    <button key={i} onClick={() => setCurrentImg(i)}
                      className={`w-2 h-2 rounded-full transition ${i === currentImg ? "bg-white" : "bg-white/50"}`} />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Thông tin cơ bản */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-800">{tour.title}</h1>
              <button onClick={handleFavorite} className={`text-2xl transition ${isFavorite ? "text-red-500" : "text-gray-300 hover:text-red-400"}`}>
                <FaHeart />
              </button>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
              <div className="flex items-center gap-1.5">
                <FaMapMarkerAlt className="text-blue-400" />
                <span>{tour.location}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <FaClock className="text-blue-400" />
                <span>{tour.duration}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <FaUsers className="text-blue-400" />
                <span>Còn {tour.availableSlots} chỗ</span>
              </div>
              <div className="flex items-center gap-1.5">
                <FaStar className="text-yellow-400" />
                <span>{tour.rating || "Chưa có đánh giá"}</span>
              </div>
            </div>

            <p className="text-gray-600 leading-relaxed">{tour.description}</p>
          </div>

          {/* Lịch trình */}
          {tour.schedule?.length > 0 && (
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Lịch trình chi tiết</h2>
              <div className="space-y-4">
                {tour.schedule.map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold shrink-0">
                        {item.day}
                      </div>
                      {i < tour.schedule.length - 1 && <div className="w-0.5 flex-1 bg-blue-100 mt-1" />}
                    </div>
                    <div className="pb-4">
                      <p className="font-medium text-gray-700 mb-1">Ngày {item.day}</p>
                      <p className="text-gray-500 text-sm">{item.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reviews */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Đánh giá ({reviews.length})</h2>

            {/* Form thêm review */}
            {user && (
              <form onSubmit={handleReview} className="mb-6 p-4 bg-gray-50 rounded-xl">
                <p className="text-sm font-medium text-gray-700 mb-2">Đánh giá của bạn</p>

                {/* Stars */}
                <div className="flex gap-1 mb-3">
                  {[1,2,3,4,5].map((s) => (
                    <button key={s} type="button" onClick={() => setRating(s)}>
                      <FaStar className={s <= rating ? "text-yellow-400 text-xl" : "text-gray-300 text-xl"} />
                    </button>
                  ))}
                </div>

                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Chia sẻ trải nghiệm của bạn..."
                  className="w-full border rounded-xl px-3 py-2 text-sm outline-none resize-none h-20 focus:ring-2 focus:ring-blue-300"
                />
                <button type="submit" disabled={submitting}
                  className="mt-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white text-sm px-5 py-2 rounded-lg transition">
                  {submitting ? "Đang gửi..." : "Gửi đánh giá"}
                </button>
              </form>
            )}

            {/* Danh sách reviews */}
            {reviews.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-4">Chưa có đánh giá nào</p>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review._id} className="flex gap-3 border-b pb-4 last:border-0">
                    <img
                      src={review.userId?.avatar || `https://ui-avatars.com/api/?name=${review.userId?.name}&background=random`}
                      className="w-9 h-9 rounded-full object-cover shrink-0"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-gray-800">{review.userId?.name}</p>
                        {(user?._id === review.userId?._id || user?.role === "admin") && (
                          <button onClick={() => handleDeleteReview(review._id)} className="text-xs text-red-400 hover:underline">Xóa</button>
                        )}
                      </div>
                      <div className="flex gap-0.5 mb-1">
                        {[1,2,3,4,5].map((s) => (
                          <FaStar key={s} className={s <= review.rating ? "text-yellow-400 text-xs" : "text-gray-200 text-xs"} />
                        ))}
                      </div>
                      <p className="text-gray-600 text-sm">{review.comment}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── RIGHT: Booking box ── */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
            <p className="text-gray-500 text-sm mb-1">Giá từ</p>
            <p className="text-3xl font-bold text-blue-600 mb-1">
              {tour.price.toLocaleString("vi-VN")}đ
            </p>
            <p className="text-gray-400 text-xs mb-5">/người</p>

            {/* Số người */}
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 mb-2 block">Số người</label>
              <div className="flex items-center border rounded-xl overflow-hidden">
                <button
                  onClick={() => setNumberOfPeople(Math.max(1, numberOfPeople - 1))}
                  className="px-4 py-2 text-lg text-gray-500 hover:bg-gray-100 transition"
                >−</button>
                <span className="flex-1 text-center font-medium">{numberOfPeople}</span>
                <button
                  onClick={() => setNumberOfPeople(Math.min(tour.availableSlots, numberOfPeople + 1))}
                  className="px-4 py-2 text-lg text-gray-500 hover:bg-gray-100 transition"
                >+</button>
              </div>
              <p className="text-xs text-gray-400 mt-1">Còn {tour.availableSlots} chỗ trống</p>
            </div>

            {/* Tổng tiền */}
            <div className="bg-blue-50 rounded-xl p-3 mb-5">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>{tour.price.toLocaleString("vi-VN")}đ × {numberOfPeople} người</span>
              </div>
              <div className="flex justify-between font-bold text-blue-700">
                <span>Tổng tiền</span>
                <span>{(tour.price * numberOfPeople).toLocaleString("vi-VN")}đ</span>
              </div>
            </div>

            <button
              onClick={handleBooking}
              disabled={tour.availableSlots === 0}
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition"
            >
              {tour.availableSlots === 0 ? "Hết chỗ" : "Đặt tour ngay"}
            </button>

            {!user && (
              <p className="text-center text-xs text-gray-400 mt-3">
                <button onClick={() => navigate("/login")} className="text-blue-500 hover:underline">Đăng nhập</button> để đặt tour
              </p>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}