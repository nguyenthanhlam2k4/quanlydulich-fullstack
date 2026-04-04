import React, { useState, useEffect } from 'react';
import { FaCarAlt, FaHeart } from "react-icons/fa";
import { GrFormNext } from "react-icons/gr";
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export const Header = ({ transparent = false }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [openDropdown, setOpenDropdown] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        if (!transparent) return;
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [transparent]);

    const isWhite = !transparent || scrolled;

    const handleBookedClick = () => {
        if (!user) navigate("/login");
        else navigate("/booked");
    };

    const handleFavoriteClick = () => {
        if (!user) navigate("/login");
        else navigate("/favorites");
    };

    return (
        <nav className={`${transparent ? "fixed" : "sticky"} top-0 left-0 right-0 z-50 px-20 py-3 flex items-center justify-between transition-all duration-300
            ${isWhite ? "bg-white shadow-md text-gray-700" : "bg-transparent text-white"}`}>

            {/* Logo + Search */}
            <div className="flex items-center space-x-6">
                <Link to="/" className={`flex items-center text-3xl font-bold transition-colors duration-300 ${isWhite ? "text-blue-600" : "text-white"}`}>
                    <FaCarAlt />
                    <span>TrIP</span>
                </Link>

                <div className={`flex items-center border rounded-full overflow-hidden transition-all duration-300
                    ${isWhite ? "border-gray-300 bg-white" : "border-white/50 bg-white/10 backdrop-blur-sm"}`}>
                    <input
                        type="text"
                        placeholder="Search..."
                        className={`px-3 py-2 outline-none w-80 bg-transparent ${isWhite ? "text-gray-700 placeholder-gray-400" : "text-white placeholder-white/70"}`}
                    />
                    <button className="px-3 py-1 flex items-center justify-center rounded-full text-2xl">
                        <GrFormNext className={`transition cursor-pointer ${isWhite ? "hover:text-blue-600" : "hover:text-blue-300"}`} />
                    </button>
                </div>
            </div>

            {/* Nav Links */}
            <div className="flex items-center space-x-6">
                {[
                    { label: "Home", path: "/" },
                    { label: "Contact", path: "/contact" },
                    { label: "About", path: "/about" },
                ].map((item) => (
                    <Link key={item.label} to={item.path}
                        className={`transition-colors duration-300 hover:text-blue-400 ${isWhite ? "text-gray-600" : "text-white"}`}>
                        {item.label}
                    </Link>
                ))}

                {/* Booked — redirect login nếu chưa đăng nhập */}
                <button
                    onClick={handleBookedClick}
                    className={`transition-colors duration-300 hover:text-blue-400 ${isWhite ? "text-gray-600" : "text-white"}`}>
                    Booked
                </button>
            </div>

            {/* Right */}
            <div className="flex items-center gap-3 relative">
                {/* Favorite icon */}
                <button
                    onClick={handleFavoriteClick}
                    className={`relative transition-colors duration-300 hover:text-red-400 ${isWhite ? "text-gray-500" : "text-white"}`}
                    title="Yêu thích"
                >
                    {/* <FaHeart className="text-xl" /> */}
                </button>

                {!user ? (
                    <button
                        className={`px-5 py-2 rounded-full cursor-pointer transition-all duration-300 font-medium
                            ${isWhite
                                ? "bg-blue-500 text-white hover:bg-blue-600"
                                : "bg-white/20 text-white border border-white/50 hover:bg-white/30 backdrop-blur-sm"
                            }`}
                        onClick={() => navigate("/login")}
                    >
                        Login
                    </button>
                ) : (
                    <div className="relative">
                        <button
                            className="bg-blue-500 text-white px-3 py-2 rounded-full cursor-pointer hover:bg-blue-400 transition flex items-center space-x-2"
                            onClick={() => setOpenDropdown(!openDropdown)}
                        >
                            <img
                                src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=random`}
                                alt={user.name}
                                className="w-8 h-8 rounded-full object-cover border-2 border-white"
                            />
                            <span className="font-medium">{user.name}</span>
                        </button>

                        {openDropdown && (
                            <div className="absolute right-0 mt-2 w-44 bg-white border rounded-xl shadow-lg z-50 overflow-hidden">
                                <button className="block w-full text-left px-4 py-2.5 text-gray-700 hover:bg-blue-50 text-sm"
                                    onClick={() => { navigate(`/profile/${user._id}`); setOpenDropdown(false); }}>
                                    👤 Profile
                                </button>
                                <button className="block w-full text-left px-4 py-2.5 text-gray-700 hover:bg-blue-50 text-sm"
                                    onClick={() => { navigate("/booked"); setOpenDropdown(false); }}>
                                    📋 Lịch sử đặt tour
                                </button>
                                <button className="block w-full text-left px-4 py-2.5 text-gray-700 hover:bg-blue-50 text-sm"
                                    onClick={() => { navigate("/favorites"); setOpenDropdown(false); }}>
                                    ❤️ Yêu thích
                                </button>
                                <hr className="my-1" />
                                <button className="block w-full text-left px-4 py-2.5 text-red-500 hover:bg-red-50 text-sm"
                                    onClick={() => { logout(); setOpenDropdown(false); navigate("/"); }}>
                                    🚪 Đăng xuất
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
}