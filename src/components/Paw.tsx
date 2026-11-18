export default function Paw({ className = "", size = 24 }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-hidden="true">
      <ellipse cx="50" cy="66" rx="23" ry="19" fill="currentColor" />
      <ellipse cx="24" cy="42" rx="11" ry="14" fill="currentColor" transform="rotate(-18 24 42)" />
      <ellipse cx="42" cy="27" rx="11" ry="14" fill="currentColor" transform="rotate(-6 42 27)" />
      <ellipse cx="60" cy="27" rx="11" ry="14" fill="currentColor" transform="rotate(6 60 27)" />
      <ellipse cx="77" cy="42" rx="11" ry="14" fill="currentColor" transform="rotate(18 77 42)" />
    </svg>
  );
}
