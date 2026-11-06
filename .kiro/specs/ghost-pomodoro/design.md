# Design — Ghost Pomodoro (幽灵番茄钟)

## Overview
A single-page static app: `index.html` (structure), `styles.css` (haunted theme),
`app.js` (all logic, one IIFE, no framework, no build step). State is a single
plain object persisted to `localStorage` under `ghost-pomodoro-v1`. This keeps
the app instantly usable for judges, free to host, and easy to verify.

## Architecture
```
index.html  — semantic layout: header stats, timer card, tasks card, stats card, how-to card
styles.css  — CSS custom properties, fog / floating-ghost / moon animations, responsive grid
app.js      — state load/save, timer engine, task CRUD, ghost mood + XP, haunts, sound, share
```

No framework was chosen deliberately: the judging criteria reward Kiro usage
and design, not framework weight, and a zero-dependency static site cannot
fail to install for a judge.

## Components and Responsibilities

### Timer engine (`app.js`: startPause / startInterval / completeSession)
- Modes: `focus`, `short`, `long`. Durations from settings; Demo mode
  (focus = 25s) shortens breaks to 10s / 15s so a full cycle fits in a video.
- One `setInterval` tick per second. On 0: award rewards, advance the cycle,
  auto-switch mode, play the chime.
- Pause stops the interval without losing `remaining`. Reset / Skip during a
  focus with ≥10s elapsed call `abandonFocusIfAny()` first.
- Reload never resumes a running timer (`isRunning` is forced false on load).

### Task store (in-memory `state.tasks` + localStorage)
- Task: `{ id, title, curse 1–3, estimate 1–8, done, freed, haunts, createdAt }`.
- Selection: `state.selectedTaskId`. Completing a focus increments the
  selected task's `done`; reaching `estimate` frees it automatically.
- Filters: `all | active | freed`, rendered by `renderTasks()` with
  `escapeHtml()` on every user-supplied title.

### Ghost companion and rewards
- XP thresholds: Wisp 0, Baby Ghost 100, Poltergeist 300, Phantom Lord 600.
  `levelFor()` / `nextLevelFor()` derive name, avatar and XP-bar width.
- Souls: +10 per focus, +20 × curse per freed soul. XP: +25 per focus, +50 per freed soul.
- Streak: `lastFocusDate` compared to today / yesterday (ISO date strings).
- Moods: `idle`, `focusing`, `break`, `angry`, `freed` — avatar + message
  change together in `renderGhost()`.

### Haunting penalty
- `abandonFocusIfAny()` adds a haunt to the selected task and the total,
  adds `body.haunting` (shake + thicker fog), shows the warning, plays a
  low sawtooth sting, and clears itself after ~3.2s.

### Sound
- Web Audio API only, no files. `chime()`: three sine notes (C5–E5–G5) with
  exponential decay, like a ghostly bell. `spookySting()`: a falling sawtooth.
  Both respect `state.soundOn` and lazy-create the AudioContext on first use
  (browsers require a user gesture).

### Celebration
- `celebrate()` spawns 16 falling 👻 / ✨ / 🎃 spans in a fixed overlay,
  each removed after ~3.8s. Pure DOM + CSS animation, no library.

## UI / UX Design
- Layout: two-column grid (timer left, tasks + stats right), collapses to one
  column under 900px. Max width 1180px.
- Theme: midnight purple/black gradients, blood-red moon behind the SVG
  progress ring (circumference 703.7, `stroke-dashoffset` driven by remaining
  fraction), pumpkin orange primary buttons, ghostly mint accents, gold XP.
- Motion: drifting fog layers, floating background ghosts, flickering candle
  on the timer heading, pulsing moon. `prefers-reduced-motion` disables it.
- Readability guardrails: Inter for all body text, large 54px timer,
  high-contrast buttons, focus-visible outlines, `aria-live` on the timer,
  `aria-selected` on mode tabs.

## Data Model (localStorage)
```json
{
  "tasks": [{"id": "…", "title": "…", "curse": 2, "estimate": 2, "done": 0, "freed": false, "haunts": 0, "createdAt": 0}],
  "selectedTaskId": "…",
  "mode": "focus", "isRunning": false, "remaining": 1500, "total": 1500,
  "focusDoneInCycle": 0, "totalFocusSessions": 0, "totalFocusSeconds": 0,
  "souls": 0, "xp": 0, "streak": 0, "lastFocusDate": null, "hauntsTotal": 0,
  "soundOn": true, "focusDuration": 1500, "shortBreak": 300, "longBreak": 900,
  "filter": "all"
}
```
Load merges saved data over defaults so future fields never break old saves.

## Error Handling
- `localStorage` wrapped in try/catch (private mode still runs in memory).
- Audio creation wrapped in try/catch (no audio device = silent, not broken).
- Clipboard uses `navigator.clipboard` with an `execCommand` fallback.
- All user text is HTML-escaped before insertion.

## Testing Strategy
- `node --check app.js` for syntax.
- Serve with `python3 -m http.server`, `curl` the page and assets (200s).
- Manual judge path: open page → add task → Demo 25s focus → watch focus
  complete, break start, task gain a Pomodoro → free a soul → see celebration.
- Edge cases: abandon with <10s elapsed (no haunt), reset on a break (no
  haunt), reload mid-timer (does not resume), empty task list (empty state).

## Kiro Usage
- **Specs:** this design + `requirements.md` (EARS acceptance criteria) +
  `tasks.md` (implementation checklist) drove the build.
- **Steering:** `.kiro/steering/product.md`, `tech.md`, `structure.md` fixed
  the vision, stack and layout before any code was written.
- **Hooks:** `.kiro/hooks/on-save-check.json` documents the save-time check
  (syntax check + reminder to keep `.kiro/` out of `.gitignore`).
- **MCP:** `.kiro/settings/mcp.json` configures a filesystem MCP server used
  for file inspection during development.
