import { SunIcon, MoonIcon } from '../icons/index.jsx';

export default function ModeToggle({ theme, onToggle }) {
  const next = theme === 'dark' ? 'light' : 'dark';
  return (
    <button
      type="button"
      className="mode-toggle"
      onClick={onToggle}
      aria-label={`Switch to ${next} mode`}
      title={`Switch to ${next} mode`}
    >
      {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
      <span>{next}</span>
    </button>
  );
}
