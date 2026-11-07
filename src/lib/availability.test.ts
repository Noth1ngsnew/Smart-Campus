import { describe, it, expect } from 'vitest';
import { canBook } from '@/lib/availability';

const NOW = 540; // 09:00
const BOOKINGS = [{ start: 600, end: 660 }]; // 10:00-11:00

describe('AC regression: canBook', () => {
  it('AC1: rejects non-numeric input', () => {
    expect(canBook('abc', '700', NOW, false, BOOKINGS).kind).toBe('invalid');
  });
  it('AC1: rejects start >= end', () => {
    expect(canBook('700', '700', NOW, false, BOOKINGS).kind).toBe('invalid');
  });
  it('AC1: rejects start at or before current time', () => {
    expect(canBook('540', '600', NOW, false, []).kind).toBe('unavailable');
  });
  it('AC1: accepts start one minute after now', () => {
    expect(canBook('541', '600', NOW, false, []).kind).toBe('available');
  });
  it('AC2: accepts exactly 120 minutes', () => {
    expect(canBook('700', '820', NOW, false, BOOKINGS).kind).toBe('available');
  });
  it('AC2: rejects 121 minutes', () => {
    const r = canBook('700', '821', NOW, false, BOOKINGS);
    expect(r).toEqual({ kind: 'unavailable', message: 'Maximum duration is 120 minutes.' });
  });
  it('AC3: blocked room is never available', () => {
    const r = canBook('700', '760', NOW, true, []);
    expect(r).toEqual({ kind: 'unavailable', message: 'Room is blocked' });
  });
  it('AC4: touching end of existing booking is allowed', () => {
    expect(canBook('660', '720', NOW, false, BOOKINGS).kind).toBe('available');
  });
  it('AC4: touching start of existing booking is allowed', () => {
    expect(canBook('541', '600', NOW, false, BOOKINGS).kind).toBe('available');
  });
  it('AC4: overlapping by one minute is rejected', () => {
    expect(canBook('599', '601', NOW, false, BOOKINGS).kind).toBe('unavailable');
  });
  it('AC5: checking availability does not mutate bookings', () => {
    const copy = [{ start: 600, end: 660 }];
    const snapshot = JSON.stringify(copy);
    canBook('700', '760', NOW, false, copy);
    expect(JSON.stringify(copy)).toBe(snapshot);
  });
});