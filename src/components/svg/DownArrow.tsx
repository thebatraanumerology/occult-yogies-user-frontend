import React from "react";
type DownArrowType = {
  isOpen?: boolean;
  className?: string | undefined;
};
const DownArrow: React.FC<DownArrowType> = ({ isOpen, className }) => {
  return (
    <svg
      viewBox="0 0 20 20"
      className={` ${className ?? "w-4 h-4"} transition ${isOpen ? "rotate-180" : ""}`}
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
        clipRule="evenodd"
      />
    </svg>
  );
};

export default DownArrow;
