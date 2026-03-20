import { FileText, Layers } from "lucide-react";

interface ActionButton {
  label: string;
  onClick: () => void;
  variant?: "primary" | "outline";
}

interface CustomAnalysisComponentProps {
  children?: React.ReactNode;
  title: string; // dynamic heading
  reportListHref?: string; // where Report List button redirects
  onReportList?: () => void; // OR pass a callback (SPA navigation)
  footerButtons?: ActionButton[]; // fully dynamic bottom buttons
}

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
      <article className="flex items-center justify-between border-b-1 border-black/10 pb-2">
        <div className="flex items-center gap-2 ">
          <Layers className="text-magenta" />
          <h1 className="text-xl  text-black">{title}</h1>
        </div>
        <button 
        onClick={handleReportList}
        className="flex items-center justify-center gap-2 bg-bgYellow text-black px-4 py-1 rounded-lg shadow-md cursor-pointer">
          <FileText size={16} />
          Report List
        </button>
      </article>

      {/* Body */}
      <article className="my-4">{children}</article>

      {/* Footer */}
       {footerButtons && footerButtons.length > 0 && (
        <article className="flex items-center justify-center gap-4 border-t border-black/10 pt-2">
          {footerButtons.map((btn, index) => (
            <button
              key={index}
              onClick={btn.onClick}
              className={
                btn.variant === "outline"
                  ? "text-magenta px-6 py-2 border border-magenta rounded-lg shadow-md cursor-pointer"
                  : "bg-magenta text-white px-6 py-2 rounded-lg shadow-md cursor-pointer"
              }
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
