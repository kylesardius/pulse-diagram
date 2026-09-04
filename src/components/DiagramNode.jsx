import { NodeIcon } from '../icons/index.jsx';
import { SardiusAIMark } from '../icons/SardiusAIIcon.jsx';
import { shapeOf, halfHeight, badgeMetrics } from '../lib/geometry.js';

const PANEL_TYPES = new Set(['platform', 'storage', 'output']);

const DETAIL_RISE = 16; // main line -> its detail line
const DETAIL_STEP = 20; // detail line -> the next bullet
const DIVIDER_STEP = 62;
const MARK_SIZE = 32;

/**
 * Per-type panel metrics: icon size and vertical rhythm. The portal packs the
 * most capabilities, so it runs the tightest rhythm.
 */
const PANEL_METRICS = {
  platform: { icon: 0, iconToTitle: 0, titleStep: 25, titleToBullets: 0, bulletStep: 24 },
  storage: { icon: 36, iconToTitle: 30, titleStep: 22, titleToBullets: 16, bulletStep: 24 },
  output: { icon: 32, iconToTitle: 30, titleStep: 21, titleToBullets: 16, bulletStep: 22 }
};

function Shape({ node }) {
  const s = shapeOf(node);
  if (s.kind === 'circle') {
    return <circle className="node-shape" cx={0} cy={0} r={s.r} />;
  }
  if (s.kind === 'diamond') {
    return (
      <polygon
        className="node-shape"
        points={`0,${-s.a} ${s.a},0 0,${s.a} ${-s.a},0`}
        strokeLinejoin="round"
      />
    );
  }
  return (
    <rect
      className="node-shape"
      x={-s.w / 2}
      y={-s.h / 2}
      width={s.w}
      height={s.h}
      rx={s.r}
    />
  );
}

/**
 * Metadata marker on the channel: tagging happens here, not downstream.
 * It is its own hover target — the card it opens replaces the node's tooltip.
 */
function TagBadge({ node, isActive, onActivate, onDeactivate }) {
  const { x, y, r } = badgeMetrics(node);
  const { series, categories, note } = node.metadata;
  const spoken = ['Channel metadata', `Series: ${series}`, `Categories: ${categories}`, note]
    .filter(Boolean)
    .join('. ');

  return (
    <g
      className={`node-badge ${isActive ? 'node-badge--active' : ''}`}
      style={{ '--badge-r': `${r}px`, '--badge-r-active': `${r + 2}px` }}
      tabIndex={0}
      role="img"
      aria-label={spoken}
      onMouseEnter={() => onActivate(node.id)}
      onMouseLeave={onDeactivate}
      onFocus={() => onActivate(node.id)}
      onBlur={onDeactivate}
    >
      <circle className="node-badge-dot" cx={x} cy={y} r={r} />
      <NodeIcon name="tag" x={x} y={y} size={r * 1.12} strokeWidth={1.8} />
    </g>
  );
}

const asBullet = (raw) => (typeof raw === 'string' ? { text: raw } : raw);

const bulletAdvance = (bullet, bulletStep) => {
  if (bullet.divider) return DIVIDER_STEP;
  return bullet.detail ? DETAIL_RISE + DETAIL_STEP : bulletStep;
};

/**
 * Lays out the capability list. A bullet may carry an optional second line,
 * and a `{ divider }` entry starts a labelled group, optionally with a brand
 * mark (used for the Sardius AI capabilities).
 */
function layoutBullets(bullets, startY, bulletStep) {
  let y = startY;
  return bullets.map((raw) => {
    const bullet = asBullet(raw);
    const row = { ...bullet, y };
    y += bulletAdvance(bullet, bulletStep);
    return row;
  });
}

