/**
 * Sardius AI mark, cached locally from
 * https://framerusercontent.com/images/3hyogyvfAgyGZnBkj1oYLMHjeM.svg
 *
 * The source art is a single path in one flat colour, so it is re-pointed at
 * `currentColor` and tints with whatever it sits on.
 */
const PATH =
  'm135.94 227.912 11.24-25.745c10.004-22.909 28.008-41.147 50.466-51.116l30.939-13.733c9.836-4.366 9.836-18.675 0-23.041l-29.973-13.305c-23.036-10.225-41.363-29.138-51.195-52.83l-11.386-27.435c-4.225-10.181-18.292-10.181-22.517 0l-11.386 27.435c-9.832 23.692-28.16 42.605-51.195 52.83L20.96 114.277c-9.836 4.366-9.836 18.675 0 23.041l30.94 13.733c22.458 9.969 40.463 28.207 50.466 51.116l11.24 25.745c4.32 9.895 18.014 9.895 22.335 0m112.537 62.682 3.16-7.245c5.636-12.917 15.785-23.203 28.449-28.829l9.738-4.327c5.268-2.34 5.268-9.995 0-12.335l-9.192-4.085c-12.991-5.771-23.322-16.437-28.861-29.794l-3.246-7.829c-2.263-5.455-9.806-5.455-12.069 0l-3.245 7.829c-5.538 13.357-15.87 24.023-28.86 29.794l-9.194 4.085c-5.267 2.34-5.267 9.995 0 12.335l9.738 4.327c12.665 5.626 22.814 15.912 28.449 28.829l3.162 7.245c2.313 5.303 9.656 5.303 11.971 0';

/** Standalone mark, for use in page markup. */
export default function SardiusAIIcon({ size = 48, ...props }) {
  return (
    <svg
      viewBox="0 0 308 308"
      width={size}
      height={size}
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d={PATH} />
    </svg>
  );
}

/** The same mark as a `<g>`, centred on (x, y), for embedding in the diagram. */
export function SardiusAIMark({ x, y, size = 32 }) {
  const scale = size / 308;
  return (
    <g
      transform={`translate(${x - size / 2} ${y - size / 2}) scale(${scale})`}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d={PATH} />
    </g>
  );
}
