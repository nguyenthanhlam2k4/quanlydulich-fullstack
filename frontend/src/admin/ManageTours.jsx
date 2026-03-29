import React, { useEffect, useState } from "react";
import { AddTour } from "../components/admin/managetour/AddTour";
import { EditTour } from "../components/admin/managetour/EditTour";
import API from "../services/api";
import Swal from "sweetalert2";

export const ManageTours = () => {
  const [tours, setTours] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [showAdd, setShowAdd] = useState(false);
  const [editTour, setEditTour] = useState(null);

  const fetchTours = async () => {
    try {
      const res = await API.get("/tours");
      setTours(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchTours(); }, []);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Xóa tour này?", icon: "warning", showCancelButton: true,
      confirmButtonColor: "#ef4444", confirmButtonText: "Xóa", cancelButtonText: "Hủy",
    });
    if (!result.isConfirmed) return;
    try {
      await API.delete(`/tours/${id}`);
      fetchTours();
    } catch (err) {
      Swal.fire({ icon: "error", title: "Lỗi", text: err.response?.data?.message || "Lỗi server" });
    }
  };

  const filtered = tours
    .filter(t => !search ||
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.location.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => sort === "newest"
      ? new Date(b.createdAt) - new Date(a.createdAt)
      : new Date(a.createdAt) - new Date(b.createdAt)
    );

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white rounded-2xl shadow p-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-700">Danh sách Tours</h2>
          <div className="flex gap-3">
            <input
              type="text" placeholder="Tìm kiếm..."
              className="bg-gray-100 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-300"
              value={search} onChange={e => setSearch(e.target.value)}
            />
            <button onClick={() => setShowAdd(true)} className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-1.5 rounded-lg transition">
              + Thêm Tour
            </button>
          </div>
        </div>

        {/* Filter */}
        <div className="flex gap-3 mb-4">
          <select className="border rounded-lg px-3 py-1.5 text-sm outline-none" value={sort} onChange={e => setSort(e.target.value)}>
            <option value="newest">Mới nhất</option>
            <option value="oldest">Cũ nhất</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="text-gray-500 border-b">
                <th className="py-2">Tour</th>
                <th>Địa điểm</th>
                <th>Giá</th>
                <th>Chỗ trống</th>
                <th>Rating</th>
                <th className="text-right">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-6 text-gray-400">Không có dữ liệu</td></tr>
              ) : filtered.map((tour) => (
                <tr key={tour._id} className="border-b hover:bg-gray-50">
                  <td className="py-2">
                    <div className="flex items-center gap-2">
                      <img src={tour.images?.[0] || `https://picsum.photos/seed/${tour._id}/60/60`} className="w-10 h-10 rounded-lg object-cover" />
                      <span className="font-medium text-gray-700 line-clamp-1 max-w-[180px]">{tour.title}</span>
                    </div>
                  </td>
                  <td>{tour.location}</td>
                  <td className="text-blue-600 font-medium">{tour.price?.toLocaleString("vi-VN")}đ</td>
                  <td>
                    <span className={`px-2 py-1 rounded text-xs ${tour.availableSlots <= 5 ? "bg-red-100 text-red-600" : "bg-green-100 text-green-700"}`}>
                      {tour.availableSlots} chỗ
                    </span>
                  </td>
                  <td>⭐ {tour.rating || "—"}</td>
                  <td className="text-right space-x-2">
                    <button onClick={() => setEditTour(tour)} className="text-blue-500 hover:underline">Sửa</button>
                    <button onClick={() => handleDelete(tour._id)} className="text-red-500 hover:underline">Xóa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAdd && <AddTour onClose={() => setShowAdd(false)} onAdded={fetchTours} />}
      {editTour && <EditTour tour={editTour} onClose={() => setEditTour(null)} onEdited={fetchTours} />}
    </div>
  );
};