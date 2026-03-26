// src/admin/Dashboard.jsx
import React, { useState } from "react";
import { Navbar } from "../components/admin/Navbar";
import { ManageUsers } from "./ManageUsers";
import { ManageTours } from "./ManageTours";
import { ManageBookings } from "./ManageBookings";
import ProfilePage from "../pages/ProfilePage";
import { useAuth } from "../contexts/AuthContext";

const pages = {
  Users: <ManageUsers />,
  Tours: <ManageTours />,
  Bookings: <ManageBookings />,
};

export const Dashboard = () => {
  const [active, setActive] = useState("Users");
  const { user } = useAuth();

  return (
    <div className="flex h-screen">
      <Navbar active={active} setActive={setActive} />

      <div className="flex-1 flex flex-col bg-gray-100">
        {/* Header */}
        <div className="flex px-5 py-6 items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-700">
            Admin Panel
          </h1>

          <img
            src={
              user?.avatar ||
              `https://ui-avatars.com/api/?name=${user?.name}&background=0D8ABC&color=fff`
            }
            alt="avatar"
            className="rounded-full w-10 h-10 object-cover"
          />
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-auto">
          {active === "Profile" ? (
            <ProfilePage id={user._id} />
          ) : (
            pages[active] || <p className="text-gray-400">Chọn menu</p>
          )}
        </div>
      </div>
    </div>
  );
};