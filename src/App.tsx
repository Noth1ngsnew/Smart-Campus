import { useState, useMemo } from 'react';
import { Clock, DoorClosed, DoorOpen, Lock, Unlock, CalendarX, CheckCircle2, XCircle } from 'lucide-react';
import { minutesToLabel } from '@/lib/time';
import { canBook, type Booking } from '@/lib/availability';

const INITIAL_NOW = 540; // 09:00
const INITIAL_BLOCKED = false;
const INITIAL_BOOKINGS: Booking[] = [{ start: 600, end: 660 }]; // 10:00 - 11:00

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: typeof Clock;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
        <p className="text-sm font-semibold leading-snug text-slate-900">{value}</p>
      </div>
    </div>
  );
}

export default function App() {
  const [now] = useState(INITIAL_NOW);
  const [blocked, setBlocked] = useState(INITIAL_BLOCKED);
  const [bookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [startRaw, setStartRaw] = useState('');
  const [endRaw, setEndRaw] = useState('');

  const result = useMemo(
    () => (startRaw === '' && endRaw === '' ? null : canBook(startRaw, endRaw, now, blocked, bookings)),
    [startRaw, endRaw, now, blocked, bookings]
  );

  const availableCount = bookings.length;

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto w-full max-w-xl">
        <header className="mb-8 text-center">
          <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
            <DoorClosed className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Room B-204 Availability
          </h1>
          <p className="mt-2 text-sm text-slate-600 sm:text-base">
            Check whether the room is free for your chosen time. No booking is created.
          </p>
        </header>

        {/* Live state panel */}
        <section
          aria-label="Current room state"
          className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3"
        >
          <StatCard label="Current time (now)" value={`${minutesToLabel(now)} — ${now} min`} icon={Clock} />
          <StatCard
            label="Room status"
            value={blocked ? 'Blocked' : 'Open'}
            icon={blocked ? Lock : Unlock}
          />
          <StatCard
            label="Existing bookings"
            value={`${availableCount} on file`}
            icon={CalendarX}
          />
        </section>

        {/* Bookings list */}
        <section
          aria-label="Existing bookings"
          className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-700">
            Existing bookings
          </h2>
          {bookings.length === 0 ? (
            <p className="text-sm text-slate-500">No bookings recorded.</p>
          ) : (
            <ul className="space-y-2">
              {bookings.map((b, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm"
                >
                  <span className="font-medium text-slate-800">
                    {minutesToLabel(b.start)} – {minutesToLabel(b.end)}
                  </span>
                  <span className="text-slate-500">{b.start}–{b.end} min</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Checker form */}
        <section
          aria-label="Check availability"
          className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
        >
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-700">
            Check a time
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">
                Start (minutes after midnight)
              </span>
              <input
                type="number"
                inputMode="numeric"
                step={1}
                min={0}
                max={1440}
                value={startRaw}
                onChange={(e) => setStartRaw(e.target.value)}
                placeholder="e.g. 660"
                className="w-full rounded-lg border border-slate-300 px-3 py-3 text-base text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">
                End (minutes after midnight)
              </span>
              <input
                type="number"
                inputMode="numeric"
                step={1}
                min={0}
                max={1440}
                value={endRaw}
                onChange={(e) => setEndRaw(e.target.value)}
                placeholder="e.g. 720"
                className="w-full rounded-lg border border-slate-300 px-3 py-3 text-base text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </label>
          </div>

          <label className="mt-5 flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 select-none">
            <input
              type="checkbox"
              checked={blocked}
              onChange={(e) => setBlocked(e.target.checked)}
              className="h-5 w-5 rounded border-slate-400 text-blue-600 focus:ring-blue-500"
            />
            <span className="flex items-center gap-2 text-sm font-medium text-slate-700">
              {blocked ? <Lock className="h-4 w-4 text-red-600" /> : <Unlock className="h-4 w-4 text-emerald-600" />}
              Mark room as blocked (for testing)
            </span>
          </label>
        </section>

        {/* Result */}
        {result && (
          <section
            aria-live="polite"
            className={`rounded-2xl border p-5 shadow-sm sm:p-6 ${
              result.kind === 'available'
                ? 'border-emerald-200 bg-emerald-50'
                : result.kind === 'unavailable'
                ? 'border-amber-200 bg-amber-50'
                : 'border-red-200 bg-red-50'
            }`}
          >
            {result.kind === 'available' ? (
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-7 w-7 shrink-0 text-emerald-600" />
                <div>
                  <p className="text-lg font-bold text-emerald-800">Available</p>
                  <p className="text-sm text-emerald-700">
                    Room B-204 is free for {minutesToLabel(parseInt(startRaw, 10))} – {minutesToLabel(parseInt(endRaw, 10))}.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                {result.kind === 'unavailable' ? (
                  <DoorOpen className="h-7 w-7 shrink-0 text-amber-600" />
                ) : (
                  <XCircle className="h-7 w-7 shrink-0 text-red-600" />
                )}
                <div>
                  <p
                    className={`text-lg font-bold ${
                      result.kind === 'unavailable' ? 'text-amber-800' : 'text-red-800'
                    }`}
                  >
                    {result.kind === 'unavailable' ? 'Unavailable' : 'Invalid input'}
                  </p>
                  <p
                    className={`text-sm ${
                      result.kind === 'unavailable' ? 'text-amber-700' : 'text-red-700'
                    }`}
                  >
                    {result.message}
                  </p>
                </div>
              </div>
            )}
          </section>
        )}

        <footer className="mt-8 text-center text-xs text-slate-400">
          Times are integer minutes after midnight (0–1440). This tool only checks availability — it never creates a booking.
        </footer>
      </div>
    </div>
  );
}