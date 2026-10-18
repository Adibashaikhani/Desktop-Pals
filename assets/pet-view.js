// Renders a pet into an element and drives its moods, idle antics, accessories and effects.
// Used by both the desktop pet window and the preview in the settings window.
class PetView {
  constructor(root) {
    this.root = root;
    root.classList.add('pet');
    root.dataset.mood = 'idle';
    root.innerHTML =
      '<div class="fx"></div><div class="glow"></div><div class="art"></div>' +
      '<div class="zzz">z z z</div><div class="focus-pill" hidden></div><div class="bubble" hidden></div>';
    this.art = root.querySelector('.art');
    this.bubble = root.querySelector('.bubble');
    this.pill = root.querySelector('.focus-pill');
    this.fx = root.querySelector('.fx');

    this.petId = null;
    this.svgKey = null;
    this.fxType = 'none';
    this.name = '';
    this.bubbles = true;
    this.sleepAfter = 30;
    this.antics = true;
    this.wanderOn = false;
    this.focusPhase = 'idle';
    this.mood = 'idle';
    this.act_ = null;
    this.keyTimes = [];
    this.nextPaw = 0;
    this.idleFor = 0;
    this.nextIdleAt = 6 + Math.random() * 6;
    this.timers = {};
    this.onWander = null;   // set by the desktop window: (dx) => Promise<{ms, dx}>

    setInterval(() => this._tick(), 1000);
  }

  // ---------- settings ----------
  apply(s) {
    const def = PETS_BY_ID[s.pet] || PETS[0];
    const acc = { hat: 'none', face: 'none', neck: 'none', ...(s.acc || {}) };
    const key = [def.id, acc.hat, acc.face, acc.neck, s.accColor || ''].join('|');
    if (this.svgKey !== key) {
      this.svgKey = key;
      this.petId = def.id;
      this._renderSvg(def, acc, s.accColor);
    }
    PetColors.apply(this.root, s.customColor ? s.color : def.defaultColor);
    this.root.style.setProperty('--s', s.size);
    this.root.style.opacity = s.opacity;
    this.art.classList.toggle('flip', !!s.flip);

    const season = SEASONS_BY_ID[s.season] || SEASONS_BY_ID.none;
    this.setFx(season.fx || 'none');

    this.name = (s.name || '').trim() || def.defaultName;
    this.bubbles = s.bubbles !== false;
    this.sleepAfter = s.sleepAfter;
    this.antics = s.idle !== false;
    this.wanderOn = s.wander !== false;
    this.wake();
  }

  _renderSvg(def, acc, accColor) {
    const yw = def.yawn;
    let extra = `<ellipse class="yawn ink" cx="${yw.x}" cy="${yw.y}" rx="${yw.rx}" ry="${yw.ry}"/>`;
    ['neck', 'face', 'hat'].forEach((slot) => {
      const item = ACCESSORY_BY_ID[slot][acc[slot]];
      if (!item || item.id === 'none') return;
      const a = def.anchors[slot];
      const sx = a.sx || a.s || 1;
      const sy = a.sy || a.s || sx;
      extra += `<g class="acc-slot" data-slot="${slot}" data-item="${item.id}" ` +
        `transform="translate(${a.x} ${a.y}) rotate(${a.rot || 0}) scale(${sx} ${sy})">${item.svg}</g>`;
    });
    this.art.innerHTML = `<svg viewBox="0 0 160 150" aria-hidden="true">${def.svg}${extra}</svg>`;
    const svg = this.art.querySelector('svg');
    svg.classList.toggle('has-hat', acc.hat !== 'none');
    svg.querySelectorAll('.acc-slot').forEach((g) => {
      const item = ACCESSORY_BY_ID[g.dataset.slot][g.dataset.item];
      PetColors.acc(g, accColor || item.color);
    });
    this.pawL = svg.querySelector('.pawL');
    this.pawR = svg.querySelector('.pawR');
  }

  // ---------- seasonal particles ----------
  setFx(type) {
    if (this.fxType === type) return;
    this.fxType = type;
    this.fx.textContent = '';
    if (type === 'none') { delete this.fx.dataset.fx; return; }
    this.fx.dataset.fx = type;
    for (let i = 0; i < 12; i++) {
      const p = document.createElement('i');
      p.style.setProperty('--x', Math.random() * 100 + '%');
      p.style.setProperty('--sz', 3 + Math.random() * 4 + 'px');
      p.style.setProperty('--dur', 5 + Math.random() * 5 + 's');
      p.style.setProperty('--delay', -Math.random() * 8 + 's');
      this.fx.appendChild(p);
    }
  }

