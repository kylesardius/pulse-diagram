import ModeToggle from './ModeToggle.jsx';
import VerticalSelect from './VerticalSelect.jsx';

const SUBHEADING =
  'Understand how Pulse captures, processes, and delivers every campus recording—and makes it instantly accessible for review.';

export default function PageHeader({ theme, onToggleTheme, verticalId, onSelectVertical }) {
  return (
    <div className="page-header">
      <div className="page-header-top">
        <div className="brand">
          {/* Placeholder mark — swap for the real Sardius logo asset. */}
          <span className="brand-mark" aria-hidden="true" />
          <span className="brand-name">Sardius Media</span>
        </div>

        <nav className="breadcrumb" aria-label="Breadcrumb">
          <ol>
            <li>
              <a href="#solutions">Solutions</a>
            </li>
            <li aria-current="page">Pulse</li>
          </ol>
        </nav>

        <div className="toolbar">
          <VerticalSelect value={verticalId} onChange={onSelectVertical} />
          <ModeToggle theme={theme} onToggle={onToggleTheme} />
        </div>
      </div>

      <h1 className="page-title">How Pulse Works</h1>
      <p className="page-subheading">{SUBHEADING}</p>
    </div>
  );
}
