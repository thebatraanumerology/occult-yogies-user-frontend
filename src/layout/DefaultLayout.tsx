import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";
import Background from "../components/svg/Background";

const DefaultLayout: React.FC = () => {
  return (
    <>
      <NavBar />
      <div className="fixed inset-0 -z-10 pointer-events-none w-full h-full">
        <Background />
      </div>
      <main className="flex items-center font-outfit pb-10 ">
        <Outlet />
      </main>
    </>
  );
};

export default DefaultLayout;
