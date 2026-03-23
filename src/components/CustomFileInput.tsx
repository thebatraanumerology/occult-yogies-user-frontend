import React, { useRef, useState } from "react";
import { Upload } from "lucide-react";
import { CustomFileInputProps } from "../types/componentTypes";

const CustomFileInput: React.FC<CustomFileInputProps> = ({
  accept,
  onChange,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setFileName(file ? file.name : "");
    onChange?.(file);
  };

  return (
    <div className="relative w-3/4 max-w-3/4 min-w-2/3">
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
      />

      <div
        onClick={() => inputRef.current?.click()}
        className=" flex items-center w-full rounded-lg border border-black/10 bg-white  text-base  overflow-hidden cursor-pointer focus-within:ring focus-within:ring-black/30 transition"
      >
        <span className="px-3 py-2 bg-magenta text-white font-normal whitespace-nowrap select-none">
          Choose file
        </span>

        <span className={`px-3 py-2 truncate flex-1 text-start ${fileName ? "text-black" : "text-black/30"}`}>
          {fileName || "No file chosen"}
        </span>
      </div>
    </div>
  );
};

export default CustomFileInput;