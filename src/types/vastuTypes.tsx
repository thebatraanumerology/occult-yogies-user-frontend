export interface UserDetail {
  name: string;
  phone: string;
  category: string;
  dateOfPurchase?: string;
  address?: string;
  map: string;
}

export interface CanvasToolbarProps {
  onMove?: () => void;
  onPin?: () => void;
  onTool?: () => void;
  onDivisionChange?: (val: number) => void;
  onUndo?: () => void;
  onDelete?: () => void;
  onRotateLeft?: () => void;
  onRotateRight?: () => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onMaximize?: () => void;
  onGateChange?: (val: string) => void;
  onDegreeChange?: (val: number) => void;
  onDevtasSelection?: () => void;
  gateOptions?: string[];
  onDevtasToggle?: () => void;
devtasActive?: boolean;
}

export interface CanvasAreaHandle {
  undo: () => void;
  deleteAll: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  fitToScreen: () => void;
  rotateLeft: () => void;
  rotateRight: () => void;
  drawCompass: () => void;
  rotateCompassToGate: (fromIdx: number, toIdx: number) => void;
  showDevtas: () => void;
  hideDevtas: () => void;
  isDevtasVisible: () => boolean;
}

export interface Pin {
  x: number;
  y: number;
  label: string;
}

export interface CompassLine {
  points: number[];
  stroke: string;
  strokeWidth: number;
  dash: number[];
  opacity: number;
}

export interface CompassLabel {
  x: number;
  y: number;
  text: string;
}

export interface HistoryEntry {
  pins: Pin[];
  polygonDrawn: boolean;
}

export interface CanvasAreaProps {
  mapUrl: string;
  tool: "move" | "pin" | "tool";
  division: number;
  degree: number;
  onPinsChange?: (pins: Pin[]) => void;
  onDevtasChange?: (visible: boolean) => void;
}

export type TableRow = Record<string, unknown>;
export type ExportType = "copy" | "csv" | "excel" | "pdf" | "print";

export interface TableColumn {
  key: string;
  label: string;
  render?: (value: unknown, row: TableRow, rowIndex: number) => React.ReactNode;
}

export interface CustomTableProps {
  title: string;
  columns: TableColumn[];
  data: TableRow[];
  loading?: boolean;
  onView?: (row: TableRow, rowIndex: number) => void;
  onEdit?: (row: TableRow, rowIndex: number) => void;
  onDelete?: (row: TableRow, rowIndex: number) => void;
  onExport?: (type: ExportType) => void;
  showActions?: boolean;
}
