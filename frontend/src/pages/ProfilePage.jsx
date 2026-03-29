import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Header } from "../components/users/Header";
import API from "../services/api";
import Swal from "sweetalert2";
import {
  FaUser, FaEnvelope, FaPhone, FaShieldAlt, FaCalendarAlt,
  FaEdit, FaCamera, FaBookmark, FaStar, FaMapMarkerAlt, FaClock, FaLock
} from "react-icons/fa";

const tabs = ["Thông tin", "Lịch sử đặt tour", "Đánh giá", "Đổi mật khẩu"];

export default function ProfilePage({ id: propId }) {
  const { id: paramId } = useParams();
  const id = propId || paramId;
  const { token, user, setUser } = useAuth();
  const navigate = useNavigate();

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Thông tin");
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "", avatarFile: null });
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [pwForm, setPwForm] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
  const [saving, setSaving] = useState(false);

  const isSelf = user?._id === id;

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await API.get(`/users/${id}`);
        setUserData(res.data);
        setFormData({ name: res.data.name, phone: res.data.phone || "", avatarFile: null });
      } catch {
        setUserData(null);
      } finally {
        setLoading(false);
      }
    };
    if (token && id) fetchAll();
    else setLoading(false);
  }, [id, token]);

  useEffect(() => {
    if (activeTab === "Lịch sử đặt tour" && isSelf) {
      API.get("/bookings/my").then(r => setBookings(r.data)).catch(() => setBookings([]));
    }
  }, [activeTab]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSave = async () => {
    setSaving(true);
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("phone", formData.phone);
      if (formData.avatarFile) data.append("avatar", formData.avatarFile);

      const res = await API.put(`/users/${id}`, data, { headers: { "Content-Type": "multipart/form-data" } });
      setUserData(res.data);
      if (isSelf) setUser(res.data);
      setEditing(false);
      Swal.fire({ icon: "success", title: "Cập nhật thành công!", timer: 1500, showConfirmButton: false });
    } catch (err) {
      Swal.fire({ icon: "error", title: "Lỗi", text: err.response?.data?.message || "Lỗi server" });
    }
    setSaving(false);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      return Swal.fire({ icon: "warning", title: "Mật khẩu không khớp!" });
    }
    if (pwForm.newPassword.length < 6) {
      return Swal.fire({ icon: "warning", title: "Mật khẩu tối thiểu 6 ký tự!" });
    }
    try {
      await API.put(`/users/${id}/password`, { oldPassword: pwForm.oldPassword, newPassword: pwForm.newPassword });
      Swal.fire({ icon: "success", title: "Đổi mật khẩu thành công!", timer: 1500, showConfirmButton: false });
      setPwForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      Swal.fire({ icon: "error", title: "Lỗi", text: err.response?.data?.message || "Lỗi server" });
    }
  };

  const statusConfig = {
    pending:   { label: "Chờ xác nhận", color: "bg-yellow-100 text-yellow-700" },
    confirmed: { label: "Đã xác nhận",  color: "bg-green-100 text-green-700"  },
    cancelled: { label: "Đã hủy",       color: "bg-red-100 text-red-500"      },
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center text-gray-400">Đang tải...</div>
  );
  if (!userData) return (
    <div className="min-h-screen flex items-center justify-center text-gray-400">Không tìm thấy người dùng</div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Cover + Avatar */}
      <div className="relative">
        <div className="h-40 bg-gray-50" />
        <div className="max-w-4xl mx-auto px-6">
          <div className="relative -mt-16 flex items-end gap-5 pb-4">
            {/* Avatar */}
            <div className="relative shrink-0">
              <img
                src={
                  formData.avatarFile
                    ? URL.createObjectURL(formData.avatarFile)
                    : userData.avatar || `https://ui-avatars.com/api/?name=${userData.name}&background=0D8ABC&color=fff&size=128`
                }
                className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-lg"
              />
              {editing && (
                <label className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-1.5 cursor-pointer hover:bg-blue-600 transition">
                  <FaCamera className="text-xs" />
                  <input type="file" accept="image/*" className="hidden" onChange={e => setFormData({ ...formData, avatarFile: e.target.files[0] })} />
                </label>
              )}
            </div>

            {/* Tên + role */}
            <div className="flex-1 pb-2">
              <h1 className="text-2xl font-bold text-gray-800">{userData.name}</h1>
              <span className={`inline-block text-xs px-2 py-0.5 rounded-full mt-1 ${userData.role === "admin" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"}`}>
                {userData.role === "admin" ? "Admin" : "Thành viên"}
              </span>
            </div>

            {/* Nút edit */}
            {isSelf && !editing && (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm transition mb-2"
              >
                <FaEdit /> Chỉnh sửa
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b bg-white sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 flex gap-1">
          {(isSelf ? tabs : ["Thông tin"]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition ${
                activeTab === tab
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">

        {/* ── Tab: Thông tin ── */}
        {activeTab === "Thông tin" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
              <h2 className="font-semibold text-gray-700 mb-2">Thông tin cá nhân</h2>

              {editing ? (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Họ tên</label>
                    <input name="name" value={formData.name} onChange={handleChange}
                      className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-300 outline-none" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Số điện thoại</label>
                    <input name="phone" value={formData.phone} onChange={handleChange}
                      className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-300 outline-none" />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button onClick={handleSave} disabled={saving}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white py-2 rounded-lg text-sm transition">
                      {saving ? "Đang lưu..." : "Lưu thay đổi"}
                    </button>
                    <button onClick={() => setEditing(false)}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 py-2 rounded-lg text-sm">
                      Hủy
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {[
                    { icon: <FaUser className="text-blue-400" />, label: "Họ tên", value: userData.name },
                    { icon: <FaEnvelope className="text-blue-400" />, label: "Email", value: userData.email },
                    { icon: <FaPhone className="text-blue-400" />, label: "Điện thoại", value: userData.phone || "Chưa cập nhật" },
                    { icon: <FaShieldAlt className="text-blue-400" />, label: "Vai trò", value: userData.role === "admin" ? "Quản trị viên" : "Thành viên" },
                    { icon: <FaCalendarAlt className="text-blue-400" />, label: "Ngày tham gia", value: new Date(userData.createdAt).toLocaleDateString("vi-VN") },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center shrink-0">{item.icon}</div>
                      <div>
                        <p className="text-xs text-gray-400">{item.label}</p>
                        <p className="text-sm text-gray-700 font-medium">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Stats card */}
            <div className="space-y-4">
              {[
                { icon: <FaBookmark className="text-blue-500" />, label: "Tổng booking", value: bookings.length || "—", bg: "bg-blue-50" },
                { icon: <FaStar className="text-yellow-400" />, label: "Đánh giá đã viết", value: reviews.length || "—", bg: "bg-yellow-50" },
              ].map((s) => (
                <div key={s.label} className={`${s.bg} rounded-2xl p-5 flex items-center gap-4`}>
                  <div className="text-2xl">{s.icon}</div>
                  <div>
                    <p className="text-xs text-gray-500">{s.label}</p>
                    <p className="text-2xl font-bold text-gray-700">{s.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Tab: Lịch sử đặt tour ── */}
        {activeTab === "Lịch sử đặt tour" && (
          <div className="space-y-4">
            {bookings.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <FaBookmark className="text-4xl mx-auto mb-3 text-gray-200" />
                <p>Chưa có booking nào</p>
                <button onClick={() => navigate("/")} className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-full text-sm hover:bg-blue-600 transition">
                  Khám phá tour
                </button>
              </div>
            ) : bookings.map((b) => (
              <div key={b._id} className="bg-white rounded-2xl shadow-sm overflow-hidden flex">
                <img src={b.tourId?.images?.[0] || `https://picsum.photos/seed/${b.tourId?._id}/200`} className="w-36 h-28 object-cover shrink-0" />
                <div className="flex-1 p-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1 cursor-pointer hover:text-blue-500"
                      onClick={() => navigate(`/tours/${b.tourId?._id}`)}>
                      {b.tourId?.title}
                    </h3>
                    <div className="flex gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><FaMapMarkerAlt className="text-blue-400" />{b.tourId?.location}</span>
                      <span className="flex items-center gap-1"><FaClock className="text-blue-400" />{b.tourId?.duration}</span>
                    </div>
                    <p className="text-blue-600 font-bold text-sm mt-1">{b.totalPrice?.toLocaleString("vi-VN")}đ</p>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full font-medium shrink-0 ${statusConfig[b.status]?.color}`}>
                    {statusConfig[b.status]?.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Tab: Đánh giá ── */}
        {activeTab === "Đánh giá" && (
          <div className="text-center py-16 text-gray-400">
            <FaStar className="text-4xl mx-auto mb-3 text-gray-200" />
            <p>Chưa có đánh giá nào</p>
          </div>
        )}

        {/* ── Tab: Đổi mật khẩu ── */}
        {activeTab === "Đổi mật khẩu" && (
          <div className="max-w-md">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center gap-2 mb-5">
                <FaLock className="text-blue-500" />
                <h2 className="font-semibold text-gray-700">Đổi mật khẩu</h2>
              </div>
              <form onSubmit={handleChangePassword} className="space-y-4">
                {[
                  { name: "oldPassword", label: "Mật khẩu hiện tại" },
                  { name: "newPassword", label: "Mật khẩu mới" },
                  { name: "confirmPassword", label: "Xác nhận mật khẩu mới" },
                ].map((f) => (
                  <div key={f.name}>
                    <label className="text-xs text-gray-500 mb-1 block">{f.label}</label>
                    <input
                      type="password" name={f.name} value={pwForm[f.name]}
                      onChange={e => setPwForm({ ...pwForm, [e.target.name]: e.target.value })}
                      className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-300 outline-none"
                    />
                  </div>
                ))}
                <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg text-sm transition mt-2">
                  Cập nhật mật khẩu
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}