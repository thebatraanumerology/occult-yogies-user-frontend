import {
  ChevronDown,
  CircleUser,
  LogOutIcon,
  SquarePen,
  ThumbsUpIcon,
  User,
  ClipboardList,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useState } from "react";

// ─── Centralised style tokens ─────────────────────────────────────────────────
const styles = {
  // Nav link — base state
  navLink:    "flex items-center gap-1 px-2 py-1 font-medium text-black text-base transition-colors duration-150 cursor-pointer select-none",
  // Nav link — active / dropdown-open override
  navActive:  "text-magenta",
  // Dropdown card shared shape
  dropdown:   "absolute top-full mt-3 rounded-xl bg-white shadow-lg shadow-black/20 border border-black/10 z-50",
  // Small caret triangle behind dropdown
  caret:      "absolute -top-2 w-4 h-4 rotate-45 bg-white border-l border-t border-black/10",
};

// ─── Logo ─────────────────────────────────────────────────────────────────────
const Logo: React.FC = () => (
  <svg viewBox="0 0 870.8 618.9" fill="#781b43">
    <path d="M730.9.1h0c-13,27.2-35.4,46.4-59.9,62.5a373.7,373.7,0,0,1-44,24.9c-25.2,11.9-51,22.5-76.5,33.7-33.6,14.9-61.4,36.8-80.5,68.8-6,10.1-30.4,50.8-36.7,61.6-1-1.3-21.6-35.2-31.3-51.4s-20.9-32.7-35.4-46.1c-17.3-16-37.7-26.8-59-36.3-28-12.7-56.3-24.7-83.8-38.3s-51.6-30.2-71-53.6c-6.7-8-12.4-17-18.2-25.4-3.7,29.4,3.6,58.4,22.7,81.1,14,16.5,31.6,28.6,50.6,38.1,23.6,11.8,47.6,22.7,71.8,33.2,29.8,12.9,54.3,31.7,71.2,59.7s35.1,58.6,52.8,87.9a23.5,23.5,0,0,1,3.3,12.9c0,30.6.2,93,.2,95h51.4s-.2-65.4.1-96.8a22.1,22.1,0,0,1,2.8-10.6c16.5-27.9,33.3-55.6,50-83.3,18.2-30.2,43.3-52.2,76-65.6,11.6-4.7,23.1-9.6,34.6-14.6,23.4-10.1,46.1-21.5,66.4-37.2,24.7-19.1,40.4-43.4,43.2-74.9C732.5,17,731,8.5,730.9.1Z" fill="#efba49"/>
    <path d="M134.6.4C134.7-.6,134.4,1.3,134.6.4Z" fill="#efba49"/>
    <path d="M395.7,169.9Z"/>
    <path d="M421.3,111.5a148.8,148.8,0,0,0-63.9,19.8,191.4,191.4,0,0,1,38.3,38.5,99.4,99.4,0,0,1,37-7.1,96.7,96.7,0,0,1,36,6.8c12.4-12.8,25.6-26.5,37.9-38.9C480.1,116,451.6,109.2,421.3,111.5Z"/>
    <path d="M523.9,222.2"/><path d="M341.8,222.2"/><path d="M167.9,163.5C167.8,163.1,167.9,164.2,167.9,163.5Z"/>
    <path d="M212.2,236C212.6,235.7,212.1,235.9,212.2,236Z"/><path d="M697.8,163.5C697.8,164.2,698,163.1,697.8,163.5Z"/>
    <path d="M653.5,236C653.6,235.9,653.1,235.7,653.5,236Z"/>
    <path d="M581.4,203.7c17.6-7.2,35.6-13.1,53.3-20,10.8-4.2,21.5-8.7,31.8-13.9,31.5-16,49.3-42.4,56.8-76.3.9-4.1,1.5-10.1,2.2-14.3-20.9,30.9-52.1,47.1-84,62.1-19.4,9.1-39.2,17.2-58.7,26-15.6,7-30.2,16-41.5,29-6.7,7.8-12,17-17.4,25.9,21.8,50.3-2.2,109.5-52.6,131.2a104.2,104.2,0,0,1-38.6,7.3c-23,0-45.1-8.7-62-21.8-22-18.2-37-46.4-37-77.2a98,98,0,0,1,8.1-39.5c-5.3-8.8-10.6-18.1-17.4-25.8-11.3-13-25.9-22-41.5-29.1-19.5-8.8-39.3-16.9-58.6-26-32-15-63.2-31.2-84.1-62,.7,4.1,1.3,10.1,2.2,14.2,7.6,33.9,25.3,60.4,56.8,76.3a333.3,333.3,0,0,0,31.8,14c17.7,6.8,35.8,12.8,53.3,19.9A66.3,66.3,0,0,1,315.5,229c3.3,5,5.5,11.5,8.2,16.9-11.7-19.2-31.4-28.8-51.6-35.7L234,197.4c-19-6.5-37.8-13.6-54.3-25.2-4-2.8-7.8-5.7-11.8-8.6,10.2,31.8,29.7,56.4,62,67.1,15.5,5.1,31.2,9.1,46.8,13.7,11.4,3.3,22.1,7.9,31.5,15.4,6.4,5.2,10.7,11.9,14.2,19.1-6.1-4.4-11.6-9.9-18.3-12.9a227,227,0,0,0-33.7-12.4c-19.3-5.6-40-8.6-58.2-17.6,7.5,14.5,17.4,27.2,31.6,35.7,10.2,6.1,21.3,9.8,32.8,12.5s21.4,4.9,31.8,8.2c8.6,2.7,14.6,9.1,19,17-12.1-8.4-26.5-11.3-40.9-11.7C300,354,343.9,392.1,387.8,405.5a152.3,152.3,0,0,0,44.9,6.8,149.2,149.2,0,0,0,39.8-5.4c45.8-11.5,92.7-50.6,106.8-109.3-14.4.4-28.9,3.3-40.9,11.7,4.4-7.9,10.4-14.3,19-17,10.4-3.3,21.2-5.6,31.8-8.2s22.6-6.3,32.8-12.5c14.2-8.5,24-21.2,31.6-35.6-18.2,8.9-39,12-58.2,17.5a244.7,244.7,0,0,0-33.8,12.4c-6.6,3.1-12.1,8.5-18.2,12.9,3.4-7.2,7.8-13.8,14.2-19,9.3-7.6,20.1-12.1,31.4-15.5,15.6-4.6,31.4-8.6,46.9-13.7,32.3-10.7,51.8-35.2,62-67.1-4,3-7.9,5.9-11.8,8.6-16.6,11.7-35.3,18.8-54.3,25.2l-38.1,12.9c-20.2,6.9-40,15.6-51.6,34.7,2.7-5.4,4.9-11,8.2-16A66.3,66.3,0,0,1,581.4,203.7Z"/>
    <path d="M109.3,525.3c-8.6,31-36.2,59.6-74,59.6s-38.9-25-31.9-50.4c8.5-31,36.2-59.5,74-59.5S116.3,500,109.3,525.3ZM64.6,481.6c-20.9,0-30.7,22-34,34.3-8.9,31.9-4.4,62.5,17.5,62.5S79.2,556.3,82.5,544C91.3,512.1,86.5,481.6,64.6,481.6Z"/>
    <path d="M177,532h-1.1c-2.3-11-7-19.4-18.9-19.4s-19.3,11-22.2,21.5c-6.6,24.2,1.8,32.3,14.1,32.3s21.1-8.5,24.4-13.9l1.5.6c-6.8,12.5-22.6,31.7-41.7,31.7s-25.2-18.2-20-36.7,22.5-41,52.1-41h18.6l-6.9,24.8Z"/>
    <path d="M249.3,532h-1.1c-2.3-11-7-19.4-18.9-19.4s-19.3,11-22.2,21.5c-6.6,24.2,2,32.3,14.1,32.3s21.1-8.5,24.4-13.9l1.5.6c-6.8,12.5-22.6,31.7-41.7,31.7s-25.2-18.2-20-36.7,22.6-41,52.1-41h18.6l-6.9,24.8Z"/>
    <path d="M295.4,507l-13.1,47.5c-3.3,11.9-3.7,19.5,8.2,19.5s11.5-2.6,16.7-7.3L320,520.5,312.3,507h30l-17.4,63.3,7,12.7-29.3,1,3.4-12.4c-7.7,7.7-16.3,13-27.2,13-15.9,0-20.4-10.2-16.4-24.8l10.8-39.3L265.4,507Z"/>
    <path d="M353.1,569.8,368.2,515,361,503.1l11.4-3.2L374,494l-7.2-11.9,31.5-8.8-26.6,96.5,7.7,13.3H337.9L353,569.9Z"/>
    <path d="M439.9,485.2l-6,22h29.7l-5.8,8.3H431.5l-10.5,38c-4,14.9-1.9,18.9,7.3,18.9s12.4-2.3,17.7-9l1.2,2.5c-10.9,12.5-21,18.9-33.5,18.9s-18-6.1-13.2-23.8l12.1-44.1-7.5-9.7,34.9-22Z"/>
    <path d="M548.6,566.5l6.9,16.5h-43l16-16.5,7.5-27.1-14.9-46.1-9.5-16.5h49.7l-17.7,16.5h-.1l11.3,34.4,29.8-34.6L575.9,477h39.3l-20,14.6-37.6,42.2-9.1,32.7Z"/>
    <path d="M663.9,541.7c-5.5,20-25.4,43.2-54.1,43.2s-28.8-17.8-23.6-36.4,25.4-43.2,54.1-43.2S669,523.1,663.9,541.7Zm-33.5-30.5c-12.9,0-18,13.9-20.6,23.2-6.7,24.2-3.5,44.6,10.2,44.6s18.5-15.2,20.7-23.2c6.6-24.2,3.3-44.6-10.3-44.6Z"/>
    <path d="M750,491.8l-22.9,13.6h-8.9c-24,0-39,16-42.7,29.2-2.6,9.2-.2,17.9,8.3,21.9-7.1,3.6-16.9,9-19.5,18.4a10.7,10.7,0,0,0,5.8,12.5c-5.8,2.2-15,6.5-17.1,14.1-2.9,10.8.8,17.4,26.2,17.4s43.6-16.3,48.6-34.2a22.9,22.9,0,0,0,0-12.7H686.2c-5.3-.7-7.7-2.8-6.5-7.5.5-1.8,3.5-4,6-5.8h10.6c23.9,0,39.5-16.6,43.2-29.8,1.6-5.6,1.2-10.9-1.3-15C743.7,506.8,746.6,501.4,750,491.8Zm-37.2,97.7c1,2.1,1.8,1.4-.3,8.9s-16,17-30,17-20-5.1-17.2-15.3a16.8,16.8,0,0,1,8-10.6Zm4.2-51c-1.7,6.1-4.2,16.2-13,16.2s-10.6-13.5-6.2-29.5c1.8-6.2,4.8-15.3,12.4-15.3h.2c8.7,0,11,12.5,6.6,28.5Z"/>
    <path d="M756.7,516l31.9-10.3-17.7,64,7.7,13.3H737.2l15.1-13.3L763.8,528l-7.3-11.9Z"/>
    <path d="M829.9,512.3c9.9-.2,17.1,7.3,20,17.5h.8l6.2-22.5H834.2c-15.8,0-28.6,10.1-31.8,21.5-8.5,30.5,34.9,21.6,29.9,39.9-2,7-1.6,10-14.3,10s-21.8-11.6-22.1-24.9h-1.2l-6.2,27.3c5.2,2.4,11,3.5,23.2,3.5s32.4-6.8,37.3-24.8c7.8-28.3-36.5-21.3-32.1-37.3A13.3,13.3,0,0,1,829.9,512.3Z"/>
    <path d="M789.1,468.9l-17.2,14.2,9.3,14.4,17.2-14.3-9.2-14.3Z" fill="#efba49"/>
    <path d="M845.4,503.9h14.9L856.7,517c4.7-6.5,9.5-13,14.1-19.5l-25.3,6.4Z" fill="#efba49"/>
  </svg>
);

