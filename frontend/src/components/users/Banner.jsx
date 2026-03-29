import React from 'react'
import banner from '../../assets/banner/banner_hcmcity.jpg'

export const Banner = () => {
  const handleScroll = () => {
    const section = document.getElementById("tour-list");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="pt-0 relative w-full h-[550px] overflow-hidden">
      {/* Ảnh nền */}
      <img
        src={banner}
        alt="Banner"
        className="w-full h-full object-cover"
      />

      {/* Overlay tối */}
      <div className="absolute inset-0 bg-black/45" />

      {/* Nội dung */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
        <p className="text-sm uppercase tracking-widest text-blue-300 mb-3 font-medium">
          Khám phá thế giới cùng TrIP
        </p>

        <h1 className="text-5xl font-bold leading-tight mb-4 drop-shadow-lg">
          Hành trình của bạn <br />
          <span className="text-blue-400">bắt đầu từ đây</span>
        </h1>

        <p className="text-gray-200 text-lg max-w-xl mb-8">
          Tìm kiếm và đặt những tour du lịch tuyệt vời nhất — trải nghiệm đáng nhớ đang chờ bạn.
        </p>

        <button
          onClick={handleScroll}
          className="bg-blue-500 hover:bg-blue-600 active:scale-95 text-white font-semibold px-8 py-3 rounded-full text-base transition-all duration-200 shadow-lg hover:shadow-blue-500/40"
        >
          Khám phá ngay ↓
        </button>
      </div>
    </div>
  )
}