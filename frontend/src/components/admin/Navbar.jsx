import React from 'react'
import { FaCarAlt, FaUser } from "react-icons/fa";
import { BiSolidGridAlt } from "react-icons/bi";
import { AiFillCalendar } from "react-icons/ai";
import { MdLogout } from "react-icons/md";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const menuItems = [
    { icon: <FaUser />, label: "Users" },
    { icon: <BiSolidGridAlt />, label: "Tours" },
    { icon: <AiFillCalendar />, label: "Bookings" },
];

export const Navbar = ({ active, setActive }) => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        const result = await Swal.fire({
            title: "Bạn có muốn đăng xuất?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#ef4444",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Đăng xuất",
            cancelButtonText: "Hủy",
        });

        if (!result.isConfirmed) return;

        // ✅ UI-only: chỉ chuyển trang
        navigate("/login");
    };

    return (
        <div className="flex flex-col h-screen w-60 bg-white shadow-lg px-5 py-6">
            {/* Logo */}
            <div className="flex items-center gap-2 text-3xl font-bold text-blue-600 mb-8">
                <FaCarAlt />
                <span>TrIP</span>
            </div>

            <p className="text-xs text-gray-400 font-semibold tracking-widest mb-3">
                MAIN MENU
            </p>

            <div className="flex flex-col gap-1 flex-1">
                {menuItems.map((item) => (
                    <div
                        key={item.label}
                        onClick={() => setActive(item.label)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-colors duration-200
                        ${
                            active === item.label
                                ? "bg-blue-600 text-white"
                                : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                        }`}
                    >
                        <span className="text-lg">{item.icon}</span>
                        <p className="text-sm font-medium">{item.label}</p>
                    </div>
                ))}
            </div>

            {/* Logout */}
            <div
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-red-400 hover:bg-red-50 transition-colors duration-200"
            >
                <MdLogout className="text-lg" />
                <p className="text-sm font-medium">Log Out</p>
            </div>
        </div>
    );
};