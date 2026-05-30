# AGENTS.md

## Preview App

- `preview/` is a standalone Solid app used as a runnable reference for the current app feel.
- Do not import production app modules from `src/` into `preview/`.
- Do not import preview modules from `preview/` into the production app.
- Preview data must be local mock data only; no Supabase, API, auth, or network calls.
- Keep `preview/` aligned with the current production app's layout, tokens, components, and motion unless the user explicitly asks to explore a different direction.
- When implementing preview ideas in the production app, map them into the existing `src/` architecture instead of copying the preview folder structure.
- Production implementation should use existing boundaries:
  - layout shell changes go in `src/components/layout/`
  - reusable primitives go in `src/components/ui/`
  - profile, auth, and loading behavior go in the relevant `src/features/` folder
  - shared tokens and base styles go in `src/styles/`
- The preview may duplicate production tokens and components intentionally; duplicated code should mirror the current production feel.
