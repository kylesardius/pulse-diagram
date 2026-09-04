import { ClockIcon, GlobeIcon, ShieldIcon, SardiusAIIcon } from '../icons/index.jsx';

const FEATURES = [
  {
    id: 'same-day',
    Icon: ClockIcon,
    title: 'Same-Day Review',
    body: 'Access recordings within minutes of capture.'
  },
  {
    id: 'multi-location',
    Icon: GlobeIcon,
    title: 'Multi-Location Visibility',
    body: 'Monitor and review all locations from one dashboard.'
  },
  {
    id: 'ai',
    Icon: SardiusAIIcon,
    // The Sardius AI mark is a logo, not a glyph: it gets its own treatment
    // rather than sitting inside the red square the stroke icons use.
    isBrandMark: true,
    title: 'Sardius AI Insights',
    body: 'Intelligent cue points, pattern detection across locations, searchable transcripts powered by Sardius AI.'
  },
  {
    id: 'access',
    Icon: ShieldIcon,
    title: 'Role-Based Access',
    body: 'Granular permissions for executives, faculty, campus managers.'
  }
];

export default function FeatureSpotlight() {
  return (
    <section className="features" aria-labelledby="features-heading">
      <h2 className="section-heading" id="features-heading">
        Why teams choose Pulse
      </h2>
      <ul className="feature-grid">
        {FEATURES.map(({ id, Icon, title, body, isBrandMark }) => (
          <li className="feature-card" key={id}>
            <span className={`feature-icon ${isBrandMark ? 'feature-icon--mark' : ''}`}>
              <Icon size={isBrandMark ? 48 : undefined} />
            </span>
            <h3 className="feature-title">{title}</h3>
            <p className="feature-body">{body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
