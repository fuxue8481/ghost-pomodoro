# Requirements — Ghost Pomodoro (幽灵番茄钟)

## Introduction
Ghost Pomodoro is a haunted Pomodoro timer for Kiroween 2026, Costume Contest.
It turns procrastination into a ghost story: tasks are cursed souls, focus
sessions weaken the curse, and finishing a task's Pomodoros frees its soul.
The ghost companion Boo reacts to everything the user does, and the haunted
UI is the product, not decoration. Solo build, no login, no backend, no build
step — a static site any judge can open and use in one click.

## Glossary
- **Cursed task:** a to-do item with a curse level (1–3 skulls) and an estimated Pomodoro count.
- **Focus session:** one timed focus period (default 25 min; 15 / 50 min options; 25-sec demo mode).
- **Boo:** the ghost companion. Evolves Wisp → Baby Ghost → Poltergeist → Phantom Lord by XP.
- **Soul:** reward currency. +10 per completed focus, +20 × curse level per freed soul.
- **Haunt:** penalty counter. Abandoning a focus early haunts the selected task and thickens the fog.
- **Freed soul:** a task whose completed Pomodoros reached its estimate (or was freed manually).

## Requirements

### Requirement 1: Cursed todo list
**User Story:** As a student with a scary to-do list, I want to curse tasks with a skull level and Pomodoro estimate, so dread becomes a game I can win.

#### Acceptance Criteria
1. WHEN the user submits the add-task form with a title, THEN the system SHALL create a task with curse level 1–3, estimate 1–8 Pomodoros, 0 done, 0 haunts, not freed.
2. WHEN a task is created, THEN the system SHALL select it as the current focus task.
3. WHEN the user clicks a task, THEN the system SHALL select it unless it is already freed.
4. WHEN the user edits a task title, THEN the system SHALL persist the new title (max 120 chars).
5. WHEN the user deletes a task, THEN the system SHALL remove it after confirmation and clear the selection if it was selected.
6. WHEN the user filters by All / Active / Freed, THEN the system SHALL show only matching tasks.

### Requirement 2: Pomodoro timer
**User Story:** As a user, I want a real 25/5/15 Pomodoro cycle I can start, pause, reset and skip, so I can actually focus with the app.

#### Acceptance Criteria
1. WHEN the timer runs, THEN the system SHALL count down once per second and update the mm:ss display and progress ring.
2. WHEN a focus completes, THEN the system SHALL award +10 souls and +25 XP, increment the session count, add focus seconds, update the streak, and switch to a short break (or long break after 4 focuses in a cycle).
3. WHEN a break completes, THEN the system SHALL switch back to focus mode.
4. WHEN the user changes focus length (15 / 25 / 50 min, or Demo 25 sec), THEN the system SHALL apply it to the next focus; in Demo mode short/long breaks become 10 / 15 sec and a demo note SHALL be shown.
5. WHEN the user presses Reset or Skip during a focus with ≥10 seconds elapsed, THEN the system SHALL count it as abandoning the focus (see Requirement 4).
6. WHEN the page reloads, THEN the system SHALL NOT silently resume a running timer.

### Requirement 3: Ghost companion and rewards
**User Story:** As a user, I want a ghost that reacts to my focus and grows stronger, so staying on task feels rewarding.

#### Acceptance Criteria
1. WHEN the app is idle, THEN Boo SHALL appear sleepy with a sleepy message.
2. WHEN focusing, THEN Boo SHALL appear determined; on break, happy; on a freed soul, celebrating.
3. WHEN a focus completes on a selected task, THEN the system SHALL increment that task's done count; WHEN done reaches estimate, THEN the task SHALL be freed automatically with a celebration and +20 × curse souls / +50 XP.
4. WHEN XP crosses 100 / 300 / 600, THEN Boo SHALL evolve to Baby Ghost / Poltergeist / Phantom Lord, with name, level and evolution steps updated.
5. WHEN a focus completes on a new calendar day, THEN the system SHALL update the daily streak (yesterday → +1, otherwise reset to 1).

### Requirement 4: Haunting penalty
**User Story:** As a user who quits early, I want the ghost to notice, so abandoning a focus has a visible (playful) cost.

#### Acceptance Criteria
1. WHEN the user resets or skips a focus with ≥10 seconds elapsed, THEN the system SHALL increment the selected task's haunt count and the total haunt count.
2. WHEN a haunt occurs, THEN the system SHALL show an angry ghost, a warning message, a screen shake, thicker fog, and a low spooky sting sound (if sound is on) for ~3 seconds.
3. WHEN the haunt display ends, THEN the system SHALL return Boo to idle.

### Requirement 5: Persistence and sharing
**User Story:** As a user, I want my tasks, souls, XP and streak to survive reloads, and to share a summary, without creating an account.

#### Acceptance Criteria
1. WHEN any state changes, THEN the system SHALL persist it to localStorage under `ghost-pomodoro-v1`.
2. WHEN the app loads, THEN the system SHALL restore tasks, stats, XP, streak and settings; missing fields SHALL fall back to defaults.
3. WHEN the user clicks "Copy my haunting summary", THEN the system SHALL copy a text summary (ghost level, souls, streak, sessions, minutes, souls freed) to the clipboard.
4. WHEN the user confirms "Reset all data", THEN the system SHALL clear all stored data.

### Requirement 6: Haunted, usable UI (Costume Contest)
**User Story:** As a judge, I want a polished, unforgettable Halloween UI that still lets me use the app instantly, so the costume enhances the function.

#### Acceptance Criteria
1. WHEN the page loads, THEN the system SHALL present a dark purple/black haunted scene: fog, floating ghosts, cobwebs, pumpkin accents, flickering candle, blood-moon progress ring.
2. WHEN the user reads the page, THEN display text SHALL use a spooky display font (Creepster) and body text SHALL use a readable font (Inter) with sufficient contrast.
3. WHEN the timer ends, THEN the system SHALL play an eerie Web Audio chime (no external audio files); a sound toggle SHALL mute/unmute it.
4. WHEN the user opens the page, THEN no login, signup, or setup SHALL be required; the timer and two starter tasks SHALL be visible immediately.

### Requirement 7: Static deployability
**User Story:** As the submitter, I want the app to run as plain static files, so it can be hosted anywhere for free.

#### Acceptance Criteria
1. WHEN the project is served over HTTP, THEN `index.html` SHALL load `styles.css` and `app.js` with no broken local links.
2. WHEN `app.js` is checked with `node --check`, THEN it SHALL pass with no syntax errors.
3. WHEN the app is opened from `index.html` directly or via `python3 -m http.server`, THEN all features SHALL work.
