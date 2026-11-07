import { useState, useMemo } from 'react';
import { Clock, DoorClosed, Lock, Unlock, CalendarX } from 'lucide-react';
import { minutesToLabel } from '@/lib/time';
import { checkRoom } from '@/lib/availability';
import { filterRooms } from '@/lib/filters';
import { ROOMS } from '@/data/rooms';
import StatCard from '@/components/StatCard';
import TimeField from '@/components/TimeField';
import RoomFilters from '@/components/RoomFilters';
import RoomList from '@/components/RoomList';
import BookingsList from '@/components/BookingsList';
import ResultCard from '@/components/ResultCard';

const INITIAL_NOW = 540; // 09:00
const EQUIPMENT_OPTIONS = Array.from(new Set(ROOMS.flatMap((room) => room.equipment)));

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

        <section
          aria-label="Find a room"
          className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
        >
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-700">
            Find a room
          </h2>
          <RoomFilters
            attendeesRaw={attendeesRaw}
            onAttendeesChange={setAttendeesRaw}
            equipmentOptions={EQUIPMENT_OPTIONS}
            selectedEquipment={selectedEquipment}
            onToggleEquipment={toggleEquipment}
          />
          <RoomList
            rooms={filtered}
            selectedId={selectedRoom?.id ?? null}
            onSelect={setSelectedId}
          />
        </section>

        {selectedRoom && (
          <>
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

            <BookingsList bookings={selectedRoom.bookings} />

            <section
              aria-label="Check availability"
              className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
            >
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-700">
                Check a time
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <TimeField
                  label="Start (minutes after midnight)"
                  value={startRaw}
                  onChange={setStartRaw}
                  placeholder="e.g. 660"
                />
                <TimeField
                  label="End (minutes after midnight)"
                  value={endRaw}
                  onChange={setEndRaw}
                  placeholder="e.g. 720"
                />
              </div>
            </section>

            {result && (
              <ResultCard
                result={result}
                roomName={selectedRoom.name}
                startRaw={startRaw}
                endRaw={endRaw}
              />
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
