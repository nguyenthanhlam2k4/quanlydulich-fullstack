import { useState } from "react";
import { login, register } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const { setToken, setUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let res;
      if (isLogin) {
        res = await login({ email: form.email, password: form.password });
      } else {
        res = await register({ name: form.name, email: form.email, password: form.password });
      }

      // lưu vào context → tự động update localStorage
      setToken(res.data.token);
      setUser(res.data.user);

      alert(res.data.message);

      if (res.data.user.role === "admin") navigate("/admin");
      else navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Lỗi server");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-[350px]">
        <h2 className="text-2xl font-bold text-center mb-6">
          {isLogin ? "Đăng nhập" : "Đăng ký"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <input
              type="text"
              name="name"
              placeholder="Họ tên"
              value={form.name}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
          />
          <input
            type="password"
            name="password"
            placeholder="Mật khẩu"
            value={form.password}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
          >
            {isLogin ? "Đăng nhập" : "Đăng ký"}
          </button>
        </form>
        <p className="text-center mt-4 text-sm">
          {isLogin ? "Chưa có tài khoản?" : "Đã có tài khoản?"}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-500 ml-1"
          >
            {isLogin ? "Đăng ký" : "Đăng nhập"}
          </button>
        </p>
      </div>
    </div>
  );
}