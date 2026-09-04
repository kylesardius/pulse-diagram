import { CANVAS } from '../data/pulse.js';
import { halfHeight, halfWidth } from '../lib/geometry.js';

const HALF_WIDTH = 130; // css px, half the default .tooltip width
const SPEC_HALF_WIDTH = 180; // half of .tooltip--specs
const BASE_HEIGHT = 116;
const SPEC_HEIGHT = 26;
const TALL_NODE = 140; // taller than this and the card goes beside, not below

/**
 * Positioned in percentages of the canvas box so it tracks the SVG as it
 * scales. Short nodes get the card below (flipping above when space runs out);
 * tall panels get it alongside, since neither above nor below would fit.
 */
export default function Tooltip({ node }) {
  const specs = node.specs || [];
  const hasSpecs = specs.length > 0;
  const halfW = hasSpecs ? SPEC_HALF_WIDTH : HALF_WIDTH;
  const estHeight = BASE_HEIGHT + specs.length * SPEC_HEIGHT;
  const half = halfHeight(node) * 1.1;

  let style;
  if (half > TALL_NODE) {
    style = {
      left: `calc(${((node.x - halfWidth(node)) / CANVAS.width) * 100}% - 14px)`,
      top: `${(node.y / CANVAS.height) * 100}%`,
      transform: 'translate(-100%, -50%)'
    };
  } else {
    const labelGap = node.captions ? 30 + node.captions.length * 14 : 28;
    const below = node.y + half + labelGap + estHeight < CANVAS.height;
    const anchorY = below ? node.y + half + labelGap : node.y - half - 14;
    style = {
      // Clamp in css pixels so the card never hangs off the canvas at any scale.
      left: `clamp(${halfW}px, ${(node.x / CANVAS.width) * 100}%, calc(100% - ${halfW}px))`,
      top: `${(anchorY / CANVAS.height) * 100}%`,
      transform: below ? 'translate(-50%, 0)' : 'translate(-50%, -100%)'
    };
  }

  return (
    <div
      className={`tooltip ${hasSpecs ? 'tooltip--specs' : ''}`}
      style={style}
      role="tooltip"
    >
      <p className="tooltip-title">{node.label}</p>
      {node.description ? (
        <p className="tooltip-description">{node.description}</p>
      ) : null}
      {hasSpecs ? (
        /* The spec table carries the substance; the trailing note would only
           make an already tall card taller. */
        <dl className="spec-list">
          {specs.map((spec) => (
            <div key={spec.label}>
              <dt>{spec.label}</dt>
              <dd>{spec.value}</dd>
            </div>
          ))}
        </dl>
      ) : node.details ? (
        <p className="tooltip-details">{node.details}</p>
      ) : null}
    </div>
  );
}
