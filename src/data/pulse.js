/**
 * Pulse solution architecture — a linear left-to-right pipeline.
 *
 *   Video Source -> Encoder -> Sardius Channel -> Asset Archive
 *                                              -> Asset Storage -> Pulse Portal
 *
 * The three middle stages are Sardius platform infrastructure, so they are
 * drawn inside one large platform container. Each location runs its own lane
 * through Channel and Archive; the lanes converge on a single unified Asset
 * Storage layer, which the Pulse Viewing Portal reads from.
 *
 * Node coordinates are derived from LAYOUT rather than hand-placed, so adding
 * or removing a location re-flows the diagram on its own.
 *
 * NOTE: the `specs` values below are plausible placeholders, not verified
 * product specifications. Replace them with real numbers before this is shown
 * to a customer.
 */

const PLATFORM = { x: 768, y: 380, width: 706, height: 580 };

export const LAYOUT = {
  canvas: { width: 1610, height: 750 },
  // One x centre per pipeline stage, left to right.
  columns: {
    source: 105,
    encoder: 295,
    channel: 500,
    archive: 685,
    storage: 975,
    portal: 1385
  },
  cluster: { x: 30, width: 345, halfHeight: 78 },
  rows: { first: 200, spacing: 180 },
  platform: PLATFORM
};

/**
 * Per-lane hardware. Positional, not per-vertical: whichever vertical is
 * selected, the third location runs a PTZ rig, which takes no baseband input
 * and encodes H.264 only.
 */
const LANE_HARDWARE = [
  {},
  {},
  { label: 'PTZ Encoder', input: null, codec: 'H.264' }
];

function lane(location, index) {
  const y = LAYOUT.rows.first + index * LAYOUT.rows.spacing;
  const c = LAYOUT.columns;

  const source = {
    id: `${location.id}-source`,
    label: 'Video Source',
    type: 'source',
    icon: 'camera',
    x: c.source,
    y,
    description: 'Video Source from Video Production System'
  };

  const hardware = LANE_HARDWARE[index] || {};
  const encoderInput = hardware.input === undefined ? 'SDI / HDMI' : hardware.input;

  const encoder = {
    id: `${location.id}-encoder`,
    label: hardware.label || 'Encoder',
    type: 'encoder',
    icon: 'gear',
    x: c.encoder,
    y,
    specs: [
      encoderInput ? { label: 'Input', value: encoderInput } : null,
      { label: 'Codec', value: hardware.codec || 'H.264 / HEVC' },
      { label: 'Protocol', value: 'RTMP / SRT / HLS' }
    ].filter(Boolean)
  };

  const channel = {
    id: `${location.id}-channel`,
    label: 'Sardius Channel',
    type: 'channel',
    icon: 'tower',
    x: c.channel,
    y,
    contained: true,
    badge: 'tag',
    metadata: {
      series: location.name,
      categories: location.categories,
      note: location.customMetadataNote
    },
    description: 'Platform ingest point. Metadata is applied here.',
    details: 'The channel is platform infrastructure, configured per location.',
    specs: [
      { label: 'Ingest', value: 'SRT / RTMP' },
      { label: 'Config', value: `Series = ${location.name}` },
      { label: 'Categories', value: location.categories },
      { label: 'Health', value: 'Bitrate, uptime, packet loss' }
    ]
  };

  const archive = {
    id: `${location.id}-archive`,
    label: 'Asset Archive',
    type: 'archive',
    icon: 'archive',
    x: c.archive,
    y,
    contained: true,
    captions: [location.categories],
    description: `Recordings captured from ${location.name}.`,
    details: 'Every recording lands here already tagged, per channel schedule.',
    specs: [
      { label: 'Capture', value: 'Scheduled + manual' },
      { label: 'Event types', value: location.categories },
      { label: 'Files', value: 'MP4 master + HLS renditions' },
      { label: 'Tagging', value: 'Automatic on capture' }
    ]
  };

  return {
    cluster: {
      id: location.id,
      label: location.name,
      x: LAYOUT.cluster.x,
      y: y - LAYOUT.cluster.halfHeight,
      width: LAYOUT.cluster.width,
      height: LAYOUT.cluster.halfHeight * 2,
      nodeIds: [source.id, encoder.id]
    },
    onSite: [source, encoder],
    channel,
    archive
  };
}


