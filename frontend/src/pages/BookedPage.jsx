import React, { useEffect, useState } from 'react'
import { Header } from '../components/users/Header'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import API from '../services/api'
import Swal from 'sweetalert2'
import { FaMapMarkerAlt, FaClock, FaUsers, FaCalendarAlt } from 'react-icons/fa'

const statusConfig = {
  pending:   { label: "Chờ xác nhận", color: "bg-yellow-100 text-yellow-700" },
  confirmed: { label: "Đã xác nhận",  color: "bg-green-100 text-green-700"  },
  cancelled: { label: "Đã hủy",       color: "bg-red-100 text-red-500"      },
}

export default function BookedPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")

  useEffect(() => {
    if (!user) { navigate("/login"); return }
    const fetch = async () => {
      try {
        const res = await API.get("/bookings/my")
        setBookings(res.data)
      } catch {
        setBookings([])
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [user])

  const handleCancel = async (id) => {
    const result = await Swal.fire({
      title: "Hủy booking?",
      text: "Bạn có chắc muốn hủy chuyến đi này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Hủy booking",
      cancelButtonText: "Không",
    })
    if (!result.isConfirmed) return
    try {
      await API.put(`/bookings/${id}/cancel`)
      setBookings(bookings.map(b => b._id === id ? { ...b, status: "cancelled" } : b))
      Swal.fire({ icon: "success", title: "Đã hủy booking", timer: 1500, showConfirmButton: false })
    } catch (err) {
      Swal.fire({ icon: "error", title: "Lỗi", text: err.response?.data?.message || "Lỗi server" })
    }
  }


  const handlePayment = async (bookingId) => {
    try {
      const res = await API.post("/payment/create", { bookingId })
      window.location.href = res.data.paymentUrl
    } catch (err) {
      Swal.fire({ icon: "error", title: "Lỗi", text: err.response?.data?.message || "Lỗi server" })
    }
  }

  const filtered = filter === "all" ? bookings : bookings.filter(b => b.status === filter)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-4xl mx-auto px-6 pt-10 pb-16">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Lịch sử đặt tour</h1>
        <p className="text-gray-500 text-sm mb-6">Tổng {bookings.length} booking</p>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { key: "all",       label: "Tất cả" },
            { key: "pending",   label: "Chờ xác nhận" },
            { key: "confirmed", label: "Đã xác nhận" },
            { key: "cancelled", label: "Đã hủy" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`text-sm px-4 py-1.5 rounded-full border transition ${
                filter === tab.key
                  ? "bg-blue-500 text-white border-blue-500"
                  : "text-gray-500 border-gray-200 hover:border-blue-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400">Đang tải...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 mb-4">Chưa có booking nào</p>
            <button onClick={() => navigate("/")} className="bg-blue-500 text-white px-6 py-2 rounded-full text-sm hover:bg-blue-600 transition">
              Khám phá tour ngay
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((booking) => (
              <div key={booking._id} className="bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col sm:flex-row">
                {/* Ảnh tour */}
                <div className="sm:w-48 h-40 sm:h-auto shrink-0">
                  <img
                    src={booking.tourId?.images?.[0] || `https://picsum.photos/seed/${booking.tourId?._id}/300/200`}
                    alt={booking.tourId?.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between mb-2">
                      <h3
                        className="font-semibold text-gray-800 hover:text-blue-500 cursor-pointer transition"
                        onClick={() => navigate(`/tours/${booking.tourId?._id}`)}
                      >
                        {booking.tourId?.title}
                      </h3>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium shrink-0 ml-2 ${statusConfig[booking.status]?.color}`}>
                        {statusConfig[booking.status]?.label}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                      <div className="flex items-center gap-1.5">
                        <FaMapMarkerAlt className="text-blue-400" />
                        <span>{booking.tourId?.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <FaClock className="text-blue-400" />
                        <span>{booking.tourId?.duration}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <FaUsers className="text-blue-400" />
                        <span>{booking.numberOfPeople} người</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <FaCalendarAlt className="text-blue-400" />
                        <span>{new Date(booking.bookingDate).toLocaleDateString("vi-VN")}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <p className="font-bold text-blue-600 text-lg">
                      {booking.totalPrice.toLocaleString("vi-VN")}đ
                    </p>
                    {booking.status === "pending" && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handlePayment(booking._id)}
                          className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded-lg transition"
                        >
                          Thanh toán
                        </button>
                        <button
                          onClick={() => handleCancel(booking._id)}
                          className="text-sm text-red-400 border border-red-200 px-4 py-1.5 rounded-lg hover:bg-red-50 transition"
                        >
                          Hủy
                        </button>
                      </div>
                    )}
                    {booking.status === "confirmed" && (
                      <button
                        onClick={() => navigate(`/tours/${booking.tourId?._id}`)}
                        className="text-sm text-blue-500 border border-blue-200 px-4 py-1.5 rounded-lg hover:bg-blue-50 transition"
                      >
                        Xem tour
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}