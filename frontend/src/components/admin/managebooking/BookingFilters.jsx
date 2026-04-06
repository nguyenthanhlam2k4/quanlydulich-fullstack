export const BookingFilters = ({ search, setSearch, filterStatus, setFilterStatus, sort, setSort }) => (
  <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
    <h2 className="text-xl font-bold text-gray-700">Danh sách Bookings</h2>
    <div className="flex gap-3 flex-wrap">
      <input type="text" placeholder="Tìm theo tên / tour..."
        className="bg-gray-100 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-300 w-56"
        value={search} onChange={e => setSearch(e.target.value)} />
      <select className="border rounded-lg px-3 py-1.5 text-sm outline-none" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
        <option value="all">Tất cả trạng thái</option>
        <option value="pending">Chờ thanh toán</option>
        <option value="confirmed">Đã xác nhận</option>
        <option value="cancelled">Đã hủy</option>
      </select>
      <select className="border rounded-lg px-3 py-1.5 text-sm outline-none" value={sort} onChange={e => setSort(e.target.value)}>
        <option value="newest">Mới nhất</option>
        <option value="oldest">Cũ nhất</option>
      </select>
    </div>
  </div>
)