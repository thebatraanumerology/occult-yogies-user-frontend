export interface UserDetail {
  name: string;
  phone: string;
  category: string;
  dateOfPurchase: string;
  address: string;
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
  gateOptions?: string[];
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
}