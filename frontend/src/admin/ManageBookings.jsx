import React, { useEffect, useState } from "react";
import API from "../services/api";
import Swal from "sweetalert2";

const statusConfig = {
  pending:   { label: "Chờ thanh toán", color: "bg-yellow-100 text-yellow-700" },
  confirmed: { label: "Đã thanh toán",  color: "bg-green-100 text-green-700"  },
  cancelled: { label: "Đã hủy",       color: "bg-red-100 text-red-500"      },
};

export const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sort, setSort] = useState("newest");

  const fetchBookings = async () => {
    try {
      const res = await API.get("/bookings");
      setBookings(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      await API.put(`/bookings/${id}/status`, { status });
      setBookings(bookings.map(b => b._id === id ? { ...b, status } : b));
      Swal.fire({ icon: "success", title: "Cập nhật thành công", timer: 1200, showConfirmButton: false });
    } catch (err) {
      Swal.fire({ icon: "error", title: "Lỗi", text: err.response?.data?.message || "Lỗi server" });
    }
  };

  const filtered = bookings
    .filter(b => {
      const matchStatus = filterStatus === "all" || b.status === filterStatus;
      const matchSearch = search
        ? b.userId?.name?.toLowerCase().includes(search.toLowerCase()) ||
          b.tourId?.title?.toLowerCase().includes(search.toLowerCase())
        : true;
      return matchStatus && matchSearch;
    })
    .sort((a, b) => sort === "newest"
      ? new Date(b.createdAt) - new Date(a.createdAt)
      : new Date(a.createdAt) - new Date(b.createdAt)
    );

  // Thống kê nhanh
  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === "pending").length,
    confirmed: bookings.filter(b => b.status === "confirmed").length,
    cancelled: bookings.filter(b => b.status === "cancelled").length,
    revenue: bookings.filter(b => b.status === "confirmed").reduce((sum, b) => sum + b.totalPrice, 0),
  };

  return (
    <div className="flex flex-col gap-6">

      {/* Thống kê */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Tổng booking", value: stats.total, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Chờ thanh toán", value: stats.pending, color: "text-yellow-600", bg: "bg-yellow-50" },
          { label: "Đã thanh toán", value: stats.confirmed, color: "text-green-600", bg: "bg-green-50" },
          { label: "Doanh thu", value: stats.revenue.toLocaleString("vi-VN") + "đ", color: "text-purple-600", bg: "bg-purple-50" },
        ].map((s) => (
          <div key={s.label} className={`${s.bg} rounded-2xl p-4`}>
            <p className="text-xs text-gray-500 mb-1">{s.label}</p>
            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-700">Danh sách Bookings</h2>
          <input type="text" placeholder="Tìm theo tên / tour..." className="bg-gray-100 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-300 w-56" value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        {/* Filter */}
        <div className="flex gap-3 mb-4">
          <select className="border rounded-lg px-3 py-1.5 text-sm outline-none" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="all">Tất cả trạng thái</option>
            <option value="pending">Chờ thanh toán</option>
            <option value="confirmed">Đã thanh toán</option>
            <option value="cancelled">Đã hủy</option>
          </select>
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
                <th className="py-2">Khách hàng</th>
                <th>Tour</th>
                <th>Số người</th>
                <th>Tổng tiền</th>
                <th>Ngày đặt</th>
                <th>Trạng thái</th>
                <th className="text-right">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-6 text-gray-400">Không có dữ liệu</td></tr>
              ) : filtered.map((booking) => (
                <tr key={booking._id} className="border-b hover:bg-gray-50">
                  <td className="py-2">
                    <div className="flex items-center gap-2">
                      <img
                        src={booking.userId?.avatar || `https://ui-avatars.com/api/?name=${booking.userId?.name}&background=random`}
                        className="w-7 h-7 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium text-gray-700">{booking.userId?.name}</p>
                        <p className="text-xs text-gray-400">{booking.userId?.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="max-w-[160px]">
                    <p className="line-clamp-1 text-gray-700">{booking.tourId?.title}</p>
                    <p className="text-xs text-gray-400">{booking.tourId?.location}</p>
                  </td>
                  <td className="text-center">{booking.numberOfPeople}</td>
                  <td className="text-blue-600 font-medium">{booking.totalPrice?.toLocaleString("vi-VN")}đ</td>
                  <td className="text-gray-500">{new Date(booking.bookingDate).toLocaleDateString("vi-VN")}</td>
                  <td>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig[booking.status]?.color}`}>
                      {statusConfig[booking.status]?.label}
                    </span>
                  </td>
                  <td className="text-right">
                    {booking.status === "pending" && (
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => handleUpdateStatus(booking._id, "confirmed")}
                          className="text-xs bg-green-50 text-green-600 border border-green-200 px-2 py-1 rounded hover:bg-green-100 transition"
                        >
                          Xác nhận
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(booking._id, "cancelled")}
                          className="text-xs bg-red-50 text-red-500 border border-red-200 px-2 py-1 rounded hover:bg-red-100 transition"
                        >
                          Hủy
                        </button>
                      </div>
                    )}
                    {booking.status !== "pending" && (
                      <span className="text-xs text-gray-300">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};