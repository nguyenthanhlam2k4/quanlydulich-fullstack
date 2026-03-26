import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

export const AddUser = ({ onClose, onAdded }) => {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        phone: "",
        role: "user",
    });
    const [avatar, setAvatar] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleAdd = async () => {
        if (!form.name || !form.email || !form.password) {
            return Swal.fire({ icon: "warning", title: "Nhập đầy đủ!" });
        }

        setLoading(true);
        try {
            const token = localStorage.getItem("token"); // bạn lưu token ở đây

            const data = new FormData();
            data.append("name", form.name);
            data.append("email", form.email);
            data.append("password", form.password);
            data.append("phone", form.phone);
            data.append("role", form.role);

            if (avatar) {
                data.append("avatar", avatar);
            }

            await axios.post("http://localhost:5000/api/users", data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            Swal.fire({
                icon: "success",
                title: "Thêm user thành công!",
                timer: 1500,
                showConfirmButton: false,
            });

            onAdded();
            onClose();

        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Lỗi!",
                text: err.response?.data?.message || err.message,
            });
        }
        setLoading(false);
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl p-6 w-80">
                <h3 className="text-lg font-bold mb-4 text-gray-700">
                    Thêm User
                </h3>

                <input
                    name="name"
                    placeholder="Tên"
                    className="w-full border rounded-lg px-3 py-2 mb-2 text-sm"
                    onChange={handleChange}
                />

                <input
                    name="email"
                    placeholder="Email"
                    className="w-full border rounded-lg px-3 py-2 mb-2 text-sm"
                    onChange={handleChange}
                />

                <input
                    name="password"
                    type="password"
                    placeholder="Mật khẩu"
                    className="w-full border rounded-lg px-3 py-2 mb-2 text-sm"
                    onChange={handleChange}
                />

                <input
                    name="phone"
                    placeholder="SĐT"
                    className="w-full border rounded-lg px-3 py-2 mb-2 text-sm"
                    onChange={handleChange}
                />

                <select
                    name="role"
                    className="w-full border rounded-lg px-3 py-2 mb-2 text-sm"
                    onChange={handleChange}
                >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                </select>

                {/* Upload avatar */}
                <input
                    type="file"
                    className="w-full mb-3 text-sm"
                    onChange={(e) => setAvatar(e.target.files[0])}
                />

                <div className="flex gap-2">
                    <button
                        onClick={handleAdd}
                        disabled={loading}
                        className="flex-1 bg-blue-500 text-white rounded-lg py-2 text-sm"
                    >
                        {loading ? "Đang thêm..." : "Thêm"}
                    </button>

                    <button
                        onClick={onClose}
                        className="flex-1 border rounded-lg py-2 text-sm"
                    >
                        Hủy
                    </button>
                </div>
            </div>
        </div>
    );
};