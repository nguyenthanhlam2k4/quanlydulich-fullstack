import React from 'react'
import { useNavigate } from 'react-router-dom'

const destinations = [
  { name: "Đà Lạt",    image: "https://images.unsplash.com/photo-1583417267826-aebc4d1542e1?w=400&h=300&fit=crop", count: "12 tour" },
  { name: "Phú Quốc",  image: "https://images.unsplash.com/photo-1540202403-b7abd6747a18?w=400&h=300&fit=crop", count: "8 tour"  },
  { name: "Hội An",    image: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=400&h=300&fit=crop", count: "10 tour" },
  { name: "Hạ Long",   image: "https://images.unsplash.com/photo-1528127269322-539801943592?w=400&h=300&fit=crop", count: "6 tour"  },
  { name: "Nha Trang", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop", count: "9 tour"  },
  { name: "Sapa",      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop", count: "7 tour"  },
]

export const Destinations = () => {
  const navigate = useNavigate()

  return (
    <section className="bg-gray-50 py-14 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10" data-aos="fade-up">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Điểm đến nổi bật</h2>
          <p className="text-gray-500">Những địa danh được yêu thích nhất Việt Nam</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {destinations.map((dest, i) => (
            <div key={dest.name} data-aos="zoom-in" data-aos-delay={i * 80}
              onClick={() => navigate(`/?location=${dest.name}`)}
              className="relative rounded-2xl overflow-hidden cursor-pointer group h-44"
            >
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