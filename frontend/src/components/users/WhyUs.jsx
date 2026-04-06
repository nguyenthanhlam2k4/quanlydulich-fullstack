import React from 'react'
import { FaShieldAlt, FaHeadset, FaMoneyBillWave, FaThumbsUp } from 'react-icons/fa'

const items = [
  { icon: <FaShieldAlt className="text-3xl text-blue-500" />,      title: "Đảm bảo uy tín",   desc: "100% tour được kiểm duyệt và xác nhận chất lượng trước khi đăng tải." },
  { icon: <FaMoneyBillWave className="text-3xl text-green-500" />, title: "Giá tốt nhất",      desc: "Cam kết giá cạnh tranh, không phí ẩn. Hoàn tiền nếu tìm thấy giá rẻ hơn." },
  { icon: <FaHeadset className="text-3xl text-purple-500" />,      title: "Hỗ trợ 24/7",       desc: "Đội ngũ tư vấn luôn sẵn sàng giải đáp mọi thắc mắc bất kỳ lúc nào." },
  { icon: <FaThumbsUp className="text-3xl text-orange-400" />,     title: "Dễ dàng đặt tour",  desc: "Đặt tour chỉ trong vài phút, thanh toán an toàn qua VNPay." },
]

export const WhyUs = () => (
  <section className="max-w-6xl mx-auto px-6 py-14">
    <div className="text-center mb-10" data-aos="fade-up">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Tại sao chọn TrIP?</h2>
      <p className="text-gray-500">Chúng tôi cam kết mang đến trải nghiệm tốt nhất</p>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {items.map((item, i) => (
        <div key={item.title} data-aos="fade-up" data-aos-delay={i * 100}
          className="text-center p-6 rounded-2xl border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
        >
          <div className="flex justify-center mb-4">{item.icon}</div>
          <h3 className="font-bold text-gray-800 mb-2">{item.title}</h3>
          <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
        </div>
      ))}
    </div>
  </section>
)