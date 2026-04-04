import React, { useState } from 'react'
import { Header } from '../components/users/Header'
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaPaperPlane } from 'react-icons/fa'
import Swal from 'sweetalert2'

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    Swal.fire({ icon: "success", title: "Gửi thành công!", text: "Chúng tôi sẽ phản hồi trong vòng 24 giờ.", timer: 2000, showConfirmButton: false })
    setForm({ name: "", email: "", subject: "", message: "" })
    setLoading(false)
  }

  const contacts = [
    { icon: <FaMapMarkerAlt className="text-blue-500" />, title: "Địa chỉ", info: "163 Đường số 28, Gò Vấp, TP.HCM" },
    { icon: <FaPhone className="text-green-500" />, title: "Điện thoại", info: "0909 123 456" },
    { icon: <FaEnvelope className="text-red-400" />, title: "Email", info: "support@trip.vn" },
    { icon: <FaClock className="text-yellow-500" />, title: "Giờ làm việc", info: "8:00 - 22:00, Thứ 2 - Chủ nhật" },
  ]

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-400 text-white py-20 px-6 text-center">
        <h1 className="text-5xl font-black mb-4">Liên hệ với chúng tôi</h1>
        <p className="text-blue-100 text-xl max-w-xl mx-auto">
          Có câu hỏi? Chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7.
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12">

        {/* Contact Info */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Thông tin liên hệ</h2>
          <div className="space-y-5 mb-10">
            {contacts.map((c) => (
              <div key={c.title} className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center shrink-0 text-lg">
                  {c.icon}
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">{c.title}</p>
                  <p className="text-gray-700 font-medium mt-0.5">{c.info}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Map placeholder */}
          <div className="rounded-2xl overflow-hidden h-48 bg-gray-100 flex items-center justify-center">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4746441220595!2d106.70076!3d10.77601!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f4670702e31%3A0xa5777fb3853f4f8!2zTmd1eeG7hW4gSHXhu4csIFF14bqtbiAxLCBUaOG6oCBQaOO6oCBI4buTIENow60gTWluaCwgVmnhu4d0IE5hbQ!5e0!3m2!1svi!2s!4v1234567890"
              width="100%" height="100%" style={{border:0}} allowFullScreen loading="lazy"
            />
          </div>
        </div>

        {/* Form */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Gửi tin nhắn</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500 font-medium mb-1 block">Họ tên</label>
                <input required name="name" value={form.name} onChange={handleChange}
                  placeholder="Nguyễn Văn A"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition" />
              </div>
              <div>
                <label className="text-xs text-gray-500 font-medium mb-1 block">Email</label>
                <input required type="email" name="email" value={form.email} onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition" />
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500 font-medium mb-1 block">Tiêu đề</label>
              <input required name="subject" value={form.subject} onChange={handleChange}
                placeholder="Tôi muốn hỏi về..."
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition" />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-medium mb-1 block">Nội dung</label>
              <textarea required name="message" value={form.message} onChange={handleChange}
                placeholder="Nhập nội dung tin nhắn..."
                rows={5}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition resize-none" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition flex items-center justify-center gap-2">
              <FaPaperPlane className="text-sm" />
              {loading ? "Đang gửi..." : "Gửi tin nhắn"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}