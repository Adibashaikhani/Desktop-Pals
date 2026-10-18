const $ = (id) => document.getElementById(id);
const view = new PetView($('demoPet'));
let s = { pet: 'sprout', color: '#F6E7C8', customColor: false, size: 1.25, opacity: 1, name: '', bubbles: true, flip: false,
          acc: { hat: 'none', face: 'none', neck: 'none' }, accColor: null, season: 'none', idle: true, wander: false, sleepAfter: 30 };
const apply = (patch) => { s = { ...s, ...patch }; view.apply(s); sync(); };

function chips(el, items, isOn, onPick) {
  items.forEach(([id, label]) => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'chip'; b.textContent = label; b.dataset.id = id;
    b.addEventListener('click', () => onPick(id));
    el.appendChild(b);
  });
  return () => el.querySelectorAll('.chip').forEach((b) => b.setAttribute('aria-pressed', String(isOn(b.dataset.id))));
}

const syncPets = chips($('pets'), PETS.map((p) => [p.id, p.label]), (id) => s.pet === id,
  (id) => apply({ pet: id, ...(s.customColor ? {} : { color: PETS_BY_ID[id].defaultColor }) }));

const COLORS = ['#F6E7C8', '#FFC9B5', '#F7B2C4', '#CDBDF2', '#B7D8F5', '#BDE8CF', '#5A5F70'];
COLORS.forEach((hex) => {
  const b = document.createElement('button');
  b.type = 'button'; b.className = 'dot'; b.dataset.hex = hex; b.style.background = hex; b.setAttribute('aria-label', 'Color ' + hex);
  b.addEventListener('click', () => apply({ color: hex, customColor: true }));
  $('colors').appendChild(b);
});

const OUTFITS = { none: ['None', { hat: 'none', face: 'none', neck: 'none' }], party: ['Party hat', { hat: 'party', face: 'none', neck: 'bow' }],
  cool: ['Cool', { hat: 'none', face: 'shades', neck: 'scarf' }], crown: ['Royal', { hat: 'crown', face: 'glasses', neck: 'none' }] };
const syncOutfit = chips($('outfits'), Object.entries(OUTFITS).map(([id, v]) => [id, v[0]]),
  (id) => JSON.stringify(OUTFITS[id][1]) === JSON.stringify(s.acc), (id) => apply({ acc: OUTFITS[id][1], season: 'none' }));

const syncSeason = chips($('seasons'), SEASONS.map((x) => [x.id, x.label]), (id) => s.season === id,
  (id) => apply({ season: id, ...(id === 'none' ? {} : { acc: SEASONS_BY_ID[id].acc }) }));

function sync() {
  syncPets(); syncOutfit(); syncSeason();
  $('colors').querySelectorAll('.dot').forEach((d) => d.setAttribute('aria-pressed', String(s.customColor && d.dataset.hex === s.color)));
}
apply({});

$('tryit').addEventListener('keydown', () => view.key());
$('demoPet').addEventListener('click', () => view.speak());

// until the Store link is added, show a friendly "coming soon" state
document.querySelectorAll('a[data-store]').forEach((a) => {
  if (a.getAttribute('href').includes('STORE_LINK')) {
    a.removeAttribute('href'); a.setAttribute('aria-disabled', 'true'); a.textContent = 'Coming soon to Microsoft Store';
  }
});
