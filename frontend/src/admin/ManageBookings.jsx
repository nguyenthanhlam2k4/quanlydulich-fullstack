import { useEffect, useState } from 'react'
import { BookingStats } from '../components/admin/managebooking/BookingStats'
import { BookingFilters } from '../components/admin/managebooking/BookingFilters'
import { BookingTable } from '../components/admin/managebooking/BookingTable'
import API from '../services/api'
import Swal from 'sweetalert2'

export const ManageBookings = () => {
  const [bookings, setBookings] = useState([])
  const [search, setSearch] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [sort, setSort] = useState("newest")

  const fetchBookings = async () => {
    try { const res = await API.get("/bookings"); setBookings(res.data) }
    catch (err) { console.error(err) }
  }
  useEffect(() => { fetchBookings() }, [])

  const handleConfirm = async (id) => {
    const result = await Swal.fire({ title: "Xác nhận booking?", text: "Email kèm mã QR sẽ được gửi đến khách hàng.", icon: "question", showCancelButton: true, confirmButtonColor: "#22c55e", confirmButtonText: "Xác nhận & Gửi email", cancelButtonText: "Hủy" })
    if (!result.isConfirmed) return
    try {
      await API.put(`/bookings/${id}/status`, { status: "confirmed" })
      fetchBookings()
      Swal.fire({ icon: "success", title: "Đã xác nhận!", timer: 2000, showConfirmButton: false })
    } catch (err) { Swal.fire({ icon: "error", title: "Lỗi", text: err.response?.data?.message }) }
  }

  const handleCancel = async (id) => {
    const result = await Swal.fire({ title: "Hủy booking?", icon: "warning", showCancelButton: true, confirmButtonColor: "#ef4444", confirmButtonText: "Hủy booking", cancelButtonText: "Không" })
    if (!result.isConfirmed) return
    try { await API.put(`/bookings/${id}/status`, { status: "cancelled" }); fetchBookings() }
    catch (err) { Swal.fire({ icon: "error", title: "Lỗi", text: err.response?.data?.message }) }
  }

  const handleDelete = async (id) => {
    const result = await Swal.fire({ title: "Xóa booking?", icon: "warning", showCancelButton: true, confirmButtonColor: "#ef4444", confirmButtonText: "Xóa", cancelButtonText: "Hủy" })
    if (!result.isConfirmed) return
    try { await API.delete(`/bookings/${id}`); fetchBookings() }
    catch (err) { Swal.fire({ icon: "error", title: "Lỗi", text: err.response?.data?.message }) }
  }

  const filtered = bookings
    .filter(b => (filterStatus === "all" || b.status === filterStatus) &&
      (!search || b.userId?.name?.toLowerCase().includes(search.toLowerCase()) || b.tourId?.title?.toLowerCase().includes(search.toLowerCase())))
    .sort((a, b) => sort === "newest" ? new Date(b.createdAt) - new Date(a.createdAt) : new Date(a.createdAt) - new Date(b.createdAt))

  return (
    <div className="flex flex-col gap-6">
      <BookingStats bookings={bookings} />
      <div className="bg-white rounded-2xl shadow p-6">
        <BookingFilters search={search} setSearch={setSearch} filterStatus={filterStatus} setFilterStatus={setFilterStatus} sort={sort} setSort={setSort} />
        <BookingTable bookings={filtered} onConfirm={handleConfirm} onCancel={handleCancel} onDelete={handleDelete} />
      </div>
    </div>
  )
}