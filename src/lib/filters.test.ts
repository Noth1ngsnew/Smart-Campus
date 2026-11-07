import { describe, it, expect } from 'vitest';
import { filterRooms } from '@/lib/filters';
import { checkRoom } from '@/lib/availability';
import { ROOMS, type Room } from '@/data/rooms';

const NOW = 540;

const rooms: Room[] = [
  { id: 'S', name: 'Small', capacity: 4, equipment: ['whiteboard'], blocked: false, bookings: [] },
  { id: 'M', name: 'Medium', capacity: 12, equipment: ['projector', 'whiteboard'], blocked: false, bookings: [{ start: 600, end: 660 }] },
  { id: 'L', name: 'Large', capacity: 30, equipment: ['projector', 'whiteboard', 'microphone'], blocked: false, bookings: [] },
  { id: 'X', name: 'Blocked', capacity: 80, equipment: ['projector', 'microphone'], blocked: true, bookings: [] },
];

const ids = (list: Room[]) => list.map((r) => r.id);

describe('Catalog data', () => {
  it('has at least 4 rooms with unique ids', () => {
    expect(ROOMS.length).toBeGreaterThanOrEqual(4);
    expect(new Set(ROOMS.map((r) => r.id)).size).toBe(ROOMS.length);
  });
});

describe('F1: capacity filter', () => {
  it('includes a room with exactly the requested capacity', () => {
    expect(ids(filterRooms(rooms, { attendees: 12, equipment: [] }))).toContain('M');
  });
  it('excludes a room with insufficient capacity (13 > 12)', () => {
    expect(ids(filterRooms(rooms, { attendees: 13, equipment: [] }))).not.toContain('M');
  });
});

describe('F2: equipment filter', () => {
  it('requires ALL selected items', () => {
    expect(ids(filterRooms(rooms, { attendees: null, equipment: ['projector', 'whiteboard'] }))).toEqual(['M', 'L']);
  });
  it('excludes rooms missing any one selected item', () => {
    expect(ids(filterRooms(rooms, { attendees: null, equipment: ['projector', 'microphone', 'whiteboard'] }))).toEqual(['L']);
  });
  it('combines capacity and equipment', () => {
    expect(ids(filterRooms(rooms, { attendees: 10, equipment: ['projector'] }))).toEqual(['M', 'L', 'X']);
  });
});

describe('F3: blocked room', () => {
  it('is never reported as available', () => {
    const r = checkRoom(rooms[3], '700', '760', NOW);
    expect(r).toEqual({ kind: 'unavailable', message: 'Room is blocked' });
  });
});

describe('F4: empty state data', () => {
  it('returns an empty list when no room matches', () => {
    expect(filterRooms(rooms, { attendees: 100, equipment: [] })).toEqual([]);
  });
});

describe('F5: availability uses the chosen room only', () => {
  it('same time is unavailable in room M but available in room L', () => {
    expect(checkRoom(rooms[1], '610', '650', NOW).kind).toBe('unavailable');
    expect(checkRoom(rooms[2], '610', '650', NOW).kind).toBe('available');
  });
});

describe('filterRooms safety', () => {
  it('does not mutate the input list', () => {
    const before = JSON.stringify(rooms);
    filterRooms(rooms, { attendees: 10, equipment: ['projector'] });
    expect(JSON.stringify(rooms)).toBe(before);
  });
});