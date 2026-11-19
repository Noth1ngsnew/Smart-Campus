import { useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import { CheckCircle2, DoorOpen, XCircle, Sparkles, Loader2 } from 'lucide-react';
import type { CheckResult } from '@/lib/availability';
import { minutesToLabel } from '@/lib/time';
import { explainAvailability, type ExplainOutput } from '@/lib/explain';

const RESULT_STYLES: Record<
  CheckResult['kind'],
  {
    panel: string;
    icon: LucideIcon;
    iconClass: string;
    title: string;
    titleClass: string;
    messageClass: string;
  }
> = {
  available: {
    panel: 'border-emerald-200 bg-emerald-50',
    icon: CheckCircle2,
    iconClass: 'text-emerald-600',
    title: 'Available',
    titleClass: 'text-emerald-800',
    messageClass: 'text-emerald-700',
  },
  unavailable: {
    panel: 'border-amber-200 bg-amber-50',
    icon: DoorOpen,
    iconClass: 'text-amber-600',
    title: 'Unavailable',
    titleClass: 'text-amber-800',
    messageClass: 'text-amber-700',
  },
  invalid: {
    panel: 'border-red-200 bg-red-50',
    icon: XCircle,
    iconClass: 'text-red-600',
    title: 'Invalid input',
    titleClass: 'text-red-800',
    messageClass: 'text-red-700',
  },
};

export default function ResultCard({
  result,
  roomName,
  startRaw,
  endRaw,
}: {
  result: CheckResult;
  roomName: string;
  startRaw: string;
  endRaw: string;
}) {
  const style = RESULT_STYLES[result.kind];
  const Icon = style.icon;
  const start = parseInt(startRaw, 10);
  const end = parseInt(endRaw, 10);
  const message =
    result.kind === 'available'
      ? `${roomName} is free for ${minutesToLabel(start)} – ${minutesToLabel(end)}.`
      : result.message;

  const canExplain = result.kind === 'available' || result.kind === 'unavailable';
  const [explanation, setExplanation] = useState<ExplainOutput | null>(null);
  const [explaining, setExplaining] = useState(false);

  const handleExplain = async () => {
    if (!canExplain || explaining) return;
    setExplaining(true);
    try {
      const out = await explainAvailability({
        roomLabel: roomName.slice(0, 40),
        start: Number.isNaN(start) ? 0 : start,
        end: Number.isNaN(end) ? 0 : end,
        isAvailable: result.kind === 'available',
        reasonCode: result.reasonCode,
      });
      setExplanation(out);
    } finally {
      setExplaining(false);
    }
  };

  return (
    <section
      aria-live="polite"
      data-testid="result"
      data-kind={result.kind}
      className={`rounded-2xl border p-5 shadow-sm sm:p-6 ${style.panel}`}
    >
      <div className="flex items-center gap-3">
        <Icon className={`h-7 w-7 shrink-0 ${style.iconClass}`} />
        <div>
          <p className={`text-lg font-bold ${style.titleClass}`}>{style.title}</p>
          <p className={`text-sm ${style.messageClass}`}>{message}</p>
        </div>
      </div>

      {canExplain && (
        <div className="mt-4">
          <button
            type="button"
            onClick={handleExplain}
            disabled={explaining}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
            aria-label="Explain availability"
          >
            {explaining ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            {explaining ? 'Explaining…' : 'Explain availability'}
          </button>

          {explanation && (
            <div
              data-testid="explanation"
              className="mt-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3"
            >
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                AI-generated explanation (not a booking confirmation)
              </p>
              <p className="text-sm text-slate-700">{explanation.explanation}</p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