  // ---------- moods ----------
  setMood(next) {
    if (this.mood === next) return;
    this.mood = next;
    this.root.dataset.mood = next;
  }

  wake() {
    this.idleFor = 0;
    clearTimeout(this.timers.sleep);
    if (this.mood === 'sleep') this.setMood('idle');
    if (this.sleepAfter > 0) {
      this.timers.sleep = setTimeout(() => { this._clearAct(); this.setMood('sleep'); }, this.sleepAfter * 1000);
    }
  }

  // Call once per key press. Only the fact that a key was pressed is used.
  key() {
    this.wake();
    this._clearAct();
    const paw = this.nextPaw++ % 2 === 0 ? this.pawL : this.pawR;
    if (paw) {
      paw.classList.add('down');
      setTimeout(() => paw.classList.remove('down'), 70);
    }

    const now = Date.now();
    this.keyTimes = this.keyTimes.filter((t) => now - t < 3000);
    this.keyTimes.push(now);

    if (this.keyTimes.length >= 12) {
      this.setMood('fire');
      clearTimeout(this.timers.fire);
      this.timers.fire = setTimeout(() => this.setMood('idle'), 2500);
    } else if (this.mood !== 'fire') {
      this.setMood('typing');
    }

    clearTimeout(this.timers.typing);
    this.timers.typing = setTimeout(() => {
      if (this.mood === 'typing') this.setMood('idle');
    }, 600);
  }

  // ---------- idle personality ----------
  act(name, ms) {
    this._clearAct();
    this.act_ = name;
    this.root.dataset.act = name;
    this.timers.act = setTimeout(() => this._clearAct(), ms);
  }
  _clearAct() {
    clearTimeout(this.timers.act);
    this.act_ = null;
    delete this.root.dataset.act;
  }

  _tick() {
    if (!this.antics || this.mood !== 'idle' || this.act_ || this.focusPhase === 'work') return;
    this.idleFor++;
    if (this.idleFor < this.nextIdleAt) return;
    this.idleFor = 0;
    this.nextIdleAt = 8 + Math.random() * 12;
    this._idleAction();
  }

  _idleAction() {
    const hour = new Date().getHours();
    const night = hour >= 23 || hour < 5;
    const choices = [
      ['look', 45],
      ['yawn', night ? 30 : 12],
      ['stretch', 14],
      ['hop', 10],
      ['wander', this.wanderOn && this.onWander ? 14 : 0]
    ];
    const total = choices.reduce((n, c) => n + c[1], 0);
    let r = Math.random() * total;
    let pick = 'look';
    for (const [name, w] of choices) { if ((r -= w) < 0) { pick = name; break; } }

    if (pick === 'look') this.act(Math.random() < 0.5 ? 'look-left' : 'look-right', 1500);
    else if (pick === 'yawn') this.act('yawn', 2000);
    else if (pick === 'stretch') this.act('stretch', 1500);
    else if (pick === 'hop') this.act('hop', 1000);
    else if (pick === 'wander') {
      const dx = (Math.random() < 0.5 ? -1 : 1) * (80 + Math.random() * 160);
      Promise.resolve(this.onWander(dx)).then((r2) => {
        if (r2 && r2.ms > 0 && this.mood === 'idle') this.act('walk', r2.ms + 150);
      }).catch(() => {});
    }
  }

  // ---------- focus timer pill ----------
  setFocus(state) {
    const phase = state ? state.phase : 'idle';
    this.focusPhase = phase;
    if (phase === 'idle') {
      this.pill.hidden = true;
      delete this.root.dataset.focus;
      return;
    }
    const total = Math.ceil(state.remaining / 1000);
    const mm = Math.floor(total / 60);
    const ss = String(total % 60).padStart(2, '0');
    this.pill.textContent = `${phase === 'work' ? 'Focus' : 'Break'} ${mm}:${ss}`;
    this.pill.hidden = false;
    this.root.dataset.focus = phase;
  }

  // ---------- speech ----------
  say(text, ms = 3000) {
    this.bubble.textContent = text;
    this.bubble.hidden = false;
    clearTimeout(this.timers.bubble);
    this.timers.bubble = setTimeout(() => (this.bubble.hidden = true), ms);
  }

  // A short friendly line when you click the pet (if speech bubbles are on).
  speak() {
    if (!this.bubbles) return;
    const n = this.name;
    const lines = [
      `Hi, I'm ${n}!`,
      'Tiny steps still count.',
      'You are doing great.',
      'Water break soon?',
      `${n} is proud of you.`,
      'One more line, then stretch.',
      'I am right here with you.'
    ];
    this.say(lines[Math.floor(Math.random() * lines.length)]);
  }
}
