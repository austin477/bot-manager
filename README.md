# Bot Manager

Dispatch and monitor AI bot runs from a clean, mobile-friendly dashboard.

## Stack

- **Next.js 14** (App Router, TypeScript)
- **Tailwind CSS** (dark theme)
- **Supabase** (Postgres + Realtime)
- **Vercel** (deployment)

## Setup

### 1. Install dependencies

```bash
cd /Users/austinlavier/Claudes/bot-manager
npm install
```

### 2. Configure environment variables

```bash
cp .env.local.example .env.local
```

Fill in `.env.local`:

| Variable | Where to find it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase project → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase project → Settings → API (secret — never expose to browser) |

### 3. Run the database migration

Open the Supabase SQL editor for project `tfzlvludpvowovvwvrta` and run:

```
supabase/001_initial.sql
```

This creates:
- `bot_runs` — one row per dispatched bot task
- `bot_templates` — reusable task templates (Phase 2)
- RLS policies (open for now — scope to users once auth is wired)
- Realtime publication on `bot_runs`

### 4. Run locally

```bash
npm run dev
# → http://localhost:3000
```

### 5. Deploy to Vercel

```bash
# Via Vercel dashboard: import repo, add env vars, deploy
# Or via CLI:
npx vercel --prod
```

Add all three `.env.local` variables in Vercel → Project → Settings → Environment Variables.

## API Routes

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/bots/dispatch` | Create a new bot run |
| `GET` | `/api/bots/runs` | List runs (`?status=running&limit=50`) |
| `GET` | `/api/bots/runs/[id]` | Get a single run by ID |

### POST /api/bots/dispatch

```json
{
  "prompt": "Summarize the top 10 trending products on Amazon today",
  "model": "claude-sonnet-4-6"
}
```

Valid models: `claude-opus-4-6`, `claude-sonnet-4-6`, `claude-haiku-4-5-20251001`, `gpt-4o`, `gemini-pro`

Returns `201` with the created `BotRun` record.

## Phase 2 (next)

- Wire up real LLM calls (Anthropic SDK, OpenAI SDK)
- User authentication (Supabase Auth)
- Bot templates UI
- Streaming result output
- Cost tracking per run
