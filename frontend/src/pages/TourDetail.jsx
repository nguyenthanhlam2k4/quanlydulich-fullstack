import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FaChevronLeft } from 'react-icons/fa'
import { useAuth } from '../contexts/AuthContext'
import { Header } from '../components/users/Header'
import { TourImageSlider } from '../components/users/TourImageSlider'
import { TourInfo } from '../components/users/TourInfo'
import { TourSchedule } from '../components/users/TourSchedule'
import { TourBookingBox } from '../components/users/TourBookingBox'
import { TourReviews } from '../components/users/TourReviews'
import API from '../services/api'
import Swal from 'sweetalert2'

export default function TourDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [tour, setTour] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [isFavorite, setIsFavorite] = useState(false)

  const fetchTour = async () => {
    const res = await API.get(`/tours/${id}`)
    setTour(res.data)
  }

  useEffect(() => {
    const load = async () => {
      try {
        const [tourRes, reviewRes] = await Promise.all([API.get(`/tours/${id}`), API.get(`/reviews/tour/${id}`)])
        setTour(tourRes.data)
        setReviews(reviewRes.data)
      } catch {
        Swal.fire({ icon: "error", title: "Không tìm thấy tour" })
        navigate("/")
      } finally { setLoading(false) }
    }
    load()
  }, [id])

  const handleFavorite = async () => {
    if (!user) { navigate("/login"); return }
    const res = await API.post("/favorites", { tourId: id })
    setIsFavorite(res.data.isFavorite)
  }

  if (loading) return <div className="flex items-center justify-center h-screen text-gray-400">Đang tải...</div>
  if (!tour) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-6xl mx-auto px-6 pt-24">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-blue-500 text-sm mb-4 transition">
          <FaChevronLeft /> Quay lại
        </button>
      </div>
      <div className="max-w-6xl mx-auto px-6 pb-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <TourImageSlider images={tour.images} tourId={tour._id} />
          <TourInfo tour={tour} isFavorite={isFavorite} onFavorite={handleFavorite} />
          <TourSchedule schedule={tour.schedule} />
          <TourReviews reviews={reviews} setReviews={setReviews} tourId={id} user={user} />
        </div>
        <div className="lg:col-span-1">
          <TourBookingBox tour={tour} user={user} onBooked={fetchTour} />
        </div>
      </div>
    </div>
  )
}