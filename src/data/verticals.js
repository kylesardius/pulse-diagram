/**
 * Vertical configurations.
 *
 * A vertical swaps the location names, their Categories, and the
 * problem/solution framing. Everything else about the diagram — the pipeline
 * stages, the platform, the portal, and the per-lane encoder hardware — is
 * identical across verticals.
 *
 * `customMetadataNote` is the optional free-text field on a channel's
 * metadata, shown only in the tag badge's hover card.
 */
export const verticals = [
  {
    id: 'church',
    label: 'Church',
    problem:
      'Multi-campus organizations wait 24-48 hours for footage, manually transferred. Feedback arrives after the moment passes.',
    solution:
      'Sardius Pulse delivers every campus recording within minutes, organized by location, with AI insights baked in. Review and act the same day.',
    locations: [
      {
        id: 'north',
        name: 'Campus North',
        categories: 'Service, Conference',
        customMetadataNote: 'Primary worship venue'
      },
      {
        id: 'south',
        name: 'Campus South',
        categories: 'Service, Youth',
        customMetadataNote: 'Weekly rehearsal space'
      },
      { id: 'downtown', name: 'Downtown Venue', categories: 'Service, Concert' }
    ]
  },
  {
    id: 'education',
    label: 'Education',
    problem:
      'Universities struggle to capture lectures across dozens of classrooms daily and deliver them reliably to approved viewers. Recordings often arrive too late to support learning, and workflows remain fragmented.',
    solution:
      'Sardius Pulse automates lecture capture across campus, making recordings available to approved viewers within minutes. One unified platform for faculty review, student access, and campus-wide events.',
    locations: [
      { id: 'science', name: 'Science Building', categories: 'Lecture, Workshop' },
      { id: 'engineering', name: 'Engineering Hall', categories: 'Training, Conference' },
      { id: 'remote', name: 'Remote Center', categories: 'Lecture, Conference' }
    ]
  },
  {
    id: 'enterprise',
    label: 'Enterprise',
    problem:
      'Multi-location enterprises face delays in distributing training, meetings, and communications. Manual file management and slow feedback loops hinder organizational alignment.',
    solution:
      'Sardius Pulse delivers every recording within minutes to approved viewers across all locations, searchable and accessible from any device. Streamline communications and training at scale.',
    locations: [
      { id: 'hq', name: 'Corporate HQ', categories: 'All-hands, Department' },
      { id: 'regional', name: 'Regional Office', categories: 'Training, Meeting' },
      { id: 'branch', name: 'Branch Location', categories: 'Town Hall, Briefing' }
    ]
  }
];

export const DEFAULT_VERTICAL = 'church';

export function getVertical(id) {
  return verticals.find((v) => v.id === id) || verticals[0];
}
