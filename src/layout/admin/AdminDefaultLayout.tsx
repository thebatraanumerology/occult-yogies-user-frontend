import { Outlet } from "react-router-dom";

import Star from "../../assets/lightYellow-star.svg";
import background from "../../assets/background.png";
import BackgroundCircle from "@/src/components/svg/BackgroundCircle";
import AdminHeader from "@/src/components/admin/Header";
import AdminLeftbar from "@/src/components/admin/Leftbar";
import AdminFooter from "@/src/components/admin/Footer";

const AdminDefaultLayout: React.FC = () => {
  return (
    <main className="relative">
      <div className="relative flex justify-center overflow-hidden h-dvh bg-lightYellow z-0">
        <img
          src={background}
          className="absolute z-[-1] h-full w-full object-cover "
          alt="Background Image"
        />

        <img
          src={Star}
          className="absolute top-0 right-0 h-full opacity-40"
          alt="Background Second Image"
        />
        <div className="absolute opacity-40 top-0 -right-15 m-auto bottom-0 w-50 h-50 rounded-full bg-bgYellow blur-3xl"></div>

        {/* <BackgroundCircle
          className="absolute bottom-0 translate-y-[50%] lg:translate-y-[65%] w-full lg:w-1/2 opacity-60"
          color="var(--color-bgYellow)"
        /> */}
      </div>
      <div className="flex absolute top-0 left-0 w-full">
        <AdminLeftbar />
        <div className="w-[calc(100dvw-256px)] ml-64">
          <AdminHeader />
          <Outlet />
          <AdminFooter />
        </div>
      </div>
    </main>
  );
};

export default AdminDefaultLayout;
