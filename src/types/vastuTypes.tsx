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