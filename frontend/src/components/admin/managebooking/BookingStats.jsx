export const BookingStats = ({ bookings }) => {
  const stats = [
    { label: "Tổng booking",   value: bookings.length,                                                  color: "text-blue-600",   bg: "bg-blue-50"   },
    { label: "Chờ thanh toán", value: bookings.filter(b => b.status === "pending").length,              color: "text-yellow-600", bg: "bg-yellow-50" },
    { label: "Đã xác nhận",    value: bookings.filter(b => b.status === "confirmed").length,            color: "text-green-600",  bg: "bg-green-50"  },
    { label: "Doanh thu",      value: bookings.filter(b => b.status === "confirmed").reduce((s, b) => s + b.totalPrice, 0).toLocaleString("vi-VN") + "đ", color: "text-purple-600", bg: "bg-purple-50" },
  ]
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map(s => (
        <div key={s.label} className={`${s.bg} rounded-2xl p-4`}>
          <p className="text-xs text-gray-500 mb-1">{s.label}</p>
          <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
        </div>
      ))}
    </div>
  )
}