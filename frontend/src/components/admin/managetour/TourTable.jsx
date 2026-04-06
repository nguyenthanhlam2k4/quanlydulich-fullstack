export const TourTable = ({ tours, onEdit, onDelete }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-sm text-left">
      <thead>
        <tr className="text-gray-500 border-b">
          <th className="py-2">Tour</th><th>Địa điểm</th><th>Giá</th><th>Chỗ trống</th><th>Rating</th>
          <th className="text-right">Hành động</th>
        </tr>
      </thead>
      <tbody>
        {tours.length === 0 ? (
          <tr><td colSpan={6} className="text-center py-6 text-gray-400">Không có dữ liệu</td></tr>
        ) : tours.map(tour => (
          <tr key={tour._id} className="border-b hover:bg-gray-50">
            <td className="py-2">
              <div className="flex items-center gap-2">
                <img src={tour.images?.[0] || `https://picsum.photos/seed/${tour._id}/60/60`} className="w-10 h-10 rounded-lg object-cover" />
                <span className="font-medium text-gray-700 line-clamp-1 max-w-[180px]">{tour.title}</span>
              </div>
            </td>
            <td>{tour.location}</td>
            <td className="text-blue-600 font-medium">{tour.price?.toLocaleString("vi-VN")}đ</td>
            <td>
              <span className={`px-2 py-1 rounded text-xs ${tour.availableSlots <= 5 ? "bg-red-100 text-red-600" : "bg-green-100 text-green-700"}`}>
                {tour.availableSlots} chỗ
              </span>
            </td>
            <td>⭐ {tour.rating || "—"}</td>
            <td className="text-right space-x-2">
              <button onClick={() => onEdit(tour)} className="text-blue-500 hover:underline">Sửa</button>
              <button onClick={() => onDelete(tour._id)} className="text-red-500 hover:underline">Xóa</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)