import type { Booking } from '@/lib/availability';
import { minutesToLabel } from '@/lib/time';

export default function BookingsList({ bookings }: { bookings: Booking[] }) {
  return (
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
  );
}
