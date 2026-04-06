export const UserTable = ({ users, showDeleted, isSelf, onEdit, onSoftDelete, onRestore, onDelete }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-sm text-left">
      <thead>
        <tr className="text-gray-500 border-b">
          <th className="py-2">Tên</th><th>Email</th><th>Phone</th><th>Role</th>
          <th className="text-right">Hành động</th>
        </tr>
      </thead>
      <tbody>
        {users.length === 0 ? (
          <tr><td colSpan={5} className="text-center py-6 text-gray-400">Không có dữ liệu</td></tr>
        ) : users.map(user => (
          <tr key={user._id} className={`border-b hover:bg-gray-50 ${isSelf(user._id) ? "bg-blue-50" : ""}`}>
            <td className="py-2">
              <div className="flex items-center gap-2">
                <img src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=random`} className="w-7 h-7 rounded-full object-cover" />
                {user.name}
                {isSelf(user._id) && <span className="text-xs text-blue-500">(bạn)</span>}
              </div>
            </td>
            <td>{user.email}</td>
            <td>{user.phone || "—"}</td>
            <td>
              <span className={`px-2 py-1 rounded text-xs ${user.role === "admin" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"}`}>
                {user.role}
              </span>
            </td>
            <td className="text-right space-x-2">
              {!showDeleted ? (
                <>
                  <button onClick={() => onEdit(user)} className="text-blue-500 hover:underline">Sửa</button>
                  {!isSelf(user._id) && <button onClick={() => onSoftDelete(user._id)} className="text-red-500 hover:underline">Xóa</button>}
                </>
              ) : (
                <>
                  <button onClick={() => onRestore(user._id)} className="text-green-500 hover:underline">Khôi phục</button>
                  <button onClick={() => onDelete(user._id)} className="text-red-500 hover:underline">Xóa vĩnh viễn</button>
                </>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)