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
  Sparkles,
  Sun,
  Star,
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
  onDevtasToggle,
  devtasActive = false,
  gateOptions = [],
}: CanvasToolbarProps) => {
  const [activeTool, setActiveTool] = useState<Tool>("move");
  const [division, setDivision] = useState(8);
  const [showDivMenu, setShowDivMenu] = useState(false);
  const [degree, setDegree] = useState(0);

  const btnBase =
    "flex items-center p-1 gap-1 rounded-md border text-xs font-medium transition-all duration-150 cursor-pointer select-none";
  const inactive = "border-magenta text-magenta hover:bg-magenta/30";
  const active = "border-magenta bg-magenta text-white";
  const navGroup = "flex flex-wrap items-center gap-1";
  const navSection = "flex flex-wrap items-center gap-3";

  const handleTool = (tool: Tool, cb?: () => void) => {
    setActiveTool(tool);
    cb?.();
  };

  return (
    <>
      <nav className="grid grid-cols-1 gap-2 lg:flex items-center justify-between">
        {/* Nav group */}
        <article className={`${navSection}`}>
          <div className={`${navGroup}`}>
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
          <div className={`${navGroup}`}>
            <button
              className={`${btnBase} ${activeTool === "tool" ? active : inactive}`}
              onClick={() => handleTool("tool", onTool)}
            >
              <Compass size={13} /> Tool
            </button>

            <div className="relative">
              <button
                className={`${btnBase} ${inactive}`}
                onClick={() => setShowDivMenu((p) => !p)}
              >
                {division} Div <ChevronDown size={11} />
              </button>

              {showDivMenu && (
                <div className="absolute my-1 bg-white border border-magenta rounded-md shadow-md z-10 overflow-hidden">
                  {DIVISIONS.map((d) => (
                    <button
                      key={d}
                      className={`w-full text-left px-2 py-1 text-xs hover:bg-magenta/10 text-magenta ${
                        division === d ? "font-bold bg-magenta/10" : ""
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
          <div className={`${navGroup}`}>
            <button className={`${btnBase} ${inactive}`} onClick={onUndo}>
              <Undo2 size={13} /> Undo
            </button>

            <button className={`${btnBase} ${inactive}`} onClick={onDelete}>
              <Trash2 size={13} /> Delete
            </button>
          </div>

          {/* View group */}
          <div className={`${navGroup}`}>
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

        <article className={`${navSection}`}>

        <div className={`${navGroup}`}>
             <button
              className={`${btnBase} ${devtasActive ? active : inactive}`}
              onClick={() => onDevtasToggle?.()}
              title="Toggle 45-Devta Mandala (auto-switches to 32 divisions)"
            >
              <Star size={13} /> Devtas
            </button>
          </div>

          {/* Gate select */}
          <select
            className={`${btnBase} ${inactive}`}
            onChange={(e) => onGateChange?.(e.target.value)}
            defaultValue=""
          >
            <option value="" disabled className="bg-white">
              Select Side
            </option>
            {gateOptions.map((opt) => (
              <option key={opt} value={opt} className="bg-white">
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
      </nav>
    </>
  );
};

export default CanvasToolbar;
