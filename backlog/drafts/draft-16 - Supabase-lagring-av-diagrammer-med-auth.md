---
id: DRAFT-16
title: Supabase — lagring av diagrammer med autentisering
status: Draft
created_date: '2026-03-14'
labels:
  - storage
  - auth
  - exploration
dependencies: []
---

## Idé

La brukere lagre flere diagrammer i skyen, logge inn og hente dem tilbake på andre enheter. Bruk Supabase som BaaS (Backend as a Service) for database og autentisering.

## Hva Supabase gir oss

| Feature | Gratis tier | Relevant |
|---------|------------|---------|
| PostgreSQL-database | 500 MB | Lagre `GanttChart`-objekter som JSON |
| Autentisering | 50 000 MAU | E-post, Google, GitHub OAuth |
| Row Level Security | ✓ | Brukere ser kun sine egne diagrammer |
| Realtime | ✓ | Mulig samarbeid i fremtiden |
| REST API (auto-generert) | ✓ | Ingen backend-kode nødvendig |

## Datamodell (forslag)

```sql
create table diagrams (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users not null,
  title       text not null,
  data        jsonb not null,   -- GanttChart-objektet serialisert
  created_at  timestamptz default now(),
  updated_at  timestamptz default now(),
  is_public   boolean default false  -- for deling
);

-- Row Level Security
alter table diagrams enable row level security;
create policy "Brukere kan kun se egne diagrammer"
  on diagrams for all using (auth.uid() = user_id);
create policy "Offentlige diagrammer er lesbare av alle"
  on diagrams for select using (is_public = true);
```

## Arkitekturimplikasjoner

- Appen er ikke lenger ren statisk — den kaller Supabase REST API
- `useGanttStore` må utvides med `saveToCloud()` og `loadFromCloud()`
- `localStorage` beholdes som fallback (uten innlogging)
- `src/model/` forblir ren TypeScript — Supabase-kall kun i hooks/state-laget

## Brukerflyt

```
Uten konto:
  → Bruker localStorage som nå (ingen endring)

Med konto:
  → Innlogging (e-post/GitHub)
  → Diagramliste vises i sidebar eller modal
  → «Lagre»-knapp lagrer til Supabase
  → «Nytt diagram», «Åpne», «Slett» fra liste
  → «Del»-knapp setter is_public=true og kopierer URL
```

## Teknisk implementasjon

### Nye filer
- `src/lib/supabase.ts` — Supabase-klient (env-variabler: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`)
- `src/hooks/useAuth.ts` — innlogging/utlogging, session-state
- `src/hooks/useDiagramStorage.ts` — CRUD mot `diagrams`-tabellen
- `src/components/DiagramList/DiagramList.tsx` — liste med lagrede diagrammer
- `src/components/Auth/AuthButton.tsx` — innlogging/utlogging-knapp i toolbar

### Endringer i eksisterende filer
- `src/state/useGanttStore.ts` — cloud save/load-integrasjon
- `src/components/shared/Toolbar.tsx` — AuthButton + «Lagre»-knapp
- `src/App.tsx` — DiagramList-modal

### Miljøvariabler (Vercel)
```
VITE_SUPABASE_URL=https://xyz.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

## Åpne spørsmål

- **Autentisering:** E-post + passord, GitHub OAuth, eller begge?
- **Autosave vs. manuell lagring:** Autosave med debounce, eller eksplisitt «Lagre»-knapp?
- **Konflikthåndtering:** Hva skjer hvis localStorage og Supabase er ute av sync?
- **Anonym bruk:** Skal man kunne dele diagrammer uten konto (is_public via link)?
- **Migrering:** Skal localStorage-data tilbys importert til sky ved første innlogging?
- **Diagramnavn:** Styres av `chart.title` eller eget felt i DB?

## Avhengigheter

- TASK-35 (Vercel-deploy) bør være på plass først — Supabase env-variabler settes i Vercel
- Bør bestemmes: GitHub OAuth som eneste innloggingsmetode (passer målgruppen) vs. e-post også
