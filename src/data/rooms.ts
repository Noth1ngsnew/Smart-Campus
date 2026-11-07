import type { Booking } from '@/lib/availability';

export type Room = {
  id: string;
  name: string;
  capacity: number;
  equipment: string[];
  blocked: boolean;
  bookings: Booking[];
};

export const ROOMS: Room[] = [
  {
    id: 'B-204',
    name: 'B-204',
    capacity: 30,
    equipment: ['projector', 'whiteboard', 'microphone'],
    blocked: false,
    bookings: [{ start: 600, end: 660 }],
  },
  {
    id: 'A-101',
    name: 'A-101 Seminar Room',
    capacity: 12,
    equipment: ['projector', 'whiteboard'],
    blocked: false,
    bookings: [{ start: 600, end: 660 }],
  },
  {
    id: 'C-310',
    name: 'C-310 Computer Lab',
    capacity: 24,
    equipment: ['computers', 'projector'],
    blocked: false,
    bookings: [
      { start: 780, end: 840 },
      { start: 900, end: 960 },
    ],
  },
  {
    id: 'D-015',
    name: 'D-015 Study Room',
    capacity: 4,
    equipment: ['whiteboard'],
    blocked: false,
    bookings: [],
  },
  {
    id: 'E-402',
    name: 'E-402 Annex',
    capacity: 80,
    equipment: ['projector', 'microphone'],
    blocked: true,
    bookings: [],
  },
];
