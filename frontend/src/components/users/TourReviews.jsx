import { useState } from 'react'
import { FaStar } from 'react-icons/fa'
import API from '../../services/api'
import Swal from 'sweetalert2'

export const TourReviews = ({ reviews, setReviews, tourId, user }) => {
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await API.post("/reviews", { tourId, rating, comment })
      setReviews([res.data, ...reviews])
      setComment(""); setRating(5)
      Swal.fire({ icon: "success", title: "Đánh giá thành công!", timer: 1500, showConfirmButton: false })
    } catch (err) {
      Swal.fire({ icon: "error", title: "Lỗi", text: err.response?.data?.message || "Lỗi server" })
    }
    setSubmitting(false)
  }

  const handleDelete = async (reviewId) => {
    const result = await Swal.fire({ title: "Xóa đánh giá?", icon: "warning", showCancelButton: true, confirmButtonColor: "#ef4444", confirmButtonText: "Xóa", cancelButtonText: "Hủy" })
    if (!result.isConfirmed) return
    try {
      await API.delete(`/reviews/${reviewId}`)
      setReviews(reviews.filter(r => r._id !== reviewId))
    } catch {}
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h2 className="text-lg font-bold text-gray-800 mb-4">Đánh giá ({reviews.length})</h2>

      {user && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-50 rounded-xl">
          <p className="text-sm font-medium text-gray-700 mb-2">Đánh giá của bạn</p>
          <div className="flex gap-1 mb-3">
            {[1,2,3,4,5].map(s => (
              <button key={s} type="button" onClick={() => setRating(s)}>
                <FaStar className={s <= rating ? "text-yellow-400 text-xl" : "text-gray-300 text-xl"} />
              </button>
            ))}
          </div>
          <textarea value={comment} onChange={e => setComment(e.target.value)}
            placeholder="Chia sẻ trải nghiệm của bạn..."
            className="w-full border rounded-xl px-3 py-2 text-sm outline-none resize-none h-20 focus:ring-2 focus:ring-blue-300" />
          <button type="submit" disabled={submitting}
            className="mt-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white text-sm px-5 py-2 rounded-lg transition">
            {submitting ? "Đang gửi..." : "Gửi đánh giá"}
          </button>
        </form>
      )}

      {reviews.length === 0 ? (
        <p className="text-gray-400 text-sm text-center py-4">Chưa có đánh giá nào</p>
      ) : (
        <div className="space-y-4">
          {reviews.map(review => (
            <div key={review._id} className="flex gap-3 border-b pb-4 last:border-0">
              <img src={review.userId?.avatar || `https://ui-avatars.com/api/?name=${review.userId?.name}&background=random`}
                className="w-9 h-9 rounded-full object-cover shrink-0" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-gray-800">{review.userId?.name}</p>
                  {(user?._id === review.userId?._id || user?.role === "admin") && (
                    <button onClick={() => handleDelete(review._id)} className="text-xs text-red-400 hover:underline">Xóa</button>
                  )}
                </div>
                <div className="flex gap-0.5 mb-1">
                  {[1,2,3,4,5].map(s => <FaStar key={s} className={s <= review.rating ? "text-yellow-400 text-xs" : "text-gray-200 text-xs"} />)}
                </div>
                <p className="text-gray-600 text-sm">{review.comment}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}