// ─── Dropdown menu items config ───────────────────────────────────────────────
const ENERGY_VASTU_ITEMS = [
  { label: "Energy Vastu", to: "/energy-vastu" },
];

const REMEDIAL_ITEMS = [
  { label: "Remedial Reports", to: "/remedial" },
];

// ─── Reusable dropdown nav item ───────────────────────────────────────────────
interface DropdownNavProps {
  label: string;
  items: { label: string; to: string }[];
  caretLeft?: string; // tailwind left offset for the caret triangle
}

const DropdownNav: React.FC<DropdownNavProps> = ({ label, items, caretLeft = "left-4" }) => {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button className={`${styles.navLink} ${open ? styles.navActive : ""}`}>
        {label}
        <ChevronDown
          size={16}
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className={`${styles.dropdown} min-w-48 px-4 py-3`}>
          <span className={`${styles.caret} ${caretLeft}`} />
          <ul className="flex flex-col gap-2 text-base font-medium">
            {items.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `hover:text-magenta transition-colors ${isActive ? "text-magenta" : "text-black"}`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

// ─── NavBar ───────────────────────────────────────────────────────────────────
const NavBar: React.FC = () => {
  const [profileOpen, setProfileOpen] = useState(false);
  const name = "Vivek Pathak";
  const displayName = name.length > 9 ? name.slice(0, 9) + "..." : name;

  return (
    <nav className="flex items-center justify-between px-12 py-1 bg-white/30 shadow-sm shadow-black/10 z-10">

      {/* Logo */}
      <div className="h-auto w-28">
        <Logo />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-1 font-normal text-base">

        <DropdownNav label="Vastu" items={ENERGY_VASTU_ITEMS} caretLeft="left-4" />
        {/* <DropdownNav label="Remedial" items={REMEDIAL_ITEMS} caretLeft="left-4" /> */}

        <NavLink
          to="/reports"
          className="flex items-center gap-1 ml-2 p-2 px-4 rounded-lg bg-magenta text-lightYellow font-normal text-base hover:opacity-90 transition-opacity"
        >
          <ClipboardList size={16} />
          Reports
        </NavLink>

        {/* Profile dropdown */}
        <div
          className="relative ml-2"
          onMouseEnter={() => setProfileOpen(true)}
          onMouseLeave={() => setProfileOpen(false)}
        >
          <button className={`${styles.navLink} ${profileOpen ? styles.navActive : ""}`}>
            <CircleUser size={28} />
            <span>{displayName}</span>
          </button>

          {profileOpen && (
            <div className={`${styles.dropdown} right-0 w-64 p-4`}>
              <span className={`${styles.caret} left-1/2 -translate-x-1/2`} />

              {/* Profile info */}
              <div className="flex gap-3 items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <User size={24} className="text-gray-500" />
                </div>
                <div className="flex flex-col gap-1">
                  <p className="font-semibold text-magenta leading-tight">{name}</p>
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
                <button className="flex items-center gap-2 text-black hover:text-magenta transition-colors text-left">
                  <LogOutIcon size={16} />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </nav>
  );
};

export default NavBar;