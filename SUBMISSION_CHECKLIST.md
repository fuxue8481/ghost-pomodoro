# Kiroween 2026 — Submission Checklist: Ghost Pomodoro

**Hackathon:** Kiroween 2026 — https://kiroween.devpost.com/
**Category:** Costume Contest (any app, haunting UI must be polished and unforgettable)
**Deadline:** Friday, December 4, 2026 at 2:00 PM Pacific Time
(= Saturday, December 5, 2026 at 06:00 CST / 22:00 UTC, Dec 4)
**Entrant:** ZF, UNED student in Spain (solo)
**Registration email:** fuxue8481@gmail.com (changed 2026-11-06 from zhuyg543@gmail.com)
**GitHub:** fuxue8481 (provided 2026-11-06)
**Kiro user ID:** d-9067c98495.d4d8f468-3011-706b-2b24-991d8c7635f9 (provided 2026-11-06)
**Goal:** goal_e63b18a3f383

## Devpost requirements — what is DONE in this repo

| Requirement | Status | Evidence |
|---|---|---|
| New project built Oct 30 – Dec 4, 2026 | ✅ Done | Built Nov 6, 2026, in this repo |
| Built using Kiro (IDE / CLI / Web / Crew) | ✅ Done | Spec-first build; see "How Kiro was used" in README |
| Category selected: Costume Contest | ✅ Done | This project; haunted UI is the product |
| Public GitHub repo (NOT GitLab / BitBucket) with all source + instructions | ⏳ In progress | Code is complete locally; GitHub username fuxue8481 provided 2026-11-06, push pending auth check |
| Open-source license, detectable at top of repo | ✅ Done | `LICENSE` (MIT) at root |
| `/.kiro` directory at repo root, NOT gitignored | ✅ Done | `.kiro/specs/ghost-pomodoro/`, `.kiro/steering/`, `.kiro/hooks/`, `.kiro/settings/mcp.json`; `.gitignore` explicitly does not ignore it |
| URL to working app | ⏳ Needs ZF | App runs locally; needs a public deploy (GitHub Pages / Netlify / Vercel) |
| Text description of features | ⏳ Needs ZF | Draft from README; needs pasting into the Devpost form |
| Demo video < 3 min, public on YouTube, shows the app working | ⏳ Needs ZF | Not recorded yet — use Demo 25-sec mode to show a full cycle in under a minute |
| Write-up on how Kiro was used (specs, hooks, steering, MCP, etc.) | ✅ Done (draft) | README "How Kiro was used" + `.kiro/` contents; paste/adapt into the Devpost form |
| Bonus: Best Student Project (Costume Contest) — $1,500 + 1-year Kiro Pro Max | ⏳ Needs ZF | ZF is a UNED student; needs LinkedIn profile, student email, year + degree, school name in the form; proof of enrollment may be requested |
| Bonus: Best Demo — no extra steps | ✅ Eligible | All eligible submissions are considered |
| Bonus: Social Blitz — post starting with `#KiroweenHackathon26`, link in form | ⬜ Optional | Not done; post during the submission period if wanted |
| Bonus: Blog Prize — public blog post about Kiro + project, link in form | ⬜ Optional | Not done; 100 winners get 2,000 bonus Kiro credits |

## Free Kiro credits

- **4,000 free Kiro credits** — request via the Credit Request Form on the
  Devpost Resources tab **by Tuesday, December 1, 2026 at 12:00 PM PT**.
- **Kiro user ID** provided 2026-11-06: `d-9067c98495.d4d8f468-3011-706b-2b24-991d8c7635f9` — use this in the Credit Request Form.
- Allow 48 business hours for review. Redeem by Dec 4; redeemed credits
  expire Dec 31, 2026.

## Still needs ZF (do NOT invent these)

1. **GitHub username** — provided 2026-11-06: fuxue8481. Create public repo `fuxue8481/ghost-pomodoro` and push.
2. **Kiro user ID** — provided 2026-11-06, see header. Request the 4,000 free credits by Dec 1.
3. **Devpost account** — register / log in at kiroween.devpost.com with
   fuxue8481@gmail.com and click "Join Hackathon". Password is set by ZF
   himself; the agent never generates or handles account passwords.
4. **Deploy URL** — publish the static site (GitHub Pages is the simplest:
   push, then Settings → Pages → deploy from branch) and put the URL in the
   submission form. No login may be required for judges to test it.
5. **Demo video (< 3 min, public YouTube)** — suggested shots:
   - 0:00–0:20 open the app, show the blood-moon timer and Boo
   - 0:20–0:50 add a cursed task, select it, start Demo 25-sec focus
   - 0:50–1:20 focus completes, task gains a Pomodoro, break starts
   - 1:20–2:00 free a soul, celebration, ghost evolution + stats
   - 2:00–2:30 show the `.kiro/` spec/steering/hooks in the repo
   - Keep it under 3:00; no copyrighted music.
6. **Devpost form text** — title, tagline, description, "how Kiro was used"
   write-up, category (Costume Contest), bonus selections (Best Student
   Project). Drafts can be taken from `README.md` and
   `.kiro/specs/ghost-pomodoro/requirements.md`.
7. **Student proof** — UNED enrollment proof if Devpost asks; student email
   is yzhu48@alumno.uned.es (on file); LinkedIn profile URL needed.
8. **Screenshot for README** — replace the placeholder image in `README.md`
   with a real screenshot before submitting.

## Verification done locally (Nov 6, 2026)

- `node --check app.js` — passes (no syntax errors).
- Served with `python3 -m http.server`, curled `index.html`, `styles.css`,
  `app.js` — all HTTP 200.
- Manual judge path: open page → starter tasks visible → Demo 25-sec focus
  completes → break starts → task Pomodoro increments → free soul triggers
  celebration. (Re-verify after any edit.)
- `.gitignore` checked: does not ignore `.kiro/`.
- No `TODO` placeholder text in the UI.

## Key dates (all 2026)

| What | When |
|---|---|
| Submission period | Oct 30 – Dec 4, 2:00 PM PT |
| Kiro credits request deadline | Dec 1, 12:00 PM PT |
| **Submission deadline** | **Dec 4, 2:00 PM PT (Dec 5, 06:00 CST)** |
| Judging | Dec 16 – Jan 29, 2027 |
| Winners announced | ~Feb 3, 2027 |

## Do NOT do without ZF

- Do not push to GitHub without ZF's GitHub auth (username fuxue8481 provided; push needs his login/token).
- Do not register on Devpost or fill the form with invented details.
- Do not invent a GitHub username, Kiro ID, LinkedIn URL, or password.
- Do not claim the submission is filed until the Devpost form shows a
  confirmation.
