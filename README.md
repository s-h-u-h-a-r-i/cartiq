## ShopFlow (Items Foundation)

SolidJS app foundation with:

- Google sign-in via Firebase Auth
- Google Drive/Sheets authorization scopes
- One-click creation of an `items` + `categories` spreadsheet schema
- Modular structure (`auth`, `items`, shared `ui`) and SCSS styling

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create env file:

```bash
cp .env.example .env
```

3. Fill `.env` with your Firebase web app values.

4. Run:

```bash
npm run dev
```

## Current implemented flow

1. Sign in with Google
2. Grant Drive + Sheets access
3. Click "Create Items Spreadsheet"
4. App creates a new spreadsheet with tabs:
   - `items` with relational-style fields (`id`, `category_id`, timestamps)
   - `categories` with relational-style fields (`id`, timestamps)

## Scripts

- `npm run dev`
- `npm run build`
- `npm run preview`
