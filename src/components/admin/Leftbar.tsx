import React, { useState } from "react";
import { Dot, LogOut, Menu } from "lucide-react";
import LogoTRight from "../svg/Logo-t-right";
import { Link } from "react-router-dom";

import Customers from "../svg/Customers";
import Mantra from "../svg/Mantra";
import Software from "../svg/Software";
import Plan from "../svg/Plan";
import Dashboard from "../svg/Dashboard";
import DownArrow from "../svg/DownArrow";

const AdminLeftbar: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [minimize, SetMinimize] = useState(false);

  return (
    <div
      className={`fixed top-0 left-0 h-dvh  bg-magenta transition-all duration-300
      ${minimize ? "w-20 minimize" : "w-64"}`}
    >
      <div
        className={`flex ${minimize ? "justify-center" : "justify-between"} items-center border-b border-lightYellow/30 py-3 px-3`}
      >
        {!minimize && <LogoTRight color="#fff" className="w-36" />}
        <button
          title={`${minimize ? "Maximize" : "Minimize"}`}
          onClick={() => SetMinimize(!minimize)}
          className="cursor-pointer"
        >
          <Menu size={22} className="text-white" />
        </button>
      </div>

      <ul className="mt-5 space-y-1">
        {[
          {
            title: "Dashboard",
            icon: Dashboard,
            active: true,
            to: "dashboard",
          },
          { title: "Users", icon: Customers, active: false, to: "users" },
          {
            title: "Remedial Software",
            icon: Software,
            active: false,
            to: "software",
            childs: [],
          },
          {
            title: "Mantra",
            icon: Mantra,
            active: false,
            to: "mantra",
            childs: [
              { title: "Mantra 1", active: true, to: "mantra-1" },
              { title: "Mantra 2", active: false, to: "mantra-2" },
            ],
          },
          { title: "Plans", icon: Plan, active: false, to: "plans" },
          { title: "Packages", icon: Plan, active: false, to: "packages" },
        ].map((lists, ind) => {
          const Icon = lists.icon;
          const isOpen = openIndex === ind;

          return (
            <li
              key={ind}
              className={`group rounded-tl-lg rounded-bl-lg ms-2
              ${lists.active ? "bg-lightYellow text-magenta" : "text-lightYellow"}
              hover:bg-amber-50 hover:text-magenta`}
              onClick={() => {
                SetMinimize(false);
              }}
            >
              <Link
                title={lists?.title}
                to={lists?.childs?.length ? "#" : `/admin/${lists.to}`}
                onClick={() => setOpenIndex(isOpen ? null : ind)}
                className={`flex items-center py-2 px-2 ${
                  minimize ? "justify-center" : "justify-between"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon
                    className="w-5 h-5"
                    color={
                      lists.active
                        ? "var(--color-magenta)"
                        : "var(--color-lightYellow)"
                    }
                  />

                  {!minimize && <span>{lists.title}</span>}
                </div>

                {!minimize && (lists?.childs?.length ?? 0) > 0 && (
                  <DownArrow isOpen={isOpen} />
                )}
              </Link>

              {!minimize && isOpen && (
                <ul className="text-sm ml-6">
                  {lists.childs?.map((childs, cind) => (
                    <li key={cind} className="py-2 border-b border-bgYellow/20">
                      <Link
                        to={`/admin/${childs.to}`}
                        className="flex items-center gap-1"
                      >
                        <Dot size={20} />
                        {childs.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>

      <div
        className={`absolute bottom-0 w-full ${
          minimize ? "flex justify-center" : ""
        }`}
      >
        <button
          title="Logout"
          className="flex items-center cursor-pointer gap-2 w-full justify-center hover:bg-amber-50 bg-lightYellow text-magenta py-2"
        >
          <LogOut size={18} />
          {!minimize && "Logout"}
        </button>
      </div>
    </div>
  );
};

export default AdminLeftbar;
