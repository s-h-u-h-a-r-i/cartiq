# AGENTS.md

## Architecture

- Model real external or persistence boundaries as concrete classes with narrow public APIs.
- Pass external dependencies into those classes through their constructors.
- Construct the class instances in `src/index.tsx`, the application entrypoint.
- Pass each class instance directly into `App`, then into its owning provider.
- Pass application dependencies into UI providers through explicit props.
- Expose domain state and commands to descendants through domain hooks such as `useAuth()` and `useProfile()`.
- Do not expose a global dependency hook that allows UI components to access repositories directly.
- Keep Supabase response handling and Zod parsing outside UI components.
- Keep domain mappings beside their schemas in the owning module.
- Do not add wrappers around pure functions or short domain mappings.

## Local Data

- Use local Supabase data, migrations, and seed data for development scenarios.

- Keep seeded data aligned with generated Supabase types and repository decoding boundaries.
- New external integrations should have a local development path before they become required for everyday development.

## Project Layout Outline

Follow this outline as the project grows. Do not create folders before they are needed.

```txt
src/
  <domain-module>/
    service.ts
    model.ts
    error.ts
    index.ts

  <external-adapter>/
    client.ts
    index.ts

  ui/
    Button.tsx
    Card.tsx
    Field.tsx
    TextInput.tsx
    index.ts

  layout/
    AppShell.tsx
    Sidebar.tsx
    index.ts

  shared/
    types.ts
    <shared-utility>.ts

  app.component.tsx
  index.tsx
```

## Layout Rules

- Keep files flat inside a module until there are enough files to justify nesting.
- Place generic, domain-agnostic utilities in `src/shared/` based on responsibility, not current usage count.
- Prefer conventional shared locations for primitives that are reusable by nature, even when they currently have only one caller. Discoverable placement helps prevent duplicate implementations.
- Keep implementation details local only when they are clearly owned by one feature, component, or domain workflow.
- If a function is broadly named and reusable by nature, such as class-name joining, date formatting, number formatting, math helpers, collection helpers, or TypeScript utility types, put it in `src/shared/` even when it currently has only one caller.
- Do not hide reusable primitives inside the first component or feature that happens to need them.
- Avoid generic dumping-ground files such as `utils.ts`.
- Use module-local names inside a module, for example `auth/service.ts` instead of `auth/auth-service.ts`.

## Editing Rules

- Prefer small, focused changes.
- Do not refactor unrelated files while implementing a feature.
- Preserve existing naming and structure conventions.
- Validate meaningful code changes with the project’s available typecheck or build command.

## Implementation Discipline

- Do not invent wrappers, adapters, helper components, or abstractions when the user asks for a direct import, export, or file change.
- Before proposing implementation code, inspect the relevant package, file, or API that the implementation depends on.
- Keep responsive and state-specific CSS overrides minimal; do not repeat base rules inside media queries unless the value actually changes.
- When changing a markdown implementation plan, keep it directly applicable and remove obsolete snippets instead of layering corrections on top.
- If a proposed change creates a new file, explicitly justify why the existing files cannot handle it.
