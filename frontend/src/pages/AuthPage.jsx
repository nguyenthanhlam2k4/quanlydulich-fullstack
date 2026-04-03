import { useState } from "react";
import { login, register } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { FaCarAlt, FaEnvelope, FaLock, FaUser, FaEye, FaEyeSlash, FaArrowLeft } from "react-icons/fa";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { setToken, setUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      let res;
      if (isLogin) {
        res = await login({ email: form.email, password: form.password });
      } else {
        res = await register({ name: form.name, email: form.email, password: form.password });
      }
      setToken(res.data.token);
      setUser(res.data.user);
      if (res.data.user.role === "admin") navigate("/admin");
      else navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Lỗi server");
    }
    setLoading(false);
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setError("");
    setForm({ name: "", email: "", password: "" });
  };

  return (
    <div className="min-h-screen flex">

      {/* ── LEFT PANEL ── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-blue-600 flex-col items-center justify-center p-12">
        {/* Back button */}
        <button
          onClick={() => navigate("/")}
          className="absolute top-6 left-6 z-20 flex items-center gap-2 text-white/80 hover:text-white text-sm font-medium transition"
        >
          <FaArrowLeft className="text-xs" />
          Về trang chủ
        </button>

        {/* Background circles */}
        <div className="absolute top-[-80px] left-[-80px] w-80 h-80 rounded-full bg-blue-500 opacity-50" />
        <div className="absolute bottom-[-60px] right-[-60px] w-64 h-64 rounded-full bg-blue-700 opacity-60" />
        <div className="absolute top-1/2 right-[-40px] w-40 h-40 rounded-full bg-blue-400 opacity-30" />

        <div className="relative z-10 text-white text-center">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-10">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3">
              <FaCarAlt className="text-4xl text-white" />
            </div>
            <span className="text-5xl font-black tracking-tight">TrIP</span>
          </div>

          <h2 className="text-3xl font-bold mb-4 leading-snug">
            Khám phá thế giới<br/>theo cách của bạn
          </h2>
          <p className="text-blue-100 text-lg max-w-sm mx-auto leading-relaxed">
            Hàng nghìn tour hấp dẫn đang chờ bạn. Đăng ký ngay để bắt đầu hành trình.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mt-12">
            {[
              { num: "500+", label: "Tour" },
              { num: "10K+", label: "Khách hàng" },
              { num: "50+", label: "Điểm đến" },
            ].map((s) => (
              <div key={s.label} className="bg-white/15 backdrop-blur-sm rounded-2xl p-4">
                <p className="text-2xl font-black">{s.num}</p>
                <p className="text-blue-200 text-sm mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 px-6 py-12">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="flex items-center justify-center gap-2 mb-8 lg:hidden">
            <FaCarAlt className="text-blue-600 text-3xl" />
            <span className="text-3xl font-black text-blue-600">TrIP</span>
          </div>

          {/* Card */}
          <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/80 p-8">

            {/* Header */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">
                {isLogin ? "Chào mừng trở lại! 👋" : "Tạo tài khoản mới"}
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                {isLogin
                  ? "Đăng nhập để tiếp tục hành trình của bạn"
                  : "Điền thông tin để bắt đầu khám phá"}
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl mb-5">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Name (register only) */}
              {!isLogin && (
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Họ tên</label>
                  <div className="relative">
                    <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 text-sm" />
                    <input
                      type="text"
                      name="name"
                      placeholder="Nguyễn Văn A"
                      value={form.name}
                      onChange={handleChange}
                      required
                      className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition bg-gray-50 focus:bg-white"
                    />
                  </div>
                </div>
              )}

              {/* Email */}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Email</label>
                <div className="relative">
                  <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 text-sm" />
                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition bg-gray-50 focus:bg-white"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Mật khẩu</label>
                <div className="relative">
                  <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 text-sm" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={handleChange}
                    required
                    className="w-full pl-11 pr-12 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition bg-gray-50 focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                  >
                    {showPassword ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.98] disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-all duration-150 mt-2 text-sm shadow-lg shadow-blue-200"
              >
                {loading
                  ? "Đang xử lý..."
                  : isLogin ? "Đăng nhập" : "Tạo tài khoản"
                }
              </button>
            </form>

            {/* Switch */}
            <p className="text-center text-sm text-gray-500 mt-6">
              {isLogin ? "Chưa có tài khoản?" : "Đã có tài khoản?"}
              <button
                onClick={switchMode}
                className="text-blue-600 font-semibold ml-1 hover:underline"
              >
                {isLogin ? "Đăng ký ngay" : "Đăng nhập"}
              </button>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}