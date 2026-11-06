# 👻 Ghost Pomodoro — 幽灵番茄钟

> Curse a task. Focus. Free its soul.

A haunted Pomodoro timer built with Kiro for **Kiroween 2026, Costume Contest**.
Your to-do list is a graveyard of cursed souls. Each focus session weakens
the curse. Finish a task's Pomodoros and its soul is freed — with a ghostly
celebration. Quit early, and Boo the ghost haunts you: the screen shakes,
the fog thickens, and your task gains a haunt.

No login. No backend. No build step. Open it and press Start.

![Ghost Pomodoro — screenshot placeholder: open the app and take a screenshot for the Devpost gallery](https://via.placeholder.com/1200x675/1e1030/f3edff?text=Ghost+Pomodoro+-+screenshot+coming+soon)

> Screenshot note: replace the placeholder image above with a real screenshot
> of the running app before submitting to Devpost.

## How to run

**Option 1 — just open it:**
```bash
open index.html
```
(or double-click `index.html` in your file manager)

**Option 2 — local server (recommended):**
```bash
python3 -m http.server 8000
# then open http://localhost:8000/
```

That is all. No `npm install`, no build, no account.

## Features

- **Cursed todo list** — add a task with a title, curse level (1–3 skulls),
  and Pomodoro estimate. Tasks persist in `localStorage`.
- **Pomodoro timer** — 25 min focus / 5 min short break / 15 min long break
  after 4 focuses. Configurable focus (15 / 25 / 50 min), start / pause /
  reset / skip, blood-moon progress ring.
- **Demo mode** — pick `Demo: 25 sec` as the focus length to see a full
  focus → break → celebration cycle in under a minute. Made for judges and
  the demo video.
- **Ghost companion Boo** — sleepy when idle, determined while focusing,
  happy on break, angry when you abandon a focus, celebrating when a soul
  is freed. Evolves Wisp → Baby Ghost → Poltergeist → Phantom Lord by XP.
- **Rewards** — souls (+10 per focus, +20 × curse per freed soul), XP,
  daily streak, total focus minutes, souls freed, haunts caused.
- **Haunting penalty** — reset or skip a focus with ≥10s elapsed and the
  task gains a haunt, the screen shakes, and the fog thickens.
- **Haunted UI** — fog, floating ghosts, cobwebs, flickering candle,
  blood moon, Creepster display font + readable Inter body. The costume
  *is* the interface: the moon drains as the curse drains, and Boo's mood
  is the app's status.
- **Sound** — eerie Web Audio chime on timer end, spooky sting on a haunt.
  Toggleable, no audio files.
- **Share** — copy a text summary of your haunting record.
- **Filters, edit, delete** — All / Active / Freed, rename tasks, delete
  with confirmation, free a soul manually.

## How Kiro was used

This project was built spec-first in Kiro, and the evidence is in `.kiro/`:

- **Specs** — `.kiro/specs/ghost-pomodoro/requirements.md` (EARS acceptance
  criteria), `design.md` (architecture, components, data model), `tasks.md`
  (implementation checklist). The code follows the spec; the spec was written
  before the code.
- **Steering** — `.kiro/steering/product.md` (vision, audience, Costume
  Contest angle), `tech.md` (deliberately boring static stack, rules,
  verification commands), `structure.md` (repo layout and conventions).
- **Hooks** — `.kiro/hooks/on-save-check.json` runs `node --check app.js`
  on every save, guards against gitignoring `.kiro/`, and warns about
  `TODO` text in the UI. See `.kiro/hooks/README.md`.
- **MCP** — `.kiro/settings/mcp.json` configures a filesystem MCP server
  (scoped to the project directory) used for file inspection during
  development.
- **Kiro IDE / CLI / Web / Crew** — the app itself was written in the Kiro
  IDE workflow: spec → steering → implementation → save-hook checks →
  verification. The `/.kiro` directory at the repo root is the proof; do
  not gitignore it.

## Project structure

```
ghost-pomodoro/
├── index.html                  # the app
├── styles.css                  # haunted theme
├── app.js                      # all logic
├── README.md
├── SUBMISSION_CHECKLIST.md
├── LICENSE                     # MIT
├── .gitignore                  # never ignores .kiro/
└── .kiro/
    ├── specs/ghost-pomodoro/   # requirements, design, tasks
    ├── steering/               # product, tech, structure
    ├── hooks/                  # on-save-check.json + README
    └── settings/mcp.json
```

## Costume Contest note

The category asks for any app with a haunting UI that is polished and
unforgettable, where spooky design enhances function. Here the haunting
*is* the feedback loop: the blood moon is the timer, Boo's mood is the
status, fog is the penalty, and freeing a soul is the reward.

## License

MIT — see [LICENSE](LICENSE).
