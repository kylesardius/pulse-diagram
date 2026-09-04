import { CANVAS } from '../data/pulse.js';
import { badgeMetrics } from '../lib/geometry.js';

const CARD_WIDTH = 236; // css px, matches .tooltip--metadata width

/**
 * The expanded tag badge: the channel's full metadata, including the optional
 * free-text note. Hangs down and to the right of the badge so the channel it
 * belongs to stays visible, and slides back inside the canvas at the edges.
 */
export default function MetadataTooltip({ node }) {
  const badge = badgeMetrics(node);
  const x = node.x + badge.x + badge.r + 5;
  const y = node.y + badge.y - 6;
  const { series, categories, note } = node.metadata;

  const style = {
    left: `clamp(8px, ${(x / CANVAS.width) * 100}%, calc(100% - ${CARD_WIDTH + 8}px))`,
    top: `${(y / CANVAS.height) * 100}%`
  };

  return (
    <div className="tooltip tooltip--metadata" style={style} role="tooltip">
      <p className="tooltip-title">Channel metadata</p>
      <dl className="metadata-list">
        <dt>Series</dt>
        <dd>{series}</dd>
        <dt>Categories</dt>
        <dd>{categories}</dd>
      </dl>
      {note ? <p className="metadata-note">{note}</p> : null}
    </div>
  );
}
