# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Status

CalendarioMorbido is a **web application for tracking non-competitive cyclo-tourism events in Italy**. The MVP is **implemented and deployable**. The original planned stack (Fastify + Drizzle + Better Auth + Railway) was replaced with a faster stack for the MVP: **Next.js App Router + Supabase + Vercel**.

Docs and wireframes from the planning phase have been moved to `docs/archive/` — ignore that folder.

## Tech Stack

| Layer         | Choice                                                       |
| ------------- | ------------------------------------------------------------ |
| Frontend      | Next.js 15 (App Router, TypeScript, `src/`), Tailwind CSS v3 |
| Database      | Supabase (PostgreSQL)                                        |
| Auth          | Supabase Auth (email/password, `@supabase/ssr`)              |
| Storage       | Supabase Storage — public bucket `covers`, path `covers/{user_id}/{uuid}-{filename}` |
| Hosting       | Vercel                                                       |
| i18n          | next-intl (messages in `messages/en.json` and `messages/it.json`) |
| Package mgr   | pnpm                                                         |

## Repository Structure

```
CLAUDE.md
SETUP.md                             # Step-by-step deploy instructions
next-steps.md                        # Pending MVP tasks

messages/
  en.json                            # English translations
  it.json                            # Italian translations

middleware.ts                        # Supabase session refresh + next-intl routing

supabase/migrations/
  0001_init.sql                      # Schema, RLS, functions, storage bucket
  0002_seed.sql                      # ~11 sample approved events
  0003_location_and_delete.sql
  0004_update_event.sql

src/app/
  layout.tsx                         # Root layout (Header, Footer)
  globals.css                        # OKLch theme variables, warm-paper aesthetic
  page.tsx                           # "/" Public calendar
  eventi/[id]/page.tsx               # Event detail
  accedi/page.tsx                    # Login
  registrati/page.tsx                # Sign up
  calendario/page.tsx                # Personal calendar [auth]
  proponi/page.tsx                   # Propose event [auth]
  gestore/page.tsx                   # Admin area [admin]
  gestore/eventi/[id]/modifica/page.tsx  # Edit existing event [admin]
  auth/signout/route.ts              # POST /auth/signout

src/components/
  layout/   Header.tsx, Footer.tsx, LocaleSwitcher.tsx, MobileNav.tsx
  events/   EventCalendar.tsx, EventCard.tsx, EventFilters.tsx, EventForm.tsx,
            EventGrid.tsx, SaveButton.tsx
  proposals/  ProposalForm.tsx, StatusBadge.tsx
  admin/    AdminProposalCard.tsx, DeleteEventButton.tsx
  auth/     AuthForm.tsx
  ui/       Toast.tsx

src/lib/
  supabase/  client.ts, server.ts, middleware.ts, admin.ts
  actions/   admin.ts, auth.ts, event-fields.ts, proposals.ts, saved-events.ts
  auth/      require-user.ts
  constants/ regions.ts
  types/     db.ts
  utils/     dates.ts, location.ts, storage.ts
  i18n/      config.ts, request.ts

docs/archive/                        # Planning phase docs — IGNORE
```

## Domain

### User Roles

- **Guest**: browse public event calendar, apply filters, view event details
- **Registered User**: save events to personal calendar, propose new events, track proposal status (`pending | approved | rejected`)
- **Administrator**: approve/reject proposals, edit and delete existing events

### Data Model

- **`profiles`** — extends `auth.users` with `role` (`user | admin`)
- **`events`** — published events only; created atomically when admin approves a proposal
- **`proposals`** — user submissions; status `pending | approved | rejected`; mirrors all event fields plus `user_id`, `status`, `rejection_reason`, `reviewed_at`
- **`saved_events`** — junction table (`user_id × event_id`) for personal calendars

Cover images stored in Supabase Storage; DB holds only the key (`cover_image_key`). Public bucket — no signed URLs needed.

### Key SQL Functions

- `is_admin()` — SECURITY DEFINER, bypasses RLS; used in policies to avoid recursion
- `approve_proposal(p_proposal_id uuid)` — atomic RPC: inserts event + updates proposal in one transaction with `SELECT … FOR UPDATE` lock

## Build & Dev Commands

```bash
pnpm install
pnpm dev       # http://localhost:3000
pnpm build
pnpm lint
```

Environment variables required (see `.env.example`):
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY   # optional for MVP
```

## MVP Simplifications (intentional)

- Email confirmation **OFF** (immediate signup)
- Public storage bucket (no signed URLs)
- No pagination (small dataset)
- Map view: **not implemented** — placeholder only (out of MVP scope)
- Coordinates entered manually in proposal form
- Admin promoted via SQL (`update public.profiles set role='admin' where ...`)
- No automated tests

## Out of MVP Scope (ignore for now)

- Map view (MapLibre/MapTiler)
- Temporal filters on map
- Recurring events
- AI-assisted event scraping
- Social/friend features

## Design

Mobile-first. Warm paper aesthetic (`--paper: oklch(0.985 0.006 95)`), cycling-green hi-vis accent (`--accent: oklch(0.84 0.19 128)`). Fonts: Caveat (headings) + Patrick Hand (body). Italian-language UI with i18n support (next-intl).

## HOW TO MANAGE DOCS

Ignore `docs/archive/` — it contains planning-phase brainstorming not relevant to the MVP.

## LANGUAGE

Even if you interact with Claude Code in other languages, always produce code artifacts, documentation, commit messages, and all persisted project information in **English**.
