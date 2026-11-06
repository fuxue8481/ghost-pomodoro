/* Ghost Pomodoro — 幽灵番茄钟
   Plain vanilla JS, no build step, no backend, no login.
   All state lives in localStorage under "ghost-pomodoro-v1".
   Built with Kiro: see .kiro/specs/ghost-pomodoro/ for the spec this code follows. */

(function () {
  "use strict";

  var STORAGE_KEY = "ghost-pomodoro-v1";
  var RING_CIRCUMFERENCE = 703.7; // 2 * PI * 112
  var LEVELS = [
    { minXp: 0,   name: "Wisp",         ghost: "Boo the Wisp",          avatar: "👻" },
    { minXp: 100, name: "Baby Ghost",   ghost: "Boo the Baby Ghost",    avatar: "👻" },
    { minXp: 300, name: "Poltergeist",  ghost: "Boo the Poltergeist",   avatar: "😈" },
    { minXp: 600, name: "Phantom Lord", ghost: "Boo the Phantom Lord",  avatar: "👑" }
  ];

  // ---------- State ----------
  function defaultState() {
    return {
      tasks: [
        { id: "seed-1", title: "Finish UNED essay draft", curse: 2, estimate: 2, done: 0, freed: false, haunts: 0, createdAt: Date.now() },
        { id: "seed-2", title: "Clear the haunted inbox", curse: 1, estimate: 1, done: 0, freed: false, haunts: 0, createdAt: Date.now() }
      ],
      selectedTaskId: "seed-1",
      mode: "focus",            // focus | short | long
      isRunning: false,
      remaining: 1500,          // seconds
      total: 1500,
      focusDoneInCycle: 0,
      totalFocusSessions: 0,
      totalFocusSeconds: 0,
      souls: 0,
      xp: 0,
      streak: 0,
      lastFocusDate: null,      // YYYY-MM-DD
      hauntsTotal: 0,
      soundOn: true,
      focusDuration: 1500,
      shortBreak: 300,
      longBreak: 900,
      filter: "all"
    };
  }

  function loadState() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultState();
      var parsed = JSON.parse(raw);
      var base = defaultState();
      // Merge so new fields added later do not break old saves.
      for (var k in base) { if (!(k in parsed)) parsed[k] = base[k]; }
      return parsed;
    } catch (e) { return defaultState(); }
  }

  var state = loadState();
  var timerId = null;
  var ghostMood = "idle"; // idle | focusing | break | angry | freed
  var moodMessage = "";

  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) { /* private mode: keep running in memory */ }
  }

  // ---------- Elements ----------
  function $(id) { return document.getElementById(id); }
  var els = {
    timerTime: $("timerTime"), timerLabel: $("timerLabel"), timerTask: $("timerTask"),
    ring: $("ringProgress"), modeBadge: $("modeBadge"),
    startPause: $("startPauseBtn"), reset: $("resetBtn"), skip: $("skipBtn"),
    focusDots: $("focusDots"), cycleNote: $("cycleNote"),
    focusDuration: $("focusDuration"), shortBreak: $("shortBreak"), longBreak: $("longBreak"),
    demoNote: $("demoNote"),
    ghostAvatar: $("ghostAvatar"), ghostName: $("ghostName"), ghostLevel: $("ghostLevel"),
    ghostMood: $("ghostMood"), xpFill: $("xpFill"), xpText: $("xpText"),
    ghostPanel: $("ghostPanel"), hauntWarning: $("hauntWarning"),
    souls: $("soulsCount"), streak: $("streakCount"), soundToggle: $("soundToggle"),
    taskList: $("taskList"), emptyState: $("emptyState"), taskCount: $("taskCount"),
    addForm: $("addTaskForm"), taskTitle: $("taskTitle"), taskCurse: $("taskCurse"), taskEstimate: $("taskEstimate"),
    statFocusMin: $("statFocusMin"), statFreed: $("statFreed"), statSessions: $("statSessions"), statHaunts: $("statHaunts"),
    evolutionPath: $("evolutionPath"), share: $("shareBtn"), resetDay: $("resetDayBtn"),
    toast: $("toast"), celebration: $("celebration")
  };

  // ---------- Helpers ----------
  function fmt(seconds) {
    seconds = Math.max(0, Math.round(seconds));
    var m = Math.floor(seconds / 60);
    var s = seconds % 60;
    return (m < 10 ? "0" + m : "" + m) + ":" + (s < 10 ? "0" + s : "" + s);
  }
  function todayStr() { return new Date().toISOString().slice(0, 10); }
  function yesterdayStr() {
    var d = new Date(); d.setDate(d.getDate() - 1);
    return d.toISOString().slice(0, 10);
  }
  function isDemo() { return state.focusDuration === 25; }
  function durationFor(mode) {
    if (mode === "focus") return state.focusDuration;
    if (mode === "short") return isDemo() ? 10 : state.shortBreak;
    return isDemo() ? 15 : state.longBreak;
  }
  function levelFor(xp) {
    var level = LEVELS[0];
    for (var i = 0; i < LEVELS.length; i++) { if (xp >= LEVELS[i].minXp) level = LEVELS[i]; }
    return level;
  }
  function nextLevelFor(xp) {
    for (var i = 0; i < LEVELS.length; i++) { if (xp < LEVELS[i].minXp) return LEVELS[i]; }
    return null;
  }
  function selectedTask() {
    if (!state.selectedTaskId) return null;
    for (var i = 0; i < state.tasks.length; i++) {
      if (state.tasks[i].id === state.selectedTaskId) return state.tasks[i];
    }
    return null;
  }
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  var toastTimer = null;
  function toast(msg) {
    els.toast.textContent = msg;
    els.toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { els.toast.classList.remove("show"); }, 3200);
  }

  // ---------- Sound (Web Audio, no files) ----------
  var audioCtx = null;
  function chime() {
    if (!state.soundOn) return;
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === "suspended") audioCtx.resume();
      var notes = [523.25, 659.25, 783.99]; // C5, E5, G5 — a little ghostly bell
      notes.forEach(function (freq, i) {
        var osc = audioCtx.createOscillator();
        var gain = audioCtx.createGain();
        osc.type = "sine";
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.0001, audioCtx.currentTime + i * 0.22);
        gain.gain.exponentialRampToValueAtTime(0.22, audioCtx.currentTime + i * 0.22 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + i * 0.22 + 0.9);
        osc.connect(gain); gain.connect(audioCtx.destination);
        osc.start(audioCtx.currentTime + i * 0.22);
        osc.stop(audioCtx.currentTime + i * 0.22 + 1);
      });
    } catch (e) { /* audio unavailable: stay silent */ }
  }
  function spookySting() {
    if (!state.soundOn) return;
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === "suspended") audioCtx.resume();
      var osc = audioCtx.createOscillator();
      var gain = audioCtx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(220, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(55, audioCtx.currentTime + 0.7);
      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.8);
      osc.connect(gain); gain.connect(audioCtx.destination);
      osc.start(); osc.stop(audioCtx.currentTime + 0.85);
    } catch (e) { /* silent */ }
  }

  // ---------- Celebration ----------
  function celebrate(freedTask) {
    var icons = ["👻", "✨", "🎃", "👻", "✦"];
    for (var i = 0; i < 16; i++) {
      var span = document.createElement("span");
      span.textContent = icons[i % icons.length];
      span.style.left = (Math.random() * 92 + 2) + "%";
      span.style.animationDelay = (Math.random() * 0.7) + "s";
      span.style.fontSize = (24 + Math.random() * 22) + "px";
      els.celebration.appendChild(span);
      (function (el) { setTimeout(function () { el.remove(); }, 3800); })(span);
    }
    if (freedTask) toast("✨ Soul freed: " + freedTask.title + " — +" + (20 * freedTask.curse) + " souls!");
  }

  // ---------- Ghost mood ----------
  function setMood(mood, message) {
    ghostMood = mood;
    moodMessage = message;
    renderGhost();
  }
  function renderGhost() {
    var level = levelFor(state.xp);
    var next = nextLevelFor(state.xp);
    var avatars = { idle: "😴", focusing: "😤", break: "😊", angry: "😡", freed: "🥳" };
    els.ghostAvatar.textContent = ghostMood === "idle" ? level.avatar : (avatars[ghostMood] || level.avatar);
    // Keep the evolved identity visible even when the mood avatar changes.
    els.ghostName.textContent = level.ghost;
    els.ghostLevel.textContent = "Lv. " + (LEVELS.indexOf(level) + 1) + " · " + level.name;
    els.ghostMood.textContent = moodMessage || defaultMoodMessage();
    var pct = next ? Math.round(((state.xp - level.minXp) / (next.minXp - level.minXp)) * 100) : 100;
    els.xpFill.style.width = pct + "%";
    els.xpText.textContent = next
      ? state.xp + " XP — " + (next.minXp - state.xp) + " XP to " + next.name
      : state.xp + " XP — Phantom Lord, the highest form! 👑";
    // Evolution steps
    var stepIds = ["evo2", "evo3", "evo4"];
    var thresholds = [100, 300, 600];
    stepIds.forEach(function (id, i) {
      var el = document.getElementById(id);
      if (el) el.classList.toggle("done", state.xp >= thresholds[i]);
    });
  }
  function defaultMoodMessage() {
    if (ghostMood === "focusing") return "Focusing hard… do not disturb the ghost. 😤";
    if (ghostMood === "break") return "Break time! Boo is floating happily. Take a breath. 😊";
    if (ghostMood === "angry") return "Boo is ANGRY. You abandoned a focus — the fog thickens… 😡";
    if (ghostMood === "freed") return "A soul is FREE! Boo is celebrating. 🥳";
    return "Sleepy… curse a task and press Start to wake me up.";
  }

  // ---------- Timer ----------
  function updateTimerDisplay() {
    els.timerTime.textContent = fmt(state.remaining);
    var fraction = state.total > 0 ? state.remaining / state.total : 0;
    els.ring.style.strokeDashoffset = String(RING_CIRCUMFERENCE * (1 - fraction));
    var modeName = state.mode === "focus" ? "Focus" : state.mode === "short" ? "Short Break" : "Long Break";
    els.modeBadge.textContent = modeName;
    els.timerLabel.textContent = state.isRunning
      ? (state.mode === "focus" ? "Focusing… stay with Boo!" : "On a break — breathe, stretch, hydrate.")
      : (state.mode === "focus" ? "Ready to haunt your to-do list" : "Break ready when you are.");
    var task = selectedTask();
    els.timerTask.textContent = task
      ? "Focusing on: " + task.title + " (" + task.done + "/" + task.estimate + " 🍅)"
      : "No task selected — pick one below 👇";
    els.startPause.textContent = state.isRunning
      ? "⏸ Pause"
      : (state.remaining < state.total ? "▶ Resume" : "▶ Start " + modeName);
    // Focus dots
    var dots = els.focusDots.querySelectorAll("span");
    dots.forEach(function (dot, i) { dot.classList.toggle("lit", i < state.focusDoneInCycle); });
    els.cycleNote.textContent = "Complete 4 focuses for a long break. " + state.focusDoneInCycle + " / 4 done.";
    // Mode tabs
    document.querySelectorAll(".mode-tab").forEach(function (tab) {
      var active = tab.getAttribute("data-mode") === state.mode;
      tab.classList.toggle("active", active);
      tab.setAttribute("aria-selected", active ? "true" : "false");
    });
    els.demoNote.hidden = !isDemo();
  }

  function switchMode(mode, auto) {
    stopInterval();
    state.mode = mode;
    state.isRunning = false;
    state.total = durationFor(mode);
    state.remaining = state.total;
    if (!auto) setMood("idle", "");
    save();
    updateTimerDisplay();
  }

  function startInterval() {
    stopInterval();
    timerId = setInterval(function () {
      state.remaining -= 1;
      if (state.remaining <= 0) {
        state.remaining = 0;
        updateTimerDisplay();
        completeSession();
      } else {
        updateTimerDisplay();
      }
    }, 1000);
  }
  function stopInterval() {
    if (timerId) { clearInterval(timerId); timerId = null; }
  }

  function startPause() {
    if (state.isRunning) {
      state.isRunning = false;
      stopInterval();
      if (state.mode === "focus") setMood("idle", "Paused. Boo is waiting… the curse is patient. 😴");
      save();
    } else {
      // (Re)starting a finished timer resets it to the full duration first.
      if (state.remaining <= 0) { state.total = durationFor(state.mode); state.remaining = state.total; }
      state.isRunning = true;
      startInterval();
      if (state.mode === "focus") setMood("focusing", "");
      else setMood("break", "");
      save();
    }
    updateTimerDisplay();
  }

  function abandonFocusIfAny(actionName) {
    // Only a focus that actually started counts as abandoned.
    if (state.mode !== "focus") return;
    var elapsed = state.total - state.remaining;
    if (elapsed < 10) return;
    var task = selectedTask();
    if (task && !task.freed) task.haunts += 1;
    state.hauntsTotal += 1;
    setMood("angry", "");
    spookySting();
    document.body.classList.add("haunting");
    els.hauntWarning.hidden = false;
    setTimeout(function () {
      document.body.classList.remove("haunting");
      els.hauntWarning.hidden = true;
      if (ghostMood === "angry") setMood("idle", "");
      renderAll();
    }, 3200);
    toast("😡 Haunted! You abandoned a focus early (" + actionName + "). " + (task ? task.title + " gains a haunt." : ""));
    save();
    renderStats();
    renderTasks();
  }

  function resetTimer() {
    var wasFocusRunning = state.mode === "focus" && (state.isRunning || state.total - state.remaining >= 10);
    if (wasFocusRunning) abandonFocusIfAny("reset");
    stopInterval();
    state.isRunning = false;
    state.total = durationFor(state.mode);
    state.remaining = state.total;
    if (ghostMood !== "angry") setMood("idle", "");
    save();
    updateTimerDisplay();
  }

  function skipTimer() {
    var wasFocus = state.mode === "focus" && (state.isRunning || state.total - state.remaining >= 10);
    if (wasFocus) abandonFocusIfAny("skip");
    stopInterval();
    state.isRunning = false;
    if (state.mode === "focus") {
      switchMode(state.focusDoneInCycle >= 3 ? "long" : "short", true);
      setMood("break", "Skipped ahead — Boo floats into a break. 😊");
    } else {
      switchMode("focus", true);
    }
    save();
    updateTimerDisplay();
    renderGhost();
  }

  function recordFocusDay() {
    var today = todayStr();
    if (state.lastFocusDate === today) return;
    if (state.lastFocusDate === yesterdayStr()) state.streak += 1;
    else state.streak = 1;
    state.lastFocusDate = today;
  }

  function completeSession() {
    stopInterval();
    state.isRunning = false;
    chime();
    if (state.mode === "focus") {
      state.totalFocusSessions += 1;
      state.totalFocusSeconds += state.total;
      state.focusDoneInCycle += 1;
      state.souls += 10;
      state.xp += 25;
      recordFocusDay();
      var task = selectedTask();
      var freedTask = null;
      if (task && !task.freed) {
        task.done += 1;
        if (task.done >= task.estimate) {
          task.freed = true;
          freedTask = task;
          state.souls += 20 * task.curse;
          state.xp += 50;
          state.selectedTaskId = null;
        }
      }
      if (freedTask) {
        setMood("freed", "");
        celebrate(freedTask);
      } else {
        setMood("idle", "Focus complete! +10 souls, +25 XP. Boo is proud. 👻");
        toast("✅ Focus complete! +10 souls, +25 XP" + (task ? " — " + task.title + " is now " + task.done + "/" + task.estimate + " 🍅" : ""));
      }
      var needLong = state.focusDoneInCycle >= 4;
      if (needLong) state.focusDoneInCycle = 0;
      save();
      renderAll();
      switchMode(needLong ? "long" : "short", true);
      setMood(freedTask ? "freed" : "break", freedTask ? "" : "Break time! You earned it. 😊");
    } else {
      toast("☕ Break over — ready for the next focus?");
      save();
      switchMode("focus", true);
      setMood("idle", "Break over. Boo is ready when you are. 👻");
    }
    save();
    renderAll();
  }

  // ---------- Tasks ----------
  function visibleTasks() {
    if (state.filter === "active") return state.tasks.filter(function (t) { return !t.freed; });
    if (state.filter === "freed") return state.tasks.filter(function (t) { return t.freed; });
    return state.tasks;
  }

  function renderTasks() {
    var list = visibleTasks();
    els.taskCount.textContent = state.tasks.length + (state.tasks.length === 1 ? " task" : " tasks");
    els.emptyState.style.display = list.length === 0 ? "block" : "none";
    els.taskList.innerHTML = "";
    list.forEach(function (task) {
      var li = document.createElement("li");
      li.className = "task-item" + (task.freed ? " freed" : "") + (task.id === state.selectedTaskId ? " selected" : "");
      li.setAttribute("data-id", task.id);

      var main = document.createElement("div");
      main.className = "task-main";
      var skulls = "💀".repeat(task.curse);
      var progressPct = Math.min(100, Math.round((task.done / task.estimate) * 100));
      main.innerHTML =
        '<div class="task-title">' + escapeHtml(task.title) + "</div>" +
        '<div class="task-meta">' + skulls + " · " + task.done + "/" + task.estimate + " 🍅" +
        (task.freed ? " · ✨ Soul freed" : " · Click to select for focus") +
        (task.haunts > 0 ? ' · <span class="haunt-count">👻 Haunted ×' + task.haunts + "</span>" : "") +
        "</div>" +
        '<div class="task-progress"><div style="width:' + progressPct + '%"></div></div>';
      main.addEventListener("click", function () {
        if (task.freed) { toast("That soul is already free. Pick an active curse. ✨"); return; }
        state.selectedTaskId = task.id;
        save();
        renderTasks();
        updateTimerDisplay();
      });

      var actions = document.createElement("div");
      actions.className = "task-actions";
      if (!task.freed) {
        var freeBtn = document.createElement("button");
        freeBtn.type = "button";
        freeBtn.textContent = "✨ Free soul";
        freeBtn.addEventListener("click", function (e) {
          e.stopPropagation();
          task.freed = true;
          task.done = task.estimate;
          state.souls += 20 * task.curse;
          state.xp += 50;
          if (state.selectedTaskId === task.id) state.selectedTaskId = null;
          setMood("freed", "");
          celebrate(task);
          save(); renderAll();
        });
        actions.appendChild(freeBtn);
      }
      var editBtn = document.createElement("button");
      editBtn.type = "button";
      editBtn.textContent = "✏️ Edit";
      editBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        var next = window.prompt("Rename this cursed task:", task.title);
        if (next && next.trim()) { task.title = next.trim().slice(0, 120); save(); renderTasks(); updateTimerDisplay(); }
      });
      actions.appendChild(editBtn);
      var delBtn = document.createElement("button");
      delBtn.type = "button";
      delBtn.textContent = "🗑 Delete";
      delBtn.className = "danger";
      delBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        if (!window.confirm("Banish this task to the void?")) return;
        state.tasks = state.tasks.filter(function (t) { return t.id !== task.id; });
        if (state.selectedTaskId === task.id) state.selectedTaskId = null;
        save(); renderAll();
      });
      actions.appendChild(delBtn);

      li.appendChild(main);
      li.appendChild(actions);
      els.taskList.appendChild(li);
    });
  }

  function renderStats() {
    els.souls.textContent = state.souls;
    els.streak.textContent = state.streak + (state.streak === 1 ? " day" : " days");
    els.statFocusMin.textContent = Math.round(state.totalFocusSeconds / 60);
    els.statFreed.textContent = state.tasks.filter(function (t) { return t.freed; }).length;
    els.statSessions.textContent = state.totalFocusSessions;
    els.statHaunts.textContent = state.hauntsTotal;
  }

  function renderAll() {
    updateTimerDisplay();
    renderGhost();
    renderTasks();
    renderStats();
  }

  // ---------- Share / reset ----------
  function shareSummary() {
    var freed = state.tasks.filter(function (t) { return t.freed; }).length;
    var level = levelFor(state.xp);
    var text =
      "👻 My Ghost Pomodoro haunting record\n" +
      "Ghost: " + level.ghost + " (" + state.xp + " XP)\n" +
      "Souls: " + state.souls + " ✦ · Streak: " + state.streak + " days\n" +
      "Focus: " + state.totalFocusSessions + " sessions, " + Math.round(state.totalFocusSeconds / 60) + " minutes\n" +
      "Souls freed: " + freed + " / " + state.tasks.length + " tasks\n" +
      "Built with Kiro for Kiroween 2026 — Costume Contest 🎃";
    function fallbackCopy() {
      var ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); toast("📋 Summary copied — share your haunting!"); }
      catch (e) { toast("Copy failed — select the text manually."); }
      ta.remove();
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        toast("📋 Summary copied — share your haunting!");
      }, fallbackCopy);
    } else fallbackCopy();
  }

  // ---------- Wire up ----------
  els.startPause.addEventListener("click", startPause);
  els.reset.addEventListener("click", resetTimer);
  els.skip.addEventListener("click", skipTimer);

  document.querySelectorAll(".mode-tab").forEach(function (tab) {
    tab.addEventListener("click", function () {
      if (state.isRunning) { toast("Pause the timer before switching modes. ⏸"); return; }
      switchMode(tab.getAttribute("data-mode"), false);
      renderAll();
    });
  });

  els.focusDuration.addEventListener("change", function () {
    state.focusDuration = parseInt(els.focusDuration.value, 10);
    if (state.mode === "focus" && !state.isRunning) {
      state.total = durationFor("focus");
      state.remaining = state.total;
    }
    save(); updateTimerDisplay();
    if (isDemo()) toast("🧪 Demo mode on: 25-second focus for a quick judge run.");
  });
  els.shortBreak.addEventListener("change", function () {
    state.shortBreak = parseInt(els.shortBreak.value, 10);
    if (state.mode === "short" && !state.isRunning) { state.total = durationFor("short"); state.remaining = state.total; }
    save(); updateTimerDisplay();
  });
  els.longBreak.addEventListener("change", function () {
    state.longBreak = parseInt(els.longBreak.value, 10);
    if (state.mode === "long" && !state.isRunning) { state.total = durationFor("long"); state.remaining = state.total; }
    save(); updateTimerDisplay();
  });

  els.soundToggle.addEventListener("click", function () {
    state.soundOn = !state.soundOn;
    els.soundToggle.textContent = state.soundOn ? "🔔 Sound: On" : "🔕 Sound: Off";
    els.soundToggle.setAttribute("aria-pressed", state.soundOn ? "true" : "false");
    save();
    if (state.soundOn) chime();
  });

  els.addForm.addEventListener("submit", function (e) {
    e.preventDefault();
    var title = els.taskTitle.value.trim();
    if (!title) return;
    var task = {
      id: "task-" + Date.now() + "-" + Math.floor(Math.random() * 1000),
      title: title.slice(0, 120),
      curse: parseInt(els.taskCurse.value, 10) || 2,
      estimate: Math.max(1, Math.min(8, parseInt(els.taskEstimate.value, 10) || 2)),
      done: 0, freed: false, haunts: 0, createdAt: Date.now()
    };
    state.tasks.push(task);
    state.selectedTaskId = task.id;
    els.taskTitle.value = "";
    save(); renderAll();
    toast("💀 Task cursed: " + task.title);
    els.taskTitle.focus();
  });

  document.querySelectorAll(".filter-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      state.filter = btn.getAttribute("data-filter");
      document.querySelectorAll(".filter-btn").forEach(function (b) { b.classList.toggle("active", b === btn); });
      save(); renderTasks();
    });
  });

  els.share.addEventListener("click", shareSummary);
  els.resetDay.addEventListener("click", function () {
    if (!window.confirm("Reset ALL Ghost Pomodoro data — tasks, souls, XP, streak? This cannot be undone.")) return;
    stopInterval();
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) { /* ignore */ }
    state = defaultState();
    state.tasks = [];
    ghostMood = "idle";
    save(); renderAll();
    toast("↺ All data reset. The graveyard is quiet again.");
  });

  // Restore saved control values into the form.
  els.focusDuration.value = String(state.focusDuration);
  els.shortBreak.value = String(state.shortBreak);
  els.longBreak.value = String(state.longBreak);
  els.soundToggle.textContent = state.soundOn ? "🔔 Sound: On" : "🔕 Sound: Off";
  els.soundToggle.setAttribute("aria-pressed", state.soundOn ? "true" : "false");
  document.querySelectorAll(".filter-btn").forEach(function (b) {
    b.classList.toggle("active", b.getAttribute("data-filter") === state.filter);
  });
  // If a saved timer was running when the page closed, do not resume silently.
  state.isRunning = false;
  state.remaining = Math.min(state.remaining, state.total);

  renderAll();
})();
