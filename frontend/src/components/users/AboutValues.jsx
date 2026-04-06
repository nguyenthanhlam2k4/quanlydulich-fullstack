import { FaShieldAlt, FaHeart, FaMapMarkedAlt } from 'react-icons/fa'

const values = [
  { icon: <FaShieldAlt className="text-blue-500 text-3xl" />,    title: "Uy tín & Minh bạch",  desc: "Mọi thông tin tour đều rõ ràng, giá cả công khai, không phát sinh chi phí ẩn." },
  { icon: <FaHeart className="text-red-400 text-3xl" />,          title: "Tận tâm phục vụ",      desc: "Đội ngũ hỗ trợ 24/7, luôn sẵn sàng giải đáp mọi thắc mắc của khách hàng." },
  { icon: <FaMapMarkedAlt className="text-green-500 text-3xl" />, title: "Trải nghiệm đích thực",desc: "Chúng tôi chọn lọc kỹ càng từng tour để đảm bảo chất lượng tốt nhất." },
]

export const AboutValues = () => (
  <div className="bg-gray-50 py-16 px-6">
    <div className="max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">Giá trị cốt lõi</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {values.map((v) => (
          <div key={v.title} className="bg-white rounded-2xl p-6 shadow-sm text-center">
            <div className="flex justify-center mb-4">{v.icon}</div>
            <h3 className="font-bold text-gray-800 mb-2">{v.title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
)