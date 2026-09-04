import { useMemo } from 'react';
import { connectionGeometry } from '../lib/geometry.js';

export default function Arrow({ fromNode, toNode, label, bend = 1, flowDelay = 0, isActive, isDimmed }) {
  const geo = useMemo(
    () => connectionGeometry(fromNode, toNode, bend),
    [fromNode, toNode, bend]
  );

  const classes = ['arrow', isActive ? 'arrow--active' : '', isDimmed ? 'arrow--dimmed' : '']
    .filter(Boolean)
    .join(' ');

  return (
    <g className={classes} aria-hidden="true">
      <path className="arrow-path" d={geo.path} />
      <path
        className="arrow-flow"
        d={geo.path}
        pathLength="100"
        style={{ animationDelay: `${flowDelay}ms` }}
      />
      <polygon className="arrow-head" points={geo.head} />
      {label ? (
        <text className="arrow-label" x={geo.label.x} y={geo.label.y} dy="0.35em">
          {label}
        </text>
      ) : null}
    </g>
  );
}
