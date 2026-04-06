import { FaMapMarkerAlt, FaClock, FaUsers, FaStar, FaHeart } from 'react-icons/fa'

export const TourInfo = ({ tour, isFavorite, onFavorite }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm">
    <div className="flex items-start justify-between mb-4">
      <h1 className="text-2xl font-bold text-gray-800">{tour.title}</h1>
      <button onClick={onFavorite} className={`text-2xl transition ${isFavorite ? "text-red-500" : "text-gray-300 hover:text-red-400"}`}>
        <FaHeart />
      </button>
    </div>
    <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
      <span className="flex items-center gap-1.5"><FaMapMarkerAlt className="text-blue-400" />{tour.location}</span>
      <span className="flex items-center gap-1.5"><FaClock className="text-blue-400" />{tour.duration}</span>
      <span className="flex items-center gap-1.5"><FaUsers className="text-blue-400" />Còn {tour.availableSlots} chỗ</span>
      <span className="flex items-center gap-1.5"><FaStar className="text-yellow-400" />{tour.rating || "Chưa có đánh giá"}</span>
    </div>
    <p className="text-gray-600 leading-relaxed">{tour.description}</p>
  </div>
)