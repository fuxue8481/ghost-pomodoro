# Tech Steering — Ghost Pomodoro

## Stack (deliberately boring)
- **HTML:** semantic, single `index.html`. No framework, no bundler.
- **CSS:** single `styles.css`, custom properties, CSS animations only.
- **JS:** single `app.js`, one IIFE, vanilla DOM APIs, no dependencies.
- **Fonts:** Google Fonts — Creepster (display) + Inter (body).
- **Sound:** Web Audio API, oscillators only, no audio files.
- **Storage:** `localStorage`, key `ghost-pomodoro-v1`.
- **Hosting:** any static host (GitHub Pages, Netlify, Vercel, or plain HTTP).

## Why this stack
- Judges must be able to run the project with zero install. A static site
  cannot fail `npm install`.
- Every file is readable by a judge in under a minute. No generated code.
- The Kiro story is the differentiator (specs, steering, hooks, MCP), not the
  framework. Keep the code small enough that the Kiro artefacts are the
  interesting part.

## Rules
- No `TODO` or placeholder text anywhere in the user-facing UI.
- No external JS libraries, no external images, no external audio.
- All user-supplied text is HTML-escaped before insertion (`escapeHtml()`).
- Every `localStorage` / audio / clipboard call is wrapped so a hostile
  browser (private mode, no audio, no clipboard permission) degrades
  gracefully instead of throwing.
- Timer state never auto-resumes after reload.
- `.kiro/` is never gitignored. If a hook or a linter wants to ignore it,
  the hook is wrong — fix the hook, not the ignore rule.

## Verification commands
```bash
node --check app.js
python3 -m http.server 8000 --directory ghost-pomodoro
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8000/index.html
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8000/styles.css
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8000/app.js
```
