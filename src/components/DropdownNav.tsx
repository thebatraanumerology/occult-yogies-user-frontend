import { ChevronDown } from "lucide-react";
import { NavLink } from "react-router-dom";

interface DropdownNavProps {
  label: string;
  items: { label: string; to: string }[];
  caretLeft?: string; // tailwind left offset for the caret triangle
  showBullets?: boolean;
  buttonClassName?: string;
  onClick?: () => void;
  openMenu: boolean;
  styles: {
    navLink: string;
    navActive: string;
    dropdown: string;
    caret: string;
  };
}

const DropdownNav: React.FC<DropdownNavProps> = ({
  label,
  items,
  caretLeft = "left-4",
  showBullets = false,
  buttonClassName,
  onClick,
  openMenu = false,
  styles,
}) => {
  return (
    <div className="relative" onClick={onClick}>
      <button
        className={`${buttonClassName ?? styles.navLink} ${
          openMenu ? styles.navActive : ""
        }`}
      >
        {label}
        <ChevronDown
          size={16}
          className={`transition-transform duration-200 ${
            openMenu ? "rotate-180" : ""
          }`}
        />
      </button>

      {openMenu && (
        <div className={`${styles.dropdown} min-w-48 px-4 py-3`}>
          <span className={`${styles.caret} ${caretLeft}`} />
          <ul className="flex flex-col gap-2 text-base font-medium">
            {items.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-2 hover:text-magenta transition-colors ${
                      isActive ? "text-magenta" : "text-black"
                    }`
                  }
                >
                  {showBullets && (
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-current inline-block"
                      aria-hidden="true"
                    />
                  )}
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DropdownNav;
