import { verticals } from '../data/verticals.js';

function ChevronIcon() {
  return (
    <svg
      className="vertical-select-chevron"
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 9.5l6 6 6-6" />
    </svg>
  );
}

/** Pill-shaped vertical picker, sitting beside the theme toggle. */
export default function VerticalSelect({ value, onChange }) {
  return (
    <div className="vertical-select">
      <label className="vertical-select-label" htmlFor="vertical-select">
        Use Case
      </label>
      <span className="vertical-select-field">
        <select
          id="vertical-select"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        >
          {verticals.map((vertical) => (
            <option key={vertical.id} value={vertical.id}>
              {vertical.label}
            </option>
          ))}
        </select>
        <ChevronIcon />
      </span>
    </div>
  );
}
