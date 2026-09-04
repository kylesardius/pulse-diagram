/** Dashed container marking one location's source -> encoder -> channel chain. */
export default function ClusterFrame({ cluster, isDimmed }) {
  return (
    <g className={`cluster ${isDimmed ? 'cluster--dimmed' : ''}`} aria-hidden="true">
      <rect
        className="cluster-frame"
        x={cluster.x}
        y={cluster.y}
        width={cluster.width}
        height={cluster.height}
        rx={16}
      />
      <text className="cluster-label" x={cluster.x + 16} y={cluster.y + 22}>
        {cluster.label}
      </text>
    </g>
  );
}
