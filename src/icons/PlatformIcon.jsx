export default function PlatformIcon(props) {
  return (
    <g {...props}>
      <rect x="3" y="3.6" width="18" height="5.2" rx="1.6" />
      <rect x="3" y="10.4" width="18" height="5.2" rx="1.6" />
      <rect x="3" y="17.2" width="18" height="5.2" rx="1.6" />
      <circle cx="6.6" cy="6.2" r="0.75" />
      <circle cx="6.6" cy="13" r="0.75" />
      <circle cx="6.6" cy="19.8" r="0.75" />
      <path d="M15.2 6.2h2.6M15.2 13h2.6M15.2 19.8h2.6" />
    </g>
  );
}
