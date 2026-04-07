import { useState } from "react";
import { Link } from "react-router-dom";
import { MenuProps } from "../types/componentTypes";

const MobileNavBar: React.FC<MenuProps> = ({ menuItems }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [open, setOpen] = useState<boolean>(false);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      <a
        role="button"
        onClick={() => {
          setOpen(!open);
        }}
        className="flex md:hidden"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </a>
      {open && (
        <div className="w-[60%] md:hidden top-0 right-0 z-50 absolute h-full bg-black text-white">
          {/* Close Button */}
          <button
            onClick={() => {
              setOpen(!open);
            }}
            className="flex justify-end w-full p-5"
          >
            <svg
              width="30"
              height="30"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <ul>
            {menuItems.map((list, ind) => (
              <li key={ind} className="border-b border-gray-700">
                {/* Parent */}
                <div
                  onClick={() => handleToggle(ind)}
                  className="flex justify-between items-center p-4 cursor-pointer"
                >
                  {list.name}

                  {/* Arrow */}
                  <svg
                    className={`transition-transform ${
                      openIndex === ind ? "rotate-180" : ""
                    }`}
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>

                {/* Children */}
                {openIndex === ind && (
                  <ul className="bg-gray-900">
                    {list.items.map((child, cind) => (
                      <li
                        key={cind}
                        className="p-3 pl-8 border-t border-gray-800"
                      >
                        <Link to={child.to}>{child.label}</Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default MobileNavBar;
