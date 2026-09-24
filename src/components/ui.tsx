import { ReactNode } from 'react';
import { ago } from '../lib/data/cache';

export const Chip = ({ tone = 'mist', children }: { tone?: 'mist' | 'gold' | 'clear' | 'caution' | 'warning'; children: ReactNode }) => {
  const map = {
    mist: 'border-mist/30 text-mist',
    gold: 'border-gold/40 text-gold',
    clear: 'border-clear/40 text-clear',
    caution: 'border-caution/40 text-caution',
    warning: 'border-warning/40 text-warning',
  } as const;
  return <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold tracking-wide uppercase ${map[tone]}`}>{children}</span>;
};

export const Dot = ({ tone }: { tone: 'clear' | 'caution' | 'warning' }) => (
  <span className={`inline-block size-2 rounded-full ${tone === 'clear' ? 'bg-clear' : tone === 'caution' ? 'bg-caution' : 'bg-warning'}`} aria-hidden="true" />
);

export const SourceLine = ({ label, at, stale }: { label: string; at?: number; stale?: boolean }) => (
  <p className="mt-3 text-[11px] text-mist">
    {label}{at ? ` · updated ${ago(at)}` : ''}{stale ? ' · offline copy' : ''}
  </p>
);

export const Btn = ({ children, onClick, kind = 'gold', className = '', ariaLabel }: { children: ReactNode; onClick?: () => void; kind?: 'gold' | 'ghost'; className?: string; ariaLabel?: string }) => (
  <button onClick={onClick} aria-label={ariaLabel}
    className={`btn-press inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold tracking-wide ${
      kind === 'gold' ? 'bg-gold text-kiswa hover:bg-gold-soft' : 'border border-mist/40 text-sand hover:border-gold/60 hover:text-gold'
    } ${className}`}>
    {children}
  </button>
);

export const SectionTitle = ({ kicker, children, arabic }: { kicker?: string; children: ReactNode; arabic?: string }) => (
  <div className="mb-6">
    {kicker && <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-gold">{kicker}</p>}
    <h2 className="font-display text-3xl font-semibold leading-tight text-sand sm:text-4xl">{children}</h2>
    {arabic && <p className="font-arabic mt-2 text-xl text-mist" lang="ar">{arabic}</p>}
  </div>
);
