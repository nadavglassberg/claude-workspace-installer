/* Helpers shared by the guide's decks. The deck engine (deck.js) is the lesson-deck engine, unchanged.
   This file loads before a deck's own hooks and before deck.js. */
window.Intro = (function () {
  const refit = [];
  let was = null;

  // A picker: the rows of a table.pick choose one entry of D, and fields (selector -> (entry, key) => html)
  // paint it. The tallest version of every field is handed to the engine as data-longest, so the slide is
  // fitted once for its largest state and no choice ever overflows.
  function picker(s, table, D, fields, first) {
    if (s.dataset.wired) return;
    s.dataset.wired = 1;
    if (was === null) was = document.documentElement.classList.contains('portrait');
    const rows = [...s.querySelectorAll(table + ' tr[data-k]')];
    const els = Object.entries(fields).map(([q, f]) => [s.querySelector(q), f]);
    const reserve = () => els.forEach(([el, f]) => {
      const keep = el.innerHTML;
      let best = '', h = -1;
      Object.entries(D).forEach(([k, d]) => { const v = f(d, k); el.innerHTML = v; const eh = el.offsetHeight; if (eh > h) { h = eh; best = v; } });
      el.innerHTML = keep;
      el.dataset.longest = best; delete el.dataset.reserved; el.style.minHeight = '';
    });
    const pick = k => {
      rows.forEach(r => { const on = r.dataset.k === k; r.classList.toggle('sel', on); r.setAttribute('aria-checked', String(on)); });
      els.forEach(([el, f]) => { el.innerHTML = f(D[k], k); });
    };
    rows.forEach(r => {
      r.addEventListener('click', () => pick(r.dataset.k));
      r.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); pick(r.dataset.k); } });
    });
    reserve();
    pick(first || rows[0].dataset.k);
    refit.push(() => { if (s.classList.contains('active')) { reserve(); window.Deck.show(window.Deck.slides.indexOf(s), 0, false); } });
  }

  // when the window flips between landscape and upright, the tallest version of a field may be a different one
  addEventListener('resize', () => setTimeout(() => {
    const now = document.documentElement.classList.contains('portrait');
    if (was !== null && was !== now) refit.forEach(f => f());
    was = now;
  }, 0));

  const wrap = (items, a, b) => items.map(x => a + x + b).join('');
  return { picker, li: items => wrap(items, '<li>', '</li>'), says: items => wrap(items, '<span class="say">', '</span>') };
})();