/** Platform, storage and portal nodes carry their content inside the shape. */
function PanelContent({ node }) {
  const s = shapeOf(node);
  const left = -s.w / 2;
  const m = PANEL_METRICS[node.type] || PANEL_METRICS.output;

  // Measure the block, then centre it — unless the node pins its own title.
  const bulletSpan = node.bullets.reduce(
    (total, raw) => total + bulletAdvance(asBullet(raw), m.bulletStep),
    0
  );
  const blockHeight =
    m.icon +
    m.iconToTitle +
    node.titleLines.length * m.titleStep +
    m.titleToBullets +
    bulletSpan -
    8;
  const pinned = node.titleY !== undefined;
  const iconY = pinned ? node.iconY : -blockHeight / 2 + m.icon / 2;
  const titleY = pinned ? node.titleY : -blockHeight / 2 + m.icon + m.iconToTitle;
  const rows = layoutBullets(
    node.bullets,
    titleY + node.titleLines.length * m.titleStep + m.titleToBullets,
    m.bulletStep
  );

  return (
    <>
      {node.icon ? <NodeIcon name={node.icon} x={0} y={iconY} size={m.icon} /> : null}
      {node.titleLines.map((line, i) => (
        <text key={line} className="panel-title" x={0} y={titleY + i * m.titleStep}>
          {line}
        </text>
      ))}
      {rows.map((row) =>
        row.divider ? (
          <g key={row.divider} className="panel-group-row">
            <line
              className="panel-rule"
              x1={left + 22}
              y1={row.y + 4}
              x2={-left - 22}
              y2={row.y + 4}
            />
            {row.mark === 'sardius-ai' ? (
              <SardiusAIMark
                x={left + 22 + MARK_SIZE / 2}
                y={row.y + 30}
                size={MARK_SIZE}
              />
            ) : null}
            <text
              className="panel-group"
              x={left + (row.mark ? 30 + MARK_SIZE : 22)}
              y={row.y + 37}
            >
              {row.divider}
            </text>
          </g>
        ) : (
          <g key={row.text}>
            <circle className="panel-dot" cx={left + 22} cy={row.y - 5} r={3} />
            <text className="panel-bullet" x={left + 36} y={row.y}>
              {row.text}
            </text>
            {row.detail ? (
              <text className="panel-detail" x={left + 36} y={row.y + DETAIL_RISE}>
                {row.detail}
              </text>
            ) : null}
          </g>
        )
      )}
    </>
  );
}

export default function DiagramNode({
  node,
  isActive,
  isDimmed,
  isBadgeActive,
  onActivate,
  onDeactivate,
  onBadgeActivate,
  onBadgeDeactivate
}) {
  const isPanel = PANEL_TYPES.has(node.type);
  const isStatic = node.interactive === false;
  const labelY = halfHeight(node) + 20;

  const classes = [
    'node',
    `node--${node.type}`,
    isPanel ? 'node--panel' : '',
    node.container ? 'node--container' : '',
    isStatic ? 'node--static' : '',
    isActive ? 'node--active' : '',
    isDimmed ? 'node--dimmed' : ''
  ]
    .filter(Boolean)
    .join(' ');

  const spoken = [node.label, node.description, node.details]
    .concat((node.bullets || []).map(asBullet).map((b) => b.divider || [b.text, b.detail].filter(Boolean).join(': ')))
    .concat((node.specs || []).map((sp) => `${sp.label}: ${sp.value}`))
    .join('. ');

  return (
    <g
      className={classes}
      transform={`translate(${node.x} ${node.y})`}
      onMouseEnter={isStatic ? undefined : () => onActivate(node.id)}
      onMouseLeave={isStatic ? undefined : onDeactivate}
    >
      <g
        className="node-hit"
        data-node-id={node.id}
        tabIndex={isStatic ? undefined : 0}
        role="img"
        aria-label={spoken}
        onFocus={isStatic ? undefined : () => onActivate(node.id)}
        onBlur={isStatic ? undefined : onDeactivate}
      >
        <g className="node-scaler">
          <Shape node={node} />
          {isPanel ? (
            <PanelContent node={node} />
          ) : (
            <NodeIcon name={node.icon} x={0} y={0} size={node.type === 'channel' ? 26 : 28} />
          )}
        </g>

        {isPanel ? null : (
          <>
            <text className="node-label" x={0} y={labelY}>
              {node.label}
            </text>
            {(node.captions || []).map((caption, i) => (
              <text key={caption} className="node-caption" x={0} y={labelY + 16 + i * 14}>
                {caption}
              </text>
            ))}
          </>
        )}
      </g>

      {node.badge === 'tag' && node.metadata ? (
        <g className="node-scaler">
          <TagBadge
            node={node}
            isActive={isBadgeActive}
            onActivate={onBadgeActivate}
            onDeactivate={onBadgeDeactivate}
          />
        </g>
      ) : null}
    </g>
  );
}
