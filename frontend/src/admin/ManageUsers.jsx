import React, { useEffect, useState } from "react";
import { getUsers } from "../services/userService";
import { AddUser } from "../components/admin/manageuser/Adduser.jsx"

export const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [showDeleted, setShowDeleted] = useState(false);
  const [showAdd, setShowAdd] = useState(false);

  const fetchUsers = async () => {
    try {
      const res = await getUsers();
      setUsers(res.data);
    } catch (err) {
      console.error("ERROR USERS:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

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
                  type="text"
                  placeholder="Tìm kiếm..."
                  className="bg-gray-100 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-300"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />

                <button
                  onClick={() => setShowAdd(true)}
                  className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-1.5 rounded-lg transition"
                >
                  + Thêm User
                </button>
              </>
            )}

            <button
              onClick={() => setShowDeleted(!showDeleted)}
              className={`text-sm px-4 py-1.5 rounded-lg transition border ${showDeleted
                ? "bg-gray-100 text-gray-600 border-gray-200"
                : "text-red-400 border-red-200 hover:bg-red-50"
                }`}
            >
              {showDeleted ? "← Quay lại" : "🗑 Thùng rác"}
            </button>
          </div>
        </div>

        {/* Filter */}
        {!showDeleted && (
          <div className="flex gap-3 mb-4">
            <select
              className="border rounded-lg px-3 py-1.5 text-sm outline-none"
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
            >
              <option value="all">Tất cả Role</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>

            <select
              className="border rounded-lg px-3 py-1.5 text-sm outline-none"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="newest">Mới nhất</option>
              <option value="oldest">Cũ nhất</option>
            </select>
          </div>
        )}

        {/* Table UI */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="text-gray-500 border-b">
                <th className="py-2">Tên</th>
                <th>Email</th>
                <th>Role</th>
                <th className="text-right">Hành động</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b hover:bg-gray-50">
                  <td className="py-2">{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className="px-2 py-1 rounded bg-gray-100 text-xs">
                      {user.role}
                    </span>
                  </td>

                  <td className="text-right space-x-2">
                    {!showDeleted ? (
                      <>
                        <button className="text-blue-500 hover:underline">
                          Sửa
                        </button>
                        <button className="text-red-500 hover:underline">
                          Xóa
                        </button>
                      </>
                    ) : (
                      <>
                        <button className="text-green-500 hover:underline">
                          Khôi phục
                        </button>
                        <button className="text-red-500 hover:underline">
                          Xóa vĩnh viễn
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {
        showAdd && (
          <AddUser
          onClose={() => setShowAdd(false)}
          onAdded={fetchUsers} // ✅ dùng lại
        />
        )
      }
    </div>

  );

};