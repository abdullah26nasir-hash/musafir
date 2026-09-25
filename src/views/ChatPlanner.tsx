import { useEffect, useRef, useState } from 'react';
import { PlanInput } from '../types';
import { Btn } from '../components/ui';
import { Star } from '../components/Star';

const ORIGINS = ['London', 'Birmingham', 'Manchester', 'Leicester', 'Bradford', 'Glasgow'];
const MONTHS = (() => {
  const out: string[] = [];
  const d = new Date(); d.setDate(1); d.setMonth(d.getMonth() + 1);
  for (let i = 0; i < 12; i++) { out.push(d.toLocaleString('en-GB', { month: 'long', year: 'numeric' })); d.setMonth(d.getMonth() + 1); }
  return out;
})();

type Msg = { from: 'bot' | 'you'; text: string };
type Step = 'origin' | 'travelers' | 'month' | 'nights' | 'budget' | 'route' | 'done';

const QUESTION: Record<Exclude<Step, 'done'>, string> = {
  origin: 'First things first. Where are you flying from?',
  travelers: 'Nice. How many of you are going?',
  month: 'When are you thinking?',
  nights: 'How long do you want to be there for?',
  budget: 'Last money question. Roughly what budget per person? Ballpark is fine.',
  route: 'One last thing. Makkah first, or Madinah first to ease in?',
};

const BUDGETS = [
  { label: 'About £900', v: 900 }, { label: 'About £1,400', v: 1400 },
  { label: 'About £1,800', v: 1800 }, { label: '£2,400+', v: 2400 },
];
const NIGHTS = [7, 10, 14, 21];

export const ChatPlanner = ({ onDone, onForm }: { onDone: (p: PlanInput) => void; onForm: () => void }) => {
  const [msgs, setMsgs] = useState<Msg[]>([{ from: 'bot', text: "Salaam. I'll ask a few quick questions and build the plan from your answers. Six of them, that's all." }]);
  const [step, setStep] = useState<Step>('origin');
  const [typing, setTyping] = useState(false);
  const [monthIdx, setMonthIdx] = useState(0);
  const ans = useRef<Partial<PlanInput>>({});
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }); }, [msgs, typing, step]);

  const ask = (next: Exclude<Step, 'done'>) => {
    setTyping(true);
    setStep('done' as Step); // hide chips while typing
    window.setTimeout(() => {
      setMsgs(m => [...m, { from: 'bot', text: QUESTION[next] }]);
      setTyping(false);
      setStep(next);
    }, 500);
  };

  const answer = (text: string, patch: Partial<PlanInput>, next: Exclude<Step, 'done'>) => {
    ans.current = { ...ans.current, ...patch };
    setMsgs(m => [...m, { from: 'you', text }]);
    ask(next);
  };

  const finish = (route: PlanInput['route'], label: string) => {
    ans.current = { ...ans.current, route } as PlanInput;
    const a = ans.current as PlanInput;
    setMsgs(m => [...m, { from: 'you', text: label }]);
    setTyping(true);
    setStep('done');
    window.setTimeout(() => {
      setMsgs(m => [...m, { from: 'bot', text: `Done. ${a.travelers} ${a.travelers === 1 ? 'traveller' : 'travellers'} from ${a.origin}, ${a.month}, ${a.nights} nights, about £${a.budget.toLocaleString('en-GB')} each, ${a.route === 'makkah-first' ? 'Makkah first' : 'Madinah first'}. Three packages coming up.` }]);
      setTyping(false);
      window.setTimeout(() => onDone(a), 900);
    }, 600);
  };

  const Bubble = ({ m }: { m: Msg }) => (
    <div className={`fade-in flex ${m.from === 'you' ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-[15px] leading-relaxed ${m.from === 'you' ? 'bg-dome text-white' : 'card shadow-card text-sand'}`}>{m.text}</div>
    </div>
  );

  const Opt = ({ label, onClick }: { label: string; onClick: () => void }) => (
    <button onClick={onClick} className="btn-press min-h-11 rounded-full border border-mist/30 px-5 text-sm font-semibold text-sand hover:border-gold hover:text-gold">{label}</button>
  );

  return (
    <div className="mx-auto flex min-h-dvh max-w-xl flex-col px-5 pb-8 pt-4">
      <div className="flex items-center justify-between pb-4">
        <div className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-full bg-dome/10"><Star size={16} className="text-gold" /></span>
          <div>
            <p className="font-display text-base font-semibold leading-none">Musafir</p>
            <p className="mt-1 text-[11px] text-mist">Plans from your answers</p>
          </div>
        </div>
        <button onClick={onForm} className="btn-press min-h-11 rounded-full border border-mist/30 px-4 text-xs font-bold text-mist hover:text-sand">Use the form instead</button>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto pb-4" role="log" aria-live="polite" aria-label="Chat with Musafir">
        {msgs.map((m, i) => <Bubble key={i} m={m} />)}
        {typing && (
          <div className="fade-in flex justify-start">
            <div className="card shadow-card flex items-center gap-1.5 rounded-2xl px-4 py-3" aria-label="Musafir is typing">
              <span className="size-1.5 animate-pulse rounded-full bg-mist" /><span className="size-1.5 animate-pulse rounded-full bg-mist" style={{ animationDelay: '150ms' }} /><span className="size-1.5 animate-pulse rounded-full bg-mist" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {!typing && step === 'origin' && (
        <div className="fade-in flex flex-wrap gap-2 pt-2">{ORIGINS.map(o => <Opt key={o} label={o} onClick={() => answer(o, { origin: o }, 'travelers')} />)}</div>
      )}
      {!typing && step === 'travelers' && (
        <div className="fade-in flex flex-wrap gap-2 pt-2">{[1, 2, 3, 4, 5, 6].map(n => <Opt key={n} label={n === 6 ? '6+' : String(n)} onClick={() => answer(n === 6 ? '6+' : String(n), { travelers: n }, 'month')} />)}</div>
      )}
      {!typing && step === 'month' && (
        <div className="fade-in flex flex-wrap items-center gap-2 pt-2">
          {MONTHS.slice(monthIdx, monthIdx + 3).map(m => <Opt key={m} label={m} onClick={() => answer(m, { month: m }, 'nights')} />)}
          {monthIdx + 3 < MONTHS.length && <Opt label="Later months" onClick={() => setMonthIdx(i => Math.min(i + 3, MONTHS.length - 3))} />}
        </div>
      )}
      {!typing && step === 'nights' && (
        <div className="fade-in flex flex-wrap gap-2 pt-2">{NIGHTS.map(n => <Opt key={n} label={`${n} nights`} onClick={() => answer(`${n} nights`, { nights: n }, 'budget')} />)}</div>
      )}
      {!typing && step === 'budget' && (
        <div className="fade-in flex flex-wrap gap-2 pt-2">{BUDGETS.map(b => <Opt key={b.v} label={b.label} onClick={() => answer(b.label, { budget: b.v }, 'route')} />)}</div>
      )}
      {!typing && step === 'route' && (
        <div className="fade-in flex flex-wrap gap-2 pt-2">
          <Opt label="Makkah first" onClick={() => finish('makkah-first', 'Makkah first')} />
          <Opt label="Madinah first" onClick={() => finish('madinah-first', 'Madinah first')} />
        </div>
      )}
      {step === 'done' && !typing && msgs[msgs.length - 1]?.from === 'bot' && null}
    </div>
  );
};
