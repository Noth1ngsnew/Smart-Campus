import type { LucideIcon } from 'lucide-react';
import { CheckCircle2, DoorOpen, XCircle } from 'lucide-react';
import type { CheckResult } from '@/lib/availability';
import { minutesToLabel } from '@/lib/time';

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
    </section>
  );
}
