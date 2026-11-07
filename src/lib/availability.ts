export type Booking = { start: number; end: number };

export type CheckResult =
  | { kind: 'available' }
  | { kind: 'unavailable'; message: string }
  | { kind: 'invalid'; message: string };

export const MAX_DURATION = 120;

export function isIntegerInput(value: string): boolean {
  return value.trim() !== '' && /^-?\d+$/.test(value.trim());
}

export function canBook(
  startRaw: string,
  endRaw: string,
  now: number,
  blocked: boolean,
  existing: Booking[]
): CheckResult {
  if (!isIntegerInput(startRaw) || !isIntegerInput(endRaw)) {
    return { kind: 'invalid', message: 'Enter whole numbers only' };
  }

  const start = parseInt(startRaw, 10);
  const end = parseInt(endRaw, 10);

  if (start < 0 || end > 1440) {
    return { kind: 'invalid', message: 'Times must be between 0 and 1440' };
  }
  if (start >= end) {
    return { kind: 'invalid', message: 'End must be after start' };
  }
  if (start <= now) {
    return { kind: 'unavailable', message: 'Start must be after the current time.' };
  }
  if (end - start > MAX_DURATION) {
    return { kind: 'unavailable', message: 'Maximum duration is 120 minutes.' };
  }
  if (blocked) {
    return { kind: 'unavailable', message: 'Room is blocked' };
  }
  const overlaps = existing.some((b) => start < b.end && b.start < end);
  if (overlaps) {
    return { kind: 'unavailable', message: 'Overlaps an existing booking' };
  }
  return { kind: 'available' };
}
