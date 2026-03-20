import {
  Hand,
  MapPin,
  Compass,
  Undo2,
  Trash2,
  RotateCcw,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";
import { CanvasToolbarProps } from "../types/vastuTypes";

type Tool = "move" | "pin" | "tool";
const DIVISIONS = [8, 16, 32];

const CanvasToolbar: React.FC<CanvasToolbarProps> = ({
  onMove,
  onPin,
  onTool,
  onDivisionChange,
  onUndo,
  onDelete,
  onRotateLeft,
  onRotateRight,
  onZoomIn,
  onZoomOut,
  onMaximize,
  onGateChange,
  onDegreeChange,
  gateOptions = [],
}: CanvasToolbarProps) => {
  const [activeTool, setActiveTool] = useState<Tool>("move");
  const [division, setDivision] = useState(8);
  const [showDivMenu, setShowDivMenu] = useState(false);
  const [degree, setDegree] = useState(0);

  const btnBase =
    "flex items-center p-1 gap-1 rounded-md border text-xs font-medium transition-all duration-150 cursor-pointer select-none";
  const inactive =
    "border-magenta text-magenta hover:bg-magenta/30";
  const active = "border-magenta bg-magenta text-white";

  const handleTool = (tool: Tool, cb?: () => void) => {
    setActiveTool(tool);
    cb?.();
  };

  return (
    <>
      <div className="flex items-center justify-between">
        {/* Nav group */}
        <article className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <button
              className={`${btnBase} ${activeTool === "move" ? active : inactive}`}
              onClick={() => handleTool("move", onMove)}
            >
              <Hand size={13} /> Move
            </button>

            <button
              className={`${btnBase} ${activeTool === "pin" ? active : inactive}`}
              onClick={() => handleTool("pin", onPin)}
            >
              <MapPin size={13} /> Pin point
            </button>
          </div>

          {/* Tool + Division dropdown */}
          <div className="flex items-center rounded-full border border-[#c9a0a0] overflow-visible bg-white">
            <button
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#7a1040] hover:bg-[#fdf0f4] transition-all ${
                activeTool === "tool" ? "bg-[#fdf0f4]" : ""
              }`}
              onClick={() => handleTool("tool", onTool)}
            >
              <Compass size={13} /> Tool
            </button>
          </div>

          {/* Division selector */}
          <div>
            <div className="relative">
              <button
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-[#7a1040] hover:bg-[#fdf0f4] transition-all"
                onClick={() => setShowDivMenu((p) => !p)}
              >
                {division} Div <ChevronDown size={11} />
              </button>

              {showDivMenu && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-[#c9a0a0] rounded-lg shadow-md z-50 overflow-hidden">
                  {DIVISIONS.map((d) => (
                    <button
                      key={d}
                      className={`block w-full text-left px-4 py-1.5 text-xs hover:bg-[#fdf0f4] text-[#7a1040] ${
                        division === d ? "font-bold bg-[#fdf0f4]" : ""
                      }`}
                      onClick={() => {
                        setDivision(d);
                        setShowDivMenu(false);
                        onDivisionChange?.(d);
                      }}
                    >
                      {d} Div
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Edit group */}
          <div>
            <button className={`${btnBase} ${inactive}`} onClick={onUndo}>
              <Undo2 size={13} /> Undo
            </button>

            <button className={`${btnBase} ${inactive}`} onClick={onDelete}>
              <Trash2 size={13} /> Delete
            </button>
          </div>

          {/* View group */}
          <div>
            <button className={`${btnBase} ${inactive}`} onClick={onRotateLeft}>
              <RotateCcw size={13} /> Rotate Left
            </button>

            <button
              className={`${btnBase} ${inactive}`}
              onClick={onRotateRight}
            >
              <RotateCw size={13} /> Rotate Right
            </button>

            <button className={`${btnBase} ${inactive}`} onClick={onZoomIn}>
              <ZoomIn size={13} /> Zoom In
            </button>

            <button className={`${btnBase} ${inactive}`} onClick={onZoomOut}>
              <ZoomOut size={13} /> Zoom Out
            </button>

            <button className={`${btnBase} ${inactive}`} onClick={onMaximize}>
              <Maximize2 size={13} /> Maximize
            </button>
          </div>
        </article>

        <article className="flex items-center gap-1">
          {/* Gate select */}
          <select
            className="py-1 rounded-md border border-magenta text-xs text-magenta focus:outline-none cursor-pointer"
            onChange={(e) => onGateChange?.(e.target.value)}
            defaultValue=""
          >
            <option value="" disabled>
              Select Side
            </option>
            {gateOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>

          {/* Degree input */}
          <div className="flex items-center text-xs text-magenta font-medium gap-1">
            <span>Degree</span>
            <input
              type="number"
              min={0}
              max={360}
              value={degree}
              onChange={(e) => {
                setDegree(Number(e.target.value));
                onDegreeChange?.(Number(e.target.value));
              }}
              className="w-10 p-1 rounded-md border border-magenta focus:outline-none"
            />
          </div>
        </article>
      </div>
    </>
  );
};

export default CanvasToolbar;
