import CameraIcon from './CameraIcon.jsx';
import GearIcon from './GearIcon.jsx';
import BroadcastTowerIcon from './BroadcastTowerIcon.jsx';
import PortalIcon from './PortalIcon.jsx';
import PlatformIcon from './PlatformIcon.jsx';
import ArchiveIcon from './ArchiveIcon.jsx';
import CloudStorageIcon from './CloudStorageIcon.jsx';
import InsightsIcon from './InsightsIcon.jsx';
import TagIcon from './TagIcon.jsx';
import ClockIcon from './ClockIcon.jsx';
import GlobeIcon from './GlobeIcon.jsx';
import ShieldIcon from './ShieldIcon.jsx';
import SardiusAIIcon from './SardiusAIIcon.jsx';
import SunIcon from './SunIcon.jsx';
import MoonIcon from './MoonIcon.jsx';

/** Diagram glyphs: stroke-only paths drawn on a 24x24 grid, no wrapper <svg>. */
const nodeIcons = {
  camera: CameraIcon,
  gear: GearIcon,
  tower: BroadcastTowerIcon,
  portal: PortalIcon,
  platform: PlatformIcon,
  archive: ArchiveIcon,
  cloud: CloudStorageIcon,
  insights: InsightsIcon,
  tag: TagIcon
};

/**
 * Renders a 24x24 glyph scaled to `size` and centred on (x, y) in diagram space.
 */
export function NodeIcon({ name, x, y, size = 32, strokeWidth = 1.5 }) {
  const Glyph = nodeIcons[name];
  if (!Glyph) return null;
  const scale = size / 24;
  return (
    <g
      transform={`translate(${x - size / 2} ${y - size / 2}) scale(${scale})`}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth / scale}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <Glyph />
    </g>
  );
}

export { SunIcon, MoonIcon, ClockIcon, GlobeIcon, ShieldIcon, SardiusAIIcon };
