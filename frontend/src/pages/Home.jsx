import React, { useState, useEffect } from 'react'
import { Header } from '../components/users/Header'
import { Banner } from '../components/users/Banner'
import { SearchBar } from '../components/users/SearchBar'
import { TourList } from '../components/users/TourList'
import { Reviews } from '../components/users/Reviews'
import { Footer } from '../components/users/Footer'
import { FaFire, FaMapMarkerAlt, FaClock, FaStar, FaArrowRight, FaShieldAlt, FaHeadset, FaMoneyBillWave, FaThumbsUp } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import API from '../services/api'

// ── Section: Danh mục điểm đến ─────────────────────
const destinations = [
  { name: "Đà Lạt", image: "https://images.unsplash.com/photo-1583417267826-aebc4d1542e1?w=400&h=300&fit=crop", count: "12 tour" },
  { name: "Phú Quốc", image: "https://images.unsplash.com/photo-1540202403-b7abd6747a18?w=400&h=300&fit=crop", count: "8 tour" },
  { name: "Hội An", image: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=400&h=300&fit=crop", count: "10 tour" },
  { name: "Hạ Long", image: "https://images.unsplash.com/photo-1528127269322-539801943592?w=400&h=300&fit=crop", count: "6 tour" },
  { name: "Nha Trang", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop", count: "9 tour" },
  { name: "Sapa", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop", count: "7 tour" },
]

// ── Section: Tại sao chọn chúng tôi ───────────────
const whyUs = [
  { icon: <FaShieldAlt className="text-3xl text-blue-500" />, title: "Đảm bảo uy tín", desc: "100% tour được kiểm duyệt và xác nhận chất lượng trước khi đăng tải." },
  { icon: <FaMoneyBillWave className="text-3xl text-green-500" />, title: "Giá tốt nhất", desc: "Cam kết giá cạnh tranh, không phí ẩn. Hoàn tiền nếu tìm thấy giá rẻ hơn." },
  { icon: <FaHeadset className="text-3xl text-purple-500" />, title: "Hỗ trợ 24/7", desc: "Đội ngũ tư vấn luôn sẵn sàng giải đáp mọi thắc mắc bất kỳ lúc nào." },
  { icon: <FaThumbsUp className="text-3xl text-orange-400" />, title: "Dễ dàng đặt tour", desc: "Đặt tour chỉ trong vài phút, thanh toán an toàn qua VNPay." },
]

// ── Section: Tour hot ──────────────────────────────
const HotTours = () => {
  const [tours, setTours] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    API.get("/tours").then(r => setTours(r.data.slice(0, 4))).catch(() => {})
  }, [])

  if (!tours.length) return null

  const [main, ...rest] = tours

  return (
    <section className="max-w-6xl mx-auto px-6 py-14">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 text-red-500 font-semibold text-sm mb-1">
            <FaFire /> ĐANG HOT
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Tour được đặt nhiều nhất</h2>
        </div>
        <button onClick={() => document.getElementById("tour-list")?.scrollIntoView({ behavior: "smooth" })}
          className="flex items-center gap-2 text-blue-500 hover:text-blue-700 text-sm font-medium transition">
          Xem tất cả <FaArrowRight className="text-xs" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Main featured tour */}
        {main && (
          <div onClick={() => navigate(`/tours/${main._id}`)}
            className="relative rounded-2xl overflow-hidden cursor-pointer group h-72 lg:h-auto">
            <img src={main.images?.[0] || `https://picsum.photos/seed/${main._id}/700/500`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
              <span className="bg-red-500 text-xs px-2 py-0.5 rounded-full mb-2 inline-block">#1 Hot</span>
              <h3 className="text-xl font-bold mb-1 line-clamp-1">{main.title}</h3>
              <div className="flex items-center gap-3 text-sm text-gray-300 mb-2">
                <span className="flex items-center gap-1"><FaMapMarkerAlt className="text-blue-400" />{main.location}</span>
                <span className="flex items-center gap-1"><FaClock className="text-blue-400" />{main.duration}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-lg font-black text-blue-300">{main.price?.toLocaleString("vi-VN")}đ</span>
                <span className="flex items-center gap-1 text-yellow-400 text-sm"><FaStar />{main.rating || "Mới"}</span>
              </div>
            </div>
          </div>
        )}

        {/* Side tours */}
        <div className="flex flex-col gap-4">
          {rest.map((tour, i) => (
            <div key={tour._id} onClick={() => navigate(`/tours/${tour._id}`)}
              className="bg-white rounded-2xl shadow hover:shadow-md transition cursor-pointer flex overflow-hidden group">
              <div className="w-28 h-24 shrink-0 overflow-hidden">
                <img src={tour.images?.[0] || `https://picsum.photos/seed/${tour._id}/200/200`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div className="flex-1 p-3 flex justify-between items-center">
                <div>
                  <span className="text-xs text-red-500 font-semibold">#{i + 2} Hot</span>
                  <h4 className="font-semibold text-gray-800 text-sm line-clamp-1">{tour.title}</h4>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                    <span className="flex items-center gap-0.5"><FaMapMarkerAlt className="text-blue-400" />{tour.location}</span>
                    <span className="flex items-center gap-0.5"><FaClock className="text-blue-400" />{tour.duration}</span>
                  </div>
                </div>
                <div className="text-right shrink-0 ml-2">
                  <p className="text-blue-600 font-bold text-sm">{tour.price?.toLocaleString("vi-VN")}đ</p>
                  <p className="text-xs text-gray-400">/người</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Section: Điểm đến nổi bật ─────────────────────
const Destinations = () => {
  const navigate = useNavigate()
  return (
    <section className="bg-gray-50 py-14 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Điểm đến nổi bật</h2>
          <p className="text-gray-500">Những địa danh được yêu thích nhất Việt Nam</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {destinations.map((dest) => (
            <div key={dest.name}
              onClick={() => navigate(`/?location=${dest.name}`)}
              className="relative rounded-2xl overflow-hidden cursor-pointer group h-44">
              <img src={dest.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                <p className="font-bold text-sm">{dest.name}</p>
                <p className="text-xs text-gray-300">{dest.count}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Section: Tại sao chọn chúng tôi ───────────────
const WhyUs = () => (
  <section className="max-w-6xl mx-auto px-6 py-14">
    <div className="text-center mb-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Tại sao chọn TrIP?</h2>
      <p className="text-gray-500">Chúng tôi cam kết mang đến trải nghiệm tốt nhất</p>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {whyUs.map((item) => (
        <div key={item.title} className="text-center p-6 rounded-2xl border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
          <div className="flex justify-center mb-4">{item.icon}</div>
          <h3 className="font-bold text-gray-800 mb-2">{item.title}</h3>
          <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
        </div>
      ))}
    </div>
  </section>
)

// ── Section: CTA Banner ────────────────────────────
const CTABanner = () => {
  const navigate = useNavigate()
  return (
    <section className="mx-6 mb-14 rounded-3xl overflow-hidden relative">
      <div className="bg-gradient-to-r from-blue-600 to-blue-400 py-16 px-10 text-center text-white relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="relative z-10">
          <h2 className="text-3xl font-black mb-3">Đặt tour ngay hôm nay</h2>
          <p className="text-blue-100 mb-8 text-lg max-w-xl mx-auto">
            Ưu đãi đặc biệt cho khách đặt lần đầu — giảm ngay 10% cho mọi tour!
          </p>
          <div className="flex gap-4 justify-center">
            <button onClick={() => document.getElementById("tour-list")?.scrollIntoView({ behavior: "smooth" })}
              className="bg-white text-blue-600 font-bold px-8 py-3 rounded-full hover:bg-blue-50 transition shadow-lg">
              Khám phá ngay
            </button>
            <button onClick={() => navigate("/contact")}
              className="border-2 border-white text-white font-bold px-8 py-3 rounded-full hover:bg-white/10 transition">
              Liên hệ tư vấn
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Main Home ──────────────────────────────────────
const Home = () => {
  const [filters, setFilters] = useState({})

  return (
    <div>
      <Header transparent />
      <Banner />
      <div className="max-w-6xl mx-auto px-6">
        <SearchBar onSearch={setFilters} />
      </div>
      <HotTours />
      <Destinations />
      <WhyUs />
      <TourList filters={filters} />
      <CTABanner />
      <Reviews />
      <Footer />
    </div>
  )
}

export default Home