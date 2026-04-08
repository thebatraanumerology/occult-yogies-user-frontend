import React from "react";
import { TooltipType } from "../types/componentTypes";

const CustomTooltip: React.FC<TooltipType> = ({ title, children }) => {
  return (
    <div className="relative inline-block group ">
      {children}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap z-50 pointer-events-none">
        {title}
        <div className="absolute left-1/2 -bottom-1 w-2 h-2 bg-black rotate-45 -translate-x-1/2"></div>
      </div>
    </div>
  );
};

export default CustomTooltip;
