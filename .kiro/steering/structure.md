# Structure Steering — Ghost Pomodoro

## Repository layout
```
ghost-pomodoro/
├── index.html                  # the app: timer, ghost, tasks, stats
├── styles.css                  # haunted theme, animations, responsive layout
├── app.js                      # all logic: timer, tasks, ghost, rewards, sound
├── README.md                   # what it is, how to run, how Kiro was used
├── SUBMISSION_CHECKLIST.md     # Devpost requirements vs. done / still needs ZF
├── LICENSE                     # MIT
├── .gitignore                  # never ignores .kiro/
└── .kiro/
    ├── specs/ghost-pomodoro/
    │   ├── requirements.md     # EARS acceptance criteria
    │   ├── design.md           # architecture, components, data model
    │   └── tasks.md            # implementation checklist (build record)
    ├── steering/
    │   ├── product.md          # vision, audience, Costume Contest angle
    │   ├── tech.md             # stack, rules, verification commands
    │   └── structure.md        # this file
    ├── hooks/
    │   ├── on-save-check.json  # save-time automation config
    │   └── README.md           # what the hook does and how to run it by hand
    └── settings/
        └── mcp.json            # MCP servers used during development
```

## Conventions
- One feature per file section, with a short comment header in `app.js`.
- State lives in exactly one object (`state`), persisted as one JSON blob.
  No second source of truth.
- Rendering is explicit: `renderAll()` → `updateTimerDisplay()` +
  `renderGhost()` + `renderTasks()` + `renderStats()`. No framework reactivity.
- Kiro artefacts are real and current: if the code changes, the spec changes
  in the same commit. A stale spec is worse than no spec.
- Screenshots for the README / Devpost go in `docs/` only when they exist;
  never commit a broken image link.

## What must stay at the repo root
- `.kiro/` — Devpost requires it at the root to prove Kiro usage (specs,
  hooks, steering). Do NOT move it, do NOT gitignore it.
- `LICENSE` — Devpost requires a detectable open-source license at the top
  of the repo page.
- `README.md` — the first thing a judge reads after the Devpost description.
