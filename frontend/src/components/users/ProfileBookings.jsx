import { FaMapMarkerAlt, FaClock, FaBookmark } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

const statusConfig = {
  pending:   { label: "Chờ xác nhận", color: "bg-yellow-100 text-yellow-700" },
  confirmed: { label: "Đã xác nhận",  color: "bg-green-100 text-green-700"  },
  cancelled: { label: "Đã hủy",       color: "bg-red-100 text-red-500"      },
}

export const ProfileBookings = ({ bookings }) => {
  const navigate = useNavigate()
  if (bookings.length === 0) return (
    <div className="text-center py-16 text-gray-400">
      <FaBookmark className="text-4xl mx-auto mb-3 text-gray-200" />
      <p>Chưa có booking nào</p>
      <button onClick={() => navigate("/")} className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-full text-sm hover:bg-blue-600 transition">
        Khám phá tour
      </button>
    </div>
  )
  return (
    <div className="space-y-4">
      {bookings.map(b => (
        <div key={b._id} className="bg-white rounded-2xl shadow-sm overflow-hidden flex">
          <img src={b.tourId?.images?.[0] || `https://picsum.photos/seed/${b.tourId?._id}/200`} className="w-36 h-28 object-cover shrink-0" />
          <div className="flex-1 p-4 flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-gray-800 mb-1 cursor-pointer hover:text-blue-500"
                onClick={() => navigate(`/tours/${b.tourId?._id}`)}>
                {b.tourId?.title}
              </h3>
              <div className="flex gap-3 text-xs text-gray-500">
                <span className="flex items-center gap-1"><FaMapMarkerAlt className="text-blue-400" />{b.tourId?.location}</span>
                <span className="flex items-center gap-1"><FaClock className="text-blue-400" />{b.tourId?.duration}</span>
              </div>
              <p className="text-blue-600 font-bold text-sm mt-1">{b.totalPrice?.toLocaleString("vi-VN")}đ</p>
            </div>
            <span className={`text-xs px-3 py-1 rounded-full font-medium shrink-0 ${statusConfig[b.status]?.color}`}>
              {statusConfig[b.status]?.label}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}