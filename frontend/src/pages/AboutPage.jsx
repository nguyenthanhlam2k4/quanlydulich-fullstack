import React from 'react'
import { Header } from '../components/users/Header'
import { FaShieldAlt, FaMapMarkedAlt, FaHeadset, FaStar, FaUsers, FaRoute, FaHeart } from 'react-icons/fa'

export default function AboutPage() {
  const team = [
    { name: "Nguyễn Văn A", role: "CEO & Founder", avatar: "https://ui-avatars.com/api/?name=Nguyen+Van+A&background=3b82f6&color=fff&size=128" },
    { name: "Trần Thị B", role: "Head of Tours", avatar: "https://ui-avatars.com/api/?name=Tran+Thi+B&background=06b6d4&color=fff&size=128" },
    { name: "Lê Văn C", role: "Customer Success", avatar: "https://ui-avatars.com/api/?name=Le+Van+C&background=8b5cf6&color=fff&size=128" },
  ]

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-400 text-white py-24 px-6 text-center">
        <h1 className="text-5xl font-black mb-4">Về chúng tôi</h1>
        <p className="text-blue-100 text-xl max-w-2xl mx-auto">
          TrIP — nền tảng đặt tour du lịch hàng đầu Việt Nam, kết nối bạn với những hành trình tuyệt vời nhất.
        </p>
      </div>

      {/* Mission */}
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Sứ mệnh của chúng tôi</h2>
            <p className="text-gray-500 leading-relaxed mb-4">
              Chúng tôi tin rằng mọi người đều xứng đáng được trải nghiệm những chuyến đi tuyệt vời. 
              TrIP ra đời với sứ mệnh làm cho việc đặt tour trở nên đơn giản, minh bạch và đáng tin cậy.
            </p>
            <p className="text-gray-500 leading-relaxed">
              Từ những tour khám phá địa phương đến những hành trình quốc tế xa xôi, 
              chúng tôi đảm bảo mỗi chuyến đi của bạn đều là một kỷ niệm đáng nhớ.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: <FaRoute className="text-3xl text-blue-500" />, num: "500+", label: "Tour hấp dẫn" },
              { icon: <FaUsers className="text-3xl text-green-500" />, num: "10,000+", label: "Khách hàng" },
              { icon: <FaMapMarkedAlt className="text-3xl text-red-400" />, num: "50+", label: "Điểm đến" },
              { icon: <FaStar className="text-3xl text-yellow-400" />, num: "4.9/5", label: "Đánh giá" },
            ].map((s) => (
              <div key={s.label} className="bg-gray-50 rounded-2xl p-5 text-center">
                <div className="flex justify-center mb-2">{s.icon}</div>
                <p className="text-2xl font-black text-gray-800">{s.num}</p>
                <p className="text-gray-500 text-sm">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="bg-gray-50 py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">Giá trị cốt lõi</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: <FaShieldAlt className="text-blue-500 text-3xl" />, title: "Uy tín & Minh bạch", desc: "Mọi thông tin tour đều rõ ràng, giá cả công khai, không phát sinh chi phí ẩn." },
              { icon: <FaHeart className="text-red-400 text-3xl" />, title: "Tận tâm phục vụ", desc: "Đội ngũ hỗ trợ 24/7, luôn sẵn sàng giải đáp mọi thắc mắc của khách hàng." },
              { icon: <FaMapMarkedAlt className="text-green-500 text-3xl" />, title: "Trải nghiệm đích thực", desc: "Chúng tôi chọn lọc kỹ càng từng tour để đảm bảo chất lượng và trải nghiệm tốt nhất." },
            ].map((v) => (
              <div key={v.title} className="bg-white rounded-2xl p-6 shadow-sm text-center">
                <div className="flex justify-center mb-4">{v.icon}</div>
                <h3 className="font-bold text-gray-800 mb-2">{v.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team */}
      <div className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">Đội ngũ của chúng tôi</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {team.map((member) => (
            <div key={member.name} className="text-center">
              <img src={member.avatar} className="w-24 h-24 rounded-full mx-auto mb-4 shadow-lg" />
              <h3 className="font-bold text-gray-800">{member.name}</h3>
              <p className="text-blue-500 text-sm">{member.role}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-blue-600 text-white py-16 px-6 text-center">
        <h2 className="text-3xl font-bold mb-4">Sẵn sàng khám phá?</h2>
        <p className="text-blue-100 mb-8">Hàng trăm tour đang chờ bạn. Đặt ngay hôm nay!</p>
        <a href="/" className="bg-white text-blue-600 font-bold px-8 py-3 rounded-full hover:bg-blue-50 transition">
          Xem tất cả tour
        </a>
      </div>
    </div>
  )
}