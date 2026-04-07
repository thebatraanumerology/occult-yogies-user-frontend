import {
  CircleUser,
  LogOutIcon,
  SquarePen,
  ThumbsUpIcon,
  User,
} from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import MobileNavBar from "./MobileNavBar";
import Logo from "./svg/Logo";
import DropdownNav from "./DropdownNav";

// ─── Centralised style tokens ─────────────────────────────────────────────────
const styles = {
  // Nav link — base state
  navLink:
    "flex items-center gap-1 px-2 py-1 font-medium text-black text-base transition-colors duration-150 cursor-pointer select-none",
  // Nav link — active / dropdown-open override
  navActive: "text-magenta",
  // Dropdown card shared shape
  dropdown:
    "absolute top-full mt-3 rounded-xl bg-white shadow-lg shadow-black/20 border border-black/10 z-50",
  // Small caret triangle behind dropdown
  caret:
    "absolute -top-2 w-4 h-4 rotate-45 bg-white border-l border-t border-black/10",
};

// ─── Dropdown menu items config ───────────────────────────────────────────────
const ENERGY_VASTU_ITEMS = [{ label: "Energy Vastu", to: "/energy-vastu" }];

// const REMEDIAL_ITEMS = [{ label: "Remedial Reports", to: "/remedial" }];

const REPORT_ITEMS = [{ label: "Energy Vastu", to: "/list/energy-vastu" }];

// ─── NavBar ───────────────────────────────────────────────────────────────────
const NavBar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [vastuOpen, setVastuOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);

  const displayName = user?.name
    ? user.name.length > 9
      ? user.name.slice(0, 9) + "..."
      : user.name
    : "Guest";
  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleVastuDropDown = () => {
    setVastuOpen(!vastuOpen);
    setReportOpen(false);
    setProfileOpen(false);
  };

  const handleReportsDropDown = () => {
    setVastuOpen(false);
    setReportOpen(!reportOpen);
    setProfileOpen(false);
  };

  const handleProfileDropDown = () => {
    setVastuOpen(false);
    setReportOpen(false);
    setProfileOpen(!profileOpen);
  };

  useEffect(() => {
    const handleRefDropdown = (event: any) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setVastuOpen(false);
        setReportOpen(false);
        setProfileOpen(false);
      }
    };

    document.addEventListener("click", handleRefDropdown);
    return () => {
      document.removeEventListener("click", handleRefDropdown);
    };
  }, []);

  return (
    <nav className="flex items-center justify-between px-2 md:px-12 py-1 bg-white/30 shadow-sm shadow-black/10 z-10">
      {/* Logo */}
      <div className="h-auto w-20 md:w-28">
        <Link to="/">
          <Logo />
        </Link>
      </div>

      {/* Right side */}
      <div
        ref={dropdownRef}
        className="flex items-center gap-1 font-normal text-base"
      >
        <DropdownNav
          label="Vastu"
          items={ENERGY_VASTU_ITEMS}
          caretLeft="left-4"
          buttonClassName="hidden md:flex gap-1 items-center cursor-pointer"
          onClick={handleVastuDropDown}
          openMenu={vastuOpen}
          styles={styles}
        />

        <DropdownNav
          label="Reports"
          items={REPORT_ITEMS}
          caretLeft="left-6"
          showBullets
          buttonClassName="hidden md:flex items-center  cursor-pointer text-white gap-1 ml-2 p-2 px-4 rounded-lg bg-magenta font-normal text-base hover:bg-magenta/50 transition-colors"
          onClick={handleReportsDropDown}
          openMenu={reportOpen}
          styles={styles}
        />

        {/* Profile dropdown */}
        <div className="relative ml-2" onClick={handleProfileDropDown}>
          <button
            className={`${styles.navLink} ${
              profileOpen ? styles.navActive : ""
            }`}
          >
            <CircleUser size={28} />
            <span className="hidden md:flex">{displayName}</span>
          </button>

          {profileOpen && (
            <div className={`${styles.dropdown} right-0 w-64 p-4`}>
              <span className={`${styles.caret} left-1/2 -translate-x-1/2`} />

              {/* Profile info */}
              <div className="flex gap-3 items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                  <User size={24} className="text-gray-500" />
                </div>
                <div className="flex flex-col gap-1">
                  <p className="font-semibold text-magenta leading-tight">
                    {user?.name}
                  </p>
                  <div className="inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded-md border border-borderGreen text-borderGreen bg-borderGreen/10 font-medium">
                    <ThumbsUpIcon size={13} />
                    Elite Membership
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3 text-base border-t border-black/10 pt-3">
                <NavLink
                  to="/profile"
                  className="flex items-center gap-2 text-black hover:text-magenta transition-colors"
                >
                  <SquarePen size={16} />
                  Edit Profile
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-black hover:text-magenta transition-colors text-left"
                >
                  <LogOutIcon size={16} />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
        {/* End Profile Dropdown */}

        {/* Mobile Navbar here */}
        <MobileNavBar
          menuItems={[
            { name: "Vastu", items: ENERGY_VASTU_ITEMS },
            { name: "Reports", items: REPORT_ITEMS },
          ]}
        />
        {/* End Mobile Navbar Here */}
      </div>
    </nav>
  );
};

export default NavBar;
