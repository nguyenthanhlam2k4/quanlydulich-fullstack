import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Header } from '../components/users/Header'
import { ProfileCover } from '../components/users/ProfileCover'
import { ProfileTabs } from '../components/users/ProfileTabs'
import { ProfileInfo } from '../components/users/ProfileInfo'
import { ProfileBookings } from '../components/users/ProfileBookings'
import { ProfileChangePassword } from '../components/users/ProfileChangePassword'
import API from '../services/api'
import Swal from 'sweetalert2'

export default function ProfilePage({ id: propId }) {
  const { id: paramId } = useParams()
  const id = propId || paramId
  const { token, user, setUser } = useAuth()
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("Thông tin")
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({ name: "", phone: "", avatarFile: null })
  const [bookings, setBookings] = useState([])
  const isSelf = user?._id === id

  useEffect(() => {
    if (!token || !id) { setLoading(false); return }
    API.get(`/users/${id}`)
      .then(res => { setUserData(res.data); setFormData({ name: res.data.name, phone: res.data.phone || "", avatarFile: null }) })
      .catch(() => setUserData(null))
      .finally(() => setLoading(false))
  }, [id, token])

  useEffect(() => {
    if (activeTab === "Lịch sử đặt tour" && isSelf)
      API.get("/bookings/my").then(r => setBookings(r.data)).catch(() => setBookings([]))
  }, [activeTab])

  const handleSave = async () => {
    setSaving(true)
    try {
      const data = new FormData()
      data.append("name", formData.name)
      data.append("phone", formData.phone)
      if (formData.avatarFile) data.append("avatar", formData.avatarFile)
      const res = await API.put(`/users/${id}`, data, { headers: { "Content-Type": "multipart/form-data" } })
      setUserData(res.data)
      if (isSelf) setUser(res.data)
      setEditing(false)
      Swal.fire({ icon: "success", title: "Cập nhật thành công!", timer: 1500, showConfirmButton: false })
    } catch (err) {
      Swal.fire({ icon: "error", title: "Lỗi", text: err.response?.data?.message || "Lỗi server" })
    }
    setSaving(false)
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-400">Đang tải...</div>
  if (!userData) return <div className="min-h-screen flex items-center justify-center text-gray-400">Không tìm thấy</div>

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <ProfileCover
        userData={userData} formData={formData} editing={editing} isSelf={isSelf}
        onEditClick={() => setEditing(true)}
        onFileChange={e => setFormData({ ...formData, avatarFile: e.target.files[0] })}
      />
      <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} isSelf={isSelf} />
      <div className="max-w-4xl mx-auto px-6 py-8">
        {activeTab === "Thông tin" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProfileInfo
              userData={userData} formData={formData} editing={editing} saving={saving}
              onChange={e => setFormData({ ...formData, [e.target.name]: e.target.value })}
              onSave={handleSave} onCancel={() => setEditing(false)}
            />
          </div>
        )}
        {activeTab === "Lịch sử đặt tour" && <ProfileBookings bookings={bookings} />}
        {activeTab === "Đổi mật khẩu" && <ProfileChangePassword userId={id} />}
      </div>
    </div>
  )
}