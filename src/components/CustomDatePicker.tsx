import React from "react";
import DatePicker from "react-datepicker";
import { CalendarDays } from "lucide-react";
import "react-datepicker/dist/react-datepicker.css";
import { CustomDateInputProps } from "../types/componentTypes";

const CustomDatePicker: React.FC<CustomDateInputProps> = ({
  value = null,
  onChange,
  placeholder = "DD/MM/YYYY",
}) => {
  const inputClass =
    "w-full px-3 py-2 rounded-lg border border-black/10 bg-white text-sm placeholder:text-black/30 focus:outline-none focus:ring focus:ring-black/30 transition pr-10";

  return (
    <div className="relative lg:w-3/4 lg:max-w-3/4 min-w-2/3">
      <DatePicker
        selected={value}
        onChange={(date : Date | null) => onChange?.(date)}
        dateFormat="dd/MM/yyyy"
        placeholderText={placeholder}
        className={inputClass}
        wrapperClassName="w-full"
        showMonthDropdown
        showYearDropdown
        dropdownMode="select"
        calendarClassName="!rounded-xl !border !border-black/10 !font-[inherit] !text-sm !shadow-lg"
        dayClassName={(date) =>
          date.toDateString() === value?.toDateString()
            ? "!bg-[#7a1040] !text-white !rounded-md"
            : "!rounded-md hover:!bg-[#7a1040]/10"
        }
      
      />
      <CalendarDays
        size={16}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7a1040] pointer-events-none"
      />
    </div>
  );
};

export default CustomDatePicker;
