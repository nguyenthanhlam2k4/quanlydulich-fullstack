import { useState } from "react";
import API from "../../../services/api";
import Swal from "sweetalert2";

const PROVINCES = ["An Giang","Bà Rịa - Vũng Tàu","Bắc Giang","Bắc Kạn","Bạc Liêu","Bắc Ninh","Bến Tre","Bình Định","Bình Dương","Bình Phước","Bình Thuận","Cà Mau","Cần Thơ","Cao Bằng","Đà Nẵng","Đắk Lắk","Đắk Nông","Điện Biên","Đồng Nai","Đồng Tháp","Gia Lai","Hà Giang","Hà Nam","Hà Nội","Hà Tĩnh","Hải Dương","Hải Phòng","Hậu Giang","Hòa Bình","Hưng Yên","Khánh Hòa","Kiên Giang","Kon Tum","Lai Châu","Lâm Đồng","Lạng Sơn","Lào Cai","Long An","Nam Định","Nghệ An","Ninh Bình","Ninh Thuận","Phú Thọ","Phú Yên","Quảng Bình","Quảng Nam","Quảng Ngãi","Quảng Ninh","Quảng Trị","Sóc Trăng","Sơn La","Tây Ninh","Thái Bình","Thái Nguyên","Thanh Hóa","Thừa Thiên Huế","Tiền Giang","TP. Hồ Chí Minh","Trà Vinh","Tuyên Quang","Vĩnh Long","Vĩnh Phúc","Yên Bái"]

const emptyForm = { title: "", description: "", price: "", duration: "", maxPeople: "", availableSlots: "" }

export const AddTour = ({ onClose, onAdded }) => {
  const [form, setForm] = useState(emptyForm)
  const [selectedLocations, setSelectedLocations] = useState([])
  const [schedule, setSchedule] = useState([{ day: 1, content: "" }])
  const [imageFiles, setImageFiles] = useState([])
  const [loading, setLoading] = useState(false)

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const toggleLocation = (loc) => {
    setSelectedLocations(prev =>
      prev.includes(loc) ? prev.filter(l => l !== loc) : [...prev, loc]
    )
  }

  const addDay = () => setSchedule([...schedule, { day: schedule.length + 1, content: "" }])
  const removeDay = i => setSchedule(schedule.filter((_, idx) => idx !== i).map((s, idx) => ({ ...s, day: idx + 1 })))
  const updateDay = (i, value) => { const u = [...schedule]; u[i].content = value; setSchedule(u) }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (selectedLocations.length === 0) return Swal.fire({ icon: "warning", title: "Chọn ít nhất 1 tỉnh thành!" })
    setLoading(true)
    try {
      const data = new FormData()
      Object.entries(form).forEach(([k, v]) => { if (v) data.append(k, v) })
      data.append("locations", JSON.stringify(selectedLocations))
      data.append("schedule", JSON.stringify(schedule.filter(s => s.content)))
      imageFiles.forEach(f => data.append("images", f))
      await API.post("/tours", data, { headers: { "Content-Type": "multipart/form-data" } })
      Swal.fire({ icon: "success", title: "Thêm tour thành công!", timer: 1500, showConfirmButton: false })
      onAdded(); onClose()
    } catch (err) {
      Swal.fire({ icon: "error", title: "Lỗi", text: err.response?.data?.message || "Lỗi server" })
    }
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 py-6 overflow-y-auto">
      <div className="bg-white rounded-2xl p-6 w-[560px] shadow-xl my-auto">
        <h3 className="text-lg font-bold mb-5 text-gray-700">Thêm Tour Mới</h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input name="title" required placeholder="Tên tour *" className="w-full border rounded-lg px-3 py-2 text-sm" value={form.title} onChange={handleChange} />

          <div className="grid grid-cols-2 gap-3">
            <input name="price" required type="number" placeholder="Giá (VNĐ) *" className="w-full border rounded-lg px-3 py-2 text-sm" value={form.price} onChange={handleChange} />
            <input name="duration" placeholder="Thời gian (VD: 3N2Đ)" className="w-full border rounded-lg px-3 py-2 text-sm" value={form.duration} onChange={handleChange} />
            <input name="maxPeople" type="number" placeholder="Số người tối đa" className="w-full border rounded-lg px-3 py-2 text-sm" value={form.maxPeople} onChange={handleChange} />
            <input name="availableSlots" type="number" placeholder="Chỗ còn trống" className="w-full border rounded-lg px-3 py-2 text-sm" value={form.availableSlots} onChange={handleChange} />
          </div>

          <textarea name="description" placeholder="Mô tả tour" className="w-full border rounded-lg px-3 py-2 text-sm resize-none h-20" value={form.description} onChange={handleChange} />

          {/* Tỉnh thành */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Tỉnh thành *
              {selectedLocations.length > 0 && <span className="ml-2 text-blue-500 text-xs">({selectedLocations.join(", ")})</span>}
            </label>
            <div className="border rounded-xl p-3 max-h-40 overflow-y-auto">
              <div className="flex flex-wrap gap-2">
                {PROVINCES.map(loc => (
                  <button key={loc} type="button" onClick={() => toggleLocation(loc)}
                    className={`text-xs px-2.5 py-1 rounded-full border transition
                      ${selectedLocations.includes(loc) ? "bg-blue-500 text-white border-blue-500" : "border-gray-200 text-gray-600 hover:border-blue-300"}`}>
                    {loc}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Lịch trình */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">Lịch trình</label>
              <button type="button" onClick={addDay} className="text-xs text-blue-500 hover:underline">+ Thêm ngày</button>
            </div>
            <div className="space-y-2">
              {schedule.map((s, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-1">{s.day}</div>
                  <textarea placeholder={`Nội dung ngày ${s.day}...`} className="flex-1 border rounded-lg px-3 py-2 text-sm resize-none h-16"
                    value={s.content} onChange={e => updateDay(i, e.target.value)} />
                  {schedule.length > 1 && <button type="button" onClick={() => removeDay(i)} className="text-red-400 hover:text-red-600 text-lg mt-1">×</button>}
                </div>
              ))}
            </div>
          </div>

          {/* Ảnh */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Ảnh tour</label>
            <input type="file" multiple accept="image/*" className="text-sm w-full" onChange={e => setImageFiles([...e.target.files])} />
            {imageFiles.length > 0 && <p className="text-xs text-gray-400 mt-1">Đã chọn {imageFiles.length} ảnh</p>}
          </div>

          <div className="flex gap-2 pt-2">
            <button type="submit" disabled={loading} className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white py-2 rounded-lg text-sm">
              {loading ? "Đang thêm..." : "Thêm Tour"}
            </button>
            <button type="button" onClick={onClose} className="flex-1 bg-gray-100 hover:bg-gray-200 py-2 rounded-lg text-sm">Hủy</button>
          </div>
        </form>
      </div>
    </div>
  )
}