import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import Swal from "sweetalert2";

export default function ProfilePage({ id: propId }) {
  const { id: paramId } = useParams();
  const id = propId || paramId;

  const { token, user, setUser } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "", avatarFile: null });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(res.data);
        setFormData({ name: res.data.name, phone: res.data.phone || "", avatarFile: null });
      } catch (err) {
        console.error(err);
        setUserData(null);
      } finally {
        setLoading(false);
      }
    };

    if (token && id) fetchUser();
    else setLoading(false);
  }, [id, token]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setFormData({ ...formData, avatarFile: e.target.files[0] });

  const handleSave = async () => {
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("phone", formData.phone);
      if (formData.avatarFile) data.append("avatar", formData.avatarFile);

      const res = await axios.put(
        `http://localhost:5000/api/users/${id}`,
        data,
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } }
      );

      setUserData(res.data);

      // ✅ Nếu đang sửa chính mình → cập nhật user trong AuthContext + localStorage
      if (res.data._id === user._id) {
        setUser(res.data);
      }

      setEditing(false);
      Swal.fire({ icon: "success", title: "Đã lưu", text: "Thông tin đã được cập nhật." });
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: "error", title: "Lỗi", text: "Không thể cập nhật." });
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!userData) return <div className="p-6">User not found or not authorized</div>;

  return (
    <div className="max-w-xl mx-auto p-6 mt-10 bg-gradient-to-b from-blue-50 to-white shadow-lg rounded-xl">
      <div className="flex flex-col items-center">
        <img
          src={
            formData.avatarFile
              ? URL.createObjectURL(formData.avatarFile)
              : userData.avatar ||
                `https://ui-avatars.com/api/?name=${userData.name}&background=0D8ABC&color=fff`
          }
          alt={userData.name}
          className="w-32 h-32 rounded-full object-cover mb-4 border-4 border-blue-400 shadow-md"
        />
        {editing && <input type="file" accept="image/*" onChange={handleFileChange} className="mt-2" />}
      </div>

      <div className="mt-4 space-y-3 text-center">
        <div>
          <strong className="text-blue-700">Name: </strong>
          {editing ? (
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="border rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          ) : (
            <span className="text-gray-800">{userData.name}</span>
          )}
        </div>

        <div>
          <strong className="text-blue-700">Phone: </strong>
          {editing ? (
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="border rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          ) : (
            <span className="text-gray-800">{userData.phone || "Chưa có"}</span>
          )}
        </div>

        <div>
          <strong className="text-blue-700">Role: </strong>
          <span className={`px-2 py-1 rounded ${userData.role === "admin" ? "bg-blue-600 text-white" : "bg-blue-200 text-blue-800"}`}>
            {userData.role === "admin" ? "Admin" : "Thành viên"}
          </span>
        </div>

        <div>
          <strong className="text-blue-700">ID: </strong>
          <span className="text-gray-600">{userData._id}</span>
        </div>
      </div>

      {userData._id === user._id && (
        <div className="mt-6 flex justify-center space-x-4">
          {editing ? (
            <>
              <button onClick={handleSave} className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg transition">
                Save
              </button>
              <button onClick={() => setEditing(false)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-5 py-2 rounded-lg transition">
                Cancel
              </button>
            </>
          ) : (
            <button onClick={() => setEditing(true)} className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg transition">
              Edit Profile
            </button>
          )}
        </div>
      )}
    </div>
  );
}