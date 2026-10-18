// Pets, accessories and seasonal skins. Everything is SVG drawn in a 160x150 box that uses
// shared classes (body, belly, paw, accent, ink, acc...) so colors can be changed live.
// Each pet needs: .eyes, .eyes-closed (sleeping), .pawL and .pawR, plus anchors for accessories.
(function () {
  const EYES = `
    <g class="eyes">
      <ellipse class="eye ink" cx="60" cy="82" rx="5" ry="7"/>
      <ellipse class="eye ink" cx="100" cy="82" rx="5" ry="7"/>
    </g>
    <g class="eyes-closed">
      <path class="ink-stroke" d="M54 83 Q60 88 66 83"/>
      <path class="ink-stroke" d="M94 83 Q100 88 106 83"/>
    </g>`;
  const CHEEKS = `<ellipse class="cheek" cx="46" cy="97" rx="7" ry="4"/><ellipse class="cheek" cx="114" cy="97" rx="7" ry="4"/>`;
  const SMILE = `<path class="ink-stroke" d="M74 96 Q80 101 86 96"/>`;
  const PAWS = `<ellipse class="paw pawL" cx="52" cy="132" rx="15" ry="10"/><ellipse class="paw pawR" cx="108" cy="132" rx="15" ry="10"/>`;
  const BODY = `<ellipse class="body" cx="80" cy="92" rx="58" ry="50"/><ellipse class="belly" cx="80" cy="106" rx="38" ry="28"/>`;

  // anchors: where accessories sit on each pet (x, y, optional scale s / rotation rot)
  const std = (hatY, extra = {}) => ({
    hat: { x: 80, y: hatY, rot: -5, ...(extra.hat || {}) },
    face: { x: 80, y: 82, s: 1, ...(extra.face || {}) },
    neck: { x: 80, y: 116, s: 1, ...(extra.neck || {}) }
  });

  const PETS = [
    {
      id: 'sprout', label: 'Sprout', defaultName: 'Sprout', defaultColor: '#F6E7C8', voice: 660,
      anchors: std(46), yawn: { x: 80, y: 99, rx: 5, ry: 6 },
      svg: `
        <g class="sprout-part">
          <path d="M80 44 C80 32 80 22 80 14" stroke="#2f6b3a" stroke-width="4" fill="none" stroke-linecap="round"/>
          <path d="M80 18 C66 6 52 14 56 26 C68 28 76 24 80 18Z" fill="#6fcf7f"/>
          <path d="M80 18 C94 6 108 14 104 26 C92 28 84 24 80 18Z" fill="#4fb862"/>
        </g>
        ${BODY}${EYES}${CHEEKS}${SMILE}${PAWS}`
    },
    {
      id: 'cat', label: 'Cat', defaultName: 'Miso', defaultColor: '#F2B98C', voice: 880,
      anchors: std(48), yawn: { x: 80, y: 101, rx: 5, ry: 6 },
      svg: `
        <path class="body" d="M27 74 L34 22 Q36 18 40 20 L72 46 Z"/>
        <path class="body" d="M133 74 L126 22 Q124 18 120 20 L88 46 Z"/>
        <path class="accent" d="M37 62 L40 35 L58 50 Z"/>
        <path class="accent" d="M123 62 L120 35 L102 50 Z"/>
        ${BODY}${EYES}${CHEEKS}
        <path class="whisker" d="M30 94 L12 90 M30 100 L12 103 M130 94 L148 90 M130 100 L148 103"/>
        <path class="ink" d="M76.5 91 L83.5 91 L80 95 Z"/>
        <path class="ink-stroke" d="M72 99 Q76 103 80 98 Q84 103 88 99"/>
        ${PAWS}`
    },
    {
      id: 'bear', label: 'Bear', defaultName: 'Bean', defaultColor: '#C99468', voice: 330,
      anchors: std(44), yawn: { x: 80, y: 104, rx: 5.5, ry: 6.5 },
      svg: `
        <circle class="body" cx="34" cy="52" r="17"/><circle class="accent" cx="34" cy="52" r="9"/>
        <circle class="body" cx="126" cy="52" r="17"/><circle class="accent" cx="126" cy="52" r="9"/>
        ${BODY}
        <ellipse class="belly" cx="80" cy="98" rx="19" ry="14"/>
        ${EYES}${CHEEKS}
        <ellipse class="ink" cx="80" cy="92" rx="5.5" ry="4"/>
        <path class="ink-stroke" d="M80 96 L80 100 M73 102 Q80 107 87 102"/>
        ${PAWS}`
    },
    {
      id: 'bunny', label: 'Bunny', defaultName: 'Clover', defaultColor: '#F1EBFA', voice: 990,
      anchors: std(46), yawn: { x: 80, y: 100, rx: 5, ry: 6 },
      svg: `
        <g transform="rotate(-10 56 56)"><ellipse class="body" cx="56" cy="26" rx="13" ry="30"/><ellipse class="accent" cx="56" cy="28" rx="6.5" ry="22"/></g>
        <g transform="rotate(10 104 56)"><ellipse class="body" cx="104" cy="26" rx="13" ry="30"/><ellipse class="accent" cx="104" cy="28" rx="6.5" ry="22"/></g>
        ${BODY}${EYES}${CHEEKS}
        <ellipse class="accent" cx="80" cy="92" rx="4" ry="3"/>
        <path class="ink-stroke" d="M80 95 L80 98 M74 99 Q77 102 80 98 Q83 102 86 99"/>
        ${PAWS}`
    },
    {
      id: 'frog', label: 'Frog', defaultName: 'Pip', defaultColor: '#94D6A2', voice: 440,
      anchors: std(46, { hat: { s: 0.85 }, face: { y: 52, s: 1.6 }, neck: { y: 118 } }),
      yawn: { x: 80, y: 102, rx: 11, ry: 8 },
      svg: `
        <circle class="body" cx="48" cy="52" r="20"/><circle class="body" cx="112" cy="52" r="20"/>
        ${BODY}
        <g class="eyes">
          <circle class="eye-white" cx="48" cy="52" r="12"/><circle class="eye pupil" cx="49" cy="53" r="6"/>
          <circle class="eye-white" cx="112" cy="52" r="12"/><circle class="eye pupil" cx="111" cy="53" r="6"/>
        </g>
        <g class="eyes-closed">
          <path class="ink-stroke" d="M38 54 Q48 61 58 54"/>
          <path class="ink-stroke" d="M102 54 Q112 61 122 54"/>
        </g>
        ${CHEEKS}
        <path class="ink-stroke" d="M56 95 Q80 114 104 95"/>
        ${PAWS}`
    },
    {
      id: 'ghost', label: 'Ghost', defaultName: 'Boo', defaultColor: '#E9EEFF', voice: 520,
      anchors: std(34, { neck: { y: 112, sx: 1.2, sy: 1 } }), yawn: { x: 80, y: 100, rx: 5, ry: 6.5 },
      svg: `
        <path class="body" d="M22 100 C22 44 50 30 80 30 C110 30 138 44 138 100 L138 128 Q126 118 114 128 Q102 138 90 128 Q80 120 70 128 Q58 138 46 128 Q34 118 22 128 Z"/>
        ${EYES}${CHEEKS}
        <ellipse class="ink" cx="80" cy="99" rx="4" ry="5"/>
        <ellipse class="paw pawL" cx="24" cy="104" rx="10" ry="14"/>
        <ellipse class="paw pawR" cx="136" cy="104" rx="10" ry="14"/>`
    }
  ];

  // ---------- accessories (drawn around the origin; hats sit on y = 0 and grow upward) ----------
  const flower = (cx, cy, r = 4.6) =>
    `<g transform="translate(${cx} ${cy})">` +
    [0, 72, 144, 216, 288].map((a) =>
      `<circle class="acc" cx="${(Math.cos(a * Math.PI / 180) * r * 1.05).toFixed(2)}" cy="${(Math.sin(a * Math.PI / 180) * r * 1.05).toFixed(2)}" r="${r}"/>`
    ).join('') + `<circle cx="0" cy="0" r="${(r * 0.7).toFixed(2)}" fill="#FFD65C"/></g>`;

  const ACCESSORIES = {
    hat: [
      { id: 'none', label: 'None' },
      { id: 'party', label: 'Party hat', color: '#FF8FB1', svg: `
          <path class="acc" d="M-20 2 L0 -46 L20 2 Z"/>
          <path class="acc-dark" opacity=".4" d="M-11.7 -18 L11.7 -18 L6.7 -30 L-6.7 -30 Z"/>
          <ellipse class="acc-dark" cx="0" cy="2" rx="20" ry="4"/>
          <circle class="acc-light" cx="0" cy="-47" r="5.5"/>` },
      { id: 'beanie', label: 'Beanie', color: '#6FA8DC', svg: `
          <path class="acc" d="M-27 2 C-27 -32 27 -32 27 2 Z"/>
          <path class="acc-line" d="M-14 -8 V-22 M0 -8 V-26 M14 -8 V-22"/>
          <rect class="acc-dark" x="-29" y="-6" width="58" height="12" rx="6"/>
          <circle class="acc-light" cx="0" cy="-28" r="7"/>` },
      { id: 'crown', label: 'Crown', color: '#F4C542', svg: `
          <path class="acc" d="M-24 3 L-26 -22 L-12 -10 L0 -28 L12 -10 L26 -22 L24 3 Z"/>
          <rect class="acc-dark" x="-24" y="-3" width="48" height="7" rx="2"/>
          <circle fill="#E85D75" cx="0" cy="-11" r="3.2"/>
          <circle fill="#5DADE2" cx="-14" cy="0.5" r="2.2"/><circle fill="#5DADE2" cx="14" cy="0.5" r="2.2"/>` },
      { id: 'tophat', label: 'Top hat', color: '#3A3B4A', svg: `
          <ellipse class="acc-dark" cx="0" cy="2" rx="32" ry="6"/>
          <rect class="acc" x="-20" y="-40" width="40" height="42" rx="3"/>
          <rect fill="#D9534F" x="-20" y="-12" width="40" height="8"/>
          <ellipse class="acc-light" opacity=".5" cx="0" cy="-40" rx="20" ry="4"/>` },
      { id: 'flowers', label: 'Flower crown', color: '#F7A1C4', svg: `
          <path d="M-32 2 Q0 -14 32 2" stroke="#4FA85F" stroke-width="4" fill="none" stroke-linecap="round"/>
          ${flower(-23, -3)}${flower(-8, -8)}${flower(8, -8)}${flower(23, -3)}` },
      { id: 'witch', label: 'Witch hat', color: '#5B3A8C', svg: `
          <ellipse class="acc-dark" cx="0" cy="2" rx="34" ry="7"/>
          <path class="acc" d="M-20 2 C-14 -16 -8 -34 -2 -46 Q2 -54 14 -54 Q6 -48 8 -38 C12 -24 16 -10 20 2 Z"/>
          <path fill="#F2A33A" d="M-17 -4 L17 -4 L15.5 -12 L-15.5 -12 Z"/>
          <rect fill="#F4C542" x="-4" y="-12.5" width="8" height="9" rx="1.5"/>` },
      { id: 'santa', label: 'Santa hat', color: '#D9534F', svg: `
          <path class="acc" d="M-26 2 C-26 -30 0 -42 22 -30 Q34 -24 36 -6 L30 2 Z"/>
          <rect fill="#FFFFFF" x="-30" y="-6" width="60" height="12" rx="6"/>
          <circle fill="#FFFFFF" cx="36" cy="-6" r="7"/>` }
    ],
    face: [
      { id: 'none', label: 'None' },
      { id: 'glasses', label: 'Round glasses', color: '#33343F', svg: `
          <circle class="lens" cx="-20" cy="0" r="12"/><circle class="lens" cx="20" cy="0" r="12"/>
          <circle class="acc-stroke" cx="-20" cy="0" r="12"/><circle class="acc-stroke" cx="20" cy="0" r="12"/>
          <path class="acc-stroke" d="M-8 -1 Q0 -5 8 -1"/>
          <path class="acc-stroke" d="M-32 -2 L-39 -5 M32 -2 L39 -5"/>` },
      { id: 'shades', label: 'Sunglasses', color: '#2B2B3A', svg: `
          <path class="acc" d="M-33 -8 H-8 V2 Q-8 11 -20.5 11 Q-33 11 -33 2 Z"/>
          <path class="acc" d="M33 -8 H8 V2 Q8 11 20.5 11 Q33 11 33 2 Z"/>
          <path class="acc-stroke" d="M-8 -5 Q0 -9 8 -5"/>
          <path fill="#fff" opacity=".28" d="M-29 -4 L-21 -4 L-27 4 Z"/><path fill="#fff" opacity=".28" d="M11 -4 L19 -4 L13 4 Z"/>` },
      { id: 'hearts', label: 'Heart glasses', color: '#F06A8D', svg: `
          <g transform="translate(-20 0) scale(1.15)"><path class="acc-soft" d="M0 8 C-14 -2 -12 -14 -2 -10 Q0 -9 0 -7 Q0 -9 2 -10 C12 -14 14 -2 0 8 Z"/><path class="acc-stroke" stroke-width="2.4" d="M0 8 C-14 -2 -12 -14 -2 -10 Q0 -9 0 -7 Q0 -9 2 -10 C12 -14 14 -2 0 8 Z"/></g>
          <g transform="translate(20 0) scale(1.15)"><path class="acc-soft" d="M0 8 C-14 -2 -12 -14 -2 -10 Q0 -9 0 -7 Q0 -9 2 -10 C12 -14 14 -2 0 8 Z"/><path class="acc-stroke" stroke-width="2.4" d="M0 8 C-14 -2 -12 -14 -2 -10 Q0 -9 0 -7 Q0 -9 2 -10 C12 -14 14 -2 0 8 Z"/></g>
          <path class="acc-stroke" d="M-8 -3 Q0 -6 8 -3"/>` }
    ],
    neck: [
      { id: 'none', label: 'None' },
      { id: 'scarf', label: 'Scarf', color: '#D9534F', svg: `
          <path class="acc" d="M-48 -6 Q0 12 48 -6 L46 8 Q0 26 -46 8 Z"/>
          <path class="acc-line" d="M-46 8 Q0 26 46 8"/>
          <path class="acc" d="M16 12 L33 14 L30 29 L13 27 Z"/>
          <path class="acc-line" d="M14.5 20 L31.5 22 M13.8 24 L30.8 26"/>` },
      { id: 'bow', label: 'Bow tie', color: '#E8607A', svg: `
          <path class="acc" d="M0 0 L-21 -11 L-21 11 Z"/><path class="acc" d="M0 0 L21 -11 L21 11 Z"/>
          <circle class="acc-dark" cx="0" cy="0" r="5.5"/>` },
      { id: 'bell', label: 'Bell collar', color: '#E5703A', svg: `
          <path class="acc-band" d="M-44 -4 Q0 14 44 -4"/>
          <circle fill="#F4C542" cx="0" cy="13" r="7.5"/>
          <path d="M-4 11 H4 M0 11 V19" stroke="#B88A1A" stroke-width="2" stroke-linecap="round" fill="none"/>` }
    ]
  };

  const ACCESSORY_BY_ID = {};
  Object.keys(ACCESSORIES).forEach((slot) => {
    ACCESSORY_BY_ID[slot] = Object.fromEntries(ACCESSORIES[slot].map((i) => [i.id, i]));
  });

  // ---------- seasonal skins: an outfit plus a little falling-particle effect ----------
  const SEASONS = [
    { id: 'none', label: 'None', months: [] },
    { id: 'halloween', label: 'Halloween', months: [10], fx: 'ember', acc: { hat: 'witch', face: 'none', neck: 'bell' } },
    { id: 'winter', label: 'Winter', months: [12, 1, 2], fx: 'snow', acc: { hat: 'santa', face: 'none', neck: 'scarf' } },
    { id: 'spring', label: 'Spring', months: [3, 4, 5], fx: 'petal', acc: { hat: 'flowers', face: 'none', neck: 'none' } }
  ];
  const SEASONS_BY_ID = Object.fromEntries(SEASONS.map((s) => [s.id, s]));
  const seasonForDate = (d) => {
    const m = d.getMonth() + 1;
    const found = SEASONS.find((s) => s.months.includes(m));
    return found ? found.id : 'none';
  };

  // ---------- color helpers ----------
  const toRgb = (hex) => {
    const h = hex.replace('#', '');
    const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
    const n = parseInt(full, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  };
  const toHex = (rgb) => '#' + rgb.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');
  const mix = (a, b, t) => {
    const x = toRgb(a), y = toRgb(b);
    return toHex(x.map((v, i) => v + (y[i] - v) * t));
  };
  const isDark = (hex) => {
    const [r, g, b] = toRgb(hex);
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255 < 0.45;
  };

  const PetColors = {
    apply(el, hex) {
      el.style.setProperty('--body', hex);
      el.style.setProperty('--belly', mix(hex, '#ffffff', 0.5));
      el.style.setProperty('--paw', mix(hex, '#000000', 0.08));
      el.style.setProperty('--accent', mix(hex, '#F59BB0', 0.6));
      el.style.setProperty('--ink', isDark(hex) ? '#FFF6E0' : '#33291F');
    },
    acc(el, hex) {
      el.style.setProperty('--acc', hex);
      el.style.setProperty('--acc-dark', mix(hex, '#000000', 0.28));
      el.style.setProperty('--acc-light', mix(hex, '#ffffff', 0.5));
    }
  };

  window.PETS = PETS;
  window.PETS_BY_ID = Object.fromEntries(PETS.map((p) => [p.id, p]));
  window.ACCESSORIES = ACCESSORIES;
  window.ACCESSORY_BY_ID = ACCESSORY_BY_ID;
  window.SEASONS = SEASONS;
  window.SEASONS_BY_ID = SEASONS_BY_ID;
  window.seasonForDate = seasonForDate;
  window.PetColors = PetColors;
})();
