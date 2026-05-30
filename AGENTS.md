# AGENTS.md

## Preview App

- `preview/` is a standalone Solid app used as a runnable feel and design sandbox.
- Do not import production app modules from `src/` into `preview/`.
- Do not import preview modules from `preview/` into the production app.
- Preview data must be local mock data only; no Supabase, API, auth, or network calls.
- Treat `preview/` like a dev-branch reference for visual feel, motion, layout, and interaction experiments.
- When implementing preview ideas in the production app, map them into the existing `src/` architecture instead of copying the preview folder structure.
- Production implementation should use existing boundaries:
  - layout shell changes go in `src/components/layout/`
  - reusable primitives go in `src/components/ui/`
  - profile, auth, and loading behavior go in the relevant `src/features/` folder
  - shared tokens and base styles go in `src/styles/`
- The preview may duplicate tokens and components intentionally so it can drift independently and be compared against production.
