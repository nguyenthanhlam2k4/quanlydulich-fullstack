import { FaRoute, FaUsers, FaMapMarkedAlt, FaStar } from 'react-icons/fa'

const stats = [
  { icon: <FaRoute className="text-3xl text-blue-500" />,       num: "500+",   label: "Tour hấp dẫn" },
  { icon: <FaUsers className="text-3xl text-green-500" />,      num: "10,000+",label: "Khách hàng"   },
  { icon: <FaMapMarkedAlt className="text-3xl text-red-400" />, num: "50+",    label: "Điểm đến"     },
  { icon: <FaStar className="text-3xl text-yellow-400" />,      num: "4.9/5",  label: "Đánh giá"     },
]

export const AboutMission = () => (
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
        {stats.map((s) => (
          <div key={s.label} className="bg-gray-50 rounded-2xl p-5 text-center">
            <div className="flex justify-center mb-2">{s.icon}</div>
            <p className="text-2xl font-black text-gray-800">{s.num}</p>
            <p className="text-gray-500 text-sm">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
)