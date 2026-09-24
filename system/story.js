/* ==============================================
   LQV/SYS — scroll story: "the life of a payment"
   A pinned, scroll-driven explainer in the style of product pages.
   One pure function, render(P), maps scroll progress P ∈ [0,1] to every
   attribute on the SVG. P follows the scroll position 1:1 (no damping —
   lagging behind the wheel felt sticky), coalesced to one render per frame.
   Simplified illustration of the CD purchase flow described in the CV.
   Loaded after system.js (uses $, $$, L, esc, REDUCED, bus).
   ============================================== */

'use strict';

(() => {
  const SVGNS = 'http://www.w3.org/2000/svg';
  const section = $('#story');
  const svgEl = $('#story-svg');
  if (!section || !svgEl) return;

  const CHAPTERS = [
    { eyebrow: ['01 · Intake', '01 · Nhận lệnh'],
      title: ['A customer taps Buy.', 'Khách hàng bấm Mua.'],
      body: ['Orders arrive on two channels — IBM MQ and REST — and land in a single intake.',
             'Lệnh đến từ hai kênh — IBM MQ và REST — và đổ về một điểm tiếp nhận duy nhất.'] },
    { eyebrow: ['02 · Idempotency', '02 · Idempotency'],
      title: ['Retries happen. Duplicates don’t.', 'Thử lại thì có. Trùng lặp thì không.'],
      body: ['Every order carries a key. Redis SET NX lets the first one through and answers the replay with 409.',
             'Mỗi lệnh mang một key. Redis SET NX cho lệnh đầu tiên đi qua và trả 409 cho lệnh gửi lại.'] },
    { eyebrow: ['03 · Saga', '03 · Saga'],
      title: ['One order. Three steps.', 'Một lệnh. Ba bước.'],
      body: ['An orchestrator verifies the account, settles through PaymentHub and issues the certificate — each step its own local transaction.',
             'Orchestrator xác minh tài khoản, thanh toán qua PaymentHub rồi phát hành chứng chỉ — mỗi bước là một transaction cục bộ.'] },
    { eyebrow: ['04 · Compensation', '04 · Bù trừ'],
      title: ['When a step fails, it undoes itself.', 'Bước nào lỗi, tự hoàn tác.'],
      body: ['Issuing times out. The saga refunds and releases in reverse order, then retries with backoff.',
             'Phát hành bị timeout. Saga hoàn tiền và giải phóng theo thứ tự ngược, rồi thử lại với backoff.'] },
    { eyebrow: ['05 · Outbox', '05 · Outbox'],
      title: ['Published once. Settled once.', 'Publish một lần. Tất toán một lần.'],
      body: ['The result is written to an outbox in the same transaction and relayed to Kafka. The money moved exactly once.',
             'Kết quả được ghi vào outbox trong cùng transaction rồi relay sang Kafka. Tiền chỉ chuyển đúng một lần.'] }
  ];
  const tx = pair => (LANG === 'vi' ? pair[1] : pair[0]);

  /* Two layouts: wide (desktop) and tall (phones), so text never shrinks below ~11px */
  const LAYOUTS = {
    wide: { vb: [800, 470], nodes: {
      customer: [72, 235, 124], intake: [238, 235, 156], redis: [238, 78, 156], saga: [440, 235, 180],
      verify: [660, 92, 172], settle: [660, 235, 172], issue: [660, 362, 172], outbox: [440, 418, 180] } },
    tall: { vb: [400, 560], nodes: {
      customer: [150, 40, 130], intake: [150, 135, 150], redis: [325, 135, 130], saga: [200, 245, 180],
      verify: [70, 360, 124], settle: [200, 360, 124], issue: [330, 360, 124], outbox: [200, 480, 180] } }
  };
  const NODE_TEXT = {
    customer: [['Customer', 'Khách hàng'], ['mobile app', 'ứng dụng']],
    intake: [['Order intake', 'Tiếp nhận lệnh'], ['MQ · REST', 'MQ · REST']],
    redis: [['Redis', 'Redis'], ['idempotency key', 'idempotency key']],
    saga: [['Saga orchestrator', 'Saga orchestrator'], ['', '']],
    verify: [['Verify account', 'Xác minh TK'], ['account · CIF', 'tài khoản · CIF']],
    settle: [['Settle', 'Thanh toán'], ['PaymentHub', 'PaymentHub']],
    issue: [['Issue CD', 'Phát hành CD'], ['T24', 'T24']],
    outbox: [['Outbox → Kafka', 'Outbox → Kafka'], ['same transaction', 'cùng transaction']]
  };
  const EDGES = [['customer', 'intake'], ['intake', 'redis'], ['intake', 'saga'], ['saga', 'verify'], ['saga', 'settle'], ['saga', 'issue'], ['saga', 'outbox']];
  const NODE_H = 54;

  let layoutKey = null;
  let N = {};   // node id -> { g, rect, title, sub, badge, cx, cy, w }
  let E = {};   // "a>b" -> { path, len }
  let packets = {};

  const el = (tag, attrs = {}, parent) => {
    const n = document.createElementNS(SVGNS, tag);
    for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
    if (parent) parent.appendChild(n);
    return n;
  };

  function route(a, b) {
    const A = N[a], B = N[b];
    const dx = B.cx - A.cx, dy = B.cy - A.cy;
    if (Math.abs(dy) > Math.abs(dx) * 0.9) {           // vertical-first elbow
      const y1 = A.cy + Math.sign(dy) * NODE_H / 2, y2 = B.cy - Math.sign(dy) * NODE_H / 2;
      const my = (y1 + y2) / 2;
      return `M${A.cx} ${y1} V${my} H${B.cx} V${y2}`;
    }
    const x1 = A.cx + Math.sign(dx) * A.w / 2, x2 = B.cx - Math.sign(dx) * B.w / 2;
    const mx = (x1 + x2) / 2;
    return `M${x1} ${A.cy} H${mx} V${B.cy} H${x2}`;
  }

  function build() {
    const narrow = section.clientWidth < 760;
    const key = narrow ? 'tall' : 'wide';
    if (key === layoutKey && svgEl.childElementCount > 1) return;
    layoutKey = key;
    const L0 = LAYOUTS[key];
    svgEl.setAttribute('viewBox', `0 0 ${L0.vb[0]} ${L0.vb[1]}`);
    [...svgEl.querySelectorAll(':scope > :not(title)')].forEach(n => n.remove());
    const gE = el('g', { class: 'st-edges' }, svgEl);
    const gN = el('g', { class: 'st-nodes' }, svgEl);
    const gP = el('g', { class: 'st-packets' }, svgEl);
    N = {}; E = {}; packets = {};

    for (const [id, [cx, cy, w]] of Object.entries(L0.nodes)) {
      const g = el('g', { class: 'st-node', 'data-id': id }, gN);
      const rect = el('rect', { x: cx - w / 2, y: cy - NODE_H / 2, width: w, height: NODE_H, rx: 12 }, g);
      const title = el('text', { x: cx, y: cy - 3, 'text-anchor': 'middle', class: 'st-title' }, g);
      const sub = el('text', { x: cx, y: cy + 15, 'text-anchor': 'middle', class: 'st-sub' }, g);
      const badge = el('g', { class: 'st-badge', transform: `translate(${cx + w / 2 - 6} ${cy - NODE_H / 2 + 6})` }, g);
      el('circle', { r: 11 }, badge);
      const glyph = el('text', { 'text-anchor': 'middle', y: 4.5 }, badge);
      N[id] = { g, rect, title, sub, badge, glyph, cx, cy, w };
    }
    for (const [a, b] of EDGES) {
      const path = el('path', { d: route(a, b), class: 'st-edge' }, gE);
      // length measured lazily: getTotalLength() forces a layout
      E[`${a}>${b}`] = { path, _len: 0, get len() { return this._len || (this._len = this.path.getTotalLength()); } };
    }
    const mk = cls => { const g = el('g', { class: `st-pkt ${cls}` }, gP); el('circle', { r: 13, class: 'halo' }, g); el('circle', { r: 6 }, g); return g; };
    packets = { main: mk('sync'), dup: mk('fail'), comp: mk('comp'), out: mk('async') };
    // Kafka stream dots leaving the outbox
    packets.stream = [0, 1, 2, 3].map(() => el('circle', { r: 4, class: 'st-stream' }, gP));
    labelNodes();
  }

  function labelNodes() {
    for (const [id, n] of Object.entries(N)) {
      n.title.textContent = tx(NODE_TEXT[id][0]);
      n.sub.textContent = tx(NODE_TEXT[id][1]);
    }
  }

  /* ---------- timeline helpers ---------- */
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const seg = (P, a, b) => clamp((P - a) / (b - a));
  const ease = t => 1 - Math.pow(1 - t, 3);                      // decelerate
  const inOut = t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

  function showNode(id, t) {
    const n = N[id], e = ease(t);
    n.g.style.opacity = e;
    n.g.style.transform = `translateY(${(1 - e) * 14}px) scale(${0.94 + 0.06 * e})`;
  }
  function drawEdge(key, t) {
    const e = E[key];
    e.path.style.strokeDasharray = e.len;
    e.path.style.strokeDashoffset = e.len * (1 - ease(t));
    e.path.style.opacity = t > 0 ? 1 : 0;
  }
  function movePacket(p, key, t, reverse = false) {
    const e = E[key];
    if (t <= 0 || t >= 1 || !e) { p.style.opacity = 0; return; }
    const pt = e.path.getPointAtLength(e.len * (reverse ? 1 - inOut(t) : inOut(t)));
    p.style.opacity = 1;
    p.setAttribute('transform', `translate(${pt.x} ${pt.y})`);
  }
  function state(id, s) {
    const n = N[id];
    n.g.classList.toggle('ok', s === 'ok');
    n.g.classList.toggle('fail', s === 'fail');
    n.g.classList.toggle('comp', s === 'comp');
    n.g.classList.toggle('run', s === 'run');
    n.glyph.textContent = { ok: '✓', fail: '✕', comp: '↺', run: '…' }[s] || '';
  }

  /* ---------- the whole animation as a pure function of P ---------- */
  function render(P) {
    // ch0 — intake
    showNode('customer', seg(P, 0.00, 0.05));
    showNode('intake', seg(P, 0.03, 0.08));
    drawEdge('customer>intake', seg(P, 0.06, 0.12));
    let main = null;
    if (P < 0.19) main = ['customer>intake', seg(P, 0.11, 0.19)];

    // ch1 — idempotency
    showNode('redis', seg(P, 0.20, 0.24));
    drawEdge('intake>redis', seg(P, 0.22, 0.27));
    if (P >= 0.26 && P < 0.30) main = ['intake>redis', seg(P, 0.26, 0.30)];
    state('redis', P >= 0.30 ? 'ok' : '');
    // duplicate: customer -> intake -> redis, bounced back in red
    const d1 = seg(P, 0.31, 0.34), d2 = seg(P, 0.34, 0.36), d3 = seg(P, 0.36, 0.39);
    if (d1 > 0 && d1 < 1) movePacket(packets.dup, 'customer>intake', d1);
    else if (d2 > 0 && d2 < 1) movePacket(packets.dup, 'intake>redis', d2);
    else if (d3 > 0 && d3 < 1) movePacket(packets.dup, 'intake>redis', d3, true);
    else packets.dup.style.opacity = 0;
    N.redis.sub.textContent = P >= 0.36 && P < 0.42 ? '409 · duplicate' : P >= 0.30 ? 'SET NX ✓' : tx(NODE_TEXT.redis[1]);
    N.redis.g.classList.toggle('bounce', P >= 0.36 && P < 0.42);

    // ch2 — saga
    showNode('saga', seg(P, 0.40, 0.44));
    drawEdge('intake>saga', seg(P, 0.42, 0.46));
    if (P >= 0.45 && P < 0.48) main = ['intake>saga', seg(P, 0.45, 0.48)];
    ['verify', 'settle', 'issue'].forEach((id, i) => showNode(id, seg(P, 0.46 + i * 0.015, 0.50 + i * 0.015)));
    drawEdge('saga>verify', seg(P, 0.49, 0.51));
    drawEdge('saga>settle', seg(P, 0.52, 0.54));
    drawEdge('saga>issue', seg(P, 0.55, 0.57));
    if (P >= 0.50 && P < 0.53) main = ['saga>verify', seg(P, 0.50, 0.53)];
    if (P >= 0.53 && P < 0.56) main = ['saga>settle', seg(P, 0.53, 0.56)];
    if (P >= 0.56 && P < 0.59) main = ['saga>issue', seg(P, 0.56, 0.59)];

    // ch3 — compensation, then retry
    let comp = null;
    if (P >= 0.64 && P < 0.68) comp = ['saga>settle', seg(P, 0.64, 0.68)];
    if (P >= 0.68 && P < 0.72) comp = ['saga>verify', seg(P, 0.68, 0.72)];
    if (P >= 0.73 && P < 0.75) main = ['saga>verify', seg(P, 0.73, 0.75)];
    if (P >= 0.75 && P < 0.77) main = ['saga>settle', seg(P, 0.75, 0.77)];
    if (P >= 0.77 && P < 0.79) main = ['saga>issue', seg(P, 0.77, 0.79)];
    state('verify', P >= 0.74 ? 'ok' : P >= 0.70 ? 'comp' : P >= 0.53 ? 'ok' : '');
    state('settle', P >= 0.76 ? 'ok' : P >= 0.66 ? 'comp' : P >= 0.56 ? 'ok' : '');
    state('issue', P >= 0.79 ? 'ok' : P >= 0.60 ? 'fail' : P >= 0.58 ? 'run' : '');
    const sagaSub = P >= 0.79 ? ['committed', 'đã commit'] : P >= 0.72 ? ['retry · backoff', 'thử lại · backoff'] : P >= 0.62 ? ['compensating…', 'đang bù trừ…'] : P >= 0.47 ? ['running', 'đang chạy'] : ['', ''];
    N.saga.sub.textContent = tx(sagaSub);
    state('saga', P >= 0.79 ? 'ok' : P >= 0.62 && P < 0.72 ? 'comp' : '');
    if (N.issue && P >= 0.60 && P < 0.79) N.issue.sub.textContent = P < 0.72 ? 'timeout' : tx(['retrying', 'thử lại']);
    else if (N.issue) N.issue.sub.textContent = 'T24';

    // ch4 — outbox + Kafka
    showNode('outbox', seg(P, 0.80, 0.84));
    drawEdge('saga>outbox', seg(P, 0.82, 0.86));
    const o = seg(P, 0.86, 0.90);
    movePacket(packets.out, 'saga>outbox', o);
    state('outbox', P >= 0.90 ? 'ok' : '');
    const s = seg(P, 0.90, 1);
    packets.stream.forEach((c, i) => {
      const k = (s * 2.2 + i / 4) % 1;
      const n = N.outbox;
      c.style.opacity = s > 0 ? Math.sin(k * Math.PI) : 0;
      const narrow = layoutKey === 'tall';
      c.setAttribute('cx', narrow ? n.cx : n.cx + n.w / 2 + 8 + k * 150);
      c.setAttribute('cy', narrow ? n.cy + NODE_H / 2 + 6 + k * 40 : n.cy);
    });

    // packets
    if (main) movePacket(packets.main, main[0], main[1]); else packets.main.style.opacity = 0;
    if (comp) movePacket(packets.comp, comp[0], comp[1], true); else packets.comp.style.opacity = 0;

    // "exactly once" badge
    const b = ease(seg(P, 0.91, 0.97));
    const badge = $('#story-badge');
    badge.style.opacity = b;
    badge.style.transform = `translateY(${(1 - b) * 12}px) scale(${0.9 + 0.1 * b})`;

    renderCopy(P);
  }

  /* ---------- copy: chapters cross-fade, dots track progress ---------- */
  function renderCopyDom() {
    $('#story-copy').innerHTML = CHAPTERS.map((c, i) => `
      <article class="story-ch" data-i="${i}">
        <p class="story-eyebrow">${esc(tx(c.eyebrow))}</p>
        <h3 class="story-title">${esc(tx(c.title))}</h3>
        <p class="story-body">${esc(tx(c.body))}</p>
      </article>`).join('');
    $('#story-dots').innerHTML = CHAPTERS.map((c, i) => `<button type="button" data-i="${i}" aria-label="${esc(tx(c.eyebrow))}"></button>`).join('');
    $('#story-badge').innerHTML = `<span>✓</span> ${esc(L('exactly once', 'đúng một lần'))}`;
    $('#story-skip').textContent = L('Skip story ↓', 'Bỏ qua ↓');
    chEls = $$('.story-ch', section);
    dotEls = $$('#story-dots button');
    lastActive = -1;
    const head = $('#story-head');
    head.innerHTML = `
      <p class="section-eyebrow">${L('How it works', 'Cách nó hoạt động')}</p>
      <h2 class="section-title">${L('The life of a payment.', 'Hành trình của một khoản thanh toán.')}</h2>
      <p class="section-sub">${L('Scroll to follow one certificate-of-deposit order through the system. A simplified version of the real flow from my CV.',
                                  'Cuộn để theo một lệnh mua chứng chỉ tiền gửi đi qua hệ thống. Phiên bản rút gọn của luồng thật trong CV.')}</p>`;
  }

  let chEls = [], dotEls = [], lastActive = -1;
  function renderCopy(P) {
    const x = P * CHAPTERS.length;
    const active = Math.min(CHAPTERS.length - 1, Math.floor(x));
    chEls.forEach((ch, i) => {
      const local = x - i;                                         // 0..1 inside chapter i
      let o;
      if (REDUCED) o = i === active ? 1 : 0;
      else {
        const fadeIn = i === 0 ? 1 : clamp(local / 0.18);
        const fadeOut = i === CHAPTERS.length - 1 ? 1 : clamp((1 - local) / 0.18);
        o = local < 0 || local > 1 ? 0 : Math.min(fadeIn, fadeOut);
        if (i === 0 && local < 0) o = 1;
      }
      ch.style.opacity = o;
      ch.style.transform = REDUCED ? '' : `translateY(${(1 - o) * (local < 0.5 ? 24 : -24)}px)`;
      ch.style.pointerEvents = o > 0.5 ? 'auto' : 'none';
    });
    if (active !== lastActive) {                                   // only touch the DOM when the chapter changes
      lastActive = active;
      chEls.forEach((ch, i) => ch.setAttribute('aria-hidden', i !== active));
      dotEls.forEach((d, i) => d.classList.toggle('on', i === active));
    }
  }

  /* ---------- scroll → progress, 1:1, one render per frame ---------- */
  let shown = 0, scheduled = false;
  function progress() {
    const r = section.getBoundingClientRect();
    const span = r.height - window.innerHeight;
    return span > 0 ? clamp(-r.top / span) : 0;
  }
  function frame() {
    scheduled = false;
    const P = progress();
    if (Math.abs(P - shown) < 1e-4) return;                      // nothing moved: skip the work
    shown = P;
    render(P);
  }
  function kick() { if (!scheduled) { scheduled = true; requestAnimationFrame(frame); } }

  // escape hatch: never trap people inside a pinned section
  function skipStory() {
    const r = section.getBoundingClientRect();
    window.scrollTo({ top: window.scrollY + r.bottom - 64, behavior: REDUCED ? 'auto' : 'smooth' });
  }

  function scrollToChapter(i) {
    const r = section.getBoundingClientRect();
    const span = r.height - window.innerHeight;
    const y = window.scrollY + r.top + span * ((i + 0.5) / CHAPTERS.length);
    window.scrollTo({ top: y, behavior: REDUCED ? 'auto' : 'smooth' });
  }

  /* ---------- boot ---------- */
  renderCopyDom();
  build();
  // first measure + paint in a frame, where layout is due anyway (no forced reflow during boot)
  requestAnimationFrame(() => { shown = progress(); render(shown); });
  addEventListener('scroll', kick, { passive: true });
  addEventListener('resize', () => { build(); labelNodes(); shown = progress(); render(shown); });
  $('#story-skip').addEventListener('click', skipStory);
  $('#story-dots').addEventListener('click', e => { const b = e.target.closest('button[data-i]'); if (b) scrollToChapter(+b.dataset.i); });
  addEventListener('lqv:lang', () => { renderCopyDom(); labelNodes(); render(shown); });
})();
