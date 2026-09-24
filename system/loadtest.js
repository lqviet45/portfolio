/* ==============================================
   LQV/SYS — "load test me" (k6-style)
   Simulates ~1,000 requests against the career cluster: Kong's token-bucket
   rate limiter sheds the spike with 429s, services answer with a queueing
   latency model, chaos-killed services fail fast with 503 (circuit open).
   A sample of requests is animated through the real 2D/3D topology.
   Loaded after system.js; uses its request(), travel(), floatTag(), emit()...
   ============================================== */

'use strict';

const LT_STAGES = [
  { key: 'ramp-up',   dur: 2000, from: 15,  to: 120 },
  { key: 'steady',    dur: 3200, from: 120, to: 120 },
  { key: 'spike',     dur: 1300, from: 120, to: 280 },
  { key: 'ramp-down', dur: 1300, from: 280, to: 0 }
];
const LT_TOTAL_MS = LT_STAGES.reduce((s, x) => s + x.dur, 0);
const LT_BUCKETS = [5, 10, 25, 50, 100, 250, 500, 1000, Infinity];
const LT_BUCKET_LABELS = ['<5', '5–10', '10–25', '25–50', '50–100', '100–250', '250–500', '500–1k', '≥1k'];
const LT_EDGE_LABELS = ['0', '5', '10', '25', '50', '100', '250', '500', '1k'];
const LT_SVC_BASE = { identity: 11, career: 26, projects: 21, skills: 9 };
const LT_BUCKET_CAP = 60, LT_REFILL_PER_S = 125, LT_TIMEOUT = 1000;

let lt = null; // current run

