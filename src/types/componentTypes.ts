import { file } from "zod";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}


export interface BreadcrumbNavProps {
  items: BreadcrumbItem[];
  onNavigate?: (href: string) => void;
}


export interface MenuChild{
  to: string;
  label: string;
};

export interface MenuItem{
  name: string;
  items: MenuChild[];
};

export interface MenuProps{
  menuItems: MenuItem[];
};

export type InputVariant = "text" | "date" | "select" | "gender" | "file";
 

export interface SelectOption {
  label: string;
  value: string;
}
 
export interface CustomInputProps {
  label: string;
  required?: boolean;
  variant?: InputVariant;
  placeholder?: string;
  value?: string | Date | null | File;
  onChange?: (value: string | File | null) => void;
  options?: SelectOption[];            
  genderOptions?: string[];           
  className?: string;
  error?: string;
}

export interface ActionButton {
  label: string;
  onClick: () => void;
  variant?: "primary" | "outline";
  disabled?: boolean
}

export interface CustomAnalysisComponentProps {
  children?: React.ReactNode;
  title: string; 
  reportListHref?: string; 
  onReportList?: () => void; 
  footerButtons?: ActionButton[]; 
}

export interface CustomDateInputProps {
  value?: Date | null;
  onChange?: (date: Date | null) => void;
  placeholder?: string;
}

export interface CustomFileInputProps {
  accept?: string;
  onChange?: (file: File | null) => void;
  error?: string
}

export interface TooltipType {
  title: string;
  children: React.ReactNode;
};
export interface CustomLoaderProps {
  loading: boolean;
}
