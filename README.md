# Smart Campus Room Availability Checker

Single-page React + TypeScript + Vite app. Fictional data only; no login, payments, API or database.

## Setup
npm install

## Run
npm run dev

## Test
npm test            # run all tests once (Vitest)
npm run test:watch  # re-run on change
npm run typecheck
npm run build

## Structure
- src/data/rooms.ts: room catalog (5 fictional rooms)
- src/lib/time.ts, availability.ts: time formatting, canBook, checkRoom
- src/lib/filters.ts: capacity + equipment filtering
- src/components/: UI components
- src/*.test.ts(x): 25 tests (AC1-AC5 regression, F1-F5, UI integration)

## Versions
- Initial version: first commit on main (<paste commit hash>)
- Final version: <paste final commit hash>
