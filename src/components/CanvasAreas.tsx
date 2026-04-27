import {
  useRef,
  useState,
  useCallback,
  forwardRef,
  useImperativeHandle,
  useMemo,
} from "react";
import {
  Stage,
  Layer,
  Image,
  Circle,
  Line,
  Text,
  Group,
  Rect,
} from "react-konva";
import useImage from "use-image";
import type Konva from "konva";
import {
  CanvasAreaHandle,
  CanvasAreaProps,
  HistoryEntry,
  Pin,
} from "../types/vastuTypes";

// ⬇⬇⬇ CHANGE 1: import the engine instead of inline math
import {
  analyzeVastu,
  getPolygonCentroid,
  Divisions,
  Point,
} from "../utils/vastuEngine";

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

    // ⬇⬇⬇ NEW: Devtas overlay visibility (controlled by toolbar button)
    const [devtasVisible, setDevtasVisible] = useState(false);

    // ⬇⬇⬇ CHANGE 2: store wallIndex (gate side) instead of compassRotation
    // wallIndex = which polygon edge the gate is on. -1 = none chosen yet.
    const [wallIndex, setWallIndex] = useState<number>(-1);

    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [history, setHistory] = useState<HistoryEntry[]>([
      { pins: [], polygonDrawn: false },
    ]);
    const [hoveredDevta, setHoveredDevta] = useState<{
      x: number;
      y: number;
      name: string;
      num: number;
    } | null>(null);
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
          setDevtasVisible(false); // ⬅ NEW
          setWallIndex(-1); // ⬅ CHANGE 3: reset gate side, not rotation
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

        // ⬇⬇⬇ CHANGE 4: gate selection just picks the wall index now.
        // The engine derives all rotation math from (wallIndex, northAngle).
        rotateCompassToGate(fromIdx: number /* , toIdx: number */) {
          if (!polygonDrawn) return;
          if (pinsRef.current.length < 3) return;
          setWallIndex(fromIdx);
          setCompassVisible(true);
        },

        // ⬇⬇⬇ NEW: Devtas overlay control. Parent calls these from toolbar.
        showDevtas: () => {
          if (!polygonDrawn) return;
          if (pinsRef.current.length < 3) return;
          setCompassVisible(true);
          setDevtasVisible(true);
        },
        hideDevtas: () => setDevtasVisible(false),
        isDevtasVisible: () => devtasVisible,
      }),
      [polygonDrawn, onPinsChange, devtasVisible],
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

    // ⬇⬇⬇ CHANGE 5: build everything from the engine ──────────────────────────
    const analysis = useMemo(() => {
      if (!compassVisible || pins.length < 3) return null;

      // Default to wall 0 if user hasn't picked a gate yet
      const idx = wallIndex >= 0 ? wallIndex : 0;

      // Polygon center for radius math
      const center = getPolygonCentroid(pins as Point[]);
      let maxDist = 0;
      pins.forEach((p) => {
        const d = Math.sqrt((p.x - center.x) ** 2 + (p.y - center.y) ** 2);
        if (d > maxDist) maxDist = d;
      });

      return analyzeVastu({
        polygon: pins as Point[],
        wallIndex: idx,
        northAngle: degree, // user "Degree" input from toolbar
        divisions: division as Divisions,
        radius: maxDist,
        useWallFacing: false, // matches legacy tool's wall-direction math
      });
    }, [compassVisible, pins, wallIndex, degree, division]);

    // Labels sit at the OUTER TIP of each direction line (legacy layout).
    // `analysis.divisionLines[i]` is already the endpoint of line i AT
    // direction i, so we just push it slightly further out.
    const sectorLabels = useMemo(() => {
      if (!analysis) return [];
      const { center, divisionLines } = analysis;
      if (divisionLines.length === 0) return [];

      const ringR = Math.sqrt(
        (divisionLines[0].x - center.x) ** 2 +
          (divisionLines[0].y - center.y) ** 2,
      );
      const labelR = ringR + 18; // 18px outside the ring

      return divisionLines.map((b) => {
        const dx = b.x - center.x;
        const dy = b.y - center.y;
        const len = Math.sqrt(dx * dx + dy * dy) || 1;
        return {
          x: center.x + (dx / len) * labelR,
          y: center.y + (dy / len) * labelR,
          label: b.label,
        };
      });
    }, [analysis]);

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
          {/* Background image */}
          <Layer>
            <Group
              rotation={globalRotation}
              offsetX={W / 2}
              offsetY={H / 2}
              x={W / 2}
              y={H / 2}
            >
              {bgImage &&
                (() => {
                  const scale = Math.min(W / bgImage.width, H / bgImage.height);
                  const w = bgImage.width * scale;
                  const h = bgImage.height * scale;
                  return (
                    <Image
                      image={bgImage}
                      x={(W - w) / 2}
                      y={(H - h) / 2}
                      width={w}
                      height={h}
                    />
                  );
                })()}
            </Group>
          </Layer>

          {/* ⬇⬇⬇ CHANGE 6: Compass driven by engine output */}
          <Layer>
            <Group
              rotation={globalRotation}
              offsetX={W / 2}
              offsetY={H / 2}
              x={W / 2}
              y={H / 2}
            >
              {analysis && (
                <>
                  {/* Outer ring */}
                  <Circle
                    x={analysis.center.x}
                    y={analysis.center.y}
                    radius={Math.sqrt(
                      (analysis.divisionLines[0].x - analysis.center.x) ** 2 +
                        (analysis.divisionLines[0].y - analysis.center.y) ** 2,
                    )}
                    stroke="#011f5f"
                    strokeWidth={1.5}
                    fill="transparent"
                  />
                  {/* Center dot */}
                  <Circle
                    x={analysis.center.x}
                    y={analysis.center.y}
                    radius={4}
                    fill="#5f0f01"
                  />
                  {/* Division boundary lines */}
                  {analysis.divisionLines.map((b, i) => (
                    <Line
                      key={`b-${i}`}
                      points={[analysis.center.x, analysis.center.y, b.x, b.y]}
                      stroke="#011f5f"
                      strokeWidth={1.2}
                      dash={[5, 4]}
                      opacity={0.85}
                    />
                  ))}
                  {/* Sector labels (N, NE, E, …) */}
                  {sectorLabels.map((lb, i) => (
                    <Text
                      key={`lb-${i}`}
                      x={lb.x - 10}
                      y={lb.y - 8}
                      text={lb.label}
                      fontSize={division === 32 ? 11 : 13}
                      fontStyle="bold"
                      fill="#011f5f"
                    />
                  ))}
                </>
              )}
            </Group>
          </Layer>

          {/* ⬇⬇⬇ NEW: Devta mandala layer — 45 cells inside polygon */}
          <Layer>
            <Group
              rotation={globalRotation}
              offsetX={W / 2}
              offsetY={H / 2}
              x={W / 2}
              y={H / 2}
            >
              {devtasVisible && analysis?.devtaMandala && (
                <>
                  {/* Outer 32 cells (Devtas 14..45) */}
                  {analysis.devtaMandala.outer.map((cell) => (
                    <Group
                      key={`o-${cell.devtaNum}`}
                      onMouseEnter={(e) => {
                        const stage = e.target.getStage();
                        if (stage) stage.container().style.cursor = "pointer";
                        setHoveredDevta({
                          x: cell.labelPos.x,
                          y: cell.labelPos.y,
                          name: cell.devtaName,
                          num: cell.devtaNum,
                        });
                      }}
                      onMouseLeave={(e) => {
                        const stage = e.target.getStage();
                        if (stage) stage.container().style.cursor = "default";
                        setHoveredDevta(null);
                      }}
                    >
                      <Line
                        points={cell.points.flatMap((p) => [p.x, p.y])}
                        closed
                        stroke="#781B43"
                        strokeWidth={0.6}
                        fill="rgba(255,255,255,0.001)"
                      />
                      <Text
                        x={cell.labelPos.x - 6}
                        y={cell.labelPos.y - 5}
                        text={String(cell.devtaNum)}
                        fontSize={9}
                        fontStyle="bold"
                        fill="#5f0f01"
                        listening={false}
                      />
                    </Group>
                  ))}

                  {/* Middle 8 corner cells (Devtas 6..13) */}
                  {analysis.devtaMandala.middle.map((cell) => (
                    <Group
                      key={`m-${cell.devtaNum}`}
                      onMouseEnter={(e) => {
                        const stage = e.target.getStage();
                        if (stage) stage.container().style.cursor = "pointer";
                        setHoveredDevta({
                          x: cell.labelPos.x,
                          y: cell.labelPos.y,
                          name: cell.devtaName,
                          num: cell.devtaNum,
                        });
                      }}
                      onMouseLeave={(e) => {
                        const stage = e.target.getStage();
                        if (stage) stage.container().style.cursor = "default";
                        setHoveredDevta(null);
                      }}
                    >
                      <Line
                        points={cell.points.flatMap((p) => [p.x, p.y])}
                        closed
                        stroke="#011f5f"
                        strokeWidth={0.8}
                        fill="rgba(239,186,73,0.05)"
                      />
                      <Text
                        x={cell.labelPos.x - 6}
                        y={cell.labelPos.y - 6}
                        text={String(cell.devtaNum)}
                        fontSize={11}
                        fontStyle="bold"
                        fill="#011f5f"
                        listening={false}
                      />
                    </Group>
                  ))}

                  {/* Inner 4 quadrant cells (Devtas 2..5) */}
                  {analysis.devtaMandala.inner.map((cell) => (
                    <Group
                      key={`i-${cell.devtaNum}`}
                      onMouseEnter={(e) => {
                        const stage = e.target.getStage();
                        if (stage) stage.container().style.cursor = "pointer";
                        setHoveredDevta({
                          x: cell.labelPos.x,
                          y: cell.labelPos.y,
                          name: cell.devtaName,
                          num: cell.devtaNum,
                        });
                      }}
                      onMouseLeave={(e) => {
                        const stage = e.target.getStage();
                        if (stage) stage.container().style.cursor = "default";
                        setHoveredDevta(null);
                      }}
                    >
                      <Line
                        points={cell.points.flatMap((p) => [p.x, p.y])}
                        closed
                        stroke="#5f0f01"
                        strokeWidth={1}
                        fill="rgba(239,186,73,0.10)"
                      />
                      <Text
                        x={cell.labelPos.x - 6}
                        y={cell.labelPos.y - 7}
                        text={String(cell.devtaNum)}
                        fontSize={13}
                        fontStyle="bold"
                        fill="#5f0f01"
                        listening={false}
                      />
                    </Group>
                  ))}

                  {/* Center cell — Brahma (#1) */}
                  <Group
                    onMouseEnter={(e) => {
                      const stage = e.target.getStage();
                      if (stage) stage.container().style.cursor = "pointer";
                      setHoveredDevta({
                        x: analysis?.devtaMandala?.center.labelPos.x ?? 0,
                        y: analysis?.devtaMandala?.center.labelPos.y ?? 0,
                        name: analysis?.devtaMandala?.center.devtaName ?? "",
                        num: analysis?.devtaMandala?.center.devtaNum ?? 0,
                      });
                    }}
                    onMouseLeave={(e) => {
                      const stage = e.target.getStage();
                      if (stage) stage.container().style.cursor = "default";
                      setHoveredDevta(null);
                    }}
                  >
                    <Line
                      points={analysis.devtaMandala.center.points.flatMap(
                        (p) => [p.x, p.y],
                      )}
                      closed
                      stroke="#5f0f01"
                      strokeWidth={1.2}
                      fill="rgba(239,186,73,0.18)"
                    />
                    <Text
                      x={analysis.devtaMandala.center.labelPos.x - 6}
                      y={analysis.devtaMandala.center.labelPos.y - 8}
                      text="1"
                      fontSize={15}
                      fontStyle="bold"
                      fill="#5f0f01"
                      listening={false}
                    />
                  </Group>

                  {/* Tooltip — drawn on top of all cells in this layer */}
                  {hoveredDevta &&
                    (() => {
                      const label = `${hoveredDevta.num}. ${hoveredDevta.name}`;
                      // ~7px per char + 12px padding is good enough for our font
                      const tw = label.length * 7 + 12;
                      const th = 20;
                      const tx = hoveredDevta.x + 12;
                      const ty = hoveredDevta.y - 26;
                      return (
                        <Group listening={false}>
                          <Rect
                            x={tx}
                            y={ty}
                            width={tw}
                            height={th}
                            fill="#011f5f"
                            cornerRadius={4}
                            shadowColor="black"
                            shadowBlur={4}
                            shadowOpacity={0.25}
                          />
                          <Text
                            x={tx + 6}
                            y={ty + 4}
                            text={label}
                            fontSize={12}
                            fontStyle="bold"
                            fill="#fff"
                          />
                        </Group>
                      );
                    })()}
                </>
              )}
            </Group>
          </Layer>

          {/* Polygon + pins */}
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
