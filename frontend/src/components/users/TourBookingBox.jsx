import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../../services/api'
import Swal from 'sweetalert2'

export const TourBookingBox = ({ tour, user, onBooked }) => {
  const [numberOfPeople, setNumberOfPeople] = useState(1)
  const navigate = useNavigate()

  const handleBooking = async () => {
    if (!user) {
      Swal.fire({ icon: "warning", title: "Chưa đăng nhập", confirmButtonText: "Đăng nhập" })
        .then(r => { if (r.isConfirmed) navigate("/login") })
      return
    }
    const result = await Swal.fire({
      title: "Xác nhận đặt tour",
      html: `<b>${tour.title}</b><br/>Số người: <b>${numberOfPeople}</b><br/>Tổng tiền: <b>${(tour.price * numberOfPeople).toLocaleString("vi-VN")}đ</b>`,
      icon: "question", showCancelButton: true,
      confirmButtonText: "Đặt ngay", cancelButtonText: "Hủy",
    })
    if (!result.isConfirmed) return
    try {
      await API.post("/bookings", { tourId: tour._id, numberOfPeople })
      Swal.fire({ icon: "success", title: "Đặt tour thành công!", text: "Chúng tôi sẽ liên hệ xác nhận sớm nhất." })
      onBooked?.()
    } catch (err) {
      Swal.fire({ icon: "error", title: "Lỗi", text: err.response?.data?.message || "Lỗi server" })
    }
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
      <p className="text-gray-500 text-sm mb-1">Giá từ</p>
      <p className="text-3xl font-bold text-blue-600 mb-1">{tour.price?.toLocaleString("vi-VN")}đ</p>
      <p className="text-gray-400 text-xs mb-5">/người</p>

      <div className="mb-4">
        <label className="text-sm font-medium text-gray-700 mb-2 block">Số người</label>
        <div className="flex items-center border rounded-xl overflow-hidden">
          <button onClick={() => setNumberOfPeople(Math.max(1, numberOfPeople - 1))}
            className="px-4 py-2 text-lg text-gray-500 hover:bg-gray-100 transition">−</button>
          <span className="flex-1 text-center font-medium">{numberOfPeople}</span>
          <button onClick={() => setNumberOfPeople(Math.min(tour.availableSlots, numberOfPeople + 1))}
            className="px-4 py-2 text-lg text-gray-500 hover:bg-gray-100 transition">+</button>
        </div>
        <p className="text-xs text-gray-400 mt-1">Còn {tour.availableSlots} chỗ trống</p>
      </div>

      <div className="bg-blue-50 rounded-xl p-3 mb-5">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>{tour.price?.toLocaleString("vi-VN")}đ × {numberOfPeople} người</span>
        </div>
        <div className="flex justify-between font-bold text-blue-700">
          <span>Tổng tiền</span>
          <span>{(tour.price * numberOfPeople).toLocaleString("vi-VN")}đ</span>
        </div>
      </div>

      <button onClick={handleBooking} disabled={tour.availableSlots === 0}
        className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition">
        {tour.availableSlots === 0 ? "Hết chỗ" : "Đặt tour ngay"}
      </button>

      {!user && (
        <p className="text-center text-xs text-gray-400 mt-3">
          <button onClick={() => navigate("/login")} className="text-blue-500 hover:underline">Đăng nhập</button> để đặt tour
        </p>
      )}
    </div>
  )
}