# ExpenseFlow

Modern expense and investment tracking built with Vite, React, TypeScript, Tailwind CSS, shadcn-style components, Supabase, Zustand, and Recharts.

## Run Locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Set these values in `.env.local`:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Supabase

Run `supabase/schema.sql` in the Supabase SQL editor to create these tables in the `exptrack` schema:

- `expenses`
- `category_rules`
- `investments`

Row-level security is enabled so each user can only manage rows where `user_id = auth.uid()`. The React client is configured to query the `exptrack` schema by default.

To seed starter category rules, update the user UUID in `supabase/seed_category_rules.sql` and run it.

## Features

- Email/password Supabase auth with protected routes
- Fixed sidebar layout for Dashboard, Expenses, Investments, and Settings
- Auto-categorized expenses from keyword rules
- Dashboard cards, category pie chart, daily bar chart, and recent transactions
- Investment tracking with total invested, current value, and profit/loss
- Rule management with add, edit, and delete flows
- Expense search and CSV export
