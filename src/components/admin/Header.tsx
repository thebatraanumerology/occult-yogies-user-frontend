import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import menSvg from "../../assets/men.svg";
import Customers from "../svg/Customers";
import { Edit, LogOut, Settings } from "lucide-react";

const AdminHeader: React.FC = () => {
  const [openProfile, setOpenProfile] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setOpenProfile(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex justify-between border-b z-9 border-black/10 items-center sticky top-0 py-1 bg-lightYellow w-full px-5">
      <div className="flex gap-2 items-center">
        <Customers className="text-magenta w-7" />
        <span className="text-xl font-semibold">User Account List</span>
      </div>

      <div className="relative" ref={profileRef}>
        <div
          onClick={() => setOpenProfile(!openProfile)}
          className="flex flex-col items-center justify-center cursor-pointer"
        >
          <img
            src={menSvg}
            alt="Admin Profile"
            className="w-8 border border-bgYellow rounded-full"
          />
          <span className="text-sm">Super Admin</span>
        </div>

        {openProfile && (
          <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg z-50">
            <div className="absolute -top-1 right-7 w-4 h-4 bg-white rotate-45 hover:bg-gray-100"></div>

            <Link
              to="/profile"
              className="flex gap-2 items-center border-b border-black/10 text-magenta px-4 py-2 hover:text-bgYellow"
            >
              <Edit size={18} />
              Profile
            </Link>

            <Link
              to="/settings"
              className="flex gap-2 items-center text-magenta px-4 py-2 hover:text-bgYellow"
            >
              <Settings size={20} />
              Settings
            </Link>

            {/* <button
              onClick={() => console.log("Logout")}
              className="w-full flex gap-2 items-center text-left px-4 cursor-pointer py-2 text-magenta hover:bg-gray-100"
            >
              <LogOut size={18} />
              Logout
            </button> */}
          </div>
        )}
      </div>
    </div>
  );
};
export default AdminHeader;