const randn = () => { let u = 0, v = 0; while (!u) u = Math.random(); while (!v) v = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
const pct = (sorted, p) => (sorted.length ? sorted[Math.min(sorted.length - 1, Math.floor(p * sorted.length))] : 0);
const fmtMs = ms => (ms >= 1000 ? `${(ms / 1000).toFixed(2)}s` : `${Math.round(ms)}ms`);
const fmtN = n => n.toLocaleString('en-US');

function stageAt(t) {
  let acc = 0;
  for (const s of LT_STAGES) {
    if (t < acc + s.dur) return { stage: s, rate: s.from + (s.to - s.from) * ((t - acc) / s.dur) };
    acc += s.dur;
  }
  return { stage: LT_STAGES[LT_STAGES.length - 1], rate: 0 };
}

/* ---------- Simulation ---------- */
function simulateArrival(now) {
  // Kong token bucket
  lt.tokens = Math.min(LT_BUCKET_CAP, lt.tokens + ((now - lt.lastRefill) / 1000) * LT_REFILL_PER_S);
  lt.lastRefill = now;
  if (lt.tokens < 1) return { status: 429, lat: 2 + Math.random() * 4, svc: null };
  lt.tokens -= 1;

  const svc = pick(SERVICES);
  if (down.has(svc)) return { status: 503, lat: 1 + Math.random() * 2, svc };

  // queueing latency: base × lognormal noise × load factor, plus rare slow queries
  lt.active = lt.active.filter(a => a.end > now);
  const inflight = lt.active.reduce((n, a) => n + (a.svc === svc), 0);
  let lat = 3 + LT_SVC_BASE[svc] * Math.exp(0.45 * randn()) * (1 + (inflight / 7) ** 2);
  if (Math.random() < 0.012) lat *= 6 + Math.random() * 10;
  if (lat >= LT_TIMEOUT) return { status: 504, lat: LT_TIMEOUT, svc };
  lt.active.push({ svc, end: now + lat });
  return { status: 200, lat, svc };
}

function animateSample(r) {
  if (REDUCED) { bumpCount(); return; }
  if (r.status === 429) {
    travel('you', 'gw', 'sync').then(() => {
      const now = performance.now();
      if (now - lt.lastTag > 650) { floatTag('gw', '429 · rate limited'); lt.lastTag = now; }
      return travel('gw', 'you', 'fail');
    }).then(bumpCount);
  } else {
    request(r.svc); // bumps the counter itself; 503/504 paths are handled by request()
  }
}

function ltTick() {
  const now = performance.now();
  const t = now - lt.t0;
  const dt = now - lt.lastTick;
  lt.lastTick = now;
  const { stage, rate } = stageAt(t);
  lt.stage = t >= LT_TOTAL_MS ? null : stage.key;

  // arrivals this tick
  lt.carry += (rate * dt) / 1000;
  const n = Math.floor(lt.carry);
  lt.carry -= n;
  lt.visualTokens = Math.min(4, lt.visualTokens + (dt / 1000) * 16);
  for (let i = 0; i < n; i++) {
    const r = simulateArrival(now);
    lt.results.push(r);
    lt.window.push({ at: now, r });
    if (lt.visualTokens >= 1 && packets.length < 26) { lt.visualTokens -= 1; animateSample(r); }
    else bumpCount();
  }
  lt.window = lt.window.filter(w => now - w.at < 1000);
  lt.peakRps = Math.max(lt.peakRps, lt.window.length);

  if (now - lt.lastEvent > 700 && lt.results.length) {
    lt.lastEvent = now;
    const ok = lt.okSorted();
    emit('loadtest.tick', `{rps:${lt.window.length}, p95:"${fmtMs(pct(ok, 0.95))}", throttled:${lt.count(429)}}`, 'user');
  }
  if (now - lt.lastRender > 180) { lt.lastRender = now; renderLoadTest(); }

  if (t >= LT_TOTAL_MS + 400) finishLoadTest();
}

function runLoadTest() {
  openLoadTest();
  if (lt && lt.running) return;
  const now = performance.now();
  lt = {
    running: true, t0: now, lastTick: now, lastRefill: now, lastRender: 0, lastEvent: now, lastTag: 0,
    tokens: LT_BUCKET_CAP, carry: 0, visualTokens: 2, results: [], active: [], window: [], peakRps: 0, stage: 'ramp-up',
    count(code) { return this.results.reduce((n, r) => n + (r.status === code), 0); },
    okSorted() { return this.results.filter(r => r.status === 200).map(r => r.lat).sort((a, b) => a - b); }
  };
  emit('loadtest.started', '{vus:"ramping", target:"lqv.sys", stages:4}', 'user');
  bus('loadtest', { on: true });
  $('#load-btn').classList.add('on');
  renderLoadTest();
  lt.timer = setInterval(ltTick, 50);
}

function finishLoadTest() {
  clearInterval(lt.timer);
  lt.running = false;
  lt.stage = null;
  const ok = lt.okSorted();
  emit('loadtest.finished', `{reqs:${lt.results.length}, p99:"${fmtMs(pct(ok, 0.99))}", throttled:${lt.count(429)}, circuit_open:${lt.count(503)}}`, 'user');
  bus('loadtest', { on: false });
  $('#load-btn').classList.remove('on');
  renderLoadTest();
}

/* ---------- Report ---------- */
function openLoadTest() {
  $('#lt').hidden = false;
  if (!lt) renderLoadTest();
  requestAnimationFrame(() => $('#lt-close')?.focus());
}
function closeLoadTest() {
  $('#lt').hidden = true;
  $('#load-btn').focus();
}

function histogram(ok, W = 640) {
  const counts = LT_BUCKETS.map(() => 0);
  ok.forEach(v => { counts[LT_BUCKETS.findIndex(b => v < b)]++; });
  const max = Math.max(1, ...counts);
  const niceMax = (() => { const m = Math.pow(10, Math.floor(Math.log10(max))); return Math.ceil(max / m) * m; })();
  const H = 210, padL = 40, padR = 8, padT = 24, padB = 24;
  const band = (W - padL - padR) / LT_BUCKETS.length;
  const bw = Math.min(24, band - 2);
  const y = v => padT + (H - padT - padB) * (1 - v / niceMax);
  const total = ok.length || 1;

  // rounded data-end (4px), square at the baseline
  const barPath = (x, top, w, base) => {
    const h = base - top;
    if (h <= 0) return '';
    const r = Math.min(4, h, w / 2);
    return `M${x} ${base} V${top + r} Q${x} ${top} ${x + r} ${top} H${x + w - r} Q${x + w} ${top} ${x + w} ${top + r} V${base} Z`;
  };
  const markerX = v => {
    const i = LT_BUCKETS.findIndex(b => v < b);
    const lo = i ? LT_BUCKETS[i - 1] : 0, hi = LT_BUCKETS[i];
    const f = isFinite(hi) ? (v - lo) / (hi - lo) : 0.5;
    return padL + band * (i + f);
  };

  const grid = [0, niceMax / 2, niceMax].map(v => `
    <line x1="${padL}" x2="${W - padR}" y1="${y(v)}" y2="${y(v)}" class="lt-grid"/>
    <text x="${padL - 6}" y="${y(v) + 3.5}" class="lt-tick" text-anchor="end">${fmtN(v)}</text>`).join('');
  const bars = counts.map((c, i) => {
    const x = padL + band * i + (band - bw) / 2;
    const share = Math.round((c / total) * 100);
    const label = `${LT_BUCKET_LABELS[i]} ms: ${fmtN(c)} ${L('requests', 'request')} (${share}%)`;
    return `<g class="lt-bar" role="img" tabindex="0" data-tip="${esc(fmtN(c))}|${esc(`${LT_BUCKET_LABELS[i]} ms · ${share}%`)}" aria-label="${esc(label)}">
        <rect x="${padL + band * i}" y="${padT}" width="${band}" height="${H - padT - padB}" class="lt-hit"/>
        <path d="${barPath(x, y(c), bw, y(0))}" class="lt-fill"/>
      </g>`;
  }).join('');
  // bin-edge ticks (ranges live in the tooltip and the table)
  const edges = LT_EDGE_LABELS.map((t, i) => `
    <line x1="${padL + band * i}" x2="${padL + band * i}" y1="${y(0)}" y2="${y(0) + 4}" class="lt-axis"/>
    <text x="${padL + band * i}" y="${H - 6}" class="lt-tick" text-anchor="middle">${t}</text>`).join('');
  const markers = ok.length ? [['p95', pct(ok, 0.95)], ['p99', pct(ok, 0.99)]].map(([k, v], j) => {
    const x = markerX(v);
    const flip = x > W - 90;   // keep the label inside the plot on the right edge
    return `<line x1="${x}" x2="${x}" y1="${padT - 6 + j * 12}" y2="${y(0)}" class="lt-marker"/>
      <text x="${flip ? x - 4 : x + 4}" y="${padT - 10 + j * 12}" class="lt-marker-label" text-anchor="${flip ? 'end' : 'start'}">${k} ${fmtMs(v)}</text>`;
  }).join('') : '';

  return {
    counts,
    svg: `<svg viewBox="0 0 ${W} ${H}" class="lt-hist" role="group" aria-label="${esc(L('Latency distribution of successful requests', 'Phân bố độ trễ của các request thành công'))}">
      ${grid}${bars}${edges}${markers}
      <line x1="${padL}" x2="${W - padR}" y1="${y(0)}" y2="${y(0)}" class="lt-axis"/>
    </svg>`
  };
}

function renderLoadTest() {
  const card = $('#lt-card');
  const tableOpen = card.querySelector('.lt-table')?.open;
  const keepFocus = card.contains(document.activeElement) ? document.activeElement.id : null;
  const r = lt ? lt.results : [];
  const ok = lt ? lt.okSorted() : [];
  const total = r.length;
  const c = code => (lt ? lt.count(code) : 0);
  const elapsed = lt ? Math.min(1, (performance.now() - lt.t0) / LT_TOTAL_MS) : 0;
  const pctOf = n => (total ? `${((n / total) * 100).toFixed(1)}%` : '—');
  const plotW = Math.max(320, Math.min(640, (card.clientWidth || 680) - 44));
  const { counts, svg } = histogram(ok, plotW);
  const running = lt?.running;
  const done = lt && !lt.running;
  const avg = ok.length ? ok.reduce((a, b) => a + b, 0) / ok.length : 0;
  const stageName = { 'ramp-up': L('ramp-up', 'tăng tải'), steady: L('steady', 'ổn định'), spike: L('spike', 'đột biến'), 'ramp-down': L('ramp-down', 'giảm tải') };

  const statuses = [
    ['ok', '✓', '2xx', L('served', 'thành công'), c(200)],
    ['warn', '↩', '429', L('rate-limited at Kong', 'bị Kong rate-limit'), c(429)],
    ['err', '✕', '503', L('circuit open (fail fast)', 'circuit mở (fail fast)'), c(503)],
    ['err', '⌛', '504', L('timeout', 'timeout'), c(504)]
  ];

  let verdict = '';
  if (done) {
    const parts = [];
    parts.push(L(`Peak arrival rate hit <b>${lt.peakRps} req/s</b>; Kong's token bucket (${LT_REFILL_PER_S}/s) shed <b>${fmtN(c(429))}</b> requests at the edge instead of letting them pile onto the services.`,
                 `Tốc độ request đỉnh đạt <b>${lt.peakRps} req/s</b>; token bucket của Kong (${LT_REFILL_PER_S}/s) chặn <b>${fmtN(c(429))}</b> request ngay ở cổng thay vì để chúng dồn vào service.`));
    parts.push(L(`Upstream p99 stayed at <b>${fmtMs(pct(ok, 0.99))}</b>.`, `p99 phía upstream giữ ở mức <b>${fmtMs(pct(ok, 0.99))}</b>.`));
    if (c(503)) parts.push(L(`Circuit breakers failed <b>${fmtN(c(503))}</b> calls fast on chaos-killed services — no cascading timeouts.`,
                             `Circuit breaker trả lỗi nhanh <b>${fmtN(c(503))}</b> lượt gọi tới service bị chaos hạ — không có timeout dây chuyền.`));
    else parts.push(L('Tip: turn on chaos monkey and run it again to watch the circuit breakers.', 'Mẹo: bật chaos monkey rồi chạy lại để xem circuit breaker hoạt động.'));
    verdict = `<p class="lt-verdict">${parts.join(' ')}</p>`;
  }

  card.innerHTML = `
    <div class="saga-head">
      <div>
        <div class="insp-kind">k6 run · lqv.sys</div>
        <div class="saga-title" id="lt-title">${L('Load test', 'Load test')}</div>
      </div>
      <button class="insp-close" id="lt-close" aria-label="${esc(L('Close', 'Đóng'))}">×</button>
    </div>

    <div class="lt-stages">
      ${LT_STAGES.map(s => `<span class="lt-stage${lt?.stage === s.key ? ' on' : ''}">${stageName[s.key]}</span>`).join('')}
      <span class="lt-state">${running ? L('running…', 'đang chạy…') : done ? L('finished', 'hoàn tất') : L('ready', 'sẵn sàng')}</span>
    </div>
    <div class="lt-meter" role="progressbar" aria-label="${esc(L('Test progress', 'Tiến độ bài test'))}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(elapsed * 100)}"><span style="width:${elapsed * 100}%"></span></div>

    <dl class="lt-tiles">
      <div><dt>${L('Requests', 'Request')}</dt><dd>${fmtN(total)}</dd></div>
      <div><dt>${L('Peak rate', 'Tốc độ đỉnh')}</dt><dd>${lt ? lt.peakRps : 0}<small> req/s</small></dd></div>
      <div><dt>p50</dt><dd>${fmtMs(pct(ok, 0.5))}</dd></div>
      <div><dt>p95</dt><dd>${fmtMs(pct(ok, 0.95))}</dd></div>
      <div><dt>p99</dt><dd>${fmtMs(pct(ok, 0.99))}</dd></div>
    </dl>

    <ul class="lt-status">
      ${statuses.map(([tone, icon, code, label, n]) => `
        <li><span class="lt-key ${tone}" aria-hidden="true"></span><span class="lt-icon" aria-hidden="true">${icon}</span>
          <span class="lt-code">${code}</span><span class="lt-label">${label}</span>
          <b class="lt-n">${fmtN(n)}</b><span class="lt-pct">${pctOf(n)}</span></li>`).join('')}
    </ul>

    <div class="lt-chart">
      <div class="lt-chart-title">${L('Latency of successful requests', 'Độ trễ của các request thành công')} <span class="muted">· ms · ${L('count per bucket', 'số request mỗi khoảng')}</span></div>
      <div class="lt-plot">${svg}<div class="lt-tip" id="lt-tip" hidden></div></div>
      <details class="lt-table">
        <summary>${L('view as table', 'xem dạng bảng')}</summary>
        <table class="sql">
          <tr><th>${L('latency (ms)', 'độ trễ (ms)')}</th><th>${L('requests', 'request')}</th><th>%</th></tr>
          ${counts.map((n, i) => `<tr><td>${LT_BUCKET_LABELS[i]}</td><td>${fmtN(n)}</td><td>${ok.length ? ((n / ok.length) * 100).toFixed(1) : '0.0'}</td></tr>`).join('')}
        </table>
      </details>
    </div>

    ${done ? `<pre class="lt-summary">http_reqs..........: ${fmtN(total)}  ${(total / (LT_TOTAL_MS / 1000)).toFixed(1)}/s
http_req_duration..: avg=${fmtMs(avg)} p(50)=${fmtMs(pct(ok, 0.5))} p(95)=${fmtMs(pct(ok, 0.95))} p(99)=${fmtMs(pct(ok, 0.99))} max=${fmtMs(ok[ok.length - 1] || 0)}
http_req_failed....: ${pctOf(total - c(200))}  (429: ${c(429)} · 503: ${c(503)} · 504: ${c(504)})</pre>${verdict}` : ''}

    <div class="actions lt-actions">
      <button class="btn primary" id="lt-run" ${running ? 'disabled' : ''}>${running ? L('running…', 'đang chạy…') : done ? L('run again', 'chạy lại') : L('start load test', 'bắt đầu load test')}</button>
      <button class="btn ghost" id="lt-chaos">${chaosOn ? L('chaos monkey: ON', 'chaos monkey: BẬT') : L('add chaos monkey', 'thêm chaos monkey')}</button>
    </div>`;

  if (tableOpen) $('.lt-table', card).open = true;
  $('#lt-close').addEventListener('click', closeLoadTest);
  $('#lt-run').addEventListener('click', () => runLoadTest());
  $('#lt-chaos').addEventListener('click', () => { toggleChaos(); renderLoadTest(); });
  if (keepFocus && $(`#${keepFocus}`)) $(`#${keepFocus}`).focus({ preventScroll: true });

  // per-bar tooltip (hover + keyboard focus); values also live in the table view
  const tip = $('#lt-tip');
  const plot = $('.lt-plot', card);
  const show = (g, clientX, clientY) => {
    const [val, label] = g.dataset.tip.split('|');
    tip.replaceChildren();
    const b = document.createElement('b'); b.textContent = val;
    const s = document.createElement('span'); s.textContent = label;
    tip.append(b, s);
    tip.hidden = false;
    const pr = plot.getBoundingClientRect();
    const gr = g.getBoundingClientRect();
    const x = clientX != null ? clientX - pr.left : gr.left - pr.left + gr.width / 2;
    const y = clientY != null ? clientY - pr.top : gr.top - pr.top + 20;
    tip.style.left = `${Math.min(pr.width - 110, Math.max(0, x + 10))}px`;
    tip.style.top = `${Math.max(0, y - 44)}px`;
    g.classList.add('hover');
  };
  const hide = g => { tip.hidden = true; g.classList.remove('hover'); };
  $$('.lt-bar', card).forEach(g => {
    g.addEventListener('pointermove', e => show(g, e.clientX, e.clientY));
    g.addEventListener('pointerleave', () => hide(g));
    g.addEventListener('focus', () => show(g));
    g.addEventListener('blur', () => hide(g));
  });
}

/* ---------- Wiring ---------- */
$('#load-btn').addEventListener('click', () => (lt?.running ? openLoadTest() : runLoadTest()));
$('#lt').addEventListener('click', e => { if (e.target.id === 'lt') closeLoadTest(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && !$('#lt').hidden) closeLoadTest(); });
addEventListener('lqv:lang', () => { if (!$('#lt').hidden || lt) renderLoadTest(); });
addEventListener('lqv:chaos', () => { if (!$('#lt').hidden && !lt?.running) renderLoadTest(); });
