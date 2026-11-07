import type { Room } from '@/data/rooms';

export type RoomFilterCriteria = {
  attendees: number | null;
  equipment: readonly string[];
};

export function filterRooms(
  rooms: readonly Room[],
  criteria: RoomFilterCriteria
): Room[] {
  return rooms.filter(
    (room) =>
      (criteria.attendees === null || room.capacity >= criteria.attendees) &&
      criteria.equipment.every((item) => room.equipment.includes(item))
  );
}
