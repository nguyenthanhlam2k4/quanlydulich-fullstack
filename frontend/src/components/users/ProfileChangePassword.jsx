import { useState } from 'react'
import { FaLock } from 'react-icons/fa'
import API from '../../services/api'
import Swal from 'sweetalert2'

export const ProfileChangePassword = ({ userId }) => {
  const [form, setForm] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.newPassword !== form.confirmPassword)
      return Swal.fire({ icon: "warning", title: "Mật khẩu không khớp!" })
    if (form.newPassword.length < 6)
      return Swal.fire({ icon: "warning", title: "Mật khẩu tối thiểu 6 ký tự!" })
    try {
      await API.put(`/users/${userId}/password`, { oldPassword: form.oldPassword, newPassword: form.newPassword })
      Swal.fire({ icon: "success", title: "Đổi mật khẩu thành công!", timer: 1500, showConfirmButton: false })
      setForm({ oldPassword: "", newPassword: "", confirmPassword: "" })
    } catch (err) {
      Swal.fire({ icon: "error", title: "Lỗi", text: err.response?.data?.message || "Lỗi server" })
    }
  }

  return (
    <div className="max-w-md">
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center gap-2 mb-5">
          <FaLock className="text-blue-500" />
          <h2 className="font-semibold text-gray-700">Đổi mật khẩu</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { name: "oldPassword", label: "Mật khẩu hiện tại" },
            { name: "newPassword", label: "Mật khẩu mới" },
            { name: "confirmPassword", label: "Xác nhận mật khẩu mới" },
          ].map(f => (
            <div key={f.name}>
              <label className="text-xs text-gray-500 mb-1 block">{f.label}</label>
              <input type="password" name={f.name} value={form[f.name]}
                onChange={e => setForm({ ...form, [e.target.name]: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-300 outline-none" />
            </div>
          ))}
          <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg text-sm transition mt-2">
            Cập nhật mật khẩu
          </button>
        </form>
      </div>
    </div>
  )
}