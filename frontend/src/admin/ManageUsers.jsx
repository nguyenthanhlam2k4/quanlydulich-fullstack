import React, { useEffect, useState } from "react";
import { getUsers, createUser, updateUser, softDeleteUser, restoreUser, deleteUser } from "../services/userService";
import { useAuth } from "../contexts/AuthContext";
import Swal from "sweetalert2";

export const ManageUsers = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [showDeleted, setShowDeleted] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "", role: "user" });

  const fetchUsers = async () => {
    try {
      const res = await getUsers({ deleted: showDeleted, role: filterRole, sort: sortOrder, search });
      setUsers(res.data);
    } catch (err) {
      console.error("Lỗi fetch users:", err);
    }
  };

  useEffect(() => { fetchUsers(); }, [showDeleted, filterRole, sortOrder, search]);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await createUser(form);
      Swal.fire({ icon: "success", title: "Thêm thành công", timer: 1500, showConfirmButton: false });
      setShowAdd(false);
      setForm({ name: "", email: "", password: "", phone: "", role: "user" });
      fetchUsers();
    } catch (err) {
      Swal.fire({ icon: "error", title: "Lỗi", text: err.response?.data?.message || "Lỗi server" });
    }
  };

  const openEdit = (user) => {
    setEditUser(user);
    setForm({ name: user.name, phone: user.phone || "", role: user.role });
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      await updateUser(editUser._id, { name: form.name, phone: form.phone, role: form.role });
      Swal.fire({ icon: "success", title: "Cập nhật thành công", timer: 1500, showConfirmButton: false });
      setEditUser(null);
      fetchUsers();
    } catch (err) {
      Swal.fire({ icon: "error", title: "Lỗi", text: err.response?.data?.message || "Lỗi server" });
    }
  };

  const handleSoftDelete = async (id) => {
    const result = await Swal.fire({
      title: "Chuyển vào thùng rác?", icon: "warning",
      showCancelButton: true, confirmButtonColor: "#ef4444",
      confirmButtonText: "Xóa", cancelButtonText: "Hủy",
    });
    if (!result.isConfirmed) return;
    try {
      await softDeleteUser(id);
      fetchUsers();
    } catch (err) {
      Swal.fire({ icon: "error", title: "Lỗi", text: err.response?.data?.message || "Lỗi server" });
    }
  };

  const handleRestore = async (id) => {
    await restoreUser(id);
    fetchUsers();
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Xóa vĩnh viễn?", text: "Không thể khôi phục!", icon: "warning",
      showCancelButton: true, confirmButtonColor: "#ef4444",
      confirmButtonText: "Xóa vĩnh viễn", cancelButtonText: "Hủy",
    });
    if (!result.isConfirmed) return;
    try {
      await deleteUser(id);
      fetchUsers();
    } catch (err) {
      Swal.fire({ icon: "error", title: "Lỗi", text: err.response?.data?.message || "Lỗi server" });
    }
  };

  const isSelf = (userId) => currentUser?._id === userId;

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white rounded-2xl shadow p-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-700">
            {showDeleted ? "🗑 Thùng rác" : "Danh sách Users"}
          </h2>
          <div className="flex gap-3">
            {!showDeleted && (
              <>
                <input
                  type="text" placeholder="Tìm kiếm..."
                  className="bg-gray-100 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-300"
                  value={search} onChange={(e) => setSearch(e.target.value)}
                />
                <button onClick={() => setShowAdd(true)} className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-1.5 rounded-lg transition">
                  + Thêm User
                </button>
              </>
            )}
            <button
              onClick={() => setShowDeleted(!showDeleted)}
              className={`text-sm px-4 py-1.5 rounded-lg transition border ${showDeleted ? "bg-gray-100 text-gray-600 border-gray-200" : "text-red-400 border-red-200 hover:bg-red-50"}`}
            >
              {showDeleted ? "← Quay lại" : "🗑 Thùng rác"}
            </button>
          </div>
        </div>

        {/* Filter */}
        {!showDeleted && (
          <div className="flex gap-3 mb-4">
            <select className="border rounded-lg px-3 py-1.5 text-sm outline-none" value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
              <option value="all">Tất cả Role</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
            <select className="border rounded-lg px-3 py-1.5 text-sm outline-none" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
              <option value="newest">Mới nhất</option>
              <option value="oldest">Cũ nhất</option>
            </select>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="text-gray-500 border-b">
                <th className="py-2">Tên</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th className="text-right">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-6 text-gray-400">Không có dữ liệu</td></tr>
              ) : (
                users.map((user) => (
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
                          <button onClick={() => openEdit(user)} className="text-blue-500 hover:underline">Sửa</button>
                          {/* ✅ Ẩn nút Xóa nếu là chính mình */}
                          {!isSelf(user._id) && (
                            <button onClick={() => handleSoftDelete(user._id)} className="text-red-500 hover:underline">Xóa</button>
                          )}
                        </>
                      ) : (
                        <>
                          <button onClick={() => handleRestore(user._id)} className="text-green-500 hover:underline">Khôi phục</button>
                          <button onClick={() => handleDelete(user._id)} className="text-red-500 hover:underline">Xóa vĩnh viễn</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Thêm */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-[400px] shadow-xl">
            <h3 className="text-lg font-bold mb-4">Thêm User</h3>
            <form onSubmit={handleAdd} className="space-y-3">
              <input required placeholder="Họ tên" className="w-full border rounded-lg px-3 py-2 text-sm" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <input required type="email" placeholder="Email" className="w-full border rounded-lg px-3 py-2 text-sm" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              <input required type="password" placeholder="Mật khẩu" className="w-full border rounded-lg px-3 py-2 text-sm" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
              <input placeholder="Số điện thoại" className="w-full border rounded-lg px-3 py-2 text-sm" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              <select className="w-full border rounded-lg px-3 py-2 text-sm" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg text-sm">Thêm</button>
                <button type="button" onClick={() => setShowAdd(false)} className="flex-1 bg-gray-100 hover:bg-gray-200 py-2 rounded-lg text-sm">Hủy</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Sửa */}
      {editUser && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-[400px] shadow-xl">
            <h3 className="text-lg font-bold mb-4">Sửa User — {editUser.name}</h3>
            <form onSubmit={handleEdit} className="space-y-3">
              <input required placeholder="Họ tên" className="w-full border rounded-lg px-3 py-2 text-sm" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <input placeholder="Số điện thoại" className="w-full border rounded-lg px-3 py-2 text-sm" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              <select
                className="w-full border rounded-lg px-3 py-2 text-sm"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                // ✅ Disable nếu đang sửa chính mình
                disabled={isSelf(editUser._id)}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              {isSelf(editUser._id) && (
                <p className="text-xs text-orange-500">Bạn không thể tự thay đổi role của mình</p>
              )}
              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg text-sm">Lưu</button>
                <button type="button" onClick={() => setEditUser(null)} className="flex-1 bg-gray-100 hover:bg-gray-200 py-2 rounded-lg text-sm">Hủy</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};