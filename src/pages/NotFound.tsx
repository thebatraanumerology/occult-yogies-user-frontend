import React from "react";
import { Link } from "react-router-dom";

import PageNotFound from "../assets/404.png";
import { Home, RefreshCcw } from "lucide-react";
import Background from "../components/svg/Background";

const NotFound: React.FC = () => {
  return (
    <>
      <div className="fixed inset-0 -z-10 pointer-events-none w-full h-full">
        <Background />
      </div>
      <div className="h-screen flex flex-col items-center justify-center  text-center">
        {/* <h1 className="text-7xl font-bold text-gray-800">404</h1> */}
        <img src={PageNotFound} className="w-80" alt="Oops! Page not found" />
        <p className="mt-0 text-lg text-gray-600">Oops! Page not found</p>
        <p className="mt-0 text-lg text-gray-600">
          The requested URL was not found on this server.
        </p>
        <div className="flex gap-2 mt-5">
          <Link
            to="/"
            className="px-6 flex gap-1 items-center py-2 bg-magenta text-white rounded-lg shadow hover:bg-magenta-700"
          >
            <Home size={15} />
            Go Home
          </Link>

          <a
            role="button"
            onClick={() => {
              window.location.reload();
            }}
            className="px-6 cursor-pointer py-2 flex items-center gap-1 bg-bgYellow text-black rounded-lg shadow hover:bg-magenta-700"
          >
            <RefreshCcw size={15} />
            Refresh
          </a>
        </div>
      </div>
    </>
  );
};

export default NotFound;
