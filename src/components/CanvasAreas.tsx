import {
  useRef,
  useState,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Stage, Layer, Image, Circle, Line, Text, Group } from "react-konva";
import useImage from "use-image";
import type Konva from "konva";
import {
  CanvasAreaHandle,
  CanvasAreaProps,
  CompassLabel,
  CompassLine,
  HistoryEntry,
  Pin,
} from "../types/vastuTypes";

// ─── Helpers ─────────────────────────────────────────────────────────────────
const DIRECTION_LABELS: Record<number, string[]> = {
  8: ["N", "NE", "E", "SE", "S", "SW", "W", "NW"],
  16: [
    "N",
    "NNE",
    "NE",
    "ENE",
    "E",
    "ESE",
    "SE",
    "SSE",
    "S",
    "SSW",
    "SW",
    "WSW",
    "W",
    "WNW",
    "NW",
    "NNW",
  ],
  32: [
    "N",
    "NbE",
    "NNE",
    "NEbN",
    "NE",
    "NEbE",
    "ENE",
    "EbN",
    "E",
    "EbS",
    "ESE",
    "SEbE",
    "SE",
    "SEbS",
    "SSE",
    "SbE",
    "S",
    "SbW",
    "SSW",
    "SWbS",
    "SW",
    "SWbW",
    "WSW",
    "WbS",
    "W",
    "WbN",
    "WNW",
    "NWbW",
    "NW",
    "NWbN",
    "NNW",
    "NbW",
  ],
};

const getPolygonCenter = (pins: Pin[]) => {
  if (pins.length === 0) return { x: 0, y: 0 };
  let area = 0,
    cx = 0,
    cy = 0;
  const n = pins.length;
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    const cross = pins[i].x * pins[j].y - pins[j].x * pins[i].y;
    area += cross;
    cx += (pins[i].x + pins[j].x) * cross;
    cy += (pins[i].y + pins[j].y) * cross;
  }
  area /= 2;
  if (Math.abs(area) < 0.0001) {
    return {
      x: pins.reduce((s, p) => s + p.x, 0) / n,
      y: pins.reduce((s, p) => s + p.y, 0) / n,
    };
  }
  return { x: cx / (6 * area), y: cy / (6 * area) };
};

const buildCompass = (pins: Pin[], divisions: number, rotationDeg = 0) => {
  const center = getPolygonCenter(pins);
  const { x: cx, y: cy } = center;
  let maxDist = 0;
  pins.forEach((p) => {
    const d = Math.sqrt((p.x - cx) ** 2 + (p.y - cy) ** 2);
    if (d > maxDist) maxDist = d;
  });
  const radius = maxDist;
  const lines: CompassLine[] = [];
  const labels: CompassLabel[] = [];
  const totalLines = 32;
  const angleStep = (2 * Math.PI) / totalLines;
  const majorStep = totalLines / divisions;
  const rotRad = (rotationDeg * Math.PI) / 180;

  for (let i = 0; i < totalLines; i++) {
    const angle = i * angleStep - Math.PI / 2 + rotRad;
    const isMajor = i % majorStep === 0;
    lines.push({
      points: [
        cx,
        cy,
        cx + radius * Math.cos(angle),
        cy + radius * Math.sin(angle),
      ],
      stroke: "#011f5f",
      strokeWidth: isMajor ? 1.2 : 0.4,
      dash: isMajor ? [5, 4] : [2, 6],
      opacity: isMajor ? 0.85 : 0.25,
    });
    if (isMajor) {
      const majorIndex = i / majorStep;
      const labelList = DIRECTION_LABELS[divisions];
      const show = divisions === 32 ? majorIndex % 2 === 0 : true;
      if (show && labelList?.[majorIndex]) {
        const lr = radius + 18;
        labels.push({
          x: cx + lr * Math.cos(angle) - 10,
          y: cy + lr * Math.sin(angle) - 8,
          text: labelList[majorIndex],
        });
      }
    }
  }
  return { cx, cy, radius, lines, labels };
};

const computeGateRotation = (
  pins: Pin[],
  fromIdx: number,
  toIdx: number,
  degreeOffset: number,
): number => {
  const center = getPolygonCenter(pins);
  const fromPin = pins[fromIdx];
  const toPin = pins[toIdx];
  if (!fromPin || !toPin) return 0;

  const midX = (fromPin.x + toPin.x) / 2;
  const midY = (fromPin.y + toPin.y) / 2;
  const dx = midX - center.x;
  const dy = midY - center.y;
  const angleToMid = Math.atan2(dy, dx) * (180 / Math.PI);
  const rotation = -(angleToMid + 90) - degreeOffset;

  return rotation;
};

