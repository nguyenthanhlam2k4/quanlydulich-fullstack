import { useState } from 'react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'

export const TourImageSlider = ({ images, tourId }) => {
  const [current, setCurrent] = useState(0)
  const imgs = images?.length > 0 ? images : [`https://picsum.photos/seed/${tourId}/800/500`]

  return (
    <div className="relative rounded-2xl overflow-hidden h-80 bg-gray-200">
      <img src={imgs[current]} alt="tour" className="w-full h-full object-cover" />
      {imgs.length > 1 && (
        <>
          <button onClick={() => setCurrent((current - 1 + imgs.length) % imgs.length)}
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 transition">
            <FaChevronLeft />
          </button>
          <button onClick={() => setCurrent((current + 1) % imgs.length)}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 transition">
            <FaChevronRight />
          </button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {imgs.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)}
                className={`w-2 h-2 rounded-full transition ${i === current ? "bg-white" : "bg-white/50"}`} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}