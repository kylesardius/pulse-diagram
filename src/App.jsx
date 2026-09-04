import PageHeader from './components/PageHeader.jsx';
import ProblemSolution from './components/ProblemSolution.jsx';
import PulseDiagram from './components/PulseDiagram.jsx';
import TextSummary from './components/TextSummary.jsx';
import FeatureSpotlight from './components/FeatureSpotlight.jsx';
import CTASection from './components/CTASection.jsx';
import useTheme from './lib/useTheme.js';
import useVertical, { FADE_MS } from './lib/useVertical.js';

const INTRO =
  'Video flows left-to-right through the platform, from capture to viewing. Hover any component to see how it works. Select a use case above to see terminology specific to your industry.';

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const { vertical, verticalId, selectedId, selectVertical, isFading } = useVertical();

  // Content fades out, swaps while invisible, then fades back in.
  const fade = {
    opacity: isFading ? 0 : 1,
    transition: `opacity ${FADE_MS}ms ease`
  };

  return (
    <div className="page">
      <div className="page-shell">
        <PageHeader
          theme={theme}
          onToggleTheme={toggleTheme}
          verticalId={selectedId}
          onSelectVertical={selectVertical}
        />

        <div style={fade}>
          <ProblemSolution vertical={vertical} />
        </div>

        <p className="page-intro">{INTRO}</p>

        <main className="diagram-region" style={fade}>
          {/* Keyed so hover state never survives a vertical change. */}
          <PulseDiagram key={verticalId} vertical={vertical} />
        </main>

        <TextSummary />
        <FeatureSpotlight />
        <CTASection />

        <footer className="page-footer">Pulse solution &middot; {vertical.label}</footer>
      </div>
    </div>
  );
}
