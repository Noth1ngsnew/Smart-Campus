import { useState, useMemo } from 'react';
import { Clock, DoorClosed, DoorOpen, Lock, Unlock, CalendarX, CheckCircle2, XCircle } from 'lucide-react';
import { minutesToLabel } from '@/lib/time';
import { checkRoom } from '@/lib/availability';
import { filterRooms } from '@/lib/filters';
import { ROOMS } from '@/data/rooms';

const INITIAL_NOW = 540; // 09:00
const EQUIPMENT_OPTIONS = Array.from(new Set(ROOMS.flatMap((room) => room.equipment)));

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
  const [attendeesRaw, setAttendeesRaw] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [startRaw, setStartRaw] = useState('');
  const [endRaw, setEndRaw] = useState('');

  const attendees = attendeesRaw.trim() === '' ? null : Number(attendeesRaw);

  const filtered = useMemo(
    () => filterRooms(ROOMS, { attendees, equipment: selectedEquipment }),
    [attendees, selectedEquipment]
  );

  const selectedRoom = filtered.find((room) => room.id === selectedId) ?? filtered[0] ?? null;

  const result = useMemo(
    () =>
      selectedRoom && !(startRaw === '' && endRaw === '')
        ? checkRoom(selectedRoom, startRaw, endRaw, now)
        : null,
    [selectedRoom, startRaw, endRaw, now]
  );

  const toggleEquipment = (item: string) =>
    setSelectedEquipment((prev) =>
      prev.includes(item) ? prev.filter((e) => e !== item) : [...prev, item]
    );

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto w-full max-w-xl">
        <header className="mb-8 text-center">
          <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
            <DoorClosed className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            {selectedRoom ? `${selectedRoom.name} Availability` : 'Room Availability'}
          </h1>
          <p className="mt-2 text-sm text-slate-600 sm:text-base">
            Check whether the room is free for your chosen time. No booking is created.
          </p>
        </header>

        {/* Room finder */}
        <section
          aria-label="Find a room"
          className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
        >
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-700">
            Find a room
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">Attendees</span>
              <input
                type="number"
                inputMode="numeric"
                step={1}
                min={1}
                value={attendeesRaw}
                onChange={(e) => setAttendeesRaw(e.target.value)}
                placeholder="Any"
                className="w-full rounded-lg border border-slate-300 px-3 py-3 text-base text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </label>
            <fieldset>
              <legend className="mb-1.5 text-sm font-medium text-slate-700">Equipment</legend>
              <div className="flex flex-wrap gap-2">
                {EQUIPMENT_OPTIONS.map((item) => (
                  <label
                    key={item}
                    className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 select-none"
                  >
                    <input
                      type="checkbox"
                      checked={selectedEquipment.includes(item)}
                      onChange={() => toggleEquipment(item)}
                      className="h-4 w-4 rounded border-slate-400 text-blue-600 focus:ring-blue-500"
                    />
                    <span>{item}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          </div>

          <div className="mt-5">
            <h3 className="mb-2 text-sm font-medium text-slate-700">Matching rooms</h3>
            {filtered.length === 0 ? (
              <p
                data-testid="empty-state"
                className="rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-600"
              >
                No rooms match your requirements. Try fewer items or fewer attendees.
              </p>
            ) : (
              <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {filtered.map((room) => {
                  const isSelected = room.id === selectedRoom?.id;
                  return (
                    <li key={room.id}>
                      <button
                        type="button"
                        data-testid={`room-${room.id}`}
                        aria-pressed={isSelected}
                        onClick={() => setSelectedId(room.id)}
                        className={`w-full rounded-lg border px-4 py-3 text-left transition ${
                          isSelected
                            ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500/20'
                            : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <span className="flex items-center justify-between gap-2">
                          <span className="text-sm font-semibold text-slate-900">{room.name}</span>
                          {room.blocked && (
                            <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                              Blocked
                            </span>
                          )}
                        </span>
                        <span className="mt-1 block text-xs text-slate-600">
                          Capacity {room.capacity} · {room.equipment.join(', ')}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </section>

        {selectedRoom && (
          <>
            {/* Live state panel */}
            <section
              aria-label="Current room state"
              className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3"
            >
              <StatCard label="Current time (now)" value={`${minutesToLabel(now)} — ${now} min`} icon={Clock} />
              <StatCard
                label="Room status"
                value={selectedRoom.blocked ? 'Blocked' : 'Open'}
                icon={selectedRoom.blocked ? Lock : Unlock}
              />
              <StatCard
                label="Existing bookings"
                value={`${selectedRoom.bookings.length} on file`}
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
              {selectedRoom.bookings.length === 0 ? (
                <p className="text-sm text-slate-500">No bookings recorded.</p>
              ) : (
                <ul className="space-y-2">
                  {selectedRoom.bookings.map((b, i) => (
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
            </section>

            {/* Result */}
            {result && (
              <section
                aria-live="polite"
                data-testid="result"
                data-kind={result.kind}
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
                        {selectedRoom.name} is free for {minutesToLabel(parseInt(startRaw, 10))} – {minutesToLabel(parseInt(endRaw, 10))}.
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
          </>
        )}

        <footer className="mt-8 text-center text-xs text-slate-400">
          Times are integer minutes after midnight (0–1440). This tool only checks availability — it never creates a booking.
        </footer>
      </div>
    </div>
  );
}
