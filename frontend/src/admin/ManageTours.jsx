import { useEffect, useState } from 'react'
import { TourFilters } from '../components/admin/managetour/TourFilters'
import { TourTable } from '../components/admin/managetour/TourTable'
import { AddTour } from '../components/admin/managetour/AddTour'
import { EditTour } from '../components/admin/managetour/EditTour'
import API from '../services/api'
import Swal from 'sweetalert2'

export const ManageTours = () => {
  const [tours, setTours] = useState([])
  const [search, setSearch] = useState("")
  const [sort, setSort] = useState("newest")
  const [showAdd, setShowAdd] = useState(false)
  const [editTour, setEditTour] = useState(null)

  const fetchTours = async () => {
    try { const res = await API.get("/tours"); setTours(res.data) }
    catch (err) { console.error(err) }
  }
  useEffect(() => { fetchTours() }, [])

  const handleDelete = async (id) => {
    const result = await Swal.fire({ title: "Xóa tour này?", icon: "warning", showCancelButton: true, confirmButtonColor: "#ef4444", confirmButtonText: "Xóa", cancelButtonText: "Hủy" })
    if (!result.isConfirmed) return
    try { await API.delete(`/tours/${id}`); fetchTours() }
    catch (err) { Swal.fire({ icon: "error", title: "Lỗi", text: err.response?.data?.message }) }
  }

  const filtered = tours
    .filter(t => !search || t.title.toLowerCase().includes(search.toLowerCase()) || t.location.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sort === "newest" ? new Date(b.createdAt) - new Date(a.createdAt) : new Date(a.createdAt) - new Date(b.createdAt))

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white rounded-2xl shadow p-6">
        <TourFilters search={search} setSearch={setSearch} sort={sort} setSort={setSort} onAddClick={() => setShowAdd(true)} />
        <TourTable tours={filtered} onEdit={setEditTour} onDelete={handleDelete} />
      </div>
      {showAdd && <AddTour onClose={() => setShowAdd(false)} onAdded={fetchTours} />}
      {editTour && <EditTour tour={editTour} onClose={() => setEditTour(null)} onEdited={fetchTours} />}
    </div>
  )
}