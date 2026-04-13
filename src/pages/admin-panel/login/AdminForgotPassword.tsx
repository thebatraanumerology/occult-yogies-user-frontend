import Logo from "@/src/components/svg/Logo";
import { Mail, MoveLeft } from "lucide-react";
import { Link } from "react-router-dom";

const AdminForgotPassword: React.FC = () => {
  return (
    <form className="mx-3 relative flex flex-col gap-5 shadow-[0_0_20px_rgba(var(--color-rgb-bgYellow),0.25)] justify-center items-center text-center bg-black/40 backdrop-blur-sm blur-in w-100 rounded-3xl p-7 z-9">
      <Logo color="#ffffff" className="w-2/6" />
      <div className="flex flex-col gap-1">
        <h1 className="text-4xl text-lightYellow">Forgot Password</h1>
        <p className="text-lightYellow text-sm">
          Enter your registered email to securely reset your password.
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

      <button
        type="button"
        className="w-full relative overflow-hidden cursor-pointer border border-bgYellow bg-bgYellow text-black py-2 font-semibold rounded-lg group"
      >
        <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
          Reset Password
        </span>

        <span className="absolute left-0 top-0 h-full w-0 bg-magenta transition-all duration-300 ease-in-out group-hover:w-full"></span>
      </button>

      <Link
        to="/admin/login"
        className="text-lightYellow flex gap-2 items-center text-sm"
      >
        <MoveLeft size={18} />
        Back to Sign In
      </Link>
    </form>
  );
};

export default AdminForgotPassword;
