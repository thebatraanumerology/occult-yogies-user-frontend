import { Home, Slash } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbNavProps {
  items: BreadcrumbItem[];
  onNavigate?: (href: string) => void;
}

export default function BreadcrumbNav({ items, onNavigate }: BreadcrumbNavProps) {
  const handleClick = (href?: string) => {
    if (!href) return;
    if (onNavigate) {
      onNavigate(href);
    } else {
      window.location.href = href;
    }
  };

  return (
    <nav
      aria-label="breadcrumb"
      className="flex items-center gap-1 py-2 my-4 text-sm font-medium"
    >
      {/* Home icon */}
      <button
        onClick={() => handleClick("/")}
        aria-label="Home"
        className="bg-transparent border-none cursor-pointer flex items-center text-magenta transition-opacity"
      >
        <Home size={18} />
      </button>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <span key={index} className="flex items-center gap-1">
            <Slash size={14} className="text-black" />
            {isLast ? (
              <span aria-current="page" className="text-black font-medium">
                {item.label}
              </span>
            ) : (
              <button
                onClick={() => handleClick(item.href)}
                className={`bg-transparent border-none p-0 text-magenta font-normal underline underline-offset-2 text-sm hover:opacity-70 transition-opacity ${
                  item.href ? "cursor-pointer" : "cursor-default"
                }`}
              >
                {item.label}
              </button>
            )}
          </span>
        );
      })}
    </nav>
  );
}