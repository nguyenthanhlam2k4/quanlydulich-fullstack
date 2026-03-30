import React, { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa'
import API from '../services/api'

export default function PaymentResult() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const [booking, setBooking] = useState(null)

  const status = params.get("status")
  const bookingId = params.get("bookingId")
  const message = params.get("message")
  const isSuccess = status === "success"

  useEffect(() => {
    if (bookingId && isSuccess) {
      API.get(`/bookings/my`).then(res => {
        const found = res.data.find(b => b._id === bookingId)
        setBooking(found)
      }).catch(() => {})
    }
  }, [bookingId])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">

        {isSuccess ? (
          <>
            <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Thanh toán thành công!</h1>
            <p className="text-gray-500 mb-6">Booking của bạn đã được xác nhận. Chúng tôi sẽ liên hệ sớm nhất.</p>

            {booking && (
              <div className="bg-gray-50 rounded-xl p-4 text-left mb-6 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Tour</span>
                  <span className="font-medium text-gray-700">{booking.tourId?.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Số người</span>
                  <span className="font-medium">{booking.numberOfPeople}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Tổng tiền</span>
                  <span className="font-bold text-blue-600">{booking.totalPrice?.toLocaleString("vi-VN")}đ</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Trạng thái</span>
                  <span className="text-green-600 font-medium">Đã xác nhận</span>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button onClick={() => navigate("/booked")} className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-xl text-sm transition">
                Xem lịch sử
              </button>
              <button onClick={() => navigate("/")} className="flex-1 border border-gray-200 hover:bg-gray-50 text-gray-600 py-2 rounded-xl text-sm transition">
                Về trang chủ
              </button>
            </div>
          </>
        ) : (
          <>
            <FaTimesCircle className="text-red-500 text-6xl mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Thanh toán thất bại</h1>
            <p className="text-gray-500 mb-6">{message || "Có lỗi xảy ra trong quá trình thanh toán."}</p>

            <div className="flex gap-3">
              <button onClick={() => navigate(-1)} className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-xl text-sm transition">
                Thử lại
              </button>
              <button onClick={() => navigate("/")} className="flex-1 border border-gray-200 hover:bg-gray-50 text-gray-600 py-2 rounded-xl text-sm transition">
                Về trang chủ
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}