export const AddUserModal = ({ form, setForm, onSubmit, onClose }) => (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl p-6 w-[400px] shadow-xl">
      <h3 className="text-lg font-bold mb-4">Thêm User</h3>
      <form onSubmit={onSubmit} className="space-y-3">
        <input required placeholder="Họ tên" className="w-full border rounded-lg px-3 py-2 text-sm" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        <input required type="email" placeholder="Email" className="w-full border rounded-lg px-3 py-2 text-sm" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        <input required type="password" placeholder="Mật khẩu" className="w-full border rounded-lg px-3 py-2 text-sm" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
        <input placeholder="Số điện thoại" className="w-full border rounded-lg px-3 py-2 text-sm" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
        <select className="w-full border rounded-lg px-3 py-2 text-sm" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <div className="flex gap-2 pt-2">
          <button type="submit" className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg text-sm">Thêm</button>
          <button type="button" onClick={onClose} className="flex-1 bg-gray-100 hover:bg-gray-200 py-2 rounded-lg text-sm">Hủy</button>
        </div>
      </form>
    </div>
  </div>
)

export const EditUserModal = ({ editUser, form, setForm, isSelf, onSubmit, onClose }) => (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl p-6 w-[400px] shadow-xl">
      <h3 className="text-lg font-bold mb-4">Sửa User — {editUser.name}</h3>
      <form onSubmit={onSubmit} className="space-y-3">
        <input required placeholder="Họ tên" className="w-full border rounded-lg px-3 py-2 text-sm" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        <input placeholder="Số điện thoại" className="w-full border rounded-lg px-3 py-2 text-sm" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
        <select className="w-full border rounded-lg px-3 py-2 text-sm" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} disabled={isSelf(editUser._id)}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        {isSelf(editUser._id) && <p className="text-xs text-orange-500">Bạn không thể tự thay đổi role của mình</p>}
        <div className="flex gap-2 pt-2">
          <button type="submit" className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg text-sm">Lưu</button>
          <button type="button" onClick={onClose} className="flex-1 bg-gray-100 hover:bg-gray-200 py-2 rounded-lg text-sm">Hủy</button>
        </div>
      </form>
    </div>
  </div>
)