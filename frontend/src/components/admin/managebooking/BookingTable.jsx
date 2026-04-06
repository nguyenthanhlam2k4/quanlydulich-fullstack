const statusConfig = {
  pending:   { label: "Chờ thanh toán", color: "bg-yellow-100 text-yellow-700" },
  confirmed: { label: "Đã xác nhận",    color: "bg-green-100 text-green-700"   },
  cancelled: { label: "Đã hủy",         color: "bg-red-100 text-red-500"       },
}

export const BookingTable = ({ bookings, onConfirm, onCancel, onDelete }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-sm text-left">
      <thead>
        <tr className="text-gray-500 border-b">
          <th className="py-2">Khách hàng</th>
          <th>Tour</th>
          <th>Số người</th>
          <th>Tổng tiền</th>
          <th>Thanh toán</th>
          <th>Ngày đặt</th>
          <th>Trạng thái</th>
          <th className="text-right">Hành động</th>
        </tr>
      </thead>
      <tbody>
        {bookings.length === 0 ? (
          <tr><td colSpan={8} className="text-center py-6 text-gray-400">Không có dữ liệu</td></tr>
        ) : bookings.map(booking => (
          <tr key={booking._id} className="border-b hover:bg-gray-50">
            <td className="py-2">
              <div className="flex items-center gap-2">
                <img src={booking.userId?.avatar || `https://ui-avatars.com/api/?name=${booking.userId?.name}&background=random`}
                  className="w-7 h-7 rounded-full object-cover" />
                <div>
                  <p className="font-medium text-gray-700">{booking.userId?.name}</p>
                  <p className="text-xs text-gray-400">{booking.userId?.email}</p>
                </div>
              </div>
            </td>
            <td className="max-w-[160px]">
              <p className="line-clamp-1 text-gray-700">{booking.tourId?.title}</p>
              <p className="text-xs text-gray-400">{booking.tourId?.location}</p>
            </td>
            <td className="text-center">{booking.numberOfPeople}</td>
            <td className="text-blue-600 font-medium">{booking.totalPrice?.toLocaleString("vi-VN")}đ</td>
            <td>
              {booking.isPaid
                ? <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Đã TT</span>
                : <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">Chưa TT</span>}
            </td>
            <td className="text-gray-500">{new Date(booking.bookingDate).toLocaleDateString("vi-VN")}</td>
            <td>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig[booking.status]?.color}`}>
                {statusConfig[booking.status]?.label}
              </span>
            </td>
            <td className="text-right">
              <div className="flex gap-1.5 justify-end">
                {booking.status === "pending" && booking.isPaid && (
                  <button onClick={() => onConfirm(booking._id)}
                    className="text-xs bg-green-50 text-green-600 border border-green-200 px-2 py-1 rounded hover:bg-green-100 transition">
                    Xác nhận
                  </button>
                )}
                {booking.status === "pending" && !booking.isPaid && (
                  <button onClick={() => onCancel(booking._id)}
                    className="text-xs bg-red-50 text-red-500 border border-red-200 px-2 py-1 rounded hover:bg-red-100 transition">
                    Hủy
                  </button>
                )}
                {(booking.status === "confirmed" || booking.status === "cancelled") && (
                  <button onClick={() => onDelete(booking._id)}
                    className="text-xs bg-gray-50 text-gray-500 border border-gray-200 px-2 py-1 rounded hover:bg-gray-100 transition">
                    Xóa
                  </button>
                )}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)