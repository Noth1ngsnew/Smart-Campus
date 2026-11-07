import type { Room } from '@/data/rooms';

export default function RoomList({
  rooms,
  selectedId,
  onSelect,
}: {
  rooms: Room[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="mt-5">
      <h3 className="mb-2 text-sm font-medium text-slate-700">Matching rooms</h3>
      {rooms.length === 0 ? (
        <p
          data-testid="empty-state"
          className="rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-600"
        >
          No rooms match your requirements. Try fewer items or fewer attendees.
        </p>
      ) : (
        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {rooms.map((room) => {
            const isSelected = room.id === selectedId;
            return (
              <li key={room.id}>
                <button
                  type="button"
                  data-testid={`room-${room.id}`}
                  aria-pressed={isSelected}
                  onClick={() => onSelect(room.id)}
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
  );
}
