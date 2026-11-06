# Implementation Tasks — Ghost Pomodoro (幽灵番茄钟)

Status: all tasks below are complete in this repo. Kept as the build record
for judges to see how the spec became the app.

## 1. Project scaffolding
- [x] Create project root `ghost-pomodoro/` with `index.html`, `styles.css`, `app.js`
- [x] Add `README.md`, MIT `LICENSE`, `.gitignore` (does NOT ignore `.kiro/`)
- [x] Add `SUBMISSION_CHECKLIST.md` with Devpost requirements and ZF's open items
- [x] Create `.kiro/specs/ghost-pomodoro/` (requirements, design, tasks)
- [x] Create `.kiro/steering/` (product, tech, structure)
- [x] Create `.kiro/hooks/` (hook config + README) and `.kiro/settings/mcp.json`

## 2. Haunted UI shell (Costume Contest)
- [x] Dark purple/black theme, Creepster display font + Inter body via Google Fonts
- [x] Animated fog layers, floating background ghosts, cobweb corners
- [x] Blood-moon behind an SVG progress ring (circumference 703.7)
- [x] Flickering candle on the timer heading, pulsing moon
- [x] Responsive two-column layout, one column under 900px
- [x] `prefers-reduced-motion` support, focus-visible outlines, aria labels

## 3. Cursed todo list
- [x] Add-task form: title (max 120), curse 1–3 skulls, estimate 1–8 Pomodoros
- [x] Seed two starter tasks so judges see content immediately
- [x] Click to select a task for focus; freed tasks cannot be selected
- [x] Edit title (prompt), delete with confirmation, free-soul button
- [x] Filters: All / Active / Freed; progress bar per task; haunt counter display
- [x] Empty state when no tasks match the filter

## 4. Pomodoro timer
- [x] Modes focus / short break / long break with tab switching
- [x] 1-second tick, mm:ss display, ring progress, focus dots (0–4 cycle)
- [x] Start / Pause / Resume, Reset, Skip
- [x] Durations: focus 15 / 25 / 50 min; short 5 / 10 min; long 15 / 20 min
- [x] Demo mode: 25-sec focus, 10-sec short break, 15-sec long break, with visible note
- [x] Auto-switch focus → break → focus; long break after 4 focuses
- [x] Reload never silently resumes a running timer

## 5. Ghost companion, rewards, haunts
- [x] Ghost moods: idle 😴, focusing 😤, break 😊, angry 😡, freed 🥳
- [x] XP levels: Wisp 0, Baby Ghost 100, Poltergeist 300, Phantom Lord 600; XP bar + evolution steps
- [x] Souls +10 per focus, +20 × curse per freed soul; XP +25 / +50
- [x] Daily streak from last-focus date (yesterday → +1, else reset to 1)
- [x] Focus completion increments selected task; reaching estimate frees it with celebration
- [x] Abandon (Reset/Skip, ≥10s elapsed in focus) adds a haunt, shake, thick fog, warning, sting
- [x] Falling-ghost celebration overlay on soul freed

## 6. Sound and sharing
- [x] Web Audio chime on timer end (C5–E5–G5 bell), spooky sting on haunt, no audio files
- [x] Sound toggle persisted, lazy AudioContext (browser gesture rule)
- [x] Copy haunting summary to clipboard (clipboard API + execCommand fallback)
- [x] Reset-all-data with confirmation

## 7. Persistence
- [x] Single state object in localStorage `ghost-pomodoro-v1`, saved on every change
- [x] Load merges over defaults so old saves stay valid
- [x] try/catch around storage and audio so private mode / no audio never breaks the app

## 8. Verification
- [x] `node --check app.js` passes
- [x] Served with `python3 -m http.server`, curled index / CSS / JS (HTTP 200)
- [x] Manual judge path tested: add task → Demo 25s focus → break → free soul
- [x] No TODO placeholders in the UI; no broken local links

## 9. Still to do (needs ZF, not code)
- [ ] Push to a public GitHub repo (ZF's GitHub username needed)
- [ ] Record a <3 min public YouTube demo video
- [ ] Fill the Devpost submission form (email fuxue8481@gmail.com)
- [ ] Request 4,000 free Kiro credits by Dec 1, 12:00 PT (Kiro user ID needed)
- [ ] Student bonus proof: UNED enrollment, student email, LinkedIn
- [ ] Deploy the static site (GitHub Pages / Netlify / Vercel) and put the URL in the submission
