import { FaUser, FaEnvelope, FaPhone, FaShieldAlt, FaCalendarAlt } from 'react-icons/fa'

export const ProfileInfo = ({ userData, formData, editing, saving, onChange, onSave, onCancel }) => {
  const fields = [
    { icon: <FaUser className="text-blue-400" />,        label: "Họ tên",       value: userData.name },
    { icon: <FaEnvelope className="text-blue-400" />,    label: "Email",        value: userData.email },
    { icon: <FaPhone className="text-blue-400" />,       label: "Điện thoại",   value: userData.phone || "Chưa cập nhật" },
    { icon: <FaShieldAlt className="text-blue-400" />,   label: "Vai trò",      value: userData.role === "admin" ? "Quản trị viên" : "Thành viên" },
    { icon: <FaCalendarAlt className="text-blue-400" />, label: "Ngày tham gia",value: new Date(userData.createdAt).toLocaleDateString("vi-VN") },
  ]

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <h2 className="font-semibold text-gray-700 mb-4">Thông tin cá nhân</h2>
      {editing ? (
        <div className="space-y-3">
          {[{ name: "name", label: "Họ tên" }, { name: "phone", label: "Số điện thoại" }].map(f => (
            <div key={f.name}>
              <label className="text-xs text-gray-500 mb-1 block">{f.label}</label>
              <input name={f.name} value={formData[f.name]} onChange={onChange}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-300 outline-none" />
            </div>
          ))}
          <div className="flex gap-2 pt-2">
            <button onClick={onSave} disabled={saving}
              className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white py-2 rounded-lg text-sm">
              {saving ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
            <button onClick={onCancel} className="flex-1 bg-gray-100 hover:bg-gray-200 py-2 rounded-lg text-sm">Hủy</button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {fields.map(item => (
            <div key={item.label} className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center shrink-0">{item.icon}</div>
              <div>
                <p className="text-xs text-gray-400">{item.label}</p>
                <p className="text-sm text-gray-700 font-medium">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}