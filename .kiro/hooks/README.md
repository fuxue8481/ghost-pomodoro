# Hooks — Ghost Pomodoro

## What this is
Kiro agent hooks automate small checks so mistakes never reach a commit.
This project uses one hook, configured in `on-save-check.json`:

| Event | File | What it runs |
|---|---|---|
| `onFileSave` | `app.js` | `node --check app.js` — fail if the JS has a syntax error |
| `onFileSave` | `app.js` | Guard: warn if `.kiro` appears in `.gitignore` (Devpost requires `/.kiro` at the repo root) |
| `onFileSave` | `index.html` | Guard: warn if the literal text `TODO` appears in the UI |

## How it was used
While building the app in Kiro, every save of `app.js` ran the syntax check
immediately, so a typo was caught at edit time instead of at demo time. The
`.kiro` guard exists because accidentally gitignoring `.kiro/` would
disqualify the submission — the hook makes that mistake loud instead of silent.

## Run the same checks by hand
```bash
node --check app.js
grep -q '^\.kiro' .gitignore && echo 'WARNING: .kiro is gitignored' || echo 'OK: .kiro is not gitignored'
grep -qi 'todo' index.html && echo 'WARNING: TODO in index.html' || echo 'OK: no TODO in index.html'
```

## How to enable in Kiro
Place this directory under the project root as `.kiro/hooks/` (it already is).
Kiro picks up hook configs from `.kiro/hooks/*.json` automatically. No extra
install step is needed.
