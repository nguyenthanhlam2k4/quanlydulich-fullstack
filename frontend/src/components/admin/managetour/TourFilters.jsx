export const TourFilters = ({ search, setSearch, sort, setSort, onAddClick }) => (
  <>
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-xl font-bold text-gray-700">Danh sách Tours</h2>
      <div className="flex gap-3">
        <input type="text" placeholder="Tìm kiếm..."
          className="bg-gray-100 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-300"
          value={search} onChange={e => setSearch(e.target.value)} />
        <button onClick={onAddClick} className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-1.5 rounded-lg transition">
          + Thêm Tour
        </button>
      </div>
    </div>
    <div className="flex gap-3 mb-4">
      <select className="border rounded-lg px-3 py-1.5 text-sm outline-none" value={sort} onChange={e => setSort(e.target.value)}>
        <option value="newest">Mới nhất</option>
        <option value="oldest">Cũ nhất</option>
      </select>
    </div>
  </>
)