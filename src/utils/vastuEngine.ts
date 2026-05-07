/**
 * VASTU DIRECTION ENGINE (TypeScript)
 * ====================================
 * Pure math. No DOM. No React. No Konva.
 * Plug into any UI.
 */

// ─── Types ───────────────────────────────────────────────────────────────────
export type Point = { x: number; y: number };

export type Divisions = 8 | 16 | 32;

export interface DirectionResult {
  index: number;
  label: string;
  angle: number; // angle of the point relative to true North (deg)
}

export interface DivisionBoundary {
  /** Boundary line goes from `center` to this {x,y} */
  x: number;
  y: number;
  /** Sector this boundary STARTS (i.e. clockwise of the boundary) */
  label: string;
  /** Boundary angle in degrees (relative to North = 0) */
  angle: number;
}

export interface DevtaSector {
  index: number;
  sectorLabel: string;
  devtaNum: number;
  devtaName: string;
  startAngle: number;
  endAngle: number;
  midAngle: number;
  /** Suggested label position inside the ring */
  center: Point;
}

export interface VastuAnalysis {
  center: Point;
  wallAngle: number;
  axis: number; // The "0° = North" reference axis in screen-space degrees
  divisionLines: DivisionBoundary[];
  devtaSectors: DevtaSector[] | null;
  /** Full 45-Devta nested mandala clipped to polygon. Only set when divisions===32. */
  devtaMandala: DevtaMandala | null;
  directionAt: (pt: Point) => DirectionResult;
  devtaAt: (pt: Point) => { num: number; name: string; sectorLabel: string } | null;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
export const toRad = (deg: number): number => (deg * Math.PI) / 180;
export const toDeg = (rad: number): number => (rad * 180) / Math.PI;
export const normalizeAngle = (deg: number): number => ((deg % 360) + 360) % 360;

// ─── 1. Centroid (shoelace, works for any polygon) ───────────────────────────
export function getPolygonCentroid(points: Point[]): Point {
  const n = points.length;
  if (n === 0) return { x: 0, y: 0 };

  let area = 0, cx = 0, cy = 0;
  for (let i = 0; i < n; i++) {
    const p1 = points[i];
    const p2 = points[(i + 1) % n];
    const cross = p1.x * p2.y - p2.x * p1.y;
    area += cross;
    cx += (p1.x + p2.x) * cross;
    cy += (p1.y + p2.y) * cross;
  }
  area /= 2;

  if (Math.abs(area) < 1e-9) {
    // Degenerate → arithmetic mean
    const sum = points.reduce((a, p) => ({ x: a.x + p.x, y: a.y + p.y }), { x: 0, y: 0 });
    return { x: sum.x / n, y: sum.y / n };
  }
  return { x: cx / (6 * area), y: cy / (6 * area) };
}

// ─── 2. Wall geometry ────────────────────────────────────────────────────────
/** Direction the wall vector points (deg, screen coords, 0° = +X = East) */
export function getWallAngle(p1: Point, p2: Point): number {
  return normalizeAngle(toDeg(Math.atan2(p2.y - p1.y, p2.x - p1.x)));
}

/**
 * Direction the wall FACES outward (perpendicular).
 * Assumes pins are pinned clockwise — outward normal is 90° clockwise from wall direction.
 */
export function getWallFacingAngle(p1: Point, p2: Point): number {
  return normalizeAngle(getWallAngle(p1, p2) - 90);
}

/**
 * Combine wall alignment + user's custom North offset.
 *   axis = wallAngle - northAngle
 * `axis` is the screen-space angle that we treat as "0° = North".
 */
export function getFinalAxis(wallAngle: number, northAngle: number = 0): number {
  return normalizeAngle(wallAngle - northAngle);
}

// ─── 3. Direction detection ──────────────────────────────────────────────────
export const DIRN_LABELS: Record<Divisions, string[]> = {
  8: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'],
  16: [
    'N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
    'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'
  ],
  32: [
    'N5', 'N6', 'N7', 'N8', 'E1', 'E2', 'E3', 'E4',
    'E5', 'E6', 'E7', 'E8', 'S1', 'S2', 'S3', 'S4',
    'S5', 'S6', 'S7', 'S8', 'W1', 'W2', 'W3', 'W4',
    'W5', 'W6', 'W7', 'W8', 'N1', 'N2', 'N3', 'N4'
  ]
};

export function getDirection(
  point: Point,
  center: Point,
  divisions: Divisions,
  axisDegrees: number = 0
): DirectionResult {
  const dx = point.x - center.x;
  const dy = point.y - center.y;
  // 0° = North (screen-up = -Y) → add 90° to atan2 result
  let raw = toDeg(Math.atan2(dy, dx));
  raw = normalizeAngle(raw + 90);

  const rel = normalizeAngle(raw - axisDegrees);

  const slice = 360 / divisions;
  const index =
    Math.floor(normalizeAngle(rel + slice / 2) / slice) % divisions;

  return {
    index,
    label: DIRN_LABELS[divisions][index],
    angle: rel
  };
}

// ─── 4. Division lines (centered ON each direction, not between) ─────────────
/**
 * Returns one line per direction. The line goes from the polygon center
 * to a point on the ring AT that direction (e.g., the "N" line points
 * straight to true-North). Sectors are formed implicitly BETWEEN consecutive
 * lines. This matches the legacy tool's visual layout.
 *
 * The `label` on each entry is the direction the line represents (i.e.
 * the line itself), so the same {x,y} is the perfect spot to place the
 * direction text just outside the ring.
 */
export function getDivisionLines(
  center: Point,
  divisions: Divisions,
  axisDegrees: number,
  radius: number
): DivisionBoundary[] {
  const slice = 360 / divisions;
  const out: DivisionBoundary[] = [];

  for (let i = 0; i < divisions; i++) {
    // No -slice/2 offset: line is AT direction i, not between i and i-1.
    const deg = axisDegrees + i * slice;
    const theta = toRad(deg - 90); // screen-space (0° = -Y / up)
    out.push({
      x: center.x + Math.cos(theta) * radius,
      y: center.y + Math.sin(theta) * radius,
      label: DIRN_LABELS[divisions][i],
      angle: normalizeAngle(deg)
    });
  }
  return out;
}

/**
 * For drawing labels at sector CENTERS (not boundaries).
 */
export function getSectorLabelPositions(
  center: Point,
  divisions: Divisions,
  axisDegrees: number,
  radius: number
): { x: number; y: number; label: string }[] {
  const slice = 360 / divisions;
  return DIRN_LABELS[divisions].map((label, i) => {
    const midDeg = axisDegrees + i * slice;
    const theta = toRad(midDeg - 90);
    return {
      x: center.x + Math.cos(theta) * radius,
      y: center.y + Math.sin(theta) * radius,
      label
    };
  });
}

// ─── 5. Devta mapping (45 Devtas) ────────────────────────────────────────────
export interface Devta {
  num: number;
  name: string;
}

export const DEVTAS_45: Devta[] = [
  { num: 1, name: 'Brahma' },        { num: 2, name: 'Bhudhar' },
  { num: 3, name: 'Aryama' },        { num: 4, name: 'Viviswan' },
  { num: 5, name: 'Mitra' },         { num: 6, name: 'Aapaha' },
  { num: 7, name: 'Aapvatsa' },      { num: 8, name: 'Savita' },
  { num: 9, name: 'Savitra' },       { num: 10, name: 'Indra' },
  { num: 11, name: 'Jaya' },         { num: 12, name: 'Rudra' },
  { num: 13, name: 'Rajyakshama' },  { num: 14, name: 'Shikhi' },
  { num: 15, name: 'Parjanya' },     { num: 16, name: 'Jayant' },
  { num: 17, name: 'Mahendra' },     { num: 18, name: 'Surya' },
  { num: 19, name: 'Satya' },        { num: 20, name: 'Bhrisha' },
  { num: 21, name: 'Antriksh' },     { num: 22, name: 'Anil' },
  { num: 23, name: 'Pusha' },        { num: 24, name: 'Vitasta' },
  { num: 25, name: 'Griha Spatya' }, { num: 26, name: 'Yama' },
  { num: 27, name: 'Gandharva' },    { num: 28, name: 'Bhriangraj' },
  { num: 29, name: 'Mrigah' },       { num: 30, name: 'Pitra' },
  { num: 31, name: 'Dauwarik' },     { num: 32, name: 'Sugreev' },
  { num: 33, name: 'Puspdant' },     { num: 34, name: 'Varun' },
  { num: 35, name: 'Asur' },         { num: 36, name: 'Shosha' },
  { num: 37, name: 'Papyakshma' },   { num: 38, name: 'Rog' },
  { num: 39, name: 'Ahir' },         { num: 40, name: 'Mukhya' },
  { num: 41, name: 'Bhallat' },      { num: 42, name: 'Soma' },
  { num: 43, name: 'Bhujang' },      { num: 44, name: 'Aditi' },
  { num: 45, name: 'Diti' }
];

export const OUTER_DEVTA_INDEXES_32: number[] = [
  42, 43, 44, 45, 14, 15, 16, 17,
  18, 19, 20, 21, 22, 23, 24, 25,
  26, 27, 28, 29, 30, 31, 32, 33,
  34, 35, 36, 37, 38, 39, 40, 41
];

export function getDevtaForPoint(
  point: Point,
  center: Point,
  axisDegrees: number
): { num: number; name: string; sectorLabel: string } {
  const { index, label } = getDirection(point, center, 32, axisDegrees);
  const devtaNum = OUTER_DEVTA_INDEXES_32[index];
  const devta = DEVTAS_45.find(d => d.num === devtaNum)!;
  return { num: devta.num, name: devta.name, sectorLabel: label };
}

export function getAllDevtaSectors(
  center: Point,
  axisDegrees: number,
  radius: number
): DevtaSector[] {
  const slice = 360 / 32;
  return OUTER_DEVTA_INDEXES_32.map((devtaNum, i) => {
    const startDeg = axisDegrees + i * slice - slice / 2;
    const endDeg = startDeg + slice;
    const midDeg = startDeg + slice / 2;
    const theta = toRad(midDeg - 90);
    const devta = DEVTAS_45.find(d => d.num === devtaNum)!;
    return {
      index: i,
      sectorLabel: DIRN_LABELS[32][i],
      devtaNum: devta.num,
      devtaName: devta.name,
      startAngle: normalizeAngle(startDeg),
      endAngle: normalizeAngle(endDeg),
      midAngle: normalizeAngle(midDeg),
      center: {
        x: center.x + Math.cos(theta) * radius * 0.75,
        y: center.y + Math.sin(theta) * radius * 0.75
      }
    };
  });
}

// ─── 5b. Devta Mandala (full 45-Devta nested rings, clipped to polygon) ──────

/** Polygonal cell in the mandala with its assigned Devta */
export interface DevtaCell {
  /** Devta number (1..45) */
  devtaNum: number;
  devtaName: string;
  /** Polygon vertices (closed implicitly) */
  points: Point[];
  /** Where to draw the number/name */
  labelPos: Point;
  /** Which ring it belongs to: 'outer' | 'middle' | 'inner' | 'center' */
  ring: 'outer' | 'middle' | 'inner' | 'center';
}

export interface DevtaMandala {
  /** 32 outer cells (Devtas 14..45) */
  outer: DevtaCell[];
  /** 8 corner cells at NE/SE/SW/NW (Devtas 6..13) */
  middle: DevtaCell[];
  /** 4 quadrant cells (Devtas 2..5) */
  inner: DevtaCell[];
  /** Single center cell (Brahma, #1) */
  center: DevtaCell;
}

/**
 * Ray-cast from `from` along `dir` (unit vector) and return the
 * intersection with the polygon edge. Returns null if the ray
 * doesn't hit any edge (shouldn't happen if `from` is inside).
 */
function rayPolygonIntersect(
  from: Point,
  dir: Point,
  polygon: Point[]
): Point | null {
  let bestT = Infinity;
  let bestHit: Point | null = null;

  for (let i = 0; i < polygon.length; i++) {
    const a = polygon[i];
    const b = polygon[(i + 1) % polygon.length];
    // Solve: from + t*dir = a + u*(b-a)  for t >= 0, 0 <= u <= 1
    const ex = b.x - a.x;
    const ey = b.y - a.y;
    const denom = dir.x * ey - dir.y * ex;
    if (Math.abs(denom) < 1e-9) continue; // parallel
    const t = ((a.x - from.x) * ey - (a.y - from.y) * ex) / denom;
    const u = ((a.x - from.x) * dir.y - (a.y - from.y) * dir.x) / denom;
    if (t > 1e-6 && u >= -1e-6 && u <= 1 + 1e-6 && t < bestT) {
      bestT = t;
      bestHit = { x: from.x + dir.x * t, y: from.y + dir.y * t };
    }
  }
  return bestHit;
}

/** Centroid of an arbitrary polygon (used for label placement) */
function polygonCentroid(pts: Point[]): Point {
  if (pts.length === 0) return { x: 0, y: 0 };
  let sx = 0, sy = 0;
  pts.forEach(p => { sx += p.x; sy += p.y; });
  return { x: sx / pts.length, y: sy / pts.length };
}

/**
 * Build the full 45-Devta mandala clipped to the polygon.
 *
 * Reproduces legacy `drawDOD()` logic:
 *   - 32 rays from center, one per direction
 *   - each ray hits polygon edge at distance L
 *   - dodOuter      = polygon edge       (distance L)
 *   - dodInner      = inner ring vertex  (distance 2L/3)
 *   - dodCorners    = corner ring vertex (distance L/2)
 *   - dodInnerMost  = innermost vertex   (distance L/3)
 *
 * The 4 rings are then formed by joining these vertices.
 */
export function getDevtaMandala(
  polygon: Point[],
  center: Point,
  axisDegrees: number
): DevtaMandala {
  const slice = 360 / 32;

  // ── Step 1: cast 32 rays, collect 4 nested vertex sets ─────────────────────
  const dodOuter: Point[] = [];
  const dodInner: Point[] = [];
  const dodCorners: Point[] = [];
  const dodInnerMost: Point[] = [];

  for (let i = 0; i < 32; i++) {
    const deg = axisDegrees + i * slice;
    const theta = toRad(deg - 90);
    const dir = { x: Math.cos(theta), y: Math.sin(theta) };

    const hit = rayPolygonIntersect(center, dir, polygon);
    if (!hit) {
      // Fallback: if ray missed (shouldn't happen for valid polygon),
      // use an arbitrary distant point. Log so caller notices.
      const fallback = {
        x: center.x + dir.x * 500,
        y: center.y + dir.y * 500
      };
      dodOuter.push(fallback);
    } else {
      dodOuter.push(hit);
    }

    const L = Math.sqrt(
      (dodOuter[i].x - center.x) ** 2 + (dodOuter[i].y - center.y) ** 2
    );
    dodInner.push({
      x: center.x + dir.x * (2 * L / 3),
      y: center.y + dir.y * (2 * L / 3)
    });
    dodCorners.push({
      x: center.x + dir.x * (L / 2),
      y: center.y + dir.y * (L / 2)
    });
    dodInnerMost.push({
      x: center.x + dir.x * (L / 3),
      y: center.y + dir.y * (L / 3)
    });
  }

  // ── Step 2: outer 32 sectors → Devtas 14..45 ───────────────────────────────
  // Mapping mirrors legacy's countDod sequence:
  //   index  0,1,2,3 → 42,43,44,45
  //   index  4..31   → 14..41
  const outerDevtaNumByIndex: number[] = [];
  for (let i = 0; i < 32; i++) {
    outerDevtaNumByIndex.push(i < 4 ? 42 + i : 14 + (i - 4));
  }

  const outer: DevtaCell[] = [];
  for (let i = 0; i < 32; i++) {
    const j = (i + 1) % 32;
    const pts = [dodOuter[i], dodInner[i], dodInner[j], dodOuter[j]];
    const num = outerDevtaNumByIndex[i];
    outer.push({
      devtaNum: num,
      devtaName: DEVTAS_45.find(d => d.num === num)!.name,
      points: pts,
      labelPos: polygonCentroid(pts),
      ring: 'outer'
    });
  }

  // ── Step 3: middle 8 corner cells → Devtas 6..13 ───────────────────────────
  // Legacy: cells at j = 2,4,10,12,18,20,26,28 (start indices), each spanning 3 rays.
  // 6-vertex polygon: dodInner[j], dodCorners[j], dodCorners[j+1], dodCorners[j+2],
  //                   dodInner[j+2], dodInner[j+1]
  const middleStartIndexes = [2, 4, 10, 12, 18, 20, 26, 28];
  const middle: DevtaCell[] = [];
  middleStartIndexes.forEach((j, k) => {
    const pts = [
      dodInner[j],
      dodCorners[j],
      dodCorners[(j + 1) % 32],
      dodCorners[(j + 2) % 32],
      dodInner[(j + 2) % 32],
      dodInner[(j + 1) % 32]
    ];
    const num = 6 + k; // 6..13
    middle.push({
      devtaNum: num,
      devtaName: DEVTAS_45.find(d => d.num === num)!.name,
      points: pts,
      labelPos: polygonCentroid(pts),
      ring: 'middle'
    });
  });

  // ── Step 4: inner 4 quadrant cells → Devtas 2..5 ───────────────────────────
  // Legacy: starts at j = 4, 12, 20, 28 (NE/SE/SW/NW). Each cell spans 9 outer rays.
  // 18-vertex polygon weaving through corner + inner + innermost rings.
  const innerStartIndexes = [4, 12, 20, 28];
  const innerDevtaOrder = [2, 3, 4, 5]; // mapped to those start indexes
  const inner: DevtaCell[] = [];

  innerStartIndexes.forEach((j, k) => {
    const pts: Point[] = [];

    // forward sweep: corners[j..j+8] mixed with inner[j+2..j+6]
    for (let s = 0; s < 9; s++) {
      const idx = (j + s) % 32;
      if (s <= 1)              pts.push(dodCorners[idx]);
      else if (s === 2)      { pts.push(dodCorners[idx]); pts.push(dodInner[idx]); }
      else if (s <= 5)         pts.push(dodInner[idx]);
      else if (s === 6)      { pts.push(dodInner[idx]); pts.push(dodCorners[idx]); }
      else                     pts.push(dodCorners[idx]);
    }
    // backward sweep along innermost ring to close the cell
    for (let s = 8; s >= 0; s--) {
      const idx = (j + s) % 32;
      pts.push(dodInnerMost[idx]);
    }

    const num = innerDevtaOrder[k];
    inner.push({
      devtaNum: num,
      devtaName: DEVTAS_45.find(d => d.num === num)!.name,
      points: pts,
      labelPos: polygonCentroid(pts),
      ring: 'inner'
    });
  });

  // ── Step 5: Brahma center cell (#1) ────────────────────────────────────────
  const centerCell: DevtaCell = {
    devtaNum: 1,
    devtaName: 'Brahma',
    points: dodInnerMost.slice(), // closed polygon of all innermost vertices
    labelPos: { x: center.x, y: center.y },
    ring: 'center'
  };

  return { outer, middle, inner, center: centerCell };
}


export interface VastuConfig {
  polygon: Point[];
  /** Index of the wall acting as gate / facing wall (0 .. n-1).
   *  Wall i goes from polygon[i] to polygon[(i+1) % n].  */
  wallIndex: number;
  /** User's custom North offset in degrees. Default 0. */
  northAngle?: number;
  divisions: Divisions;
  /** Radius for generated geometry. */
  radius?: number;
  /** If true, use wall facing direction (perpendicular) as North reference.
   *  If false, use wall direction itself (matches legacy tool). Default false. */
  useWallFacing?: boolean;
}

export function analyzeVastu(cfg: VastuConfig): VastuAnalysis {
  const {
    polygon,
    wallIndex,
    northAngle = 0,
    divisions,
    radius = 500,
    useWallFacing = false
  } = cfg;

  if (!Array.isArray(polygon) || polygon.length < 3) {
    throw new Error('Polygon must have at least 3 points.');
  }

  const center = getPolygonCentroid(polygon);
  const p1 = polygon[wallIndex];
  const p2 = polygon[(wallIndex + 1) % polygon.length];

  const wallAngle = useWallFacing
    ? getWallFacingAngle(p1, p2)
    : getWallAngle(p1, p2);

  const axis = getFinalAxis(wallAngle, northAngle);

  return {
    center,
    wallAngle,
    axis,
    divisionLines: getDivisionLines(center, divisions, axis, radius),
    devtaSectors:
      divisions === 32 ? getAllDevtaSectors(center, axis, radius) : null,
    devtaMandala:
      divisions === 32 ? getDevtaMandala(polygon, center, axis) : null,
    directionAt: (pt: Point) => getDirection(pt, center, divisions, axis),
    devtaAt: (pt: Point) =>
      divisions === 32 ? getDevtaForPoint(pt, center, axis) : null
  };
}