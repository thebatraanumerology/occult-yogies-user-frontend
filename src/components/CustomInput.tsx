import React from "react";
import { CustomInputProps } from "../types/componentTypes";
import { Mars, Venus, VenusAndMars } from "lucide-react";
import CustomDatePicker from "./CustomDatePicker";
import CustomFileInput from "./CustomFileInput";

const CustomInput: React.FC<CustomInputProps> = ({
  label,
  required = false,
  variant = "text",
  placeholder,
  value = "",
  onChange,
  options = [],
  genderOptions = ["Male", "Female", "Others"],
  className = "",
  error = "",
}) => {
  const Label = (
    <label className="text-base max-w-1/4 font-regular whitespace-nowrap">
      {label}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  );

  const inputClass =
    "w-3/4 max-w-3/4 min-w-2/3 px-3 py-2 rounded-lg border border-black/10 bg-white text-regular placeholder:text-black/30 focus:outline-none focus:ring focus:ring-black/30 transition";

  const renderInput = () => {
    switch (variant) {
      case "date":
        return (
          <CustomDatePicker
            value={value && typeof value !== 'object' ? new Date(value) : (value instanceof Date ? value : null)}
            onChange={(date) =>
              onChange?.(date ? date.toISOString().split("T")[0] : "")
            }
          />
        );

      case "select":
        return (
          <select
            value={value as string}
            onChange={(e) => onChange?.(e.target.value)}
            className={`${inputClass} `}
          >
            <option value="" disabled className="text-black/30">
              {placeholder ?? "Select an option"}
            </option>

            {options.map((opt) => (
              <option
                key={opt.value}
                value={opt.value}
                className="text-black bg-white hover:bg-black/10 py-2"
              >
                {opt.label}
              </option>
            ))}
          </select>
        );

      case "gender":
        return (
          <div className="w-3/4 max-w-3/4 min-w-2/3 flex rounded-lg border border-black/10 overflow-hidden bg-white">
            {genderOptions.map((opt, index) => {
              const isActive = value === opt;

              const Icon =
                opt === "Male" ? Mars : opt === "Female" ? Venus : VenusAndMars;

              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => onChange?.(opt)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm transition
              ${isActive ? "bg-[#7a1040] text-white" : "text-black hover:bg-black/5"}
              ${index !== genderOptions.length - 1 ? "border-r border-black/10" : ""}
            `}
                >
                  <Icon size={16} />
                  {opt}
                </button>
              );
            })}
          </div>
        );

         

      case "file":
        return (
          <CustomFileInput
            onChange={(file) => onChange?.(file)}
          />
        );


      default:
        return (
          <input
            type="text"
            placeholder={placeholder}
            value={value as string}
            onChange={(e) => onChange?.(e.target.value)}
            className={inputClass}
          />
        );
    }
  };

  return (
    <div className={`flex flex-col ${className}`}>
      <div className="flex items-center justify-end gap-2">
        {Label}: {renderInput()}
      </div>
      {error && (
        <p className="text-red-500 text-xs text-right pr-1 mt-1 ">{error}</p>
      )}
    </div>
  );
};

export default CustomInput;
