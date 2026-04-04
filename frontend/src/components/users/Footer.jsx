import React from 'react'
import { Link } from 'react-router-dom'
import { FaCarAlt, FaFacebook, FaInstagram, FaYoutube, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa'

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 pt-14 pb-6 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">

        {/* Brand */}
        <div className="md:col-span-1">
          <div className="flex items-center gap-2 text-white text-2xl font-black mb-4">
            <FaCarAlt className="text-blue-400" />
            <span>TrIP</span>
          </div>
          <p className="text-sm leading-relaxed mb-4">
            Nền tảng đặt tour du lịch hàng đầu Việt Nam. Khám phá thế giới theo cách của bạn.
          </p>
          <div className="flex gap-3">
            {[FaFacebook, FaInstagram, FaYoutube].map((Icon, i) => (
              <button key={i} className="w-9 h-9 bg-gray-800 hover:bg-blue-500 rounded-full flex items-center justify-center transition">
                <Icon className="text-sm text-white" />
              </button>
            ))}
          </div>
        </div>

        {/* Links */}
        <div>
          <h4 className="text-white font-semibold mb-4">Khám phá</h4>
          <ul className="space-y-2 text-sm">
            {[["Trang chủ", "/"], ["Tour nổi bật", "/"], ["About", "/about"], ["Liên hệ", "/contact"]].map(([label, path]) => (
              <li key={label}><Link to={path} className="hover:text-white transition">{label}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Tài khoản</h4>
          <ul className="space-y-2 text-sm">
            {[["Đăng nhập", "/login"], ["Đăng ký", "/login"], ["Lịch sử đặt tour", "/booked"], ["Tour yêu thích", "/favorites"]].map(([label, path]) => (
              <li key={label}><Link to={path} className="hover:text-white transition">{label}</Link></li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-white font-semibold mb-4">Liên hệ</h4>
          <ul className="space-y-3 text-sm">
            {[
              { icon: <FaMapMarkerAlt />, text: "123 Nguyễn Huệ, Q.1, TP.HCM" },
              { icon: <FaPhone />, text: "0909 123 456" },
              { icon: <FaEnvelope />, text: "support@trip.vn" },
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5 shrink-0">{item.icon}</span>
                <span>{item.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-800 pt-6 text-center text-xs">
        © 2026 TrIP Tours. All rights reserved.
      </div>
    </footer>
  )
}