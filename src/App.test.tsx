import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '@/App';
import { ROOMS } from '@/data/rooms';

afterEach(cleanup);

const noBookings = ROOMS.find((r) => !r.blocked && r.bookings.length === 0)!;
const blockedRoom = ROOMS.find((r) => r.blocked)!;

const listed = (id: string) => screen.queryByTestId(`room-${id}`) !== null;
const kind = () => screen.getByTestId('result').getAttribute('data-kind');

describe('UI integration', () => {
  it('F5: switching room refreshes the result for the same time', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.type(screen.getByLabelText(/^start/i), '610');
    await user.type(screen.getByLabelText(/^end/i), '650');
    expect(kind()).toBe('unavailable'); // first room has a 600-660 booking
    await user.click(screen.getByTestId(`room-${noBookings.id}`));
    expect(kind()).toBe('available');
  });

  it('F1/F4: capacity filter keeps exact capacity and shows empty state', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.type(screen.getByLabelText(/attendees/i), '30');
    for (const r of ROOMS) expect(listed(r.id)).toBe(r.capacity >= 30);
    await user.clear(screen.getByLabelText(/attendees/i));
    await user.type(screen.getByLabelText(/attendees/i), '1000');
    expect(screen.getByTestId('empty-state')).toBeTruthy();
    expect(screen.queryByTestId('result')).toBeNull();
  });

  it('F2: equipment filter requires ALL selected items', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByLabelText('projector'));
    await user.click(screen.getByLabelText('microphone'));
    for (const r of ROOMS) {
      const both = r.equipment.includes('projector') && r.equipment.includes('microphone');
      expect(listed(r.id)).toBe(both);
    }
  });

  it('F3: a blocked room is reported unavailable in the UI', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.type(screen.getByLabelText(/attendees/i), String(blockedRoom.capacity));
    await user.type(screen.getByLabelText(/^start/i), '700');
    await user.type(screen.getByLabelText(/^end/i), '760');
    expect(kind()).toBe('unavailable');
    expect(screen.getByTestId('result').textContent).toContain('blocked');
  });
});