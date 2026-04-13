import { FileText, Layers } from "lucide-react";
import { CustomAnalysisComponentProps } from "../types/componentTypes";

const CustomAnalysisComponent: React.FC<CustomAnalysisComponentProps> = ({
  children,
  title,
  reportListHref,
  onReportList,
  footerButtons,
}) => {
  const handleReportList = () => {
    if (onReportList) {
      onReportList();
    } else if (reportListHref) {
      window.location.href = reportListHref;
    }
  };

  return (
    <section className="w-full h-full rounded-xl p-4 bg-white/50 border-4 border-lightYellow backdrop-blur-lg font-medium">
      {/* Header */}
      <article className="grid md:flex gap-2 items-center md:justify-between border-b border-black/10 pb-2">
        <div className="flex items-center gap-2 ">
          <Layers className="text-magenta" />
          <h1 className="text-xl  text-black">{title}</h1>
        </div>
        <button
          onClick={handleReportList}
          className="flex items-center justify-center gap-2 bg-bgYellow text-black px-4 py-2 rounded-lg shadow-md cursor-pointer transform hover:scale-105 duration-300 scale-100"
        >
          <FileText size={16} />
          Report List
        </button>
      </article>

      {/* Body */}
      <article className="my-4">{children}</article>

      {/* Footer */}
      {footerButtons && footerButtons.length > 0 && (
        <article className="grid grid-cols-1 md:flex items-center justify-center gap-4 border-t border-black/10 pt-2">
          {footerButtons.map((btn, index) => (
            <button
              key={index}
              onClick={btn.onClick}
              disabled={btn.disabled}
              className={`rounded-lg shadow-md cursor-pointer px-6 py-2 transform duration-300 hover:scale-105 ${
                btn.variant === "outline"
                  ? "text-magenta border border-magenta "
                  : "bg-magenta text-white"
              }`}
            >
              {btn.label}
            </button>
          ))}
        </article>
      )}
    </section>
  );
};

export default CustomAnalysisComponent;
