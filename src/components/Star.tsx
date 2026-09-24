// The 8-point khatam star - Musafir's motif (loader, bullets, watermark).
export const Star = ({ size = 24, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className} aria-hidden="true">
    <rect x="8" y="8" width="24" height="24" stroke="currentColor" strokeWidth="2.5" />
    <rect x="8" y="8" width="24" height="24" stroke="currentColor" strokeWidth="2.5" transform="rotate(45 20 20)" />
  </svg>
);
export const Spinner = ({ className = 'text-gold' }: { className?: string }) => (
  <div className={`spin-slow inline-block ${className}`} role="status" aria-label="Loading"><Star size={22} /></div>
);
