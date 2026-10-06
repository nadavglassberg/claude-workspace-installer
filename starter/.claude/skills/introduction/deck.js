/* Lesson decks: shared engine.
   A deck is a list of <section class="slide">. A slide may have stages
   (data-stages="n"); elements with data-stage="k" appear from stage k on.
   "Next" walks the stages first, then the slides. Going back lands on a
   slide's final state, so nothing the learner saw disappears (transient
   information effect). The learner sets the pace; nothing autoplays. */
(function () {
  const slides = [...document.querySelectorAll('.slide')];
  const parts = [...document.querySelectorAll('.parts button')];
  const btnNext = document.getElementById('next');
  const btnPrev = document.getElementById('prev');
  const count = document.getElementById('count');
  const bar = document.querySelector('.progress i');
  const hooks = window.DeckHooks || {};
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const printMode = new URLSearchParams(location.search).has('print');
  const stageOf = new Map();
  let cur = 0;
  // the furthest slide reached; the part buttons and links cannot jump past it,
  // so a question slide cannot be skipped by jumping over it
  let maxReached = 0;
  try { maxReached = +(localStorage.getItem('deck-max:' + location.pathname) || 0); } catch (e) {}

  const stagesOf = s => +(s.dataset.stages || 0);

  // Miriam Libre draws the plain " as a curly quote (7-2), so a quote in a heading is drawn in the body font
  document.querySelectorAll('h1, h2, .big, .topbar .title').forEach(h => {
    const tw = document.createTreeWalker(h, NodeFilter.SHOW_TEXT), found = [];
    let n; while ((n = tw.nextNode())) if (n.nodeValue.includes('"')) found.push(n);
    found.forEach(n => {
      const frag = document.createDocumentFragment();
      n.nodeValue.split(/(")/).forEach(p => {
        if (p === '"') { const q = document.createElement('span'); q.className = 'q'; q.textContent = p; frag.appendChild(q); }
        else if (p) frag.appendChild(document.createTextNode(p));
      });
      n.replaceWith(frag);
    });
  });

  // nice to know: the bulb sits beside the text of every .dyk box, drawn here so each deck stays plain
  const BULB = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.6 10.8c.7.6 1.1 1.3 1.1 2.2h5c0-.9.4-1.6 1.1-2.2A6 6 0 0 0 12 3z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  document.querySelectorAll('.dyk').forEach(d => { if (!d.querySelector('svg')) d.insertAdjacentHTML('afterbegin', BULB); d.setAttribute('aria-label', 'מידע נוסף'); });

  // rule 18: a word that names a place on a real screen (data-n) carries the small number of the frame on the
  // screenshot. A framed screen name is a link as a whole; a plain term only on its number, glued to its last word.
  const fnHtml = n => `<sup class="fn" aria-label="ראו סימון ${n} בצילום">${n}</sup>`;
  document.querySelectorAll('.slide [data-n]').forEach(el => {
    const n = el.dataset.n; if (!/^\d+$/.test(n)) return; // only a frame number; a deck may use data-n for its own state
    el.removeAttribute('data-n');
    const a = document.createElement('a');
    a.className = 'link'; a.dataset.n = n; a.setAttribute('role', 'button'); a.tabIndex = 0;
    if (el.matches('bdi.ui')) { el.replaceWith(a); a.appendChild(el); el.insertAdjacentHTML('beforeend', fnHtml(n)); return; }
    a.classList.add('fnlink'); a.innerHTML = fnHtml(n);
    const nw = document.createElement('span'); nw.className = 'nw';
    let last = el.lastChild;
    if (last && last.nodeType === 3) {
      const t = last.nodeValue, i = t.search(/\S+\s*$/);
      if (i > 0) { last.nodeValue = t.slice(0, i); last = document.createTextNode(t.slice(i).trimEnd()); el.appendChild(last); }
    }
    if (last) nw.appendChild(last);
    nw.appendChild(a); el.appendChild(nw);
  });

  // The deck is one 1600x900 canvas. It is scaled as a whole to the largest size
  // that fits the window, so every element keeps its proportions; the leftover
  // strip (top and bottom, or the sides) stays empty.
  const root = document.documentElement;
  const deckEl = document.querySelector('.deck');
  const canvas = document.querySelector('.canvas');
  const stageEl = document.querySelector('.stage');
  // the slide content sits on a fixed canvas: landscape 1600x760, or portrait
  // 440x840 for a phone held upright. It is scaled as a whole to fit the stage
  // between the header and the footer, which stay ordinary responsive bars.
  let W = 1600, H = 760;
  function scaleToWindow() {
    if (printMode) return;
    const portrait = innerWidth / innerHeight < .8;
    const was = root.classList.contains('portrait');
    root.classList.toggle('portrait', portrait);
    [W, H] = portrait ? [440, 840] : [1600, 760];
    canvas.style.setProperty('--scale', Math.min(stageEl.clientWidth / W, stageEl.clientHeight / H));
    // on an upright phone a two-column .journey with an odd count gives its last station the whole row
    // (7-2, 7-3); a journey a deck keeps in one row is left alone (6-2, 4-3, 6-8)
    document.querySelectorAll('.journey').forEach(j => {
      const nodes = [...j.children].filter(n => n.classList.contains('node'));
      nodes.forEach(n => { if (n.dataset.wide) { n.style.gridColumn = ''; delete n.dataset.wide; } });
      const cols = getComputedStyle(j).gridTemplateColumns.split(' ').filter(Boolean).length;
      if (portrait && cols === 2 && getComputedStyle(j).gridAutoFlow.startsWith('row') && nodes.length % 2) { const last = nodes[nodes.length - 1]; last.style.gridColumn = '1 / -1'; last.dataset.wide = 1; }
    });
    if (was !== portrait && slides[cur]) slides[cur].querySelectorAll('[data-longest]').forEach(e => { delete e.dataset.reserved; e.style.minHeight = ''; }), reserve(slides[cur]);
  }
  addEventListener('resize', () => { scaleToWindow(); if (slides[cur]) fill(slides[cur]); });
  scaleToWindow();
  if (document.fonts) document.fonts.ready.then(() => slides[cur] && fill(slides[cur]));
  // Every slide uses the canvas height. The canvas is fixed, so the content is
  // grown (text, gaps and visuals together, all in rem) until it fills the slide,
  // up to 1.3x the base size. The answer to a question and the longest version of
  // live text are counted, so nothing overflows later.
  function fill(s) {
    if (printMode) return;
    root.style.fontSize = '';
    const base = parseFloat(getComputedStyle(root).fontSize), max = base * 1.3;
    const live = [...s.querySelectorAll('[data-longest]')].map(e => { const keep = e.innerHTML; e.innerHTML = e.dataset.longest; e.style.minHeight = ''; return { e, keep }; });
    s.classList.add('measuring');
    let fs = base;
    const fits = () => s.scrollHeight <= s.clientHeight + 1;
    while (fs < max && fits()) { fs += .5; root.style.fontSize = fs + 'px'; }
    // a slide that does not fit at the base size is scaled down as a whole (to 0.8x), never cut (rule 10a)
    while (fs > base * .8 && !fits()) { fs -= .5; root.style.fontSize = fs + 'px'; }
    // the summary slide: once the text is at its cap, the leftover height goes into the gaps between
    // its rows, so the slide uses the canvas height without growing any element (rule 10g, 10a)
    const sum = s.id === 's-end' && s.querySelector('table.data');
    if (sum) {
      sum.querySelectorAll('td').forEach(td => { td.style.paddingBlock = ''; });
      const cs = getComputedStyle(s), inner = s.firstElementChild;
      const spare = s.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom) - inner.offsetHeight, rows = sum.querySelectorAll('tr').length;
      if (fs >= max && spare > 8 && rows) { const add = Math.floor((spare - 8) / rows / 2); sum.querySelectorAll('td').forEach(td => { td.style.paddingBlock = `calc(${getComputedStyle(td).paddingTop} + ${add}px)`; }); }
    }
    live.forEach(({ e, keep }) => { e.style.minHeight = e.offsetHeight + 'px'; e.innerHTML = keep; });
    s.classList.remove('measuring');
  }
  // text that changes while the learner plays keeps the height of its longest version
  function reserve(s) {
    s.querySelectorAll('[data-longest]').forEach(e => {
      if (e.dataset.reserved) return;
      const keep = e.innerHTML; e.innerHTML = e.dataset.longest;
      e.style.minHeight = e.offsetHeight + 'px'; e.innerHTML = keep; e.dataset.reserved = 1;
    });
  }

  function applyStage(s, k, animate) {
    stageOf.set(s, k);
    s.querySelectorAll('[data-stage]').forEach(el => el.classList.toggle('on', +el.dataset.stage <= k));
    const h = hooks[s.id];
    if (h) h(s, k, animate && !reduced);
    updateNav();
  }

  function show(i, dir, atEnd) {
    i = Math.max(0, Math.min(slides.length - 1, i));
    slides.forEach(s => s.classList.remove('active', 'back'));
    const s = slides[i];
    cur = i;
    s.classList.add('active');
    if (dir < 0) s.classList.add('back');
    // a slide opens at the stage the learner left it on, in one frame:
    // nothing is seen disappearing and replaying. Only Back inside a slide animates backwards.
    const k = atEnd ? stagesOf(s) : (stageOf.get(s) || 0);
    s.classList.add('instant');
    applyStage(s, k, false);
    // measured after the slide's hook has written its content (4-1, 4-3)
    fill(s);
    void s.offsetWidth;
    requestAnimationFrame(() => requestAnimationFrame(() => s.classList.remove('instant')));
    if (i > maxReached) { maxReached = i; try { localStorage.setItem('deck-max:' + location.pathname, String(i)); } catch (e) {} }
    history.replaceState(null, '', '#' + (i + 1));
    try { localStorage.setItem('deck:' + location.pathname, String(i)); } catch (e) {}
  }

  // a slide with a question is passed only after an answer is chosen (a wrong one is fine)
  const openQuestion = s => s.querySelector('.predict:not(.done)');
  function nudge(q) {
    q.classList.remove('nudge'); void q.offsetWidth; q.classList.add('nudge');
  }
  function next() {
    const s = slides[cur], k = stageOf.get(s) || 0;
    const q = openQuestion(s);
    if (q && k >= stagesOf(s)) { nudge(q); return; }
    if (k < stagesOf(s)) applyStage(s, k + 1, true);
    else if (cur === 0 && maxReached === 0) flyAgenda(() => show(1, 1, false));
    else if (cur < slides.length - 1) show(cur + 1, 1, false);
  }

  // leaving the opening slide the first time: each agenda card flies into its
  // part button at the top, so it is clear the list at the top is the same four topics
  let flying = false;
  function flyAgenda(done) {
    if (flying) return;
    const items = [...document.querySelectorAll('[data-agenda]')];
    if (reduced || !items.length) return done();
    flying = true;
    const sc = canvas.getBoundingClientRect().width / W;
    const flights = items.map(li => {
      const target = parts.find(b => b.dataset.part === li.dataset.agenda);
      const a = li.getBoundingClientRect(), t = target.getBoundingClientRect();
      const c = li.cloneNode(true);
      c.classList.add('agenda-fly');
      // the clone keeps the card's canvas size and starts drawn at the canvas scale
      Object.assign(c.style, { left: a.left + 'px', top: a.top + 'px', width: (a.width / sc) + 'px', height: (a.height / sc) + 'px', transform: `scale(${sc})` });
      document.body.appendChild(c);
      li.style.visibility = 'hidden';
      return { li, c, target, dx: t.left - a.left, dy: t.top - a.top, sx: t.width / (a.width / sc), sy: t.height / (a.height / sc) };
    });
    requestAnimationFrame(() => flights.forEach((f, i) => {
      f.c.style.transitionDelay = (i * 90) + 'ms, ' + (i * 90 + 600) + 'ms';
      f.c.style.transform = `translate(${f.dx}px, ${f.dy}px) scale(${f.sx}, ${f.sy})`;
      f.c.style.opacity = '0';
    }));
    setTimeout(() => {
      flights.forEach(f => { f.c.remove(); f.li.style.visibility = ''; f.target.classList.add('arrive'); setTimeout(() => f.target.classList.remove('arrive'), 700); });
      flying = false;
      done();
    }, 900 + items.length * 90);
  }
  // back walks the stages of the current demo first, then the slides
  function prev() {
    const s = slides[cur], k = stageOf.get(s) || 0;
    if (k > 0) applyStage(s, k - 1, true);
    else if (cur > 0) show(cur - 1, -1, true);
  }

  function updateNav() {
    const s = slides[cur], k = stageOf.get(s) || 0;
    const more = k < stagesOf(s);
    btnPrev.disabled = cur === 0 && k === 0;
    btnPrev.style.visibility = btnPrev.disabled ? 'hidden' : '';
    const waiting = !more && openQuestion(s);
    btnNext.disabled = !more && !waiting && cur === slides.length - 1;
    btnNext.style.visibility = btnNext.disabled ? 'hidden' : '';
    btnNext.classList.toggle('waiting', !!waiting);
    btnNext.querySelector('.lbl').textContent = more ? 'המשך' : waiting ? 'קודם בחר תשובה' : (cur === slides.length - 1 ? 'סוף המצגת' : 'לשקופית הבאה');
    count.innerHTML = '<bdi dir="ltr">' + (cur + 1) + '</bdi> מתוך <bdi dir="ltr">' + slides.length + '</bdi>';
    bar.style.width = ((cur + (stagesOf(s) ? k / (stagesOf(s) + 1) : 0)) / (slides.length - 1) * 100) + '%';
    const part = s.dataset.part;
    parts.forEach(b => b.setAttribute('aria-current', String(b.dataset.part === part)));
    const reachable = el => slides.findIndex(x => x.dataset.part === el.dataset.part) <= maxReached;
    parts.forEach(b => { b.disabled = !reachable(b); });
  }

  btnNext.addEventListener('click', next);
  btnPrev.addEventListener('click', prev);
  parts.forEach(b => b.addEventListener('click', () => show(slides.findIndex(s => s.dataset.part === b.dataset.part), 1, false)));

  // RTL: the next slide is to the left, so ArrowLeft moves forward.
  document.addEventListener('keydown', e => {
    if (e.target.closest('input, dialog')) return;
    if (['ArrowLeft', 'PageDown', ' '].includes(e.key)) { e.preventDefault(); next(); }
    else if (['ArrowRight', 'PageUp'].includes(e.key)) { e.preventDefault(); prev(); }
    else if (e.key === 'Home') show(0, -1, false);
    else if (e.key === 'End') show(slides.length - 1, 1, true);
  });

  // touch: in RTL the finger drags the page to the right to go forward
  let tx = null, ty = null;
  document.addEventListener('touchstart', e => { if (e.target.closest('input')) return; tx = e.touches[0].clientX; ty = e.touches[0].clientY; }, { passive: true });
  document.addEventListener('touchend', e => {
    if (tx === null) return;
    const dx = e.changedTouches[0].clientX - tx, dy = e.changedTouches[0].clientY - ty;
    tx = null;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) (dx > 0 ? next : prev)();
  });

  // predict-then-reveal: the answer and the locked part open after a choice
  document.querySelectorAll('.predict').forEach(p => {
    p.querySelectorAll('.choices button').forEach(b => b.addEventListener('click', () => {
      const ok = b.hasAttribute('data-correct');
      b.classList.add(ok ? 'right' : 'wrong');
      if (!ok) p.querySelector('[data-correct]').classList.add('right');
      p.querySelectorAll('.choices button').forEach(x => x.disabled = true);
      p.classList.add('done');
      const fb = p.querySelector(ok ? '.fb-right' : '.fb-wrong');
      if (fb) fb.hidden = false;
      // one question may unlock several areas (space-separated ids), e.g. a table and the explanation under it (2-5)
      if (p.dataset.unlocks) p.dataset.unlocks.split(/\s+/).forEach(id => document.getElementById(id)?.classList.remove('is-locked'));
      const h = hooks[p.closest('.slide').id];
      if (h) h(p.closest('.slide'), stageOf.get(p.closest('.slide')) || 0, !reduced, 'predicted');
      updateNav();
      syncControls(p.closest('.slide'));
    }));
  });
  // no control on a slide works before its question is answered: a picker or slider
  // outside the locked area would show the answer first (3-3, 4-5). A click on one nudges the question.
  const CONTROLS = 'input, select, .seg button, table.pick tr, button[data-pick], [role=radio]';
  function syncControls(s) {
    const open = !!openQuestion(s);
    s.classList.toggle('q-open', open);
    s.querySelectorAll(CONTROLS).forEach(e => {
      if (e.closest('.predict, .shot')) return;
      if (open && 'disabled' in e && !e.disabled) { e.disabled = true; e.dataset.qlock = ''; }
      else if (!open && e.hasAttribute('data-qlock')) { e.disabled = false; delete e.dataset.qlock; }
    });
  }
  slides.forEach(syncControls);
  document.addEventListener('click', e => {
    const s = e.target.closest?.('.slide.q-open'), c = e.target.closest?.(CONTROLS);
    if (!s || !c || c.closest('.predict, .shot')) return;
    e.preventDefault(); e.stopImmediatePropagation();
    nudge(openQuestion(s));
  }, true);


  // zoom: open the figure's full-size version in a native modal dialog
  const dlg = document.getElementById('zoom');
  document.querySelectorAll('.shot').forEach(f => f.addEventListener('click', () => {
    const tpl = document.getElementById(f.dataset.zoom);
    const zbody = dlg.querySelector('.zbody');
    zbody.replaceChildren(tpl.content.cloneNode(true));
    dlg.showModal();
    // a report wider than the window is fitted to its width (down to half size) instead of
    // scrolling sideways, so its first column and its marked element show together (2-3, 2-5)
    const inner = zbody.firstElementChild;
    let z = 1;
    if (inner) { inner.style.zoom = ''; const f = zbody.clientWidth / inner.scrollWidth; if (f < 1) { z = Math.max(f, .5); inner.style.zoom = z; } }
    // a numbered frame is placed on the element it names, measured, never guessed
    dlg.querySelectorAll('.annot[data-for]').forEach(an => {
      const t = dlg.querySelector(an.dataset.for), box = an.offsetParent;
      if (!t || !box) return;
      const r = t.getBoundingClientRect(), p = box.getBoundingClientRect();
      an.style.insetInline = 'auto';
      // rects are drawn at the fitted size; the frame's own coordinates are not, so divide by it
      Object.assign(an.style, { left: ((r.left - p.left) / z - 4) + 'px', top: ((r.top - p.top) / z - 4) + 'px', width: (r.width / z + 8) + 'px', height: (r.height / z + 8) + 'px' });
    });
    // the marked element is scrolled into the window, so a phone sees it without searching (2-5)
    const first = dlg.querySelector('.annot[data-for]');
    if (first) dlg.querySelector(first.dataset.for)?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }));
  if (dlg) {
    dlg.querySelector('.zclose').addEventListener('click', () => dlg.close());
    dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });
  }

  // the screenshots of a slide: the pile spreads them enlarged, each with its numbers; one opens full screen.
  // A marked word opens straight to the shot that carries its number, and Esc returns to the slide.
  const ov = document.createElement('div');
  ov.className = 'shots-ov'; ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true'); ov.setAttribute('aria-label', 'צילומים מהמערכת');
  ov.innerHTML = '<button class="x" type="button" aria-label="סגירה">✕</button><button class="back" type="button">כל הצילומים</button><div class="spread"></div><div class="fullv"></div>';
  document.body.appendChild(ov);
  const spread = ov.querySelector('.spread'), fullv = ov.querySelector('.fullv'), back = ov.querySelector('.back');
  let cards = [], direct = false;
  const big = c => { const f = c.cloneNode(true); f.querySelector('img').src = f.querySelector('img').dataset.full; return f.innerHTML; };
  const showFull = i => { fullv.innerHTML = '<figure style="--ar:' + cards[i].dataset.ar + '">' + big(cards[i]) + '</figure>'; ov.classList.add('full'); };
  const closeShots = () => ov.classList.remove('open', 'full', 'shown');
  const openPile = pile => {
    cards = [...pile.querySelectorAll('.sc')];
    back.classList.toggle('multi', cards.length > 1);
    spread.innerHTML = '';
    cards.forEach((c, i) => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'item'; b.style.transitionDelay = (i * 70) + 'ms';
      b.innerHTML = '<div class="nums">' + c.dataset.nums.split(',').map(n => '<span>' + n + '</span>').join('') + '</div><figure style="--ar:' + c.dataset.ar + '">' + big(c) + '</figure>';
      b.addEventListener('click', e => { e.stopPropagation(); showFull(i); });
      spread.appendChild(b);
    });
    ov.classList.add('open');
    if (cards.length === 1) showFull(0);
    requestAnimationFrame(() => requestAnimationFrame(() => ov.classList.add('shown')));
  };
  const stepBack = () => (ov.classList.contains('full') && cards.length > 1 && !direct) ? ov.classList.remove('full') : closeShots();
  document.querySelectorAll('.pile').forEach(p => p.addEventListener('click', e => { e.stopPropagation(); direct = false; openPile(p); }));
  const jump = a => {
    const pile = a.closest('.slide').querySelector('.pile');
    if (!pile) return;
    direct = true; openPile(pile);
    const i = cards.findIndex(c => c.dataset.nums.split(',').includes(a.dataset.n));
    if (i >= 0) showFull(i);
  };
  // delegated, in the capture phase: some slides rebuild their rows, and a click on a row's number must not also pick the row
  document.addEventListener('click', e => { const a = e.target.closest && e.target.closest('a.link'); if (!a) return; e.preventDefault(); e.stopPropagation(); jump(a); }, true);
  document.addEventListener('keydown', e => {
    const a = e.target.closest && e.target.closest('a.link');
    if (!a || ov.classList.contains('open')) return;
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); jump(a); }
  }, true);
  ov.querySelector('.x').addEventListener('click', closeShots);
  back.addEventListener('click', e => { e.stopPropagation(); direct = false; ov.classList.remove('full'); });
  ov.addEventListener('click', e => { if (e.target === ov || e.target === spread || e.target === fullv) stepBack(); });
  // while open, keys belong to the screenshots: a number opens the shot that carries it, Esc steps back
  window.addEventListener('keydown', e => {
    if (!ov.classList.contains('open')) return;
    e.stopImmediatePropagation(); e.preventDefault();
    if (e.key === 'Escape') return stepBack();
    const i = cards.findIndex(c => c.dataset.nums.split(',').includes(e.key));
    if (i >= 0) showFull(i);
  }, true);

  if (printMode) {
    document.documentElement.classList.add('print');
    slides.forEach(s => { s.classList.add('print-all'); applyStage(s, stagesOf(s), false); });
    document.querySelectorAll('.predict').forEach(p => { p.classList.add('done'); p.querySelector('[data-correct]').classList.add('right'); });
    document.querySelectorAll('.locked').forEach(l => l.classList.remove('is-locked'));
    slides.forEach(s => { const h = hooks[s.id]; if (h) h(s, stagesOf(s), false, 'predicted'); });
  }

  // start where the hash says, else where the learner stopped
  let start = parseInt(location.hash.slice(1), 10) - 1;
  if (isNaN(start)) { try { start = +(localStorage.getItem('deck:' + location.pathname) || 0); } catch (e) { start = 0; } }
  show(Math.min(start || 0, maxReached), 0, false);
  window.Deck = { show, next, prev, slides, applyStage, stageOf, closeShots };
})();

