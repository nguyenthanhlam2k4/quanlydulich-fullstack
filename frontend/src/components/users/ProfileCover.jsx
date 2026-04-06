import { FaCamera, FaEdit } from 'react-icons/fa'

export const ProfileCover = ({ userData, formData, editing, isSelf, onEditClick, onFileChange }) => (
  <div className="relative">
    <div className="h-48 bg-gradient-to-r from-blue-500 to-blue-400" />
    <div className="max-w-4xl mx-auto px-6">
      <div className="relative -mt-16 flex items-end gap-5 pb-4">
        <div className="relative shrink-0">
          <img
            src={formData.avatarFile ? URL.createObjectURL(formData.avatarFile)
              : userData.avatar || `https://ui-avatars.com/api/?name=${userData.name}&background=0D8ABC&color=fff&size=128`}
            className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-lg"
          />
          {editing && (
            <label className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-1.5 cursor-pointer hover:bg-blue-600 transition">
              <FaCamera className="text-xs" />
              <input type="file" accept="image/*" className="hidden" onChange={onFileChange} />
            </label>
          )}
        </div>
        <div className="flex-1 pb-2">
          <h1 className="text-2xl font-bold text-gray-800">{userData.name}</h1>
          <span className={`inline-block text-xs px-2 py-0.5 rounded-full mt-1 ${userData.role === "admin" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"}`}>
            {userData.role === "admin" ? "Admin" : "Thành viên"}
          </span>
        </div>
        {isSelf && !editing && (
          <button onClick={onEditClick}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm transition mb-2">
            <FaEdit /> Chỉnh sửa
          </button>
        )}
      </div>
    </div>
  </div>
)