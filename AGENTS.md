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
- If a function is broadly named and reusable by nature, such as class-name joining, date formatting, number formatting, math helpers, collection helpers, or TypeScript utility types, put it in `src/shared/` even when it currently has only one caller.
- Keep logic local only when it is clearly owned by that feature, component, or domain workflow.
- Do not hide reusable primitives inside the first component or feature that happens to need them.
- Avoid generic dumping-ground files such as `utils.ts`.
- Use module-local names inside a module, for example `auth/service.ts` instead of `auth/auth-service.ts`.

## Editing Rules

- Prefer small, focused changes.
- Do not refactor unrelated files while implementing a feature.
- Preserve existing naming and structure conventions.
- Validate meaningful code changes with the project’s available typecheck or build command.
