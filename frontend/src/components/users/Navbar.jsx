import React, { useState } from 'react';
import { FaCarAlt } from "react-icons/fa";
import { GrFormNext } from "react-icons/gr";
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [openDropdown, setOpenDropdown] = useState(false); // quản lý dropdown

    return (
        <nav className="bg-white shadow-md px-20 py-3 flex items-center justify-between">
            {/* Left: Logo + Search */}
            <div className="flex items-center space-x-6">
                <Link to="/" className="flex items-center text-3xl font-bold text-blue-600">
                    <FaCarAlt />
                    <span>TrIP</span>
                </Link>

                <div className="flex items-center border rounded-full overflow-hidden">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="px-3 py-2 outline-none w-80"
                    />
                    <button className="text-black px-3 py-1 flex items-center justify-center rounded-full text-2xl">
                        <GrFormNext className='hover:text-blue-600 transition cursor-pointer' />
                    </button>
                </div>
            </div>

            {/* Middle: Nav Links */}
            <div className="flex items-center space-x-6">
                <Link to="/" className="hover:text-blue-600 transition">Home</Link>
                <Link to="/contact" className="hover:text-blue-600 transition">Contact</Link>
                <Link to="/booked" className="hover:text-blue-600 transition">Booked</Link>
                <Link to="/about" className="hover:text-blue-600 transition">About</Link>
            </div>

            {/* Right: Login / User Dropdown */}
            <div className="flex items-center relative">
                {!user ? (
                    <button
                        className="bg-blue-500 text-white px-5 py-2 rounded-full cursor-pointer hover:bg-blue-400 transition"
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
                            {/* Avatar tròn */}
                            <img
                                src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=random`}
                                alt={user.name}
                                className="w-8 h-8 rounded-full object-cover border-2 border-white"
                            />
                            {/* Tên */}
                            <span className="font-medium">{user.name}</span>
                        </button>

                        {openDropdown && (
                            <div className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-lg z-50">
                                <button
                                    className="block w-full text-left px-4 py-2 hover:bg-blue-100"
                                    onClick={() => {
                                        navigate(`/profile/${user._id}`);
                                        setOpenDropdown(false);
                                    }}
                                >
                                    Profile
                                </button>
                                <button
                                    className="block w-full text-left px-4 py-2 hover:bg-blue-100"
                                    onClick={() => {
                                        logout();
                                        setOpenDropdown(false);
                                        navigate("/");
                                    }}
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
}