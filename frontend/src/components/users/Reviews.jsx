import React, { useEffect, useState } from 'react'
import { FaStar, FaQuoteLeft } from 'react-icons/fa'
import API from '../../services/api'

export const Reviews = () => {
  const [reviews, setReviews] = useState([])

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await API.get("/reviews/all")
        // Lấy 6 review mới nhất có rating >= 4
        const top = res.data.filter(r => r.rating >= 4).slice(0, 6)
        setReviews(top)
      } catch {
        // Fallback data
        setReviews([
          { _id: 1, userId: { name: "Nguyễn Văn A", avatar: "" }, tourId: { title: "Tour Đà Lạt 3N2Đ" }, rating: 5, comment: "Tour tuyệt vời, hướng dẫn viên nhiệt tình, cảnh đẹp!" },
          { _id: 2, userId: { name: "Trần Thị B", avatar: "" }, tourId: { title: "Tour Phú Quốc" }, rating: 5, comment: "Biển đẹp, dịch vụ chu đáo, chắc chắn sẽ quay lại." },
          { _id: 3, userId: { name: "Lê Văn C", avatar: "" }, tourId: { title: "Tour Hội An" }, rating: 4, comment: "Rất đáng tiền, trải nghiệm tuyệt vời cho gia đình." },
        ])
      }
    }
    fetch()
  }, [])

  return (
    <section className="bg-gray-50 py-14 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">Khách hàng nói gì?</h2>
        <p className="text-gray-500 text-center mb-10">Hàng nghìn khách hàng hài lòng với TrIP</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <div key={review._id} className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition">
              <FaQuoteLeft className="text-blue-200 text-2xl mb-3" />

              <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                {review.comment}
              </p>

              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className={i < review.rating ? "text-yellow-400" : "text-gray-200"} />
                ))}
              </div>

              {/* User */}
              <div className="flex items-center gap-3 border-t pt-3">
                <img
                  src={review.userId?.avatar || `https://ui-avatars.com/api/?name=${review.userId?.name}&background=random`}
                  className="w-9 h-9 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-medium text-gray-800">{review.userId?.name}</p>
                  <p className="text-xs text-gray-400">{review.tourId?.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}