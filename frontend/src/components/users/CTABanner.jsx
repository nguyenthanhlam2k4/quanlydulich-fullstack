import React from 'react'
import { useNavigate } from 'react-router-dom'

export const CTABanner = () => {
  const navigate = useNavigate()

  return (
    <section className="mx-6 mb-14 rounded-3xl overflow-hidden" data-aos="zoom-in">
      <div className="bg-gradient-to-r from-blue-600 to-blue-400 py-16 px-10 text-center text-white relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="relative z-10">
          <h2 className="text-3xl font-black mb-3">Đặt tour ngay hôm nay</h2>
          <p className="text-blue-100 mb-8 text-lg max-w-xl mx-auto">
            Ưu đãi đặc biệt cho khách đặt lần đầu — giảm ngay 10% cho mọi tour!
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button
              onClick={() => document.getElementById("tour-list")?.scrollIntoView({ behavior: "smooth" })}
              className="bg-white text-blue-600 font-bold px-8 py-3 rounded-full hover:bg-blue-50 transition shadow-lg"
            >
              Khám phá ngay
            </button>
            <button
              onClick={() => navigate("/contact")}
              className="border-2 border-white text-white font-bold px-8 py-3 rounded-full hover:bg-white/10 transition"
            >
              Liên hệ tư vấn
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}