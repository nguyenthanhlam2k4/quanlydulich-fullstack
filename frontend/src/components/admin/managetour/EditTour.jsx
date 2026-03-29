import { useState, useEffect } from "react";
import API from "../../../services/api";
import Swal from "sweetalert2";

export const EditTour = ({ tour, onClose, onEdited }) => {
  const [form, setForm] = useState({
    title: "", description: "", price: "", location: "",
    duration: "", maxPeople: "", availableSlots: "",
  });
  const [schedule, setSchedule] = useState([{ day: 1, content: "" }]);
  const [imageFiles, setImageFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  // Điền sẵn dữ liệu cũ khi mở modal
  useEffect(() => {
    if (!tour) return;
    setForm({
      title: tour.title || "",
      description: tour.description || "",
      price: tour.price || "",
      location: tour.location || "",
      duration: tour.duration || "",
      maxPeople: tour.maxPeople || "",
      availableSlots: tour.availableSlots || "",
    });
    setSchedule(
      tour.schedule?.length > 0
        ? tour.schedule.map((s, i) => ({ day: i + 1, content: s.content }))
        : [{ day: 1, content: "" }]
    );
  }, [tour]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const addDay = () => setSchedule([...schedule, { day: schedule.length + 1, content: "" }]);
  const removeDay = (i) => setSchedule(schedule.filter((_, idx) => idx !== i).map((s, idx) => ({ ...s, day: idx + 1 })));
  const updateDay = (i, value) => {
    const updated = [...schedule];
    updated[i].content = value;
    setSchedule(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (v !== "") data.append(k, v); });
      data.append("schedule", JSON.stringify(schedule.filter(s => s.content)));
      imageFiles.forEach(f => data.append("images", f));

      await API.put(`/tours/${tour._id}`, data, { headers: { "Content-Type": "multipart/form-data" } });
      Swal.fire({ icon: "success", title: "Cập nhật thành công!", timer: 1500, showConfirmButton: false });
      onEdited();
      onClose();
    } catch (err) {
      Swal.fire({ icon: "error", title: "Lỗi", text: err.response?.data?.message || "Lỗi server" });
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 py-6 overflow-y-auto">
      <div className="bg-white rounded-2xl p-6 w-[540px] shadow-xl my-auto">
        <h3 className="text-lg font-bold mb-5 text-gray-700">Sửa Tour</h3>
        <form onSubmit={handleSubmit} className="space-y-3">

          <input name="title" required placeholder="Tên tour *" className="w-full border rounded-lg px-3 py-2 text-sm" value={form.title} onChange={handleChange} />

          <div className="grid grid-cols-2 gap-3">
            <input name="location" required placeholder="Địa điểm *" className="w-full border rounded-lg px-3 py-2 text-sm" value={form.location} onChange={handleChange} />
            <input name="price" required type="number" placeholder="Giá (VNĐ) *" className="w-full border rounded-lg px-3 py-2 text-sm" value={form.price} onChange={handleChange} />
            <input name="duration" placeholder="Thời gian (VD: 3N2Đ)" className="w-full border rounded-lg px-3 py-2 text-sm" value={form.duration} onChange={handleChange} />
            <input name="maxPeople" type="number" placeholder="Số người tối đa" className="w-full border rounded-lg px-3 py-2 text-sm" value={form.maxPeople} onChange={handleChange} />
            <input name="availableSlots" type="number" placeholder="Chỗ còn trống" className="col-span-2 w-full border rounded-lg px-3 py-2 text-sm" value={form.availableSlots} onChange={handleChange} />
          </div>

          <textarea name="description" placeholder="Mô tả tour" className="w-full border rounded-lg px-3 py-2 text-sm resize-none h-20" value={form.description} onChange={handleChange} />

          {/* Lịch trình */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">Lịch trình</label>
              <button type="button" onClick={addDay} className="text-xs text-blue-500 hover:underline">+ Thêm ngày</button>
            </div>
            <div className="space-y-2">
              {schedule.map((s, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-1">
                    {s.day}
                  </div>
                  <textarea
                    placeholder={`Nội dung ngày ${s.day}...`}
                    className="flex-1 border rounded-lg px-3 py-2 text-sm resize-none h-16"
                    value={s.content}
                    onChange={(e) => updateDay(i, e.target.value)}
                  />
                  {schedule.length > 1 && (
                    <button type="button" onClick={() => removeDay(i)} className="text-red-400 hover:text-red-600 text-lg mt-1">×</button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Ảnh */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Thay ảnh mới (bỏ qua nếu không đổi)</label>
            {tour?.images?.length > 0 && (
              <div className="flex gap-2 mb-2 flex-wrap">
                {tour.images.map((img, i) => (
                  <img key={i} src={img} className="w-14 h-14 rounded-lg object-cover border" />
                ))}
              </div>
            )}
            <input type="file" multiple accept="image/*" className="text-sm w-full" onChange={e => setImageFiles([...e.target.files])} />
            {imageFiles.length > 0 && <p className="text-xs text-gray-400 mt-1">Đã chọn {imageFiles.length} ảnh mới</p>}
          </div>

          <div className="flex gap-2 pt-2">
            <button type="submit" disabled={loading} className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white py-2 rounded-lg text-sm">
              {loading ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
            <button type="button" onClick={onClose} className="flex-1 bg-gray-100 hover:bg-gray-200 py-2 rounded-lg text-sm">Hủy</button>
          </div>
        </form>
      </div>
    </div>
  );
};