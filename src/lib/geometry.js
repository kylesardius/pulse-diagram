/**
 * Shape registry. Every node type resolves to one of three primitives, which
 * is all the boundary maths below needs to know about.
 */
export const SHAPES = {
  source: { kind: 'rect', w: 124, h: 62, r: 12 },
  encoder: { kind: 'diamond', a: 48 },
  channel: { kind: 'circle', r: 30, badge: { r: 10, offset: 0.78 } },
  archive: { kind: 'rect', w: 150, h: 72, r: 12 },
  storage: { kind: 'rect', w: 230, h: 210, r: 18 },
  // The platform contains the three middle stages of the pipeline.
  platform: { kind: 'rect', w: 706, h: 580, r: 24 },
  output: { kind: 'rect', w: 380, h: 455, r: 20 }
};

const START_GAP = 2;
const END_GAP = 7;
const MIN_BOW = 26;
const BOW_RATIO = 0.14;
const LABEL_OFFSET = 13;
const SHORT_LINK = 70;

/** Default metadata tag badge, pinned to the node's upper-right. */
export const BADGE = { r: 11, offset: 0.72 };

/** Badge radius and centre, in coordinates local to the node. */
export function badgeMetrics(node) {
  const s = shapeOf(node);
  const { r, offset } = { ...BADGE, ...(s.badge || {}) };
  const d = (s.kind === 'circle' ? s.r : halfWidth(node)) * offset;
  return { r, x: d, y: -d };
}

export function shapeOf(node) {
  return SHAPES[node.type] || SHAPES.source;
}

/** Half-height of a node, used to place labels, captions and tooltips. */
export function halfHeight(node) {
  const s = shapeOf(node);
  if (s.kind === 'circle') return s.r;
  if (s.kind === 'diamond') return s.a;
  return s.h / 2;
}

/** Half-width of a node. */
export function halfWidth(node) {
  const s = shapeOf(node);
  if (s.kind === 'circle') return s.r;
  if (s.kind === 'diamond') return s.a;
  return s.w / 2;
}

/** Point on a node's outline in the direction of (tx, ty), padded outward. */
export function boundaryPoint(node, tx, ty, gap) {
  const dx = tx - node.x;
  const dy = ty - node.y;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const s = shapeOf(node);

  let r;
  if (s.kind === 'circle') {
    r = s.r;
  } else if (s.kind === 'diamond') {
    // |x|/a + |y|/a = 1  ->  r = a / (|ux| + |uy|)
    r = s.a / (Math.abs(ux) + Math.abs(uy));
  } else {
    const rx = Math.abs(ux) < 1e-6 ? Infinity : s.w / 2 / Math.abs(ux);
    const ry = Math.abs(uy) < 1e-6 ? Infinity : s.h / 2 / Math.abs(uy);
    r = Math.min(rx, ry);
  }

  return { x: node.x + ux * (r + gap), y: node.y + uy * (r + gap) };
}

/** Unit normal to a->b, `side` 1 pointing left of the direction of travel. */
function normal(a, b, side) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  return { x: (side * dy) / len, y: (-side * dx) / len, len };
}

/**
 * Quadratic Bezier control point: the midpoint pushed sideways by a fixed
 * number of pixels, so short links bow as clearly as long ones. `bend` 0
 * leaves the control point on the chord, giving a straight line.
 */
export function controlPoint(a, b, bend) {
  const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
  if (!bend) return mid;
  const n = normal(a, b, Math.sign(bend));
  const bow = Math.max(n.len * BOW_RATIO, MIN_BOW);
  return { x: mid.x + n.x * bow, y: mid.y + n.y * bow };
}

export function quadPoint(p0, c, p1, t) {
  const mt = 1 - t;
  return {
    x: mt * mt * p0.x + 2 * mt * t * c.x + t * t * p1.x,
    y: mt * mt * p0.y + 2 * mt * t * c.y + t * t * p1.y
  };
}

/** Arrowhead triangle at the end of a quadratic Bezier. */
export function arrowHead(c, p1, size = 9) {
  const dx = p1.x - c.x;
  const dy = p1.y - c.y;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const baseX = p1.x - ux * size;
  const baseY = p1.y - uy * size;
  const w = size * 0.5;
  return [
    `${p1.x.toFixed(2)},${p1.y.toFixed(2)}`,
    `${(baseX - uy * w).toFixed(2)},${(baseY + ux * w).toFixed(2)}`,
    `${(baseX + uy * w).toFixed(2)},${(baseY - ux * w).toFixed(2)}`
  ].join(' ');
}

/** Full geometry for a connection between two nodes. */
export function connectionGeometry(fromNode, toNode, bend = 1) {
  const rawControl = controlPoint(fromNode, toNode, bend);
  const start = boundaryPoint(fromNode, rawControl.x, rawControl.y, START_GAP);
  const end = boundaryPoint(toNode, rawControl.x, rawControl.y, END_GAP);
  const control = controlPoint(start, end, bend);
  const mid = quadPoint(start, control, end, 0.5);

  // Labels always sit off to one side, even when the line itself is straight.
  const n = normal(start, end, bend < 0 ? -1 : 1);
  const labelOffset = LABEL_OFFSET + Math.max(0, SHORT_LINK - n.len) * 0.45;

  return {
    start,
    control,
    end,
    path: `M ${start.x.toFixed(2)} ${start.y.toFixed(2)} Q ${control.x.toFixed(2)} ${control.y.toFixed(2)} ${end.x.toFixed(2)} ${end.y.toFixed(2)}`,
    head: arrowHead(control, end),
    label: { x: mid.x + n.x * labelOffset, y: mid.y + n.y * labelOffset }
  };
}
