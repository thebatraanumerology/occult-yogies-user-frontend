import { Outlet } from "react-router-dom";

import Star from "../../assets/star.svg";
import background from "../../assets/background.png";
import BackgroundCircle from "@/src/components/svg/BackgroundCircle";

const AdminLoginLayout: React.FC = () => {
  return (
    <main>
      <div className="relative flex justify-center overflow-hidden items-center h-dvh bg-magenta z-0">
        <img
          src={background}
          className="absolute z-[-1] h-full w-full object-cover "
          alt="Background Image"
        />

        <img
          src={Star}
          className="absolute top-0 right-0 h-full opacity-60"
          alt="Background Second Image"
        />
        <div className="absolute opacity-40 top-0 -right-15 m-auto bottom-0 w-50 h-50 rounded-full bg-bgYellow blur-3xl"></div>

        <BackgroundCircle
          className="absolute bottom-0 translate-y-[50%] lg:translate-y-[65%] w-full lg:w-1/2 opacity-60 spin-slow "
          color="var(--color-bgYellow)"
        />
        <Outlet />
      </div>
    </main>
  );
};

export default AdminLoginLayout;