// ─── Component ───────────────────────────────────────────────────────────────
const CanvasArea = forwardRef<CanvasAreaHandle, CanvasAreaProps>(
  ({ mapUrl, tool, division, degree, onPinsChange }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const stageRef = useRef<Konva.Stage>(null);
    const [bgImage] = useImage(mapUrl, "anonymous");
    const [globalRotation, setGlobalRotation] = useState(0);
    const [pins, setPins] = useState<Pin[]>([]);
    const [polygonDrawn, setPolygonDrawn] = useState(false);
    const [compassVisible, setCompassVisible] = useState(false);
    const [compassRotation, setCompassRotation] = useState(0);
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [history, setHistory] = useState<HistoryEntry[]>([
      { pins: [], polygonDrawn: false },
    ]);
    const scaleRef = useRef(1);
    const positionRef = useRef({ x: 0, y: 0 });
    const pinsRef = useRef<Pin[]>([]);
    const divisionRef = useRef(division);
    const degreeRef = useRef(degree);
    divisionRef.current = division;
    degreeRef.current = degree;

    const W = containerRef.current?.clientWidth ?? 800;
    const H = 600;

    const setScaleSync = (val: number | ((s: number) => number)) => {
      setScale((prev) => {
        const next = typeof val === "function" ? val(prev) : val;
        scaleRef.current = next;
        return next;
      });
    };
    const setPositionSync = (val: { x: number; y: number }) => {
      positionRef.current = val;
      setPosition(val);
    };

    const setPinsSync = (newPins: Pin[]) => {
      pinsRef.current = newPins;
      setPins(newPins);
    };

    const saveHistory = useCallback((newPins: Pin[], drawn: boolean) => {
      setHistory((prev) => [
        ...prev.slice(-9),
        { pins: newPins, polygonDrawn: drawn },
      ]);
    }, []);

    // ── Expose actions to parent via ref ─────────────────────────────────────
    useImperativeHandle(
      ref,
      () => ({
        undo() {
          setHistory((h) => {
            if (h.length <= 1) return h;
            const prev = h[h.length - 2];
            setPins(prev.pins);
            pinsRef.current = prev.pins;
            setPolygonDrawn(prev.polygonDrawn);
            return h.slice(0, -1);
          });
        },
        deleteAll() {
          setPins([]);
          pinsRef.current = [];
          setPolygonDrawn(false);
          setCompassVisible(false);
          setCompassRotation(0);
          setScaleSync(1);
          setPositionSync({ x: 0, y: 0 });
          setHistory([{ pins: [], polygonDrawn: false }]);
          onPinsChange?.([]);
        },
        zoomIn: () => setScaleSync((s) => Math.min(s + 0.1, 5)),
        zoomOut: () => setScaleSync((s) => Math.max(s - 0.1, 0.3)),
        fitToScreen: () => {
          setScaleSync(1);
          setPositionSync({ x: 0, y: 0 });
        },
        rotateLeft: () => setGlobalRotation((r) => r - 90),
        rotateRight: () => setGlobalRotation((r) => r + 90),
        drawCompass: () => {
          if (polygonDrawn) setCompassVisible(true);
        },

        rotateCompassToGate(fromIdx: number, toIdx: number) {
          if (!polygonDrawn) return;
          const currentPins = pinsRef.current;
          if (currentPins.length < 3) return;

          const rotation = computeGateRotation(
            currentPins,
            fromIdx,
            toIdx,
            degreeRef.current,
          );
          setCompassVisible(true);
          setCompassRotation(rotation);
        },
      }),
      [polygonDrawn, onPinsChange],
    );

    // ── Stage click → place pin ──────────────────────────────────────────────
    const handleStageClick = useCallback(
      (e: Konva.KonvaEventObject<MouseEvent>) => {
        if (tool === "tool") {
          if (pins.length >= 3) {
            setPolygonDrawn(true);
            setCompassVisible(true);
            saveHistory(pins, true);
          }
          return;
        }
        if (tool !== "pin") return;
        if (polygonDrawn) return;

        const stage = stageRef.current!;
        const pos = stage.getRelativePointerPosition()!;
        // const pointer = stage.getPointerPosition()!;

        // const pos = {
        //   x: (pointer.x - positionRef.current.x) / scaleRef.current,
        //   y: (pointer.y - positionRef.current.y) / scaleRef.current,
        // };

        const currentPins = pinsRef.current;

        if (currentPins.length >= 2) {
          const dist = Math.sqrt(
            (pos.x - currentPins[0].x) ** 2 + (pos.y - currentPins[0].y) ** 2,
          );
          if (dist < 20) {
            setPolygonDrawn(true);
            setCompassVisible(true);
            saveHistory(currentPins, true);
            return;
          }
        }

        const newPins = [
          ...currentPins,
          { x: pos.x, y: pos.y, label: `P${currentPins.length + 1}` },
        ];
        setPinsSync(newPins);
        onPinsChange?.(newPins);
        saveHistory(newPins, false);
      },
      [tool, polygonDrawn, saveHistory, onPinsChange],
    );

    // ── Wheel zoom ───────────────────────────────────────────────────────────
    const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
      e.evt.preventDefault();
      const scaleBy = 1.1;
      const stage = stageRef.current!;
      const oldScale = stage.scaleX();
      const pointer = stage.getPointerPosition()!;
      const mousePointTo = {
        x: (pointer.x - stage.x()) / oldScale,
        y: (pointer.y - stage.y()) / oldScale,
      };
      const newScale =
        e.evt.deltaY < 0
          ? Math.min(oldScale * scaleBy, 5)
          : Math.max(oldScale / scaleBy, 0.3);
      scaleRef.current = newScale;
      setScale(newScale);
      setPositionSync({
        x: pointer.x - mousePointTo.x * newScale,
        y: pointer.y - mousePointTo.y * newScale,
      });
    };

    const compass =
      compassVisible && pins.length >= 3
        ? buildCompass(pins, division, compassRotation + degree)
        : null;

    const polygonLines = polygonDrawn
      ? pins.map((pin, i) => {
          const next = pins[(i + 1) % pins.length];
          return { points: [pin.x, pin.y, next.x, next.y] };
        })
      : [];

    return (
      <div
        ref={containerRef}
        className="relative w-full rounded-xl overflow-hidden border border-bgYellow"
        style={{
          height: H,
          background: "#f5f5f5",
          backgroundImage:
            "linear-gradient(#e0e0e0 1px, transparent 1px), linear-gradient(90deg, #e0e0e0 1px, transparent 1px)",
          backgroundSize: "25px 25px",
        }}
      >
        <Stage
          ref={stageRef}
          width={W}
          height={H}
          scaleX={scale}
          scaleY={scale}
          x={position.x}
          y={position.y}
          draggable={tool === "move"}
          onClick={handleStageClick}
          onWheel={handleWheel}
          style={{
            cursor:
              tool === "move"
                ? "grab"
                : tool === "pin"
                  ? "crosshair"
                  : "default",
          }}
        >
          {/* All layers wrapped in a single rotating group per layer */}
          <Layer>
            <Group
              rotation={globalRotation}
              offsetX={W / 2}
              offsetY={H / 2}
              x={W / 2}
              y={H / 2}
            >
              {bgImage && <Image image={bgImage} />}
            </Group>
          </Layer>

          <Layer>
            <Group
              rotation={globalRotation}
              offsetX={W / 2}
              offsetY={H / 2}
              x={W / 2}
              y={H / 2}
            >
              {compass && (
                <>
                  <Circle
                    x={compass.cx}
                    y={compass.cy}
                    radius={compass.radius}
                    stroke="#011f5f"
                    strokeWidth={1.5}
                    fill="transparent"
                  />
                  <Circle
                    x={compass.cx}
                    y={compass.cy}
                    radius={4}
                    fill="#5f0f01"
                  />
                  {compass.lines.map((l, i) => (
                    <Line
                      key={i}
                      points={l.points}
                      stroke={l.stroke}
                      strokeWidth={l.strokeWidth}
                      dash={l.dash}
                      opacity={l.opacity}
                    />
                  ))}
                  {compass.labels.map((lb, i) => (
                    <Text
                      key={i}
                      x={lb.x}
                      y={lb.y}
                      text={lb.text}
                      fontSize={13}
                      fontStyle="bold"
                      fill="#011f5f"
                    />
                  ))}
                </>
              )}
            </Group>
          </Layer>

          <Layer>
            <Group
              rotation={globalRotation}
              offsetX={W / 2}
              offsetY={H / 2}
              x={W / 2}
              y={H / 2}
            >
              {polygonLines.map((l, i) => (
                <Line
                  key={i}
                  points={l.points}
                  stroke="#781B43"
                  strokeWidth={2}
                />
              ))}
              {pins.map((pin, i) => (
                <Group key={i}>
                  <Circle
                    x={pin.x}
                    y={pin.y - 16}
                    radius={8}
                    fill="#EFBA49"
                    stroke="#fff"
                    strokeWidth={2}
                  />
                  <Line
                    points={[
                      pin.x - 4,
                      pin.y - 8,
                      pin.x + 4,
                      pin.y - 8,
                      pin.x,
                      pin.y,
                    ]}
                    closed
                    fill="#EFBA49"
                    stroke="#EFBA49"
                  />
                  <Text
                    text={pin.label}
                    x={pin.x + 12}
                    y={pin.y - 24}
                    fontSize={12}
                    fontStyle="bold"
                    fill="#EFBA49"
                  />
                </Group>
              ))}
            </Group>
          </Layer>
        </Stage>
      </div>
    );
  },
);

CanvasArea.displayName = "CanvasArea";

export type { Pin };
export default CanvasArea;
