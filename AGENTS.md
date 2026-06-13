# AGENTS.md

## Architecture

- Model application dependencies as Effect services.
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

## Editing Rules

- Prefer small, focused changes.
- Do not refactor unrelated files while implementing a feature.
- Preserve existing naming and structure conventions.
- Validate meaningful code changes with the project’s available typecheck or build command.
