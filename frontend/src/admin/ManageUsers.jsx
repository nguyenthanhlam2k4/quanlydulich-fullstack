import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { UserFilters } from '../components/admin/manageuser/UserFilters'
import { UserTable } from '../components/admin/manageuser/UserTable'
import { AddUserModal, EditUserModal } from '../components/admin/manageuser/UserModal'
import { getUsers, createUser, updateUser, softDeleteUser, restoreUser, deleteUser } from '../services/userService'
import Swal from 'sweetalert2'

export const ManageUsers = () => {
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState("")
  const [filterRole, setFilterRole] = useState("all")
  const [sortOrder, setSortOrder] = useState("newest")
  const [showDeleted, setShowDeleted] = useState(false)
  const [showAdd, setShowAdd] = useState(false)
  const [editUser, setEditUser] = useState(null)
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "", role: "user" })

  const fetchUsers = async () => {
    try { const res = await getUsers({ deleted: showDeleted, role: filterRole, sort: sortOrder, search }); setUsers(res.data) }
    catch (err) { console.error(err) }
  }
  useEffect(() => { fetchUsers() }, [showDeleted, filterRole, sortOrder, search])

  const isSelf = (userId) => currentUser?._id === userId

  const handleAdd = async (e) => {
    e.preventDefault()
    try {
      await createUser(form)
      Swal.fire({ icon: "success", title: "Thêm thành công", timer: 1500, showConfirmButton: false })
      setShowAdd(false); setForm({ name: "", email: "", password: "", phone: "", role: "user" }); fetchUsers()
    } catch (err) { Swal.fire({ icon: "error", title: "Lỗi", text: err.response?.data?.message }) }
  }

  const openEdit = (user) => { setEditUser(user); setForm({ name: user.name, phone: user.phone || "", role: user.role }) }

  const handleEdit = async (e) => {
    e.preventDefault()
    try {
      await updateUser(editUser._id, { name: form.name, phone: form.phone, role: form.role })
      Swal.fire({ icon: "success", title: "Cập nhật thành công", timer: 1500, showConfirmButton: false })
      setEditUser(null); fetchUsers()
    } catch (err) { Swal.fire({ icon: "error", title: "Lỗi", text: err.response?.data?.message }) }
  }

  const handleSoftDelete = async (id) => {
    const result = await Swal.fire({ title: "Chuyển vào thùng rác?", icon: "warning", showCancelButton: true, confirmButtonColor: "#ef4444", confirmButtonText: "Xóa", cancelButtonText: "Hủy" })
    if (!result.isConfirmed) return
    try { await softDeleteUser(id); fetchUsers() }
    catch (err) { Swal.fire({ icon: "error", title: "Lỗi", text: err.response?.data?.message }) }
  }

  const handleRestore = async (id) => { await restoreUser(id); fetchUsers() }

  const handleDelete = async (id) => {
    const result = await Swal.fire({ title: "Xóa vĩnh viễn?", icon: "warning", showCancelButton: true, confirmButtonColor: "#ef4444", confirmButtonText: "Xóa vĩnh viễn", cancelButtonText: "Hủy" })
    if (!result.isConfirmed) return
    try { await deleteUser(id); fetchUsers() }
    catch (err) { Swal.fire({ icon: "error", title: "Lỗi", text: err.response?.data?.message }) }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white rounded-2xl shadow p-6">
        <UserFilters search={search} setSearch={setSearch} filterRole={filterRole} setFilterRole={setFilterRole}
          sortOrder={sortOrder} setSortOrder={setSortOrder} showDeleted={showDeleted} setShowDeleted={setShowDeleted}
          onAddClick={() => setShowAdd(true)} />
        <UserTable users={users} showDeleted={showDeleted} isSelf={isSelf}
          onEdit={openEdit} onSoftDelete={handleSoftDelete} onRestore={handleRestore} onDelete={handleDelete} />
      </div>
      {showAdd && <AddUserModal form={form} setForm={setForm} onSubmit={handleAdd} onClose={() => setShowAdd(false)} />}
      {editUser && <EditUserModal editUser={editUser} form={form} setForm={setForm} isSelf={isSelf} onSubmit={handleEdit} onClose={() => setEditUser(null)} />}
    </div>
  )
}