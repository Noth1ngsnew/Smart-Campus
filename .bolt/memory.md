# Project memory

## Product intent & audience

- Smart Campus room availability/booking checker; users check whether a room can be booked for a time range.
- Optional "Explain availability" feature adds human-readable explanations of booking results; deterministic checker remains authoritative.
- Audience: campus users (students/staff) needing quick room booking feedback.

## Brand personality & voice

- Utility-first, transparent, cautious about AI claims.
- Explanations explicitly labeled as "AI-generated explanation (not a booking confirmation)" to avoid over-trust.
- Tone is concise and factual; max 2 sentences, 280 chars per explanation.

## Visual design & UX direction

- Stack: Vite + React, Tailwind CSS, Lucide React icons, React hooks. No extra UI/icon packages.
- Path alias `@/` → `src/`.
- Existing UI layout is fixed; only additive changes inside `ResultCard.tsx` (button + explanation block).
- Explanation block must be visually distinct from booking status.
- Button disabled while loading; only shown for available/unavailable results (invalid rejected before adapter call).

## Decisions, constraints & rationale

- `AGENTS.md` governs code style: pure functions, minimal changes, at most 2 justified patterns, no fixture data changes, no existing UI layout changes.
- `src/lib/availability.ts` returns `{ kind, message }`; additively extended with `reasonCode` field. Reason codes: AVAILABLE, PAST_START, MAX_DURATION, BLOCKED, OVERLAP (unavailable); INVALID_FORMAT, OUT_OF_RANGE, END_BEFORE_START (invalid). Rule order unchanged.
- `src/lib/explain.ts`: input validation (roomLabel ≤40 chars, integer minutes 0–1440, explainable reasonCodes only), output validation (non-empty, ≤280 chars), typed `ExplainAdapter` interface, clearly-labeled Mock adapter, 3-second timeout via `withTimeout`, deterministic fallback per reasonCode. Any failure → fallback. No booking status mutation.
- Two patterns chosen: typed adapter interface (swappability) and timeout wrapper — both pure, no module-level state.
- No login, database, real personal data, or client-side API secrets. User text and adapter output treated as untrusted (prompt-injection safe).
- Existing tests preserved; `toEqual` assertions updated only to include additive `reasonCode`.

## Open questions & assumptions

- Real (non-mock) adapter not yet implemented; interface designed for future swap.
- Full `AGENTS.md` contents inferred from constraints referenced in request; not directly read this turn.