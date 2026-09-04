import { useCallback, useMemo, useRef, useState } from 'react';
import DiagramNode from './DiagramNode.jsx';
import ClusterFrame from './ClusterFrame.jsx';
import Arrow from './Arrow.jsx';
import Tooltip from './Tooltip.jsx';
import MetadataTooltip from './MetadataTooltip.jsx';
import { buildDiagram, stages, STAGE_LABEL_Y, CANVAS } from '../data/pulse.js';

function Defs() {
  return (
    <defs>
      <linearGradient id="canvas-fill" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" style={{ stopColor: 'var(--canvas-from)' }} />
        <stop offset="100%" style={{ stopColor: 'var(--canvas-to)' }} />
      </linearGradient>
      <linearGradient id="node-fill" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" style={{ stopColor: 'var(--node-from)' }} />
        <stop offset="100%" style={{ stopColor: 'var(--node-to)' }} />
      </linearGradient>
      <radialGradient id="hub-fill" cx="0.5" cy="0.4" r="0.75">
        <stop offset="0%" style={{ stopColor: 'var(--hub-from)' }} />
        <stop offset="100%" style={{ stopColor: 'var(--hub-to)' }} />
      </radialGradient>
    </defs>
  );
}

export default function PulseDiagram({ vertical }) {
  const svgRef = useRef(null);
  const [activeId, setActiveId] = useState(null);
  // Tracked separately: the badge's card takes precedence over the node's.
  const [badgeId, setBadgeId] = useState(null);

  const { clusters, nodes, connections } = useMemo(
    () => buildDiagram(vertical),
    [vertical]
  );

  const nodesById = useMemo(
    () => Object.fromEntries(nodes.map((n) => [n.id, n])),
    [nodes]
  );

  const activeNode = activeId ? nodesById[activeId] : null;
  const badgeNode = badgeId ? nodesById[badgeId] : null;

  // Containers paint before the arrows so the arrows can run inside them and
  // reach the nodes they hold; everything else paints on top.
  const containers = nodes.filter((n) => n.container);
  const foreground = nodes.filter((n) => !n.container);

  /**
   * Keyboard map: left/right walk a lane along the pipeline, up/down step
   * between lanes. Storage is shared, so it terminates every lane.
   */
  const lanes = useMemo(
    () =>
      vertical.locations.map((location) => [
        `${location.id}-source`,
        `${location.id}-encoder`,
        `${location.id}-channel`,
        `${location.id}-archive`,
        'storage'
      ]),
    [vertical]
  );

  const focusNode = useCallback((id) => {
    const target = svgRef.current?.querySelector(`[data-node-id="${id}"]`);
    if (target) target.focus();
  }, []);

  const handleKeyDown = useCallback(
    (event) => {
      const current = event.target?.dataset?.nodeId;
      if (!current) return;

      const step = { ArrowRight: [0, 1], ArrowLeft: [0, -1], ArrowDown: [1, 0], ArrowUp: [-1, 0] }[
        event.key
      ];

      if (step) {
        let lane = lanes.findIndex((row) => row.includes(current));
        let stage = lane === -1 ? -1 : lanes[lane].indexOf(current);
        if (lane === -1) return;
        lane = Math.min(Math.max(lane + step[0], 0), lanes.length - 1);
        stage = Math.min(Math.max(stage + step[1], 0), lanes[lane].length - 1);
        event.preventDefault();
        focusNode(lanes[lane][stage]);
        return;
      }

      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        setActiveId(current);
        return;
      }

      if (event.key === 'Escape') {
        setActiveId(null);
        setBadgeId(null);
        event.target.blur();
      }
    },
    [lanes, focusNode]
  );

  // A container stays lit while one of the nodes it holds is the active one,
  // otherwise the contained node would appear to float on a dimmed box.
  const dimmedFor = (node) => {
    if (!activeId || activeId === node.id) return false;
    if (node.container && activeNode?.contained) return false;
    return true;
  };
  const activeCluster = useMemo(
    () => (activeId ? clusters.find((c) => c.nodeIds.includes(activeId)) : null),
    [activeId, clusters]
  );

  return (
    <div className="diagram-shell">
      <p className="visually-hidden" id="diagram-help">
        Use the arrow keys to move through the pipeline stages, Enter to show a
        stage&rsquo;s details, and Escape to dismiss them.
      </p>
      <svg
        ref={svgRef}
        className="diagram-canvas"
        viewBox={`0 0 ${CANVAS.width} ${CANVAS.height}`}
        preserveAspectRatio="xMidYMid meet"
        role="group"
        aria-label="Sardius Pulse solution architecture diagram"
        aria-describedby="diagram-help"
        onKeyDown={handleKeyDown}
      >
        <Defs />

        <rect
          x="0"
          y="0"
          width={CANVAS.width}
          height={CANVAS.height}
          rx="16"
          fill="url(#canvas-fill)"
        />

        {/* Subtle scrim so the focused node reads as foreground. */}
        <rect
          x="0"
          y="0"
          width={CANVAS.width}
          height={CANVAS.height}
          rx="16"
          fill="var(--scrim)"
          opacity={activeNode ? 1 : 0}
          style={{ transition: 'opacity 180ms ease' }}
          pointerEvents="none"
        />

        <g>
          {clusters.map((cluster) => (
            <ClusterFrame
              key={cluster.id}
              cluster={cluster}
              isDimmed={Boolean(activeId) && activeCluster?.id !== cluster.id}
            />
          ))}
        </g>

        <g className="stage-headings">
          {stages.map((stage, i) => (
            <text
              key={stage.id}
              className="stage-heading"
              x={stage.x}
              y={STAGE_LABEL_Y}
              style={{ animationDelay: `${120 + i * 90}ms` }}
            >
              {stage.label}
            </text>
          ))}
        </g>

        <g>
          {containers.map((node) => (
            <DiagramNode
              key={node.id}
              node={node}
              isActive={activeId === node.id}
              isDimmed={dimmedFor(node)}
              onActivate={setActiveId}
              onDeactivate={() => setActiveId(null)}
            />
          ))}
        </g>

        <g>
          {connections.map((c, i) => {
            const touchesActive = activeId === c.from || activeId === c.to;
            return (
              <Arrow
                key={`${c.from}-${c.to}`}
                fromNode={nodesById[c.from]}
                toNode={nodesById[c.to]}
                label={c.label}
                bend={c.bend ?? 1}
                flowDelay={(i % 4) * 220}
                isActive={touchesActive}
                isDimmed={Boolean(activeId) && !touchesActive}
              />
            );
          })}
        </g>

        <g>
          {foreground.map((node) => (
            <DiagramNode
              key={node.id}
              node={node}
              isActive={activeId === node.id}
              isDimmed={dimmedFor(node)}
              isBadgeActive={badgeId === node.id}
              onActivate={setActiveId}
              onDeactivate={() => setActiveId(null)}
              onBadgeActivate={setBadgeId}
              onBadgeDeactivate={() => setBadgeId(null)}
            />
          ))}
        </g>
      </svg>

      {badgeNode ? (
        <MetadataTooltip node={badgeNode} />
      ) : activeNode ? (
        <Tooltip node={activeNode} />
      ) : null}
    </div>
  );
}
