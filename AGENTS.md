## Project
Smart Campus room availability checker; one room, fictional data.
## Constraints
Preserve AC1-AC6; no backend, login or booking creation.
No secrets in code, config or docs; never commit or paste credentials.
No external deployments: do not deploy, publish or push anywhere.
Do not add capacity checks beyond the existing filter or any new acceptance rules.
Do not change the UI layout or fixture data.
## Engineering rules
Prefer pure functions and minimal changes; use at most 2 justified patterns.
Do not mutate booking fixtures; keep responsive UI feedback.
## Verification
Before proposing changes for acceptance, run existing tests (npx vitest run)
and add focused regression tests.
Report changed files, rationale and test evidence. 