export const platform = {
  id: 'platform',
  label: 'Sardius Online Video Platform',
  titleLines: ['Sardius Online Video Platform'],
  type: 'platform',
  container: true, // drawn behind the arrows so its contents sit on top
  interactive: false, // a box this large would hover on every mouse move
  x: PLATFORM.x,
  y: PLATFORM.y,
  titleY: -PLATFORM.height / 2 + 46,
  bullets: [],
  description: 'Channels, archive and storage are all platform infrastructure.',
  details:
    'Streams arrive from each location encoder, are tagged on ingest by their channel, recorded to the per-location archive and persisted in unified storage.'
};

export const storage = {
  id: 'storage',
  label: 'Asset Storage',
  titleLines: ['Asset Storage'],
  type: 'storage',
  icon: 'cloud',
  x: LAYOUT.columns.storage,
  y: PLATFORM.y,
  contained: true,
  bullets: [
    { text: 'Unified cloud layer' },
    { text: 'Retention + auto-delete' },
    { text: 'Searchable index' }
  ],
  description: 'One persistent archive behind every location.',
  details: 'Where recordings live once captured, and what the portal searches.',
  specs: [
    { label: 'Retention', value: 'Rule-driven, per Series' },
    { label: 'Auto-delete', value: 'Scheduled sweep on expiry' },
    { label: 'Compliance', value: 'Access logs + audit trail' },
    { label: 'Index', value: 'Metadata + transcripts' }
  ]
};

export const portal = {
  id: 'pulse-portal',
  label: 'Pulse Viewing Portal',
  titleLines: ['Pulse Viewing Portal'],
  type: 'output',
  icon: 'portal',
  x: LAYOUT.columns.portal,
  y: PLATFORM.y,
  // Everything the portal does is shown at rest — no hover card, so the
  // detail that used to live in one is folded into these lines.
  interactive: false,
  bullets: [
    {
      text: 'Role-based segmentation',
      detail: 'Executive: all sites · Manager: own campus'
    },
    {
      text: 'Smart feeds by location + event type',
      detail: 'Auto-organized from Series & Categories'
    },
    { text: 'On-demand playback + live preview', detail: 'SRT / RTMP / HLS' },
    { text: 'Searchable archive', detail: 'Location, event type, transcript text' },
    { divider: 'Sardius AI', mark: 'sardius-ai' },
    {
      text: 'Sardius AI-powered search across transcripts',
      detail: 'Full-text, every recording'
    },
    {
      text: 'Sardius AI intelligent cue points',
      detail: 'Key moments surfaced automatically'
    },
    {
      text: 'Sardius AI pattern detection',
      detail: 'Consistency + technical issues, all sites'
    }
  ],
  description: 'One dashboard across every location, with Sardius AI built in.'
};

/**
 * Builds every node, cluster frame and connector for one vertical.
 * Called from PulseDiagram and memoised there.
 */
export function buildDiagram(vertical) {
  const built = vertical.locations.map(lane);

  return {
    clusters: built.map((b) => b.cluster),
    nodes: [
      platform, // first: it is the container the middle stages sit inside
      ...built.flatMap((b) => b.onSite),
      ...built.map((b) => b.channel),
      ...built.map((b) => b.archive),
      storage,
      portal
    ],
    connections: [
      ...built.flatMap((b) => [
        { from: b.onSite[0].id, to: b.onSite[1].id, bend: 0 },
        { from: b.onSite[1].id, to: b.channel.id, bend: 0 },
        { from: b.channel.id, to: b.archive.id, bend: 0 },
        { from: b.archive.id, to: storage.id, bend: 0 }
      ]),
      { from: storage.id, to: portal.id, bend: 0 }
    ]
  };
}

/**
 * Stage headings sitting above the pipeline, in the empty band at the top of
 * the canvas. `x` is the centre of the columns the heading covers.
 */
export const stages = [
  { id: 'capture', label: 'Capture', x: (LAYOUT.columns.source + LAYOUT.columns.encoder) / 2 },
  { id: 'processing', label: 'Processing', x: LAYOUT.columns.channel },
  { id: 'archive', label: 'Archive', x: (LAYOUT.columns.archive + LAYOUT.columns.storage) / 2 },
  { id: 'delivery', label: 'Delivery', x: LAYOUT.columns.portal }
];

export const STAGE_LABEL_Y = 48;

export const CANVAS = LAYOUT.canvas;
