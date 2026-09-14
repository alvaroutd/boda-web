export default function DiscoBall({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      fill="none"
      stroke="currentColor"
      aria-hidden="true"
    >
      <defs>
        <clipPath id="disco-ball-round">
          <circle cx="16" cy="16" r="12" />
        </clipPath>
      </defs>

      <circle cx="16" cy="16" r="12" strokeWidth="1" />

      <g clipPath="url(#disco-ball-round)" strokeWidth="0.7" opacity="0.85">
        <path d="M4 7.5 H28 M4 10.5 H28 M4 13.5 H28 M4 16.5 H28 M4 19.5 H28 M4 22.5 H28 M4 25.5 H28" />
        <path d="M8 4 V28 M11.5 4 V28 M16 4 V28 M20.5 4 V28 M24 4 V28" />
        <path d="M6.3 4 C10 16 10 16 6.3 28" />
        <path d="M25.7 4 C22 16 22 16 25.7 28" />
      </g>
    </svg>
  );
}
