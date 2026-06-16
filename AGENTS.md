# AGENTS.md

## Architecture

- Model application dependencies as Effect services when there is a real dependency boundary.
- Define service requirements with `Context.Tag`.
- Provide service implementations with `Layer`.
- Keep real and mock implementations separate.
- Select implementations at the application boundary, not inside UI components.
- UI code should run effects through the shared runtime boundary.
- Avoid wrapper functions that only delegate to another service unless they add real use-case logic.

## Data Modes

- Real and mock behavior should be selected through environment or build/runtime mode.
- Mock implementations should not require real external service credentials.
- New external integrations should have a mock implementation before they become required for local development.

## Project Layout Outline

Follow this outline as the project grows. Do not create folders before they are needed.

```txt
src/
  app/
    app-layer.ts
    effect-runtime.ts

  <domain-module>/
    service.ts
    model.ts
    error.ts
    live.ts
    mock.ts
    index.ts

  <external-adapter>/
    client.ts
    live.ts
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
