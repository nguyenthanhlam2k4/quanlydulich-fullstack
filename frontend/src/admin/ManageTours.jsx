import React, { useEffect, useState } from "react";
import API from "../services/api";
import Swal from "sweetalert2";

export const ManageTours = () => {
  const [tours, setTours] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [showAdd, setShowAdd] = useState(false);
  const [editTour, setEditTour] = useState(null);
  const [form, setForm] = useState({
    title: "", description: "", price: "", location: "",
    duration: "", maxPeople: "", availableSlots: "", schedule: "",
  });
  const [imageFiles, setImageFiles] = useState([]);

  const fetchTours = async () => {
    try {
      const res = await API.get("/tours");
      let data = res.data;
      if (search) data = data.filter(t =>
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.location.toLowerCase().includes(search.toLowerCase())
      );
      if (sort === "oldest") data = [...data].reverse();
      setTours(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchTours(); }, [search, sort]);

  const resetForm = () => {
    setForm({ title: "", description: "", price: "", location: "", duration: "", maxPeople: "", availableSlots: "", schedule: "" });
    setImageFiles([]);
  };

  const buildFormData = () => {
    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => { if (v) data.append(k, v); });
    imageFiles.forEach(f => data.append("images", f));
    return data;
  };

  // ── ADD ──────────────────────────────────────────────
  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await API.post("/tours", buildFormData(), { headers: { "Content-Type": "multipart/form-data" } });
      Swal.fire({ icon: "success", title: "Thêm thành công", timer: 1500, showConfirmButton: false });
      setShowAdd(false); resetForm(); fetchTours();
    } catch (err) {
      Swal.fire({ icon: "error", title: "Lỗi", text: err.response?.data?.message || "Lỗi server" });
    }
  };

  // ── EDIT ─────────────────────────────────────────────
  const openEdit = (tour) => {
    setEditTour(tour);
    setForm({
      title: tour.title, description: tour.description || "",
      price: tour.price, location: tour.location,
      duration: tour.duration || "", maxPeople: tour.maxPeople || "",
      availableSlots: tour.availableSlots || "",
      schedule: tour.schedule ? JSON.stringify(tour.schedule) : "",
    });
    setImageFiles([]);
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/tours/${editTour._id}`, buildFormData(), { headers: { "Content-Type": "multipart/form-data" } });
      Swal.fire({ icon: "success", title: "Cập nhật thành công", timer: 1500, showConfirmButton: false });
      setEditTour(null); resetForm(); fetchTours();
    } catch (err) {
      Swal.fire({ icon: "error", title: "Lỗi", text: err.response?.data?.message || "Lỗi server" });
    }
  };

  // ── DELETE ────────────────────────────────────────────
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

  const TourForm = ({ onSubmit, title, onClose }) => (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 overflow-y-auto py-6">
      <div className="bg-white rounded-2xl p-6 w-[520px] shadow-xl">
        <h3 className="text-lg font-bold mb-4">{title}</h3>
        <form onSubmit={onSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <input required placeholder="Tên tour" className="col-span-2 w-full border rounded-lg px-3 py-2 text-sm" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
            <input required placeholder="Địa điểm" className="w-full border rounded-lg px-3 py-2 text-sm" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
            <input required type="number" placeholder="Giá (VNĐ)" className="w-full border rounded-lg px-3 py-2 text-sm" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
            <input placeholder="Thời gian (VD: 3 ngày 2 đêm)" className="w-full border rounded-lg px-3 py-2 text-sm" value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} />
            <input type="number" placeholder="Số người tối đa" className="w-full border rounded-lg px-3 py-2 text-sm" value={form.maxPeople} onChange={e => setForm({ ...form, maxPeople: e.target.value })} />
            <input type="number" placeholder="Chỗ còn trống" className="col-span-2 w-full border rounded-lg px-3 py-2 text-sm" value={form.availableSlots} onChange={e => setForm({ ...form, availableSlots: e.target.value })} />
          </div>
          <textarea placeholder="Mô tả tour" className="w-full border rounded-lg px-3 py-2 text-sm resize-none h-20" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          <textarea
            placeholder={`Lịch trình (JSON):\n[{"day":1,"content":"..."},{"day":2,"content":"..."}]`}
            className="w-full border rounded-lg px-3 py-2 text-sm resize-none h-24 font-mono text-xs"
            value={form.schedule} onChange={e => setForm({ ...form, schedule: e.target.value })}
          />
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Ảnh tour</label>
            <input type="file" multiple accept="image/*" onChange={e => setImageFiles([...e.target.files])} className="text-sm" />
            {imageFiles.length > 0 && <p className="text-xs text-gray-400 mt-1">Đã chọn {imageFiles.length} ảnh</p>}
          </div>
          <div className="flex gap-2 pt-2">
            <button type="submit" className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg text-sm">Lưu</button>
            <button type="button" onClick={onClose} className="flex-1 bg-gray-100 hover:bg-gray-200 py-2 rounded-lg text-sm">Hủy</button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white rounded-2xl shadow p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-700">Danh sách Tours</h2>
          <div className="flex gap-3">
            <input type="text" placeholder="Tìm kiếm..." className="bg-gray-100 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-300" value={search} onChange={e => setSearch(e.target.value)} />
            <button onClick={() => { resetForm(); setShowAdd(true); }} className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-1.5 rounded-lg transition">
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
              {tours.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-6 text-gray-400">Không có dữ liệu</td></tr>
              ) : tours.map((tour) => (
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
                    <button onClick={() => openEdit(tour)} className="text-blue-500 hover:underline">Sửa</button>
                    <button onClick={() => handleDelete(tour._id)} className="text-red-500 hover:underline">Xóa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAdd && <TourForm onSubmit={handleAdd} title="Thêm Tour" onClose={() => setShowAdd(false)} />}
      {editTour && <TourForm onSubmit={handleEdit} title={`Sửa: ${editTour.title}`} onClose={() => setEditTour(null)} />}
    </div>
  );
};