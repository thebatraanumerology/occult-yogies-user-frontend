import React, { useState } from "react";

import Logo from "@/src/components/svg/Logo";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";

import "./admin-login.scss";
import { Link } from "react-router-dom";

const AdminLoginPage: React.FC = () => {
  const [showPass, setShowPass] = useState(false);
  return (
    <form className="mx-3 relative flex flex-col gap-4 shadow-[0_0_20px_rgba(var(--color-rgb-bgYellow),0.25)] justify-center items-center text-center bg-black/40 backdrop-blur-sm blur-in w-100 rounded-3xl p-7 z-9">
      <Logo color="#ffffff" className="w-2/6" />
      <div className="flex flex-col gap-1">
        <h1 className="text-4xl text-lightYellow">Sign in with email</h1>
        <p className="text-lightYellow text-sm">
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry
        </p>
      </div>

      <div className="flex flex-col border border-lightYellow w-full rounded-lg py-2 gap-1 text-left">
        <div className="flex gap-2">
          <span className="flex items-center px-3">
            <Mail size={18} className="text-lightYellow" />
          </span>
          <input
            type="email"
            placeholder="Email ID"
            className="placeholder-lightYellow/40 w-full caret-lightYellow focus:outline-none text-lightYellow"
          />
        </div>
      </div>

      <div className="w-full">
        <div className="flex relative flex-col overflow-hidden border caret-lightYellow border-lightYellow w-full rounded-lg py-2 gap-1 text-left">
          <div className="flex gap-2">
            <span className="flex items-center px-3">
              <Lock size={18} className="text-lightYellow" />
            </span>
            <input
              type={`${showPass ? "text" : "password"}`}
              placeholder="Password"
              className="placeholder-lightYellow/40 w-full focus:outline-none text-lightYellow"
            />
          </div>

          <a
            role="button"
            className="absolute h-full w-8 top-0 flex justify-center items-center right-0 cursor-pointer"
            onClick={() => {
              setShowPass(!showPass);
            }}
          >
            {showPass ? (
              <Eye size={18} className="text-lightYellow" />
            ) : (
              <EyeOff size={18} className="text-lightYellow" />
            )}
          </a>
        </div>

        <div className="text-end w-full">
          <Link
            to="/admin/forgort-password"
            className="text-lightYellow text-sm"
          >
            Forgot Password?
          </Link>
        </div>
      </div>

      <button
        type="button"
        className="w-full relative overflow-hidden cursor-pointer mt-3 border border-bgYellow bg-bgYellow text-black py-2 font-semibold rounded-lg group"
      >
        <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
          Login Now
        </span>

        <span className="absolute left-0 top-0 h-full w-0 bg-magenta transition-all duration-300 ease-in-out group-hover:w-full"></span>
      </button>
    </form>
  );
};

export default AdminLoginPage;
