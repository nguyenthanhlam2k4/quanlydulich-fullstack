export const UserFilters = ({ search, setSearch, filterRole, setFilterRole, sortOrder, setSortOrder, showDeleted, setShowDeleted, onAddClick }) => (
  <>
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-xl font-bold text-gray-700">{showDeleted ? "🗑 Thùng rác" : "Danh sách Users"}</h2>
      <div className="flex gap-3">
        {!showDeleted && (
          <>
            <input type="text" placeholder="Tìm kiếm..."
              className="bg-gray-100 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-300"
              value={search} onChange={e => setSearch(e.target.value)} />
            <button onClick={onAddClick} className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-1.5 rounded-lg transition">
              + Thêm User
            </button>
          </>
        )}
        <button onClick={() => setShowDeleted(!showDeleted)}
          className={`text-sm px-4 py-1.5 rounded-lg transition border ${showDeleted ? "bg-gray-100 text-gray-600 border-gray-200" : "text-red-400 border-red-200 hover:bg-red-50"}`}>
          {showDeleted ? "← Quay lại" : "🗑 Thùng rác"}
        </button>
      </div>
    </div>
    {!showDeleted && (
      <div className="flex gap-3 mb-4">
        <select className="border rounded-lg px-3 py-1.5 text-sm outline-none" value={filterRole} onChange={e => setFilterRole(e.target.value)}>
          <option value="all">Tất cả Role</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>
        <select className="border rounded-lg px-3 py-1.5 text-sm outline-none" value={sortOrder} onChange={e => setSortOrder(e.target.value)}>
          <option value="newest">Mới nhất</option>
          <option value="oldest">Cũ nhất</option>
        </select>
      </div>
    )}
  </>
)