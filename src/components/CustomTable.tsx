import {
  Copy,
  FileText,
  FileSpreadsheet,
  FileDown,
  Printer,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";
import { CustomTableProps, ExportType } from "../types/vastuTypes";

// ─── Button config ────────────────────────────────────────────────────────────
const EXPORT_BUTTONS: {
  label: string;
  type: ExportType;
  icon: React.ReactNode;
}[] = [
  { label: "Copy", type: "copy", icon: <Copy size={13} /> },
  { label: "CSV", type: "csv", icon: <FileText size={13} /> },
  { label: "Excel", type: "excel", icon: <FileSpreadsheet size={13} /> },
  { label: "PDF", type: "pdf", icon: <FileDown size={13} /> },
  { label: "Print", type: "print", icon: <Printer size={13} /> },
];

// ─── Vastu SVG icon ───────────────────────────────────────────────────────────
const TableIcon: React.FC = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 35 35"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#vastu_clip)">
      <path
        d="M17.4999 24.6232C16.7934 24.6232 16.1107 24.5193 15.4658 24.3268L17.4999 27.8189L19.534 24.3268C18.8892 24.5193 18.2065 24.6232 17.4999 24.6232Z"
        fill="#781B43"
      />
      <path
        d="M10.5582 15.901C10.867 14.5598 11.5559 13.3623 12.5046 12.4279H8.53516L10.5582 15.901Z"
        fill="#781B43"
      />
      <path
        d="M17.5 22.5724C20.3013 22.5724 22.5723 20.3015 22.5723 17.5001C22.5723 14.6988 20.3013 12.4279 17.5 12.4279C14.6987 12.4279 12.4277 14.6988 12.4277 17.5001C12.4277 20.3015 14.6987 22.5724 17.5 22.5724Z"
        fill="#781B43"
      />
      <path
        d="M26.3043 10.377C24.2253 7.81211 21.051 6.16943 17.4998 6.16943C13.9486 6.16943 10.7743 7.81211 8.69531 10.377H26.3043Z"
        fill="#781B43"
      />
      <path
        d="M28.145 13.6178L19.3745 28.6747C24.7331 27.7786 28.8303 23.1092 28.8303 17.5001C28.8303 16.137 28.5883 14.8293 28.145 13.6178Z"
        fill="#781B43"
      />
      <path
        d="M6.85474 13.6178C6.41149 14.8293 6.16943 16.137 6.16943 17.5001C6.16943 23.1092 10.2666 27.7786 15.6252 28.6747L6.85474 13.6178Z"
        fill="#781B43"
      />
      <path
        d="M22.4956 12.4277C23.4443 13.3622 24.1332 14.5597 24.442 15.9009L26.4651 12.4277H22.4956Z"
        fill="#781B43"
      />
      <path
        d="M34.7275 16.804L32.2564 14.1312L33.326 10.6512C33.4836 10.1388 33.2198 9.59149 32.7208 9.39551L29.3325 8.06469L28.7863 4.46577C28.706 3.93646 28.2316 3.55803 27.6977 3.59699L24.0667 3.8625L22.0122 0.856533C21.7098 0.413974 21.1175 0.279101 20.6532 0.547002L17.5 2.36645L14.3467 0.547002C13.8823 0.278896 13.2901 0.413974 12.9876 0.856533L10.9332 3.8625L7.30218 3.59699C6.76884 3.55803 6.29395 3.9364 6.21363 4.46577L5.66744 8.06469L2.27914 9.39551C1.78018 9.59149 1.51638 10.1388 1.67388 10.6512L2.7435 14.1312L0.272446 16.804C-0.0908154 17.197 -0.0908154 17.8032 0.272446 18.1962L2.7435 20.869L1.67381 24.349C1.51631 24.8614 1.78011 25.4087 2.27907 25.6047L5.66737 26.9355L6.21356 30.5344C6.29388 31.0638 6.76932 31.4436 7.30211 31.4032L10.9332 31.1377L12.9876 34.1437C13.1853 34.4327 13.5064 34.5906 13.8349 34.5906C14.0093 34.5905 14.1857 34.5461 14.3466 34.4532L17.5 32.6337L20.6532 34.4532C21.1175 34.7211 21.7098 34.5861 22.0123 34.1437L24.0667 31.1377L27.6977 31.4032C28.2314 31.443 28.706 31.0639 28.7863 30.5344L29.3325 26.9355L32.7208 25.6047C33.2198 25.4087 33.4836 24.8614 33.326 24.349L32.2564 20.869L34.7275 18.1962C35.0908 17.8032 35.0908 17.197 34.7275 16.804ZM17.5 30.8815C10.1215 30.8815 4.11862 24.8786 4.11862 17.5001C4.11862 10.1216 10.1215 4.11878 17.5 4.11878C24.8785 4.11878 30.8813 10.1216 30.8813 17.5001C30.8813 24.8786 24.8785 30.8815 17.5 30.8815Z"
        fill="#781B43"
      />
    </g>
    <defs>
      <clipPath id="vastu_clip">
        <rect width="35" height="35" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

const SkeletonRow: React.FC<{ cols: number }> = ({ cols }) => (
  <tr className="animate-pulse">
    {Array.from({ length: cols }).map((_, i) => (
      <td key={i} className="px-4 py-[13px]">
        <div className="h-4 bg-bgYellow/60 rounded w-3/4" />
      </td>
    ))}
  </tr>
);

const IconBtn: React.FC<{
  icon: React.ReactNode;
  title: string;
  colorClass: string;
  onClick: () => void;
}> = ({ icon, title, colorClass, onClick }) => (
  <button
    onClick={onClick}
    title={title}
    className={`w-8 h-8 flex items-center justify-center rounded-md text-white
      transition-opacity duration-150 hover:opacity-85 active:opacity-70 cursor-pointer ${colorClass}`}
  >
    {icon}
  </button>
);

const CustomTable: React.FC<CustomTableProps> = ({
  title,
  columns,
  data,
  loading = false,
  onView,
  onEdit,
  onDelete,
  onExport,
  showActions = true,
}) => {
  const handleExport = (type: ExportType) => {
    onExport
      ? onExport(type)
      : console.log(`Export as ${type} — wire onExport prop.`);
  };

  const totalCols = 1 + columns.length + (showActions ? 1 : 0);

  return (
    <>
      <div className="flex items-center flex-col my-4 gap-2">
        <h2 className="text-black font-medium text-xl">WELCOME TO</h2>
        <h1 className="text-magenta text-5xl font-bold">Occult Yogis</h1>
      </div>

      <section className="w-full h-full rounded-xl p-4 bg-white/50 border-4 border-lightYellow backdrop-blur-lg font-medium">
        {/* Header: title + export buttons */}
        <article className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TableIcon />
            <h2 className="font-semibold text-black text-2xl ">{title}</h2>
            {!loading && (
              <span className="text-lg font-normal text-black">
                ({data.length})
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 text-magenta">
            {EXPORT_BUTTONS.map((btn) => (
              <button
                key={btn.type}
                onClick={() => handleExport(btn.type)}
                className="flex items-center p-1 gap-1 rounded-md border text-xs font-medium transition-all duration-150 cursor-pointer select-none" >
                {btn.icon}
                {btn.label}
              </button>
            ))}
          </div>
        </article>

        {/* ── Table ── */}
        <div className="w-full overflow-x-auto">
          <table className="w-full text-base font-normal text-center text-black">
            {/* Yellow header row */}
            <thead>
              <tr className="bg-bgYellow text-black font-bold uppercase tracking-wider">
                <th className="p-1 px-3 w-12">S.No.</th>
                {columns.map((col) => (
                  <th key={col.key} className="whitespace-nowrap">
                    {col.label}
                  </th>
                ))}
                {showActions && (
                  <th className="w-32">Actions</th>
                )}
              </tr>
            </thead>

            <tbody>
              {/* Loading state */}
              {loading &&
                Array.from({ length: 8 }).map((_, i) => (
                  <SkeletonRow key={i} cols={totalCols} />
                ))}

              {/* Empty state */}
              {!loading && data.length === 0 && (
                <tr>
                  <td
                    colSpan={totalCols}
                    className="px-4 py-16 text-center text-black/50 font-medium"
                  >
                    No records found.
                  </td>
                </tr>
              )}

              {/* Data rows */}
              {!loading &&
                data.map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className={`border-t border-black/10  transition-colors duration-100 hover:bg-lightYellow/30 `}
                  >
                    <td className="p-1">
                      {String(rowIndex + 1).padStart(2, "0")}.
                    </td>

                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className="p-1"
                      >
                        {col.render
                          ? col.render(row[col.key], row, rowIndex)
                          : String(row[col.key] ?? "—")}
                      </td>
                    ))}

                    {showActions && (
                      <td className="p-1">
                        <div className="flex items-center justify-center gap-1">
                          {onView && (
                            <IconBtn
                              icon={<Eye size={14} />}
                              title="View"
                              colorClass="bg-borderGreen"
                              onClick={() => onView(row, rowIndex)}
                            />
                          )}
                          {onEdit && (
                            <IconBtn
                              icon={<Pencil size={14} />}
                              title="Edit"
                              colorClass="bg-edit-blue"
                              onClick={() => onEdit(row, rowIndex)}
                            />
                          )}
                          {onDelete && (
                            <IconBtn
                              icon={<Trash2 size={14} />}
                              title="Delete"
                              colorClass="bg-delete-red"
                              onClick={() => onDelete(row, rowIndex)}
                            />
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
};

export default CustomTable;
