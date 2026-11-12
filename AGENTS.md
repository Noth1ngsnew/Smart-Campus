## Project
Smart Campus room availability checker; one room, fictional data.
## Constraints
Preserve AC1-AC6; no backend, login or booking creation.
Do not add capacity checks or any new acceptance rules.
Do not change the UI layout or fixture data.
## Engineering rules
Prefer pure functions and minimal changes; use at most 2 justified patterns.
Do not mutate booking fixtures; keep responsive UI feedback.
## Verification
Run existing tests (npx vitest run) and add focused regression tests.
Report changed files, rationale and test evidence. 